/**
 * 二级缓存装饰器模块（增强版）
 *
 * 实现 L1（内存） + L2（Redis）二级缓存架构，提供完整缓存防护：
 * - 缓存雪崩防护：TTL 随机抖动
 * - 缓存击穿防护：热点 Key 互斥锁
 * - 缓存穿透防护：空值缓存 + 布隆过滤器
 * - 完善的监控统计：命中率、响应时间、层级占比
 *
 * @module @yunshu/server-core/cache/CacheDecorator
 */

import { getRedisClient, isRedisAvailable } from './RedisClient';
import { bloomMightContain, bloomCheckAndAdd } from './BloomFilter';

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
  /** TTL 抖动范围（±百分比，0-0.5），默认 0.1 (±10%)。0 表示禁用 */
  ttlJitter?: number;
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
  /** 是否启用布隆过滤器（缓存穿透防护），默认 false */
  enableBloomFilter?: boolean;
  /** 热点 key 保护阈值（并发请求数），默认 5 */
  hotKeyThreshold?: number;
  /** 热点 key 锁等待超时（毫秒），默认 5000 */
  hotKeyLockTimeout?: number;
}

/**
 * 缓存统计（详细版）
 */
export interface CacheStatistics {
  /** 总请求数 */
  total: number;
  /** 总命中数 */
  hits: number;
  /** 总未命中数 */
  misses: number;
  /** L1 内存命中数 */
  l1Hits: number;
  /** L2 Redis 命中数 */
  l2Hits: number;
  /** 空值命中数 */
  nullHits: number;
  /** 布隆过滤器拦截数（一定不存在） */
  bloomFiltered: number;
  /** 布隆过滤器放行后实际不存在数 */
  bloomFalsePositives: number;
  /** 热点 key 保护触发次数 */
  hotKeyProtected: number;
  /** 错误数 */
  errors: number;
  /** 总响应时间（毫秒） */
  totalLatencyMs: number;
  /** L1 命中平均响应时间（毫秒） */
  l1LatencyMs: number;
  /** L2 命中平均响应时间（毫秒） */
  l2LatencyMs: number;
  /** 未命中时平均响应时间（毫秒，含数据库查询） */
  missLatencyMs: number;
}

/**
 * 缓存监控报告
 */
export interface CacheReport {
  /** 总命中率 */
  hitRate: number;
  /** L1 命中率 */
  l1HitRate: number;
  /** L2 命中率（当 L1 未命中时） */
  l2HitRate: number;
  /** 各级缓存占比 */
  layerDistribution: {
    l1: number;
    l2: number;
    miss: number;
    bloomFiltered: number;
  };
  /** 平均响应时间（毫秒） */
  avgLatency: {
    l1: number;
    l2: number;
    miss: number;
    overall: number;
  };
  /** 原始统计 */
  stats: CacheStatistics;
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
// TTL 抖动
// ============================================================================

/**
 * 计算带随机抖动的 TTL
 *
 * 在基础 TTL 上添加 ±jitter 比例的随机抖动，
 * 避免大量缓存同时过期导致的缓存雪崩。
 *
 * @param baseTtl 基础 TTL（秒）
 * @param jitter 抖动比例（0-0.5）
 * @returns 抖动后的 TTL（秒，整数）
 */
function applyTtlJitter(baseTtl: number, jitter: number = 0.1): number {
  if (jitter <= 0) return baseTtl;
  const safeJitter = Math.min(jitter, 0.5);
  const delta = baseTtl * safeJitter * (Math.random() * 2 - 1);
  const result = baseTtl + delta;
  return Math.max(1, Math.round(result));
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
const NULL_MARKER = '__NULL__';

/**
 * 全局缓存统计
 */
const cacheStats: CacheStatistics = {
  total: 0,
  hits: 0,
  misses: 0,
  l1Hits: 0,
  l2Hits: 0,
  nullHits: 0,
  bloomFiltered: 0,
  bloomFalsePositives: 0,
  hotKeyProtected: 0,
  errors: 0,
  totalLatencyMs: 0,
  l1LatencyMs: 0,
  l2LatencyMs: 0,
  missLatencyMs: 0,
};

/**
 * 各层级请求计数，用于计算平均响应时间
 */
const latencyCounter = {
  l1Count: 0,
  l2Count: 0,
  missCount: 0,
};

// ============================================================================
// 缓存装饰器
// ============================================================================

/**
 * 缓存装饰器 — 二级缓存架构（增强版）
 *
 * 查询路径: L1（内存） -> L2（Redis） -> 原函数 -> 缓存回填
 * 防护措施: 布隆过滤器（穿透）、TTL 抖动（雪崩）、热点 Key 锁（击穿）
 *
 * @example
 * ```typescript
 * const cachedGetUser = withCache(
 *   async (id: string) => await userService.findById(id),
 *   {
 *     keyPrefix: 'user',
 *     ttl: 300,
 *     ttlJitter: 0.1,
 *     enableBloomFilter: true,
 *   }
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
    ttlJitter = 0.1,
    keyGenerator,
    cacheNull = true,
    nullTtl = 60,
    enableL1 = true,
    l1Ttl = 60,
    enableL2 = true,
    enableBloomFilter = false,
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
    const startTime = Date.now();
    cacheStats.total++;

    // 布隆过滤器：快速判断一定不存在
    if (enableBloomFilter) {
      if (!bloomMightContain(cacheKey)) {
        cacheStats.bloomFiltered++;
        const latency = Date.now() - startTime;
        cacheStats.totalLatencyMs += latency;
        return null as TResult;
      }
    }

    // 热点 Key 保护：如果有请求正在处理，等待其结果
    if (isHotKey(cacheKey, hotKeyThreshold)) {
      const waiter = hotKeyWaiters.get(cacheKey);
      if (waiter) {
        cacheStats.hotKeyProtected++;
        try {
          const result = await Promise.race([
            waiter as Promise<TResult>,
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('热点 Key 等待超时')), hotKeyLockTimeout),
            ),
          ]);
          const latency = Date.now() - startTime;
          cacheStats.totalLatencyMs += latency;
          return result;
        } catch {
          // 等待超时，继续正常处理
        }
      }
    }

    // 创建处理 Promise 用于热点 Key 共享
    const processPromise = doProcess(fn, args, cacheKey, {
      ttl,
      ttlJitter,
      cacheNull,
      nullTtl,
      enableL1,
      l1Ttl,
      enableL2,
      enableBloomFilter,
    });

    hotKeyWaiters.set(cacheKey, processPromise);

    try {
      const result = await processPromise;
      const latency = Date.now() - startTime;
      cacheStats.totalLatencyMs += latency;
      return result;
    } finally {
      clearHotKeyCounter(cacheKey);
    }
  };
}

// ============================================================================
// 缓存处理逻辑
// ============================================================================

async function doProcess<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  args: TArgs,
  cacheKey: string,
  config: {
    ttl: number;
    ttlJitter: number;
    cacheNull: boolean;
    nullTtl: number;
    enableL1: boolean;
    l1Ttl: number;
    enableL2: boolean;
    enableBloomFilter: boolean;
  },
): Promise<TResult> {
  const { ttl, ttlJitter, cacheNull, nullTtl, enableL1, l1Ttl, enableL2, enableBloomFilter } =
    config;

  // TTL 抖动：防止缓存雪崩
  const effectiveTtl = applyTtlJitter(ttl, ttlJitter);
  const effectiveL1Ttl = applyTtlJitter(l1Ttl, ttlJitter);
  const effectiveNullTtl = applyTtlJitter(nullTtl, ttlJitter);

  // 1. 尝试 L1 缓存（内存）
  if (enableL1) {
    const l1Start = Date.now();
    const l1Result = globalMemoryCache.get<TResult>(cacheKey);
    if (l1Result !== null) {
      cacheStats.hits++;
      cacheStats.l1Hits++;
      const l1Latency = Date.now() - l1Start;

      // 更新 L1 平均响应时间
      latencyCounter.l1Count++;
      cacheStats.l1LatencyMs =
        cacheStats.l1LatencyMs + (l1Latency - cacheStats.l1LatencyMs) / latencyCounter.l1Count;

      // 检查是否为空值标记
      if (l1Result === (NULL_MARKER as unknown as TResult)) {
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
        const l2Start = Date.now();
        const l2Result = await redis.get(cacheKey);
        if (l2Result !== null) {
          cacheStats.hits++;
          cacheStats.l2Hits++;
          const l2Latency = Date.now() - l2Start;
          latencyCounter.l2Count++;
          cacheStats.l2LatencyMs =
            cacheStats.l2LatencyMs + (l2Latency - cacheStats.l2LatencyMs) / latencyCounter.l2Count;

          // 检查是否为空值标记
          if (l2Result === NULL_MARKER) {
            cacheStats.nullHits++;
            if (enableL1) {
              globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, effectiveL1Ttl);
            }
            return null as TResult;
          }

          // 解析 JSON
          try {
            const parsed = JSON.parse(l2Result) as TResult;
            // 回填 L1
            if (enableL1) {
              globalMemoryCache.set(cacheKey, parsed, effectiveL1Ttl);
            }
            return parsed;
          } catch {
            // 非 JSON，直接返回
            const value = l2Result as unknown as TResult;
            if (enableL1) {
              globalMemoryCache.set(cacheKey, value, effectiveL1Ttl);
            }
            return value;
          }
        }
      }
    } catch (error) {
      cacheStats.errors++;
      console.error('[Cache] Redis 读取失败:', error);
    }
  }

  // 3. 缓存未命中，执行原函数
  cacheStats.misses++;
  const missStart = Date.now();

  try {
    const result = await fn(...args);
    const missLatency = Date.now() - missStart;
    latencyCounter.missCount++;
    cacheStats.missLatencyMs =
      cacheStats.missLatencyMs +
      (missLatency - cacheStats.missLatencyMs) / latencyCounter.missCount;

    // 4. 缓存结果
    const isNull = result === null || result === undefined;

    // 更新布隆过滤器（如果启用）
    if (enableBloomFilter && !isNull) {
      bloomCheckAndAdd(cacheKey);
    }

    // 缓存空值（防止穿透）
    if (isNull && cacheNull) {
      if (enableL1) {
        globalMemoryCache.set(cacheKey, NULL_MARKER as unknown as TResult, effectiveNullTtl);
      }
      if (enableL2 && isRedisAvailable()) {
        try {
          const redis = getRedisClient();
          if (redis) {
            await redis.setex(cacheKey, effectiveNullTtl, NULL_MARKER);
          }
        } catch (error) {
          cacheStats.errors++;
          console.error('[Cache] Redis 写入空值失败:', error);
        }
      }
    } else if (!isNull) {
      // 缓存有效值
      if (enableL1) {
        globalMemoryCache.set(cacheKey, result, effectiveL1Ttl);
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
      cacheStats.errors++;
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
      cacheStats.errors++;
      console.error('[Cache] Redis 批量删除失败:', error);
    }
  }

  return count;
}

// ============================================================================
// 统计与监控 API
// ============================================================================

/**
 * 获取缓存统计
 */
export function getCacheStats(): CacheReport {
  const {
    total,
    hits,
    misses,
    l1Hits,
    l2Hits,
    nullHits,
    bloomFiltered,
    hotKeyProtected,
    errors,
    totalLatencyMs,
    l1LatencyMs,
    l2LatencyMs,
    missLatencyMs,
  } = cacheStats;

  const hitRate = total > 0 ? hits / total : 0;
  const l1HitRate = total > 0 ? l1Hits / total : 0;

  // L2 命中率：当 L1 未命中后，L2 命中的比例
  const l2Opportunities = total - l1Hits - bloomFiltered;
  const l2HitRate = l2Opportunities > 0 ? l2Hits / l2Opportunities : 0;

  // 各级缓存占比
  const layerDistribution = {
    l1: total > 0 ? l1Hits / total : 0,
    l2: total > 0 ? l2Hits / total : 0,
    miss: total > 0 ? misses / total : 0,
    bloomFiltered: total > 0 ? bloomFiltered / total : 0,
  };

  // 平均响应时间
  const avgLatency = {
    l1: l1LatencyMs,
    l2: l2LatencyMs,
    miss: missLatencyMs,
    overall: total > 0 ? totalLatencyMs / total : 0,
  };

  return {
    hitRate,
    l1HitRate,
    l2HitRate,
    layerDistribution,
    avgLatency,
    stats: { ...cacheStats },
  };
}

/**
 * 获取简化统计（保持向后兼容）
 */
export function getCacheSimpleStats(): CacheStatistics & { hitRate: number } {
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
  cacheStats.total = 0;
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.l1Hits = 0;
  cacheStats.l2Hits = 0;
  cacheStats.nullHits = 0;
  cacheStats.bloomFiltered = 0;
  cacheStats.bloomFalsePositives = 0;
  cacheStats.hotKeyProtected = 0;
  cacheStats.errors = 0;
  cacheStats.totalLatencyMs = 0;
  cacheStats.l1LatencyMs = 0;
  cacheStats.l2LatencyMs = 0;
  cacheStats.missLatencyMs = 0;
  latencyCounter.l1Count = 0;
  latencyCounter.l2Count = 0;
  latencyCounter.missCount = 0;
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
 * 生成缓存监控报告（格式化输出）
 */
export function getCacheReport(format: 'json' | 'text' = 'text'): string {
  const report = getCacheStats();

  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const ms = (v: number) => `${v.toFixed(2)}ms`;

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       缓存监控报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

总请求数: ${report.stats.total}
总命中率: ${pct(report.hitRate)}

┌─────────────────────────────────────┐
│ 层级分布                             │
├─────────────────────────────────────┤
│ L1 (内存)    : ${pct(report.layerDistribution.l1).padEnd(10)} (${report.stats.l1Hits} 次)
│ L2 (Redis)   : ${pct(report.layerDistribution.l2).padEnd(10)} (${report.stats.l2Hits} 次)
│ 未命中        : ${pct(report.layerDistribution.miss).padEnd(10)} (${report.stats.misses} 次)
│ 布隆过滤      : ${pct(report.layerDistribution.bloomFiltered).padEnd(10)} (${report.stats.bloomFiltered} 次)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 平均响应时间                         │
├─────────────────────────────────────┤
│ L1 命中      : ${ms(report.avgLatency.l1)}
│ L2 命中      : ${ms(report.avgLatency.l2)}
│ 未命中查询   : ${ms(report.avgLatency.miss)}
│ 总体平均     : ${ms(report.avgLatency.overall)}
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 其他指标                             │
├─────────────────────────────────────┤
│ 空值命中      : ${report.stats.nullHits} 次
│ 热点 Key 保护 : ${report.stats.hotKeyProtected} 次
│ 错误数        : ${report.stats.errors} 次
│ L1 缓存大小   : ${getL1CacheSize()} 项
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}

// ============================================================================
// 缓存预热
// ============================================================================

/**
 * 批量预热缓存
 *
 * @param items 预热项列表
 * @param options 缓存选项
 */
export async function warmupCache<T>(
  items: Array<{ key: string; value: T; ttl?: number }>,
  options: { enableL1?: boolean; l1Ttl?: number; enableL2?: boolean; ttlJitter?: number } = {},
): Promise<void> {
  const { enableL1 = true, l1Ttl = 60, enableL2 = true, ttlJitter = 0.1 } = options;

  for (const item of items) {
    const baseTtl = item.ttl ?? 300;
    const effectiveTtl = applyTtlJitter(baseTtl, ttlJitter);
    const effectiveL1Ttl = applyTtlJitter(l1Ttl, ttlJitter);

    // L1
    if (enableL1) {
      globalMemoryCache.set(item.key, item.value, effectiveL1Ttl);
    }

    // L2
    if (enableL2 && isRedisAvailable()) {
      try {
        const redis = getRedisClient();
        if (redis) {
          const serialized =
            typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          await redis.setex(item.key, effectiveTtl, serialized);
        }
      } catch (error) {
        cacheStats.errors++;
        console.error('[Cache] 预热失败:', error);
      }
    }
  }
}
