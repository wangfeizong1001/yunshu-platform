/**
 * 云枢中台 — Express 适配器主入口
 *
 * 功能:
 *  1. 作为模块导出 BaseController、中间件、路由、应用工厂
 *  2. 作为 CLI 可直接启动 HTTP 服务器 (node index.js)
 *
 * @module @yunshu/server-express
 */

// ============================================================================
// BaseController & 类型
// ============================================================================

export { BaseController } from './controller/BaseController';
export type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
  ApiResponse,
} from './controller/BaseController';

// ============================================================================
// 中间件
// ============================================================================

export {
  asyncHandler,
  globalErrorHandler,
  notFoundHandler,
  rateLimitHandler,
} from './middlewares/errorHandler';

export {
  createAuthMiddleware,
  createOptionalAuthMiddleware,
  createRoleMiddleware,
  requireAdmin,
} from './middlewares/auth';

export type { ITokenVerifier, IUserLookup } from './middlewares/auth';

// ----------------------------------------------------------------------------
// 便捷别名：与其它包保持一致的命名风格
//   - authMiddleware  → 等同于 createAuthMiddleware 返回的强制认证
//   - optionalAuthMiddleware → 等同于可选认证
//   注意：需要调用方显式构造 token verifier 后使用。
// ----------------------------------------------------------------------------

export {
  createAuthMiddleware as authMiddleware,
  createOptionalAuthMiddleware as optionalAuthMiddleware,
} from './middlewares/auth';

// ============================================================================
// 请求限流中间件
// ============================================================================

export {
  createRateLimitMiddleware,
  authRateLimit,
  defaultRateLimit,
} from './middlewares/rateLimit';
export type { RateLimitOptions } from './middlewares/rateLimit';

// ============================================================================
// 文件上传安全中间件
// ============================================================================

export {
  createUploadMiddleware,
  defaultUpload,
} from './middlewares/uploadGuard';
export type { UploadMiddlewareOptions } from './middlewares/uploadGuard';

// ============================================================================
// Sentry 监控中间件
// ============================================================================

export {
  initSentry,
  sentryRequestHandler,
  sentryErrorHandler,
  setupSentryExpress,
} from './middlewares/sentry';

// ============================================================================
// 应用工厂
// ============================================================================

import { createApp, startServer } from './app';
import { createRouter, registerRoutes } from './routes';

export { createApp, startServer } from './app';
export { createRouter, registerRoutes } from './routes';

// ============================================================================
// 系统模块控制器
// ============================================================================

export * as system from './modules/system';

// ============================================================================
// 监控模块控制器
// ============================================================================

export * as monitor from './modules/monitor';

// ============================================================================
// 自动启动（当此文件作为脚本直接执行时）
// ============================================================================

if (require.main === module) {
  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';
  // eslint-disable-next-line no-console
  console.log(`[startServer] 启动服务于 ${host}:${port} (env=${process.env.NODE_ENV ?? 'development'})`);
  startServer(port, host);
}
