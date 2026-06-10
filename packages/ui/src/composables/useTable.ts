/**
 * UI — 表格/列表管理 Composable
 *
 * 提供分页、排序、筛选、多选的统一状态管理。
 *
 * @module @yunshu/ui/composables/useTable
 */

import { ref, reactive, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';

interface UseTableOptions<T> {
  /** 获取数据的函数 */
  fetchFn: (params: Record<string, unknown>) => Promise<{ list: T[]; total: number }>;
  /** 每页默认数量 */
  defaultPageSize?: number;
  /** 默认排序 */
  defaultSort?: { field: string; order: 'asc' | 'desc' };
}

interface UseTableReturn<T> {
  data: Ref<T[]>;
  total: Ref<number>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  page: Ref<number>;
  pageSize: Ref<number>;
  sortField: Ref<string>;
  sortOrder: Ref<'asc' | 'desc'>;
  selectedRows: Ref<T[]>;
  totalPages: ComputedRef<number>;
  hasMore: ComputedRef<boolean>;
  loadData: () => Promise<void>;
  setPage: (page: number) => void;
  setSort: (field: string) => void;
  onSelectionChange: (rows: T[]) => void;
  refresh: () => Promise<void>;
}

/**
 * 表格管理 Hook
 *
 * @example
 * ```typescript
 * const {
 *   data, loading, page, setPage, setSort, refresh
 * } = useTable({
 *   fetchFn: (params) => userApi.getList(params),
 *   defaultPageSize: 20,
 * });
 * ```
 */
export function useTable<T>(
  options: UseTableOptions<T>,
): UseTableReturn<T> {
  const { fetchFn, defaultPageSize = 10, defaultSort } = options;

  const data: Ref<T[]> = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error: Ref<Error | null> = ref(null);
  const page = ref(1);
  const pageSize = ref(defaultPageSize);
  const sortField = ref(defaultSort?.field ?? 'createdAt');
  const sortOrder = ref<'asc' | 'desc'>(defaultSort?.order ?? 'desc');
  const selectedRows: Ref<T[]> = ref([]);

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value) || 1);
  const hasMore = computed(() => page.value < totalPages.value);

  async function loadData(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const result = await fetchFn({
        page: page.value,
        limit: pageSize.value,
        sort: sortField.value,
        order: sortOrder.value,
      });
      data.value = result.list;
      total.value = result.total;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  }

  function setPage(newPage: number): void {
    page.value = newPage;
    loadData();
  }

  function setSort(field: string): void {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = field;
      sortOrder.value = 'desc';
    }
    loadData();
  }

  function onSelectionChange(rows: T[]): void {
    selectedRows.value = rows;
  }

  async function refresh(): Promise<void> {
    page.value = 1;
    await loadData();
  }

  return {
    data, total, loading, error,
    page, pageSize, sortField, sortOrder,
    selectedRows, totalPages, hasMore,
    loadData, setPage, setSort, onSelectionChange, refresh,
  };
}
