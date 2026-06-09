/**
 * 在线用户类型定义
 *
 * @module @yunshu/shared/types/monitor
 */

/** 在线用户实体 */
export interface IOnline {
  /** 会话编号 */
  sessionId: string;
  /** 用户名称 */
  userName: string;
  /** 登录账号 */
  loginAccount: string;
  /** 部门名称 */
  deptName: string;
  /** 浏览器 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 登录IP */
  ip: string;
  /** 登录时间 */
  loginTime: string;
  /** 最后访问时间 */
  lastAccessTime: string;
  /** 过期时间 */
  expireTime?: string;
  /** 用户ID */
  userId: string;
}

/** 在线用户查询参数 */
export interface IOnlineQuery {
  /** 关键词搜索 */
  search?: string;
  /** 用户名称 */
  userName?: string;
  /** 登录账号 */
  loginAccount?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/** 在线用户统计 */
export interface IOnlineStats {
  /** 总在线人数 */
  totalCount: number;
  /** PC在线数 */
  pcCount: number;
  /** 移动端在线数 */
  mobileCount: number;
}
