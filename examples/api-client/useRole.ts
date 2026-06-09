/**
 * 角色管理 Hook 使用示例
 *
 * 演示 useRoleList、useRoleDetail、useRoleForm、useRolePermission 的完整用法
 */

import { ref, onMounted, computed } from 'vue'
import {
  useRoleList,
  useRoleDetail,
  useRoleForm,
  useRolePermission
} from '@yunshu/api-client'
import type { SysRole, SysRoleForm } from '@yunshu/shared/types/system'

// ============================================================================
// 示例 1：角色列表查询
// ============================================================================

/**
 * 基础角色列表
 */
function basicRoleList() {
  const {
    list,        // Ref<SysRole[]> - 角色列表
    total,       // Ref<number> - 总数
    loading,     // Ref<boolean> - 加载状态
    queryParams, // Ref<SysRoleQuery> - 查询参数
    fetchList,   // () => Promise<void> - 获取列表
    resetParams  // () => void - 重置参数
  } = useRoleList({
    // 初始查询参数
    initialParams: {
      status: '0',
      pageNum: 1,
      pageSize: 10
    },
    // 是否立即加载，默认 true
    immediate: true
  })

  return { list, total, loading, queryParams, fetchList, resetParams }
}

/**
 * 按条件筛选角色
 */
function filteredRoleList() {
  const {
    list,
    total,
    loading,
    queryParams,
    fetchList,
    resetParams
  } = useRoleList()

  // 按状态筛选
  function filterByStatus(status: '0' | '1') {
    queryParams.value.status = status
    fetchList()
  }

  // 搜索角色
  function searchRole(keyword: string) {
    queryParams.value.keyword = keyword
    fetchList()
  }

  // 显示正常角色
  function showNormalRoles() {
    queryParams.value.status = '0'
    fetchList()
  }

  // 显示停用角色
  function showDisabledRoles() {
    queryParams.value.status = '1'
    fetchList()
  }

  return {
    list,
    total,
    loading,
    queryParams,
    filterByStatus,
    searchRole,
    showNormalRoles,
    showDisabledRoles,
    resetParams
  }
}

// ============================================================================
// 示例 2：角色详情
// ============================================================================

/**
 * 获取角色详情
 */
function roleDetail() {
  const {
    data,       // Ref<SysRole | null> - 角色信息
    loading,    // Ref<boolean> - 加载状态
    fetchDetail // (roleId: number) => Promise<void> - 获取详情
  } = useRoleDetail()

  // 获取 ID 为 1 的角色详情
  async function loadRole(roleId: number) {
    await fetchDetail(roleId)
    if (data.value) {
      console.log('角色名称:', data.value.roleName)
      console.log('角色标识:', data.value.roleKey)
      console.log('权限字符:', data.value.perms)
    }
  }

  return { data, loading, fetchDetail: loadRole }
}

// ============================================================================
// 示例 3：角色表单（创建/更新/删除）
// ============================================================================

/**
 * 角色表单操作
 */
function roleFormOperations() {
  const {
    submitting, // Ref<boolean> - 提交状态
    create,     // (data: SysRoleForm) => Promise<SysRole> - 创建角色
    update,     // (roleId: number, data: SysRoleForm) => Promise<SysRole> - 更新角色
    delete: deleteRole,  // (roleId: number) => Promise<void> - 删除角色
    batchDelete,         // (roleIds: number[]) => Promise<void> - 批量删除
    changeStatus          // (roleId: number, status: '0' | '1') => Promise<void> - 修改状态
  } = useRoleForm()

  // 创建新角色
  async function handleCreate() {
    const formData: SysRoleForm = {
      roleName: '角色名称',
      roleKey: 'role_key',
      roleSort: 1,
      status: '0',
      remark: '角色备注'
    }

    try {
      const result = await create(formData)
      console.log('创建成功:', result)
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  // 更新角色
  async function handleUpdate(roleId: number) {
    const formData: SysRoleForm = {
      roleName: '更新后的角色名称',
      roleKey: 'updated_role_key',
      roleSort: 2,
      remark: '更新后的备注'
    }

    try {
      const result = await update(roleId, formData)
      console.log('更新成功:', result)
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  // 删除角色
  async function handleDelete(roleId: number) {
    if (!confirm('确定要删除该角色吗？')) return

    try {
      await deleteRole(roleId)
      console.log('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 批量删除
  async function handleBatchDelete(roleIds: number[]) {
    try {
      await batchDelete(roleIds)
      console.log('批量删除成功')
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  // 修改角色状态
  async function handleChangeStatus(roleId: number, status: '0' | '1') {
    try {
      await changeStatus(roleId, status)
      console.log('状态修改成功')
    } catch (error) {
      console.error('状态修改失败:', error)
    }
  }

  return {
    submitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
    handleChangeStatus
  }
}

// ============================================================================
// 示例 4：角色权限管理
// ============================================================================

/**
 * 角色权限操作
 */
function rolePermissionOperations() {
  const {
    loading,      // Ref<boolean> - 加载状态
    submitting,    // Ref<boolean> - 提交状态
    assignMenus,   // (roleId: number, menuIds: number[]) => Promise<void> - 分配菜单权限
    assignDataScope, // (roleId: number, dataScope: string, deptIds?: number[]) => Promise<void> - 分配数据权限
    getRoleMenus,  // (roleId: number) => Promise<number[]> - 获取角色菜单权限
    getRoleDataScope // (roleId: number) => Promise<{ dataScope: string; deptIds: number[] }> - 获取角色数据权限
  } = useRolePermission()

  // 获取角色的菜单权限
  async function loadRoleMenus(roleId: number) {
    try {
      const menuIds = await getRoleMenus(roleId)
      console.log('角色菜单权限:', menuIds)
      return menuIds
    } catch (error) {
      console.error('获取菜单权限失败:', error)
      return []
    }
  }

  // 获取角色的数据权限
  async function loadRoleDataScope(roleId: number) {
    try {
      const scope = await getRoleDataScope(roleId)
      console.log('数据权限:', scope)
      return scope
    } catch (error) {
      console.error('获取数据权限失败:', error)
      return { dataScope: '', deptIds: [] }
    }
  }

  // 分配菜单权限
  async function handleAssignMenus(roleId: number, menuIds: number[]) {
    try {
      await assignMenus(roleId, menuIds)
      console.log('菜单权限分配成功')
    } catch (error) {
      console.error('菜单权限分配失败:', error)
    }
  }

  // 分配数据权限
  async function handleAssignDataScope(
    roleId: number,
    dataScope: string,
    deptIds?: number[]
  ) {
    try {
      await assignDataScope(roleId, dataScope, deptIds)
      console.log('数据权限分配成功')
    } catch (error) {
      console.error('数据权限分配失败:', error)
    }
  }

  // 数据权限类型说明：
  // '1' - 全部数据权限
  // '2' - 自定义数据权限
  // '3' - 本部门数据权限
  // '4' - 本部门及以下数据权限
  // '5' - 仅本人数据权限

  // 示例：分配自定义数据权限给某角色
  async function assignCustomDataScope(roleId: number, deptIds: number[]) {
    await handleAssignDataScope(roleId, '2', deptIds)
  }

  // 示例：分配本部门及以下数据权限
  async function assignDeptAndChildDataScope(roleId: number) {
    await handleAssignDataScope(roleId, '4')
  }

  return {
    loading,
    submitting,
    loadRoleMenus,
    loadRoleDataScope,
    handleAssignMenus,
    handleAssignDataScope,
    assignCustomDataScope,
    assignDeptAndChildDataScope
  }
}

// ============================================================================
// 示例 5：完整角色管理页面
// ============================================================================

/**
 * 角色管理页面组合式函数
 */
export function useRoleManagement() {
  // 列表
  const {
    list,
    total,
    loading,
    queryParams,
    fetchList,
    resetParams
  } = useRoleList({
    initialParams: { status: '0' }
  })

  // 选中的角色
  const selectedRoles = ref<number[]>([])
  const currentRole = ref<SysRole | null>(null)

  // 详情
  const { data: roleDetail, fetchDetail } = useRoleDetail()

  // 表单
  const {
    submitting,
    create,
    update,
    delete: deleteRole,
    batchDelete,
    changeStatus
  } = useRoleForm()

  // 权限
  const {
    loading: permissionLoading,
    submitting: permissionSubmitting,
    assignMenus,
    assignDataScope,
    getRoleMenus,
    getRoleDataScope
  } = useRolePermission()

  // 当前角色的菜单权限
  const currentRoleMenus = ref<number[]>([])

  // 分页变化
  function handlePageChange(page: number) {
    queryParams.value.pageNum = page
    fetchList()
  }

  // 每页数量变化
  function handleSizeChange(size: number) {
    queryParams.value.pageSize = size
    queryParams.value.pageNum = 1
    fetchList()
  }

  // 搜索角色
  function handleSearch(keyword: string) {
    queryParams.value.keyword = keyword
    queryParams.value.pageNum = 1
    fetchList()
  }

  // 查看角色详情
  async function handleViewDetail(roleId: number) {
    await fetchDetail(roleId)
    currentRole.value = roleDetail.value
  }

  // 查看角色权限
  async function handleViewPermissions(roleId: number) {
    currentRole.value = { roleId } as SysRole
    currentRoleMenus.value = await getRoleMenus(roleId)
  }

  // 创建角色
  async function handleCreate(formData: SysRoleForm) {
    await create(formData)
    await fetchList()
  }

  // 更新角色
  async function handleUpdate(roleId: number, formData: SysRoleForm) {
    await update(roleId, formData)
    await fetchList()
  }

  // 删除角色
  async function handleDelete(roleId: number) {
    await deleteRole(roleId)
    await fetchList()
  }

  // 批量删除
  async function handleBatchDelete() {
    if (selectedRoles.value.length === 0) return
    await batchDelete(selectedRoles.value)
    selectedRoles.value = []
    await fetchList()
  }

  // 切换状态
  async function handleToggleStatus(roleId: number, currentStatus: '0' | '1') {
    const newStatus = currentStatus === '0' ? '1' : '0'
    await changeStatus(roleId, newStatus)
    await fetchList()
  }

  // 分配菜单权限
  async function handleAssignMenus(roleId: number, menuIds: number[]) {
    await assignMenus(roleId, menuIds)
  }

  // 分配数据权限
  async function handleAssignDataScope(
    roleId: number,
    dataScope: string,
    deptIds?: number[]
  ) {
    await assignDataScope(roleId, dataScope, deptIds)
  }

  // 获取角色数据权限
  async function fetchRoleDataScope(roleId: number) {
    return await getRoleDataScope(roleId)
  }

  return {
    // 列表状态
    list,
    total,
    loading,
    queryParams,
    selectedRoles,

    // 分页操作
    handlePageChange,
    handleSizeChange,

    // 搜索和重置
    handleSearch,
    resetParams,

    // 详情
    currentRole,
    handleViewDetail,

    // CRUD 操作
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
    handleToggleStatus,
    submitting,

    // 权限管理
    handleViewPermissions,
    handleAssignMenus,
    handleAssignDataScope,
    fetchRoleDataScope,
    currentRoleMenus,
    permissionLoading,
    permissionSubmitting
  }
}

// ============================================================================
// 示例 6：权限树选择组件
// ============================================================================

/**
 * 权限树选择组合式函数
 *
 * 用于在角色编辑时选择菜单权限
 */
export function usePermissionTree(roleId: number) {
  const {
    loading: menuLoading,
    getRoleMenuTree,
    getMenuTreeSelect
  } = useMenuList()

  // 所有菜单树
  const allMenus = ref<{ menuId: number; menuName: string; children?: any[] }[]>([])

  // 角色已有的菜单
  const checkedKeys = ref<number[]>([])

  // 加载菜单树和角色权限
  async function loadPermissionTree() {
    // 加载所有菜单
    const menus = await getMenuTreeSelect()
    allMenus.value = menus

    // 加载角色菜单
    checkedKeys.value = await getRoleMenus(roleId)
  }

  // 选中变化处理
  function handleCheck(checked: number[]) {
    checkedKeys.value = checked
  }

  // 获取选中的叶子节点
  const getHalfCheckedKeys = computed(() => {
    // 需要根据实际情况计算半选状态
    return []
  })

  // 保存权限
  async function savePermissions() {
    await assignMenus(roleId, checkedKeys.value)
  }

  return {
    allMenus,
    checkedKeys,
    menuLoading,
    loadPermissionTree,
    handleCheck,
    savePermissions
  }
}
