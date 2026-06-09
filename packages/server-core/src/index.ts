/**
 * 云枢中台 — 后端核心基础设施
 *
 * 框架无关的后端公共层，可与 Express、NestJS、Fastify 等任意框架配合。
 * 默认使用 PostgreSQL 作为数据库，通过 IRepository 接口支持多种数据库适配器。
 *
 * @module @yunshu/server-core
 */

// ============================================================================
// 错误体系
// ============================================================================

export { BusinessError, ErrorCode, getStatusCodeByErrorCode } from './errors/BusinessError';

// ============================================================================
// 数据访问层
// ============================================================================

// 接口定义
export type {
  IEntity,
  ISoftDelete,
  QueryOperator,
  QueryCondition,
  SortConfig,
  PopulateConfig,
  QueryConfig,
  IRepository,
  IRepositoryFactory,
  IQueryBuilder,
} from './repositories/IRepository';

// PostgreSQL 实现
export { PostgresRepository } from './repositories/PostgresRepository';
export type { PostgresRepositoryConfig } from './repositories/PostgresRepository';

export { PostgresQueryBuilder } from './repositories/PostgresQueryBuilder';
export type { PostgresQueryBuilderConfig } from './repositories/PostgresQueryBuilder';

// ============================================================================
// 数据库连接
// ============================================================================

export {
  PostgresClientManager,
  getPostgresPool,
  isPostgresAvailable,
  initPostgres,
  closePostgres,
  withTransaction,
} from './database/PostgresClient';

export type {
  PostgresConfig,
  PostgresHealthCheckResult,
  TransactionOptions,
} from './database/PostgresClient';

// ============================================================================
// BaseService
// ============================================================================

export { BaseService } from './base/BaseService';
export type { BaseServiceConfig, PaginateConfig } from './base/BaseService';

// ============================================================================
// 装饰器（日志、性能监控）
// ============================================================================

export {
  withLog,
  withPerformance,
} from './decorators/index';

export type { LogOptions, PerformanceOptions } from './decorators/index';

// ============================================================================
// 缓存模块（Redis + 二级缓存 + 分布式锁 + 预热）
// ============================================================================

// Redis 客户端
export {
  RedisClientManager,
  getRedisClient,
  isRedisAvailable,
  initRedis,
  closeRedis,
} from './cache/RedisClient';

export type {
  RedisConfig,
  RedisClientStatus,
  RedisHealthCheckResult,
} from './cache/RedisClient';

// 二级缓存装饰器
export {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
} from './cache/CacheDecorator';

export type { CacheOptions } from './cache/CacheDecorator';

// 分布式锁
export {
  acquireLock,
  withLock,
  tryWithLock,
  isLocked,
  forceReleaseLock,
  getLockStats,
  resetLockStats,
} from './cache/DistributedLock';

export type {
  LockOptions,
  LockInstance,
} from './cache/DistributedLock';

// 缓存预热
export {
  CacheWarmupManager,
  getWarmupManager,
  resetWarmupManager,
  registerWarmupTask,
  executeWarmup,
  startWarmupManager,
  stopWarmupManager,
} from './cache/CacheWarmup';

export type {
  WarmupTask,
  WarmupTaskStatus,
  WarmupManagerConfig,
} from './cache/CacheWarmup';
