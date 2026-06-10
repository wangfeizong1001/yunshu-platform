/**
 * 用户管理相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

// 用户查询参数
export interface UserQuery {
  pageNum?: number
  pageSize?: number
  username?: string
  nickname?: string
  phone?: string
  status?: string
  deptId?: number
}

// 用户表单
export interface UserForm {
  userId?: number
  username?: string
  nickname?: string
  email?: string
  phone?: string
  sex?: string
  avatar?: string
  deptId?: number
  postIds?: number[]
  roleIds?: number[]
  status?: string
  remark?: string
}

// 用户信息
export interface UserInfo {
  userId: number
  username: string
  nickname: string
  email: string
  phone: string
  sex: string
  avatar: string
  deptId: number
  deptName: string
  posts: string[]
  roles: string[]
  roleId: number[]
  status: string
  loginIp: string
  loginDate: string
  createTime: string
  remark: string
}

// 获取用户列表
export function getUserList(params: UserQuery) {
  return request<{ rows: UserInfo[]; total: number }>({
    url: '/system/user/list',
    method: 'GET',
    params
  })
}

// 获取用户分页列表
export function getUserPage(params: UserQuery) {
  return request<{ rows: UserInfo[]; total: number }>({
    url: '/system/user/page',
    method: 'GET',
    params
  })
}

// 获取用户详情
export function getUser(userId: number) {
  return request<UserInfo>({
    url: `/system/user/${userId}`,
    method: 'GET'
  })
}

// 新增用户
export function addUser(data: UserForm) {
  return request<void>({
    url: '/system/user',
    method: 'POST',
    data
  })
}

// 修改用户
export function updateUser(data: UserForm) {
  return request<void>({
    url: '/system/user',
    method: 'PUT',
    data
  })
}

// 删除用户
export function deleteUser(userId: number) {
  return request<void>({
    url: `/system/user/${userId}`,
    method: 'DELETE'
  })
}

// 批量删除用户
export function batchDeleteUser(userIds: number[]) {
  return request<void>({
    url: '/system/user/batch',
    method: 'DELETE',
    data: userIds
  })
}

// 修改用户状态
export function changeUserStatus(userId: number, status: string) {
  return request<void>({
    url: '/system/user/changeStatus',
    method: 'PUT',
    params: { userId, status }
  })
}

// 重置用户密码
export function resetUserPwd(userId: number, password: string) {
  return request<void>({
    url: '/system/user/resetPwd',
    method: 'PUT',
    data: { userId, password }
  })
}

// 导出用户
export function exportUser(params: UserQuery) {
  return request<Blob>({
    url: '/system/user/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

// 导入用户模板下载
export function importTemplate() {
  return request<Blob>({
    url: '/system/user/importTemplate',
    method: 'GET',
    responseType: 'blob'
  })
}

// 导入用户
export function importUser(data: FormData) {
  return request<void>({
    url: '/system/user/import',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取所有角色列表
export function getAllRoles() {
  return request<UserInfo[]>({
    url: '/system/role/list',
    method: 'GET'
  })
}

// 分配用户角色
export function assignUserRole(userId: number, roleIds: number[]) {
  return request<void>({
    url: '/system/user/assignRole',
    method: 'PUT',
    data: { userId, roleIds }
  })
}

// 获取用户角色列表
export function getUserRoles(userId: number) {
  return request<UserInfo>({
    url: `/system/user/${userId}/roles`,
    method: 'GET'
  })
}
