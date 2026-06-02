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
    // LRU: 移到末尾
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
}

// ============================================================================
// HttpClient 类
// ============================================================================

export class HttpClient {
  private readonly adapter: IHttpAdapter;
  private readonly options: Required<HttpClientOptions>;
  private readonly memoryCache = new MemoryCache();
  private readonly dedupCache = new Map<string, Promise<HttpResponse>>();
  private readonly pendingRequests = new Map<string, AbortController>();

  constructor(adapter: IHttpAdapter, options: HttpClientOptions = {}) {
    this.adapter = adapter;
    this.options = {
      baseURL: options.baseURL ?? '',
      timeout: options.timeout ?? 15000,
      headers: options.headers ?? {},
      dedup: {
        window: options.dedup?.window ?? 1000,
      },
      cache: {
        enabled: options.cache?.enabled ?? false,
        ttl: options.cache?.ttl ?? 5 * 60 * 1000,
        key: options.cache?.key,
      },
    };
  }

  // ========================================================================
  // 请求键生成
  // ========================================================================

  /**
   * 生成请求的唯一标识
   * 用于去重和缓存的 key 生成
   */
  private generateRequestKey(config: RequestConfig): string {
    const { method = 'GET', url, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  // ========================================================================
  // 请求方法
  // ========================================================================

  /**
   * 发送 HTTP 请求
   */
  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    const fullConfig: RequestConfig = {
      ...config,
      baseURL: config.baseURL ?? this.options.baseURL,
      timeout: config.timeout ?? this.options.timeout,
      headers: { ...this.options.headers, ...config.headers },
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
    const config: RequestConfig = { method: 'GET', url, params };
    const requestKey = cacheOptions?.key ?? this.generateRequestKey(config);

    // 1. 检查内存缓存
    if (cacheOptions?.enabled ?? this.options.cache.enabled) {
      const cached = this.memoryCache.get<ApiResponse<T>>(requestKey);
      if (cached) return cached;
    }

    // 2. 检查请求去重
    if (this.dedupCache.has(requestKey)) {
      const response = await (this.dedupCache.get(requestKey) as Promise<HttpResponse<T>>);
      return response.data;
    }

    // 3. 创建请求
    const requestPromise = this.request<T>(config).then((response) => {
      // 缓存成功结果
      if (cacheOptions?.enabled ?? this.options.cache.enabled) {
        const ttl = cacheOptions?.ttl ?? this.options.cache.ttl!;
        this.memoryCache.set(requestKey, response.data, ttl);
      }
      // 延迟清除去重条目
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
   * POST 请求
   */
  async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ method: 'POST', url, data });
    return response.data;
  }

  /**
   * PUT 请求
   */
  async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ method: 'PUT', url, data });
    return response.data;
  }

  /**
   * PATCH 请求
   */
  async patch<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ method: 'PATCH', url, data });
    return response.data;
  }

  /**
   * DELETE 请求
   */
  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ method: 'DELETE', url });
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
