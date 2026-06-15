import { describe, it, expect } from 'vitest';
import { thirdController } from '../../../modules/third/ThirdController';
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
    user: { role: "admin", userId: "1", userName: "admin" },
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

describe('ThirdController 第三方登录控制器', () => {
  it('应能实例化', () => {
    expect(thirdController).toBeDefined();
  });

  it('listConfigs 应返回配置分页列表', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.listConfigs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData.data).toHaveProperty('total');
  });

  it('listConfigs 支持 platform 过滤', async () => {
    const req = createMockRequest({ query: { platform: 'wechat' } });
    const res = createMockResponse();
    await thirdController.listConfigs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('listConfigs 支持 status 过滤', async () => {
    const req = createMockRequest({ query: { status: '1' } });
    const res = createMockResponse();
    await thirdController.listConfigs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfigById 应能获取单个配置', async () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    await thirdController.getConfigById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getConfigById 不存在应返回 notFound', async () => {
    const req = createMockRequest({ params: { id: '99999' } });
    const res = createMockResponse();
    await thirdController.getConfigById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('getEnabledConfigs 应返回启用的配置', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.getEnabledConfigs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(Array.isArray(res._jsonData.data)).toBe(true);
  });

  it('createConfig 应能创建配置', async () => {
    const req = createMockRequest({
      body: {
        platform: 'qq',
        appId: 'q_123',
        appSecret: 'q_secret',
        callbackUrl: 'http://localhost/callback',
        scopes: ['user_info'],
      },
    });
    const res = createMockResponse();
    await thirdController.createConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('updateConfig 应能更新配置', async () => {
    const req = createMockRequest({ params: { id: '1' }, body: { remark: '更新后' } });
    const res = createMockResponse();
    await thirdController.updateConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('deleteConfig 应能删除配置', async () => {
    const req = createMockRequest({ params: { id: '2' } });
    const res = createMockResponse();
    await thirdController.deleteConfig(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('changeConfigStatus 应能修改配置状态', async () => {
    const req = createMockRequest({ body: { id: 1, status: '1' } });
    const res = createMockResponse();
    await thirdController.changeConfigStatus(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAuthorizeUrl 应能生成授权地址', async () => {
    const req = createMockRequest({ query: { platform: 'wechat', redirectUri: 'http://localhost/cb' } });
    const res = createMockResponse();
    await thirdController.getAuthorizeUrl(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getAuthorizeUrl 缺少参数应返回 badRequest', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.getAuthorizeUrl(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('handleCallback 应能处理授权码', async () => {
    const req = createMockRequest({ query: { platform: 'wechat', code: 'test-code' } });
    const res = createMockResponse();
    await thirdController.handleCallback(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('bindAccount 应能绑定账号', async () => {
    const req = createMockRequest({ body: { platform: 'github', code: 'test-code', action: 'register', username: 'testuser', password: 'testpass' } });
    const res = createMockResponse();
    await thirdController.bindAccount(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('bindAccount 缺少参数应返回 badRequest', async () => {
    const req = createMockRequest({ body: {} });
    const res = createMockResponse();
    await thirdController.bindAccount(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('unbindAccount 应能解除绑定', async () => {
    // 先确保有一个绑定
    const bindReq = createMockRequest({ body: { platform: 'github', code: 'test-code2', action: 'register', username: 'testuser2', password: 'testpass' } });
    const bindRes = createMockResponse();
    await thirdController.bindAccount(bindReq, bindRes as unknown as Response);

    const req = createMockRequest({ body: { platform: 'github', userId: 1 } });
    const res = createMockResponse();
    await thirdController.unbindAccount(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getUserBinds 应能获取用户绑定', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.getUserBinds(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('listLogs 应返回日志分页', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.listLogs(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
    expect(res._jsonData.data).toHaveProperty('total');
  });

  it('getLogById 应能获取单个日志', async () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    await thirdController.getLogById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });

  it('getLogById 不存在应返回 notFound', async () => {
    const req = createMockRequest({ params: { id: '99999' } });
    const res = createMockResponse();
    await thirdController.getLogById(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', false);
  });

  it('getLoginStats 应能获取登录统计', async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await thirdController.getLoginStats(req, res as unknown as Response);
    expect(res._jsonData).toHaveProperty('success', true);
  });
});
