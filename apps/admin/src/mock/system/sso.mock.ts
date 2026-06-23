/**
 * SSO 单点登录 Mock 数据
 */
import type { SsoConfig, SsoApplication, SsoAppQuery } from '@yunshu/shared';

export interface IPageQuery {
  pageNum?: number
  pageSize?: number
  [key: string]: unknown
}

export interface IPageData<T> {
  rows: T
  total: number
  pageNum: number
  pageSize: number
}

/**
 * 获取 SSO 应用分页列表（Mock）
 */
export function getMockSsoAppPage(query?: IPageQuery): IPageData<SsoApplication[]> {
  const mockData: SsoApplication[] = [
    {
      id: 1,
      appName: '企业内部系统',
      appCode: 'enterprise-app-001',
      appType: 'oauth2',
      clientId: 'enterprise-app-001',
      clientSecret: '********',
      authorizationUrl: 'http://sso.example.com/authorize',
      tokenUrl: 'http://sso.example.com/token',
      userInfoUrl: 'http://sso.example.com/userinfo',
      scopes: ['openid', 'profile', 'email'],
      logo: '',
      status: '1',
      remark: '企业内部系统',
      createTime: '2026-01-01 10:00:00',
      updateTime: '2026-01-01 10:00:00',
    },
    {
      id: 2,
      appName: '第三方合作平台',
      appCode: 'partner-app-002',
      appType: 'oauth2',
      clientId: 'partner-app-002',
      clientSecret: '********',
      authorizationUrl: 'http://sso.example.com/authorize',
      tokenUrl: 'http://sso.example.com/token',
      userInfoUrl: 'http://sso.example.com/userinfo',
      scopes: ['openid', 'profile'],
      logo: '',
      status: '1',
      remark: '第三方合作平台',
      createTime: '2026-01-15 10:00:00',
      updateTime: '2026-01-15 10:00:00',
    },
    {
      id: 3,
      appName: '测试应用',
      appCode: 'test-app-003',
      appType: 'cas',
      clientId: 'test-app-003',
      clientSecret: '********',
      authorizationUrl: 'http://cas.example.com/login',
      tokenUrl: 'http://cas.example.com/token',
      userInfoUrl: 'http://cas.example.com/user',
      scopes: [],
      logo: '',
      status: '0',
      remark: '测试应用',
      createTime: '2026-02-01 10:00:00',
      updateTime: '2026-02-01 10:00:00',
    },
  ];

  const pageNum = query?.pageNum ?? 1;
  const pageSize = query?.pageSize ?? 10;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: mockData.slice(start, end),
    total: mockData.length,
    pageNum,
    pageSize,
  };
}
