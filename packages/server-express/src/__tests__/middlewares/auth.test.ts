import { describe, it, expect, beforeEach } from 'vitest';
import express, { type Request, type Response } from 'express';
import supertest from 'supertest';
import {
  requireAuth,
  optionalAuth,
  authSession,
  createAuthMiddleware,
  createOptionalAuthMiddleware,
  createRoleMiddleware,
  requireAdmin,
  type ITokenVerifier,
  type IUserLookup,
} from '../../middlewares/auth';

describe('authSession 会话管理', () => {
  beforeEach(() => {
    authSession.clear();
  });

  it('应能够注册并通过 token 查找用户', () => {
    authSession.register('my-token', { userId: '1', userName: 'u', role: 'user' });
    const user = authSession.findByToken('my-token');
    expect(user).not.toBeNull();
    expect(user!.userId).toBe('1');
  });

  it('查找不存在的 token 应返回 null', () => {
    expect(authSession.findByToken('not-exist')).toBeNull();
  });

  it('clear 应清空所有已注册的用户', () => {
    authSession.register('a', { userId: '1', userName: 'u', role: 'user' });
    authSession.clear();
    expect(authSession.findByToken('a')).toBeNull();
  });

  it('setCurrent 应能够设置当前用户', () => {
    authSession.setCurrent({ userId: '99', userName: 'u', role: 'admin' });
    authSession.setCurrent(null);
  });
});

describe('requireAuth 认证中间件', () => {
  beforeEach(() => {
    authSession.clear();
    authSession.register('user-token', { userId: '10', userName: 'u', role: 'user' });
    authSession.register('admin-token', { userId: '1', userName: 'admin', role: 'admin' });
    authSession.register('super-token', { userId: '0', userName: 'super', role: 'super_admin' });
  });

  it('未携带 token 的请求应返回 401', async () => {
    const app = express();
    app.get('/need-auth', requireAuth(), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/need-auth');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('请先登录');
  });

  it('使用 Bearer token 应通过认证并设置 req.user', async () => {
    const app = express();
    app.get('/need-auth', requireAuth(), (req: Request, res: Response) => {
      res.json({ success: true, userId: req.user?.userId });
    });
    const res = await supertest(app).get('/need-auth').set('Authorization', 'Bearer user-token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userId).toBe('10');
  });

  it('使用 x-auth-token header 也应通过认证', async () => {
    const app = express();
    app.get('/need-auth', requireAuth(), (req: Request, res: Response) => {
      res.json({ success: true, userId: req.user?.userId });
    });
    const res = await supertest(app).get('/need-auth').set('x-auth-token', 'user-token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('无效 token 应返回 401', async () => {
    const app = express();
    app.get('/need-auth', requireAuth(), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/need-auth').set('Authorization', 'Bearer wrong-token');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('令牌');
  });

  it('要求 admin 角色但当前用户是 user 时应返回 403', async () => {
    const app = express();
    app.get('/admin-only', requireAuth({ role: 'admin' }), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/admin-only').set('Authorization', 'Bearer user-token');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('admin 用户访问 admin-only 接口应返回 200', async () => {
    const app = express();
    app.get('/admin-only', requireAuth({ role: 'admin' }), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/admin-only').set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('super_admin 用户访问 admin-only 接口应返回 200', async () => {
    const app = express();
    app.get('/admin-only', requireAuth({ role: 'admin' }), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/admin-only').set('Authorization', 'Bearer super-token');
    expect(res.status).toBe(200);
  });

  it('要求 super_admin 角色但用户为 admin 时应返回 403', async () => {
    const app = express();
    app.get('/super', requireAuth({ role: 'super_admin' }), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/super').set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(403);
  });

  it('要求 user 角色且用户为 user 时应通过', async () => {
    const app = express();
    app.get('/user', requireAuth({ role: 'user' }), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/user').set('Authorization', 'Bearer user-token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('响应应包含 timestamp 字段', async () => {
    const app = express();
    app.get('/need-auth', requireAuth(), (_req: Request, res: Response) => {
      res.json({ success: true });
    });
    const res = await supertest(app).get('/need-auth');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('optionalAuth 可选认证中间件', () => {
  beforeEach(() => {
    authSession.clear();
    authSession.register('t', { userId: '1', userName: 'u', role: 'user' });
  });

  it('未携带 token 时也应继续处理请求', async () => {
    const app = express();
    app.get('/optional', optionalAuth(), (req: Request, res: Response) => {
      res.json({ success: true, hasUser: !!req.user });
    });
    const res = await supertest(app).get('/optional');
    expect(res.status).toBe(200);
    expect(res.body.hasUser).toBe(false);
  });

  it('携带有效 token 时应设置 req.user', async () => {
    const app = express();
    app.get('/optional', optionalAuth(), (req: Request, res: Response) => {
      res.json({ success: true, userId: req.user?.userId });
    });
    const res = await supertest(app).get('/optional').set('Authorization', 'Bearer t');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('1');
  });
});

describe('createAuthMiddleware 通用认证中间件工厂', () => {
  it('缺少 Authorization header 应返回 401', async () => {
    const verifier: ITokenVerifier = { verify: () => null };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createAuthMiddleware(verifier, lookup), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/p');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('登录');
  });

  it('token 验证失败应返回 401', async () => {
    const verifier: ITokenVerifier = { verify: () => null };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createAuthMiddleware(verifier, lookup), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer bad');
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('令牌');
  });

  it('token 验证通过但用户不存在应返回 401', async () => {
    const verifier: ITokenVerifier = { verify: () => ({ userId: 'u1' }) };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createAuthMiddleware(verifier, lookup), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer any');
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('用户');
  });

  it('用户通过验证应设置 req.user 和 req.token', async () => {
    const verifier: ITokenVerifier = { verify: () => ({ userId: 'u1' }) };
    const lookup: IUserLookup = { findById: async (id) => ({ userId: id, name: 'A' }) };
    const app = express();
    app.get('/p', createAuthMiddleware(verifier, lookup), (req, res) => {
      res.json({ userId: req.user?.userId, token: req.token });
    });
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer my-token');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('u1');
    expect(res.body.token).toBe('my-token');
  });

  it('验证器抛出异常应返回 500', async () => {
    const verifier: ITokenVerifier = {
      verify: () => {
        throw new Error('boom');
      },
    };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createAuthMiddleware(verifier, lookup), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer any');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('createOptionalAuthMiddleware 可选认证中间件工厂', () => {
  it('缺少 header 应继续处理（不设置 user）', async () => {
    const verifier: ITokenVerifier = { verify: () => null };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createOptionalAuthMiddleware(verifier, lookup), (req, res) => {
      res.json({ hasUser: !!req.user });
    });
    const res = await supertest(app).get('/p');
    expect(res.status).toBe(200);
    expect(res.body.hasUser).toBe(false);
  });

  it('携带有效 token 应设置 req.user', async () => {
    const verifier: ITokenVerifier = { verify: () => ({ userId: 'u1' }) };
    const lookup: IUserLookup = { findById: async (id) => ({ userId: id }) };
    const app = express();
    app.get('/p', createOptionalAuthMiddleware(verifier, lookup), (req, res) => {
      res.json({ userId: req.user?.userId });
    });
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('u1');
  });

  it('verify 失败应继续处理（不设置 user）', async () => {
    const verifier: ITokenVerifier = { verify: () => null };
    const lookup: IUserLookup = { findById: async () => ({ userId: '1' }) };
    const app = express();
    app.get('/p', createOptionalAuthMiddleware(verifier, lookup), (req, res) => {
      res.json({ hasUser: !!req.user });
    });
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.hasUser).toBe(false);
  });

  it('内部抛出异常应继续处理', async () => {
    const verifier: ITokenVerifier = {
      verify: () => {
        throw new Error('boom');
      },
    };
    const lookup: IUserLookup = { findById: async () => null };
    const app = express();
    app.get('/p', createOptionalAuthMiddleware(verifier, lookup), (req, res) => {
      res.json({ hasUser: !!req.user });
    });
    const res = await supertest(app).get('/p').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.hasUser).toBe(false);
  });
});

describe('createRoleMiddleware 角色鉴权中间件', () => {
  it('未登录用户应返回 401', async () => {
    const app = express();
    app.get('/role', createRoleMiddleware(['admin']), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/role');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('角色不匹配应返回 403', async () => {
    const app = express();
    app.get('/role', (req, _res, next) => {
      req.user = { userId: '1', userName: 'u', role: 'user' } as any;
      next();
    }, createRoleMiddleware(['admin']), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/role');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('角色匹配应通过', async () => {
    const app = express();
    app.get('/role', (req, _res, next) => {
      req.user = { userId: '1', userName: 'u', role: 'admin' } as any;
      next();
    }, createRoleMiddleware(['admin']), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/role');
    expect(res.status).toBe(200);
  });
});

describe('requireAdmin 管理员便捷中间件', () => {
  it('管理员应通过', async () => {
    const app = express();
    app.get('/admin', (req, _res, next) => {
      req.user = { userId: '1', userName: 'u', role: 'admin' } as any;
      next();
    }, requireAdmin(), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/admin');
    expect(res.status).toBe(200);
  });

  it('super_admin 也应通过', async () => {
    const app = express();
    app.get('/admin', (req, _res, next) => {
      req.user = { userId: '1', userName: 'u', role: 'super_admin' } as any;
      next();
    }, requireAdmin(), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/admin');
    expect(res.status).toBe(200);
  });

  it('普通用户应返回 403', async () => {
    const app = express();
    app.get('/admin', (req, _res, next) => {
      req.user = { userId: '1', userName: 'u', role: 'user' } as any;
      next();
    }, requireAdmin(), (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/admin');
    expect(res.status).toBe(403);
  });
});
