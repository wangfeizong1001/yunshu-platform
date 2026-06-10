/**
 * 认证相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

// 登录表单类型
export interface LoginForm {
  username: string
  password: string
  code?: string
  uuid?: string
}

// 登录响应类型
export interface LoginResponse {
  token: string
  expires: number
}

// 用户信息类型
export interface UserInfo {
  userId: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  deptId: number
  deptName: string
  roles: string[]
  roleId: number[]
}

// 获取验证码
export function getCaptchaApi() {
  return request<unknown>({
    url: '/auth/captcha',
    method: 'GET'
  })
}

// 登录
export function loginApi(data: LoginForm) {
  return request<unknown>({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 退出登录
export function logoutApi() {
  return request<unknown>({
    url: '/auth/logout',
    method: 'POST'
  })
}

// 获取用户信息
export function getUserInfoApi() {
  return request<unknown>({
    url: '/auth/getInfo',
    method: 'GET'
  })
}

// 获取路由菜单
export function getRoutersApi() {
  return request<unknown>({
    url: '/system/menu/getRouters',
    method: 'GET'
  })
}
