/**
 * 代码生成器 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface IGenQuery {
  pageNum?: number
  pageSize?: number
  tableName?: string
  tableComment?: string
}

export interface IGenTable {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  packageName: string
  moduleName: string
  businessName: string
  functionName: string
  functionAuthor: string
  genType: string
  genPath: string
  remark: string
  createTime: string
  updateTime: string
  columns?: IGenColumn[]
}

export interface IGenColumn {
  columnId: number
  tableId: number
  columnName: string
  columnComment: string
  columnType: string
  javaType: string
  javaField: string
  isPk: string
  isIncrement: string
  isRequired: string
  isInsert: string
  isEdit: string
  isList: string
  isQuery: string
  queryType: string
  htmlType: string
  dictType: string
  sort: number
  createTime: string
  updateTime: string
}

export interface IGenConfig {
  tableId?: number
  packageName: string
  moduleName: string
  businessName: string
  functionName: string
  functionAuthor: string
  genType: string
  genPath: string
  treeCode?: string
  treeParentCode?: string
  treeName?: string
  parentMenuId?: string | number
  remark?: string
}

export interface IGenPreview {
  files: {
    fileName: string
    content: string
  }[]
}

export interface IGenResult {
  fileName: string
  success: boolean
  message?: string
}

/**
 * 获取表列表（分页）
 */
export const getGenTablePage = (params: IGenQuery) => {
  return request<{ rows: IGenTable[]; total: number }>({
    url: '/tool/gen/page',
    method: 'GET',
    params
  })
}

/**
 * 获取数据库表列表（未导入）
 */
export const getGenDbList = (params?: IGenQuery) => {
  return request<{ rows: IGenTable[]; total: number }>({
    url: '/tool/gen/db/list',
    method: 'GET',
    params
  })
}

/**
 * 获取表详细配置
 */
export const getGenConfig = (tableName: string) => {
  return request<{
    config: IGenConfig
    columns: IGenColumn[]
  }>({
    url: `/tool/gen/config/${tableName}`,
    method: 'GET'
  })
}

/**
 * 保存表配置
 */
export const saveGenConfig = (data: IGenConfig & { columns: IGenColumn[] }) => {
  return request<void>({
    url: '/tool/gen/config',
    method: 'POST',
    data
  })
}

/**
 * 导入表
 */
export const importGenTable = (tableNames: string[]) => {
  return request<void>({
    url: '/tool/gen/import',
    method: 'POST',
    data: { tableNames }
  })
}

/**
 * 同步表结构
 */
export const syncTable = (tableName: string) => {
  return request<IGenColumn[]>({
    url: `/tool/gen/sync/${tableName}`,
    method: 'POST'
  })
}

/**
 * 预览代码
 */
export const previewCode = (config: IGenConfig) => {
  return request<IGenPreview>({
    url: '/tool/gen/preview',
    method: 'POST',
    data: config
  })
}

/**
 * 下载代码
 */
export const downloadCode = (tableName: string, config?: IGenConfig) => {
  return request<Blob>({
    url: '/tool/gen/download',
    method: 'POST',
    data: config || { tableName },
    responseType: 'blob'
  })
}

/**
 * 删除表配置
 */
export const deleteGenTable = (tableNames: string[]) => {
  return request<void>({
    url: '/tool/gen/delete',
    method: 'DELETE',
    data: { tableNames }
  })
}

/**
 * 批量生成代码
 */
export const batchGenerate = (tableNames: string[]) => {
  return request<IGenResult[]>({
    url: '/tool/gen/batch',
    method: 'POST',
    data: { tableNames }
  })
}

/**
 * 获取模板列表
 */
export const getTemplateList = () => {
  return request<{
    templateName: string
    templatePath: string
    description: string
  }[]>({
    url: '/tool/gen/templates',
    method: 'GET'
  })
}

/**
 * 保存自定义模板
 */
export const saveTemplate = (templateName: string, content: string) => {
  return request<void>({
    url: '/tool/gen/template',
    method: 'POST',
    data: { templateName, content }
  })
}

/**
 * 重置模板为默认
 */
export const resetTemplate = (templateName: string) => {
  return request<void>({
    url: `/tool/gen/template/reset/${templateName}`,
    method: 'POST'
  })
}
