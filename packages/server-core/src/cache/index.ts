/**
 * 缓存模块入口
 *
 * 整合所有缓存相关功能：
 * - Redis 客户端管理
 * - 二级缓存装饰器
 * - 分布式锁
 * - 缓存预热
 *
 * @module @yunshu/server-core/cache
 */

// ============================================================================
// Redis 客户端
// ============================================================================

export {
  RedisClientManager,
  getRedisClient,
  isRedisAvailable,
  initRedis,
  closeRedis,
} from './RedisClient';

export type { RedisConfig, RedisClientStatus, RedisHealthCheckResult } from './RedisClient';

// ============================================================================
// 二级缓存装饰器
// ============================================================================

export {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
} from './CacheDecorator';

export type { CacheOptions } from './CacheDecorator';

// ============================================================================
// 分布式锁
// ============================================================================

export {
  acquireLock,
  withLock,
  tryWithLock,
  isLocked,
  forceReleaseLock,
  getLockStats,
  resetLockStats,
} from './DistributedLock';

export type { LockOptions, LockInstance } from './DistributedLock';

// ============================================================================
// 缓存预热
// ============================================================================

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
