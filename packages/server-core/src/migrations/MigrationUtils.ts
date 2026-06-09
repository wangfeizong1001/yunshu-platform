/**
 * 数据迁移工具
 *
 * @module @yunshu/server-core/migrations/MigrationUtils
 */

import type { Pool } from 'pg';

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  primaryKey?: string;
  indexes?: IndexDefinition[];
  foreignKeys?: ForeignKeyDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable?: boolean;
  default?: string;
  primaryKey?: boolean;
  unique?: boolean;
  check?: string;
  comment?: string;
}

export interface IndexDefinition {
  name: string;
  columns: string[];
  type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
  unique?: boolean;
}

export interface ForeignKeyDefinition {
  name: string;
  column: string;
  references: string;
  referencesColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export interface MigrationResult {
  success: boolean;
  affectedRows?: number;
  error?: string;
}

export class MigrationUtils {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createTable(table: TableDefinition): Promise<MigrationResult> {
    try {
      const columns = table.columns.map((col) => {
        let sql = `"${col.name}" ${col.type}`;
        if (!col.nullable) sql += ' NOT NULL';
        if (col.default) sql += ` DEFAULT ${col.default}`;
        if (col.unique) sql += ' UNIQUE';
        if (col.check) sql += ` CHECK (${col.check})`;
        return sql;
      });

      if (table.primaryKey) {
        columns.push(`PRIMARY KEY ("${table.primaryKey}")`);
      }

      const sql = `CREATE TABLE IF NOT EXISTS "${table.name}" (\n  ${columns.join(',\n  ')}\n)`;
      await this.pool.query(sql);

      for (const col of table.columns) {
        if (col.comment) {
          await this.pool.query(`COMMENT ON COLUMN "${table.name}"."${col.name}" IS $1`, [col.comment]);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '创建表失败' };
    }
  }

  async dropTable(tableName: string, cascade = false): Promise<MigrationResult> {
    try {
      await this.pool.query(`DROP TABLE IF EXISTS "${tableName}"${cascade ? ' CASCADE' : ''}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除表失败' };
    }
  }

  async createIndex(index: IndexDefinition, tableName: string): Promise<MigrationResult> {
    try {
      const columns = index.columns.map((c) => `"${c}"`).join(', ');
      const unique = index.unique ? 'UNIQUE ' : '';
      const using = index.type ? `USING ${index.type}` : '';
      const sql = `CREATE ${unique}INDEX IF NOT EXISTS "${index.name}" ON "${tableName}" ${using} (${columns})`.trim();
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '创建索引失败' };
    }
  }

  async createForeignKey(tableName: string, fk: ForeignKeyDefinition): Promise<MigrationResult> {
    try {
      const sql = `
        ALTER TABLE "${tableName}"
        ADD CONSTRAINT "${fk.name}"
        FOREIGN KEY ("${fk.column}")
        REFERENCES "${fk.references}"("${fk.referencesColumn}")
        ${fk.onDelete ? `ON DELETE ${fk.onDelete}` : ''}
        ${fk.onUpdate ? `ON UPDATE ${fk.onUpdate}` : ''}
      `.trim();
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '创建外键失败' };
    }
  }

  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`,
      [tableName]
    );
    return result.rows[0]?.exists ?? false;
  }

  async migrateBatch(
    tables: TableDefinition[],
    options: { dropExisting?: boolean; createIndexes?: boolean; createForeignKeys?: boolean } = {},
  ): Promise<Map<string, MigrationResult>> {
    const results = new Map<string, MigrationResult>();

    for (const table of tables) {
      if (options.dropExisting && await this.tableExists(table.name)) {
        const dropResult = await this.dropTable(table.name, true);
        results.set(`${table.name}:drop`, dropResult);
        if (!dropResult.success) continue;
      }

      const createResult = await this.createTable(table);
      results.set(`${table.name}:create`, createResult);

      if (options.createIndexes && table.indexes) {
        for (const index of table.indexes) {
          results.set(`${table.name}:index:${index.name}`, await this.createIndex(index, table.name));
        }
      }

      if (options.createForeignKeys && table.foreignKeys) {
        for (const fk of table.foreignKeys) {
          results.set(`${table.name}:fk:${fk.name}`, await this.createForeignKey(table.name, fk));
        }
      }
    }

    return results;
  }
}

/** 通用审计字段 */
export const AUDIT_COLUMNS: ColumnDefinition[] = [
  { name: 'id', type: 'UUID', primaryKey: true, default: 'gen_random_uuid()', comment: '主键 ID' },
  { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, default: 'CURRENT_TIMESTAMP', comment: '创建时间' },
  { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, default: 'CURRENT_TIMESTAMP', comment: '更新时间' },
  { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, comment: '软删除时间' },
  { name: 'created_by', type: 'UUID', nullable: true, comment: '创建人 ID' },
  { name: 'updated_by', type: 'UUID', nullable: true, comment: '更新人 ID' },
];

/** 通用审计索引 */
export const AUDIT_INDEXES: IndexDefinition[] = [
  { name: 'idx_created_at', columns: ['created_at'] },
  { name: 'idx_updated_at', columns: ['updated_at'] },
  { name: 'idx_deleted_at', columns: ['deleted_at'] },
];

/** 创建带审计字段的表定义 */
export function createAuditableTable(
  name: string,
  columns: ColumnDefinition[],
  options: { indexes?: IndexDefinition[]; foreignKeys?: ForeignKeyDefinition[] } = {},
): TableDefinition {
  return {
    name,
    columns: [...AUDIT_COLUMNS, ...columns],
    primaryKey: 'id',
    indexes: [...AUDIT_INDEXES, ...(options.indexes || [])],
    foreignKeys: options.foreignKeys,
  };
}
