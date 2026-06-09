/**
 * 云枢中台 — Express 适配器
 *
 * 提供 BaseController + 全类型错误处理 + 认证授权中间件。
 * 与 @yunshu/server-core 配合使用。
 *
 * @module @yunshu/server-express
 */

// ============================================================================
// BaseController
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

export {
  tenantMiddleware,
  tenantContext,
  getCurrentTenantId,
  clearTenantContext,
} from './middlewares/tenant';

export type { ITokenVerifier, IUserLookup } from './middlewares/auth';
