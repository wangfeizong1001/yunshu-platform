/**
 * 文件管理类型定义
 */

/** 存储类型 */
export type StorageType = 'local' | 'oss' | 'cos' | 'oss';

/** 文件管理 */
export interface SysFile {
  /** 文件ID */
  fileId: number;
  /** 文件名称 */
  fileName: string;
  /** 原始文件名 */
  originalName?: string;
  /** 文件路径 */
  filePath: string;
  /** 文件大小(字节) */
  fileSize: number;
  /** 文件类型/扩展名 */
  fileType: string;
  /** 存储类型 */
  storageType: StorageType;
  /** OSS配置 */
  ossConfig?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime: string;
  /** 备注 */
  remark?: string;
}

/** 文件查询参数 */
export interface SysFileQuery {
  /** 关键词 */
  keyword?: string;
  /** 存储类型 */
  storageType?: StorageType;
  /** 文件类型 */
  fileType?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 文件分页响应 */
export interface SysFilePageResp {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  rows: SysFile[];
}

/** 文件上传响应 */
export interface SysFileUploadResp {
  /** 文件ID */
  fileId: number;
  /** 文件名称 */
  fileName: string;
  /** 文件路径 */
  filePath: string;
  /** 文件大小 */
  fileSize: number;
  /** 文件类型 */
  fileType: string;
}
