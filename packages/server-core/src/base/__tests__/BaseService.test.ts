/**
 * BaseService 基础服务抽象类单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseService } from '../BaseService';



type User = { id: string; name: string; createdAt: Date; updatedAt: Date };

function buildRepository() {
  const data = new Map<string, User>();
  data.set('1', { id: '1', name: 'Alice', createdAt: new Date(), updatedAt: new Date() });
  data.set('2', { id: '2', name: 'Bob', createdAt: new Date(), updatedAt: new Date() });

  return {
    findById: vi.fn(async (id: string) => {
      const row = data.get(id) ?? null;
      return { success: true as const, data: row };
    }),
    findOne: vi.fn(async (conditions: any[]) => {
      const eqCond = conditions.find((c) => c.operator === 'eq');
      if (eqCond) {
        const row = Array.from(data.values()).find((u) => (u as any)[eqCond.field] === eqCond.value) ?? null;
        return { success: true as const, data: row };
      }
      return { success: true as const, data: null };
    }),
    findAll: vi.fn(async () => ({ success: true as const, data: Array.from(data.values()) })),
    findWithPagination: vi.fn(async () => ({
      success: true as const,
      data: {
        data: Array.from(data.values()),
        pagination: { page: 1, limit: 10, total: data.size, totalPages: 1, hasPrev: false, hasNext: false },
      },
    })),
    create: vi.fn(async (payload: Partial<User>) => {
      const id = Math.random().toString(36).slice(2, 10);
      const row: User = { id, name: payload.name ?? '', createdAt: new Date(), updatedAt: new Date() };
      data.set(id, row);
      return { success: true as const, data: row };
    }),
    update: vi.fn(async (id: string, payload: Partial<User>) => {
      const row = data.get(id);
      if (!row) return { success: false as const, error: { code: 'NOT_FOUND', message: '不存在' } };
      Object.assign(row, payload, { updatedAt: new Date() });
      return { success: true as const, data: row };
    }),
    delete: vi.fn(async (id: string) => {
      const ok = data.delete(id);
      return { success: true as const, data: ok };
    }),
    softDelete: vi.fn(async (id: string) => {
      const row = data.get(id);
      if (!row) return { success: true as const, data: false };
      (row as any).deletedAt = new Date();
      return { success: true as const, data: true };
    }),
    restore: vi.fn(async (id: string) => {
      const row = data.get(id);
      if (!row) return { success: false as const, error: { code: 'NOT_FOUND', message: '' } };
      delete (row as any).deletedAt;
      return { success: true as const, data: row };
    }),
    createMany: vi.fn(async (items: Partial<User>[]) => ({ success: true as const, data: items as User[] })),
    updateMany: vi.fn(async () => ({ success: true as const, data: 1 })),
    deleteMany: vi.fn(async (ids: string[]) => {
      for (const id of ids) data.delete(id);
      return { success: true as const, data: ids.length };
    }),
    count: vi.fn(async () => ({ success: true as const, data: data.size })),
    exists: vi.fn(async (id: string) => ({ success: true as const, data: data.has(id) })),
    getEntityName: vi.fn(() => '用户'),
    getTableName: vi.fn(() => 'users'),
  } as any;
}

describe('BaseService', () => {
  let repo: ReturnType<typeof buildRepository>;
  let service: BaseService<User, string>;

  beforeEach(() => {
    repo = buildRepository();
    service = new (class extends BaseService<User, string> {
      constructor(r: any) {
        super(r, { entityName: '用户' });
      }
    })(repo);
  });

  it('findById 应调用 repository.findById', async () => {
    const result = await service.findById('1');
    expect(result.success).toBe(true);
    expect(repo.findById).toHaveBeenCalledWith('1');
  });

  it('findAll 应返回数组', async () => {
    const result = await service.findAll();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('create 应调用 repository.create', async () => {
    const result = await service.create({ name: 'Tom' });
    expect(result.success).toBe(true);
    expect(repo.create).toHaveBeenCalled();
  });

  it('update 应调用 repository.update', async () => {
    const result = await service.update('1', { name: 'AliceX' });
    expect(result.success).toBe(true);
    expect(repo.update).toHaveBeenCalled();
  });

  it('delete 应调用 repository.delete', async () => {
    const result = await service.delete('1');
    expect(result.success).toBe(true);
  });

  it('count 应返回数值', async () => {
    const result = await service.count();
    expect(result.success).toBe(true);
    expect(result.data).toBeGreaterThan(0);
  });

  it('exists 对存在的 id 返回 true', async () => {
    const result = await service.exists('1');
    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });

  it('exists 对不存在的 id 返回 false', async () => {
    const result = await service.exists('999');
    expect(result.data).toBe(false);
  });

  it('findWithPagination 应返回分页对象', async () => {
    const result = await service.findWithPagination({ page: 1, limit: 10 });
    expect(result.success).toBe(true);
    expect(result.data.pagination).toBeDefined();
  });

  it('findOne 应通过条件查询', async () => {
    const result = await service.findOne({ id: '1' } as any);
    expect(result.success).toBe(true);
  });

  it('softDelete / restore 应调用对应的 repository 方法', async () => {
    const del = await service.softDelete('1');
    expect(del.success).toBe(true);
    const restore = await service.restore('1');
    expect(restore.success).toBe(true);
  });

  it('批量操作 createMany / updateMany / deleteMany 应成功', async () => {
    const created = await service.createMany([{ name: 'a' }, { name: 'b' }]);
    expect(created.success).toBe(true);
    const updated = await service.updateMany({ status: 1 } as any, { name: 'x' });
    expect(updated.success).toBe(true);
    const deleted = await service.deleteMany(['1', '2']);
    expect(deleted.success).toBe(true);
  });

  it('构造函数接受 cacheOptions', () => {
    const svc = new (class extends BaseService<User, string> {
      constructor(r: any) {
        super(r, {
          entityName: '用户',
          cacheOptions: { cacheTtl: 60, cacheEnabled: true, cacheKeyPrefix: 'u' },
        });
      }
    })(repo);
    expect(svc).toBeInstanceOf(BaseService);
  });

  it('构造函数接受 softDelete 并生效', async () => {
    const softRepo = buildRepository();
    const svc = new (class extends BaseService<User, string> {
      constructor(r: any) {
        super(r, { entityName: '用户', softDelete: true });
      }
    })(softRepo);
    const r = await svc.delete('1');
    expect(r.success).toBe(true);
    expect(softRepo.softDelete).toHaveBeenCalled();
  });
});
