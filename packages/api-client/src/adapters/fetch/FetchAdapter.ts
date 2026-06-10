/**
 * API 客户端 — Fetch 适配器
 *
 * 基于原生 fetch API 的轻量级适配器，适用于无第三方依赖的场景。
 * 特性：
 *   - 超时控制（AbortSignal.timeout + 用户自定义 signal 合并）
 *   - 查询参数自动 URLSearchParams 序列化
 *   - 请求体自动识别：对象 → JSON / FormData / Blob 直传
 *   - 非 2xx 抛 RequestError（携带 status 与 body）
 *   - 统一响应结构 { data, status, headers }
 *
 * @module @yunshu/api-client/adapters/fetch
 */

import type { IHttpAdapter, RequestConfig, HttpResponse } from '../../core/types';
import { RequestError } from '../../core/types';

/**
 * Fetch 适配器配置
 */
export interface FetchAdapterOptions {
  /** 基础 URL */
  baseURL?: string;
  /** 默认超时（毫秒），默认 15000 */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
}

// ============================================================================
// 内部工具
// ============================================================================

/**
 * 判断值是否为 plain object（而非 FormData / ArrayBuffer / Blob / 流）
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !(value instanceof FormData) &&
    !(value instanceof Blob) &&
    !(value instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(value)
  );
}

/**
 * 将 params 对象序列化为 URLSearchParams
 */
function buildSearchParams(params: Record<string, unknown>): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) search.append(key, String(item));
      }
    } else {
      search.append(key, String(value));
    }
  }
  return search;
}

/**
 * 将响应头 Headers 转为普通 Record
 */
function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

/**
 * 从解析后的响应 body 中安全地提取字符串字段
 */
function pickString(body: unknown, field: 'message' | 'code'): string | undefined {
  if (body && typeof body === 'object' && field in (body as Record<string, unknown>)) {
    const v = (body as Record<string, unknown>)[field];
    return v !== undefined && v !== null ? String(v) : undefined;
  }
  return undefined;
}

// ============================================================================
// 适配器主体
// ============================================================================

/**
 * Fetch HTTP 适配器
 *
 * @example
 * ```typescript
 * const adapter = new FetchAdapter({ baseURL: '/api' });
 * const httpClient = new HttpClient(adapter);
 * ```
 */
export class FetchAdapter implements IHttpAdapter {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: FetchAdapterOptions = {}) {
    this.baseURL = options.baseURL ?? '';
    this.timeout = options.timeout ?? 15000;
    this.defaultHeaders = options.headers ?? {};
  }

  /**
   * 发起 HTTP 请求
   */
  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    // 1. 构造完整 URL
    const url = this.buildUrl(config.url, config.params);

    // 2. 合并请求头
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    // 3. 选择合适的 body 序列化策略
    let body: BodyInit | undefined;
    const method = (config.method ?? 'GET').toUpperCase();

    if (config.data !== undefined && method !== 'GET' && method !== 'HEAD') {
      const data = config.data;

      if (data instanceof FormData) {
        // FormData 直接使用，浏览器自动设置 multipart boundary
        body = data;
        // 避免手动设置 Content-Type，让浏览器自动加上 boundary
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete headers['Content-Type'];
      } else if (
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        ArrayBuffer.isView(data)
      ) {
        body = data as BodyInit;
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/octet-stream';
        }
      } else if (isPlainObject(data)) {
        body = JSON.stringify(data);
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
      } else {
        // 其它回退：尝试 toString
        body = String(data);
      }
    }

    // 4. 超时控制：合并自定义 signal 与 timeout
    const timeoutMs = config.timeout ?? this.timeout;
    const signal = this.buildSignal(timeoutMs, config.signal);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal,
      });

      // 5. 解析响应体
      const headersRecord = headersToRecord(response.headers);
      const contentType = response.headers.get('content-type') ?? '';

      let responseBody: unknown;
      if (response.status === 204) {
        responseBody = null;
      } else if (/application\/json/i.test(contentType)) {
        responseBody = await response.json().catch(() => null);
      } else {
        responseBody = await response.text();
      }

      // 6. 非 2xx → 抛出 RequestError
      if (!response.ok) {
        const message =
          pickString(responseBody, 'message') ??
          `HTTP ${response.status} ${response.statusText}`;
        const code = pickString(responseBody, 'code');
        throw new RequestError(message, response.status, code, responseBody);
      }

      return {
        data: responseBody as HttpResponse<T>['data'],
        status: response.status,
        headers: headersRecord,
      };
    } catch (error: unknown) {
      // 超时/网络错误统一转换
      if (error instanceof RequestError) {
        throw error;
      }

      const isAbort =
        error instanceof DOMException && error.name === 'AbortError';

      throw new RequestError(
        isAbort ? '请求超时或已取消' : (error instanceof Error ? error.message : '网络错误'),
        0,
        isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
      );
    }
  }

  // ========================================================================
  // 内部方法：signal 构造
  // ========================================================================

  private buildSignal(timeoutMs: number, userSignal?: AbortSignal): AbortSignal {
    // 优先使用 AbortSignal.timeout + any（现代浏览器/Node 20+）
    try {
      const hasStaticTimeout =
        typeof (AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal }).timeout ===
        'function';
      const hasAny =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (AbortSignal as any).any === 'function';

      if (hasStaticTimeout) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const timeoutSig = (AbortSignal as any).timeout(timeoutMs) as AbortSignal;
        if (userSignal) {
          if (hasAny) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (AbortSignal as any).any([userSignal, timeoutSig]) as AbortSignal;
          }
          // 无 any：回退到手动合并
          return this.mergeSignals(userSignal, timeoutSig);
        }
        return timeoutSig;
      }
    } catch {
      // 继续回退
    }

    // 老环境回退：AbortController + setTimeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    if (userSignal) {
      if (userSignal.aborted) {
        controller.abort();
      } else {
        userSignal.addEventListener(
          'abort',
          () => {
            controller.abort();
          },
          { once: true },
        );
      }
    }
    controller.signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
    return controller.signal;
  }

  private mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (a.aborted || b.aborted) {
      controller.abort();
    } else {
      a.addEventListener('abort', onAbort, { once: true });
      b.addEventListener('abort', onAbort, { once: true });
    }
    return controller.signal;
  }

  // ========================================================================
  // 内部方法：URL 构造
  // ========================================================================

  /**
   * 基于 baseURL + params 构造完整 URL
   */
  private buildUrl(path: string, params?: Record<string, unknown>): string {
    // 绝对 URL：以 http 开头直接使用
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path);
      if (params) {
        const search = buildSearchParams(params);
        search.forEach((value, key) => url.searchParams.append(key, value));
      }
      return url.toString();
    }

    // 相对 URL：拼接 baseURL（若未提供则使用当前 origin）
    let origin = this.baseURL;
    if (!origin) {
      origin =
        typeof window !== 'undefined' && window.location ? window.location.origin : '';
    }

    // 确保末尾有 /
    const base = origin.endsWith('/') ? origin : `${origin}/`;
    const p = path.startsWith('/') ? path.slice(1) : path;
    const full = `${base}${p}`;

    try {
      const url = new URL(full, base.startsWith('http') ? base : undefined);
      if (params) {
        const search = buildSearchParams(params);
        search.forEach((value, key) => url.searchParams.append(key, value));
      }
      return url.toString();
    } catch {
      // base 不是合法 URL（例如只是 /api），退化为字符串拼接
      let result = full;
      if (params) {
        const searchStr = buildSearchParams(params).toString();
        if (searchStr) {
          result += (full.includes('?') ? '&' : '?') + searchStr;
        }
      }
      return result;
    }
  }
}
