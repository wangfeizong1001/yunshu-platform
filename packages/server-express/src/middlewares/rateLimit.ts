/**
 * 云枢中台 — 请求限流中间件
 *
 * 基于 express-rate-limit，提供：
 *  1. 默认限流策略（用于全局挂载）
 *  2. 更严格的 auth 限流（用于登录/注册接口，防暴力破解）
 *  3. 可按需 createRateLimitMiddleware(options) 定制
 *
 * 命中限流后返回 429 并记录 warn 级别日志。
 *
 * @module @yunshu/server-express/middlewares/rateLimit
 */

import {
  rateLimit,
  type RateLimitRequestHandler,
  type Options as RateLimitOptions,
} from 'express-rate-limit';

export type { RateLimitOptions };
import { logger } from '@yunshu/server-core';

/** 默认通用策略：15 分钟 100 次 */
const DEFAULT_OPTIONS: Partial<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // 在响应头返回 X-RateLimit-*
  legacyHeaders: false,
  handler: (req, _res) => {
    logger.warn('[rate-limit] 请求过于频繁', { ip: req.ip, method: req.method, url: req.originalUrl });
    // 429 + 统一响应结构由全局 errorHandler 处理（本函数作为 handler 时需自行发送）
    // 这里直接抛出由全局中间件统一处理，保持一致的错误格式
    const err = new Error('请求过于频繁，请稍后再试') as Error & { code?: string; statusCode?: number };
    err.code = 'TOO_MANY_REQUESTS';
    err.statusCode = 429;
    throw err;
  },
};

/** 创建自定义限流中间件 */
export function createRateLimitMiddleware(
  options: Partial<RateLimitOptions> = {},
): RateLimitRequestHandler {
  return rateLimit({
    ...DEFAULT_OPTIONS,
    ...options,
  } as RateLimitOptions);
}

/** 登录等认证接口的严格策略：15 分钟 5 次 */
export const authRateLimit: RateLimitRequestHandler = createRateLimitMiddleware({
  max: 5,
  windowMs: 15 * 60 * 1000,
});

/** 默认实例（可直接 app.use(defaultRateLimit)） */
export const defaultRateLimit: RateLimitRequestHandler = createRateLimitMiddleware();
