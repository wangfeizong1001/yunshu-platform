/**
 * 登录日志 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface LogininforQuery {
  pageNum?: number
  pageSize?: number
  userName?: string
  status?: string
  startTime?: string
  endTime?: string
}

export interface LogininforInfo {
  infoId: number
  userName: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  status: string
  msg: string
  loginTime: string
}

export const getLogininforList = (params?: LogininforQuery) => {
  return request<unknown>({
    url: '/monitor/logininfor/list',
    method: 'GET',
    params
  })
}

export const getLogininforPage = (params?: LogininforQuery) => {
  return request<unknown>({
    url: '/monitor/logininfor/page',
    method: 'GET',
    params
  })
}

export const getLogininfor = (infoId: number) => {
  return request<unknown>({
    url: `/monitor/logininfor/${infoId}`,
    method: 'GET'
  })
}

export const deleteLogininfor = (infoId: number) => {
  return request<unknown>({
    url: `/monitor/logininfor/${infoId}`,
    method: 'DELETE'
  })
}

export const batchDeleteLogininfor = (infoIds: number[]) => {
  return request<unknown>({
    url: '/monitor/logininfor/batch',
    method: 'DELETE',
    data: infoIds
  })
}

export const cleanLogininfor = () => {
  return request<unknown>({
    url: '/monitor/logininfor/clean',
    method: 'DELETE'
  })
}

export const unlockUser = (userName: string) => {
  return request<unknown>({
    url: '/monitor/logininfor/unlock',
    method: 'POST',
    params: { userName }
  })
}

export const exportLogininfor = (params?: LogininforQuery) => {
  return request<unknown>({
    url: '/monitor/logininfor/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

