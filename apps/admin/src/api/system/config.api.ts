/**
 * 参数配置管理 API
 */

import { request } from '@/utils/request'
import type {
  SysConfig,
  SysConfigQuery,
  SysConfigForm,
  SysConfigPageResp,
} from '@yunshu/shared/types/system'

/**
 * 获取参数配置分页列表
 * @param params 查询参数
 */
export function getConfigPage(params: SysConfigQuery) {
  return request<SysConfigPageResp>({
    url: '/system/config/page',
    method: 'get',
    params,
  })
}

/**
 * 获取参数配置列表
 * @param params 查询参数
 */
export function getConfigList(params?: SysConfigQuery) {
  return request<SysConfig[]>({
    url: '/system/config/list',
    method: 'get',
    params,
  })
}

/**
 * 获取参数配置详情
 * @param configId 参数ID
 */
export function getConfigDetail(configId: number) {
  return request<SysConfig>({
    url: `/system/config/${configId}`,
    method: 'get',
  })
}

/**
 * 根据参数键名获取参数
 * @param configKey 参数键名
 */
export function getConfigByKey(configKey: string) {
  return request<SysConfig>({
    url: `/system/config/configKey/${configKey}`,
    method: 'get',
  })
}

/**
 * 新增参数配置
 * @param data 参数配置表单数据
 */
export function addConfig(data: SysConfigForm) {
  return request<SysConfig>({
    url: '/system/config',
    method: 'post',
    data,
  })
}

/**
 * 修改参数配置
 * @param configId 参数ID
 * @param data 参数配置表单数据
 */
export function updateConfig(configId: number, data: SysConfigForm) {
  return request<SysConfig>({
    url: `/system/config/${configId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除参数配置
 * @param configId 参数ID
 */
export function deleteConfig(configId: number) {
  return request<void>({
    url: `/system/config/${configId}`,
    method: 'delete',
  })
}

/**
 * 批量删除参数配置
 * @param configIds 参数ID数组
 */
export function batchDeleteConfig(configIds: number[]) {
  return request<void>({
    url: '/system/config/batch',
    method: 'delete',
    data: { configIds },
  })
}

/**
 * 修改参数配置状态
 * @param configId 参数ID
 * @param status 状态
 */
export function changeConfigStatus(configId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/config/${configId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 导出参数配置
 * @param params 查询参数
 */
export function exportConfig(params?: SysConfigQuery) {
  return request.download('/system/config/export', params, '参数配置.xlsx')
}

/**
 * 刷新参数缓存
 */
export function refreshConfigCache() {
  return request<void>({
    url: '/system/config/cache',
    method: 'delete',
  })
}
