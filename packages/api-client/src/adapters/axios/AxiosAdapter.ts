/**
 * API 客户端 — Axios 适配器
 *
 * 将 axios 实例适配为 IHttpAdapter 接口。
 *
 * @module @yunshu/api-client/adapters/axios
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { IHttpAdapter, RequestConfig, HttpResponse } from '../../core/types';
import { RequestError } from '../../core/types';

/**
 * Axios 适配器配置
 */
export interface AxiosAdapterOptions {
  /** axios 实例（不传则创建新实例） */
  instance?: AxiosInstance;
  /** 基础 URL */
  baseURL?: string;
  /** 默认超时 */
  timeout?: number;
}

/**
 * Axios HTTP 适配器
 *
 * @example
 * ```typescript
 * const adapter = new AxiosAdapter({ baseURL: '/api' });
 * const httpClient = new HttpClient(adapter);
 * ```
 */
export class AxiosAdapter implements IHttpAdapter {
  private readonly axiosInstance: AxiosInstance;

  constructor(options: AxiosAdapterOptions = {}) {
    if (options.instance) {
      this.axiosInstance = options.instance;
    } else {
      this.axiosInstance = axios.create({
        baseURL: options.baseURL ?? '/api',
        timeout: options.timeout ?? 15000,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  /**
   * 获取原始 axios 实例（用于高级场景）
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * 发送 HTTP 请求
   */
  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      method: (config.method?.toLowerCase() ?? 'get') as AxiosRequestConfig['method'],
      url: config.url,
      params: config.params,
      data: config.data,
      headers: config.headers,
      timeout: config.timeout,
      signal: config.signal,
      baseURL: config.baseURL,
    };

    try {
      const response = await this.axiosInstance.request<T>(axiosConfig);

      return {
        data: response.data as HttpResponse<T>['data'],
        status: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data as Record<string, unknown> | undefined;

        if (error.code === 'ERR_CANCELED') {
          throw new RequestError('请求已取消', 0, 'CANCELED');
        }

        if (!error.response) {
          throw new RequestError('网络错误，请检查网络连接', 0, 'NETWORK_ERROR');
        }

        throw new RequestError(
          (responseData?.message as string) ?? error.message,
          status,
          (responseData?.code as string),
          responseData,
        );
      }

      throw new RequestError(
        error instanceof Error ? error.message : '未知错误',
        0,
        'UNKNOWN',
      );
    }
  }
}
