/**
 * 用户管理 Hook 使用示例
 *
 * 演示 useUserList、useUserDetail、useUserForm、useUserImportExport 的完整用法
 */

import { ref, onMounted, watch } from 'vue';
import { useUserList, useUserDetail, useUserForm, useUserImportExport } from '@yunshu/api-client';
import type { SysUser, SysUserForm } from '@yunshu/shared/types/system';

// ============================================================================
// 示例 1：用户列表查询
// ============================================================================

/**
 * 基础用户列表
 */
function basicUserList() {
  const {
    list, // Ref<SysUser[]> - 用户列表
    total, // Ref<number> - 总数
    loading, // Ref<boolean> - 加载状态
    queryParams, // Ref<SysUserQuery> - 查询参数
    fetchList, // () => Promise<void> - 获取列表
    resetParams, // () => void - 重置参数
  } = useUserList({
    // 初始查询参数
    initialParams: {
      status: '0',
      pageNum: 1,
      pageSize: 10,
    },
    // 是否立即加载，默认 true
    immediate: true,
  });

  return { list, total, loading, queryParams, fetchList, resetParams };
}

/**
 * 条件筛选用户列表
 */
function filteredUserList() {
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList({
    initialParams: {
      status: '0', // 只查询正常状态的用户
      deptId: 1, // 某部门下的用户
      keyword: '', // 关键词
    },
  });

  // 监听筛选条件变化，自动重新加载
  watch(
    () => queryParams.value.status,
    () => fetchList(),
  );

  // 手动触发搜索
  function search(keyword: string) {
    queryParams.value.keyword = keyword;
    fetchList();
  }

  // 按状态筛选
  function filterByStatus(status: '0' | '1') {
    queryParams.value.status = status;
    fetchList();
  }

  return { list, total, loading, queryParams, search, filterByStatus, resetParams };
}

// ============================================================================
// 示例 2：用户详情
// ============================================================================

/**
 * 获取用户详情
 */
function userDetail() {
  const {
    data, // Ref<SysUser | null> - 用户信息
    loading, // Ref<boolean> - 加载状态
    fetchDetail, // (userId: number) => Promise<void> - 获取详情
  } = useUserDetail();

  // 获取 ID 为 1 的用户详情
  async function loadUser(userId: number) {
    await fetchDetail(userId);
    if (data.value) {
      console.log('用户名:', data.value.username);
      console.log('邮箱:', data.value.email);
    }
  }

  return { data, loading, fetchDetail: loadUser };
}

/**
 * 在组件中使用用户详情
 */
function UserDetailComponent() {
  const userId = ref(1);
  const { data: user, loading, fetchDetail } = useUserDetail();

  onMounted(() => {
    fetchDetail(userId.value);
  });

  return { user, loading };
}

// ============================================================================
// 示例 3：用户表单（创建/更新/删除）
// ============================================================================

/**
 * 用户表单操作
 */
function userFormOperations() {
  const {
    data, // Ref<SysUserForm | null> - 表单数据
    submitting, // Ref<boolean> - 提交状态
    create, // (data: SysUserForm) => Promise<SysUser> - 创建用户
    update, // (userId: number, data: SysUserForm) => Promise<SysUser> - 更新用户
    delete: deleteUser, // (userId: number) => Promise<void> - 删除用户
    batchDelete, // (userIds: number[]) => Promise<void> - 批量删除
    changeStatus, // (userId: number, status: '0' | '1') => Promise<void> - 修改状态
    resetPassword, // (userId: number, password: string) => Promise<void> - 重置密码
  } = useUserForm();

  // 创建新用户
  async function handleCreate() {
    const formData: SysUserForm = {
      nickname: '新用户',
      username: 'newuser',
      email: 'newuser@example.com',
      phone: '13800138000',
      sex: '0',
      deptId: 1,
      postId: [1],
      roleId: [1],
      status: '0',
    };

    try {
      const result = await create(formData);
      console.log('创建成功:', result);
    } catch (error) {
      console.error('创建失败:', error);
    }
  }

  // 更新用户
  async function handleUpdate(userId: number) {
    const formData: SysUserForm = {
      nickname: '更新后的昵称',
      email: 'updated@example.com',
    };

    try {
      const result = await update(userId, formData);
      console.log('更新成功:', result);
    } catch (error) {
      console.error('更新失败:', error);
    }
  }

  // 删除用户
  async function handleDelete(userId: number) {
    if (!confirm('确定要删除该用户吗？')) return;

    try {
      await deleteUser(userId);
      console.log('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
    }
  }

  // 批量删除
  async function handleBatchDelete(userIds: number[]) {
    try {
      await batchDelete(userIds);
      console.log('批量删除成功');
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  }

  // 修改用户状态
  async function handleChangeStatus(userId: number, status: '0' | '1') {
    try {
      await changeStatus(userId, status);
      console.log('状态修改成功');
    } catch (error) {
      console.error('状态修改失败:', error);
    }
  }

  // 重置密码
  async function handleResetPassword(userId: number, newPassword: string) {
    try {
      await resetPassword(userId, newPassword);
      console.log('密码重置成功');
    } catch (error) {
      console.error('密码重置失败:', error);
    }
  }

  return {
    data,
    submitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
    handleChangeStatus,
    handleResetPassword,
  };
}

// ============================================================================
// 示例 4：用户导入导出
// ============================================================================

/**
 * 用户导入导出操作
 */
function userImportExport() {
  const {
    importing, // Ref<boolean> - 导入状态
    exporting, // Ref<boolean> - 导出状态
    importUsers, // (file: File) => Promise<void> - 导入用户
    exportUsers, // (params?: SysUserQuery) => Promise<void> - 导出用户
  } = useUserImportExport();

  // 导出用户列表
  async function handleExport() {
    try {
      // 导出全部用户
      await exportUsers();

      // 或按条件导出
      await exportUsers({ status: '0', deptId: 1 });
    } catch (error) {
      console.error('导出失败:', error);
    }
  }

  // 导入用户
  async function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      await importUsers(file);
      console.log('导入成功');
    } catch (error) {
      console.error('导入失败:', error);
    }
  }

  return { importing, exporting, handleExport, handleImport };
}

// ============================================================================
// 示例 5：完整用户管理页面
// ============================================================================

/**
 * 用户管理页面组合式函数
 */
export function useUserManagement() {
  // 列表
  const { list, total, loading, queryParams, fetchList, resetParams } = useUserList({
    initialParams: { status: '0' },
  });

  // 选中的用户
  const selectedUsers = ref<number[]>([]);
  const currentUser = ref<SysUser | null>(null);

  // 详情
  const { data: userDetail, fetchDetail } = useUserDetail();

  // 表单
  const {
    submitting,
    create,
    update,
    delete: deleteUser,
    batchDelete,
    changeStatus,
  } = useUserForm();

  // 导入导出
  const { importing, exporting, importUsers, exportUsers } = useUserImportExport();

  // 分页变化
  function handlePageChange(page: number) {
    queryParams.value.pageNum = page;
    fetchList();
  }

  // 每页数量变化
  function handleSizeChange(size: number) {
    queryParams.value.pageSize = size;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 搜索
  function handleSearch(keyword: string) {
    queryParams.value.keyword = keyword;
    queryParams.value.pageNum = 1;
    fetchList();
  }

  // 查看详情
  async function handleViewDetail(userId: number) {
    await fetchDetail(userId);
    currentUser.value = userDetail.value;
  }

  // 创建用户
  async function handleCreate(formData: SysUserForm) {
    await create(formData);
    await fetchList();
  }

  // 更新用户
  async function handleUpdate(userId: number, formData: SysUserForm) {
    await update(userId, formData);
    await fetchList();
  }

  // 删除用户
  async function handleDelete(userId: number) {
    await deleteUser(userId);
    await fetchList();
  }

  // 批量删除
  async function handleBatchDelete() {
    if (selectedUsers.value.length === 0) return;
    await batchDelete(selectedUsers.value);
    selectedUsers.value = [];
    await fetchList();
  }

  // 切换状态
  async function handleToggleStatus(userId: number, currentStatus: '0' | '1') {
    const newStatus = currentStatus === '0' ? '1' : '0';
    await changeStatus(userId, newStatus);
    await fetchList();
  }

  return {
    // 列表状态
    list,
    total,
    loading,
    queryParams,
    selectedUsers,

    // 分页操作
    handlePageChange,
    handleSizeChange,

    // 搜索和重置
    handleSearch,
    resetParams,

    // 详情
    currentUser,
    handleViewDetail,

    // CRUD 操作
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
    handleToggleStatus,
    submitting,

    // 导入导出
    importing,
    exporting,
    handleImport: importUsers,
    handleExport: exportUsers,
  };
}
