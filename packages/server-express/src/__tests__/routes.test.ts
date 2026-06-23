import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { registerRoutes, createRouter } from '../routes';

describe('registerRoutes 路由注册', () => {
  it('应是一个函数', () => {
    expect(typeof registerRoutes).toBe('function');
  });

  it('在 Express Router 上调用时不抛错', () => {
    const router = express.Router();
    expect(() => registerRoutes(router)).not.toThrow();
  });

  it('注册后 router stack 应有路由条目', () => {
    const router = express.Router();
    registerRoutes(router);
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});

describe('createRouter 工厂函数', () => {
  it('应返回一个 Router 对象', () => {
    const router = createRouter();
    expect(router).toBeDefined();
    expect(typeof router).toBe('function');
  });

  it('返回的 Router 应有 stack 条目', () => {
    const router = createRouter();
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});

describe('健康检查路由', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    const router = express.Router();
    registerRoutes(router);
    app.use('/', router);
  });

  it('GET /health 应返回 200', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    server.close();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe('UP');
    expect(body).toHaveProperty('timestamp');
  });

  it('GET / 应返回 200', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/`);
    server.close();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.endpoints).toBeDefined();
  });
});

describe('system 模块路由', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    const router = express.Router();
    registerRoutes(router);
    app.use('/', router);
  });

  it('/system/user/list 应返回 401（未登录）', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/user/list`);
    server.close();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('请先登录');
  });

  it('/system/role/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/role/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/dept/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/dept/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/post/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/post/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/config/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/config/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/dict/type/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/dict/type/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/notice/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/notice/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/system/message/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/system/message/list`);
    server.close();
    expect(res.status).toBe(401);
  });
});

describe('monitor 模块路由', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    const router = express.Router();
    registerRoutes(router);
    app.use('/', router);
  });

  it('/monitor/server 应返回 401（未登录）', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/monitor/server`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/monitor/job/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/monitor/job/list`);
    server.close();
    expect(res.status).toBe(401);
  });

  it('/monitor/operlog/list 应返回 401', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    const res = await fetch(`http://127.0.0.1:${port}/monitor/operlog/list`);
    server.close();
    expect(res.status).toBe(401);
  });
});
