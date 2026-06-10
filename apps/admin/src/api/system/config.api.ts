/**
 * 参数配置 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface ConfigQuery {
  pageNum?: number
  pageSize?: number
  configName?: string
  configKey?: string
  status?: string
}

export interface ConfigForm {
  configId?: number
  configName?: string
  configKey?: string
  configValue?: string
  configType?: string
  remark?: string
}

export interface ConfigInfo {
  configId: number
  configName: string
  configKey: string
  configValue: string
  configType: string
  remark: string
  createTime: string
}

export const getConfigList = (params?: ConfigQuery) => {
  return request<{ rows: ConfigInfo[]; total: number }>({
    url: '/system/config/list',
    method: 'GET',
    params
  })
}

export const getConfigPage = (params?: ConfigQuery) => {
  return request<{ rows: ConfigInfo[]; total: number }>({
    url: '/system/config/page',
    method: 'GET',
    params
  })
}

export const getConfig = (configId: number) => {
  return request<ConfigInfo>({
    url: `/system/config/${configId}`,
    method: 'GET'
  })
}

export const getConfigValue = (configKey: string) => {
  return request<string>({
    url: `/system/config/configKey/${configKey}`,
    method: 'GET'
  })
}

export const addConfig = (data: ConfigForm) => {
  return request<void>({
    url: '/system/config',
    method: 'POST',
    data
  })
}

export const updateConfig = (data: ConfigForm) => {
  return request<void>({
    url: '/system/config',
    method: 'PUT',
    data
  })
}

export const deleteConfig = (configId: number) => {
  return request<void>({
    url: `/system/config/${configId}`,
    method: 'DELETE'
  })
}

export const batchDeleteConfig = (configIds: number[]) => {
  return request<void>({
    url: '/system/config/batch',
    method: 'DELETE',
    data: configIds
  })
}

export const refreshConfigCache = () => {
  return request<void>({
    url: '/system/config/refreshCache',
    method: 'DELETE'
  })
}

export const exportConfig = (params?: ConfigQuery) => {
  return request<Blob>({
    url: '/system/config/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
