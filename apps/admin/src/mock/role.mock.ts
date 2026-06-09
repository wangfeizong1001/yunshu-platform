/**
 * 角色 Mock 数据
 */

import type { SysRole, SysRolePageResp } from '@yunshu/shared'

// 生成 Mock 角色数据
export const mockRoleList: SysRole[] = [
  {
    roleId: 1,
    roleName: '超级管理员',
    roleKey: 'admin',
    roleSort: 1,
    dataScope: '1',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    permissions: ['*'],
    remark: '拥有系统所有权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    roleId: 2,
    roleName: '普通角色',
    roleKey: 'common',
    roleSort: 2,
    dataScope: '2',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    permissions: [
      'system:user:list',
      'system:user:query',
      'system:post:list',
      'system:post:query',
    ],
    remark: '普通角色，拥有基本查询权限',
    createTime: '2023-01-15 00:00:00',
  },
  {
    roleId: 3,
    roleName: '访客角色',
    roleKey: 'guest',
    roleSort: 3,
    dataScope: '5',
    menuCheckStrictly: false,
    deptCheckStrictly: false,
    status: '0',
    permissions: ['system:user:list'],
    remark: '访客角色，只读权限',
    createTime: '2023-03-01 00:00:00',
  },
]

// 获取角色分页列表 Mock
export function getMockRolePage(params: any): SysRolePageResp {
  const { pageNum = 1, pageSize = 10, keyword = '', status = '' } = params

  let filteredList = mockRoleList

  // 关键词过滤
  if (keyword) {
    filteredList = filteredList.filter(
      (role) => role.roleName.includes(keyword) || role.roleKey.includes(keyword)
    )
  }

  // 状态过滤
  if (status) {
    filteredList = filteredList.filter((role) => role.status === status)
  }

  // 分页
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取角色详情 Mock
export function getMockRoleDetail(roleId: number): SysRole | undefined {
  return mockRoleList.find((role) => role.roleId === roleId)
}

// 新增角色 Mock
export function addMockRole(role: Partial<SysRole>): SysRole {
  const newRole: SysRole = {
    roleId: Math.max(...mockRoleList.map((r) => r.roleId)) + 1,
    roleName: role.roleName || '',
    roleKey: role.roleKey || '',
    roleSort: role.roleSort || 0,
    dataScope: role.dataScope || '5',
    menuCheckStrictly: role.menuCheckStrictly ?? true,
    deptCheckStrictly: role.deptCheckStrictly ?? true,
    status: role.status || '0',
    permissions: role.permissions || [],
    remark: role.remark || '',
    createTime: new Date().toLocaleString(),
  }
  mockRoleList.push(newRole)
  return newRole
}

// 更新角色 Mock
export function updateMockRole(roleId: number, role: Partial<SysRole>): SysRole | undefined {
  const index = mockRoleList.findIndex((r) => r.roleId === roleId)
  if (index !== -1) {
    mockRoleList[index] = { ...mockRoleList[index], ...role }
    return mockRoleList[index]
  }
  return undefined
}

// 删除角色 Mock
export function deleteMockRole(roleId: number): boolean {
  const index = mockRoleList.findIndex((r) => r.roleId === roleId)
  if (index !== -1) {
    mockRoleList.splice(index, 1)
    return true
  }
  return false
}
