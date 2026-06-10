/**
 * 系统模块导出
 */

export * from './user';
export * from './role';
export * from './dept';
export * from './menu';
export * from './post';
export * from './dict';
export * from './config';
export * from './notice';
export * from './file';

/** 通用状态枚举 */
export type CommonStatus = '0' | '1';

/** 通用分页参数 */
export interface PageQuery {
  /** 页码 */
  pageNum: number;
  /** 每页数量 */
  pageSize: number;
}

/** 通用分页响应 */
export interface PageResp<T> {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: T[];
}

/** 通用响应结构 */
export interface ApiResp<T = unknown> {
  /** 状态码 */
  code: number;
  /** 消息 */
  msg: string;
  /** 数据 */
  data: T;
}
