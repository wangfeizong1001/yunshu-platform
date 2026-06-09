/**
 * 数据访问层抽象接口
 *
 * 定义统一的数据访问契约，支持多数据库适配器实现。
 *
 * @module @yunshu/server-core/repositories/IRepository
 */

import type {
  ServiceResult,
  PaginationParams,
  PaginatedResult,
} from '@yunshu/shared';

// ============================================================================
// 基础类型
// ============================================================================

/** 实体基础接口 */
export interface IEntity {
  /** 主键 ID */
  id: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 软删除实体接口 */
export interface ISoftDelete {
  /** 软删除时间，为 null 表示未删除 */
  deletedAt: Date | null;
}

// ============================================================================
// 查询条件
// ============================================================================

/** 查询操作符 */
export type QueryOperator =
  | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'nin' | 'like' | 'ilike' | 'isNull' | 'isNotNull';

/** 查询条件 */
export interface QueryCondition {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

/** 排序配置 */
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

/** 关联查询配置 */
export interface PopulateConfig {
  path: string;
  select?: string;
  match?: QueryCondition[];
}

/** 查询配置 */
export interface QueryConfig {
  where?: QueryCondition[];
  orderBy?: SortConfig;
  populate?: PopulateConfig[];
  select?: string[];
  includeDeleted?: boolean;
  useSoftDeleteFilter?: boolean;
}

// ============================================================================
// Repository 接口
// ============================================================================

/**
 * 数据访问层抽象接口
 *
 * @template T - 实体类型
 * @template TId - 主键类型
 */
export interface IRepository<T extends IEntity, TId = string> {
  // 基础 CRUD
  findById(id: TId): Promise<ServiceResult<T | null>>;
  findOne(where: QueryCondition[]): Promise<ServiceResult<T | null>>;
  findAll(config?: QueryConfig): Promise<ServiceResult<T[]>>;
  create(data: Partial<T>): Promise<ServiceResult<T>>;
  update(id: TId, data: Partial<T>): Promise<ServiceResult<T>>;
  delete(id: TId): Promise<ServiceResult<boolean>>;

  // 扩展操作
  count(where?: QueryCondition[], config?: { includeDeleted?: boolean }): Promise<ServiceResult<number>>;
  exists(id: TId): Promise<ServiceResult<boolean>>;
  findWithPagination(params: PaginationParams, config?: QueryConfig): Promise<ServiceResult<PaginatedResult<T>>>;

  // 软删除
  softDelete(id: TId): Promise<ServiceResult<boolean>>;
  restore(id: TId): Promise<ServiceResult<T>>;

  // 批量操作
  createMany(data: Partial<T>[]): Promise<ServiceResult<T[]>>;
  updateMany(where: QueryCondition[], data: Partial<T>): Promise<ServiceResult<number>>;
  deleteMany(ids: TId[]): Promise<ServiceResult<number>>;

  // 工具方法
  getEntityName(): string;
  getTableName(): string;
}

/** Repository 工厂接口 */
export interface IRepositoryFactory {
  getRepository<T extends IEntity, TId = string>(entityName: string): IRepository<T, TId>;
}

/** 链式查询构建器 */
export interface IQueryBuilder<T extends IEntity> {
  where(condition: QueryCondition): IQueryBuilder<T>;
  orWhere(conditions: QueryCondition[]): IQueryBuilder<T>;
  orderBy(config: SortConfig): IQueryBuilder<T>;
  populate(config: PopulateConfig): IQueryBuilder<T>;
  select(fields: string[]): IQueryBuilder<T>;
  offset(count: number): IQueryBuilder<T>;
  limit(count: number): IQueryBuilder<T>;
  withDeleted(): IQueryBuilder<T>;
  executeOne(): Promise<ServiceResult<T | null>>;
  executeMany(): Promise<ServiceResult<T[]>>;
  executePaginated(params: PaginationParams): Promise<ServiceResult<PaginatedResult<T>>>;
  executeCount(): Promise<ServiceResult<number>>;
}
