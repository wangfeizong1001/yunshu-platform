/**
 * API 客户端 — Vue 3 集成
 *
 * 提供 Vue 3 Composition API 风格的请求 hooks 和插件。
 *
 * @module @yunshu/api-client/vue
 */

import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue';
import type { HttpClient } from '../core/HttpClient';
import type { BaseAPI } from '../core/BaseAPI';
import type { ApiResponse, CacheOptions } from '../core/types';

// ============================================================================
// Vue 插件
// ============================================================================

/**
 * Vue 插件 — 将 HttpClient 注入全局
 *
 * @example
 * ```typescript
 * // main.ts
 * import { createYunshuAPI } from '@yunshu/api-client/vue';
 * const api = createYunshuAPI({ baseURL: '/api' });
 * app.use(api);
 *
 * // 在组件中使用
 * const api = inject('$api');
 * ```
 */
export function createYunshuAPI(options: { httpClient: HttpClient }) {
  return {
    install(app: {
      provide: (key: string, value: unknown) => void;
      config: { globalProperties: Record<string, unknown> };
    }) {
      app.provide('$api', options.httpClient);
      app.config.globalProperties.$api = options.httpClient;
    },
  };
}

// ============================================================================
// useApi — 通用请求 Hook
// ============================================================================

interface UseApiState<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  called: Ref<boolean>;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  refresh: () => Promise<T | null>;
  reset: () => void;
}

/**
 * 创建 API 请求 Hook
 *
 * 封装请求的 loading/error/data 状态管理。
 *
 * @example
 * ```typescript
 * const { data, loading, error, execute } = useApi(
 *   (id: string) => userApi.getById(id)
 * );
 *
 * await execute('user-123');
 * ```
 */
export function useApi<T>(fn: (...args: unknown[]) => Promise<ApiResponse<T>>): UseApiReturn<T> {
  const data: Ref<T | null> = ref(null);
  const error: Ref<Error | null> = ref(null);
  const loading = ref(false);
  const called = ref(false);

  let lastArgs: unknown[] = [];

  async function execute(...args: unknown[]): Promise<T | null> {
    loading.value = true;
    called.value = true;
    error.value = null;
    lastArgs = args;

    try {
      const response = await fn(...args);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function refresh(): Promise<T | null> {
    return execute(...lastArgs);
  }

  function reset(): void {
    data.value = null;
    error.value = null;
    loading.value = false;
    called.value = false;
    lastArgs = [];
  }

  return { data, error, loading, called, execute, refresh, reset };
}

// ============================================================================
// useApiList — 列表请求 Hook
// ============================================================================

interface UseApiListState<T> extends UseApiState<T[]> {
  total: Ref<number>;
  page: Ref<number>;
  pageSize: Ref<number>;
}

interface UseApiListReturn<T> extends UseApiListState<T> {
  execute: (...args: unknown[]) => Promise<T[] | null>;
  refresh: () => Promise<T[] | null>;
  setPage: (page: number) => void;
  hasMore: ComputedRef<boolean>;
}

/**
 * 创建列表请求 Hook
 *
 * 自带分页状态管理。
 *
 * @example
 * ```typescript
 * const { data, total, loading, setPage, hasMore } = useApiList(
 *   (params) => userApi.getList(params)
 * );
 * ```
 */
export function useApiList<T>(
  fn: (
    params: Record<string, unknown>,
  ) => Promise<ApiResponse<{ list?: T[]; items?: T[]; total: number }>>,
  initialPageSize = 10,
): UseApiListReturn<T> {
  const data: Ref<T[]> = ref([]);
  const error: Ref<Error | null> = ref(null);
  const loading = ref(false);
  const called = ref(false);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(initialPageSize);

  let lastArgs: unknown[] = [];

  const hasMore = computed(() => {
    return data.value.length < total.value;
  });

  async function execute(...args: unknown[]): Promise<T[] | null> {
    loading.value = true;
    called.value = true;
    error.value = null;
    lastArgs = args;

    try {
      const params = (args[0] as Record<string, unknown>) || {};
      const response = await fn(params);
      const items = response.data?.list ?? response.data?.items ?? [];
      data.value = items;
      total.value = response.data?.total ?? 0;
      return items;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function refresh(): Promise<T[] | null> {
    return execute(...lastArgs);
  }

  function setPage(newPage: number): void {
    page.value = newPage;
  }

  return {
    data,
    error,
    loading,
    called,
    total,
    page,
    pageSize,
    execute,
    refresh,
    setPage,
    hasMore,
  };
}

// ============================================================================
// useMutation — 变更 Hook
// ============================================================================

interface UseMutationState<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
}

interface UseMutationReturn<T> extends UseMutationState<T> {
  mutate: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * 创建变更请求 Hook
 *
 * 适用于 POST/PUT/PATCH/DELETE 等写操作。
 *
 * @example
 * ```typescript
 * const { mutate, loading, error } = useMutation(
 *   (data: CreateUserDTO) => userApi.create(data)
 * );
 *
 * await mutate({ name: '新用户', email: 'user@example.com' });
 * ```
 */
export function useMutation<T>(
  fn: (...args: unknown[]) => Promise<ApiResponse<T>>,
): UseMutationReturn<T> {
  const data: Ref<T | null> = ref(null);
  const error: Ref<Error | null> = ref(null);
  const loading = ref(false);

  async function mutate(...args: unknown[]): Promise<T | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fn(...args);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      return null;
    } finally {
      loading.value = false;
    }
  }

  function reset(): void {
    data.value = null;
    error.value = null;
    loading.value = false;
  }

  return { data, error, loading, mutate, reset };
}
