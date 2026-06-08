/**
 * 系统部门类型定义
 */

/** 部门状态 */
export type DeptStatus = '0' | '1'

/** 部门信息 */
export interface SysDept {
  /** 部门ID */
  deptId: number
  /** 父部门ID */
  parentId: number
  /** 祖级列表 */
  ancestors: string
  /** 部门名称 */
  deptName: string
  /** 负责人 */
  leader: string
  /** 联系电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 状态: 0=正常, 1=停用 */
  status: DeptStatus
  /** 子部门 */
  children?: SysDept[]
  /** 创建时间 */
  createTime?: string
}

/** 部门查询参数 */
export interface SysDeptQuery {
  /** 关键词 */
  keyword?: string
  /** 部门状态 */
  status?: DeptStatus
  /** 父部门ID */
  parentId?: number
}

/** 部门表单数据 */
export interface SysDeptForm {
  /** 部门ID */
  deptId?: number
  /** 父部门ID */
  parentId: number
  /** 祖级列表 */
  ancestors?: string
  /** 部门名称 */
  deptName: string
  /** 负责人 */
  leader?: string
  /** 联系电话 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 状态 */
  status?: DeptStatus
  /** 备注 */
  remark?: string
}
