/**
 * API 客户端 — 可插拔中间件
 *
 * 提供常见的请求处理中间件：认证刷新、请求去重、响应缓存、自动重试、
 * 日志记录。中间件可按需组合。
 *
 * 注意：这些函数返回的是 `(config, next) => Promise<HttpResponse>` 的
 * 闭包，通常由外层 HttpClient 的中间件管道在 request 中调用。
 *
 * @module @yunshu/api-client/core/middlewares
 */

import type {
  RequestConfig,
  HttpResponse,
  AuthConfig,
  CacheOptions,
  RetryConfig,
} from '../types';

// ============================================================================
// 共享工具
// ============================================================================

/**
 * 将 params 序列化为稳定的缓存 key 前缀（注意这只是简单的指纹）
 */
function fingerprint(value: unknown): string {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return String(value);
  }
}

// ============================================================================
// Token 认证中间件
// ============================================================================

/**
 * 创建 Token 认证中间件
 *
 * 自动在请求头中添加 Bearer Token， 并在 Token 过期（401）时自动
 * 尝试刷新。使用 `isRefreshing` + Promise 模式避免并发刷新。
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
      // 401 且不是刷新请求本身：尝试刷新 Token
      const err = error as { status?: number };
      if (err.status === 401 && token && !reqConfig.url?.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken();
        }

        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
          reqConfig.headers = {
            ...reqConfig.headers,
            [headerName]: `${tokenPrefix}${newToken}`,
          };
          return next(reqConfig);
        }

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
 * 在指定时间窗口内，相同的 GET 请求只发送一次，后续请求共享同一 Promise。
 */
export function createDedupMiddleware(windowMs = 1000) {
  const pending = new Map<string, Promise<HttpResponse>>();

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    const method = (config.method ?? 'GET').toUpperCase();
    if (method !== 'GET') {
      return next(config);
    }

    const key = `${method}:${config.url}:${fingerprint(config.params)}`;

    if (pending.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  data: HttpResponse;
  timestamp: number;
  ttl: number;
}

/**
 * 创建响应缓存中间件
 *
 * 对 GET 请求结果进行内存缓存，支持 TTL。
 */
export function createCacheMiddleware(options: CacheOptions = {}) {
  const { enabled = true, ttl = 5 * 60 * 1000 } = options;
  const store = new Map<string, CacheEntry>();

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    const method = (config.method ?? 'GET').toUpperCase();
    if (method !== 'GET' || !enabled) {
      return next(config);
    }

    const key = `${method}:${config.url}:${fingerprint(config.params)}`;
    const cached = store.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const response = await next(config);
    store.set(key, { data: response, timestamp: Date.now(), ttl });
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
export function createRetryMiddleware(config: RetryConfig = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    retryOnStatus = [408, 429, 502, 503, 504],
    backoffMultiplier = 2,
  } = config;

  return async (
    config_: RequestConfig,
    next: (c: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await next(config_);
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

    // 理论不会到达，保留兜底
    throw lastError;
  };
}

// ============================================================================
// 日志中间件
// ============================================================================

/**
 * 创建请求日志中间件
 */
export function createLoggingMiddleware(logger?: (msg: string, data?: unknown) => void) {
  const log = logger ?? ((msg: string) => {
    // eslint-disable-next-line no-console
    console.log(msg);
  });

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
