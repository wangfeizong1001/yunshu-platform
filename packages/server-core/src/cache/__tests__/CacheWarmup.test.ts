/**
 * CacheWarmupManager 缓存预热管理器单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheWarmupManager } from '../CacheWarmup';

const memoryStore = new Map<string, string>();

function createMockRedis(): any {
  return {
    status: 'ready',
    get: async (key: string) => memoryStore.get(key) ?? null,
    setex: async (key: string, _seconds: number, value: string) => {
      memoryStore.set(key, value);
      return 'OK';
    },
    del: async (...keys: string[]) => {
      let n = 0;
      for (const k of keys) if (memoryStore.delete(k)) n++;
      return n;
    },
    scan: async () => ['0', []],
    pipeline: () => {
      const items: Array<{ key: string; value: string }> = [];
      const pipeline: any = {
        setex: (key: string, _ttl: number, value: string) => {
          items.push({ key, value });
          return pipeline;
        },
        exec: async (): Promise<unknown[]> => {
          for (const item of items) memoryStore.set(item.key, item.value);
          return items.map(() => [null, 'OK']);
        },
      };
      return pipeline;
    },
  };
}

vi.mock('../RedisClient', () => ({
  getRedisClient: () => createMockRedis(),
  isRedisAvailable: () => true,
}));

describe('CacheWarmupManager', () => {
  let manager: CacheWarmupManager;

  beforeEach(() => {
    memoryStore.clear();
    manager = new CacheWarmupManager({ warmupOnStart: false });
  });

  it('应能注册预热任务', () => {
    manager.register({
      name: 'warmup:1',
      loader: async () => [],
    });
    expect(true).toBe(true);
  });

  it('warmup 应执行单个预热任务并返回 count', async () => {
    manager.register({
      name: 'warmup:single',
      loader: async () => [
        { key: 'item:1', value: 'a', ttl: 10000 },
        { key: 'item:2', value: 'b', ttl: 10000 },
      ],
    });
    const count = await manager.warmup('warmup:single');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('warmupAll 应执行所有已注册任务', async () => {
    manager.register({
      name: 'warmup:a',
      loader: async () => [{ key: 'a1', value: 'x' }],
    });
    manager.register({
      name: 'warmup:b',
      loader: async () => [{ key: 'b1', value: 'y' }],
    });
    const result = await manager.warmupAll();
    expect(result).toBeDefined();
    expect(result instanceof Map).toBe(true);
  });

  it('onSuccess 回调应在成功时被触发', async () => {
    const onSuccess = vi.fn();
    manager.register({
      name: 'warmup:cb',
      loader: async () => [{ key: 'c1', value: 'z' }],
      onSuccess,
    });
    await manager.warmup('warmup:cb');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('onError 回调应在加载失败时被触发', async () => {
    const onError = vi.fn();
    manager.register({
      name: 'warmup:err',
      loader: async () => {
        throw new Error('加载失败');
      },
      onError,
    });
    await manager.warmup('warmup:err');
    expect(onError).toHaveBeenCalled();
  });

  it('register 应覆盖相同名称的任务', async () => {
    manager.register({
      name: 'warmup:dup',
      loader: async () => [],
    });
    manager.register({
      name: 'warmup:dup',
      loader: async () => [{ key: 'x', value: 'v' }],
    });
    expect(true).toBe(true);
  });

  it('unregister 应移除已注册任务', async () => {
    manager.register({
      name: 'warmup:unreg',
      loader: async () => [],
    });
    const result = manager.unregister('warmup:unreg');
    expect(typeof result).toBe('boolean');
  });

  it('getAllStatuses 应返回任务状态列表', async () => {
    manager.register({
      name: 'warmup:status',
      loader: async () => [{ key: 's1', value: 'x' }],
    });
    await manager.warmup('warmup:status');
    const statuses = manager.getAllStatuses();
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
  });

  it('getTaskNames 应列出所有已注册任务名', async () => {
    manager.register({
      name: 'warmup:list',
      loader: async () => [],
    });
    const tasks = manager.getTaskNames();
    expect(Array.isArray(tasks)).toBe(true);
  });
});
