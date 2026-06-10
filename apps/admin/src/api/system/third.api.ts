/**
 * 第三方登录 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface ThirdConfig {
  thirdType: string
  clientId: string
  clientSecret: string
  redirectUri: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  status: string
}

export interface ThirdLogin {
  thirdType: string
  code: string
  state: string
}

export const getThirdConfigList = () => {
  return request<unknown>({
    url: '/system/third/config/list',
    method: 'GET'
  })
}

export const getThirdConfig = (thirdType: string) => {
  return request<unknown>({
    url: `/system/third/config/${thirdType}`,
    method: 'GET'
  })
}

export const saveThirdConfig = (data: ThirdConfig) => {
  return request<unknown>({
    url: '/system/third/config',
    method: 'POST',
    data
  })
}

export const updateThirdConfig = (data: ThirdConfig) => {
  return request<unknown>({
    url: '/system/third/config',
    method: 'PUT',
    data
  })
}

export const thirdLogin = (data: ThirdLogin) => {
  return request<unknown>({
    url: '/system/third/login',
    method: 'POST',
    data
  })
}

export const bindThirdAccount = (data: ThirdLogin) => {
  return request<unknown>({
    url: '/system/third/bind',
    method: 'POST',
    data
  })
}

export const unbindThirdAccount = (thirdType: string) => {
  return request<unknown>({
    url: `/system/third/unbind/${thirdType}`,
    method: 'POST'
  })
}

// 获取第三方登录日志列表
export const getThirdLoginLogList = (params?: Record<string, unknown>) => {
  return request<unknown>({
    url: '/system/third/log/page',
    method: 'GET',
    params
  })
}
