/**
 * @yunshu/shared 模块 mock —— 为所有单元测试提供辅助函数、类型与常量。
 */

// ============================================================================
// 错误码
// ============================================================================
export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  FORBIDDEN = 'FORBIDDEN',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  CONFLICT = 'CONFLICT',
  VERSION_CONFLICT = 'VERSION_CONFLICT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_SUPPORTED = 'FILE_TYPE_NOT_SUPPORTED',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
}

// ============================================================================
// ServiceResult
// ============================================================================

export interface SuccessResult<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResult {
  success: false;
  error: { code: string; message: string };
}

export type ServiceResult<T> = SuccessResult<T> | ErrorResult;

export interface PaginatedResult<T> {
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
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export function createSuccessResult<T>(data: T, message = 'success'): SuccessResult<T> {
  return { success: true, data, message };
}

export function createErrorResult(code: string, message: string): ErrorResult {
  return { success: false, error: { code, message } };
}

export function createPaginatedResult<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page * limit < total,
    },
  };
}

// ============================================================================
// 安全 JSON
// ============================================================================

export function safeJsonParse<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export function safeJsonStringify(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return '';
  }
}

// ============================================================================
// 其他类型占位（仅用于 import 不会在运行时报错）
// ============================================================================
export type IJobCreate = Record<string, unknown>;
export type IJobUpdate = Record<string, unknown>;
export type IJobExecute = Record<string, unknown>;
