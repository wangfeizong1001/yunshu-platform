/**
 * MigrationUtils 数据迁移工具单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MigrationUtils, createAuditableTable } from '../MigrationUtils';

let executedQueries: Array<{ text: string; params: unknown[] }> = [];
let tableExistsStore: Record<string, boolean> = {};

function buildPool() {
  return {
    query: vi.fn(async (text: string, params?: unknown[]) => {
      executedQueries.push({ text, params: params ?? [] });
      const upper = text.trim().toUpperCase();

      // 检测表是否存在
      if (upper.includes('INFORMATION_SCHEMA.TABLES')) {
        const lastParam = (params ?? [])[params!.length - 1];
        const exists = !!lastParam && tableExistsStore[String(lastParam)];
        return { rows: [{ exists }], rowCount: 1 };
      }

      // 获取列信息
      if (upper.includes('INFORMATION_SCHEMA.COLUMNS')) {
        return {
          rows: [
            { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', character_maximum_length: null },
            { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', character_maximum_length: 255 },
            { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'NO' },
          ],
          rowCount: 3,
        };
      }

      return { rows: [], rowCount: 0 };
    }),
  } as any;
}

describe('MigrationUtils', () => {
  let pool: ReturnType<typeof buildPool>;
  let utils: MigrationUtils;

  beforeEach(() => {
    executedQueries = [];
    tableExistsStore = {};
    pool = buildPool();
    utils = new MigrationUtils(pool);
  });

  it('createTable 应生成 CREATE TABLE SQL', async () => {
    const result = await utils.createTable({
      name: 'users',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'name', type: 'VARCHAR(255)', nullable: false },
      ],
      primaryKey: 'id',
    });
    expect(result.success).toBe(true);
    const createQuery = executedQueries.find((q) => q.text.toUpperCase().startsWith('CREATE TABLE'));
    expect(createQuery).toBeDefined();
    expect(createQuery!.text).toContain('"users"');
    expect(createQuery!.text).toContain('"id"');
    expect(createQuery!.text).toContain('"name"');
  });

  it('dropTable 应生成 DROP TABLE SQL', async () => {
    const result = await utils.dropTable('users');
    expect(result.success).toBe(true);
    const drop = executedQueries.find((q) => q.text.toUpperCase().startsWith('DROP TABLE'));
    expect(drop).toBeDefined();
  });

  it('createIndex 应生成 CREATE INDEX SQL', async () => {
    const result = await utils.createIndex(
      { name: 'idx_users_name', columns: ['name'] },
      'users',
    );
    expect(result.success).toBe(true);
    const found = executedQueries.find((q) => q.text.toUpperCase().startsWith('CREATE'));
    expect(found!.text).toContain('INDEX');
    expect(found!.text).toContain('"idx_users_name"');
  });

  it('createForeignKey 应生成 ALTER TABLE ... ADD CONSTRAINT', async () => {
    const result = await utils.createForeignKey('orders', {
      name: 'fk_orders_user',
      column: 'user_id',
      references: 'users',
      referencesColumn: 'id',
      onDelete: 'CASCADE',
    });
    expect(result.success).toBe(true);
    const alter = executedQueries.find((q) => q.text.toUpperCase().startsWith('ALTER TABLE'));
    expect(alter).toBeDefined();
    expect(alter!.text).toContain('FOREIGN KEY');
  });

  it('addColumn 应生成 ALTER TABLE ... ADD COLUMN', async () => {
    const result = await utils.addColumn('users', { name: 'email', type: 'VARCHAR(255)', nullable: true });
    expect(result.success).toBe(true);
    const addColumn = executedQueries.find((q) => q.text.toUpperCase().includes('ADD COLUMN'));
    expect(addColumn).toBeDefined();
  });

  it('alterColumnType 应生成 ALTER COLUMN ... TYPE', async () => {
    const result = await utils.alterColumnType('users', 'name', 'TEXT');
    expect(result.success).toBe(true);
    const found = executedQueries.find((q) => q.text.toUpperCase().includes('ALTER COLUMN'));
    expect(found).toBeDefined();
    expect(found!.text).toContain('TYPE');
  });

  it('dropColumn 应生成 DROP COLUMN SQL', async () => {
    const result = await utils.dropColumn('users', 'name');
    expect(result.success).toBe(true);
    const drop = executedQueries.find((q) => q.text.toUpperCase().includes('DROP COLUMN'));
    expect(drop).toBeDefined();
  });

  it('tableExists 应返回布尔值', async () => {
    tableExistsStore['users'] = true;
    const yes = await utils.tableExists('users');
    expect(yes).toBe(true);
    const no = await utils.tableExists('orders');
    expect(no).toBe(false);
  });

  it('getTableSchema 应返回字段定义', async () => {
    const schema = await utils.getTableSchema('users');
    expect(Array.isArray(schema)).toBe(true);
    expect(schema.length).toBeGreaterThan(0);
  });

  it('migrateBatch 应依次执行多表创建', async () => {
    const results = await utils.migrateBatch([
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true, nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
        ],
        primaryKey: 'id',
        indexes: [{ name: 'idx_name', columns: ['name'] }],
      },
      {
        name: 'posts',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true, nullable: false },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
        ],
        primaryKey: 'id',
        indexes: [],
      },
    ], { createIndexes: true });

    expect(results.get('users:create')).toBeDefined();
    expect(results.get('posts:create')).toBeDefined();
    expect(results.get('users:index:idx_name')!.success).toBe(true);
  });

  it('createAuditableTable 应包含审计字段', () => {
    const def = createAuditableTable('orders', [
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
    ]);
    expect(def.name).toBe('orders');
    expect(def.columns.some((c) => c.name === 'created_at')).toBe(true);
    expect(def.columns.some((c) => c.name === 'updated_at')).toBe(true);
    expect(def.columns.some((c) => c.name === 'deleted_at')).toBe(true);
    expect(def.columns.some((c) => c.name === 'created_by')).toBe(true);
  });
});
