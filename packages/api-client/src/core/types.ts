/**
 * API 客户端 — 核心类型定义
 *
 * @module @yunshu/api-client/core/types
 */

import type { ApiResponse } from '@yunshu/shared';

// 重新导出共享类型，方便外部引用
export type { ApiResponse };

/**
 * HTTP 请求配置
 */
export interface RequestConfig {
  /** 请求 URL */
  url: string;
  /** HTTP 方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** 查询参数 */
  params?: Record<string, unknown>;
  /** 请求体 */
  data?: unknown;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 中止信号 */
  signal?: AbortSignal;
  /** 基础 URL */
  baseURL?: string;
}

/**
 * HTTP 响应（适配器统一接口）
 */
export interface HttpResponse<T = unknown> {
  /** 响应数据 */
  data: ApiResponse<T>;
  /** HTTP 状态码 */
  status: number;
  /** 响应头 */
  headers: Record<string, string>;
}

/**
 * 请求错误
 */
export class RequestError extends Error {
  constructor(
    message: string,
    /** HTTP 状态码 */
    public readonly status?: number,
    /** 业务错误码 */
    public readonly code?: string,
    /** 错误详情 */
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

/**
 * HTTP 适配器接口
 *
 * 不同的 HTTP 库（axios、fetch 等）实现此接口，
 * 核心 HttpClient 只依赖此抽象，不依赖具体实现。
 */
export interface IHttpAdapter {
  /**
   * 发送 HTTP 请求
   * @param config 请求配置
   * @returns HTTP 响应
   */
  request<T = unknown>(config: RequestConfig): Promise<HttpResponse<T>>;
}

/**
 * 中间件函数类型
 *
 * 中间件可以拦截和修改请求/响应流程。
 * 返回 null 表示该中间件已处理请求（如缓存命中），不再继续。
 */
export type TMiddlewareFn = (
  config: RequestConfig,
  next: (config: RequestConfig) => Promise<HttpResponse>,
) => Promise<HttpResponse>;

/**
 * 缓存选项
 */
export interface CacheOptions {
  /** 是否启用缓存 */
  enabled?: boolean;
  /** 缓存有效期（毫秒），默认 5 分钟 */
  ttl?: number;
  /** 自定义缓存键 */
  key?: string;
}

/**
 * 请求去重配置
 */
export interface DedupConfig {
  /** 去重时间窗口（毫秒），默认 1000ms */
  window?: number;
}

/**
 * 重试配置
 */
export interface RetryConfig {
  /** 最大重试次数，默认 3 */
  maxRetries?: number;
  /** 重试延迟（毫秒），默认 1000 */
  delay?: number;
  /** 哪些状态码需要重试，默认 [408, 429, 502, 503, 504] */
  retryOnStatus?: number[];
  /** 指数退避倍数，默认 2 */
  backoffMultiplier?: number;
}

/**
 * 认证配置
 */
export interface AuthConfig {
  /** Token 获取函数 */
  getToken: () => string | null;
  /** Token 刷新函数，返回新的 token */
  refreshToken: () => Promise<string | null>;
  /** Token 刷新失败回调 */
  onRefreshFailed?: () => void;
  /** Token 请求头名称，默认 'Authorization' */
  headerName?: string;
  /** Token 前缀，默认 'Bearer ' */
  tokenPrefix?: string;
}
