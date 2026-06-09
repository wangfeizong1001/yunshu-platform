/**
 * 操作日志类型定义
 *
 * @module @yunshu/shared/types/monitor
 */

/** 操作日志状态 */
export type OperlogStatus = '0' | '1';

/** 操作日志类型 */
export type OperlogType = '查询' | '新增' | '修改' | '删除' | '导出' | '导入' | '授权' | '其他';

/** 操作日志实体 */
export interface IOperlog {
  /** 日志编号 */
  operId: string;
  /** 操作人 */
  operName: string;
  /** 操作时间 */
  operTime: string;
  /** 操作类型 */
  operType: OperlogType;
  /** 操作模块 */
  operModule: string;
  /** 操作状态 */
  status: OperlogStatus;
  /** 请求方法 */
  requestMethod: string;
  /** 操作URL */
  operUrl: string;
  /** 操作IP */
  operIp: string;
  /** 操作系统 */
  operSystem: string;
  /** 浏览器 */
  browser: string;
  /** 耗时(毫秒) */
  costTime: number;
  /** 操作地点 */
  operLocation: string;
  /** 操作参数 */
  operParam: string;
  /** 返回结果 */
  jsonResult: string;
  /** 创建时间 */
  createTime: string;
}

/** 操作日志查询参数 */
export interface IOperlogQuery {
  /** 关键词搜索 */
  search?: string;
  /** 操作人 */
  operName?: string;
  /** 操作类型 */
  operType?: OperlogType;
  /** 操作模块 */
  operModule?: string;
  /** 操作状态 */
  status?: OperlogStatus;
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

/** 操作日志创建参数 */
export interface IOperlogCreate {
  operName: string;
  operType: OperlogType;
  operModule: string;
  status: OperlogStatus;
  requestMethod: string;
  operUrl: string;
  operIp: string;
  operSystem?: string;
  browser?: string;
  costTime?: number;
  operLocation?: string;
  operParam?: string;
  jsonResult?: string;
  operTime?: string;
}
