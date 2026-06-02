/**
 * API 客户端 — 可插拔中间件
 *
 * 提供常见的请求处理中间件，可按需组合使用。
 *
 * @module @yunshu/api-client/core/middlewares
 */

import type { RequestConfig, HttpResponse, AuthConfig } from '../types';

// ============================================================================
// Token 认证中间件
// ============================================================================

/**
 * 创建 Token 认证中间件
 *
 * 自动在请求头中添加 Bearer Token，
 * 并在 Token 过期时尝试刷新。
 */
export function createAuthMiddleware(config: AuthConfig) {
  const {
    getToken,
    refreshToken,
    onRefreshFailed,
    headerName = 'Authorization',
    tokenPrefix = 'Bearer ',
  } = config;

  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;

  return async (
    reqConfig: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    // 添加 Token
    const token = getToken();
    if (token) {
      reqConfig.headers = {
        ...reqConfig.headers,
        [headerName]: `${tokenPrefix}${token}`,
      };
    }

    try {
      return await next(reqConfig);
    } catch (error: unknown) {
      // 如果是 401 且不是刷新请求本身，尝试刷新 Token
      const err = error as { status?: number };
      if (err.status === 401 && token && !reqConfig.url?.includes('/auth/refresh')) {
        // 避免并发刷新
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken();
        }

        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
          // 用新 Token 重试
          reqConfig.headers = {
            ...reqConfig.headers,
            [headerName]: `${tokenPrefix}${newToken}`,
          };
          return next(reqConfig);
        }

        // 刷新失败
        onRefreshFailed?.();
      }
      throw error;
    }
  };
}

// ============================================================================
// 请求去重中间件
// ============================================================================

/**
 * 创建请求去重中间件
 *
 * 在指定时间窗口内，相同的 GET 请求只发送一次。
 */
export function createDedupMiddleware(windowMs = 1000) {
  const pending = new Map<string, Promise<HttpResponse>>();

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    if (config.method && config.method !== 'GET') {
      return next(config);
    }

    const key = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;

    if (pending.has(key)) {
      return pending.get(key)!;
    }

    const promise = next(config).finally(() => {
      setTimeout(() => pending.delete(key), windowMs);
    });

    pending.set(key, promise);
    return promise;
  };
}

// ============================================================================
// 响应缓存中间件
// ============================================================================

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

/**
 * 创建响应缓存中间件
 *
 * 对 GET 请求结果进行内存缓存。
 */
export function createCacheMiddleware(defaultTTL = 5 * 60 * 1000) {
  const store = new Map<string, CacheEntry>();

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    if (config.method && config.method !== 'GET') {
      return next(config);
    }

    const key = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
    const cached = store.get(key);

    if (cached && Date.now() - cached.timestamp < defaultTTL) {
      return cached.data as HttpResponse;
    }

    const response = await next(config);
    store.set(key, { data: response, timestamp: Date.now() });
    return response;
  };
}

// ============================================================================
// 重试中间件
// ============================================================================

/**
 * 创建请求重试中间件
 *
 * 对可重试的 HTTP 状态码自动重试，支持指数退避。
 */
export function createRetryMiddleware(options?: {
  maxRetries?: number;
  delay?: number;
  retryOnStatus?: number[];
  backoffMultiplier?: number;
}) {
  const {
    maxRetries = 3,
    delay = 1000,
    retryOnStatus = [408, 429, 502, 503, 504],
    backoffMultiplier = 2,
  } = options ?? {};

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await next(config);
      } catch (error: unknown) {
        lastError = error;
        const err = error as { status?: number };

        // 不可重试的状态码，直接抛出
        if (err.status && !retryOnStatus.includes(err.status)) {
          throw error;
        }

        // 最后一次尝试，抛出错误
        if (attempt === maxRetries) {
          throw error;
        }

        // 等待后重试（指数退避）
        const waitTime = delay * Math.pow(backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  };
}

// ============================================================================
// 日志中间件
// ============================================================================

/**
 * 创建请求日志中间件
 */
export function createLoggingMiddleware(logFn?: (msg: string, data?: unknown) => void) {
  const log = logFn ?? console.log;

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    const start = Date.now();
    const label = `${config.method ?? 'GET'} ${config.url}`;

    try {
      const response = await next(config);
      const duration = Date.now() - start;
      log(`[API] ${label} → ${response.status} (${duration}ms)`);
      return response;
    } catch (error: unknown) {
      const duration = Date.now() - start;
      const err = error as { status?: number; message?: string };
      log(`[API] ${label} → ✕ ${err.status ?? 'ERR'} (${duration}ms) ${err.message ?? ''}`);
      throw error;
    }
  };
}
