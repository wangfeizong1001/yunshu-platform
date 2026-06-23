/**
 * 认证中间件 verifyToken / optionalVerifyToken / requireRole 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  verifyToken,
  optionalVerifyToken,
  requireRole,
  requireAdmin,
  createAuthMiddlewares,
} from '../auth';

function mockRes() {
  const res: any = { statusCode: 200, body: undefined };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body: unknown) => {
    res.body = body;
    return res;
  };
  res.setHeader = vi.fn();
  res.end = vi.fn((data?: string) => {
    if (data) res.body = data;
  });
  return res;
}

function mockReq(headers: Record<string, string> = {}) {
  return {
    headers,
  } as any;
}

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('缺失 Authorization 头应返回 401', async () => {
    const middleware = verifyToken({ secret: 's' });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();
    await middleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('有效 token 应调用 next 并挂载 user', async () => {
    const verifier = vi.fn(() => ({ sub: '1', role: 'user' }));
    const middleware = verifyToken({ secret: 's', verifier });
    const req = mockReq({ authorization: 'Bearer any-token' });
    const res = mockRes();
    const next = vi.fn();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.token).toBe('any-token');
  });

  it('无效 token 应返回 401', async () => {
    const verifier = vi.fn(() => null);
    const middleware = verifyToken({ secret: 's', verifier });
    const req = mockReq({ authorization: 'Bearer bad-token' });
    const res = mockRes();
    const next = vi.fn();
    await middleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('optionalVerifyToken 缺失 token 时应调用 next', async () => {
    const middleware = optionalVerifyToken({ secret: 's' });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('optionalVerifyToken 有效 token 时应挂载 user', async () => {
    const verifier = vi.fn(() => ({ sub: '1' }));
    const middleware = optionalVerifyToken({ secret: 's', verifier });
    const req = mockReq({ authorization: 'Bearer ok' });
    const res = mockRes();
    const next = vi.fn();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it('requireRole 应允许允许角色通过', () => {
    const middleware = requireRole(['admin']);
    const req = { user: { role: 'admin' } } as any;
    const res = mockRes();
    const next = vi.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('requireRole 应对未登录用户返回 401', () => {
    const middleware = requireRole(['admin']);
    const req = {} as any;
    const res = mockRes();
    const next = vi.fn();
    middleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('requireRole 应对不被允许角色返回 403', () => {
    const middleware = requireRole(['admin']);
    const req = { user: { role: 'guest' } } as any;
    const res = mockRes();
    const next = vi.fn();
    middleware(req, res, next);
    expect(res.statusCode).toBe(403);
  });

  it('requireAdmin 应等同于 requireRole(["admin","super_admin"])', () => {
    const middleware = requireAdmin();
    const req1 = { user: { role: 'admin' } } as any;
    const req2 = { user: { role: 'super_admin' } } as any;
    const req3 = { user: { role: 'user' } } as any;
    const next1 = vi.fn();
    const next2 = vi.fn();
    const next3 = vi.fn();
    middleware(req1, mockRes(), next1);
    middleware(req2, mockRes(), next2);
    middleware(req3, mockRes(), next3);
    expect(next1).toHaveBeenCalled();
    expect(next2).toHaveBeenCalled();
    expect(next3).not.toHaveBeenCalled();
  });

  it('createAuthMiddlewares 应返回所有中间件', () => {
    const mws = createAuthMiddlewares({ secret: 's' });
    expect(typeof mws.verifyToken).toBe('function');
    expect(typeof mws.optionalVerifyToken).toBe('function');
    expect(typeof mws.requireRole).toBe('function');
    expect(typeof mws.requireAdmin).toBe('function');
  });

  it('requireRole 应接受字符串数组 roles', () => {
    const middleware = requireRole(['editor', 'admin']);
    const req = { user: { role: 'editor' } } as any;
    const next = vi.fn();
    middleware(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('requireRole 应接受 user.roles 数组形式', () => {
    const middleware = requireRole(['a', 'b']);
    const req = { user: { role: ['a', 'c'] } } as any;
    const next = vi.fn();
    middleware(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
