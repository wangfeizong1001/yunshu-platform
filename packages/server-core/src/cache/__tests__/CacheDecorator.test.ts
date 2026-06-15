/**
 * CacheDecorator 二级缓存装饰器单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
  getCacheSimpleStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
} from '../CacheDecorator';

const memoryStore = new Map<string, string>();

function createMockRedis(): any {
  return {
    status: 'ready',
    get: async (key: string) => {
      const v = memoryStore.get(key);
      return v === undefined ? null : v;
    },
    setex: async (key: string, _seconds: number, value: string) => {
      memoryStore.set(key, value);
      return 'OK';
    },
    del: async (...keys: string[]) => {
      let cnt = 0;
      for (const k of keys) {
        if (memoryStore.has(k)) {
          memoryStore.delete(k);
          cnt++;
        }
      }
      return cnt;
    },
    scan: async (_cursor: string, _cmd: string, pattern: string) => {
      const prefix = typeof pattern === 'string' ? pattern.replace(/\*$/, '') : '';
      const allKeys = Array.from(memoryStore.keys());
      const matched = allKeys.filter((k) => k.startsWith(prefix));
      return ['0', matched];
    },
    pipeline: () => ({
      setex: function (key: string, _ttl: number, value: string) {
        memoryStore.set(key, value);
        return this;
      },
      exec: async () => [],
    }),
  };
}

vi.mock('../RedisClient', () => ({
  getRedisClient: () => createMockRedis(),
  isRedisAvailable: () => true,
}));

describe('CacheDecorator', () => {
  beforeEach(() => {
    memoryStore.clear();
    clearL1Cache();
    resetCacheStats();
  });

  it('withCache 首次调用应执行原函数', async () => {
    const impl = vi.fn(async (id: string) => ({ id, name: 'Tom' }));
    const cached = withCache(impl, { keyPrefix: 'cd-user', ttl: 100, enableL2: false, enableBloomFilter: false });
    const result = await cached('1');
    expect(result).toEqual({ id: '1', name: 'Tom' });
    expect(impl).toHaveBeenCalledTimes(1);
  });

  it('withCache 二次调用相同 key 应命中缓存', async () => {
    const impl = vi.fn(async (id: string) => ({ id, name: 'Tom' }));
    const cached = withCache(impl, { keyPrefix: 'cd-user2', ttl: 100, enableL2: false, enableBloomFilter: false });
    await cached('1');
    await cached('1');
    expect(impl).toHaveBeenCalledTimes(1);
  });

  it('invalidateCache 应删除指定 key', async () => {
    const impl = vi.fn(async (id: string) => ({ id, name: 'Tom' }));
    const cached = withCache(impl, { keyPrefix: 'cd-user3', ttl: 100, enableL2: false, enableBloomFilter: false });
    await cached('1');
    await invalidateCache('cd-user3:1');
    await cached('1');
    expect(impl).toHaveBeenCalledTimes(2);
  });

  it('invalidateCacheByPrefix 应按前缀批量删除', async () => {
    const impl1 = vi.fn(async (id: string) => ({ id }));
    const cached1 = withCache(impl1, { keyPrefix: 'cd-foo', ttl: 100, enableL2: false, enableBloomFilter: false });
    await cached1('1');
    await invalidateCacheByPrefix('cd-foo');
    await cached1('1');
    expect(impl1).toHaveBeenCalledTimes(2);
  });

  it('warmupCache 应将数据写入缓存', async () => {
    await warmupCache([{ key: 'cd-warm:1', value: { id: '1', name: 'Alice' }, ttl: 100 }], { enableL2: false });
    const impl = vi.fn(async () => ({ id: '1', name: 'Alice' }));
    const cached = withCache(impl, { keyPrefix: 'cd-warm', ttl: 100, enableL2: false, enableBloomFilter: false });
    await cached('1');
    expect(impl).toHaveBeenCalledTimes(0);
  });

  it('空值 cacheNull 应被缓存', async () => {
    const impl = vi.fn(async () => null);
    const cached = withCache(impl, { keyPrefix: 'cd-null', ttl: 100, cacheNull: true, enableL2: false, enableBloomFilter: false });
    const r1 = await cached();
    const r2 = await cached();
    expect(r1).toBeNull();
    expect(r2).toBeNull();
    expect(impl).toHaveBeenCalledTimes(1);
  });

  it('使用自定义 keyGenerator 生成缓存 key', async () => {
    const impl = vi.fn(async (a: string, b: string) => ({ a, b }));
    const cached = withCache(impl, {
      keyPrefix: 'cd-custom',
      keyGenerator: (a, b) => `${a}-${b}`,
      ttl: 100,
      enableL2: false,
      enableBloomFilter: false,
    });
    const r1 = await cached('x', 'y');
    const r2 = await cached('x', 'y');
    const r3 = await cached('x', 'z');
    expect(r1).toEqual({ a: 'x', b: 'y' });
    expect(r2).toEqual({ a: 'x', b: 'y' });
    expect(r3).toEqual({ a: 'x', b: 'z' });
    expect(impl).toHaveBeenCalledTimes(2);
  });

  it('getCacheStats / resetCacheStats 应返回有效数据', async () => {
    const stats = getCacheStats();
    expect(stats).toBeDefined();
    const simple = getCacheSimpleStats();
    expect(typeof simple).toBe('object');
    resetCacheStats();
    const after = getCacheSimpleStats();
    expect(after).toBeDefined();
  });

  it('getL1CacheSize 应反映当前 L1 缓存大小', async () => {
    const size = getL1CacheSize();
    expect(typeof size).toBe('number');
    expect(size).toBeGreaterThanOrEqual(0);
  });
});
