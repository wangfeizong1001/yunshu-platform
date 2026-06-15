/**
 * PostgresRepository 数据访问层单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PostgresRepository } from '../../repositories/PostgresRepository';



interface Row {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

let store: Row[] = [];

function resetStore() {
  store = [
    { id: '1', name: 'Alice', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: null },
    { id: '2', name: 'Bob', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: null },
  ];
}

function buildPool() {
  return {
    query: vi.fn(async (text: string, params: unknown[] | undefined) => {
      const sql = (text || '').trim();
      const upper = sql.toUpperCase();

      // INSERT ... RETURNING
      if (upper.startsWith('INSERT')) {
        const id = Math.random().toString(36).slice(2, 10);
        const now = new Date().toISOString();
        const row: Row = {
          id,
          name: (params?.[0] as string) ?? 'x',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        };
        store.push(row);
        return { rows: [row], rowCount: 1 };
      }

      // SELECT ...
      if (upper.startsWith('SELECT')) {
        if (upper.includes('WHERE')) {
          const idParam = (params ?? []).find((p) => typeof p === 'string');
          if (idParam) {
            const matched = store.find((r) => r.id === idParam);
            if (upper.includes('COUNT')) {
              return { rows: [{ count: matched ? 1 : 0 }], rowCount: 1 };
            }
            return { rows: matched ? [matched] : [], rowCount: matched ? 1 : 0 };
          }
        }
        if (upper.includes('COUNT')) {
          return { rows: [{ count: String(store.filter((r) => !r.deleted_at).length) }], rowCount: 1 };
        }
        return { rows: store.filter((r) => !r.deleted_at), rowCount: store.length };
      }

      // UPDATE
      if (upper.startsWith('UPDATE')) {
        const targetId = params?.[params.length - 1];
        const idx = store.findIndex((r) => r.id === targetId);
        if (idx >= 0) {
          store[idx].updated_at = new Date().toISOString();
          if (upper.includes('SOFT')) {
            // soft delete 更新 deleted_at
            return { rows: [store[idx]], rowCount: 1 };
          }
          return { rows: [store[idx]], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }

      // DELETE
      if (upper.startsWith('DELETE')) {
        const idParam = params?.[0];
        const before = store.length;
        store = store.filter((r) => r.id !== idParam);
        return { rows: [], rowCount: before - store.length };
      }

      return { rows: [], rowCount: 0 };
    }),
  } as any;
}

describe('PostgresRepository', () => {
  let pool: ReturnType<typeof buildPool>;
  let repo: PostgresRepository<any>;

  beforeEach(() => {
    resetStore();
    pool = buildPool();
    repo = new PostgresRepository(pool, { tableName: 'users', entityName: '用户' });
  });

  it('findById 应返回成功的结果对象', async () => {
    const r = await repo.findById('1');
    expect(r.success).toBe(true);
    expect(r.data).toBeDefined();
  });

  it('findById 找不到 ID 应返回成功 + data', async () => {
    const r = await repo.findById('9999');
    expect(r.success).toBe(true);
  });

  it('create 应成功创建新记录', async () => {
    const r = await repo.create({ name: 'Charlie' });
    expect(r.success).toBe(true);
    expect(r.data.name).toBe('Charlie');
  });

  it('update 应返回更新成功', async () => {
    const r = await repo.update('1', { name: 'Alicia' });
    expect(r.success).toBe(true);
  });

  it('delete 应删除记录', async () => {
    const r = await repo.delete('1');
    expect(r.success).toBe(true);
  });

  it('findAll 应返回列表', async () => {
    const r = await repo.findAll();
    expect(r.success).toBe(true);
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('count 应返回数字', async () => {
    const r = await repo.count();
    expect(r.success).toBe(true);
    expect(r.data).toBeGreaterThan(0);
  });

  it('exists 应对存在的 id 返回 true', async () => {
    const r = await repo.exists('1');
    expect(r.success).toBe(true);
    expect(r.data).toBe(true);
  });

  it('findWithPagination 应返回分页数据', async () => {
    const r = await repo.findWithPagination({ page: 1, limit: 10 });
    expect(r.success).toBe(true);
    expect(r.data).toBeDefined();
  });

  it('softDelete 应将记录标记为删除', async () => {
    const r = await repo.softDelete('1');
    expect(r.success).toBe(true);
  });

  it('restore 应在 softDelete 后可恢复', async () => {
    await repo.softDelete('1');
    const r = await repo.restore('1');
    expect(r.success).toBe(true);
  });

  it('createMany 应批量创建', async () => {
    const r = await repo.createMany([
      { name: 'Dora' },
      { name: 'Eve' },
    ]);
    expect(r.success).toBe(true);
  });

  it('updateMany 应批量更新', async () => {
    const r = await repo.updateMany([{ field: 'id', operator: 'eq', value: '1' }], { name: 'Changed' });
    expect(r.success).toBe(true);
  });

  it('deleteMany 应批量删除', async () => {
    const r = await repo.deleteMany(['1', '2']);
    expect(r.success).toBe(true);
  });

  it('findOne 应按条件查询单条', async () => {
    const r = await repo.findOne([{ field: 'id', operator: 'eq', value: '1' }]);
    expect(r.success).toBe(true);
  });

  it('getEntityName / getTableName 应返回配置值', () => {
    expect(repo.getEntityName()).toBe('用户');
    expect(repo.getTableName()).toBe('users');
  });
});
