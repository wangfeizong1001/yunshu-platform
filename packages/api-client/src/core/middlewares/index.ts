/**
 * API 客户端 — 可插拔中间件
 *
 * 提供常见的请求处理中间件：认证刷新、CSRF 注入、请求去重、响应缓存、
 * 自动重试、日志记录。中间件可按需组合。
 *
 * @module @yunshu/api-client/core/middlewares
 */

import type { RequestConfig, HttpResponse, CacheOptions, RetryConfig } from '../types';
import { RequestError } from '../types';

// ============================================================================
// Auth 中间件配置类型
// ============================================================================

/**
 * 认证中间件配置
 */
export interface AuthMiddlewareConfig {
  /** 读取当前 token */
  getToken: () => string | null;
  /** 刷新 token，返回新 token；失败时返回 null 或抛错 */
  refreshToken: () => Promise<string | null>;
  /** 刷新失败回调（例如登出、跳转登录页） */
  onRefreshFailed?: () => void;
  /** 请求头名称，默认 'Authorization' */
  headerName?: string;
  /** token 前缀，默认 'Bearer ' */
  tokenPrefix?: string;
}

/**
 * CSRF 中间件配置
 */
export interface CsrfMiddlewareConfig {
  /** cookie 名，默认 'XSRF-TOKEN' */
  cookieName?: string;
  /** 请求头名，默认 'X-XSRF-TOKEN' */
  headerName?: string;
}

/**
 * 日志中间件配置
 */
export interface LoggingMiddlewareConfig {
  /** 自定义日志函数；默认 console.log */
  logger?: (msg: string, data?: unknown) => void;
  /** 日志中响应体截断长度，默认 200 */
  truncateLength?: number;
}

// ============================================================================
// 共享工具
// ============================================================================

/**
 * 将 params 序列化为稳定的 key（按字母排序后 JSON.stringify）
 */
function fingerprint(value: unknown): string {
  try {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'object') return String(value);
    const sorted = sortRecursive(value);
    return JSON.stringify(sorted);
  } catch {
    return String(value);
  }
}

function sortRecursive(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sortRecursive);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      result[k] = sortRecursive(obj[k]);
    }
    return result;
  }
  return value;
}

/**
 * 将任意值序列化为日志友好的短字符串（超长截断）
 */
function truncate(value: unknown, max = 200): string {
  if (value === undefined || value === null) return '';
  let s: string;
  try {
    s = typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    s = String(value);
  }
  if (s.length > max) {
    return s.slice(0, max) + `…[+${s.length - max} 字节]`;
  }
  return s;
}

/**
 * 浏览器环境检测
 */
function isBrowser(): boolean {
  return typeof document !== 'undefined' && !!document.cookie;
}

/**
 * 读取 cookie
 */
function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

// ============================================================================
// Token 认证中间件（带刷新互斥锁 & 锁复位修复）
// ============================================================================

/**
 * 创建 Token 认证中间件
 *
 * - 在请求头中注入 `Authorization: Bearer <token>`
 * - 当服务端返回 401 且未处于刷新过程中时，调用 refreshToken
 * - 并发的多个 401 请求会共享同一刷新 Promise（互斥锁）
 * - ⚠️ 修复：无论 refresh 成功还是失败，最终都会释放锁（isRefreshing → false）
 */
export function createAuthMiddleware(config: AuthMiddlewareConfig) {
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
    // 1. 注入当前 token
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
      // 2. 判断是否为可刷新的 401
      const err = error as { status?: number };
      const is401 = err.status === 401;
      const canRefresh =
        is401 &&
        token &&
        !reqConfig.url?.includes('/auth/refresh') &&
        typeof refreshToken === 'function';

      if (!canRefresh) {
        throw error;
      }

      // 3. 互斥：只有第一个请求发起真实刷新，其他等待
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const newT = await refreshToken();
            return newT;
          } finally {
            // ✅ 无论成功失败，都确保释放锁
            isRefreshing = false;
            refreshPromise = null;
          }
        })();
      }

      // 等待当前正在进行的刷新（不论它是本请求发起的还是兄弟请求发起的）
      const newToken = await refreshPromise;

      if (newToken) {
        // 刷新成功：重放请求
        reqConfig.headers = {
          ...reqConfig.headers,
          [headerName]: `${tokenPrefix}${newToken}`,
        };
        return next(reqConfig);
      }

      // 刷新失败：通知上层
      onRefreshFailed?.();
      throw error instanceof RequestError
        ? error
        : new RequestError('Token 刷新失败', 401, 'TOKEN_REFRESH_FAILED');
    }
  };
}

// ============================================================================
// CSRF 中间件
// ============================================================================

/**
 * 创建 CSRF 中间件
 *
 * - 浏览器环境：从 document.cookie 读取 `cookieName`，注入到 `headerName` 请求头
 * - Node / 非浏览器环境：静默跳过
 */
export function createCsrfMiddleware(config: CsrfMiddlewareConfig = {}) {
  const { cookieName = 'XSRF-TOKEN', headerName = 'X-XSRF-TOKEN' } = config;

  return async (
    reqConfig: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    if (isBrowser()) {
      const token = readCookie(cookieName);
      if (token) {
        reqConfig.headers = {
          ...reqConfig.headers,
          [headerName]: token,
        };
      }
    }
    return next(reqConfig);
  };
}

// ============================================================================
// 请求去重中间件（GET/HEAD 去重）
// ============================================================================

/**
 * 创建请求去重中间件
 *
 * - 在 `windowMs` 时间窗口内，对相同（method+url+排序后的params）请求去重
 * - 仅对 GET / HEAD 生效
 */
export function createDedupMiddleware(windowMs = 1000) {
  const pending = new Map<string, Promise<HttpResponse>>();

  return async (
    config: RequestConfig,
    next: (config: RequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    const method = (config.method ?? 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
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
 * 创建响应缓存中间件（GET 请求，内存缓存 + TTL）
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
 * 创建请求重试中间件（可重试状态码 + 指数退避）
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

        if (err.status && !retryOnStatus.includes(err.status)) {
          throw error;
        }

        if (attempt === maxRetries) {
          throw error;
        }

        const waitTime = delay * Math.pow(backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  };
}

// ============================================================================
// 日志中间件（5xx / 错误时截断响应体）
// ============================================================================

/**
 * 创建请求日志中间件
 *
 * - 正常请求：记录 method / url / status / 耗时
 * - 5xx 或 错误：响应体截断为 `truncateLength`，避免敏感信息或超长数据写入日志
 */
export function createLoggingMiddleware(config: LoggingMiddlewareConfig = {}) {
  const { logger, truncateLength = 200 } = config;
  const log =
    logger ??
    ((msg: string) => {
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

      if (response.status >= 500) {
        // ⚠️ 5xx：响应体截断
        log(
          `[API] ${label} → ✕ ${response.status} (${duration}ms) body=${truncate(
            response.data,
            truncateLength,
          )}`,
        );
      } else {
        log(`[API] ${label} → ${response.status} (${duration}ms)`);
      }
      return response;
    } catch (error: unknown) {
      const duration = Date.now() - start;
      const err = error as { status?: number; message?: string; data?: unknown };

      // ⚠️ 错误：响应体 / 错误消息都截断
      log(
        `[API] ${label} → ✕ ${err.status ?? 'ERR'} (${duration}ms) ${truncate(
          err.message,
          truncateLength,
        )} data=${truncate(err.data, truncateLength)}`,
      );
      throw error;
    }
  };
}
