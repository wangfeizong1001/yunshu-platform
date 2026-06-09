/**
 * 缓存模块入口
 *
 * @module @yunshu/server-core/cache
 */

// Redis 客户端
export {
  initRedis,
  closeRedis,
  getRedisClient,
  isRedisAvailable,
  getRedisStatus,
  healthCheck,
  RedisClientManager,
} from './RedisClient';

export type { RedisConfig, RedisClientStatus, RedisHealthCheckResult } from './RedisClient';

// 二级缓存
export {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
  getCacheSimpleStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
} from './CacheDecorator';

export type { CacheOptions, CacheStatistics, CacheReport } from './CacheDecorator';

// 布隆过滤器
export {
  initBloomFilter,
  createBloomFilter,
  bloomAdd,
  bloomAddAll,
  bloomMightContain,
  bloomCheckAndAdd,
  bloomClear,
  bloomGetStats,
} from './BloomFilter';

export type { BloomFilterStats } from './BloomFilter';

// 分布式锁
export {
  acquireLock,
  releaseLock,
  isLocked,
  forceReleaseLock,
  withLock,
  tryWithLock,
  getLockStats,
  resetLockStats,
} from './DistributedLock';

export type { LockOptions, LockInstance } from './DistributedLock';

// 缓存预热
export {
  CacheWarmupManager,
  getWarmupManager,
  resetWarmupManager,
  registerWarmupTask,
  executeWarmup,
  startWarmupManager,
  stopWarmupManager,
} from './CacheWarmup';

export type { WarmupTask, WarmupTaskStatus, WarmupManagerConfig } from './CacheWarmup';
