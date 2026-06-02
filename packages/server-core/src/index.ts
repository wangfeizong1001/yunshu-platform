/**
 * 云枢中台 — 后端核心基础设施
 *
 * 框架无关的后端公共层，可与 Express、NestJS、Fastify 等任意框架配合。
 *
 * @module @yunshu/server-core
 */

// ============================================================================
// 错误体系
// ============================================================================

export { BusinessError, ErrorCode, getStatusCodeByErrorCode } from './errors/BusinessError';

// ============================================================================
// BaseService
// ============================================================================

export { BaseService } from './base/BaseService';
export type { BaseServiceConfig, PaginateConfig } from './base/BaseService';

// ============================================================================
// 装饰器
// ============================================================================

export {
  withCache,
  withLog,
  withPerformance,
  invalidateCache,
  invalidateCacheByPrefix,
  getCacheStats,
} from './decorators/index';

export type { CacheOptions, LogOptions, PerformanceOptions } from './decorators/index';
