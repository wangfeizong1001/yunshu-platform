/**
 * PostgresClient / PostgresClientManager 单元测试
 *
 * 通过在内存中模拟 Pool 客户端，避免依赖真实数据库。
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PostgresClientManager } from '../../database/PostgresClient';

interface PoolMock {
  totalCount: number;
  idleCount: number;
  waitingCount: number;
  queryFn: (text: string, params?: unknown[]) => Promise<{ rows: unknown[]; rowCount: number }>;
  connectFn: () => Promise<{
    query: (text: string, params?: unknown[]) => Promise<unknown>;
    release: () => void;
  }>;
  on: (event: string, handler: (err?: Error) => void) => void;
  end: () => Promise<void>;
}

let poolBehavior: PoolMock = {
  totalCount: 1,
  idleCount: 1,
  waitingCount: 0,
  queryFn: async (text: string) => {
    if (text.trim().toUpperCase().startsWith('SELECT VERSION()')) {
      return { rows: [{ version: 'PostgreSQL 15.2' }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  },
  connectFn: async () => ({
    query: async () => ({ rows: [], rowCount: 0 }),
    release: () => undefined,
  }),
  on: () => undefined,
  end: async () => undefined,
};

vi.mock('pg', () => {
  const Pool = vi.fn(function (this: any, _config?: any) {
    this.totalCount = poolBehavior.totalCount;
    this.idleCount = poolBehavior.idleCount;
    this.waitingCount = poolBehavior.waitingCount;
    this.query = vi.fn(async (text: string, params?: unknown[]) => poolBehavior.queryFn(text, params));
    this.connect = vi.fn(async () => poolBehavior.connectFn());
    this.on = vi.fn((event: string, handler: (err?: Error) => void) => {
      poolBehavior.on(event, handler);
    });
    this.end = vi.fn(async () => poolBehavior.end());
  });
  return { Pool };
});

describe('PostgresClientManager', () => {
  beforeEach(() => {
    PostgresClientManager.resetInstance();
    // 重置默认行为
    poolBehavior = {
      totalCount: 1,
      idleCount: 1,
      waitingCount: 0,
      queryFn: async (text: string) => {
        if (text.trim().toUpperCase().startsWith('SELECT VERSION()')) {
          return { rows: [{ version: 'PostgreSQL 15.2' }], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      },
      connectFn: async () => ({
        query: async () => ({ rows: [], rowCount: 0 }),
        release: () => undefined,
      }),
      on: () => undefined,
      end: async () => undefined,
    };
  });

  it('getInstance 应返回单例', () => {
    const a = PostgresClientManager.getInstance();
    const b = PostgresClientManager.getInstance();
    expect(a).toBe(b);
  });

  it('connect 应建立连接池', async () => {
    const mgr = PostgresClientManager.getInstance();
    await mgr.connect({ host: 'localhost', port: 5432 });
    expect(mgr.isConnected()).toBe(true);
  });

  it('getPool 对未初始化应抛出错误', () => {
    const mgr = PostgresClientManager.getInstance();
    expect(() => mgr.getPool()).toThrow(/PostgreSQL/);
  });

  it('query 应执行原始 SQL 并返回 rows', async () => {
    const mgr = PostgresClientManager.getInstance();
    poolBehavior.queryFn = async () => ({ rows: [{ id: 1, name: 'test' }], rowCount: 1 });
    await mgr.connect({ host: 'localhost' });
    const result = await mgr.query<{ id: number; name: string }>('SELECT 1');
    expect(result.rows).toEqual([{ id: 1, name: 'test' }]);
  });

  it('healthCheck 在未连接时应返回 unhealthy', async () => {
    const mgr = PostgresClientManager.getInstance();
    const result = await mgr.healthCheck();
    expect(result.healthy).toBe(false);
  });

  it('healthCheck 在连接后应返回 healthy 并包含版本信息', async () => {
    const mgr = PostgresClientManager.getInstance();
    await mgr.connect({ host: 'localhost' });
    const result = await mgr.healthCheck();
    expect(result.healthy).toBe(true);
    expect(result.version).toBeDefined();
    expect(result.poolStatus).toBeDefined();
  });

  it('transaction 应成功执行回调并提交', async () => {
    const mgr = PostgresClientManager.getInstance();
    const clientSpy = {
      query: vi.fn(async (sql: string) => {
        if (sql === 'SELECT 1') return { rows: [{ n: 1 }], rowCount: 1 };
        return { rows: [], rowCount: 0 };
      }),
      release: vi.fn(),
    };
    poolBehavior.connectFn = async () => clientSpy as any;
    await mgr.connect({ host: 'localhost' });
    const result = await mgr.transaction(async (client) => {
      const r = await client.query('SELECT 1');
      return r;
    });
    expect(result).toBeDefined();
    expect(clientSpy.query).toHaveBeenCalledWith('BEGIN');
    expect(clientSpy.query).toHaveBeenCalledWith('COMMIT');
    expect(clientSpy.release).toHaveBeenCalled();
  });

  it('transaction 在回调抛出时应回滚并抛出错误', async () => {
    const mgr = PostgresClientManager.getInstance();
    const clientSpy = {
      query: vi.fn(async () => ({ rows: [], rowCount: 0 })),
      release: vi.fn(),
    };
    poolBehavior.connectFn = async () => clientSpy as any;
    await mgr.connect({ host: 'localhost' });
    await expect(
      mgr.transaction(async () => {
        throw new Error('business fail');
      }),
    ).rejects.toThrow('business fail');
    expect(clientSpy.query).toHaveBeenCalledWith('ROLLBACK');
    expect(clientSpy.release).toHaveBeenCalled();
  });

  it('disconnect 应断开连接池', async () => {
    const mgr = PostgresClientManager.getInstance();
    await mgr.connect({ host: 'localhost' });
    await mgr.disconnect();
    expect(mgr.isConnected()).toBe(false);
  });

  it('connect 失败时应抛出', async () => {
    const mgr = PostgresClientManager.getInstance();
    poolBehavior.connectFn = async () => {
      throw new Error('connection refused');
    };
    await expect(mgr.connect({ host: 'bad-host' })).rejects.toThrow('connection refused');
  });
});
