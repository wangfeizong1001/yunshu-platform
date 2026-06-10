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
  getCacheSimpleStats,
  resetCacheStats,
  clearL1Cache,
  getL1CacheSize,
  warmupCache,
  getCacheReport,
} from './cache/CacheDecorator';

export type { CacheOptions, CacheReport, CacheStatistics } from './cache/CacheDecorator';

// 布隆过滤器（缓存穿透防护）
export {
  initBloomFilter,
  createBloomFilter,
  createRedisBloomFilter,
  bloomAdd,
  bloomAddAll,
  bloomMightContain,
  bloomCheckAndAdd,
  bloomClear,
  bloomGetStats,
} from './cache/BloomFilter';

export type { BloomFilterStats } from './cache/BloomFilter';

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

// ============================================================================
// 配置管理
// ============================================================================

export { ConfigService, getConfig, validateConfig } from './config/ConfigService';
export type {
  AppConfig,
  ServerConfig,
  PostgresDbConfig,
  RedisCacheConfig,
  AuthConfig,
  AppMetaConfig,
  CacheConfig as AppCacheConfig,
} from './config/ConfigService';

// ============================================================================
// 工具模块（JWT / 密码哈希 / 随机密钥）
// ============================================================================

export {
  signToken,
  verifyToken,
  decodeToken,
  decodeTokenUnsafe,
  generateSecureSecret,
  hashPassword,
  comparePassword,
  extractBearerToken,
} from './utils/jwt';

export type { JWTPayload, SignOptions, VerifyOptions } from './utils/jwt';

// ============================================================================
// 日志与安全工具
// ============================================================================

export { logger, setLogLevel } from './utils/logger';
export type { LogLevel, LogContext } from './utils/logger';

// 结构化 Logger（推荐新项目使用）
export {
  Logger,
  rootLogger,
  setLogLevel as setLoggerLevel,
  getLogLevel,
} from './logger/Logger';
export type {
  LogLevel as StructuredLogLevel,
  LogContext as StructuredLogContext,
} from './logger/Logger';

export { safeJsonParse, safeJsonStringify } from './utils/safeJson';
