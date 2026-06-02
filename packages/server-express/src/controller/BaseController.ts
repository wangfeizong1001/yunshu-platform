/**
 * Express 适配器 — BaseController
 *
 * 提供统一的 API 响应方法，确保所有接口的响应格式一致。
 *
 * 响应格式：
 * - 成功：{ success: true, data: T, message?: string, timestamp: string }
 * - 分页：{ success: true, data: T[], pagination: {...}, message?: string, timestamp: string }
 * - 错误：{ success: false, message: string, errorCode?: string, details?: unknown, timestamp: string }
 *
 * @module @yunshu/server-express/controller
 */

import type { Response } from 'express';
import type { ServiceResult, PaginatedResult } from '@yunshu/shared';
import { BusinessError } from '@yunshu/server-core';

// ============================================================================
// 响应类型
// ============================================================================

/** API 成功响应格式 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/** API 分页响应格式 */
export interface ApiPaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  message?: string;
  timestamp: string;
}

/** API 错误响应格式 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  details?: unknown;
  timestamp: string;
}

/** 统一的 API 响应类型 */
export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiPaginatedResponse<T>
  | ApiErrorResponse;

// ============================================================================
// BaseController
// ============================================================================

/**
 * 基础控制器抽象类
 *
 * 所有 Controller 应继承此类，使用统一的响应方法。
 *
 * @example
 * ```typescript
 * class UserController extends BaseController {
 *   async getUser(req: Request, res: Response) {
 *     const user = await userService.findById(req.params.id);
 *     return this.success(res, user, '获取用户成功');
 *   }
 * }
 * ```
 */
export abstract class BaseController {
  /**
   * 发送成功响应
   */
  protected success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
  ): Response<ApiSuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 发送创建成功响应 (201)
   */
  protected created<T>(
    res: Response,
    data: T,
    message = '创建成功',
  ): Response<ApiSuccessResponse<T>> {
    return this.success(res, data, message, 201);
  }

  /**
   * 发送无内容响应 (204)
   */
  protected noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * 发送分页响应
   */
  protected paginate<T>(
    res: Response,
    result: PaginatedResult<T>,
    message?: string,
  ): Response<ApiPaginatedResponse<T>> {
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 发送错误响应
   */
  protected error(
    res: Response,
    error: Error | BusinessError | string,
    statusCode?: number,
  ): Response<ApiErrorResponse> {
    // BusinessError
    if (error instanceof BusinessError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errorCode: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      });
    }

    // 普通 Error
    if (error instanceof Error) {
      return res.status(statusCode ?? 500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    // 字符串
    return res.status(statusCode ?? 500).json({
      success: false,
      message: error,
      timestamp: new Date().toISOString(),
    });
  }

  // ========================================================================
  // 便捷错误方法
  // ========================================================================

  /** 400 — 请求参数错误 */
  protected badRequest(res: Response, message = '请求参数错误', details?: unknown) {
    return res.status(400).json({
      success: false, message, details, timestamp: new Date().toISOString(),
    });
  }

  /** 401 — 未认证 */
  protected unauthorized(res: Response, message = '请先登录') {
    return res.status(401).json({
      success: false, message, timestamp: new Date().toISOString(),
    });
  }

  /** 403 — 权限不足 */
  protected forbidden(res: Response, message = '没有权限执行此操作') {
    return res.status(403).json({
      success: false, message, timestamp: new Date().toISOString(),
    });
  }

  /** 404 — 资源不存在 */
  protected notFound(res: Response, message = '请求的资源不存在') {
    return res.status(404).json({
      success: false, message, timestamp: new Date().toISOString(),
    });
  }

  /** 409 — 资源冲突 */
  protected conflict(res: Response, message = '资源冲突') {
    return res.status(409).json({
      success: false, message, timestamp: new Date().toISOString(),
    });
  }

  /** 500 — 服务器错误 */
  protected serverError(res: Response, message = '服务器内部错误') {
    return res.status(500).json({
      success: false, message, timestamp: new Date().toISOString(),
    });
  }

  // ========================================================================
  // ServiceResult 处理
  // ========================================================================

  /**
   * 处理 Service 层返回的 ServiceResult
   *
   * 根据 result.success 自动判断成功或失败。
   */
  protected handleResult<T>(
    res: Response,
    result: ServiceResult<T>,
    successStatus = 200,
  ): Response {
    if (result.success) {
      return res.status(successStatus).json(result.data);
    }

    const error = result.error;
    return res.status(400).json({
      success: false,
      message: error?.message ?? result.message ?? '操作失败',
      errorCode: error?.code,
      timestamp: new Date().toISOString(),
    });
  }
}
