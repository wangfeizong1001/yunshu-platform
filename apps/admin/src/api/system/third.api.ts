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
  return request<ThirdConfig[]>({
    url: '/system/third/config/list',
    method: 'GET'
  })
}

export const getThirdConfig = (thirdType: string) => {
  return request<ThirdConfig>({
    url: `/system/third/config/${thirdType}`,
    method: 'GET'
  })
}

export const saveThirdConfig = (data: ThirdConfig) => {
  return request<void>({
    url: '/system/third/config',
    method: 'POST',
    data
  })
}

export const updateThirdConfig = (data: ThirdConfig) => {
  return request<void>({
    url: '/system/third/config',
    method: 'PUT',
    data
  })
}

export const thirdLogin = (data: ThirdLogin) => {
  return request<{ token: string; user?: object }>({
    url: '/system/third/login',
    method: 'POST',
    data
  })
}

export const bindThirdAccount = (data: ThirdLogin) => {
  return request<void>({
    url: '/system/third/bind',
    method: 'POST',
    data
  })
}

export const unbindThirdAccount = (thirdType: string) => {
  return request<void>({
    url: `/system/third/unbind/${thirdType}`,
    method: 'POST'
  })
}

export const getThirdLoginLogList = (params?: Record<string, unknown>) => {
  return request<{ rows: { id: number; thirdType: string; userId: number; createTime: string }[]; total: number }>({
    url: '/system/third/log/page',
    method: 'GET',
    params
  })
}
