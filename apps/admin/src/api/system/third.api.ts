/**
 * 第三方登录 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/third/config/list',
    method: 'get'
  })
}

export const getThirdConfig = (thirdType: string) => {
  return request({
    url: `/system/third/config/${thirdType}`,
    method: 'get'
  })
}

export const saveThirdConfig = (data: ThirdConfig) => {
  return request({
    url: '/system/third/config',
    method: 'post',
    data
  })
}

export const updateThirdConfig = (data: ThirdConfig) => {
  return request({
    url: '/system/third/config',
    method: 'put',
    data
  })
}

export const thirdLogin = (data: ThirdLogin) => {
  return request({
    url: '/system/third/login',
    method: 'post',
    data
  })
}

export const bindThirdAccount = (data: ThirdLogin) => {
  return request({
    url: '/system/third/bind',
    method: 'post',
    data
  })
}

export const unbindThirdAccount = (thirdType: string) => {
  return request({
    url: `/system/third/unbind/${thirdType}`,
    method: 'post'
  })
}

// 获取第三方登录日志列表
export const getThirdLoginLogList = (params?: any) => {
  return request({
    url: '/system/third/log/page',
    method: 'get',
    params
  })
}
