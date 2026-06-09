/**
 * 角色管理 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/role/list',
    method: 'get',
    params
  })
}

export const getRolePage = (params?: RoleQuery) => {
  return request({
    url: '/system/role/page',
    method: 'get',
    params
  })
}

export const getRole = (roleId: number) => {
  return request({
    url: `/system/role/${roleId}`,
    method: 'get'
  })
}

export const addRole = (data: RoleForm) => {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export const updateRole = (data: RoleForm) => {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

export const deleteRole = (roleId: number) => {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete'
  })
}

export const batchDeleteRole = (roleIds: number[]) => {
  return request({
    url: '/system/role/batch',
    method: 'delete',
    data: roleIds
  })
}

export const changeRoleStatus = (roleId: number, status: string) => {
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    params: { roleId, status }
  })
}

export const dataScope = (data: RoleForm) => {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data
  })
}

export const authRoleAll = (roleId: number, menuIds: number[]) => {
  return request({
    url: '/system/role/authRoleAll',
    method: 'put',
    data: { roleId, menuIds }
  })
}
