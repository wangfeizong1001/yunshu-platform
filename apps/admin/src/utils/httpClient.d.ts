/**
 * 云枢中台 — HTTP 请求客户端
 *
 * 统一 axios 实例封装，特性：
 *  1. 自动注入 Authorization: Bearer <token>
 *  2. 401 时派发 yunshu:auth-expired 自定义事件（便于全局做登出动作）
 *  3. 对 success: false 的统一响应进行 ElMessage 警告
 *  4. 提供泛型 request/httpGet/httpPost/httpPut/httpDelete 便捷方法
 *
 * @module @yunshu/admin/utils/httpClient
 */
import { type AxiosInstance, type AxiosRequestConfig } from 'axios';
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly code?: number;
  readonly message?: string;
  readonly data?: T;
  readonly [key: string]: unknown;
}
declare const service: AxiosInstance;
export declare function request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
export declare function httpGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
export declare function httpPost<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T>;
export declare function httpPut<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T>;
export declare function httpDelete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T>;
export default service;
//# sourceMappingURL=httpClient.d.ts.map
