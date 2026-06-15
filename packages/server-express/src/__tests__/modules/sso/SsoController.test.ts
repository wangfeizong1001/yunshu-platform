import { describe, it, expect, beforeEach } from 'vitest';
import { ssoController } from '../../../modules/sso/SsoController';
import type { Request, Response } from 'express';

interface MockResponse extends Response {
  _statusCode: number;
  _jsonData: unknown;
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    query: {},
    params: {},
    body: {},
    headers: {},
    ...overrides,
  } as Request;
}

function createMockResponse(): MockResponse {
  const res = {
    _statusCode: 200,
    _jsonData: null,
  } as unknown as MockResponse;
  res.status = (code: number) => {
    res._statusCode = code;
    return res;
  };
  res.json = (data: unknown) => {
    res._jsonData = data;
    return res;
  };
  return res;
}

describe('SsoController SSO控制器', () => {
  it('应能实例化', () => {
    expect(ssoController).toBeDefined();
  });

  it('listApps 应返回分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await ssoController.listApps(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData).toHaveProperty(['data', 'total']);
    expect(res._jsonData).toHaveProperty(['data', 'rows']);
  });

  it('listApps 支持 keyword 过滤', async () => {
    const req = createMockRequest({ query: { keyword: 'wecom' } });
    const res = createMockResponse();
    await ssoController.listApps(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('listApps 支持 status 过滤', async () => {
    const req = createMockRequest({ query: { status: '1' } });
    const res = createMockResponse();
    await ssoController.listApps(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAppById 应能获取单个应用', async () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    await ssoController.getAppById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAppById 不存在应返回 notFound', async () => {
    const req = createMockRequest({ params: { id: '99999' } });
    const res = createMockResponse();
    await ssoController.getAppById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('getEnabledApps 应返回启用的应用', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    await ssoController.getEnabledApps(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('createApp 应能创建应用', async () => {
    const req = createMockRequest({
      body: {
        appName: 'Test',
        appCode: 'test_' + Date.now(),
        appType: 'oauth2',
        clientId: 'cid1',
        clientSecret: 'sec1',
      },
    });
    const res = createMockResponse();
    await ssoController.createApp(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('createApp 缺少参数应返回 badRequest', async () => {
    const req = createMockRequest({ body: {} });
    const res = createMockResponse();
    await ssoController.createApp(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('updateApp 应能更新应用', async () => {
    const req = createMockRequest({ params: { id: '1' }, body: { remark: '更新' } });
    const res = createMockResponse();
    await ssoController.updateApp(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deleteApp 应能删除应用', async () => {
    const req = createMockRequest({ params: { id: '2' } });
    const res = createMockResponse();
    await ssoController.deleteApp(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('changeAppStatus 应能修改状态', async () => {
    const req = createMockRequest({ body: { id: 1, status: '1' } });
    const res = createMockResponse();
    await ssoController.changeAppStatus(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfig 应能获取配置', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    await ssoController.getConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateConfig 应能更新配置', async () => {
    const req = createMockRequest({ body: { sessionTimeout: 3600 } });
    const res = createMockResponse();
    await ssoController.updateConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAuthorizeUrl 应能生成授权地址', async () => {
    const req = createMockRequest({
      query: { appCode: 'wecom', redirectUri: 'http://localhost/cb' },
    });
    const res = createMockResponse();
    await ssoController.getAuthorizeUrl(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData.data).toHaveProperty('url');
  });

  it('getAuthorizeUrl 缺少 appCode 应返回 notFound', async () => {
    const req = createMockRequest({ query: { redirectUri: 'http://localhost/cb' } });
    const res = createMockResponse();
    await ssoController.getAuthorizeUrl(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('handleCallback 应能处理授权码', async () => {
    const req = createMockRequest({ query: { code: 'abc123', appCode: 'wecom' } });
    const res = createMockResponse();
    await ssoController.handleCallback(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('handleCallback 缺少 code 应返回 badRequest', async () => {
    const req = createMockRequest({ query: { appCode: 'wecom' } });
    const res = createMockResponse();
    await ssoController.handleCallback(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('logout 应能注销', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    await ssoController.logout(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});
