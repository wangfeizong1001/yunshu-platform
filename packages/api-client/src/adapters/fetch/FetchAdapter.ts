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
  /** 响应体最大字节数，默认 10MB */
  maxResponseSize?: number;
}

// ============================================================================
// 内部常量
// ============================================================================

/** 默认超时（毫秒） */
const DEFAULT_TIMEOUT = 15000;
/** 默认响应体最大字节：10MB */
const DEFAULT_MAX_RESPONSE_SIZE = 10 * 1024 * 1024;

// ============================================================================
// 内部工具
// ============================================================================

/**
 * 判断值是否为 plain object
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

/**
 * 读取响应体为文本，并强制执行字节上限
 * 由于 fetch response.body 是 ReadableStream，这里通过分块读取累加大小。
 * 若 Content-Length 已明确超出上限，则直接提前中断。
 */
async function readTextWithLimit(
  response: Response,
  maxBytes: number,
  abortCtrl: AbortController,
): Promise<string> {
  // 1. 先检查 Content-Length（若存在）
  const contentLengthHeader = response.headers.get('content-length');
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isNaN(contentLength) && contentLength > maxBytes) {
      abortCtrl.abort();
      throw new RequestError(
        `响应体过大（Content-Length=${contentLength}，限制 ${maxBytes}）`,
        413,
        'RESPONSE_TOO_LARGE',
      );
    }
  }

  // 2. 流式读取
  if (response.body && typeof (response.body as ReadableStream).getReader === 'function') {
    const reader = (response.body as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder('utf-8');
    let total = 0;
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        reader.cancel('response too large').catch(() => undefined);
        abortCtrl.abort();
        throw new RequestError(
          `响应体过大（已读取 ${total}，限制 ${maxBytes}）`,
          413,
          'RESPONSE_TOO_LARGE',
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode(); // flush
    return text;
  }

  // 回退：直接 text()，然后判断长度
  const text = await response.text();
  if (text.length > maxBytes) {
    throw new RequestError(
      `响应体过大（${text.length}，限制 ${maxBytes}）`,
      413,
      'RESPONSE_TOO_LARGE',
    );
  }
  return text;
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
  private readonly maxResponseSize: number;

  constructor(options: FetchAdapterOptions = {}) {
    this.baseURL = options.baseURL ?? '';
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.defaultHeaders = options.headers ?? {};
    this.maxResponseSize = options.maxResponseSize ?? DEFAULT_MAX_RESPONSE_SIZE;
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
        body = data;
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete headers['Content-Type'];
      } else if (data instanceof Blob || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
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
        body = String(data);
      }
    }

    // 4. 超时控制：合并自定义 signal 与 timeout
    const timeoutMs = config.timeout ?? this.timeout;
    const { signal, abortCtrl } = this.buildSignal(timeoutMs, config.signal);

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
      const isJson = /application\/json/i.test(contentType);

      let responseBody: unknown;

      if (response.status === 204) {
        responseBody = null;
      } else if (isJson) {
        // JSON 响应：先读取为文本并限制大小，再 JSON.parse
        const text = await readTextWithLimit(response, this.maxResponseSize, abortCtrl);
        responseBody = text.trim() === '' ? null : JSON.parse(text);
      } else {
        // 非 JSON 响应：按文本读取，同样限制大小
        responseBody = await readTextWithLimit(response, this.maxResponseSize, abortCtrl);
      }

      // 6. 非 2xx → 抛出 RequestError
      if (!response.ok) {
        if (response.status >= 500) {
          // 服务端错误：不暴露原始响应体，避免敏感信息泄漏
          throw new RequestError(
            `服务端错误（HTTP ${response.status}）`,
            response.status,
            'SERVER_ERROR',
          );
        }

        const message =
          pickString(responseBody, 'message') ?? `HTTP ${response.status} ${response.statusText}`;
        const code = pickString(responseBody, 'code');
        throw new RequestError(message, response.status, code, responseBody);
      }

      return {
        data: responseBody as HttpResponse<T>['data'],
        status: response.status,
        headers: headersRecord,
      };
    } catch (error: unknown) {
      if (error instanceof RequestError) {
        throw error;
      }

      const isAbort = error instanceof DOMException && error.name === 'AbortError';

      throw new RequestError(
        isAbort ? '请求超时或已取消' : error instanceof Error ? error.message : '网络错误',
        0,
        isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
      );
    }
  }

  // ========================================================================
  // 内部方法：signal 构造
  // ========================================================================

  /**
   * 合并超时 signal 与用户 signal
   */
  private buildSignal(
    timeoutMs: number,
    userSignal?: AbortSignal,
  ): { signal: AbortSignal; abortCtrl: AbortController } {
    const abortCtrl = new AbortController();

    try {
      // 优先使用标准 AbortSignal.timeout + AbortSignal.any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AsAny = AbortSignal as any;
      const timeoutSig = AsAny.timeout(timeoutMs) as AbortSignal;
      if (userSignal) {
        const combined = AsAny.any([userSignal, timeoutSig]) as AbortSignal;
        return { signal: combined, abortCtrl };
      }
      return { signal: timeoutSig, abortCtrl };
    } catch {
      // 老环境回退：setTimeout + AbortController
      const timer = setTimeout(() => abortCtrl.abort(), timeoutMs);
      if (userSignal) {
        if (userSignal.aborted) {
          abortCtrl.abort();
        } else {
          userSignal.addEventListener(
            'abort',
            () => {
              abortCtrl.abort();
            },
            { once: true },
          );
        }
      }
      abortCtrl.signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
      return { signal: abortCtrl.signal, abortCtrl };
    }
  }

  // ========================================================================
  // 内部方法：URL 构造
  // ========================================================================

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path);
      if (params) {
        const search = buildSearchParams(params);
        search.forEach((value, key) => url.searchParams.append(key, value));
      }
      return url.toString();
    }

    let origin = this.baseURL;
    if (!origin) {
      origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
    }

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
