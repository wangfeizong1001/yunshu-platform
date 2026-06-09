/**
 * 二级缓存装饰器模块
 *
 * 实现 Redis + 内存二级缓存架构，支持：
 * - L1 缓存（内存）：快速访问，容量有限
 * - L2 缓存（Redis）：分布式共享，持久化
 * - 自动降级：Redis 不可用时降级到内存缓存
 * - 缓存穿透防护：空值缓存
 * - 缓存击穿防护：热点 key 互斥锁
 *
 * @module @yunshu/server-core/cache/CacheDecorator
 */

import { getRedisClient, isRedisAvailable } from './RedisClient';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 缓存条目
 */
interface CacheEntry<T> {
  value: T;
  expireAt: number;
}

/**
 * 缓存选项
 */
export interface CacheOptions {
  /** 缓存键前缀 */
  keyPrefix: string;
  /** 过期时间（秒），默认 300 */
  ttl?: number;
  /** 自定义键生成函数 */
  keyGenerator?: (...args: unknown[]) => string;
  /** 是否缓存空值（防止缓存穿透），默认 true */
  cacheNull?: boolean;
  /** 空值过期时间（秒），默认 60 */
  nullTtl?: number;
  /** 是否启用 L1 缓存（内存），默认 true */
  enableL1?: boolean;
  /** L1 缓存过期时间（秒），默认 60 */
  l1Ttl?: number;
  /** 是否启用 L2 缓存（Redis），默认 true */
  enableL2?: boolean;
  /** 热点 key 保护阈值（并发请求数），默认 5 */
  hotKeyThreshold?: number;
  /** 热点 key 锁等待超时（毫秒），默认 5000 */
  hotKeyLockTimeout?: number;
}

/**
 * 缓存统计
 */
interface CacheStatistics {
  hits: number;
  misses: number;
  l1Hits: number;
  l2Hits: number;
  nullHits: number;
  errors: number;
}

// ============================================================================
// 内存缓存（L1）
// ============================================================================

/**
 * LRU 内存缓存
 */
class MemoryLRUCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expireAt) {
      this.store.delete(key);
      return null;
    }
    // LRU：移动到末尾
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, { value, expireAt: Date.now() + ttlSeconds * 1000 });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// ============================================================================
// 热点 Key 保护
// ============================================================================

/**
 * 热点 Key 请求计数器
 */
const hotKeyCounter = new Map<string, { count: number; resetAt: number }>();

/**
 * 热点 Key 等待队列
 */
const hotKeyWaiters = new Map<string, Promise<unknown>>();

/**
 * 检查是否为热点 Key
 */
function isHotKey(key: string, threshold: number): boolean {
  const now = Date.now();
  const entry = hotKeyCounter.get(key);

  if (!entry || now > entry.resetAt) {
    hotKeyCounter.set(key, { count: 1, resetAt: now + 1000 });
    return false;
  }

  entry.count++;
  return entry.count >= threshold;
}

/**
 * 清理热点 Key 计数
 */
function clearHotKeyCounter(key: string): void {
  hotKeyCounter.delete(key);
  hotKeyWaiters.delete(key);
}

// ============================================================================
// 全局实例
// ============================================================================

const globalMemoryCache = new MemoryLRUCache();
const cacheStats: CacheStatistics = {
  hits: 0,
  misses: 0,
  l1Hits: 0,
  l2Hits: 0,
  nullHits: 0,
  errors: 0,
};

// 空值标记
const NULL_MARKER = '__NULL__';

// ============================================================================
// 缓存装饰器
// ============================================================================

/**
 * 缓存装饰器 — 二级缓存架构
 *
 * 优先使用 L1（内存）-> L2（Redis）-> 原函数
 *
 * @example
 * ```typescript
 * const cachedGetUser = withCache(
 *   async (id: string) => await User.findById(id),
 *   { keyPrefix: 'user', ttl: 300 }
 * );
 *
 * const user = await cachedGetUser('user-123');
 * ```
 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions,
): (...args: TArgs) => Promise<TResult> {
  const {
    keyPrefix,
    ttl = 300,
    keyGenerator,
    cacheNull = true,
    nullTtl = 60,
    enableL1 = true,
    l1Ttl = 60,
    enableL2 = true,
    hotKeyThreshold = 5,
    hotKeyLockTimeout = 5000,
  } = options;

  // 键生成函数
  const generateKey = (...args: TArgs): string => {
    if (keyGenerator) return `${keyPrefix}:${keyGenerator(...args)}`;
    if (args.length === 1 && typeof args[0] === 'string') return `${keyPrefix}:${args[0]}`;
    try {
      return `${keyPrefix}:${JSON.stringify(args)}`;
    } catch {
      return `${keyPrefix}:${String(args)}`;
    }
  };

  return async (...args: TArgs): Promise<TResult> => {
    const cacheKey = generateKey(...args);

    // 热点 Key 保护：如果正在有请求在处理，等待其结果
    if (isHotKey(cacheKey, hotKeyThreshold)) {
      const waiter = hotKeyWaiters.get(cacheKey);
      if (waiter) {
        try {
          const result = await Promise.race([
            waiter as Promise<TResult>,
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('热点 Key 等待超时')), hotKeyLockTimeout),
            ),
          ]);
          return result;
        } catch {
          // 等待超时，继续正常处理
        }
      }
    }

    // 创建处理 Promise 用于热点 Key 共享
    const processPromise = doProcess(fn, args, cacheKey, {
      ttl,
      cacheNull,
      nullTtl,
      enableL1,
      l1Ttl,
      enableL2,
    });

    hotKeyWaiters.set(cacheKey, processPromise);

    try {
      const result = await processPromise;
      return result;
    } finally {
      clearHotKeyCounter(cacheKey);
    }
  };
}

/**
 * 执行缓存处理逻辑
 */
async function doProcess<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  args: TArgs,
  cacheKey: string,
  config: {
    ttl: number;
    cacheNull: boolean;
    nullTtl: number;
    enableL1: boolean;
    l1Ttl: number;
    enableL2: boolean;
  },
): Promise<TResult> {
  const { ttl, cacheNull, nullTtl, enableL1, l1Ttl, enableL2 } = config;

  // 1. 尝试 L1 缓存
  if (enableL1) {
    const l1Result = globalMemoryCache.get<TResult>(cacheKey);
    if (l1Result !== null) {
      cacheStats.hits++;
      cacheStats.l1Hits++;
      // 检查是否为空值标记
      if (l1Result === NULL_MARKER as unknown as TResult) {
        cacheStats.nullHits++;
        return null as TResult;
      }
      return l1Result;
    }
  }

  // 2. 尝试 L2 缓存（Redis）
  if (enableL2 && isRedisAvailable()) {
    try {
      const redis = getRedisClient();
      if (redis) {
        const l2Result = await redis.get(cacheKey);
        if (l2Result !== null) {
          cacheStats.hits++;
          cacheStats.l2Hits++;

          // 检查是否为空值标记
          if (l2Result === NULL_MARKER) {
            cacheStats.nullHits++;
            // 回填 L1
            if (enableL1) {
              globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, l1Ttl);
            }
            return null as TResult;
          }

          // 解析 JSON
          try {
            const parsed = JSON.parse(l2Result) as TResult;
            // 回填 L1
            if (enableL1) {
              globalMemoryCache.set(cacheKey, parsed, l1Ttl);
            }
            return parsed;
          } catch {
            // 非 JSON，直接返回
            const value = l2Result as unknown as TResult;
            if (enableL1) {
              globalMemoryCache.set(cacheKey, value, l1Ttl);
            }
            return value;
          }
        }
      }
    } catch (error) {
      cacheStats.errors++;
      console.error('[Cache] Redis 读取失败:', error);
      // 继续执行原函数
    }
  }

  // 3. 缓存未命中，执行原函数
  cacheStats.misses++;

  try {
    const result = await fn(...args);

    // 4. 缓存结果
    const isNull = result === null || result === undefined;
    const effectiveTtl = isNull && cacheNull ? nullTtl : ttl;

    // 缓存空值（防止穿透）
    if (isNull && cacheNull) {
      if (enableL1) {
        globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, l1Ttl);
      }
      if (enableL2 && isRedisAvailable()) {
        try {
          const redis = getRedisClient();
          if (redis) {
            await redis.setex(cacheKey, effectiveTtl, NULL_MARKER);
          }
        } catch (error) {
          cacheStats.errors++;
          console.error('[Cache] Redis 写入空值失败:', error);
        }
      }
    } else if (!isNull) {
      // 缓存有效值
      if (enableL1) {
        globalMemoryCache.set(cacheKey, result, l1Ttl);
      }
      if (enableL2 && isRedisAvailable()) {
        try {
          const redis = getRedisClient();
          if (redis) {
            const serialized = typeof result === 'string' ? result : JSON.stringify(result);
            await redis.setex(cacheKey, effectiveTtl, serialized);
          }
        } catch (error) {
          cacheStats.errors++;
          console.error('[Cache] Redis 写入失败:', error);
        }
      }
    }

    return result;

  } catch (error) {
    // 函数执行失败，不缓存
    throw error;
  }
}

// ============================================================================
// 缓存操作 API
// ============================================================================

/**
 * 清除指定缓存键
 */
export async function invalidateCache(key: string): Promise<boolean> {
  // 清除 L1
  const l1Deleted = globalMemoryCache.delete(key);

  // 清除 L2
  let l2Deleted = false;
  if (isRedisAvailable()) {
    try {
      const redis = getRedisClient();
      if (redis) {
        const result = await redis.del(key);
        l2Deleted = result > 0;
      }
    } catch (error) {
      console.error('[Cache] Redis 删除失败:', error);
    }
  }

  return l1Deleted || l2Deleted;
}

/**
 * 按前缀清除缓存
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<number> {
  let count = 0;

  // 清除 L1
  count += globalMemoryCache.deleteByPrefix(prefix);

  // 清除 L2（使用 SCAN）
  if (isRedisAvailable()) {
    try {
      const redis = getRedisClient();
      if (redis) {
        const keys: string[] = [];
        let cursor = '0';

        do {
          const result = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
          cursor = result[0];
          keys.push(...result[1]);
        } while (cursor !== '0');

        if (keys.length > 0) {
          await redis.del(...keys);
          count += keys.length;
        }
      }
    } catch (error) {
      console.error('[Cache] Redis 批量删除失败:', error);
    }
  }

  return count;
}

/**
 * 获取缓存统计
 */
export function getCacheStats(): CacheStatistics & { hitRate: number } {
  const total = cacheStats.hits + cacheStats.misses;
  return {
    ...cacheStats,
    hitRate: total > 0 ? cacheStats.hits / total : 0,
  };
}

/**
 * 重置缓存统计
 */
export function resetCacheStats(): void {
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.l1Hits = 0;
  cacheStats.l2Hits = 0;
  cacheStats.nullHits = 0;
  cacheStats.errors = 0;
}

/**
 * 清空 L1 缓存
 */
export function clearL1Cache(): void {
  globalMemoryCache.clear();
}

/**
 * 获取 L1 缓存大小
 */
export function getL1CacheSize(): number {
  return globalMemoryCache.size();
}

/**
 * 批量预热缓存
 *
 * @param items 预热项列表
 * @param options 缓存选项
 */
export async function warmupCache<T>(
  items: Array<{ key: string; value: T; ttl?: number }>,
  options: { enableL1?: boolean; l1Ttl?: number; enableL2?: boolean } = {},
): Promise<void> {
  const { enableL1 = true, l1Ttl = 60, enableL2 = true } = options;

  for (const item of items) {
    const ttl = item.ttl ?? 300;

    // L1
    if (enableL1) {
      globalMemoryCache.set(item.key, item.value, l1Ttl);
    }

    // L2
    if (enableL2 && isRedisAvailable()) {
      try {
        const redis = getRedisClient();
        if (redis) {
          const serialized = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          await redis.setex(item.key, ttl, serialized);
        }
      } catch (error) {
        console.error('[Cache] 预热写入 Redis 失败:', error);
      }
    }
  }
}
