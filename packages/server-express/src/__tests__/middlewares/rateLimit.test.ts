import { describe, it, expect } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import {
  loginLimiter,
  apiLimiter,
  strictLimiter,
} from '../../middlewares/rateLimit';

describe('loginLimiter 登录限流', () => {
  it('未超过限制时应正常响应', async () => {
    const app = express();
    app.post('/login', loginLimiter, (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).post('/login');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('超过限制后应返回 429', async () => {
    const app = express();
    app.post('/login-hard', loginLimiter, (_req, res) => res.json({ ok: true }));

    let last: any;
    // 连续请求触发限流（默认 5 次/分钟）
    for (let i = 0; i < 12; i++) {
      last = await supertest(app).post('/login-hard');
    }
    expect(last.status).toBe(429);
    expect(last.body.success).toBe(false);
    expect(last.body).toHaveProperty('timestamp');
  });
});

describe('apiLimiter API 限流', () => {
  it('未超过限制时应正常响应', async () => {
    const app = express();
    app.get('/api', apiLimiter, (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/api');
    expect(res.status).toBe(200);
  });
});

describe('strictLimiter 严格限流', () => {
  it('未超过限制时应正常响应', async () => {
    const app = express();
    app.get('/strict', strictLimiter, (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/strict');
    expect(res.status).toBe(200);
  });
});
