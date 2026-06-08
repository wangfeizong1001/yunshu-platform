/**
 * 在线用户 API
 */

import request from '@/utils/request'

export interface OnlineQuery {
  pageNum?: number
  pageSize?: number
  userName?: string
  ipaddr?: string
}

export interface OnlineInfo {
  tokenId: string
  userName: string
  deptName: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  status: string
  loginTime: string
}

export const getOnlineList = (params?: OnlineQuery) => {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params
  })
}

export const getOnlinePage = (params?: OnlineQuery) => {
  return request({
    url: '/monitor/online/page',
    method: 'get',
    params
  })
}

export const forceLogout = (tokenId: string) => {
  return request({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  })
}

