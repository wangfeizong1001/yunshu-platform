/**
 * 参数配置类型定义
 */

/** 参数配置状态 */
export type ConfigStatus = '0' | '1';

/** 参数配置类型 */
export type ConfigType = 'Y' | 'N';

/** 系统参数配置 */
export interface SysConfig {
  /** 参数ID */
  configId: number;
  /** 参数名称 */
  configName: string;
  /** 参数键名 */
  configKey: string;
  /** 参数键值 */
  configValue: string;
  /** 参数类型: Y=系统内置, N=自定义 */
  configType: ConfigType;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 创建者 */
  createBy?: string;
  /** 更新者 */
  updateBy?: string;
}

/** 参数配置查询参数 */
export interface SysConfigQuery {
  /** 关键词 */
  keyword?: string;
  /** 参数类型 */
  configType?: ConfigType;
  /** 状态 */
  status?: ConfigStatus;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 参数配置表单数据 */
export interface SysConfigForm {
  /** 参数ID */
  configId?: number;
  /** 参数名称 */
  configName: string;
  /** 参数键名 */
  configKey: string;
  /** 参数键值 */
  configValue: string;
  /** 参数类型 */
  configType?: ConfigType;
  /** 备注 */
  remark?: string;
}

/** 参数配置分页响应 */
export interface SysConfigPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysConfig[];
}
