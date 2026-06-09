/**
 * 二级缓存装饰器模块
 *
 * 实现 L1（内存）+ L2（Redis）二级缓存架构。
 *
 * @module @yunshu/server-core/cache/CacheDecorator
 */

import { getRedisClient, isRedisAvailable } from './RedisClient';
import { bloomMightContain, bloomCheckAndAdd } from './BloomFilter';

interface CacheEntry<T> {
  value: T;
  expireAt: number;
}

/** 缓存选项 */
export interface CacheOptions {
  keyPrefix: string;
  ttl?: number;
  ttlJitter?: number;
  keyGenerator?: (...args: unknown[]) => string;
  cacheNull?: boolean;
  nullTtl?: number;
  enableL1?: boolean;
  l1Ttl?: number;
  enableL2?: boolean;
  enableBloomFilter?: boolean;
  hotKeyThreshold?: number;
  hotKeyLockTimeout?: number;
}

/** 缓存统计 */
export interface CacheStatistics {
  total: number;
  hits: number;
  misses: number;
  l1Hits: number;
  l2Hits: number;
  nullHits: number;
  bloomFiltered: number;
  bloomFalsePositives: number;
  hotKeyProtected: number;
  errors: number;
  totalLatencyMs: number;
  l1LatencyMs: number;
  l2LatencyMs: number;
  missLatencyMs: number;
}

/** 缓存监控报告 */
export interface CacheReport {
  hitRate: number;
  l1HitRate: number;
  l2HitRate: number;
  layerDistribution: { l1: number; l2: number; miss: number; bloomFiltered: number };
  avgLatency: { l1: number; l2: number; miss: number; overall: number };
  stats: CacheStatistics;
}

// LRU 内存缓存
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

// TTL 抖动
function applyTtlJitter(baseTtl: number, jitter: number = 0.1): number {
  if (jitter <= 0) return baseTtl;
  const safeJitter = Math.min(jitter, 0.5);
  const delta = baseTtl * safeJitter * (Math.random() * 2 - 1);
  const result = baseTtl + delta;
  return Math.max(1, Math.round(result));
}

// 热点 Key 保护
const hotKeyCounter = new Map<string, { count: number; resetAt: number }>();
const hotKeyWaiters = new Map<string, Promise<unknown>>();

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

function clearHotKeyCounter(key: string): void {
  hotKeyCounter.delete(key);
  hotKeyWaiters.delete(key);
}

// 全局实例
const globalMemoryCache = new MemoryLRUCache();
const NULL_MARKER = '__NULL__';

const cacheStats: CacheStatistics = {
  total: 0, hits: 0, misses: 0, l1Hits: 0, l2Hits: 0, nullHits: 0,
  bloomFiltered: 0, bloomFalsePositives: 0, hotKeyProtected: 0, errors: 0,
  totalLatencyMs: 0, l1LatencyMs: 0, l2LatencyMs: 0, missLatencyMs: 0,
};

const latencyCounter = { l1Count: 0, l2Count: 0, missCount: 0 };

/** 缓存装饰器 — 二级缓存架构 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions,
): (...args: TArgs) => Promise<TResult> {
  const {
    keyPrefix, ttl = 300, ttlJitter = 0.1, keyGenerator,
    cacheNull = true, nullTtl = 60, enableL1 = true, l1Ttl = 60,
    enableL2 = true, enableBloomFilter = false, hotKeyThreshold = 5, hotKeyLockTimeout = 5000,
  } = options;

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
    const startTime = Date.now();
    cacheStats.total++;

    // 布隆过滤器
    if (enableBloomFilter && !bloomMightContain(cacheKey)) {
      cacheStats.bloomFiltered++;
      cacheStats.totalLatencyMs += Date.now() - startTime;
      return null as TResult;
    }

    // 热点 Key 保护
    if (isHotKey(cacheKey, hotKeyThreshold)) {
      const waiter = hotKeyWaiters.get(cacheKey);
      if (waiter) {
        cacheStats.hotKeyProtected++;
        try {
          const result = await Promise.race([
            waiter as Promise<TResult>,
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('热点 Key 等待超时')), hotKeyLockTimeout)),
          ]);
          cacheStats.totalLatencyMs += Date.now() - startTime;
          return result;
        } catch { /* 等待超时，继续正常处理 */ }
      }
    }

    const processPromise = doProcess(fn, args, cacheKey, {
      ttl, ttlJitter, cacheNull, nullTtl, enableL1, l1Ttl, enableL2, enableBloomFilter,
    });

    hotKeyWaiters.set(cacheKey, processPromise);

    try {
      const result = await processPromise;
      cacheStats.totalLatencyMs += Date.now() - startTime;
      return result;
    } finally {
      clearHotKeyCounter(cacheKey);
    }
  };
}

async function doProcess<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  args: TArgs,
  cacheKey: string,
  config: {
    ttl: number; ttlJitter: number; cacheNull: boolean; nullTtl: number;
    enableL1: boolean; l1Ttl: number; enableL2: boolean; enableBloomFilter: boolean;
  },
): Promise<TResult> {
  const { ttl, ttlJitter, cacheNull, nullTtl, enableL1, l1Ttl, enableL2, enableBloomFilter } = config;

  const effectiveTtl = applyTtlJitter(ttl, ttlJitter);
  const effectiveL1Ttl = applyTtlJitter(l1Ttl, ttlJitter);
  const effectiveNullTtl = applyTtlJitter(nullTtl, ttlJitter);

  // L1 缓存
  if (enableL1) {
    const l1Start = Date.now();
    const l1Result = globalMemoryCache.get<TResult>(cacheKey);
    if (l1Result !== null) {
      cacheStats.hits++;
      cacheStats.l1Hits++;
      latencyCounter.l1Count++;
      cacheStats.l1LatencyMs = cacheStats.l1LatencyMs + (Date.now() - l1Start - cacheStats.l1LatencyMs) / latencyCounter.l1Count;
      if (l1Result === NULL_MARKER as unknown as TResult) {
        cacheStats.nullHits++;
        return null as TResult;
      }
      return l1Result;
    }
  }

  // L2 缓存
  if (enableL2 && isRedisAvailable()) {
    try {
      const redis = getRedisClient();
      if (redis) {
        const l2Start = Date.now();
        const l2Result = await redis.get(cacheKey);
        if (l2Result !== null) {
          cacheStats.hits++;
          cacheStats.l2Hits++;
          latencyCounter.l2Count++;
          cacheStats.l2LatencyMs = cacheStats.l2LatencyMs + (Date.now() - l2Start - cacheStats.l2LatencyMs) / latencyCounter.l2Count;

          if (l2Result === NULL_MARKER) {
            cacheStats.nullHits++;
            if (enableL1) globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, effectiveL1Ttl);
            return null as TResult;
          }

          try {
            const parsed = JSON.parse(l2Result) as TResult;
            if (enableL1) globalMemoryCache.set(cacheKey, parsed, effectiveL1Ttl);
            return parsed;
          } catch {
            if (enableL1) globalMemoryCache.set(cacheKey, l2Result as unknown as TResult, effectiveL1Ttl);
            return l2Result as unknown as TResult;
          }
        }
      }
    } catch (error) {
      cacheStats.errors++;
      console.error('[Cache] Redis 读取失败:', error);
    }
  }

  // 缓存未命中
  cacheStats.misses++;
  const missStart = Date.now();

  try {
    const result = await fn(...args);
    latencyCounter.missCount++;
    cacheStats.missLatencyMs = cacheStats.missLatencyMs + (Date.now() - missStart - cacheStats.missLatencyMs) / latencyCounter.missCount;

    const isNull = result === null || result === undefined;

    if (enableBloomFilter && !isNull) {
      bloomCheckAndAdd(cacheKey);
    }

    if (isNull && cacheNull) {
      if (enableL1) globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, effectiveNullTtl);
      if (enableL2 && isRedisAvailable()) {
        try {
          await getRedisClient()?.setex(cacheKey, effectiveNullTtl, NULL_MARKER);
        } catch (error) {
          cacheStats.errors++;
        }
      }
    } else if (!isNull) {
      if (enableL1) globalMemoryCache.set(cacheKey, result, effectiveL1Ttl);
      if (enableL2 && isRedisAvailable()) {
        try {
          const serialized = typeof result === 'string' ? result : JSON.stringify(result);
          await getRedisClient()?.setex(cacheKey, effectiveTtl, serialized);
        } catch (error) {
          cacheStats.errors++;
        }
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
}

/** 清除指定缓存键 */
export async function invalidateCache(key: string): Promise<boolean> {
  const l1Deleted = globalMemoryCache.delete(key);
  let l2Deleted = false;
  if (isRedisAvailable()) {
    try {
      const result = await getRedisClient()?.del(key);
      l2Deleted = (result ?? 0) > 0;
    } catch (error) {
      cacheStats.errors++;
    }
  }
  return l1Deleted || l2Deleted;
}

/** 按前缀清除缓存 */
export async function invalidateCacheByPrefix(prefix: string): Promise<number> {
  let count = globalMemoryCache.deleteByPrefix(prefix);
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
      cacheStats.errors++;
    }
  }
  return count;
}

/** 获取缓存统计 */
export function getCacheStats(): CacheReport {
  const { total, hits, misses, l1Hits, l2Hits, bloomFiltered } = cacheStats;
  const hitRate = total > 0 ? hits / total : 0;
  const l2Opportunities = total - l1Hits - bloomFiltered;
  const l2HitRate = l2Opportunities > 0 ? l2Hits / l2Opportunities : 0;

  return {
    hitRate,
    l1HitRate: total > 0 ? l1Hits / total : 0,
    l2HitRate,
    layerDistribution: {
      l1: total > 0 ? l1Hits / total : 0,
      l2: total > 0 ? l2Hits / total : 0,
      miss: total > 0 ? misses / total : 0,
      bloomFiltered: total > 0 ? bloomFiltered / total : 0,
    },
    avgLatency: {
      l1: cacheStats.l1LatencyMs,
      l2: cacheStats.l2LatencyMs,
      miss: cacheStats.missLatencyMs,
      overall: total > 0 ? cacheStats.totalLatencyMs / total : 0,
    },
    stats: { ...cacheStats },
  };
}

/** 获取简化统计 */
export function getCacheSimpleStats(): CacheStatistics & { hitRate: number } {
  const total = cacheStats.hits + cacheStats.misses;
  return { ...cacheStats, hitRate: total > 0 ? cacheStats.hits / total : 0 };
}

/** 重置缓存统计 */
export function resetCacheStats(): void {
  Object.assign(cacheStats, {
    total: 0, hits: 0, misses: 0, l1Hits: 0, l2Hits: 0, nullHits: 0,
    bloomFiltered: 0, bloomFalsePositives: 0, hotKeyProtected: 0, errors: 0,
    totalLatencyMs: 0, l1LatencyMs: 0, l2LatencyMs: 0, missLatencyMs: 0,
  });
  latencyCounter.l1Count = 0;
  latencyCounter.l2Count = 0;
  latencyCounter.missCount = 0;
}

/** 清空 L1 缓存 */
export function clearL1Cache(): void {
  globalMemoryCache.clear();
}

/** 获取 L1 缓存大小 */
export function getL1CacheSize(): number {
  return globalMemoryCache.size();
}

/** 批量预热缓存 */
export async function warmupCache<T>(
  items: Array<{ key: string; value: T; ttl?: number }>,
  options: { enableL1?: boolean; l1Ttl?: number; enableL2?: boolean; ttlJitter?: number } = {},
): Promise<void> {
  const { enableL1 = true, l1Ttl = 60, enableL2 = true, ttlJitter = 0.1 } = options;

  for (const item of items) {
    const effectiveTtl = applyTtlJitter(item.ttl ?? 300, ttlJitter);
    const effectiveL1Ttl = applyTtlJitter(l1Ttl, ttlJitter);

    if (enableL1) globalMemoryCache.set(item.key, item.value, effectiveL1Ttl);
    if (enableL2 && isRedisAvailable()) {
      try {
        const serialized = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
        await getRedisClient()?.setex(item.key, effectiveTtl, serialized);
      } catch (error) {
        cacheStats.errors++;
      }
    }
  }
}
