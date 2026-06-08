/**
 * SSO 单点登录 Mock 数据
 */

import type {
  SsoApplication,
  SsoAppPageResp,
  SsoConfig,
  SsoAuthorizeResp,
  SsoTokenResp,
  SsoUserInfo,
} from '@yunshu/shared/types/sso'

// SSO 配置 Mock 数据
export const mockSsoConfig: SsoConfig = {
  type: 'oauth2',
  enabled: true,
  title: '云枢中台SSO登录',
  defaultRedirectUrl: '/',
  logoutUrl: 'https://sso.yunshu.com/logout',
  sessionTimeout: 7200,
}

// SSO 应用 Mock 数据
export const mockSsoAppList: SsoApplication[] = [
  {
    id: 1,
    appName: '企业微信',
    appCode: 'wecom',
    appType: 'oauth2',
    clientId: 'wx enterprise app id',
    clientSecret: 'wx enterprise app secret',
    authorizationUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    tokenUrl: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
    userInfoUrl: 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo',
    scopes: ['snsapi_base', 'snsapi_privateinfo'],
    logo: '/static/wecom-logo.png',
    status: '1',
    remark: '企业微信 SSO 集成',
    createBy: 'admin',
    createTime: '2024-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    appName: '钉钉',
    appCode: 'dingtalk',
    appType: 'oauth2',
    clientId: 'dingtalk app id',
    clientSecret: 'dingtalk app secret',
    authorizationUrl: 'https://oapi.dingtalk.com/connect/oauth2/authorize',
    tokenUrl: 'https://oapi.dingtalk.com/gettoken',
    userInfoUrl: 'https://oapi.dingtalk.com/user/getuserinfo',
    scopes: ['snsapi_base', 'snsapi_privateinfo'],
    logo: '/static/dingtalk-logo.png',
    status: '1',
    remark: '钉钉 SSO 集成',
    createBy: 'admin',
    createTime: '2024-01-02 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-16 09:00:00',
  },
  {
    id: 3,
    appName: 'CAS 统一身份认证',
    appCode: 'cas',
    appType: 'cas',
    clientId: 'cas client id',
    clientSecret: 'cas client secret',
    authorizationUrl: 'https://cas.yunshu.com/login',
    tokenUrl: 'https://cas.yunshu.com/serviceValidate',
    userInfoUrl: 'https://cas.yunshu.com/userinfo',
    scopes: [],
    logo: '/static/cas-logo.png',
    status: '0',
    remark: 'CAS 单点登录集成',
    createBy: 'admin',
    createTime: '2024-01-03 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-17 10:00:00',
  },
  {
    id: 4,
    appName: 'LDAP 目录服务',
    appCode: 'ldap',
    appType: 'ldap',
    clientId: 'ldap server dn',
    clientSecret: 'ldap server password',
    authorizationUrl: 'ldap://ldap.yunshu.com:389',
    tokenUrl: '',
    userInfoUrl: '',
    scopes: [],
    logo: '/static/ldap-logo.png',
    status: '0',
    remark: 'LDAP 目录服务集成',
    createBy: 'admin',
    createTime: '2024-01-04 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-18 11:00:00',
  },
  {
    id: 5,
    appName: 'GitHub',
    appCode: 'github',
    appType: 'oauth2',
    clientId: 'github client id',
    clientSecret: 'github client secret',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
    logo: '/static/github-logo.png',
    status: '1',
    remark: 'GitHub OAuth 登录',
    createBy: 'admin',
    createTime: '2024-01-05 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-19 12:00:00',
  },
]

// 获取 SSO 配置 Mock
export function getMockSsoConfig(): SsoConfig {
  return mockSsoConfig
}

// 获取 SSO 应用列表 Mock
export function getMockSsoAppPage(params: any): SsoAppPageResp {
  const { pageNum = 1, pageSize = 10, keyword = '', appType = '', status = '' } = params

  let filteredList = [...mockSsoAppList]

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.appName.includes(keyword) ||
        item.appCode.includes(keyword)
    )
  }

  if (appType) {
    filteredList = filteredList.filter((item) => item.appType === appType)
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取 SSO 应用详情 Mock
export function getMockSsoAppDetail(id: number): SsoApplication | undefined {
  return mockSsoAppList.find((item) => item.id === id)
}

// 获取授权链接 Mock
export function getMockSsoAuthorizeUrl(appCode: string): SsoAuthorizeResp {
  const app = mockSsoAppList.find((item) => item.appCode === appCode)

  if (!app) {
    return {
      success: false,
      url: '',
      errorMsg: '应用不存在',
    }
  }

  if (app.status === '0') {
    return {
      success: false,
      url: '',
      errorMsg: '应用已禁用',
    }
  }

  // 模拟生成授权 URL
  const state = `sso_${appCode}_${Date.now()}`
  const redirectUri = encodeURIComponent(`${window.location.origin}/api/system/sso/callback/${appCode}`)
  const url = `${app.authorizationUrl}?client_id=${app.clientId}&redirect_uri=${redirectUri}&scope=${app.scopes.join(' ')}&state=${state}`

  return {
    success: true,
    url,
  }
}

// 处理 SSO 回调 Mock
export function handleMockSsoCallback(code: string, state?: string): SsoTokenResp {
  if (!code) {
    return {
      accessToken: '',
      tokenType: 'Bearer',
      expiresIn: 0,
      error: 'invalid_code',
      errorDescription: '授权码无效',
    }
  }

  return {
    accessToken: `mock_access_token_${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 7200,
    refreshToken: `mock_refresh_token_${Date.now()}`,
  }
}

// 获取 SSO 用户信息 Mock
export function getMockSsoUserInfo(accessToken: string): SsoUserInfo {
  return {
    userId: 'sso_user_001',
    username: 'sso_user',
    email: 'sso_user@example.com',
    mobile: '13800138000',
    avatar: 'https://example.com/avatar.jpg',
    realName: 'SSO 用户',
    organization: '云枢科技',
    permissions: ['system:user:view', 'system:role:view'],
  }
}

// 刷新 Token Mock
export function refreshMockSsoToken(refreshToken: string): SsoTokenResp {
  return {
    accessToken: `mock_access_token_${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 7200,
    refreshToken: `mock_refresh_token_${Date.now()}`,
  }
}
