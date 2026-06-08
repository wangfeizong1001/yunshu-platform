/**
 * 系统角色类型定义
 */

/** 角色状态 */
export type RoleStatus = '0' | '1'

/** 角色数据权限范围 */
export type RoleDataScope = '1' | '2' | '3' | '4' | '5'
/**
 * 1=全部数据权限
 * 2=自定数据权限
 * 3=本部门数据权限
 * 4=本部门及以下数据权限
 * 5=仅本人数据权限
 */

/** 角色信息 */
export interface SysRole {
  /** 角色ID */
  roleId: number
  /** 角色名称 */
  roleName: string
  /** 角色权限字符串 */
  roleKey: string
  /** 显示顺序 */
  roleSort: number
  /** 数据权限范围 */
  dataScope: RoleDataScope
  /** 菜单树选择范围是否关联显示 */
  menuCheckStrictly: boolean
  /** 部门树选择范围是否关联显示 */
  deptCheckStrictly: boolean
  /** 状态: 0=正常, 1=停用 */
  status: RoleStatus
  /** 角色权限列表 */
  permissions: string[]
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime?: string
}

/** 角色查询参数 */
export interface SysRoleQuery {
  /** 关键词 */
  keyword?: string
  /** 角色状态 */
  status?: RoleStatus
  /** 角色权限字符串 */
  roleKey?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/** 角色表单数据 */
export interface SysRoleForm {
  /** 角色ID */
  roleId?: number
  /** 角色名称 */
  roleName: string
  /** 角色权限字符串 */
  roleKey: string
  /** 显示顺序 */
  roleSort: number
  /** 数据权限范围 */
  dataScope?: RoleDataScope
  /** 菜单树选择范围是否关联显示 */
  menuCheckStrictly?: boolean
  /** 部门树选择范围是否关联显示 */
  deptCheckStrictly?: boolean
  /** 状态 */
  status?: RoleStatus
  /** 角色权限列表 */
  permissions?: string[]
  /** 备注 */
  remark?: string
}

/** 角色分页响应 */
export interface SysRolePageResp {
  /** 总记录数 */
  total: number
  /** 列表数据 */
  rows: SysRole[]
}

/** 角色菜单权限 */
export interface SysRoleMenu {
  /** 角色ID */
  roleId: number
  /** 菜单ID列表 */
  menuIds: number[]
}

/** 角色数据权限 */
export interface SysRoleDataScope {
  /** 角色ID */
  roleId: number
  /** 数据权限范围 */
  dataScope: RoleDataScope
  /** 部门ID列表 */
  deptIds?: number[]
}
