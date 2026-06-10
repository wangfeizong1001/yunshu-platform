/**
 * HTTP 客户端核心
 *
 * 框架无关的 HTTP 请求客户端，提供：
 * - 请求去重：相同请求在时间窗口内只发送一次
 * - 内存缓存：GET 请求结果缓存
 * - 中间件链：可插拔的请求/响应处理
 * - 请求取消：基于 AbortController
 *
 * @module @yunshu/api-client/core/HttpClient
 */

import type {
  RequestConfig,
  HttpResponse,
  IHttpAdapter,
  CacheOptions,
  DedupConfig,
  ApiResponse,
} from './types';
import { RequestError } from './types';

// ============================================================================
// 安全常量
// ============================================================================

/** 请求 key 的最大长度（避免超大参数撑爆内存） */
const REQUEST_KEY_MAX_LENGTH = 512;
/** params / data 中单个字段值的最大字符串长度（超长的不进入 key） */
const REQUEST_KEY_FIELD_VALUE_MAX = 200;
/** params 的最大字节大小（粗略估算，超过则拒绝） */
const PARAMS_MAX_SIZE = 100 * 1024; // 100KB
/** data 请求体的最大字节大小（粗略估算，超过则拒绝） */
const DATA_MAX_SIZE = 2 * 1024 * 1024; // 2MB
/** 默认超时（毫秒） */
const DEFAULT_TIMEOUT = 15000;

// ============================================================================
// 内部工具
// ============================================================================

/**
 * 粗略估算 JSON 字符串化后的字节大小
 */
function roughSize(value: unknown): number {
  try {
    return new Blob([JSON.stringify(value ?? '')]).size;
  } catch {
    return String(value ?? '').length;
  }
}

/**
 * 排序并过滤 params，生成稳定的 JSON 字符串
 * - key 按字母顺序排列（避免同参数不同顺序产生不同 key）
 * - 过滤掉值字符串长度超过 REQUEST_KEY_FIELD_VALUE_MAX 的字段
 *   （避免超大 payload 导致 key 无限膨胀，同时防止敏感信息进入 key）
 */
function canonicalObjectForCacheKey(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(canonicalObjectForCacheKey);
  }
  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, unknown> = {};
  for (const k of sortedKeys) {
    const v = obj[k];
    if (v === undefined) continue;
    if (typeof v === 'string' && v.length > REQUEST_KEY_FIELD_VALUE_MAX) continue;
    const canon = canonicalObjectForCacheKey(v);
    // 递归后依然是超长字符串的话再过滤一次
    if (typeof canon === 'string' && canon.length > REQUEST_KEY_FIELD_VALUE_MAX) continue;
    result[k] = canon;
  }
  return result;
}

/**
 * 从浏览器 cookie 中读取指定名称的值
 */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;
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
// 内存缓存实现
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * 简单 LRU 内存缓存
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data as T;
  }

  set<T>(key: string, value: T, ttl: number): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data: value, timestamp: Date.now(), ttl });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }
}

// ============================================================================
// HttpClient 配置
// ============================================================================

export interface HttpClientOptions {
  /** 基础 URL */
  baseURL?: string;
  /** 默认超时（毫秒） */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** 请求去重配置 */
  dedup?: DedupConfig;
  /** 缓存默认配置 */
  cache?: Partial<CacheOptions>;
  /** 是否在浏览器环境自动注入 XSRF/CSRF header（默认 true） */
  enableCsrf?: boolean;
  /** CSRF cookie 名称，默认 XSRF-TOKEN */
  xsrfCookieName?: string;
  /** CSRF 请求头名称，默认 X-XSRF-TOKEN */
  xsrfHeaderName?: string;
}

// ============================================================================
// HttpClient 类
// ============================================================================

export class HttpClient {
  private readonly adapter: IHttpAdapter;
  private readonly options: Required<Omit<HttpClientOptions, 'enableCsrf'>> & {
    enableCsrf: boolean;
  };
  private readonly memoryCache = new MemoryCache();
  private readonly dedupCache = new Map<string, Promise<HttpResponse>>();
  private readonly pendingRequests = new Map<string, AbortController>();

  constructor(adapter: IHttpAdapter, options: HttpClientOptions = {}) {
    this.adapter = adapter;
    this.options = {
      baseURL: options.baseURL ?? '',
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers: options.headers ?? {},
      dedup: {
        window: options.dedup?.window ?? 1000,
      },
      cache: {
        enabled: options.cache?.enabled ?? false,
        ttl: options.cache?.ttl ?? 5 * 60 * 1000,
        key: options.cache?.key,
      },
      enableCsrf: options.enableCsrf ?? true,
      xsrfCookieName: options.xsrfCookieName ?? 'XSRF-TOKEN',
      xsrfHeaderName: options.xsrfHeaderName ?? 'X-XSRF-TOKEN',
    };
  }

  // ========================================================================
  // 请求键生成
  // ========================================================================

  /**
   * 生成请求的唯一标识
   * - params / data 做排序后再序列化（稳定 key，避免缓存击穿）
   * - 过滤值长度过大的字段（避免敏感数据 / 超大 payload 进入 key）
   * - 最终 key 限制在 REQUEST_KEY_MAX_LENGTH 以内
   */
  private generateRequestKey(config: RequestConfig): string {
    const { method = 'GET', url, params, data } = config;
    const canonParams = canonicalObjectForCacheKey(params ?? {});
    const canonData = canonicalObjectForCacheKey(data ?? {});
    const raw = `${method}:${url}:${JSON.stringify(canonParams)}:${JSON.stringify(canonData)}`;
    if (raw.length > REQUEST_KEY_MAX_LENGTH) {
      return raw.slice(0, REQUEST_KEY_MAX_LENGTH);
    }
    return raw;
  }

  // ========================================================================
  // 请求方法
  // ========================================================================

  /**
   * 发送 HTTP 请求
   * - 合并默认 header（含 X-Requested-With / CSRF token）
   * - 合并超时
   */
  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    const headers: Record<string, string> = {
      ...this.options.headers,
      ...config.headers,
    };

    // 标记为 AJAX 请求（帮助后端区分 CSRF 攻击来源）
    if (!headers['X-Requested-With']) {
      headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    // 浏览器环境：从 cookie 读取 CSRF token 并注入 header
    if (this.options.enableCsrf && !headers[this.options.xsrfHeaderName]) {
      const token = readCookie(this.options.xsrfCookieName);
      if (token) {
        headers[this.options.xsrfHeaderName] = token;
      }
    }

    const fullConfig: RequestConfig = {
      ...config,
      baseURL: config.baseURL ?? this.options.baseURL,
      timeout: config.timeout ?? this.options.timeout ?? DEFAULT_TIMEOUT,
      headers,
    };

    return this.adapter.request<T>(fullConfig);
  }

  /**
   * GET 请求（带缓存和去重）
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    cacheOptions?: CacheOptions,
  ): Promise<ApiResponse<T>> {
    // params 大小检查：避免拼出超长 URL
    if (params !== undefined && roughSize(params) > PARAMS_MAX_SIZE) {
      throw new RequestError(
        `请求参数过大（限制 ${PARAMS_MAX_SIZE} 字节）`,
        413,
        'PAYLOAD_TOO_LARGE',
      );
    }

    const config: RequestConfig = { method: 'GET', url, params };
    const requestKey = cacheOptions?.key ?? this.generateRequestKey(config);

    if (cacheOptions?.enabled ?? this.options.cache.enabled) {
      const cached = this.memoryCache.get<ApiResponse<T>>(requestKey);
      if (cached) return cached;
    }

    if (this.dedupCache.has(requestKey)) {
      const response = await (this.dedupCache.get(requestKey) as Promise<HttpResponse<T>>);
      return response.data;
    }

    const requestPromise = this.request<T>(config).then((response) => {
      if (cacheOptions?.enabled ?? this.options.cache.enabled) {
        const ttl = cacheOptions?.ttl ?? this.options.cache.ttl!;
        this.memoryCache.set(requestKey, response.data, ttl);
      }
      setTimeout(() => this.dedupCache.delete(requestKey), this.options.dedup.window);
      return response;
    }).catch((error) => {
      this.dedupCache.delete(requestKey);
      throw error;
    });

    this.dedupCache.set(requestKey, requestPromise);
    const response = await requestPromise;
    return response.data;
  }

  /**
   * POST 请求（带 data 大小检查）
   */
  async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    if (data !== undefined && roughSize(data) > DATA_MAX_SIZE) {
      throw new RequestError(
        `请求体过大（限制 ${DATA_MAX_SIZE} 字节）`,
        413,
        'PAYLOAD_TOO_LARGE',
      );
    }
    const response = await this.request<T>({ method: 'POST', url, data });
    return response.data;
  }

  /**
   * PUT 请求（带 data 大小检查）
   */
  async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    if (data !== undefined && roughSize(data) > DATA_MAX_SIZE) {
      throw new RequestError(
        `请求体过大（限制 ${DATA_MAX_SIZE} 字节）`,
        413,
        'PAYLOAD_TOO_LARGE',
      );
    }
    const response = await this.request<T>({ method: 'PUT', url, data });
    return response.data;
  }

  /**
   * PATCH 请求（带 data 大小检查）
   */
  async patch<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    if (data !== undefined && roughSize(data) > DATA_MAX_SIZE) {
      throw new RequestError(
        `请求体过大（限制 ${DATA_MAX_SIZE} 字节）`,
        413,
        'PAYLOAD_TOO_LARGE',
      );
    }
    const response = await this.request<T>({ method: 'PATCH', url, data });
    return response.data;
  }

  /**
   * DELETE 请求（带 data 大小检查）
   */
  async delete<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    if (data !== undefined && roughSize(data) > DATA_MAX_SIZE) {
      throw new RequestError(
        `请求体过大（限制 ${DATA_MAX_SIZE} 字节）`,
        413,
        'PAYLOAD_TOO_LARGE',
      );
    }
    const response = await this.request<T>({ method: 'DELETE', url, data });
    return response.data;
  }

  // ========================================================================
  // 文件上传
  // ========================================================================

  /**
   * 文件上传
   */
  async upload<T = unknown>(
    url: string,
    file: File | Blob,
    options?: {
      onProgress?: (progress: number) => void;
      additionalData?: Record<string, string | Blob>;
      fileName?: string;
    },
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(options?.fileName ?? 'file', file);

    if (options?.additionalData) {
      for (const [key, value] of Object.entries(options.additionalData)) {
        formData.append(key, value);
      }
    }

    const response = await this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // ========================================================================
  // 缓存管理
  // ========================================================================

  /** 清除所有内存缓存 */
  clearCache(): void {
    this.memoryCache.clear();
  }

  /** 按前缀清除缓存 */
  clearCacheByPrefix(prefix: string): number {
    return this.memoryCache.deleteByPrefix(prefix);
  }

  /** 删除指定键的缓存 */
  removeCache(key: string): boolean {
    return this.memoryCache.delete(key);
  }

  // ========================================================================
  // 请求管理
  // ========================================================================

  /** 取消特定请求 */
  cancelRequest(requestId: string): void {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
  }

  /** 取消所有待处理请求 */
  cancelAllRequests(): void {
    for (const [id, controller] of this.pendingRequests) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }
}
