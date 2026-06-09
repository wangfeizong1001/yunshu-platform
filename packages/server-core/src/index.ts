/**
 * 云枢中台 — 后端核心基础设施
 *
 * 框架无关的后端公共层，可与 Express、NestJS、Fastify 等任意框架配合。
 * 基于 PostgreSQL + Redis 构建，提供完整的缓存、分布式锁、数据访问能力。
 *
 * @module @yunshu/server-core
 */

// 错误体系
export { BusinessError, ErrorCode, getStatusCodeByErrorCode } from './errors/BusinessError';

// 数据访问层
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

export { PostgresRepository } from './repositories/PostgresRepository';
export type { PostgresRepositoryConfig } from './repositories/PostgresRepository';

export { PostgresQueryBuilder } from './repositories/PostgresQueryBuilder';
export type { PostgresQueryBuilderConfig } from './repositories/PostgresQueryBuilder';

// 数据库连接
export {
  PostgresClientManager,
  getPostgresPool,
  isPostgresAvailable,
  initPostgres,
  closePostgres,
  withTransaction,
} from './database/PostgresClient';

export type { PostgresConfig, PostgresHealthCheckResult, TransactionOptions } from './database/PostgresClient';

// BaseService
export { BaseService } from './base/BaseService';
export type { BaseServiceConfig, PaginateConfig } from './base/BaseService';

// 装饰器
export { withLog, withPerformance } from './decorators/index';
export type { LogOptions, PerformanceOptions } from './decorators/index';

// 缓存模块
export {
  initRedis,
  closeRedis,
  getRedisClient,
  isRedisAvailable,
  getRedisStatus,
  healthCheck,
  RedisClientManager,
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
  getCacheSimpleStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
  initBloomFilter,
  createBloomFilter,
  bloomAdd,
  bloomAddAll,
  bloomMightContain,
  bloomCheckAndAdd,
  bloomClear,
  bloomGetStats,
  acquireLock,
  releaseLock,
  isLocked,
  forceReleaseLock,
  withLock,
  tryWithLock,
  getLockStats,
  resetLockStats,
  CacheWarmupManager,
  getWarmupManager,
  resetWarmupManager,
  registerWarmupTask,
  executeWarmup,
  startWarmupManager,
  stopWarmupManager,
} from './cache';

export type {
  RedisConfig,
  RedisClientStatus,
  RedisHealthCheckResult,
  CacheOptions,
  CacheStatistics,
  CacheReport,
  BloomFilterStats,
  LockOptions,
  LockInstance,
  WarmupTask,
  WarmupTaskStatus,
  WarmupManagerConfig,
} from './cache';

// 数据迁移
export {
  MigrationUtils,
  AUDIT_COLUMNS,
  AUDIT_INDEXES,
  createAuditableTable,
} from './migrations';

export type {
  TableDefinition,
  ColumnDefinition,
  IndexDefinition,
  ForeignKeyDefinition,
  MigrationResult,
} from './migrations';
