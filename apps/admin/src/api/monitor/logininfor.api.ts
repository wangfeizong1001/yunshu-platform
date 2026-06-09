/**
 * 登录日志 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params
  })
}

export const getLogininforPage = (params?: LogininforQuery) => {
  return request({
    url: '/monitor/logininfor/page',
    method: 'get',
    params
  })
}

export const getLogininfor = (infoId: number) => {
  return request({
    url: `/monitor/logininfor/${infoId}`,
    method: 'get'
  })
}

export const deleteLogininfor = (infoId: number) => {
  return request({
    url: `/monitor/logininfor/${infoId}`,
    method: 'delete'
  })
}

export const batchDeleteLogininfor = (infoIds: number[]) => {
  return request({
    url: '/monitor/logininfor/batch',
    method: 'delete',
    data: infoIds
  })
}

export const cleanLogininfor = () => {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}

export const unlockUser = (userName: string) => {
  return request({
    url: '/monitor/logininfor/unlock',
    method: 'post',
    params: { userName }
  })
}

export const exportLogininfor = (params?: LogininforQuery) => {
  return request({
    url: '/monitor/logininfor/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

