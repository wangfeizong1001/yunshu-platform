/**
 * 用户类型定义
 */

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
  status: string
  loginDate: string
  createTime: string
  remark: string
  postId?: number[]
  roleId?: number[]
  posts?: string[]
  roles?: string[]
}

export interface UserQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: string
  deptId?: number
}

export interface DeptInfo {
  deptId: number
  parentId: number
  deptName: string
  orderNum: number
  leader: string
  phone: string
  email: string
  status: string
  remark: string
  createTime: string
  children?: DeptInfo[]
}

export interface PostInfo {
  postId: number
  postName: string
  postCode: string
  postSort: number
  status: string
  remark: string
  createTime: string
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

export const UserStatusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' },
]

export const SexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
  { label: '未知', value: '2' },
]

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
