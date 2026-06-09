/**
 * 云枢中台 — 共享类型和工具
 *
 * 前后端通用的类型定义、接口规范和工具函数。
 *
 * @module @yunshu/shared
 */

// ============================================================================
// API 相关类型
// ============================================================================

/**
 * 统一 API 响应格式
 *
 * 前端 HttpClient 和后端 BaseController 共用此格式，
 * 确保全栈响应结构一致。
 *
 * @template T 响应数据类型
 */
export interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  success: boolean;
  /** 响应数据（成功时） */
  data: T;
  /** 响应消息 */
  message?: string;
  /** 错误码（失败时） */
  errorCode?: string;
}

/**
 * 分页响应格式
 *
 * @template T 列表项类型
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

/**
 * 分页元信息
 */
export interface PaginationMeta {
  /** 当前页码（1-based） */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总数量 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有上一页 */
  hasPrev: boolean;
  /** 是否有下一页 */
  hasNext: boolean;
}

// ============================================================================
// 分页相关类型
// ============================================================================

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页码，1-based，默认 1 */
  page?: number;
  /** 每页数量，默认 10，最大 100 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/**
 * 分页查询结果
 *
 * @template T 数据项类型
 */
export interface PaginatedResult<T = unknown> {
  /** 数据列表 */
  data: T[];
  /** 分页元信息 */
  pagination: PaginationMeta;
}

// ============================================================================
// Service 层接口（后端用）
// ============================================================================

/**
 * Service 层统一返回结果
 *
 * 设计意图：Service 层不应该直接操作 HTTP Response，
 * 而是返回结构化结果，由 Controller 转换为 HTTP 响应。
 *
 * @template T 数据类型
 */
export interface ServiceResult<T = unknown> {
  /** 操作是否成功 */
  success: boolean;
  /** 成功时的数据 */
  data?: T;
  /** 失败时的错误信息 */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  /** 操作消息（成功/失败均有） */
  message?: string;
}

// ============================================================================
// 过滤和查询
// ============================================================================

/**
 * 通用过滤参数
 */
export interface FilterParams {
  /** 搜索关键词 */
  search?: string;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
  /** 扩展过滤条件 */
  [key: string]: unknown;
}

/**
 * 列表查询参数（分页 + 过滤）
 */
export type ListQueryParams<T extends FilterParams = FilterParams> = PaginationParams & T;

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 深度 Partial — 递归将所有属性设为可选
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * 深度 Required — 递归将所有属性设为必填
 */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

/**
 * 非空类型 — 排除 null 和 undefined
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * 提取数组元素类型
 */
export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never;

/**
 * 指定的键设为必填
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * 指定的键设为可选
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// 常量
// ============================================================================

/** 分页默认值 */
export const PAGINATION_DEFAULTS = {
  /** 默认页码 */
  PAGE: 1,
  /** 默认每页数量 */
  LIMIT: 10,
  /** 最大每页数量 */
  MAX_LIMIT: 100,
  /** 默认排序方向 */
  ORDER: 'desc' as const,
} as const;

/** HTTP 状态码常量 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// 系统管理类型
// ============================================================================

export * from './types/system';

// ============================================================================
// 租户管理类型
// ============================================================================

export * from './types/tenant';

// ============================================================================
// 代码生成器类型
// ============================================================================

export * from './types/gen';

// ============================================================================
// 监控模块类型
// ============================================================================

export * from './types/monitor';

// ============================================================================
// OSS 存储类型
// ============================================================================

export * from './types/oss';

// ============================================================================
// 短信服务类型
// ============================================================================

export * from './types/sms';

// ============================================================================
// SSO 单点登录类型
// ============================================================================

export * from './types/sso';

// ============================================================================
// 第三方服务类型
// ============================================================================

export * from './types/third';

/**
 * 创建成功 Service 结果
 */
export function createSuccessResult<T>(data: T, message?: string): ServiceResult<T> {
  return { success: true, data, message };
}

/**
 * 创建失败 Service 结果
 */
export function createErrorResult(
  code: string,
  message: string,
  details?: unknown,
): ServiceResult<never> {
  return {
    success: false,
    error: { code, message, details },
    message,
  };
}

/**
 * 计算分页元信息
 */
export function calcPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}

/**
 * 创建分页结果
 */
export function createPaginatedResult<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResult<T> {
  return {
    data,
    pagination: calcPaginationMeta(page, limit, total),
  };
}

/**
 * 规范化分页参数
 */
export function normalizePagination(params: PaginationParams): Required<PaginationParams> {
  return {
    page: Math.max(1, params.page ?? PAGINATION_DEFAULTS.PAGE),
    limit: Math.min(
      Math.max(1, params.limit ?? PAGINATION_DEFAULTS.LIMIT),
      PAGINATION_DEFAULTS.MAX_LIMIT,
    ),
    sort: params.sort ?? 'createdAt',
    order: params.order ?? PAGINATION_DEFAULTS.ORDER,
  };
}
