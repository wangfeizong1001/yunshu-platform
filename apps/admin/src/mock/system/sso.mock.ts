/**
 * SSO 单点登录 Mock 数据
 */
import type { SsoConfig, SsoApplication, SsoAppQuery } from '@yunshu/shared';
import type { IPageData, IPageQuery } from '@/api/common';

/**
 * 获取 SSO 应用分页列表（Mock）
 */
export function getMockSsoAppPage(query?: IPageQuery): IPageData<SsoApplication[]> {
  const mockData: SsoApplication[] = [
    {
      id: 1,
      name: '企业内部系统',
      clientId: 'enterprise-app-001',
      clientSecret: '********',
      redirectUri: 'http://internal.example.com/callback',
      authType: 'OIDC',
      status: 1,
      createTime: '2026-01-01 10:00:00',
      updateTime: '2026-01-01 10:00:00',
    },
    {
      id: 2,
      name: '第三方合作平台',
      clientId: 'partner-app-002',
      clientSecret: '********',
      redirectUri: 'http://partner.example.com/callback',
      authType: 'OAUTH2',
      status: 1,
      createTime: '2026-01-15 10:00:00',
      updateTime: '2026-01-15 10:00:00',
    },
    {
      id: 3,
      name: '测试应用',
      clientId: 'test-app-003',
      clientSecret: '********',
      redirectUri: 'http://test.example.com/callback',
      authType: 'SAML',
      status: 0,
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
