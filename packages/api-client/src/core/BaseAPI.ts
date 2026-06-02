/**
 * API 客户端 — BaseAPI 抽象类
 *
 * 提供标准 CRUD 操作的基础实现，所有业务 API 类继承此类。
 * 框架无关，可与任意 HTTP 适配器配合使用。
 *
 * @module @yunshu/api-client/core/BaseAPI
 */

import type { HttpClient } from './HttpClient';
import type { ApiResponse } from './types';

// ============================================================================
// 类型定义
// ============================================================================

/** 分页参数 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
}

/** 列表响应 */
export interface ListResponse<T> {
  list: T[];
  items?: T[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/** 通用过滤参数 */
export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

// ============================================================================
// BaseAPI 抽象类
// ============================================================================

/**
 * BaseAPI — 标准 CRUD 基础类
 *
 * @template T 实体类型
 * @template CreateDTO 创建 DTO 类型
 * @template UpdateDTO 更新 DTO 类型
 * @template Filter 过滤参数类型
 *
 * @example
 * ```typescript
 * class UserAPI extends BaseAPI<IUser, CreateUserDTO, UpdateUserDTO> {
 *   protected endpoint = '/users';
 * }
 *
 * const userApi = new UserAPI(httpClient);
 * const { data } = await userApi.getList({ page: 1, limit: 10 });
 * ```
 */
export abstract class BaseAPI<
  T = unknown,
  CreateDTO = Partial<T>,
  UpdateDTO = Partial<T>,
  Filter = FilterParams,
> {
  /** API 端点路径 */
  protected abstract endpoint: string;

  /** HTTP 客户端 */
  protected readonly http: HttpClient;

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  // ========================================================================
  // URL 构建
  // ========================================================================

  /** 构建完整 URL */
  protected buildUrl(path = ''): string {
    const base = this.endpoint.startsWith('/') ? this.endpoint : `/${this.endpoint}`;
    return path ? `${base}/${path}` : base;
  }

  // ========================================================================
  // 标准 CRUD
  // ========================================================================

  /** 获取列表 */
  async getList(params?: Filter & PaginationParams): Promise<ApiResponse<ListResponse<T>>> {
    return this.http.get<ListResponse<T>>(this.buildUrl(), params as Record<string, unknown>);
  }

  /** 根据 ID 获取单个实体 */
  async getById(id: string | number): Promise<ApiResponse<T>> {
    return this.http.get<T>(this.buildUrl(String(id)));
  }

  /** 创建实体 */
  async create(data: CreateDTO): Promise<ApiResponse<T>> {
    return this.http.post<T>(this.buildUrl(), data);
  }

  /** 更新实体 */
  async update(id: string | number, data: UpdateDTO): Promise<ApiResponse<T>> {
    return this.http.put<T>(this.buildUrl(String(id)), data);
  }

  /** 部分更新实体 */
  async patch(id: string | number, data: Partial<UpdateDTO>): Promise<ApiResponse<T>> {
    return this.http.patch<T>(this.buildUrl(String(id)), data);
  }

  /** 删除实体 */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return this.http.delete<void>(this.buildUrl(String(id)));
  }

  // ========================================================================
  // 批量操作
  // ========================================================================

  /** 批量删除 */
  async batchDelete(ids: Array<string | number>): Promise<ApiResponse<void>> {
    return this.http.post<void>(this.buildUrl('batch-delete'), { ids });
  }

  /** 批量创建 */
  async batchCreate(data: CreateDTO[]): Promise<ApiResponse<T[]>> {
    return this.http.post<T[]>(this.buildUrl('batch'), data);
  }

  // ========================================================================
  // 辅助方法
  // ========================================================================

  /** 获取总数 */
  async count(params?: Filter): Promise<ApiResponse<number>> {
    return this.http.get<number>(this.buildUrl('count'), params as Record<string, unknown>);
  }

  /** 检查是否存在 */
  async exists(id: string | number): Promise<ApiResponse<boolean>> {
    return this.http.get<boolean>(this.buildUrl(`${id}/exists`));
  }
}
