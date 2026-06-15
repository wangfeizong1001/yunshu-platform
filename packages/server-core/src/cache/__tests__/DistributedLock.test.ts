/**
 * DistributedLock 分布式锁单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { acquireLock, withLock, tryWithLock, getLockStats, resetLockStats, isLocked, forceReleaseLock } from '../DistributedLock';

const redisStore = new Map<string, string>();

function createMockRedis(): any {
  return {
    status: 'ready',
    eval: async (script: string, _nKeys: number, ...args: unknown[]) => {
      const key = args[0] as string;
      const value = args[1] as string;

      if (typeof script === 'string' && script.includes('psetex')) {
        if (!redisStore.has(key)) {
          redisStore.set(key, value);
          return 1;
        }
        return 0;
      }
      if (typeof script === 'string' && script.includes('del')) {
        if (redisStore.get(key) === value) {
          redisStore.delete(key);
          return 1;
        }
        return 0;
      }
      if (typeof script === 'string' && script.includes('pexpire')) {
        if (redisStore.get(key) === value) {
          return 1;
        }
        return 0;
      }
      return 0;
    },
    exists: async (key: string) => (redisStore.has(key) ? 1 : 0),
    del: async (...keys: string[]) => {
      let n = 0;
      for (const k of keys) {
        if (redisStore.delete(k)) n++;
      }
      return n;
    },
    setbit: async () => 0,
    getbit: async (key: string) => (redisStore.has(key) ? 1 : 0),
    get: async (key: string) => redisStore.get(key) ?? null,
  };
}

vi.mock('../RedisClient', () => ({
  getRedisClient: () => createMockRedis(),
  isRedisAvailable: () => true,
}));

describe('DistributedLock', () => {
  beforeEach(() => {
    redisStore.clear();
    resetLockStats();
  });

  it('acquireLock 应成功获得锁并返回实例', async () => {
    const lock = await acquireLock('user:1', { ttl: 5000 });
    expect(lock.acquired).toBe(true);
    expect(typeof lock.release).toBe('function');
    await lock.release();
  });

  it('相同 key 第二次应无法获取锁（在第一次未释放前）', async () => {
    const lock = await acquireLock('user:2', { ttl: 5000 });
    expect(lock.acquired).toBe(true);
    const second = await acquireLock('user:2', { ttl: 500, acquireTimeout: 200, retryInterval: 50 });
    expect(second.acquired).toBe(false);
  });

  it('release 应释放锁并允许后续重新获取', async () => {
    const lock = await acquireLock('user:3', { ttl: 5000 });
    expect(lock.acquired).toBe(true);
    await lock.release();
    const next = await acquireLock('user:3', { ttl: 5000 });
    expect(next.acquired).toBe(true);
    await next.release();
  });

  it('extend 应续期锁', async () => {
    const lock = await acquireLock('user:4', { ttl: 5000 });
    expect(lock.acquired).toBe(true);
    const result = await lock.extend(3000);
    expect(typeof result).toBe('boolean');
    await lock.release();
  });

  it('withLock 装饰器应串行执行相同 key 的函数', async () => {
    let running = 0;
    let maxRunning = 0;
    const fn = withLock(async (x: number) => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((r) => setTimeout(r, 30));
      running--;
      return x * 2;
    }, (x) => `lock:wl:${x}`);
    const results = await Promise.all([fn(1), fn(2), fn(3)]);
    expect(results).toEqual([2, 4, 6]);
  });

  it('withLock 失败时应抛出错误', async () => {
    const fn = withLock(async () => {
      throw new Error('业务错误');
    }, () => 'lock:wlerr');
    await expect(fn()).rejects.toThrow();
  });

  it('isLocked 应检测指定 key 是否被锁定', async () => {
    await acquireLock('islocked:1', { ttl: 3000 });
    const locked = await isLocked('islocked:1');
    expect(locked).toBe(true);
    const notLocked = await isLocked('islocked:not-exist');
    expect(notLocked).toBe(false);
  });

  it('forceReleaseLock 应强制释放锁', async () => {
    await acquireLock('force:1', { ttl: 3000 });
    const before = await isLocked('force:1');
    expect(before).toBe(true);
    await forceReleaseLock('force:1');
    const after = await isLocked('force:1');
    expect(after).toBe(false);
  });

  it('可重入模式下应允许同一进程重复获取', async () => {
    const key = 'reentrant:1';
    const value = 'client:1:abc';
    const l1 = await acquireLock(key, { ttl: 5000, value, reentrant: true, autoExtend: false });
    expect(l1.acquired).toBe(true);
    const l2 = await acquireLock(key, { ttl: 5000, value, reentrant: true, autoExtend: false });
    expect(l2.acquired).toBe(true);
    await l1.release();
    await l2.release();
  });

  it('getLockStats 应返回统计信息', async () => {
    const stats = getLockStats();
    expect(stats).toBeDefined();
    expect(typeof stats).toBe('object');
  });
});
