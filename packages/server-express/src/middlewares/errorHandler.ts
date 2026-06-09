/**
 * Express 适配器 — 全局错误处理中间件
 *
 * 全类型错误处理，覆盖 MongoDB、JWT、文件上传、网络错误等场景。
 * 支持 BusinessError 和普通 Error，生产环境自动隐藏内部错误详情。
 *
 * @module @yunshu/server-express/middlewares/errorHandler
 */

import type { Request, Response, NextFunction } from 'express';
import { BusinessError } from '@yunshu/server-core';

// ============================================================================
// 类型定义
// ============================================================================

interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  path?: string;
  value?: unknown;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

// ============================================================================
// 错误分类处理
// ============================================================================

/**
 * 处理 MongoDB 相关错误
 */
function handleMongoError(error: unknown): AppError {
  const err = error as Error & {
    code?: number | string;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { message: string }>;
    path?: string;
    value?: unknown;
  };

  let message = '数据库操作失败';
  let statusCode = 500;

  // 重复键 E11000
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0];
    const fieldNames: Record<string, string> = {
      email: '邮箱', username: '用户名', phone: '手机号',
      title: '标题', name: '名称',
    };
    const fieldName = fieldNames[field ?? ''] ?? field;
    message = `${fieldName}已存在`;
    statusCode = 409;
  }
  // 验证错误
  else if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors ?? {}).map((v) => v.message);
    message = `数据验证失败: ${errors.join(', ')}`;
    statusCode = 400;
  }
  // 类型转换错误
  else if (err.name === 'CastError') {
    const fieldNames: Record<string, string> = {
      _id: 'ID', userId: '用户ID', categoryId: '分类ID',
    };
    message = `无效的${fieldNames[err.path ?? ''] ?? err.path}`;
    statusCode = 400;
  }

  return { ...new Error(message), statusCode, isOperational: true, name: 'MongoError' };
}

/**
 * 处理 JWT 相关错误
 */
function handleJWTError(error: unknown): AppError {
  const err = error as Error;
  if (err.name === 'TokenExpiredError') {
    return { ...new Error('令牌已过期，请重新登录'), statusCode: 401, isOperational: true, name: 'JWTError' };
  }
  return { ...new Error('令牌无效，请重新登录'), statusCode: 401, isOperational: true, name: 'JWTError' };
}

/**
 * 处理文件上传错误
 */
function handleUploadError(error: unknown): AppError {
  const err = error as Error & { code?: string };
  const messages: Record<string, [string, number]> = {
    LIMIT_FILE_SIZE: ['文件大小超出限制', 413],
    LIMIT_FILE_COUNT: ['文件数量超出限制', 413],
    LIMIT_UNEXPECTED_FILE: ['不支持的文件类型', 400],
    LIMIT_PART_COUNT: ['表单字段过多', 400],
  };
  const [msg, status] = messages[err.code ?? ''] ?? ['文件上传失败', 400];
  return { ...new Error(msg), statusCode: status, isOperational: true, name: 'UploadError' };
}

// ============================================================================
// 异步错误包装器
// ============================================================================

/**
 * 异步路由处理器包装器
 *
 * 自动捕获异步路由中的 Promise rejection 并传递给错误处理中间件。
 *
 * @example
 * ```typescript
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.findAll();
 *   res.json(users);
 * }));
 * ```
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ============================================================================
// 全局错误处理中间件
// ============================================================================

/**
 * 全局错误处理中间件
 *
 * 处理所有未捕获的错误，根据错误类型返回对应的 HTTP 状态码和消息。
 * 开发环境返回详细错误信息，生产环境隐藏内部细节。
 */
export function globalErrorHandler() {
  return (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    const err = error as Error & Partial<AppError>;

    // 1. 优先处理 BusinessError
    if (error instanceof BusinessError) {
      const response: Record<string, unknown> = {
        success: false,
        message: error.message,
        errorCode: error.code,
        timestamp: new Date().toISOString(),
      };
      if (error.details !== undefined) response.details = error.details;

      if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
      }

      return res.status(error.statusCode).json(response);
    }

    // 2. 处理各类错误
    let processed: AppError;

    if (err.name?.includes('Mongo') || err.name === 'ValidationError' || (typeof (err as any).code === 'number' && (err as any).code === 11000)) {
      processed = handleMongoError(error);
    } else if (err.name?.includes('JsonWebToken') || err.name?.includes('Token')) {
      processed = handleJWTError(error);
    } else if ((err as any).code?.startsWith?.('LIMIT_') || err.message?.includes('Multer')) {
      processed = handleUploadError(error);
    } else {
      processed = {
        ...new Error(err.message || '服务器内部错误'),
        statusCode: err.statusCode || 500,
        isOperational: err.isOperational || false,
        name: err.name || 'UnknownError',
      };
    }

    // 3. 开发环境：返回详细错误
    if (process.env.NODE_ENV === 'development') {
      return res.status(processed.statusCode).json({
        success: false,
        message: processed.message,
        error: {
          name: processed.name,
          stack: processed.stack,
          statusCode: processed.statusCode,
        },
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        method: req.method,
      });
    }

    // 4. 生产环境：只返回安全信息
    if (processed.isOperational) {
      return res.status(processed.statusCode).json({
        success: false,
        message: processed.message,
        timestamp: new Date().toISOString(),
      });
    }

    // 程序错误不泄露详细信息
    console.error('[严重错误]', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试',
      timestamp: new Date().toISOString(),
    });
  };
}

/**
 * 404 中间件
 */
export function notFoundHandler() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const error = new Error(`路由 ${req.method} ${req.originalUrl} 不存在`) as AppError;
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
  };
}

/**
 * 速率限制处理中间件
 */
export function rateLimitHandler() {
  return (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试',
      retryAfter: 60,
      timestamp: new Date().toISOString(),
    });
  };
}
