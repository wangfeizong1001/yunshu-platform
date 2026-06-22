import { describe, it, expect } from 'vitest';
import { smsController } from '../../../modules/sms/SmsController';

describe('SmsController 短信控制器', () => {
  it('应能实例化', () => {
    expect(smsController).toBeDefined();
  });

  it('listConfigs 应返回配置列表', async () => {
    const req = { query: {} } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.listConfigs(req, res);
    expect(json.body.success).toBe(true);
    expect(Array.isArray(json.body.data)).toBe(true);
  });

  it('getConfigById 应能获取单个配置', async () => {
    const req = { params: { id: 1 } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.getConfigById(req, res);
    expect(json.body.success).toBe(true);
    expect(json.body.data).toHaveProperty('platform');
  });

  it('getConfigById 不存在应返回 notFound', async () => {
    const req = { params: { id: 99999 } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.getConfigById(req, res);
    expect(json.body.success).toBe(false);
  });

  it('createConfig 应能创建配置', async () => {
    const req = {
      body: {
        platform: 'aliyun',
        accessKey: 'k1',
        secretKey: 's1',
        signName: 'sign',
        templateCode: 'T1',
      },
    } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.createConfig(req, res);
    expect(json.body.success).toBe(true);
  });

  it('createConfig 参数缺失应返回 badRequest', async () => {
    const req = { body: {} } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.createConfig(req, res);
    expect(json.body.success).toBe(false);
  });

  it('getCurrentConfig 应返回当前配置', async () => {
    const req = { query: {} } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.getCurrentConfig(req, res);
    expect(json.body.success).toBe(true);
  });

  it('listTemplates 应返回分页列表', async () => {
    const req = { query: { pageNum: 1, pageSize: 10 } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.listTemplates(req, res);
    expect(json.body.success).toBe(true);
    expect(json.body.data).toHaveProperty('total');
    expect(json.body.data).toHaveProperty('rows');
  });

  it('listTemplates 支持 keyword 搜索', async () => {
    const req = { query: { keyword: '登录' } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.listTemplates(req, res);
    expect(json.body.success).toBe(true);
  });

  it('send 应能发送短信', async () => {
    const req = { body: { mobile: '13800138000', templateCode: 'SMS_123456789' } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.send(req, res);
    expect(json.body.success).toBe(true);
  });

  it('send 参数缺失应返回 badRequest', async () => {
    const req = { body: {} } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.send(req, res);
    expect(json.body.success).toBe(false);
  });

  it('batchSend 应能批量发送', async () => {
    const req = { body: { mobiles: ['13800138000', '13900139000'], templateCode: 'SMS_123456789' } } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.batchSend(req, res);
    expect(json.body.success).toBe(true);
    expect(Array.isArray(json.body.data)).toBe(true);
  });

  it('listLogs 应返回日志分页', async () => {
    const req = { query: {} } as any;
    const json = { body: null as unknown as Record<string, unknown> };
    const res = {
      status: (_code: number) => res,
      json: (data: unknown) => { json.body = data as Record<string, unknown>; return res; },
    } as any;

    await smsController.listLogs(req, res);
    expect(json.body.success).toBe(true);
    expect(json.body.data).toHaveProperty('total');
  });
});
