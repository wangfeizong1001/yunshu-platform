/**
 * 筛选和排序使用示例
 *
 * 详细演示各种筛选条件和排序的使用方式
 */

import { ref, computed, watch } from 'vue';
import { useUserList, useRoleList, useMenuList, useDeptList } from '@yunshu/api-client';
import type { SysUserQuery } from '@yunshu/shared/types/system';

// ============================================================================
// 示例 1：关键词搜索
// ============================================================================

/**
 * 关键词搜索示例
 */
function keywordSearch() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 搜索输入
  const searchInput = ref('');

  // 防抖搜索
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    searchInput.value = value;

    // 防抖处理
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      queryParams.value.keyword = value;
      queryParams.value.pageNum = 1;
      fetchList();
    }, 300);
  }

  // 立即搜索（回车触发）
  function immediateSearch() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    queryParams.value.keyword = searchInput.value;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 清除搜索
  function clearSearch() {
    searchInput.value = '';
    queryParams.value.keyword = undefined;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  return {
    list,
    total,
    loading,
    searchInput,
    onSearchInput,
    immediateSearch,
    clearSearch,
  };
}

// ============================================================================
// 示例 2：状态筛选
// ============================================================================

/**
 * 状态筛选示例
 */
function statusFilter() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 状态选项
  const statusOptions = [
    { value: undefined, label: '全部', count: null },
    { value: '0', label: '正常', count: null },
    { value: '1', label: '停用', count: null },
  ];

  // 当前选中的状态
  const currentStatus = computed(() => queryParams.value.status);

  // 按状态筛选
  function filterByStatus(status: '0' | '1' | undefined) {
    queryParams.value.status = status;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 切换状态
  function toggleStatus() {
    const current = queryParams.value.status;
    if (current === undefined) {
      filterByStatus('0');
    } else if (current === '0') {
      filterByStatus('1');
    } else {
      filterByStatus(undefined);
    }
  }

  return {
    list,
    total,
    loading,
    statusOptions,
    currentStatus,
    filterByStatus,
    toggleStatus,
  };
}

// ============================================================================
// 示例 3：部门筛选
// ============================================================================

/**
 * 部门筛选示例
 */
function deptFilter() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 部门树
  const { tree: deptTree, fetchTree } = useDeptList();

  // 选中的部门ID
  const selectedDeptId = computed(() => queryParams.value.deptId);

  // 选中的部门信息
  const selectedDept = computed(() => {
    if (!selectedDeptId.value) return null;

    function findDept(depts: any[], id: number): any {
      for (const dept of depts) {
        if (dept.deptId === id) return dept;
        if (dept.children) {
          const found = findDept(dept.children, id);
          if (found) return found;
        }
      }
      return null;
    }

    return findDept(deptTree.value, selectedDeptId.value);
  });

  // 按部门筛选
  function filterByDept(deptId: number | undefined) {
    queryParams.value.deptId = deptId;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 选择部门（包含子部门）
  function filterByDeptWithChildren(deptId: number | undefined) {
    queryParams.value.deptId = deptId;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 清除部门筛选
  function clearDeptFilter() {
    queryParams.value.deptId = undefined;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  return {
    list,
    total,
    loading,
    deptTree,
    selectedDeptId,
    selectedDept,
    filterByDept,
    filterByDeptWithChildren,
    clearDeptFilter,
  };
}

// ============================================================================
// 示例 4：日期范围筛选
// ============================================================================

/**
 * 日期范围筛选示例
 */
function dateRangeFilter() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 日期范围
  const dateRange = ref<[string, string] | null>(null);

  // 设置日期范围
  function setDateRange(start: string, end: string) {
    queryParams.value.startDate = start;
    queryParams.value.endDate = end;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 快捷选项
  const quickDateRanges = [
    {
      label: '今天',
      getValue: () => {
        const today = new Date();
        return [formatDate(today), formatDate(today)];
      },
    },
    {
      label: '本周',
      getValue: () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        return [formatDate(start), formatDate(now)];
      },
    },
    {
      label: '本月',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return [formatDate(start), formatDate(now)];
      },
    },
    {
      label: '本年',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return [formatDate(start), formatDate(now)];
      },
    },
  ];

  // 应用快捷日期
  function applyQuickRange(range: (typeof quickDateRanges)[0]) {
    const [start, end] = range.getValue();
    dateRange.value = [start, end];
    setDateRange(start, end);
  }

  // 清除日期筛选
  function clearDateRange() {
    dateRange.value = null;
    queryParams.value.startDate = undefined;
    queryParams.value.endDate = undefined;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 格式化日期
  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  return {
    list,
    total,
    loading,
    dateRange,
    quickDateRanges,
    setDateRange,
    applyQuickRange,
    clearDateRange,
  };
}

// ============================================================================
// 示例 5：高级组合筛选
// ============================================================================

/**
 * 高级组合筛选示例
 */
function advancedFilter() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList();

  // 筛选表单
  const filterForm = ref<SysUserQuery>({
    keyword: '',
    status: undefined,
    deptId: undefined,
    phone: '',
    startDate: '',
    endDate: '',
    pageNum: 1,
    pageSize: 10,
  });

  // 是否展开高级筛选
  const advancedExpanded = ref(false);

  // 是否应用了筛选
  const hasActiveFilters = computed(() => {
    const f = filterForm.value;
    return !!(
      f.keyword ||
      f.status !== undefined ||
      f.deptId ||
      f.phone ||
      f.startDate ||
      f.endDate
    );
  });

  // 激活的筛选器数量
  const activeFilterCount = computed(() => {
    let count = 0;
    if (filterForm.value.keyword) count++;
    if (filterForm.value.status !== undefined) count++;
    if (filterForm.value.deptId) count++;
    if (filterForm.value.phone) count++;
    if (filterForm.value.startDate) count++;
    if (filterForm.value.endDate) count++;
    return count;
  });

  // 应用筛选
  function applyFilters() {
    queryParams.value = {
      ...filterForm.value,
      pageNum: 1,
    };
    fetchList();
  }

  // 重置筛选
  function resetFilters() {
    filterForm.value = {
      keyword: '',
      status: undefined,
      deptId: undefined,
      phone: '',
      startDate: '',
      endDate: '',
      pageNum: 1,
      pageSize: 10,
    };
    resetParams();
    fetchList();
  }

  // 快速筛选预设
  const filterPresets = [
    {
      id: 'all',
      label: '全部用户',
      filters: {},
    },
    {
      id: 'active',
      label: '正常用户',
      filters: { status: '0' as const },
    },
    {
      id: 'inactive',
      label: '停用用户',
      filters: { status: '1' as const },
    },
    {
      id: 'recent',
      label: '最近创建',
      filters: { startDate: getRecentDate(7) },
    },
  ];

  // 应用预设筛选
  function applyPreset(presetId: string) {
    const preset = filterPresets.find((p) => p.id === presetId);
    if (!preset) return;

    filterForm.value = {
      ...filterForm.value,
      ...preset.filters,
    };
    applyFilters();
  }

  // 获取最近N天的日期
  function getRecentDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  return {
    list,
    total,
    loading,
    filterForm,
    advancedExpanded,
    hasActiveFilters,
    activeFilterCount,
    filterPresets,
    applyFilters,
    resetFilters,
    applyPreset,
  };
}

// ============================================================================
// 示例 6：排序功能
// ============================================================================

/**
 * 排序功能示例
 */
function sortingFeature() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 可排序列配置
  const sortableColumns = [
    { key: 'userId', label: '用户ID', sortable: true },
    { key: 'username', label: '用户名', sortable: true },
    { key: 'nickname', label: '昵称', sortable: true },
    { key: 'createTime', label: '创建时间', sortable: true },
    { key: 'loginDate', label: '最后登录', sortable: true },
  ];

  // 当前排序列
  const sortedColumn = computed(() => queryParams.value.sortBy);

  // 当前排序方向
  const sortOrder = computed(() => queryParams.value.sortOrder);

  // 排序列样式
  function getSortClass(column: string): string {
    if (sortedColumn.value !== column) return '';
    return sortOrder.value === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  // 排序图标
  function getSortIcon(column: string): string {
    if (sortedColumn.value !== column) return '⇅';
    return sortOrder.value === 'asc' ? '↑' : '↓';
  }

  // 处理表头点击排序
  function handleSort(column: string) {
    if (sortedColumn.value === column) {
      // 切换排序方向
      queryParams.value.sortOrder = queryParams.value.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // 新列默认降序
      queryParams.value.sortBy = column;
      queryParams.value.sortOrder = 'desc';
    }
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 多列排序支持
  const multiSort = ref<Array<{ column: string; order: 'asc' | 'desc' }>>([]);

  function handleMultiSort(column: string, event: MouseEvent) {
    if (event.shiftKey) {
      // Shift + 点击，多列排序
      const existing = multiSort.value.find((s) => s.column === column);
      if (existing) {
        existing.order = existing.order === 'asc' ? 'desc' : 'asc';
      } else {
        multiSort.value.push({ column, order: 'desc' });
      }
    } else {
      // 普通点击，单列排序
      handleSort(column);
      multiSort.value = [];
    }
  }

  // 清除排序
  function clearSort() {
    queryParams.value.sortBy = undefined;
    queryParams.value.sortOrder = undefined;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  return {
    list,
    total,
    loading,
    sortableColumns,
    sortedColumn,
    sortOrder,
    multiSort,
    getSortClass,
    getSortIcon,
    handleSort,
    handleMultiSort,
    clearSort,
  };
}

// ============================================================================
// 示例 7：保存筛选状态
// ============================================================================

/**
 * 筛选状态持久化示例
 */
function filterPersistence() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList();

  // 存储键名
  const STORAGE_KEY = 'user_filter_state';

  // 保存筛选状态到 localStorage
  function saveFilterState() {
    const state = {
      keyword: queryParams.value.keyword,
      status: queryParams.value.status,
      deptId: queryParams.value.deptId,
      startDate: queryParams.value.startDate,
      endDate: queryParams.value.endDate,
      sortBy: queryParams.value.sortBy,
      sortOrder: queryParams.value.sortOrder,
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // 从 localStorage 恢复筛选状态
  function restoreFilterState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const state = JSON.parse(saved);
      queryParams.value = {
        ...queryParams.value,
        ...state,
      };
      fetchList();
    } catch (e) {
      console.error('恢复筛选状态失败:', e);
    }
  }

  // 清除保存的筛选状态
  function clearSavedState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // 监听筛选变化，自动保存
  watch(
    () => queryParams.value,
    () => {
      saveFilterState();
    },
    { deep: true },
  );

  // 保存预设筛选
  const filterPresets = ref<
    Array<{
      id: string;
      name: string;
      filters: Partial<SysUserQuery>;
    }>
  >([]);

  // 保存当前筛选为预设
  function saveAsPreset(name: string) {
    const preset = {
      id: Date.now().toString(),
      name,
      filters: {
        keyword: queryParams.value.keyword,
        status: queryParams.value.status,
        deptId: queryParams.value.deptId,
        startDate: queryParams.value.startDate,
        endDate: queryParams.value.endDate,
      },
    };
    filterPresets.value.push(preset);
    localStorage.setItem('user_filter_presets', JSON.stringify(filterPresets.value));
  }

  // 加载预设
  function loadPresets() {
    const saved = localStorage.getItem('user_filter_presets');
    if (saved) {
      try {
        filterPresets.value = JSON.parse(saved);
      } catch (e) {
        console.error('加载预设失败:', e);
      }
    }
  }

  // 应用预设
  function applyPreset(presetId: string) {
    const preset = filterPresets.value.find((p) => p.id === presetId);
    if (!preset) return;

    queryParams.value = {
      ...queryParams.value,
      ...preset.filters,
      pageNum: 1,
    };
    fetchList();
  }

  // 删除预设
  function deletePreset(presetId: string) {
    filterPresets.value = filterPresets.value.filter((p) => p.id !== presetId);
    localStorage.setItem('user_filter_presets', JSON.stringify(filterPresets.value));
  }

  return {
    list,
    total,
    loading,
    filterPresets,
    saveAsPreset,
    loadPresets,
    applyPreset,
    deletePreset,
    saveFilterState,
    restoreFilterState,
    clearSavedState,
  };
}
