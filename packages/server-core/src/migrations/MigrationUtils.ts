/**
 * 数据迁移脚本工具
 *
 * 提供从 MongoDB 迁移到 PostgreSQL 的工具函数。
 *
 * @module @yunshu/server-core/migrations/MigrationUtils
 */

import type { Pool } from 'pg';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 表定义
 */
export interface TableDefinition {
  /** 表名 */
  name: string;
  /** 字段定义 */
  columns: ColumnDefinition[];
  /** 主键 */
  primaryKey?: string;
  /** 索引 */
  indexes?: IndexDefinition[];
  /** 外键约束 */
  foreignKeys?: ForeignKeyDefinition[];
}

/**
 * 字段定义
 */
export interface ColumnDefinition {
  /** 字段名 */
  name: string;
  /** 数据类型 */
  type: string;
  /** 是否可为空 */
  nullable?: boolean;
  /** 默认值 */
  default?: string;
  /** 是否为主键 */
  primaryKey?: boolean;
  /** 唯一约束 */
  unique?: boolean;
  /** 检查约束 */
  check?: string;
  /** 注释 */
  comment?: string;
}

/**
 * 索引定义
 */
export interface IndexDefinition {
  /** 索引名 */
  name: string;
  /** 索引字段 */
  columns: string[];
  /** 索引类型 */
  type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
  /** 是否唯一 */
  unique?: boolean;
}

/**
 * 外键定义
 */
export interface ForeignKeyDefinition {
  /** 约束名 */
  name: string;
  /** 外键字段 */
  column: string;
  /** 引用表 */
  references: string;
  /** 引用字段 */
  referencesColumn: string;
  /** 删除时动作 */
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  /** 更新时动作 */
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

/**
 * 迁移结果
 */
export interface MigrationResult {
  /** 是否成功 */
  success: boolean;
  /** 影响的行数 */
  affectedRows?: number;
  /** 错误信息 */
  error?: string;
}

// ============================================================================
// 迁移工具类
// ============================================================================

/**
 * 数据迁移工具
 */
export class MigrationUtils {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * 创建表
   */
  async createTable(table: TableDefinition): Promise<MigrationResult> {
    try {
      const columns = table.columns.map((col) => {
        let sql = `"${col.name}" ${col.type}`;

        if (!col.nullable) {
          sql += ' NOT NULL';
        }

        if (col.default) {
          sql += ` DEFAULT ${col.default}`;
        }

        if (col.unique) {
          sql += ' UNIQUE';
        }

        if (col.check) {
          sql += ` CHECK (${col.check})`;
        }

        return sql;
      });

      // 添加主键
      if (table.primaryKey) {
        columns.push(`PRIMARY KEY ("${table.primaryKey}")`);
      }

      const sql = `CREATE TABLE IF NOT EXISTS "${table.name}" (\n  ${columns.join(',\n  ')}\n)`;

      await this.pool.query(sql);

      // 添加注释
      if (table.columns.some((c) => c.comment)) {
        for (const col of table.columns) {
          if (col.comment) {
            await this.pool.query(`COMMENT ON COLUMN "${table.name}"."${col.name}" IS $1`, [
              col.comment,
            ]);
          }
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建表失败',
      };
    }
  }

  /**
   * 删除表
   */
  async dropTable(tableName: string, cascade = false): Promise<MigrationResult> {
    try {
      const sql = `DROP TABLE IF EXISTS "${tableName}"${cascade ? ' CASCADE' : ''}`;
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除表失败',
      };
    }
  }

  /**
   * 创建索引
   */
  async createIndex(index: IndexDefinition, tableName: string): Promise<MigrationResult> {
    try {
      const columns = index.columns.map((c) => `"${c}"`).join(', ');
      const unique = index.unique ? 'UNIQUE ' : '';
      const using = index.type ? `USING ${index.type}` : '';

      const sql = `
        CREATE ${unique}INDEX IF NOT EXISTS "${index.name}"
        ON "${tableName}" ${using} (${columns})
      `.trim();

      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建索引失败',
      };
    }
  }

  /**
   * 创建外键
   */
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
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建外键失败',
      };
    }
  }

  /**
   * 添加字段
   */
  async addColumn(tableName: string, column: ColumnDefinition): Promise<MigrationResult> {
    try {
      let sql = `ALTER TABLE "${tableName}" ADD COLUMN "${column.name}" ${column.type}`;

      if (!column.nullable) {
        sql += ' NOT NULL';
      }

      if (column.default) {
        sql += ` DEFAULT ${column.default}`;
      }

      await this.pool.query(sql);

      if (column.comment) {
        await this.pool.query(`COMMENT ON COLUMN "${tableName}"."${column.name}" IS $1`, [
          column.comment,
        ]);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '添加字段失败',
      };
    }
  }

  /**
   * 删除字段
   */
  async dropColumn(tableName: string, columnName: string): Promise<MigrationResult> {
    try {
      const sql = `ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "${columnName}"`;
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除字段失败',
      };
    }
  }

  /**
   * 重命名字段
   */
  async renameColumn(
    tableName: string,
    oldName: string,
    newName: string,
  ): Promise<MigrationResult> {
    try {
      const sql = `ALTER TABLE "${tableName}" RENAME COLUMN "${oldName}" TO "${newName}"`;
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '重命名字段失败',
      };
    }
  }

  /**
   * 修改字段类型
   */
  async alterColumnType(
    tableName: string,
    columnName: string,
    newType: string,
  ): Promise<MigrationResult> {
    try {
      const sql = `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE ${newType}`;
      await this.pool.query(sql);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '修改字段类型失败',
      };
    }
  }

  /**
   * 检查表是否存在
   */
  async tableExists(tableName: string): Promise<boolean> {
    const sql = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      )
    `;
    const result = await this.pool.query(sql, [tableName]);
    return result.rows[0]?.exists ?? false;
  }

  /**
   * 获取表结构
   */
  async getTableSchema(tableName: string): Promise<ColumnDefinition[]> {
    const sql = `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = $1
      ORDER BY ordinal_position
    `;

    const result = await this.pool.query(sql, [tableName]);

    return result.rows.map((row) => ({
      name: row.column_name,
      type: this.mapPostgresType(row),
      nullable: row.is_nullable === 'YES',
      default: row.column_default,
    }));
  }

  /**
   * 映射 PostgreSQL 类型
   */
  private mapPostgresType(row: Record<string, unknown>): string {
    const type = row.data_type as string;
    const maxLength = row.character_maximum_length;
    const precision = row.numeric_precision;
    const scale = row.numeric_scale;

    switch (type) {
      case 'character varying':
        return maxLength ? `VARCHAR(${maxLength})` : 'TEXT';
      case 'character':
        return maxLength ? `CHAR(${maxLength})` : 'CHAR';
      case 'numeric':
        return precision
          ? scale
            ? `DECIMAL(${precision},${scale})`
            : `NUMERIC(${precision})`
          : 'DECIMAL';
      default:
        return type.toUpperCase();
    }
  }

  /**
   * 执行批量迁移
   */
  async migrateBatch(
    tables: TableDefinition[],
    options: {
      dropExisting?: boolean;
      createIndexes?: boolean;
      createForeignKeys?: boolean;
    } = {},
  ): Promise<Map<string, MigrationResult>> {
    const results = new Map<string, MigrationResult>();

    for (const table of tables) {
      // 删除已存在的表
      if (options.dropExisting && (await this.tableExists(table.name))) {
        const dropResult = await this.dropTable(table.name, true);
        results.set(`${table.name}:drop`, dropResult);
        if (!dropResult.success) {
          continue;
        }
      }

      // 创建表
      const createResult = await this.createTable(table);
      results.set(`${table.name}:create`, createResult);

      if (!createResult.success) {
        continue;
      }

      // 创建索引
      if (options.createIndexes && table.indexes) {
        for (const index of table.indexes) {
          const indexResult = await this.createIndex(index, table.name);
          results.set(`${table.name}:index:${index.name}`, indexResult);
        }
      }

      // 创建外键
      if (options.createForeignKeys && table.foreignKeys) {
        for (const fk of table.foreignKeys) {
          const fkResult = await this.createForeignKey(table.name, fk);
          results.set(`${table.name}:fk:${fk.name}`, fkResult);
        }
      }
    }

    return results;
  }
}

// ============================================================================
// 常用表定义模板
// ============================================================================

/**
 * 通用审计字段（创建时间、更新时间、软删除）
 */
export const AUDIT_COLUMNS: ColumnDefinition[] = [
  {
    name: 'id',
    type: 'UUID',
    primaryKey: true,
    default: 'gen_random_uuid()',
    comment: '主键 ID',
  },
  {
    name: 'created_at',
    type: 'TIMESTAMP WITH TIME ZONE',
    nullable: false,
    default: 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  },
  {
    name: 'updated_at',
    type: 'TIMESTAMP WITH TIME ZONE',
    nullable: false,
    default: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  },
  {
    name: 'deleted_at',
    type: 'TIMESTAMP WITH TIME ZONE',
    nullable: true,
    comment: '软删除时间',
  },
  {
    name: 'created_by',
    type: 'UUID',
    nullable: true,
    comment: '创建人 ID',
  },
  {
    name: 'updated_by',
    type: 'UUID',
    nullable: true,
    comment: '更新人 ID',
  },
];

/**
 * 通用审计索引
 */
export const AUDIT_INDEXES: IndexDefinition[] = [
  {
    name: 'idx_created_at',
    columns: ['created_at'],
  },
  {
    name: 'idx_updated_at',
    columns: ['updated_at'],
  },
  {
    name: 'idx_deleted_at',
    columns: ['deleted_at'],
  },
];

/**
 * 创建带审计字段的表定义
 */
export function createAuditableTable(
  name: string,
  columns: ColumnDefinition[],
  options: {
    indexes?: IndexDefinition[];
    foreignKeys?: ForeignKeyDefinition[];
  } = {},
): TableDefinition {
  return {
    name,
    columns: [...AUDIT_COLUMNS, ...columns],
    primaryKey: 'id',
    indexes: [...AUDIT_INDEXES, ...(options.indexes || [])],
    foreignKeys: options.foreignKeys,
  };
}
