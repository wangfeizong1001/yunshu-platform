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
      /** 当前登录用户 */
      user?: Record<string, unknown>;
      /** 原始 Token */
      token?: string;
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

    const userRole = (req.user as Record<string, unknown>).role as string;
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
