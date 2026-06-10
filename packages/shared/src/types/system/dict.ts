/**
 * 数据字典类型定义
 */

/** 字典类型状态 */
export type DictTypeStatus = '0' | '1';

/** 字典数据状态 */
export type DictDataStatus = '0' | '1';

/** 字典类型 */
export interface SysDictType {
  /** 字典ID */
  dictId: number;
  /** 字典名称 */
  dictName: string;
  /** 字典类型（唯一标识） */
  dictType: string;
  /** 状态: 0=正常, 1=停用 */
  status: DictTypeStatus;
  /** 备注 */
  remark: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 创建者 */
  createBy?: string;
  /** 更新者 */
  updateBy?: string;
}

/** 字典类型查询参数 */
export interface SysDictTypeQuery {
  /** 关键词 */
  keyword?: string;
  /** 字典状态 */
  status?: DictTypeStatus;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 字典类型表单数据 */
export interface SysDictTypeForm {
  /** 字典ID */
  dictId?: number;
  /** 字典名称 */
  dictName: string;
  /** 字典类型 */
  dictType: string;
  /** 状态 */
  status?: DictTypeStatus;
  /** 备注 */
  remark?: string;
}

/** 字典类型分页响应 */
export interface SysDictTypePageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysDictType[];
}

/** 字典数据 */
export interface SysDictData {
  /** 字典编码 */
  dictCode: number;
  /** 字典排序 */
  dictSort: number;
  /** 字典标签 */
  dictLabel: string;
  /** 字典键值 */
  dictValue: string;
  /** 字典类型 */
  dictType: string;
  /** CSS样式 */
  cssClass?: string;
  /** 显示样式 */
  listClass?: string;
  /** 是否默认: 0=否, 1=是 */
  isDefault: '0' | '1';
  /** 状态: 0=正常, 1=停用 */
  status: DictDataStatus;
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

/** 字典数据查询参数 */
export interface SysDictDataQuery {
  /** 关键词 */
  keyword?: string;
  /** 字典类型 */
  dictType?: string;
  /** 字典状态 */
  status?: DictDataStatus;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 字典数据表单数据 */
export interface SysDictDataForm {
  /** 字典编码 */
  dictCode?: number;
  /** 字典排序 */
  dictSort: number;
  /** 字典标签 */
  dictLabel: string;
  /** 字典键值 */
  dictValue: string;
  /** 字典类型 */
  dictType: string;
  /** CSS样式 */
  cssClass?: string;
  /** 显示样式 */
  listClass?: string;
  /** 是否默认 */
  isDefault?: '0' | '1';
  /** 状态 */
  status?: DictDataStatus;
  /** 备注 */
  remark?: string;
}

/** 字典数据分页响应 */
export interface SysDictDataPageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysDictData[];
}
