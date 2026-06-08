/**
 * 用户管理 API
 */

import { request } from '@/utils/request'
import type {
  SysUser,
  SysUserQuery,
  SysUserForm,
  SysUserPageResp,
  ApiResp,
} from '@yunshu/shared/types/system'

/**
 * 获取用户分页列表
 * @param params 查询参数
 */
export function getUserPage(params: SysUserQuery) {
  return request<SysUserPageResp>({
    url: '/system/user/page',
    method: 'get',
    params,
  })
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function getUserList(params?: SysUserQuery) {
  return request<SysUser[]>({
    url: '/system/user/list',
    method: 'get',
    params,
  })
}

/**
 * 获取用户详情
 * @param userId 用户ID
 */
export function getUserDetail(userId: number) {
  return request<SysUser>({
    url: `/system/user/${userId}`,
    method: 'get',
  })
}

/**
 * 新增用户
 * @param data 用户表单数据
 */
export function addUser(data: SysUserForm) {
  return request<SysUser>({
    url: '/system/user',
    method: 'post',
    data,
  })
}

/**
 * 修改用户
 * @param userId 用户ID
 * @param data 用户表单数据
 */
export function updateUser(userId: number, data: SysUserForm) {
  return request<SysUser>({
    url: `/system/user/${userId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除用户
 * @param userId 用户ID
 */
export function deleteUser(userId: number) {
  return request<void>({
    url: `/system/user/${userId}`,
    method: 'delete',
  })
}

/**
 * 批量删除用户
 * @param userIds 用户ID数组
 */
export function batchDeleteUser(userIds: number[]) {
  return request<void>({
    url: '/system/user/batch',
    method: 'delete',
    data: { userIds },
  })
}

/**
 * 修改用户状态
 * @param userId 用户ID
 * @param status 状态
 */
export function changeUserStatus(userId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/user/${userId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 重置用户密码
 * @param userId 用户ID
 * @param password 新密码
 */
export function resetUserPassword(userId: number, password: string) {
  return request<void>({
    url: `/system/user/${userId}/password`,
    method: 'put',
    data: { password },
  })
}

/**
 * 导出用户
 * @param params 查询参数
 */
export function exportUser(params?: SysUserQuery) {
  return request.download('/system/user/export', params, '用户列表.xlsx')
}

/**
 * 导入用户
 * @param file 导入文件
 */
export function importUser(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<void>({
    url: '/system/user/import',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 获取用户岗位列表
 * @param userId 用户ID
 */
export function getUserPosts(userId: number) {
  return request<number[]>({
    url: `/system/user/${userId}/posts`,
    method: 'get',
  })
}

/**
 * 分配用户岗位
 * @param userId 用户ID
 * @param postIds 岗位ID数组
 */
export function assignUserPosts(userId: number, postIds: number[]) {
  return request<void>({
    url: `/system/user/${userId}/posts`,
    method: 'put',
    data: { postIds },
  })
}

/**
 * 获取用户角色列表
 * @param userId 用户ID
 */
export function getUserRoles(userId: number) {
  return request<number[]>({
    url: `/system/user/${userId}/roles`,
    method: 'get',
  })
}

/**
 * 分配用户角色
 * @param userId 用户ID
 * @param roleIds 角色ID数组
 */
export function assignUserRoles(userId: number, roleIds: number[]) {
  return request<void>({
    url: `/system/user/${userId}/roles`,
    method: 'put',
    data: { roleIds },
  })
}
