/**
 * 系统用户类型定义
 */

/** 用户状态 */
export type UserStatus = '0' | '1';

/** 用户性别 */
export type UserSex = '0' | '1' | '2';

/** 用户登录信息 */
export interface SysUser {
  /** 用户ID */
  userId: number;
  /** 用户名 */
  username: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户邮箱 */
  email: string;
  /** 手机号码 */
  phone: string;
  /** 用户性别: 0=男, 1=女, 2=未知 */
  sex: UserSex;
  /** 头像地址 */
  avatar: string;
  /** 状态: 0=正常, 1=停用 */
  status: UserStatus;
  /** 部门ID */
  deptId: number;
  /** 部门名称 */
  deptName?: string;
  /** 岗位ID数组 */
  postId: number[];
  /** 角色ID数组 */
  roleId: number[];
  /** 最后登录IP */
  loginIp: string;
  /** 最后登录时间 */
  loginDate: string;
  /** 创建时间 */
  createTime: string;
  /** 备注 */
  remark: string;
}

/** 用户查询参数 */
export interface SysUserQuery {
  /** 关键词 */
  keyword?: string;
  /** 用户状态 */
  status?: UserStatus;
  /** 部门ID */
  deptId?: number;
  /** 手机号码 */
  phone?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 用户表单数据 */
export interface SysUserForm {
  /** 用户ID */
  userId?: number;
  /** 用户名 */
  username?: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户邮箱 */
  email?: string;
  /** 手机号码 */
  phone?: string;
  /** 用户性别 */
  sex?: UserSex;
  /** 头像地址 */
  avatar?: string;
  /** 状态 */
  status?: UserStatus;
  /** 部门ID */
  deptId?: number;
  /** 岗位ID数组 */
  postId?: number[];
  /** 角色ID数组 */
  roleId?: number[];
  /** 备注 */
  remark?: string;
}

/** 用户分页响应 */
export interface SysUserPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysUser[];
}
