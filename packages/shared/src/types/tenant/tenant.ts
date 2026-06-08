/**
 * 租户类型定义
 */

/** 租户状态 */
export type TenantStatus = '0' | '1' | '2'

/** 租户数据范围 */
export enum DataScope {
  /** 全部数据权限 */
  ALL = '1',
  /** 自定义数据权限 */
  CUSTOM = '2',
  /** 本部门数据权限 */
  DEPT = '3',
  /** 本部门及以下数据权限 */
  DEPT_AND_CHILD = '4',
  /** 仅本人数据权限 */
  SELF = '5',
  /** 本租户数据权限 */
  TENANT = '6',
}

/** 租户信息 */
export interface Tenant {
  /** 租户ID */
  tenantId: number
  /** 租户名称 */
  tenantName: string
  /** 租户编码（唯一） */
  tenantCode: string
  /** 联系人 */
  contact: string
  /** 联系电话 */
  contactPhone: string
  /** 邮箱 */
  email: string
  /** 域名 */
  domain: string
  /** 套餐ID */
  packageId: number
  /** 套餐名称 */
  packageName: string
  /** 到期时间 */
  expireTime: string
  /** 用户数量 */
  userCount: number
  /** 用户上限 */
  userLimit: number
  /** 状态：0正常 1停用 2到期 */
  status: TenantStatus
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 租户查询参数 */
export interface TenantQuery {
  /** 关键词 */
  keyword?: string
  /** 租户状态 */
  status?: TenantStatus
  /** 套餐ID */
  packageId?: number
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/** 租户表单数据 */
export interface TenantForm {
  /** 租户ID */
  tenantId?: number
  /** 租户名称 */
  tenantName: string
  /** 租户编码（唯一） */
  tenantCode: string
  /** 联系人 */
  contact: string
  /** 联系电话 */
  contactPhone: string
  /** 邮箱 */
  email?: string
  /** 域名 */
  domain?: string
  /** 套餐ID */
  packageId: number
  /** 到期时间 */
  expireTime: string
  /** 用户上限 */
  userLimit: number
  /** 状态 */
  status?: TenantStatus
  /** 备注 */
  remark?: string
}

/** 租户分页响应 */
export interface TenantPageResp {
  /** 总记录数 */
  total: number
  /** 列表数据 */
  rows: Tenant[]
}

/** 租户状态枚举 */
export const TenantStatusEnum = {
  NORMAL: { value: '0', label: '正常', color: 'success' },
  DISABLED: { value: '1', label: '停用', color: 'danger' },
  EXPIRED: { value: '2', label: '到期', color: 'warning' },
} as const
