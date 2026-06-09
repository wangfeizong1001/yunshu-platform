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
  BusinessError,
  createBusinessError,
} from './middlewares/errorHandler';

export {
  createAuthMiddleware,
  createOptionalAuthMiddleware,
  createRoleMiddleware,
  requireAdmin,
} from './middlewares/auth';

export {
  tenantMiddleware,
  tenantContext,
  getCurrentTenantId,
  clearTenantContext,
} from './middlewares/tenant';

export type { ITokenVerifier, IUserLookup } from './middlewares/auth';

// ============================================================================
// 应用工厂
// ============================================================================

export { createApp, startServer } from './app';
export { createRouter, registerRoutes } from './routes';

// ============================================================================
// 自动启动（当此文件作为脚本直接执行时）
// ============================================================================
// 通过 require.main === module 检查（CommonJS）
// 在 ESM 中可用:
//   node --experimental-vm-modules --loader ts-node/esm packages/server-express/dist/index.js
// ============================================================================

if (require.main === module) {
  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';
  // eslint-disable-next-line no-console
  console.log(`[startServer] 启动服务于 ${host}:${port} (env=${process.env.NODE_ENV ?? 'development'})`);
  startServer(port, host);
}
