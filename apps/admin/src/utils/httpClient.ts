import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ref, shallowRef } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { getToken } from '@/utils/auth';

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly code?: number;
  readonly message?: string;
  readonly data?: T;
  readonly [key: string]: unknown;
}

export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  loadingText?: string;
}

let globalLoading: ReturnType<typeof ElLoading.service> | null = null;
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

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

service.interceptors.request.use(
  (config) => {
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

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
    const resp = response.data;
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

export function httpGet<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'GET', url, params, ...config });
}

export function httpPost<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'POST', url, data, ...config });
}

export function httpPut<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'PUT', url, data, ...config });
}

export function httpDelete<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>({ method: 'DELETE', url, params, ...config });
}

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
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        onProgress?.(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    },
  });
}

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
      // noop
    });
  }

  return { data, loading, error, execute };
}

export default service;
