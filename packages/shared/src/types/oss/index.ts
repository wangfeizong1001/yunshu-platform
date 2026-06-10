/**
 * OSS 文件存储类型定义
 */

/** 存储类型 */
export type OssStorageType = 'local' | 'aliyun' | 'qcloud' | 'qiniu';

/** OSS 配置 */
export interface OssConfig {
  /** 配置ID */
  id: number
  /** AccessKey */
  accessKey: string
  /** SecretKey */
  secretKey: string
  /** Bucket 名称 */
  bucket: string
  /** Endpoint */
  endpoint: string
  /** 自定义域名 */
  domain: string
  /** 文件前缀 */
  prefix: string
  /** 存储类型 */
  type: OssStorageType
  /** 状态 (0-禁用 1-启用) */
  status: '0' | '1'
  /** 备注 */
  remark: string
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/** OSS 文件信息 */
export interface OssFile {
  /** 文件ID */
  id: number
  /** 文件名称 */
  fileName: string
  /** 原始文件名 */
  originalName?: string
  /** 文件路径 */
  filePath: string
  /** 文件大小(字节) */
  fileSize: number
  /** 文件类型/扩展名 */
  fileType: string
  /** 存储类型 */
  storageType: OssStorageType
  /** OSS配置ID */
  ossConfigId?: number
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/** OSS 查询参数 */
export interface OssFileQuery {
  /** 关键词 */
  keyword?: string
  /** 存储类型 */
  storageType?: OssStorageType
  /** 文件类型 */
  fileType?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/** OSS 文件分页响应 */
export interface OssFilePageResp {
  /** 总记录数 */
  total: number
  /** 列表数据 */
  rows: OssFile[]
}

/** OSS 配置响应 */
export interface OssConfigResp {
  /** 当前使用的配置 */
  current?: OssConfig
  /** 所有配置列表 */
  configs: OssConfig[]
}

/** 文件上传响应 */
export interface OssUploadResp {
  /** 文件ID */
  fileId: number
  /** 文件名称 */
  fileName: string
  /** 文件路径 */
  filePath: string
  /** 文件大小 */
  fileSize: number
  /** 文件类型 */
  fileType: string
  /** 完整URL */
  url: string
}
