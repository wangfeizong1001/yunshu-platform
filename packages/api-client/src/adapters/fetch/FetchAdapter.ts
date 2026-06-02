/**
 * API 客户端 — Fetch 适配器
 *
 * 基于原生 fetch API 的轻量级适配器，
 * 适用于无第三方依赖的场景。
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
  /** 默认超时（毫秒） */
  timeout?: number;
}

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

  constructor(options: FetchAdapterOptions = {}) {
    this.baseURL = options.baseURL ?? '/api';
    this.timeout = options.timeout ?? 15000;
  }

  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    const url = new URL(config.url, this.baseURL.startsWith('http') ? this.baseURL : window.location.origin + this.baseURL);

    // 添加查询参数
    if (config.params) {
      for (const [key, value] of Object.entries(config.params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout ?? this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: config.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: config.signal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new RequestError(
          data?.message ?? `HTTP ${response.status}`,
          response.status,
          data?.code,
          data,
        );
      }

      return {
        data: data as HttpResponse<T>['data'],
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof RequestError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new RequestError('请求超时或已取消', 0, 'TIMEOUT');
      }

      throw new RequestError(
        error instanceof Error ? error.message : '网络错误',
        0,
        'NETWORK_ERROR',
      );
    }
  }
}
