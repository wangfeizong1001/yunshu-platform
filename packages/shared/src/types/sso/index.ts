/**
 * SSO 单点登录类型定义
 */

/** SSO 类型 */
export type SsoType = 'oauth2' | 'cas' | 'ldap'

/** SSO 应用 */
export interface SsoApplication {
  /** 应用ID */
  id: number
  /** 应用名称 */
  appName: string
  /** 应用编码 */
  appCode: string
  /** 应用类型 */
  appType: SsoType
  /** Client ID */
  clientId: string
  /** Client Secret */
  clientSecret: string
  /** 授权地址 */
  authorizationUrl: string
  /** Token 地址 */
  tokenUrl: string
  /** 用户信息地址 */
  userInfoUrl: string
  /** 权限范围 */
  scopes: string[]
  /** 应用Logo */
  logo: string
  /** 状态 (0-禁用 1-启用) */
  status: '0' | '1'
  /** 备注 */
  remark: string
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/** SSO 应用查询参数 */
export interface SsoAppQuery {
  /** 关键词 */
  keyword?: string
  /** 应用类型 */
  appType?: SsoType
  /** 状态 */
  status?: '0' | '1'
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/** SSO 配置 */
export interface SsoConfig {
  /** SSO 类型 */
  type: SsoType
  /** 是否启用 */
  enabled: boolean
  /** 登录页面标题 */
  title: string
  /** 默认跳转URL */
  defaultRedirectUrl: string
  /** 登出地址 */
  logoutUrl: string
  /** 会话超时时间(秒) */
  sessionTimeout: number
  /** CAS Server URL (CAS类型) */
  casServerUrl?: string
  /** LDAP 服务器地址 (LDAP类型) */
  ldapServerUrl?: string
  /** LDAP Base DN (LDAP类型) */
  ldapBaseDn?: string
}

/** SSO 授权响应 */
export interface SsoAuthorizeResp {
  /** 授权地址 */
  url: string
  /** 状态 */
  success: boolean
  /** 错误信息 */
  errorMsg?: string
}

/** SSO 令牌响应 */
export interface SsoTokenResp {
  /** Access Token */
  accessToken: string
  /** Token 类型 */
  tokenType: string
  /** 过期时间 */
  expiresIn: number
  /** Refresh Token */
  refreshToken?: string
  /** 错误信息 */
  error?: string
  /** 错误描述 */
  errorDescription?: string
}

/** SSO 用户信息 */
export interface SsoUserInfo {
  /** 用户ID */
  userId: string
  /** 用户名 */
  username: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  mobile?: string
  /** 头像 */
  avatar?: string
  /** 姓名 */
  realName?: string
  /** 所属组织 */
  organization?: string
  /** 权限列表 */
  permissions?: string[]
}

/** SSO 应用分页响应 */
export interface SsoAppPageResp {
  /** 总记录数 */
  total: number
  /** 列表数据 */
  rows: SsoApplication[]
}
