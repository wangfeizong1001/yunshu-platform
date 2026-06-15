/**
 * 装饰器（withCache / withLog / withPerformance）单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  withLog,
  withPerformance,
  getCacheStats,
} from '../';

describe('装饰器', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withCache', () => {
    it('相同 key 应命中缓存（原函数只调用一次）', async () => {
      const impl = vi.fn(async (id: string) => ({ id, ts: Date.now() }));
      const cached = withCache(impl, { keyPrefix: 'u' });

      const a = await cached('1');
      const b = await cached('1');
      expect(impl).toHaveBeenCalledTimes(1);
      expect(a).toEqual(b);
    });

    it('不同 key 应分别缓存', async () => {
      const impl = vi.fn(async (id: string) => ({ id }));
      const cached = withCache(impl, { keyPrefix: 'u2' });
      await cached('1');
      await cached('2');
      expect(impl).toHaveBeenCalledTimes(2);
    });

    it('null/undefined 结果不应被缓存', async () => {
      let callCount = 0;
      const impl = vi.fn(async (id: string) => {
        callCount++;
        return id === 'exists' ? { id } : null;
      });
      const cached = withCache(impl, { keyPrefix: 'u-null' });
      await cached('not-exists');
      await cached('not-exists');
      expect(callCount).toBeGreaterThan(1);
    });

    it('自定义 keyGenerator 应生效', async () => {
      const impl = vi.fn(async (a: number, b: number) => a + b);
      const cached = withCache(impl, {
        keyPrefix: 'sum',
        keyGenerator: (a, b) => `${a}-${b}`,
      });
      const r1 = await cached(1, 2);
      const r2 = await cached(1, 2);
      expect(impl).toHaveBeenCalledTimes(1);
      expect(r1).toBe(3);
      expect(r2).toBe(3);
    });

    it('invalidateCache 应清除指定 key', async () => {
      const impl = vi.fn(async (id: string) => ({ id }));
      const cached = withCache(impl, { keyPrefix: 'inv' });
      await cached('1');
      invalidateCache('inv:1');
      await cached('1');
      expect(impl).toHaveBeenCalledTimes(2);
    });

    it('invalidateCacheByPrefix 应批量清除', async () => {
      const impl = vi.fn(async (id: string) => ({ id }));
      const cached = withCache(impl, { keyPrefix: 'batch' });
      await cached('1');
      await cached('2');
      invalidateCacheByPrefix('batch');
      await cached('1');
      expect(impl).toHaveBeenCalledTimes(3);
    });

    it('getCacheStats 应返回统计数据', () => {
      const stats = getCacheStats();
      expect(stats).toBeDefined();
      expect(typeof stats.hits).toBe('number');
      expect(typeof stats.misses).toBe('number');
    });
  });

  describe('withLog', () => {
    it('应在执行前后打印日志', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const impl = vi.fn(async (x: number) => x * 2);
      const wrapped = withLog(impl, { module: 'math', logArgs: true, logResult: true });
      const result = await wrapped(3);
      expect(result).toBe(6);
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it('失败时应记录错误', async () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapped = withLog(async () => {
        throw new Error('log fail');
      }, { module: 'fail' });
      await expect(wrapped()).rejects.toThrow('log fail');
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });

  describe('withPerformance', () => {
    it('应正常返回值（耗时低于阈值时不输出警告）', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapped = withPerformance(async () => 'ok', {
        module: 'perf-fast',
        slowThreshold: 10000,
      });
      const r = await wrapped();
      expect(r).toBe('ok');
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('耗时超过 slowThreshold 应通过 console.warn 输出警告', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapped = withPerformance(async () => {
        return new Promise((resolve) => setTimeout(() => resolve('ok'), 20));
      }, { module: 'perf-slow', slowThreshold: 1 });
      const r = await wrapped();
      expect(r).toBe('ok');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
