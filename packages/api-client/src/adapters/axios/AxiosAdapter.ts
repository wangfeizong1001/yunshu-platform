/**
 * API 客户端 — Axios 适配器。
 *
 * 将 axios 实例适配为 IHttpAdapter 接口。
 *
 * ⚠️  本文件不将 `axios` 列为项目依赖。
 *   - 外部需要自行安装 axios：`npm i axios`
 *   - 若未安装 axios：请直接使用 FetchAdapter。
 *   - 本模块在构造时动态 import('axios')，不使用顶层 import。
 *
 * @module @yunshu/api-client/adapters/axios
 */

import type { IHttpAdapter, RequestConfig, HttpResponse } from '../../core/types';
import { RequestError } from '../../core/types';

/**
 * Axios 适配器配置（宽松形状，避免静态依赖 axios 类型）。
 */
export interface AxiosAdapterOptions {
  /** 外部传入的 axios 实例；等价于 axios.create() 返回值 */
  instance?: {
    request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
  };
  /** 未提供 instance 时使用的基础 URL（动态 import axios 后再 create） */
  baseURL?: string;
  /** 默认超时毫秒数 */
  timeout?: number;
}

/** 宽松版 axios 请求配置 —— 不直接引用 axios 类型 */
export interface AxiosRequestConfigLike {
  method?: string;
  url?: string;
  params?: unknown;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  baseURL?: string;
}

/** 宽松版 axios 响应 */
export interface AxiosResponseLike {
  data?: unknown;
  status?: number;
  headers?: Record<string, string>;
}

/** 宽松版 axios 错误 */
interface AxiosErrorLike extends Error {
  code?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
  isAxiosError?: boolean;
}

/** axios 模块的宽松形状 */
interface AxiosModuleLike {
  default?: {
    create: (opts: AxiosRequestConfigLike) => {
      request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
    };
  };
  create?: (opts: AxiosRequestConfigLike) => {
    request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
  };
}

/**
 * Axios HTTP 适配器（延迟加载 axios）。
 */
export class AxiosAdapter implements IHttpAdapter {
  private readonly instance: Promise<{
    request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
  }>;

  constructor(options: AxiosAdapterOptions = {}) {
    if (options.instance) {
      this.instance = Promise.resolve(options.instance);
    } else {
      this.instance = this.loadDefaultInstance(options);
    }
  }

  private async loadDefaultInstance(
    options: AxiosAdapterOptions,
  ): Promise<{
    request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
  }> {
    let mod: AxiosModuleLike | undefined;
    try {
      // @ts-expect-error —— axios 不是项目固定依赖，仅在消费者安装后可解析。
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      mod = await import('axios');
    } catch {
      // 忽略，统一在下方错误处理中抛出
    }

    if (!mod) {
      throw new Error(
        'AxiosAdapter 需要项目中已安装 axios；若无 axios，请改用 FetchAdapter。',
      );
    }

    const create =
      mod?.default?.create ??
      (('default' in (mod as object) && (mod as { default?: AxiosModuleLike }).default?.create) ||
        undefined) ??
      (mod as { create?: (opts: AxiosRequestConfigLike) => unknown }).create;

    if (typeof create !== 'function') {
      throw new Error('axios 模块中未找到 create 方法，无法初始化 AxiosAdapter。');
    }

    return create({
      baseURL: options.baseURL ?? '/api',
      timeout: options.timeout ?? 15000,
      headers: { 'Content-Type': 'application/json' } as Record<string, string>,
    }) as {
      request: (config: AxiosRequestConfigLike) => Promise<AxiosResponseLike>;
    };
  }

  /**
   * 发起 HTTP 请求。
   */
  async request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>> {
    const instance = await this.instance;

    const axiosConfig: AxiosRequestConfigLike = {
      method: config.method?.toLowerCase() ?? 'get',
      url: config.url,
      params: config.params,
      data: config.data,
      headers: config.headers,
      timeout: config.timeout,
      signal: config.signal,
      baseURL: config.baseURL,
    };

    try {
      const response = await instance.request(axiosConfig);
      return {
        data: (response.data ?? null) as HttpResponse<T>['data'],
        status: response.status ?? 200,
        headers: (response.headers ?? {}) as Record<string, string>,
      };
    } catch (error: unknown) {
      const axErr = error as AxiosErrorLike;

      if (axErr?.isAxiosError) {
        const status = axErr.response?.status;
        const body = axErr.response?.data;

        if (axErr.code === 'ERR_CANCELED' || axErr.code === 'ECONNABORTED') {
          throw new RequestError('请求已取消或超时', 0, 'TIMEOUT');
        }

        if (!axErr.response) {
          throw new RequestError('网络错误，请检查网络连接', 0, 'NETWORK_ERROR');
        }

        const message =
          body && typeof body === 'object' && 'message' in body
            ? String((body as Record<string, unknown>).message)
            : axErr.message;

        const code =
          body && typeof body === 'object' && 'code' in body
            ? String((body as Record<string, unknown>).code)
            : undefined;

        throw new RequestError(message, status, code, body);
      }

      throw new RequestError(
        error instanceof Error ? error.message : '未知错误',
        0,
        'UNKNOWN',
      );
    }
  }
}
