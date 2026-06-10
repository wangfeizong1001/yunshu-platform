/**
 * 分页、筛选、排序使用示例
 *
 * 演示各种分页模式、筛选条件和排序的使用方法
 */

import { ref, computed, onMounted } from 'vue';
import { useUserList, useRoleList, usePostList } from '@yunshu/api-client';
import type { SysUserQuery } from '@yunshu/shared/types/system';

// ============================================================================
// 示例 1：基础分页
// ============================================================================

/**
 * 基础分页示例
 */
function basicPagination() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList();

  // 当前页码
  const currentPage = computed(() => queryParams.value.pageNum ?? 1);

  // 每页条数
  const pageSize = computed(() => queryParams.value.pageSize ?? 10);

  // 总页数
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

  // 是否有下一页
  const hasNextPage = computed(() => currentPage.value < totalPages.value);

  // 是否有上一页
  const hasPrevPage = computed(() => currentPage.value > 1);

  // 跳转到指定页
  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return;
    queryParams.value.pageNum = page;
    fetchList();
  }

  // 下一页
  function nextPage() {
    goToPage(currentPage.value + 1);
  }

  // 上一页
  function prevPage() {
    goToPage(currentPage.value - 1);
  }

  // 修改每页条数
  function changePageSize(size: number) {
    queryParams.value.pageSize = size;
    queryParams.value.pageNum = 1; // 重置到第一页
    fetchList();
  }

  return {
    list,
    total,
    loading,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    resetParams,
  };
}

// ============================================================================
// 示例 2：分页器组件集成
// ============================================================================

/**
 * 分页器组件集成示例
 */
function paginationWithUI() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 表格列配置
  const columns = [
    { key: 'username', label: '用户名' },
    { key: 'nickname', label: '昵称' },
    { key: 'email', label: '邮箱' },
    { key: 'status', label: '状态' },
    { key: 'createTime', label: '创建时间' },
  ];

  // 分页配置
  const paginationConfig = computed(() => ({
    current: queryParams.value.pageNum ?? 1,
    pageSize: queryParams.value.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: number) => `共 ${total} 条记录`,
  }));

  // 分页变化处理
  function handlePageChange(page: number, pageSize: number) {
    queryParams.value.pageNum = page;
    if (pageSize !== queryParams.value.pageSize) {
      queryParams.value.pageSize = pageSize;
      queryParams.value.pageNum = 1;
    }
    fetchList();
  }

  // 渲染表格
  function renderTable() {
    return `
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${list.value
            .map(
              (item) => `
            <tr>
              ${columns.map((col) => `<td>${item[col.key]}</td>`).join('')}
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  return {
    list,
    total,
    loading,
    columns,
    paginationConfig,
    handlePageChange,
    renderTable,
  };
}

// ============================================================================
// 示例 3：无限滚动
// ============================================================================

/**
 * 无限滚动加载示例
 */
function infiniteScroll() {
  const { list, total, loading, queryParams, fetchList } = useUserList({
    initialParams: {
      pageNum: 1,
      pageSize: 20,
    },
  });

  // 是否还有更多数据
  const hasMore = computed(() => list.value.length < total.value);

  // 加载更多数据
  async function loadMore() {
    if (loading.value || !hasMore.value) return;

    queryParams.value.pageNum!++;
    await fetchList();
  }

  // 重置并重新加载
  async function resetAndLoad() {
    queryParams.value.pageNum = 1;
    list.value = []; // 清空现有数据
    await fetchList();
  }

  // 滚动到底部检测
  function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // 距离底部 100px 时触发加载
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMore();
    }
  }

  return {
    list,
    total,
    loading,
    hasMore,
    loadMore,
    resetAndLoad,
    onScroll,
  };
}

// ============================================================================
// 示例 4：筛选查询
// ============================================================================

/**
 * 筛选查询示例
 */
function filterQueries() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList();

  // 预设的筛选条件
  const filterPresets = {
    all: { status: undefined, deptId: undefined },
    active: { status: '0', deptId: undefined },
    inactive: { status: '1', deptId: undefined },
    byDept: (deptId: number) => ({ status: undefined, deptId }),
  };

  // 按状态筛选
  function filterByStatus(status: '0' | '1') {
    queryParams.value.status = status;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 按部门筛选
  function filterByDept(deptId: number) {
    queryParams.value.deptId = deptId;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 按关键词搜索
  function search(keyword: string) {
    queryParams.value.keyword = keyword;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 按日期范围筛选
  function filterByDateRange(startDate: string, endDate: string) {
    queryParams.value.startDate = startDate;
    queryParams.value.endDate = endDate;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 组合筛选
  function applyFilters(filters: Partial<SysUserQuery>) {
    Object.assign(queryParams.value, filters);
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 清除筛选条件
  function clearFilters() {
    resetParams();
    fetchList();
  }

  // 获取当前激活的筛选条件
  const activeFilters = computed(() => {
    const filters: string[] = [];

    if (queryParams.value.status) {
      filters.push(`状态: ${queryParams.value.status === '0' ? '正常' : '停用'}`);
    }
    if (queryParams.value.deptId) {
      filters.push(`部门: ${queryParams.value.deptId}`);
    }
    if (queryParams.value.keyword) {
      filters.push(`关键词: ${queryParams.value.keyword}`);
    }
    if (queryParams.value.startDate) {
      filters.push(`开始: ${queryParams.value.startDate}`);
    }
    if (queryParams.value.endDate) {
      filters.push(`结束: ${queryParams.value.endDate}`);
    }

    return filters;
  });

  return {
    list,
    total,
    loading,
    filterPresets,
    filterByStatus,
    filterByDept,
    search,
    filterByDateRange,
    applyFilters,
    clearFilters,
    activeFilters,
  };
}

// ============================================================================
// 示例 5：排序查询
// ============================================================================

/**
 * 排序查询示例
 */
function sortingQueries() {
  const { list, total, loading, queryParams, fetchList } = useUserList();

  // 支持排序的字段
  const sortableFields = [
    { key: 'userId', label: '用户ID' },
    { key: 'username', label: '用户名' },
    { key: 'createTime', label: '创建时间' },
    { key: 'loginDate', label: '最后登录' },
  ];

  // 当前排序状态
  const currentSort = computed(() => ({
    field: queryParams.value.sortBy,
    order: queryParams.value.sortOrder,
  }));

  // 设置排序字段和方向
  function setSort(field: string, order: 'asc' | 'desc' = 'asc') {
    queryParams.value.sortBy = field;
    queryParams.value.sortOrder = order;
    fetchList();
  }

  // 切换排序方向
  function toggleSort(field: string) {
    if (queryParams.value.sortBy === field) {
      // 如果当前字段已排序，切换方向
      queryParams.value.sortOrder = queryParams.value.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // 新字段默认降序
      queryParams.value.sortBy = field;
      queryParams.value.sortOrder = 'desc';
    }
    fetchList();
  }

  // 按某字段排序（升序）
  function sortBy(field: string) {
    setSort(field, 'asc');
  }

  // 按某字段排序（降序）
  function sortByDesc(field: string) {
    setSort(field, 'desc');
  }

  // 清除排序
  function clearSort() {
    queryParams.value.sortBy = undefined;
    queryParams.value.sortOrder = undefined;
    fetchList();
  }

  // 获取排序图标类名
  function getSortIcon(field: string): string {
    if (queryParams.value.sortBy !== field) {
      return 'sort-default';
    }
    return queryParams.value.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  return {
    list,
    total,
    loading,
    sortableFields,
    currentSort,
    setSort,
    toggleSort,
    sortBy,
    sortByDesc,
    clearSort,
    getSortIcon,
  };
}

// ============================================================================
// 示例 6：高级筛选面板
// ============================================================================

/**
 * 高级筛选面板组合式函数
 */
export function useAdvancedFilters() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList();

  // 筛选表单数据
  const filterForm = ref({
    keyword: '',
    status: undefined as '0' | '1' | undefined,
    deptId: undefined as number | undefined,
    startDate: '',
    endDate: '',
    sortBy: '',
    sortOrder: undefined as 'asc' | 'desc' | undefined,
  });

  // 筛选表单配置
  const filterConfig = {
    statusOptions: [
      { value: undefined, label: '全部' },
      { value: '0', label: '正常' },
      { value: '1', label: '停用' },
    ],
    deptOptions: [
      // 通常从 API 加载或静态配置
      { value: 1, label: '技术部' },
      { value: 2, label: '运营部' },
      { value: 3, label: '财务部' },
    ],
  };

  // 应用筛选
  function applyFilters() {
    queryParams.value = {
      pageNum: 1,
      pageSize: queryParams.value.pageSize ?? 10,
      keyword: filterForm.value.keyword || undefined,
      status: filterForm.value.status,
      deptId: filterForm.value.deptId,
      startDate: filterForm.value.startDate || undefined,
      endDate: filterForm.value.endDate || undefined,
      sortBy: filterForm.value.sortBy || undefined,
      sortOrder: filterForm.value.sortOrder,
    };
    fetchList();
  }

  // 重置筛选
  function resetFilters() {
    filterForm.value = {
      keyword: '',
      status: undefined,
      deptId: undefined,
      startDate: '',
      endDate: '',
      sortBy: '',
      sortOrder: undefined,
    };
    resetParams();
    fetchList();
  }

  // 保存筛选状态到 URL
  function saveFiltersToUrl() {
    const params = new URLSearchParams();

    if (filterForm.value.keyword) {
      params.set('keyword', filterForm.value.keyword);
    }
    if (filterForm.value.status) {
      params.set('status', filterForm.value.status);
    }
    if (filterForm.value.deptId) {
      params.set('deptId', String(filterForm.value.deptId));
    }
    if (filterForm.value.startDate) {
      params.set('startDate', filterForm.value.startDate);
    }
    if (filterForm.value.endDate) {
      params.set('endDate', filterForm.value.endDate);
    }
    if (filterForm.value.sortBy) {
      params.set('sortBy', filterForm.value.sortBy);
    }
    if (filterForm.value.sortOrder) {
      params.set('sortOrder', filterForm.value.sortOrder);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  // 从 URL 恢复筛选状态
  function restoreFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('keyword')) {
      filterForm.value.keyword = params.get('keyword')!;
    }
    if (params.has('status')) {
      filterForm.value.status = params.get('status') as '0' | '1';
    }
    if (params.has('deptId')) {
      filterForm.value.deptId = Number(params.get('deptId'));
    }
    if (params.has('startDate')) {
      filterForm.value.startDate = params.get('startDate')!;
    }
    if (params.has('endDate')) {
      filterForm.value.endDate = params.get('endDate')!;
    }
    if (params.has('sortBy')) {
      filterForm.value.sortBy = params.get('sortBy')!;
    }
    if (params.has('sortOrder')) {
      filterForm.value.sortOrder = params.get('sortOrder') as 'asc' | 'desc';
    }

    applyFilters();
  }

  return {
    list,
    total,
    loading,
    filterForm,
    filterConfig,
    applyFilters,
    resetFilters,
    saveFiltersToUrl,
    restoreFiltersFromUrl,
  };
}

// ============================================================================
// 示例 7：多模块统一筛选
// ============================================================================

/**
 * 多模块统一筛选管理
 */
export function useUnifiedFilters() {
  // 用户列表
  const userList = useUserList();
  // 角色列表
  const roleList = useRoleList();
  // 岗位列表
  const postList = usePostList();

  // 全局筛选条件
  const globalFilters = ref({
    keyword: '',
    status: undefined as '0' | '1' | undefined,
  });

  // 批量应用筛选
  function applyGlobalFilters() {
    // 应用到用户列表
    Object.assign(userList.queryParams.value, globalFilters.value);
    userList.fetchList();

    // 应用到角色列表
    Object.assign(roleList.queryParams.value, globalFilters.value);
    roleList.fetchList();

    // 应用到岗位列表
    Object.assign(postList.queryParams.value, globalFilters.value);
    postList.fetchList();
  }

  // 清除所有筛选
  function clearAllFilters() {
    globalFilters.value = {
      keyword: '',
      status: undefined,
    };

    userList.resetParams();
    userList.fetchList();

    roleList.resetParams();
    roleList.fetchList();

    postList.resetParams();
    postList.fetchList();
  }

  return {
    userList,
    roleList,
    postList,
    globalFilters,
    applyGlobalFilters,
    clearAllFilters,
  };
}
