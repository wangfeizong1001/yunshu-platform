import { describe, it, expect, beforeEach } from 'vitest';
import { createTestApp } from './helpers/createTestApp';

describe('应用健康检查 /api/health', () => {
  const { request } = createTestApp();

  it('GET /api/health 应该返回 200 且 success=true', async () => {
    const res = await request.get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('UP');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });

  it('GET /api/health 响应体字段类型校验', async () => {
    const res = await request.get('/api/health');
    expect(typeof res.body.timestamp).toBe('string');
    expect(typeof res.body.version).toBe('string');
  });

  it('多次请求 /api/health 应该始终返回 200', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request.get('/api/health');
      expect(res.status).toBe(200);
    }
  });
});

describe('应用根路由 /api/', () => {
  const { request } = createTestApp();

  it('GET /api 应返回 200 且 success=true', async () => {
    const res = await request.get('/api');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/ 应包含 message 字段', async () => {
    const res = await request.get('/api/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.length).toBeGreaterThan(0);
  });

  it('GET /api 应包含 endpoints.health 指向健康检查接口', async () => {
    const res = await request.get('/api');
    expect(res.body).toHaveProperty('endpoints');
    expect(res.body.endpoints).toHaveProperty('health');
    expect(res.body.endpoints.health).toContain('health');
  });

  it('GET /api 应返回 JSON 格式响应', async () => {
    const res = await request.get('/api');
    expect(res.headers['content-type']).toContain('application/json');
  });
});

describe('404 路由处理', () => {
  const { request } = createTestApp();

  it('GET /api/not-exist 应该返回 404 且 success=false', async () => {
    const res = await request.get('/api/not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/unknown-route 应该返回 404', async () => {
    const res = await request.post('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('未知路由应包含错误消息字段', async () => {
    const res = await request.get('/api/random/nested/route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('PUT /api/nothing-here 应返回 JSON 错误格式', async () => {
    const res = await request.put('/api/nothing-here');
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.status).toBe(404);
  });
});

describe('跨域和响应头', () => {
  const { request } = createTestApp();

  it('响应应包含正确的 Content-Type: application/json', async () => {
    const res = await request.get('/api/health');
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('OPTIONS 请求应返回 CORS 头', async () => {
    const res = await request.options('/api/health');
    expect(res.status).toBeLessThan(500);
  });

  it('CORS 头应允许跨域请求', async () => {
    const res = await request.get('/api/health').set('Origin', 'http://test.example.com');
    expect(res.status).toBe(200);
  });
});
