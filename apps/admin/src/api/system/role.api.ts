/**
 * 角色管理 API
 */

import { request } from '@/utils/request'
import type {
  SysRole,
  SysRoleQuery,
  SysRoleForm,
  SysRolePageResp,
} from '@yunshu/shared/types/system'

/**
 * 获取角色分页列表
 * @param params 查询参数
 */
export function getRolePage(params: SysRoleQuery) {
  return request<SysRolePageResp>({
    url: '/system/role/page',
    method: 'get',
    params,
  })
}

/**
 * 获取角色列表
 * @param params 查询参数
 */
export function getRoleList(params?: SysRoleQuery) {
  return request<SysRole[]>({
    url: '/system/role/list',
    method: 'get',
    params,
  })
}

/**
 * 获取角色详情
 * @param roleId 角色ID
 */
export function getRoleDetail(roleId: number) {
  return request<SysRole>({
    url: `/system/role/${roleId}`,
    method: 'get',
  })
}

/**
 * 新增角色
 * @param data 角色表单数据
 */
export function addRole(data: SysRoleForm) {
  return request<SysRole>({
    url: '/system/role',
    method: 'post',
    data,
  })
}

/**
 * 修改角色
 * @param roleId 角色ID
 * @param data 角色表单数据
 */
export function updateRole(roleId: number, data: SysRoleForm) {
  return request<SysRole>({
    url: `/system/role/${roleId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除角色
 * @param roleId 角色ID
 */
export function deleteRole(roleId: number) {
  return request<void>({
    url: `/system/role/${roleId}`,
    method: 'delete',
  })
}

/**
 * 批量删除角色
 * @param roleIds 角色ID数组
 */
export function batchDeleteRole(roleIds: number[]) {
  return request<void>({
    url: '/system/role/batch',
    method: 'delete',
    data: { roleIds },
  })
}

/**
 * 修改角色状态
 * @param roleId 角色ID
 * @param status 状态
 */
export function changeRoleStatus(roleId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/role/${roleId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 获取角色菜单权限
 * @param roleId 角色ID
 */
export function getRoleMenus(roleId: number) {
  return request<number[]>({
    url: `/system/role/${roleId}/menus`,
    method: 'get',
  })
}

/**
 * 分配角色菜单权限
 * @param roleId 角色ID
 * @param menuIds 菜单ID数组
 */
export function assignRoleMenus(roleId: number, menuIds: number[]) {
  return request<void>({
    url: `/system/role/${roleId}/menus`,
    method: 'put',
    data: { menuIds },
  })
}

/**
 * 获取角色数据权限
 * @param roleId 角色ID
 */
export function getRoleDataScope(roleId: number) {
  return request<{ dataScope: string; deptIds: number[] }>({
    url: `/system/role/${roleId}/dataScope`,
    method: 'get',
  })
}

/**
 * 分配角色数据权限
 * @param roleId 角色ID
 * @param dataScope 数据权限范围
 * @param deptIds 部门ID数组
 */
export function assignRoleDataScope(roleId: number, dataScope: string, deptIds?: number[]) {
  return request<void>({
    url: `/system/role/${roleId}/dataScope`,
    method: 'put',
    data: { dataScope, deptIds },
  })
}

/**
 * 获取所有角色列表（用于下拉选择）
 */
export function getAllRoles() {
  return request<SysRole[]>({
    url: '/system/role/all',
    method: 'get',
  })
}
