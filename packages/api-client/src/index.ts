/**
 * 云枢中台 — API 客户端
 *
 * 框架无关的 HTTP 客户端核心 + 适配器 + 中间件 + 框架集成。
 *
 * @module @yunshu/api-client
 */

// ============================================================================
// 核心
// ============================================================================

export { HttpClient } from './core/HttpClient';
export type { HttpClientOptions } from './core/HttpClient';

export { BaseAPI } from './core/BaseAPI';
export type { PaginationParams, ListResponse, FilterParams } from './core/BaseAPI';

// ============================================================================
// 类型
// ============================================================================

export type {
  RequestConfig,
  HttpResponse,
  IHttpAdapter,
  CacheOptions,
  DedupConfig,
  RetryConfig,
  AuthConfig,
  ApiResponse,
} from './core/types';

export { RequestError } from './core/types';

// ============================================================================
// 中间件
// ============================================================================

export {
  createAuthMiddleware,
  createDedupMiddleware,
  createCacheMiddleware,
  createRetryMiddleware,
  createLoggingMiddleware,
} from './core/middlewares';

// ============================================================================
// 适配器
// ============================================================================

export { AxiosAdapter } from './adapters/axios/AxiosAdapter';
export type { AxiosAdapterOptions } from './adapters/axios/AxiosAdapter';

export { FetchAdapter } from './adapters/fetch/FetchAdapter';
export type { FetchAdapterOptions } from './adapters/fetch/FetchAdapter';
