/**
 * 云枢中台 — HTTP 请求客户端（统一入口）
 *
 * 设计目标：
 *   1. 替换旧的 utils/request.ts（Axios），保持 API 兼容
 *   2. 统一 Token 注入、错误处理、Loading 状态
 *   3. 提供 GET/POST/PUT/DELETE 便捷方法
 *   4. 提供 useRequest() composable 供 Vue 组件使用
 *
 * ⚠️ 说明：本模块底层使用 axios（与旧 request.ts 相同），但统一配置并加入：
 *   - 请求/响应拦截器（Token 注入、业务错误统一处理）
 *   - Loading 状态管理
 *   - CSRF 头注入（X-Requested-With）
 *   - 全局错误分发（auth-expired 事件）
 *
 * @module httpClient
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ref, shallowRef } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import type { ILoadingInstance } from 'element-plus/es/components/loading/src/loading.type';
import { getToken } from '@/utils/auth';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 标准 API 响应（与 @yunshu/shared 的 ApiResponse 保持一致）
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly code?: number;
  readonly message?: string;
  readonly data?: T;
  readonly [key: string]: unknown;
}

/**
 * 请求配置类型（与 axios AxiosRequestConfig 兼容）
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 本次请求是否显示全局 Loading */
  showLoading?: boolean;
  /** Loading 提示文本 */
  loadingText?: string;
  /** 上传进度回调 */
  onUploadProgress?: (percent: number) => void;
}

// ============================================================================
// 全局 Loading 管理
// ============================================================================

let globalLoading: ILoadingInstance | null = null;
let globalLoadingCount = 0;

function beginLoading(text: string): void {
  globalLoadingCount++;
  if (!globalLoading) {
    globalLoading = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(255, 255, 255, 0.6)',
      fullscreen: false,
    });
  }
}

function endLoading(): void {
  globalLoadingCount = Math.max(0, globalLoadingCount - 1);
  if (globalLoadingCount === 0 && globalLoading) {
    globalLoading.close();
    globalLoading = null;
  }
}

// ============================================================================
// 创建 axios 实例
// ============================================================================

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ============================================================================
// 请求拦截器：注入认证 Token
// ============================================================================

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = getToken();
    if (token && config.headers) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown): Promise<never> => {
    console.error('[httpClient] 请求失败:', error);
    return Promise.reject(error);
  },
);

// ============================================================================
// 响应拦截器：统一业务错误处理
// ============================================================================

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
    const resp = response.data;
    // 业务层错误（success: false）：在此处提示但不抛出，由调用方自行决定是否处理
    if (resp && typeof resp === 'object' && 'success' in resp && resp.success === false) {
      if (resp.message) {
        ElMessage.warning(resp.message);
      }
    }
    return response;
  },
  (error: { response?: { status?: number; data?: ApiResponse }; message?: string }): Promise<never> => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message ?? '请求失败';

    if (status === 401) {
      ElMessage.warning('登录已过期，请重新登录');
      // 触发 auth-expired 事件，上层可监听执行登出
      window.dispatchEvent(new CustomEvent('yunshu:auth-expired'));
    } else if (status === 403) {
      ElMessage.error('无访问权限');
    } else if (status !== undefined && status >= 500) {
      ElMessage.error(`服务器异常 (${status})，请稍后重试`);
    } else {
      ElMessage.error(message);
    }

    return Promise.reject(error);
  },
);

// ============================================================================
// 主请求函数（直接返回 ApiResponse，包装 axios response.data）
// ============================================================================

/**
 * 发送一个 HTTP 请求，返回 ApiResponse<T>
 * @param config 请求配置
 * @param options 额外选项（Loading 等）
 */
export async function request<T = unknown>(
  config: RequestConfig,
  options: { showLoading?: boolean; loadingText?: string } = {},
): Promise<ApiResponse<T>> {
  const { showLoading = false, loadingText = '加载中...' } = options;

  if (showLoading) beginLoading(loadingText);

  try {
    const response = await service.request<ApiResponse<T>>(config);
    return response.data;
  } finally {
    if (showLoading) endLoading();
  }
}

// ============================================================================
// 便捷方法
// ============================================================================

/** GET 便捷方法 */
export function httpGet<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'GET', url, params, ...config });
}

/** POST 便捷方法 */
export function httpPost<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'POST', url, data, ...config });
}

/** PUT 便捷方法 */
export function httpPut<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'PUT', url, data, ...config });
}

/** DELETE 便捷方法 */
export function httpDelete<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'DELETE', url, params, ...config });
}

/** 文件上传（multipart/form-data） */
export function httpUpload<T = unknown>(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<ApiResponse<T>> {
  return request<T>({
    method: 'POST',
    url,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
      if (progressEvent.total) {
        onProgress?.(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    },
  });
}

/** 文件下载 */
export async function httpDownload(url: string, filename?: string): Promise<void> {
  const response = await service.get<Blob>(url, { responseType: 'blob' });
  const urlObj = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = urlObj;
  link.download = filename ?? url.split('/').pop() ?? 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(urlObj);
}

// ============================================================================
// Composable: useRequest() — Vue 组件内的请求生命周期封装
// ============================================================================

/**
 * useRequest() — 在 Vue 组件中管理异步请求
 *
 * 示例：
 *   const { data, loading, error, execute } = useRequest(() => fetchUser(id));
 *   // data: 响应数据（成功后填充）
 *   // loading: 是否正在请求
 *   // error: 错误对象（失败时）
 *   // execute: 手动触发请求（可重复调用）
 */
export interface UseRequestResult<T> {
  readonly data: ShallowRef<T | null>;
  readonly loading: Ref<boolean>;
  readonly error: ShallowRef<Error | null>;
  readonly execute: () => Promise<T>;
}

export function useRequest<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean } = { immediate: true },
): UseRequestResult<T> {
  const data = shallowRef<T | null>(null);
  const loading = ref(false);
  const error = shallowRef<Error | null>(null);

  const execute = async (): Promise<T> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetcher();
      data.value = result;
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  if (options.immediate) {
    execute().catch(() => {
      // 由调用方决定是否处理失败场景，这里静默避免 unhandled rejection
    });
  }

  return { data, loading, error, execute };
}

// ============================================================================
// 默认导出（兼容老的 request() 调用方式）
// ============================================================================

export default service;
