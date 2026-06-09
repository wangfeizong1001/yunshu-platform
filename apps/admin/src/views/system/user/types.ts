/**
 * 用户类型定义
 */

import type { SysUser, SysUserQuery } from '@yunshu/shared'

export { SysUser, SysUserQuery }

export type { SysUserForm } from '@yunshu/shared'

/** 用户状态枚举 */
export const UserStatusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' },
]

/** 用户性别枚举 */
export const SexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
  { label: '未知', value: '2' },
]

/** 表格列定义 */
export const tableColumns = [
  { prop: 'userId', label: '用户编号', width: '80' },
  { prop: 'username', label: '用户名称', width: '120' },
  { prop: 'nickname', label: '用户昵称', width: '120' },
  { prop: 'deptName', label: '部门', width: '150' },
  { prop: 'phone', label: '手机号码', width: '120' },
  { prop: 'email', label: '邮箱', width: '180' },
  { prop: 'sex', label: '性别', width: '80', slot: 'sex' },
  { prop: 'status', label: '状态', width: '80', slot: 'status' },
  { prop: 'loginDate', label: '最后登录', width: '180' },
  { prop: 'createTime', label: '创建时间', width: '180' },
  { prop: 'action', label: '操作', width: '200', fixed: 'right' },
]
