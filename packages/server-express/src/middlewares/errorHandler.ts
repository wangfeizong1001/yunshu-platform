/**
 * Express 适配器 — 全局错误处理中间件
 *
 * 全类型错误处理，覆盖 PostgreSQL、JWT、文件上传、网络错误等场景。
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
  column?: string;
  constraint?: string;
  table?: string;
  detail?: string;
}

// ============================================================================
// 错误分类处理
// ============================================================================

/**
 * 处理 PostgreSQL 相关错误
 *
 * PostgreSQL 错误码参考:
 * - 23505: unique_violation (唯一约束冲突)
 * - 23503: foreign_key_violation (外键约束冲突)
 * - 23502: not_null_violation (非空约束冲突)
 * - 23514: check_violation (检查约束失败)
 * - 42P01: undefined_table (表不存在)
 * - 42703: undefined_column (列不存在)
 * - 22P02: invalid_text_representation (无效文本格式)
 * - 22001: string_data_right_truncation (字符串过长)
 */
function handlePostgresError(error: unknown): AppError {
  const err = error as Error & {
    code?: string;
    column?: string;
    constraint?: string;
    table?: string;
    detail?: string;
  };

  let message = '数据库操作失败';
  let statusCode = 500;

  const code = err.code ?? '';

  // 23505 — 唯一约束冲突（例如重复用户名）
  if (code === '23505') {
    const field = err.column
      ?? ((err.constraint ?? '').replace(/.*_(.*)_key/, '$1') || '字段');
    const fieldNames: Record<string, string> = {
      email: '邮箱', username: '用户名', phone: '手机号',
      title: '标题', name: '名称', code: '编码',
    };
    const fieldName = fieldNames[field] ?? field;
    message = `${fieldName}已存在`;
    statusCode = 409;
  }
  // 23503 — 外键约束冲突（例如引用不存在的记录）
  else if (code === '23503') {
    const tableName = err.table ?? '关联记录';
    message = `${tableName}关联数据不存在，无法完成操作`;
    statusCode = 409;
  }
  // 23502 — 非空约束冲突
  else if (code === '23502') {
    const field = err.column ?? '字段';
    message = `${field}不能为空`;
    statusCode = 400;
  }
  // 23514 — 检查约束失败
  else if (code === '23514') {
    message = '数据不满足约束条件';
    statusCode = 400;
  }
  // 42P01 — 表不存在
  else if (code === '42P01') {
    message = `数据表${err.table ?? ''}不存在，请联系管理员`;
    statusCode = 500;
  }
  // 42703 — 列不存在
  else if (code === '42703') {
    message = `字段${err.column ?? ''}不存在`;
    statusCode = 400;
  }
  // 22P02 — 无效文本格式（例如 UUID 格式错误）
  else if (code === '22P02') {
    message = '数据格式无效';
    statusCode = 400;
  }
  // 22001 — 字符串过长
  else if (code === '22001') {
    message = '数据长度超出限制';
    statusCode = 400;
  }
  // 其他 23 类完整性约束错误
  else if (code.startsWith('23')) {
    message = '数据完整性约束冲突';
    statusCode = 400;
  }
  // 42 类语法错误
  else if (code.startsWith('42')) {
    message = '数据库查询语法错误';
    statusCode = 500;
  }

  return { ...new Error(message), statusCode, isOperational: true, name: 'PostgresError' };
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

    const errCode = (error as Error & { code?: string })?.code;

    if (
      // PostgreSQL 标准错误码 (2 位类别 + 3 位子类别)
      (typeof errCode === 'string' && /^[0-9]{5}$/.test(errCode)) ||
      // 常见驱动名称
      err.name === 'PostgresError' ||
      err.name === 'DatabaseError' ||
      // pg 库抛出的错误名称
      err.name?.includes('Postgres') ||
      err.name?.includes('postgres')
    ) {
      processed = handlePostgresError(error);
    } else if (err.name?.includes('JsonWebToken') || err.name?.includes('Token') || err.name?.includes('NotBefore')) {
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
  return (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试',
      retryAfter: 60,
      timestamp: new Date().toISOString(),
    });
  };
}
