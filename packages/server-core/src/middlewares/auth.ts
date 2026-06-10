/**
 * 云枢中台 — JWT 认证中间件（框架无关）。
 *
 * 本文件导出的 `verifyToken` / `optionalVerifyToken` / `requireRole`
 * 提供了对 "Authorization: Bearer <token>" 头的解析与校验，
 * 签名方式与 `@yunshu/server-core/src/utils/jwt.ts` 保持一致（HS256）。
 *
 * 对外暴露的处理器签名为：
 *   `(req, res, next) => Promise<void>`
 * 可在 Express / Fastify 包装器中直接使用。
 *
 * @module @yunshu/server-core/middlewares/auth
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';

// ============================================================================
// 类型定义
// ============================================================================

/** 最简请求形状 —— 兼容 Node 原生 IncomingMessage 与 Express Request。 */
export interface AuthRequestLike extends IncomingMessage {
  /** 挂载解析后的 payload */
  user?: Record<string, unknown>;
  /** 原始 token */
  token?: string;
}

/** 最简响应形状 */
export interface AuthResponseLike extends ServerResponse {
  /** 可选的 Express 风格 helper */
  status?: (code: number) => AuthResponseLike;
  /** 可选的 Express 风格 helper */
  json?: (body: unknown) => void;
}

/** next 函数签名 */
export type AuthNext = (err?: unknown) => void;

/** Token 验证函数 */
export type TokenVerifier = (token: string) => Record<string, unknown> | null;

/** JWT 认证中间件配置 */
export interface AuthMiddlewareConfig {
  /** 签名密钥；不传则默认回退到 process.env.JWT_SECRET */
  secret?: string;
  /** 自定义 token 验证器；不传则使用内置 HMAC-SHA256 实现 */
  verifier?: TokenVerifier;
  /** 自定义 token 提取器；不传则默认解析 Authorization 头 */
  tokenExtractor?: (req: AuthRequestLike) => string | null;
}

// ============================================================================
// 内部工具：Base64URL + HMAC-SHA256（零依赖，零外部类型）
// ============================================================================

function base64UrlEncode(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): Buffer {
  if (!input) return Buffer.alloc(0);
  let padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  if (pad) padded += '='.repeat(4 - pad);
  return Buffer.from(padded, 'base64');
}

function safeJwtParts(token: string): [string, string, string] | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const a = parts[0];
  const b = parts[1];
  const c = parts[2];
  if (!a || !b || !c) return null;
  return [a, b, c];
}

/**
 * 内置 JWT 解析器（HS256）。与 `utils/jwt.ts` 中的 signToken 互操作。
 */
function builtInVerifier(secret: string): TokenVerifier {
  return (token: string) => {
    if (typeof token !== 'string') return null;
    const parts = safeJwtParts(token);
    if (!parts) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    try {
      // 1) 校验签名
      const signingInput = `${headerB64}.${payloadB64}`;
      const expected = crypto.createHmac('sha256', secret).update(signingInput, 'utf8').digest();
      const actual = base64UrlDecode(signatureB64);
      if (expected.length !== actual.length) return null;
      if (!crypto.timingSafeEqual(expected, actual)) return null;

      // 2) header 校验
      const header = JSON.parse(base64UrlDecode(headerB64).toString('utf8')) as { alg?: string };
      if (header.alg !== 'HS256') return null;

      // 3) payload 解析与过期校验
      const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as Record<
        string,
        unknown
      >;

      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp === 'number' && payload.exp <= now) return null;
      if (typeof payload.nbf === 'number' && payload.nbf > now) return null;

      return payload;
    } catch {
      return null;
    }
  };
}

/**
 * 默认 token 提取器：Authorization: Bearer <token>。
 */
function defaultTokenExtractor(req: AuthRequestLike): string | null {
  const header = req.headers['authorization'];
  if (!header || typeof header !== 'string') return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match ? (match[1] ?? null) : null;
}

/**
 * 兼容两种风格的 JSON 写入 helper。
 */
function sendJson(res: AuthResponseLike, status: number, body: unknown): void {
  const statusFn = res.status;
  const jsonFn = res.json;
  if (statusFn && jsonFn) {
    // Express 风格：status() 返回 this（链式调用）。
    // 由于类型上 status() 的返回值不稳定，这里显式先调用 status，
    // 再单独调用 json，避免 TypeScript 对链式调用做可选属性收缩。
    statusFn(status);
    jsonFn(body);
    return;
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

// ============================================================================
// 导出：verifyToken 中间件工厂
// ============================================================================

/**
 * 创建强制 JWT 认证中间件。
 *
 * 缺失或无效 token 时返回 401；成功时将 `req.user` 与 `req.token` 注入。
 */
export function verifyToken(config: AuthMiddlewareConfig = {}) {
  const secret = config.secret ?? process.env.JWT_SECRET ?? '';
  const verifier: TokenVerifier = config.verifier ?? builtInVerifier(secret);
  const extractor = config.tokenExtractor ?? defaultTokenExtractor;

  return async (req: AuthRequestLike, res: AuthResponseLike, next: AuthNext): Promise<void> => {
    try {
      const token = extractor(req);
      if (!token) {
        sendJson(res, 401, {
          success: false,
          message: '未提供认证令牌',
        });
        return;
      }

      const payload = verifier(token);
      if (!payload) {
        sendJson(res, 401, {
          success: false,
          message: '令牌无效或已过期',
        });
        return;
      }

      req.user = payload;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  };
}

// ============================================================================
// 导出：可选认证中间件
// ============================================================================

/**
 * 创建可选认证中间件。
 *
 * 即使 token 缺失或无效也不会中断请求，仅在 token 有效时挂载 `req.user`。
 */
export function optionalVerifyToken(config: AuthMiddlewareConfig = {}) {
  const secret = config.secret ?? process.env.JWT_SECRET ?? '';
  const verifier: TokenVerifier = config.verifier ?? builtInVerifier(secret);
  const extractor = config.tokenExtractor ?? defaultTokenExtractor;

  return async (req: AuthRequestLike, res: AuthResponseLike, next: AuthNext): Promise<void> => {
    try {
      const token = extractor(req);
      if (!token) {
        next();
        return;
      }
      const payload = verifier(token);
      if (payload) {
        req.user = payload;
        req.token = token;
      }
      next();
    } catch {
      // 可选认证：静默失败
      next();
    }
  };
}

// ============================================================================
// 导出：角色鉴权中间件（依赖 verifyToken 前置）
// ============================================================================

/**
 * 基于角色的访问控制中间件。
 *
 * 需要先调用 `verifyToken` 以确保 `req.user` 已被挂载。
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequestLike, res: AuthResponseLike, next: AuthNext): void => {
    const user = req.user as Record<string, unknown> | undefined;
    if (!user) {
      sendJson(res, 401, { success: false, message: '请先登录' });
      return;
    }

    const role = user.role as string | string[] | undefined;
    const roles: string[] = Array.isArray(role) ? role : typeof role === 'string' ? [role] : [];

    const hasAccess = roles.some((r) => allowedRoles.includes(String(r)));
    if (!hasAccess) {
      sendJson(res, 403, { success: false, message: '权限不足' });
      return;
    }
    next();
  };
}

/** admin 角色快速校验 */
export function requireAdmin() {
  return requireRole(['admin', 'super_admin']);
}

// ============================================================================
// 便捷导出：基于默认环境的中间件工厂
// ============================================================================

/**
 * 使用默认配置（JWT_SECRET 环境变量）创建常用中间件组合。
 */
export function createAuthMiddlewares(config: AuthMiddlewareConfig = {}) {
  return {
    verifyToken: verifyToken(config),
    optionalVerifyToken: optionalVerifyToken(config),
    requireRole,
    requireAdmin,
  };
}
