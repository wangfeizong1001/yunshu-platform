/**
 * HTTP 请求工具
 *
 * 基于 axios 的请求封装，提供统一的请求处理、错误处理和拦截器
 */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@yunshu/shared';
/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否忽略错误提示 */
  ignoreError?: boolean;
  /** 是否忽略登录验证 */
  ignoreAuth?: boolean;
  /** 自定义错误消息 */
  errorMessage?: string;
  /** 是否启用缓存 */
  cache?: boolean;
  /** 缓存过期时间（毫秒） */
  cacheTTL?: number;
  /** 强制刷新缓存 */
  forceRefresh?: boolean;
}
/** 分页响应数据结构 */
export interface PageResponse<T = unknown> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
/** 扩展的 AxiosResponse */
export interface HttpResponse<T = unknown> extends AxiosResponse {
  data: ApiResponse<T>;
}
/** 创建 axios 实例 */
declare const instance: AxiosInstance;
/**
 * 发送请求
 * @param config 请求配置
 */
export declare function request<T = unknown>(config: RequestConfig): Promise<T>;
/**
 * GET 请求
 */
export declare function get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T>;
/**
 * POST 请求
 */
export declare function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T>;
/**
 * PUT 请求
 */
export declare function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T>;
/**
 * DELETE 请求
 */
export declare function del<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T>;
/**
 * PATCH 请求
 */
export declare function patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T>;
/**
 * 下载文件
 */
export declare function download(
  url: string,
  params?: Record<string, unknown>,
  filename?: string,
): Promise<void>;
/**
 * 上传文件
 */
export declare function upload<T = unknown>(
  url: string,
  file: File | FormData,
  config?: RequestConfig,
): Promise<T>;
/** 导出 axios 实例 */
export { instance as axiosInstance };
/** 默认导出 */
export default request;
//# sourceMappingURL=request.d.ts.map
