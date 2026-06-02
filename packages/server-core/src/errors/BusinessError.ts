/**
 * 后端核心 — 业务错误体系
 *
 * 提供标准化的错误码枚举和业务错误类，
 * 支持错误码到 HTTP 状态码的映射。
 *
 * @module @yunshu/server-core/errors
 */

// ============================================================================
// 错误码枚举
// ============================================================================

/**
 * 标准化错误码
 *
 * 命名规则：语义描述，UPPER_SNAKE_CASE。
 * 所有 Service 层和方法装饰器统一使用此枚举。
 */
export enum ErrorCode {
  // 通用错误
  /** 未知错误 */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  /** 未找到 */
  NOT_FOUND = 'NOT_FOUND',
  /** 已存在 */
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  /** 参数验证失败 */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** 操作不允许 */
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',

  // 认证授权
  /** 未认证 */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** Token 过期 */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** Token 无效 */
  TOKEN_INVALID = 'TOKEN_INVALID',
  /** 权限不足 */
  FORBIDDEN = 'FORBIDDEN',
  /** 账户已禁用 */
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',

  // 数据相关
  /** 数据冲突 */
  CONFLICT = 'CONFLICT',
  /** 数据已被修改 */
  VERSION_CONFLICT = 'VERSION_CONFLICT',
  /** 数据库操作失败 */
  DATABASE_ERROR = 'DATABASE_ERROR',

  // 业务相关
  /** 超出限制 */
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  /** 资源不可用 */
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  /** 外部服务错误 */
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // 文件相关
  /** 文件太大 */
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  /** 不支持的文件类型 */
  FILE_TYPE_NOT_SUPPORTED = 'FILE_TYPE_NOT_SUPPORTED',
  /** 文件上传失败 */
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
}

// ============================================================================
// 错误码 → HTTP 状态码映射
// ============================================================================

const ERROR_TO_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.UNKNOWN_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.ALREADY_EXISTS]: 409,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.OPERATION_NOT_ALLOWED]: 403,

  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.TOKEN_INVALID]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.ACCOUNT_DISABLED]: 403,

  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.VERSION_CONFLICT]: 409,
  [ErrorCode.DATABASE_ERROR]: 500,

  [ErrorCode.LIMIT_EXCEEDED]: 429,
  [ErrorCode.RESOURCE_UNAVAILABLE]: 503,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,

  [ErrorCode.FILE_TOO_LARGE]: 413,
  [ErrorCode.FILE_TYPE_NOT_SUPPORTED]: 415,
  [ErrorCode.FILE_UPLOAD_FAILED]: 500,
};

/**
 * 根据错误码获取对应的 HTTP 状态码
 */
export function getStatusCodeByErrorCode(code: ErrorCode): number {
  return ERROR_TO_STATUS[code] ?? 500;
}

// ============================================================================
// 业务错误类
// ============================================================================

/**
 * 业务错误
 *
 * 用于表示预期的业务逻辑错误，与程序错误（如 TypeError）区分。
 * 全局错误处理中间件会据此决定返回的 HTTP 状态码和消息格式。
 *
 * @example
 * ```typescript
 * throw new BusinessError(ErrorCode.NOT_FOUND, '用户不存在');
 * throw new BusinessError(ErrorCode.VALIDATION_ERROR, '邮箱格式不正确', { field: 'email' });
 * ```
 */
export class BusinessError extends Error {
  /** 错误码 */
  public readonly code: ErrorCode;
  /** HTTP 状态码（自动映射） */
  public readonly statusCode: number;
  /** 错误详情（可选，如字段级错误） */
  public readonly details?: unknown;
  /** 是否为操作性错误（可预见的业务错误） */
  public readonly isOperational: boolean;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.statusCode = getStatusCodeByErrorCode(code);
    this.details = details;
    this.isOperational = true;

    // 保持正确的原型链
    Object.setPrototypeOf(this, BusinessError.prototype);

    // 生产环境不捕获堆栈追踪
    if (process.env.NODE_ENV !== 'production') {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 转换为 JSON 格式（用于日志和响应）
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      isOperational: this.isOperational,
    };
  }
}
