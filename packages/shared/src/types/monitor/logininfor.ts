/**
 * 登录日志类型定义
 *
 * @module @yunshu/shared/types/monitor
 */

/** 登录日志状态 */
export type LogininforStatus = '0' | '1';

/** 登录日志操作类型 */
export type LogininforOperationType = '登录' | '登出' | '注册' | '修改密码' | '找回密码' | '其他';

/** 登录日志实体 */
export interface ILogininfor {
  /** 访问编号 */
  infoId: string;
  /** 用户名称 */
  userName: string;
  /** 登录账号 */
  loginAccount: string;
  /** 登录状态 */
  status: LogininforStatus;
  /** 登录地址 */
  loginLocation: string;
  /** 操作类型 */
  operationType: LogininforOperationType;
  /** 操作系统 */
  os: string;
  /** 浏览器 */
  browser: string;
  /** 登录时间 */
  loginTime: string;
  /** 登录信息 */
  msg: string;
  /** 登录IP */
  ip: string;
  /** 创建时间 */
  createTime: string;
}

/** 登录日志查询参数 */
export interface ILogininforQuery {
  /** 关键词搜索 */
  search?: string;
  /** 用户名称 */
  userName?: string;
  /** 登录账号 */
  loginAccount?: string;
  /** 登录状态 */
  status?: LogininforStatus;
  /** 操作类型 */
  operationType?: LogininforOperationType;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/** 登录日志创建参数 */
export interface ILogininforCreate {
  userName: string;
  loginAccount: string;
  status: LogininforStatus;
  loginLocation: string;
  operationType: LogininforOperationType;
  os?: string;
  browser?: string;
  msg?: string;
  ip: string;
}
