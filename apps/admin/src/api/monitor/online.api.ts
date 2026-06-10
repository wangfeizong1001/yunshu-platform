/**
 * 在线用户 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

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
  return request<unknown>({
    url: '/monitor/online/list',
    method: 'GET',
    params
  })
}

export const getOnlinePage = (params?: OnlineQuery) => {
  return request<unknown>({
    url: '/monitor/online/page',
    method: 'GET',
    params
  })
}

export const forceLogout = (tokenId: string) => {
  return request<unknown>({
    url: `/monitor/online/${tokenId}`,
    method: 'DELETE'
  })
}

export const batchForceLogout = (tokenIds: string[]) => {
  return request<unknown>({
    url: '/monitor/online/batch',
    method: 'DELETE',
    data: tokenIds
  })
}

