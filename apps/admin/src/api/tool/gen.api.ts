/**
 * 代码生成器 API
 *
 * @module @yunshu/admin/api/tool
 */

import { request } from '@/utils/request'
import type {
  IGenTable,
  IGenColumn,
  IGenConfig,
  IGenQuery,
  IGenPreview,
  IGenResult,
} from '@yunshu/shared/types/gen'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'

/** 表分页响应 */
export type GenTablePageResp = PaginatedResponse<IGenTable>

/**
 * 获取数据库表分页列表
 * @param params 查询参数
 */
export function getGenTablePage(params: IGenQuery) {
  return request<GenTablePageResp>({
    url: '/gen/table/page',
    method: 'get',
    params,
  })
}

/**
 * 获取所有数据库表列表
 */
export function getGenTableList() {
  return request<ApiResponse<IGenTable[]>>({
    url: '/gen/table/list',
    method: 'get',
  })
}

/**
 * 获取表详情（包含字段信息）
 * @param tableName 表名
 */
export function getGenTableDetail(tableName: string) {
  return request<ApiResponse<IGenColumn[]>>({
    url: `/gen/table/${tableName}`,
    method: 'get',
  })
}

/**
 * 获取生成配置
 * @param tableName 表名
 */
export function getGenConfig(tableName: string) {
  return request<ApiResponse<{ config: Partial<IGenConfig>; columns: IGenColumn[] }>>({
    url: `/gen/config/${tableName}`,
    method: 'get',
  })
}

/**
 * 保存生成配置
 * @param config 生成配置
 */
export function saveGenConfig(config: IGenConfig) {
  return request<ApiResponse<IGenConfig>>({
    url: '/gen/config',
    method: 'post',
    data: config,
  })
}

/**
 * 获取生成配置列表
 */
export function getGenConfigList() {
  return request<ApiResponse<IGenConfig[]>>({
    url: '/gen/config/list',
    method: 'get',
  })
}

/**
 * 删除生成配置
 * @param genId 配置ID
 */
export function deleteGenConfig(genId: string) {
  return request<ApiResponse<boolean>>({
    url: `/gen/config/${genId}`,
    method: 'delete',
  })
}

/**
 * 预览生成的代码
 * @param config 生成配置
 */
export function previewCode(config: IGenConfig) {
  return request<ApiResponse<IGenPreview>>({
    url: '/gen/preview',
    method: 'post',
    data: config,
  })
}

/**
 * 生成代码
 * @param config 生成配置
 */
export function generateCode(config: IGenConfig) {
  return request<ApiResponse<IGenResult>>({
    url: '/gen/code',
    method: 'post',
    data: config,
  })
}

/**
 * 下载代码ZIP包
 * @param tableName 表名
 * @param config 生成配置（可选）
 */
export function downloadCode(tableName: string, config?: Partial<IGenConfig>) {
  const params = new URLSearchParams()
  params.append('tableName', tableName)
  if (config) {
    if (config.tableComment) params.append('tableComment', config.tableComment)
    if (config.className) params.append('className', config.className)
    if (config.moduleName) params.append('moduleName', config.moduleName)
    if (config.packageName) params.append('packageName', config.packageName)
    if (config.author) params.append('author', config.author)
    if (config.email) params.append('email', config.email)
    if (config.generateType) params.append('generateType', config.generateType)
    params.append('generateMenu', String(config.generateMenu !== false))
    params.append('generateApi', String(config.generateApi !== false))
    params.append('generateView', String(config.generateView !== false))
    params.append('generateTypeScript', String(config.generateTypeScript !== false))
  }

  // 打开新窗口进行下载
  window.open(`/gen/download/${tableName}?${params.toString()}`, '_blank')
}

/**
 * 同步表结构
 * @param tableName 表名
 */
export function syncTable(tableName: string) {
  return request<ApiResponse<IGenColumn[]>>({
    url: `/gen/sync/${tableName}`,
    method: 'post',
  })
}
