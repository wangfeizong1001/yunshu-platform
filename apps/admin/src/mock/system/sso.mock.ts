/**
 * SSO 单点登录 Mock 数据
 */

export interface MockQueryParams {
  pageNum?: number
  pageSize?: number
  appName?: string
  [key: string]: unknown
}

export interface MockPageResult<T> {
  rows: T[]
  total: number
}

const mockSsoAppData: Record<string, unknown>[] = [
  {
    id: 1,
    appName: 'OA 系统',
    appCode: 'oa-system',
    appType: 'oauth2',
    clientId: 'oa-client',
    clientSecret: 'oa-secret',
    authorizationUrl: 'https://oa.example.com/oauth2/authorize',
    tokenUrl: 'https://oa.example.com/oauth2/token',
    userInfoUrl: 'https://oa.example.com/oauth2/userinfo',
    scopes: ['openid', 'profile', 'email'],
    logo: '',
    status: '1',
    remark: '办公自动化系统',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    appName: 'CRM 系统',
    appCode: 'crm-system',
    appType: 'cas',
    clientId: 'crm-client',
    clientSecret: '',
    authorizationUrl: '',
    tokenUrl: '',
    userInfoUrl: '',
    scopes: [],
    logo: '',
    status: '1',
    remark: '客户关系管理系统',
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    appName: 'ERP 系统',
    appCode: 'erp-system',
    appType: 'ldap',
    clientId: '',
    clientSecret: '',
    authorizationUrl: '',
    tokenUrl: '',
    userInfoUrl: '',
    scopes: [],
    logo: '',
    status: '0',
    remark: '企业资源规划系统',
    createTime: '2024-01-03 10:00:00',
  },
]

export function getMockSsoAppPage(params: MockQueryParams): MockPageResult<Record<string, unknown>> {
  let filtered = mockSsoAppData
  if (params.appName) {
    filtered = filtered.filter((item) => (item.appName as string)?.includes(params.appName || ''))
  }
  return {
    rows: filtered,
    total: filtered.length,
  }
}

export const ssoAppMock: Record<string, unknown>[] = mockSsoAppData
