/**
 * 角色管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface RoleQuery {
  pageNum?: number
  pageSize?: number
  roleName?: string
  roleKey?: string
  status?: string
}

export interface RoleForm {
  roleId?: number
  roleName?: string
  roleKey?: string
  roleSort?: number
  dataScope?: string
  status?: string
  remark?: string
  menuIds?: number[]
}

export interface RoleInfo {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  status: string
  remark: string
  createTime: string
}

export const getRoleList = (params?: RoleQuery) => {
  return request<unknown>({
    url: '/system/role/list',
    method: 'GET',
    params
  })
}

export const getRolePage = (params?: RoleQuery) => {
  return request<unknown>({
    url: '/system/role/page',
    method: 'GET',
    params
  })
}

export const getRole = (roleId: number) => {
  return request<unknown>({
    url: `/system/role/${roleId}`,
    method: 'GET'
  })
}

export const addRole = (data: RoleForm) => {
  return request<unknown>({
    url: '/system/role',
    method: 'POST',
    data
  })
}

export const updateRole = (data: RoleForm) => {
  return request<unknown>({
    url: '/system/role',
    method: 'PUT',
    data
  })
}

export const deleteRole = (roleId: number) => {
  return request<unknown>({
    url: `/system/role/${roleId}`,
    method: 'DELETE'
  })
}

export const batchDeleteRole = (roleIds: number[]) => {
  return request<unknown>({
    url: '/system/role/batch',
    method: 'DELETE',
    data: roleIds
  })
}

export const changeRoleStatus = (roleId: number, status: string) => {
  return request<unknown>({
    url: '/system/role/changeStatus',
    method: 'PUT',
    params: { roleId, status }
  })
}

export const dataScope = (data: RoleForm) => {
  return request<unknown>({
    url: '/system/role/dataScope',
    method: 'PUT',
    data
  })
}

export const authRoleAll = (roleId: number, menuIds: number[]) => {
  return request<unknown>({
    url: '/system/role/authRoleAll',
    method: 'PUT',
    data: { roleId, menuIds }
  })
}
