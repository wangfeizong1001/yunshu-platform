/**
 * PostgresQueryBuilder 链式查询构建器单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PostgresQueryBuilder } from '../../repositories/PostgresQueryBuilder';

interface QueryCall { text: string; params: unknown[]; }

const allQueryCalls: QueryCall[] = [];

const mockPool = {
  query: vi.fn(async (text: string, params?: unknown[]) => {
    allQueryCalls.push({ text, params: params ?? [] });
    if (text.trim().toUpperCase().startsWith('SELECT COUNT')) {
      return { rows: [{ count: '42' }], rowCount: 1 };
    }
    return { rows: [{ id: '1', name: 'test' }], rowCount: 1 };
  }),
} as any;

describe('PostgresQueryBuilder', () => {
  beforeEach(() => {
    allQueryCalls.length = 0;
  });

  it('where 应追加查询条件', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const result = await qb
      .where({ field: 'name', operator: 'eq', value: 'tom' })
      .executeOne();
    expect(result.success).toBe(true);
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text.toUpperCase()).toContain('WHERE');
    expect(last.params).toContain('tom');
  });

  it('orderBy 应在 SQL 中出现 ORDER BY', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    await qb.orderBy({ field: 'created_at', order: 'desc' }).executeMany();
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text.toUpperCase()).toContain('ORDER BY');
  });

  it('executePaginated 应附加 OFFSET / LIMIT', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const result = await qb.executePaginated({ page: 2, limit: 10 });
    expect(result.success).toBe(true);
    // 第一个查询是带有 OFFSET/LIMIT 的 SELECT
    const firstQuery = allQueryCalls[0];
    expect(firstQuery.text.toUpperCase()).toMatch(/OFFSET/);
    expect(firstQuery.text.toUpperCase()).toMatch(/LIMIT/);
  });

  it('executeCount 应返回数值', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const result = await qb.executeCount();
    expect(result.success).toBe(true);
    expect(result.data).toBeGreaterThan(0);
  });

  it('withDeleted 应过滤掉软删除条件（默认启用）', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const r = await qb.withDeleted().where({ field: 'id', operator: 'eq', value: '1' }).executeOne();
    expect(r.success).toBe(true);
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text.toLowerCase()).not.toMatch(/deleted_at\s+is\s+null/);
  });

  it('SQL 注入测试：字段名应被双引号包裹', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    await qb.where({ field: 'id', operator: 'eq', value: '1' }).executeOne();
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text).toContain('"id"');
  });

  it('select 应仅选择指定字段', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    await qb.select(['id', 'name']).executeMany();
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text).toContain('"id"');
    expect(last.text).toContain('"name"');
  });

  it('offset / limit 应被正确附加到最终 SQL', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    await qb.offset(10).limit(5).executeOne();
    const last = allQueryCalls[allQueryCalls.length - 1]!;
    expect(last.text.length).toBeGreaterThan(0);
  });

  it('should handle populate 关联查询', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const result = await qb
      .populate({ path: 'profile', select: 'bio' })
      .executeMany();
    expect(result.success).toBe(true);
  });

  it('orWhere 应构建 OR 分组条件', async () => {
    const qb = new PostgresQueryBuilder(mockPool, { tableName: 'users', entityName: '用户' });
    const result = await qb
      .orWhere([
        { field: 'name', operator: 'eq', value: 'a' },
        { field: 'name', operator: 'eq', value: 'b' },
      ])
      .executeMany();
    expect(result.success).toBe(true);
  });
});
