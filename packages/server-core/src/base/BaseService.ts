/**
 * 后端核心 — BaseService 抽象类
 *
 * 提供通用 CRUD 操作的完整实现，支持：
 * - 多数据库适配器（通过 IRepository 接口）
 * - PostgreSQL（默认数据库）
 * - 软删除
 * - 分页查询
 * - 统一错误处理
 * - ServiceResult 返回值模式
 *
 * @module @yunshu/server-core/base/BaseService
 */

import type {
  ServiceResult,
  PaginationParams,
  PaginatedResult,
} from '@yunshu/shared';
import { createSuccessResult, createErrorResult } from '@yunshu/shared';
import type {
  IRepository,
  IEntity,
  QueryCondition,
} from '../repositories/IRepository';
import { ErrorCode } from '../errors/BusinessError';
import {
  withCache,
  invalidateCache,
  invalidateCacheByPrefix,
} from '../cache/CacheDecorator';
import { bloomAdd, bloomMightContain } from '../cache/BloomFilter';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 缓存配置选项
 */
export interface CacheConfig {
  /** 是否启用缓存，默认 true */
  cacheEnabled?: boolean;
  /** 缓存 TTL（秒），默认 300 */
  cacheTtl?: number;
  /** 缓存键前缀，默认 `service:${entityName}` */
  cacheKeyPrefix?: string;
  /** 是否启用布隆过滤器（缓存穿透防护），默认 false */
  bloomFilterEnabled?: boolean;
}

/**
 * BaseService 配置
 */
export interface BaseServiceConfig {
  /** 实体中文名称（用于错误消息） */
  entityName: string;
  /** 是否启用软删除 */
  softDelete?: boolean;
  /** 软删除时间字段名 */
  deletedAtField?: string;
  /** 缓存配置 */
  cacheOptions?: CacheConfig;
}

/**
 * 分页查询配置
 */
export interface PaginateConfig<T = unknown> {
  /** 查询过滤条件 */
  filter?: Record<string, unknown>;
  /** 允许排序的字段白名单（安全考虑，防注入） */
  allowedSortFields?: string[];
  /** 默认排序字段 */
  defaultSort?: string;
  /** 需要填充的关联字段 */
  populate?: string | string[];
  /** 字段选择 */
  select?: string[];
  /** 是否包含已软删除的记录 */
  includeDeleted?: boolean;
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<Omit<BaseServiceConfig, 'cacheOptions'>> & {
  cacheOptions: Required<CacheConfig>;
} = {
  entityName: '资源',
  softDelete: false,
  deletedAtField: 'deletedAt',
  cacheOptions: {
    cacheEnabled: true,
    cacheTtl: 300,
    cacheKeyPrefix: 'service:resource',
    bloomFilterEnabled: false,
  },
};

// ============================================================================
// BaseService 抽象类
// ============================================================================

/**
 * 基础服务抽象类
 *
 * 基于 IRepository 接口，支持多种数据库适配器。
 * 业务层只需继承此类即可获得完整的 CRUD 能力。
 *
 * @template T - 实体类型
 * @template TId - 主键类型
 *
 * @example
 * ```typescript
 * // 定义实体接口
 * interface IUser extends IEntity {
 *   name: string;
 *   email: string;
 * }
 *
 * // 创建用户服务
 * class UserService extends BaseService<IUser, string> {
 *   constructor(repository: IRepository<IUser, string>) {
 *     super(repository, { entityName: '用户', softDelete: true });
 *   }
 *
 *   // 自定义业务方法
 *   async findByEmail(email: string): Promise<ServiceResult<IUser | null>> {
 *     return this.repository.findOne([
 *       { field: 'email', operator: 'eq', value: email }
 *     ]);
 *   }
 * }
 * ```
 */
export abstract class BaseService<
  T extends IEntity = IEntity,
  TId = string,
> {
  protected readonly repository: IRepository<T, TId>;
  protected readonly config: {
    entityName: string;
    softDelete: boolean;
    deletedAtField: string;
    cacheOptions: {
      cacheEnabled: boolean;
      cacheTtl: number;
      cacheKeyPrefix: string;
      bloomFilterEnabled: boolean;
    };
  };

  constructor(repository: IRepository<T, TId>, config: BaseServiceConfig) {
    this.repository = repository;

    const entityName = config.entityName ?? DEFAULT_CONFIG.entityName;
    const cacheKeyPrefix: string =
      config.cacheOptions?.cacheKeyPrefix ?? `service:${entityName}`;

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      entityName,
      softDelete: config.softDelete ?? DEFAULT_CONFIG.softDelete,
      deletedAtField: config.deletedAtField ?? DEFAULT_CONFIG.deletedAtField,
      cacheOptions: {
        cacheEnabled:
          config.cacheOptions?.cacheEnabled ??
          DEFAULT_CONFIG.cacheOptions.cacheEnabled,
        cacheTtl:
          config.cacheOptions?.cacheTtl ?? DEFAULT_CONFIG.cacheOptions.cacheTtl,
        cacheKeyPrefix,
        bloomFilterEnabled:
          config.cacheOptions?.bloomFilterEnabled ??
          DEFAULT_CONFIG.cacheOptions.bloomFilterEnabled,
      },
    };
  }

  // ==========================================================================
  // 便捷方法（代理到 Repository）
  // ==========================================================================

  /**
   * 根据 ID 查找
   */
  async findById(id: TId): Promise<ServiceResult<T | null>> {
    const { cacheEnabled, cacheTtl, cacheKeyPrefix, bloomFilterEnabled } =
      this.config.cacheOptions;

    if (!cacheEnabled) {
      return this.repository.findById(id);
    }

    const idStr = String(id);
    const bloomKey = `${cacheKeyPrefix}:byId:${idStr}`;

    if (bloomFilterEnabled && !bloomMightContain(bloomKey)) {
      return createSuccessResult(null);
    }

    const cachedFn = withCache(
      async (_key: string, _id: TId) => this.repository.findById(_id),
      {
        keyPrefix: cacheKeyPrefix,
        ttl: cacheTtl,
        keyGenerator: (_k, _idArg) => `byId:${_idArg}`,
      },
    );

    const result = await cachedFn(bloomKey, id);

    if (
      bloomFilterEnabled &&
      result &&
      result.success &&
      result.data !== null
    ) {
      bloomAdd(bloomKey);
    }

    return result;
  }

  /**
   * 查找全部
   */
  async findAll(
    query: Record<string, unknown> = {},
  ): Promise<ServiceResult<T[]>> {
    const conditions = this.buildConditions(query);
    return this.repository.findAll({
      where: conditions,
      useSoftDeleteFilter: this.config.softDelete,
    });
  }

  /**
   * 创建
   */
  async create(data: Partial<T>): Promise<ServiceResult<T>> {
    const result = await this.repository.create(data);
    if (result.success) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  /**
   * 更新
   */
  async update(id: TId, data: Partial<T>): Promise<ServiceResult<T>> {
    const result = await this.repository.update(id, data);
    if (result.success) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  /**
   * 删除（根据配置决定硬删除或软删除）
   */
  async delete(id: TId): Promise<ServiceResult<boolean>> {
    const result = this.config.softDelete
      ? await this.repository.softDelete(id)
      : await this.repository.delete(id);
    if (result.success && result.data) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  // ==========================================================================
  // 扩展方法
  // ==========================================================================

  /**
   * 根据条件查找单个
   */
  async findOne(
    query: Record<string, unknown>,
  ): Promise<ServiceResult<T | null>> {
    const { cacheEnabled, cacheTtl, cacheKeyPrefix } = this.config.cacheOptions;
    const conditions = this.buildConditions(query);

    if (!cacheEnabled) {
      return this.repository.findOne(conditions);
    }

    const conditionHash = this.hashObject(conditions);

    const cachedFn = withCache(
      async (_key: string) => this.repository.findOne(conditions),
      {
        keyPrefix: cacheKeyPrefix,
        ttl: cacheTtl,
        keyGenerator: () => `one:${conditionHash}`,
      },
    );

    return cachedFn(`${cacheKeyPrefix}:one:${conditionHash}`);
  }

  /**
   * 统计数量
   */
  async count(query: Record<string, unknown> = {}): Promise<ServiceResult<number>> {
    const conditions = this.buildConditions(query);
    return this.repository.count(conditions, {
      includeDeleted: false,
    });
  }

  /**
   * 检查是否存在
   */
  async exists(id: TId): Promise<ServiceResult<boolean>> {
    return this.repository.exists(id);
  }

  /**
   * 分页查询
   */
  async findWithPagination(
    params: PaginationParams,
    config: PaginateConfig<T> = {},
  ): Promise<ServiceResult<PaginatedResult<T>>> {
    const { cacheEnabled, cacheKeyPrefix } = this.config.cacheOptions;
    const {
      filter = {},
      allowedSortFields = ['createdAt', 'updatedAt'],
      defaultSort = 'createdAt',
      populate,
      select,
      includeDeleted = false,
    } = config;

    const conditions = this.buildConditions(filter);
    const sortField = params.sort && allowedSortFields.includes(params.sort)
      ? params.sort
      : defaultSort;
    const dbSortField = this.toDbFieldName(sortField);
    const populateConfigs = populate
      ? this.buildPopulateConfigs(populate)
      : undefined;
    const selectFields = select
      ? select.map((f) => this.toDbFieldName(f))
      : undefined;

    const performQuery = async () =>
      this.repository.findWithPagination(params, {
        where: conditions,
        orderBy: {
          field: dbSortField,
          order: params.order === 'asc' ? 'asc' : 'desc',
        },
        populate: populateConfigs,
        select: selectFields,
        includeDeleted,
        useSoftDeleteFilter: this.config.softDelete,
      });

    if (!cacheEnabled) {
      return performQuery();
    }

    const pageHash = this.hashObject({
      params,
      config: { filter, sort: sortField, populate, select, includeDeleted },
    });

    const cachedFn = withCache(
      async (_key: string) => performQuery(),
      {
        keyPrefix: cacheKeyPrefix,
        ttl: 60,
        keyGenerator: () => `page:${pageHash}`,
      },
    );

    return cachedFn(`${cacheKeyPrefix}:page:${pageHash}`);
  }

  // ==========================================================================
  // 软删除
  // ==========================================================================

  /**
   * 软删除
   */
  async softDelete(id: TId): Promise<ServiceResult<boolean>> {
    const result = await this.repository.softDelete(id);
    if (result.success && result.data) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  /**
   * 恢复软删除
   */
  async restore(id: TId): Promise<ServiceResult<T>> {
    const result = await this.repository.restore(id);
    if (result.success) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  // ==========================================================================
  // 批量操作
  // ==========================================================================

  /**
   * 批量创建
   */
  async createMany(data: Partial<T>[]): Promise<ServiceResult<T[]>> {
    const result = await this.repository.createMany(data);
    if (result.success) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  /**
   * 批量更新
   */
  async updateMany(
    filter: Record<string, unknown>,
    data: Partial<T>,
  ): Promise<ServiceResult<number>> {
    const conditions = this.buildConditions(filter);
    const result = await this.repository.updateMany(conditions, data);
    if (result.success && (result.data ?? 0) > 0) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  /**
   * 批量删除
   */
  async deleteMany(ids: TId[]): Promise<ServiceResult<number>> {
    let result: ServiceResult<number>;
    if (this.config.softDelete) {
      let count = 0;
      for (const id of ids) {
        const r = await this.repository.softDelete(id);
        if (r.success && r.data) count++;
      }
      result = createSuccessResult(count);
    } else {
      result = await this.repository.deleteMany(ids);
    }
    if (result.success && (result.data ?? 0) > 0) {
      await invalidateCacheByPrefix(this.config.cacheOptions.cacheKeyPrefix);
    }
    return result;
  }

  // ==========================================================================
  // 辅助方法
  // ==========================================================================

  /**
   * 构建缓存键
   */
  private buildCacheKey(...parts: string[]): string {
    return `${this.config.cacheOptions.cacheKeyPrefix}:${parts.join(':')}`;
  }

  /**
   * 简单哈希对象（基于 JSON.stringify）
   */
  private hashObject(obj: unknown): string {
    try {
      const str = JSON.stringify(obj);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash.toString(36).replace('-', '0');
    } catch {
      return String(obj);
    }
  }

  /**
   * 将查询对象转换为条件数组
   */
  protected buildConditions(
    query: Record<string, unknown>,
  ): QueryCondition[] {
    const conditions: QueryCondition[] = [];

    for (const [key, value] of Object.entries(query)) {
      // 跳过特殊字段
      if (key.startsWith('$')) continue;

      if (value === null) {
        conditions.push({
          field: key,
          operator: 'isNull',
          value: null,
        });
      } else if (Array.isArray(value)) {
        conditions.push({
          field: key,
          operator: 'in',
          value,
        });
      } else {
        conditions.push({
          field: key,
          operator: 'eq',
          value,
        });
      }
    }

    return conditions;
  }

  /**
   * 转换字段名为数据库格式
   *
   * 默认将 camelCase 转换为 snake_case，
   * 子类可覆盖此方法以适应特定数据库。
   */
  protected toDbFieldName(field: string): string {
    return field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  /**
   * 转换数据库字段名为实体格式
   */
  protected toEntityFieldName(field: string): string {
    return field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * 构建关联查询配置
   */
  protected buildPopulateConfigs(
    populate: string | string[],
  ): { path: string; select?: string }[] {
    const paths = Array.isArray(populate) ? populate : [populate];
    return paths.map((path) => ({
      path,
      // 默认选择所有字段，子类可自定义
      select: undefined,
    }));
  }

  /**
   * 获取实体名称
   */
  protected getEntityName(): string {
    return this.config.entityName;
  }

  /**
   * 统一错误处理
   *
   * 将各种错误转为 ServiceResult 格式。
   * 子类可覆盖此方法以处理特定错误。
   */
  protected handleError<T>(error: unknown): ServiceResult<T> {
    if (error instanceof Error) {
      // 唯一性约束冲突
      if ('code' in error) {
        const pgError = error as { code: string };
        if (pgError.code === '23505') {
          return createErrorResult(
            ErrorCode.CONFLICT,
            `${this.config.entityName}已存在`,
          );
        }
      }

      return createErrorResult(ErrorCode.UNKNOWN_ERROR, error.message);
    }

    return createErrorResult(ErrorCode.UNKNOWN_ERROR, '未知错误');
  }
}
