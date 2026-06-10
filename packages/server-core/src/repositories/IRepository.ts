/**
 * 数据访问层抽象接口
 *
 * 定义统一的数据访问契约，支持多数据库适配器实现。
 * 设计目标：
 * - 抽象数据访问细节，业务层无需关心具体数据库
 * - 当前使用 PostgreSQL，可扩展支持其他数据库
 * - 提供一致的 CRUD、分页、软删除等能力
 *
 * @module @yunshu/server-core/repositories/IRepository
 */

import type { ServiceResult, PaginationParams, PaginatedResult } from '@yunshu/shared';

// ============================================================================
// 基础类型
// ============================================================================

/**
 * 实体基础接口
 */
export interface IEntity {
  /** 主键 ID */
  id: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 软删除实体接口
 */
export interface ISoftDelete {
  /** 软删除时间，为 null 表示未删除 */
  deletedAt: Date | null;
}

// ============================================================================
// 查询条件
// ============================================================================

/**
 * 查询操作符
 */
export type QueryOperator =
  | 'eq' // 等于 =
  | 'ne' // 不等于 <>
  | 'gt' // 大于 >
  | 'gte' // 大于等于 >=
  | 'lt' // 小于 <
  | 'lte' // 小于等于 <=
  | 'in' // 在数组中 IN
  | 'nin' // 不在数组中 NOT IN
  | 'like' // 模糊匹配 LIKE
  | 'ilike' // 大小写不敏感匹配 ILIKE
  | 'isNull' // 为空 IS NULL
  | 'isNotNull'; // 不为空 IS NOT NULL

/**
 * 查询条件
 */
export interface QueryCondition {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

/**
 * 排序配置
 */
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 关联查询配置
 */
export interface PopulateConfig {
  /** 关联字段名 */
  path: string;
  /** 选择的字段（逗号分隔字符串） */
  select?: string;
  /** 额外条件 */
  match?: QueryCondition[];
}

/**
 * 查询配置
 */
export interface QueryConfig {
  /** 查询条件数组 */
  where?: QueryCondition[];
  /** 排序配置 */
  orderBy?: SortConfig;
  /** 关联查询 */
  populate?: PopulateConfig[];
  /** 选择的字段 */
  select?: string[];
  /** 是否包含已删除记录（软删除场景） */
  includeDeleted?: boolean;
  /** 是否启用软删除过滤（默认 true） */
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
 *
 * @example
 * ```typescript
 * class UserRepository implements IRepository<User, string> {
 *   // 实现具体数据库操作
 * }
 * ```
 */
export interface IRepository<T extends IEntity, TId = string> {
  // ==========================================================================
  // 基础 CRUD
  // ==========================================================================

  /**
   * 根据 ID 查找
   */
  findById(id: TId): Promise<ServiceResult<T | null>>;

  /**
   * 根据条件查找单个
   */
  findOne(where: QueryCondition[]): Promise<ServiceResult<T | null>>;

  /**
   * 查找全部
   */
  findAll(config?: QueryConfig): Promise<ServiceResult<T[]>>;

  /**
   * 创建
   */
  create(data: Partial<T>): Promise<ServiceResult<T>>;

  /**
   * 更新
   */
  update(id: TId, data: Partial<T>): Promise<ServiceResult<T>>;

  /**
   * 删除（硬删除）
   */
  delete(id: TId): Promise<ServiceResult<boolean>>;

  // ==========================================================================
  // 扩展操作
  // ==========================================================================

  /**
   * 统计数量
   */
  count(
    where?: QueryCondition[],
    config?: { includeDeleted?: boolean },
  ): Promise<ServiceResult<number>>;

  /**
   * 检查是否存在
   */
  exists(id: TId): Promise<ServiceResult<boolean>>;

  /**
   * 分页查询
   */
  findWithPagination(
    params: PaginationParams,
    config?: QueryConfig,
  ): Promise<ServiceResult<PaginatedResult<T>>>;

  // ==========================================================================
  // 软删除
  // ==========================================================================

  /**
   * 软删除
   */
  softDelete(id: TId): Promise<ServiceResult<boolean>>;

  /**
   * 恢复软删除
   */
  restore(id: TId): Promise<ServiceResult<T>>;

  // ==========================================================================
  // 批量操作
  // ==========================================================================

  /**
   * 批量创建
   */
  createMany(data: Partial<T>[]): Promise<ServiceResult<T[]>>;

  /**
   * 批量更新
   */
  updateMany(where: QueryCondition[], data: Partial<T>): Promise<ServiceResult<number>>;

  /**
   * 批量删除
   */
  deleteMany(ids: TId[]): Promise<ServiceResult<number>>;

  // ==========================================================================
  // 工具方法
  // ==========================================================================

  /**
   * 获取实体名称（用于错误消息）
   */
  getEntityName(): string;

  /**
   * 获取表/集合名
   */
  getTableName(): string;
}

// ============================================================================
// 抽象工厂
// ============================================================================

/**
 * Repository 工厂接口
 */
export interface IRepositoryFactory {
  /**
   * 创建指定实体的 Repository
   */
  getRepository<T extends IEntity, TId = string>(entityName: string): IRepository<T, TId>;
}

// ============================================================================
// 查询构建器（链式调用）
// ============================================================================

/**
 * 链式查询构建器
 *
 * @example
 * ```typescript
 * const users = await repo
 *   .createQueryBuilder()
 *   .where({ field: 'status', operator: 'eq', value: 'active' })
 *   .orderBy({ field: 'createdAt', order: 'desc' })
 *   .limit(10)
 *   .execute();
 * ```
 */
export interface IQueryBuilder<T extends IEntity> {
  /** 添加查询条件 */
  where(condition: QueryCondition): IQueryBuilder<T>;
  /** 添加 OR 条件组 */
  orWhere(conditions: QueryCondition[]): IQueryBuilder<T>;
  /** 添加排序 */
  orderBy(config: SortConfig): IQueryBuilder<T>;
  /** 添加关联查询 */
  populate(config: PopulateConfig): IQueryBuilder<T>;
  /** 选择字段 */
  select(fields: string[]): IQueryBuilder<T>;
  /** 设置偏移量 */
  offset(count: number): IQueryBuilder<T>;
  /** 设置限制数量 */
  limit(count: number): IQueryBuilder<T>;
  /** 是否包含已删除记录 */
  withDeleted(): IQueryBuilder<T>;

  /** 执行查询，返回单个结果 */
  executeOne(): Promise<ServiceResult<T | null>>;
  /** 执行查询，返回多个结果 */
  executeMany(): Promise<ServiceResult<T[]>>;
  /** 执行分页查询 */
  executePaginated(params: PaginationParams): Promise<ServiceResult<PaginatedResult<T>>>;
  /** 执行计数 */
  executeCount(): Promise<ServiceResult<number>>;
}
