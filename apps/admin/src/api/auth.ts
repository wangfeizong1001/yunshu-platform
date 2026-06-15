/**
 * 认证相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

// 验证码响应类型
export interface CaptchaResponse {
  captchaOnOff: boolean
  uuid: string
  img: string
  /** 开发模式下返回验证码答案，方便测试 */
  code?: string
}

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
export function getCaptchaApi(): Promise<{ code: number; data: CaptchaResponse }> {
  return request<CaptchaResponse>({
    url: '/auth/captcha',
    method: 'GET'
  })
}

// 登录
export function loginApi(data: LoginForm) {
  return request<{ token: string; user?: object }>({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 退出登录
export function logoutApi() {
  return request<void>({
    url: '/auth/logout',
    method: 'POST'
  })
}

// 获取用户信息
export function getUserInfoApi() {
  return request<UserInfo>({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

// 获取路由菜单
export function getRoutersApi() {
  return request<unknown[]>({
    url: '/system/menu/getRouters',
    method: 'GET'
  })
}
