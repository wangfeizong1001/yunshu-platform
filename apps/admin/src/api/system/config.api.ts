/**
 * 参数配置 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/config/list',
    method: 'get',
    params
  })
}

export const getConfigPage = (params?: ConfigQuery) => {
  return request({
    url: '/system/config/page',
    method: 'get',
    params
  })
}

export const getConfig = (configId: number) => {
  return request({
    url: `/system/config/${configId}`,
    method: 'get'
  })
}

export const getConfigValue = (configKey: string) => {
  return request({
    url: `/system/config/configKey/${configKey}`,
    method: 'get'
  })
}

export const addConfig = (data: ConfigForm) => {
  return request({
    url: '/system/config',
    method: 'post',
    data
  })
}

export const updateConfig = (data: ConfigForm) => {
  return request({
    url: '/system/config',
    method: 'put',
    data
  })
}

export const deleteConfig = (configId: number) => {
  return request({
    url: `/system/config/${configId}`,
    method: 'delete'
  })
}

export const batchDeleteConfig = (configIds: number[]) => {
  return request({
    url: '/system/config/batch',
    method: 'delete',
    data: configIds
  })
}

export const refreshConfigCache = () => {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}

export const exportConfig = (params?: ConfigQuery) => {
  return request({
    url: '/system/config/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
