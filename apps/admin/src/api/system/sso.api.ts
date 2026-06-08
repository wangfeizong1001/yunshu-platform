/**
 * SSO 单点登录 API
 */

import { request } from '@/utils/request'
import type {
  SsoApplication,
  SsoAppQuery,
  SsoAppPageResp,
  SsoConfig,
  SsoAuthorizeResp,
  SsoTokenResp,
  SsoUserInfo,
} from '@yunshu/shared/types/sso'

/**
 * 获取 SSO 应用列表
 * @param params 查询参数
 */
export function getSsoAppList(params: SsoAppQuery) {
  return request<SsoAppPageResp>({
    url: '/system/sso/app/list',
    method: 'get',
    params,
  })
}

/**
 * 获取 SSO 应用详情
 * @param id 应用ID
 */
export function getSsoAppDetail(id: number) {
  return request<SsoApplication>({
    url: `/system/sso/app/${id}`,
    method: 'get',
  })
}

/**
 * 新增 SSO 应用
 * @param data 应用数据
 */
export function createSsoApp(data: Partial<SsoApplication>) {
  return request<void>({
    url: '/system/sso/app',
    method: 'post',
    data,
  })
}

/**
 * 修改 SSO 应用
 * @param data 应用数据
 */
export function updateSsoApp(data: Partial<SsoApplication>) {
  return request<void>({
    url: '/system/sso/app',
    method: 'put',
    data,
  })
}

/**
 * 删除 SSO 应用
 * @param id 应用ID
 */
export function deleteSsoApp(id: number) {
  return request<void>({
    url: `/system/sso/app/${id}`,
    method: 'delete',
  })
}

/**
 * 获取 SSO 配置
 */
export function getSsoConfig() {
  return request<SsoConfig>({
    url: '/system/sso/config',
    method: 'get',
  })
}

/**
 * 修改 SSO 配置
 * @param data 配置数据
 */
export function updateSsoConfig(data: Partial<SsoConfig>) {
  return request<void>({
    url: '/system/sso/config',
    method: 'put',
    data,
  })
}

/**
 * 获取授权链接
 * @param appCode 应用编码
 */
export function getSsoAuthorizeUrl(appCode: string) {
  return request<SsoAuthorizeResp>({
    url: `/system/sso/authorize/${appCode}`,
    method: 'get',
  })
}

/**
 * 处理 SSO 回调
 * @param code 授权码
 * @param state 状态参数
 */
export function handleSsoCallback(code: string, state?: string) {
  return request<SsoTokenResp>({
    url: '/system/sso/callback',
    method: 'post',
    data: { code, state },
  })
}

/**
 * 获取 SSO 用户信息
 * @param accessToken Access Token
 */
export function getSsoUserInfo(accessToken: string) {
  return request<SsoUserInfo>({
    url: '/system/sso/userinfo',
    method: 'get',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

/**
 * 刷新 SSO Token
 * @param refreshToken Refresh Token
 */
export function refreshSsoToken(refreshToken: string) {
  return request<SsoTokenResp>({
    url: '/system/sso/refresh',
    method: 'post',
    data: { refreshToken },
  })
}

/**
 * SSO 登出
 * @param accessToken Access Token
 */
export function ssoLogout(accessToken: string) {
  return request<void>({
    url: '/system/sso/logout',
    method: 'post',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

/**
 * 测试 SSO 连接
 * @param data 应用数据
 */
export function testSsoConnection(data: Partial<SsoApplication>) {
  return request<boolean>({
    url: '/system/sso/test',
    method: 'post',
    data,
  })
}
