import type { Request, Response, NextFunction } from 'express';
import { BusinessError, logger } from '@yunshu/server-core';

interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  column?: string;
  constraint?: string;
  table?: string;
  detail?: string;
}

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
  } else if (code === '23503') {
    const tableName = err.table ?? '关联记录';
    message = `${tableName}关联数据不存在，无法完成操作`;
    statusCode = 409;
  } else if (code === '23502') {
    const field = err.column ?? '字段';
    message = `${field}不能为空`;
    statusCode = 400;
  } else if (code === '23514') {
    message = '数据不满足约束条件';
    statusCode = 400;
  } else if (code === '42P01') {
    message = `数据表${err.table ?? ''}不存在，请联系管理员`;
    statusCode = 500;
  } else if (code === '42703') {
    message = `字段${err.column ?? ''}不存在`;
    statusCode = 400;
  } else if (code === '22P02') {
    message = '数据格式无效';
    statusCode = 400;
  } else if (code === '22001') {
    message = '数据长度超出限制';
    statusCode = 400;
  } else if (code.startsWith('23')) {
    message = '数据完整性约束冲突';
    statusCode = 400;
  } else if (code.startsWith('42')) {
    message = '数据库查询语法错误';
    statusCode = 500;
  }

  const e = new Error(message) as AppError;
  e.statusCode = statusCode;
  e.isOperational = true;
  e.name = 'PostgresError';
  return e;
}

function handleJWTError(error: unknown): AppError {
  const err = error as Error;
  const message = err.name === 'TokenExpiredError' ? '令牌已过期，请重新登录' : '令牌无效，请重新登录';
  const e = new Error(message) as AppError;
  e.statusCode = 401;
  e.isOperational = true;
  e.name = 'JWTError';
  return e;
}

function handleUploadError(error: unknown): AppError {
  const err = error as Error & { code?: string };
  const messages: Record<string, [string, number]> = {
    LIMIT_FILE_SIZE: ['文件大小超出限制', 413],
    LIMIT_FILE_COUNT: ['文件数量超出限制', 413],
    LIMIT_UNEXPECTED_FILE: ['不支持的文件类型', 400],
    LIMIT_PART_COUNT: ['表单字段过多', 400],
  };
  const [msg, status] = messages[err.code ?? ''] ?? ['文件上传失败', 400];
  const e = new Error(msg) as AppError;
  e.statusCode = status;
  e.isOperational = true;
  e.name = 'UploadError';
  return e;
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function globalErrorHandler() {
  return (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    const err = error as Error & Partial<AppError>;

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

    let processed: AppError;
    const errCode = (error as Error & { code?: string })?.code;

    if (
      (typeof errCode === 'string' && /^[0-9]{5}$/.test(errCode)) ||
      err.name === 'PostgresError' ||
      err.name === 'DatabaseError' ||
      err.name?.includes('Postgres') ||
      err.name?.includes('postgres')
    ) {
      processed = handlePostgresError(error);
    } else if (
      err.name?.includes('JsonWebToken') ||
      err.name?.includes('Token') ||
      err.name?.includes('NotBefore')
    ) {
      processed = handleJWTError(error);
    } else if (
      (error as Error & { code?: string }).code?.startsWith?.('LIMIT_') ||
      err.message?.includes('Multer')
    ) {
      processed = handleUploadError(error);
    } else {
      processed = new Error(err.message || '服务器内部错误') as AppError;
      processed.statusCode = err.statusCode || 500;
      processed.isOperational = err.isOperational || false;
      processed.name = err.name || 'UnknownError';
    }

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

    // 生产环境：operational 业务错误可返回原始 message，其它一律统一提示，避免泄露内部信息
    logger.error('[严重错误]', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });

    if (processed.isOperational) {
      return res.status(processed.statusCode).json({
        success: false,
        message: processed.message,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      timestamp: new Date().toISOString(),
    });
  };
}

export function notFoundHandler() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const error = new Error(`路由 ${req.method} ${req.originalUrl} 不存在`) as AppError;
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
  };
}

export function rateLimitHandler() {
  return (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试',
      timestamp: new Date().toISOString(),
    });
  };
}
