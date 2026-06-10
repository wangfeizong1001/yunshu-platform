/**
 * Express 适配器 — 认证授权中间件
 *
 * 提供 JWT Token 验证、可选认证、角色鉴权中间件。
 *
 * @module @yunshu/server-express/middlewares/auth
 */

import type { Request, Response, NextFunction } from 'express';

// ============================================================================
// 类型扩展
// ============================================================================

/** 扩展 Express Request 类型 */
declare global {
  namespace Express {
    interface Request {
      /** 当前登录用户（由 auth 中间件注入） */
      user?: {
        userId: string;
        userName?: string;
        role?: string;
        [key: string]: unknown;
      };
      /** 原始 Token */
      token?: string;
      /** 请求 ID（由 app.ts 的请求 ID 中间件注入） */
      requestId?: string;
    }
  }
}

// ============================================================================
// JWT 工具类型
// ============================================================================

/** JWT Payload */
interface JWTPayload {
  userId: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/** Token 验证器接口 */
export interface ITokenVerifier {
  /** 验证 Token 并返回 payload */
  verify(token: string): JWTPayload | null;
}

/** 用户查询器接口 */
export interface IUserLookup {
  /** 根据 ID 查找用户 */
  findById(id: string): Promise<Record<string, unknown> | null>;
}

// ============================================================================
// 认证中间件工厂
// ============================================================================

/**
 * 创建 Token 认证中间件
 *
 * @param tokenVerifier Token 验证器
 * @param userLookup 用户查询器
 */
export function createAuthMiddleware(
  tokenVerifier: ITokenVerifier,
  userLookup: IUserLookup,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: '请先登录',
        });
      }

      const token = authHeader.slice(7);
      if (!token) {
        return res.status(401).json({
          success: false,
          message: '令牌格式无效',
        });
      }

      // 验证 Token
      const payload = tokenVerifier.verify(token);
      if (!payload) {
        return res.status(401).json({
          success: false,
          message: '令牌无效或已过期',
        });
      }

      // 查找用户
      const user = await userLookup.findById(payload.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户不存在',
        });
      }

      // 注入用户信息
      req.user = user;
      req.token = token;
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: '认证服务异常',
      });
    }
  };
}

/**
 * 创建可选认证中间件
 *
 * 有 Token 就验证并注入用户信息，没有也不阻止。
 */
export function createOptionalAuthMiddleware(
  tokenVerifier: ITokenVerifier,
  userLookup: IUserLookup,
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.slice(7);
      const payload = tokenVerifier.verify(token);
      if (!payload) return next();

      const user = await userLookup.findById(payload.userId);
      if (!user) return next();

      req.user = user;
      req.token = token;
      next();
    } catch {
      // 可选认证失败不阻止
      next();
    }
  };
}

/**
 * 创建角色鉴权中间件
 *
 * @param allowedRoles 允许的角色列表
 */
export function createRoleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '请先登录',
      });
    }

    const userRole = req.user.role as string;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }

    return next();
  };
}

/** 管理员中间件（快捷方式） */
export function requireAdmin() {
  return createRoleMiddleware(['admin', 'super_admin']);
}

// ============================================================================
// 简化认证（Mock 环境专用）
// ============================================================================

/** 简化的会话用户类型 */
export interface MockUser {
  userId: string;
  userName: string;
  role: 'admin' | 'user' | 'super_admin';
}

/**
 * 模拟的会话状态（单例），供测试和开发注入登录用户。
 *
 * @example
 * ```ts
 * authSession.register('test-token', { userId: '1', userName: 'admin', role: 'admin' });
 * // 之后携带 Authorization: Bearer test-token 访问
 * ```
 */
class AuthSession {
  private users: Map<string, MockUser> = new Map();
  private currentUser: MockUser | null = null;

  /** 注册一个 token -> user 映射 */
  register(token: string, user: MockUser) { this.users.set(token, user); }

  /** 手动设置当前用户（用于直接注入测试场景） */
  setCurrent(user: MockUser | null) { this.currentUser = user; }

  /** 通过 token 查找用户 */
  findByToken(token: string): MockUser | null { return this.users.get(token) ?? null; }

  /** 清空会话 */
  clear() { this.users.clear(); this.currentUser = null; }
}

export const authSession = new AuthSession();

/**
 * 简化认证中间件（Mock 环境）。
 *
 * - 检查 `Authorization: Bearer <token>` 或 `x-auth-token` header
 * - 通过 `authSession` 查找用户；测试可调用 `authSession.register(...)` 注入
 * - `role` 可选，配置后检查 `req.user.role`
 */
export function requireAuth(options: { role?: 'admin' | 'user' | 'super_admin' } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : (req.headers['x-auth-token'] as string) || null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '请先登录',
        timestamp: new Date().toISOString(),
      });
    }

    const user = authSession.findByToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '令牌无效或已过期',
        timestamp: new Date().toISOString(),
      });
    }

    // 检查角色
    if (options.role) {
      if (options.role === 'admin' && user.role !== 'admin' && user.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: '需要管理员权限', timestamp: new Date().toISOString() });
      }
      if (options.role === 'super_admin' && user.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: '需要超级管理员权限', timestamp: new Date().toISOString() });
      }
      // 'user' 角色仅要求已登录（前面已通过 token 校验保证 user 存在）
      if (options.role === 'user' && !user) {
        return res.status(403).json({ success: false, message: '无权限', timestamp: new Date().toISOString() });
      }
    }

    req.user = user;
    return next();
  };
}

/** 可选认证中间件（有 token 则挂 user，没有也不阻止） */
export function optionalAuth() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : (req.headers['x-auth-token'] as string) || null;
    if (token) {
      const user = authSession.findByToken(token);
      if (user) req.user = user;
    }
    return next();
  };
}
