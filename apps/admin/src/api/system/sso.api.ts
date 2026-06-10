/**
 * SSO单点登录 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface SsoConfig {
  ssoType: string
  clientId: string
  clientSecret: string
  redirectUri: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
}

export const getSsoConfig = () => {
  return request<SsoConfig>({
    url: '/system/sso/config',
    method: 'GET'
  })
}

export const saveSsoConfig = (data: SsoConfig) => {
  return request<void>({
    url: '/system/sso/config',
    method: 'POST',
    data
  })
}

export const ssoLogin = (code: string, state: string) => {
  return request<{ token: string; user?: object }>({
    url: '/system/sso/login',
    method: 'POST',
    data: { code, state }
  })
}

export const ssoLogout = () => {
  return request<void>({
    url: '/system/sso/logout',
    method: 'POST'
  })
}
