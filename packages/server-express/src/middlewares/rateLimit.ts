/**
 * 速率限制中间件
 *
 * 使用 express-rate-limit 提供多层次的请求速率限制，
 * 防止暴力破解、爬虫、DoS 攻击等恶意行为。
 *
 * 包含三类中间件：
 *  1. loginLimiter    — 登录接口专用（1 分钟最多 5 次）
 *  2. apiLimiter      — 通用 API 接口（1 分钟最多 60 次）
 *  3. strictLimiter   — 敏感操作专用（1 分钟最多 3 次）
 *
 * @module @yunshu/server-express/middlewares/rateLimit
 */

import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * 统一构建速率限制错误响应（符合 ApiResponse 结构）
 */
function buildRateLimitResponse(
  _req: Request,
  res: Response,
  next: unknown,
  options: { statusCode: number; message: string },
): void {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
    errorCode: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  });
}

/**
 * 登录接口速率限制
 *
 * - 1 分钟内最多 5 次尝试
 * - 防止暴力破解密码
 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
  message: '登录失败次数过多，请 1 分钟后再试',
  handler: (req, res, next, options) =>
    buildRateLimitResponse(req, res, next, {
      statusCode: options.statusCode,
      message: '登录失败次数过多，请 1 分钟后再试',
    }),
});

/**
 * 通用 API 接口速率限制
 *
 * - 1 分钟内最多 60 次请求
 * - 对所有公开/认证接口起基础防护作用
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过于频繁，请稍后再试',
  handler: (req, res, next, options) =>
    buildRateLimitResponse(req, res, next, {
      statusCode: options.statusCode,
      message: '请求过于频繁，请稍后再试',
    }),
});

/**
 * 敏感操作速率限制
 *
 * - 1 分钟内最多 3 次请求
 * - 适用于修改密码、发送短信验证码、删除账户等关键操作
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: '操作过于频繁，请 1 分钟后再试',
  handler: (req, res, next, options) =>
    buildRateLimitResponse(req, res, next, {
      statusCode: options.statusCode,
      message: '操作过于频繁，请 1 分钟后再试',
    }),
});
