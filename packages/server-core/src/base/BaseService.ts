/**
 * 后端核心 — BaseService 抽象类
 *
 * 提供通用 CRUD 操作的完整实现，基于 PostgreSQL 和 IRepository 接口。
 *
 * @module @yunshu/server-core/base/BaseService
 */

import type { ServiceResult, PaginationParams, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult } from '@yunshu/shared';
import type { IRepository, IEntity, QueryCondition } from '../repositories/IRepository';
import { ErrorCode } from '../errors/BusinessError';

export interface BaseServiceConfig {
  entityName: string;
  softDelete?: boolean;
  deletedAtField?: string;
}

export interface PaginateConfig<_T = unknown> {
  filter?: Record<string, unknown>;
  allowedSortFields?: string[];
  defaultSort?: string;
  populate?: string | string[];
  select?: string[];
  includeDeleted?: boolean;
}

const DEFAULT_CONFIG: Required<BaseServiceConfig> = {
  entityName: '资源',
  softDelete: false,
  deletedAtField: 'deletedAt',
};

/**
 * 基础服务抽象类
 *
 * @template T - 实体类型
 * @template TId - 主键类型
 */
export abstract class BaseService<T extends IEntity = IEntity, TId = string> {
  protected readonly repository: IRepository<T, TId>;
  protected readonly config: Required<BaseServiceConfig>;

  constructor(repository: IRepository<T, TId>, config: BaseServiceConfig) {
    this.repository = repository;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async findById(id: TId): Promise<ServiceResult<T | null>> {
    return this.repository.findById(id);
  }

  async findAll(query: Record<string, unknown> = {}): Promise<ServiceResult<T[]>> {
    const conditions = this.buildConditions(query);
    return this.repository.findAll({ where: conditions, useSoftDeleteFilter: this.config.softDelete });
  }

  async create(data: Partial<T>): Promise<ServiceResult<T>> {
    return this.repository.create(data);
  }

  async update(id: TId, data: Partial<T>): Promise<ServiceResult<T>> {
    return this.repository.update(id, data);
  }

  async delete(id: TId): Promise<ServiceResult<boolean>> {
    if (this.config.softDelete) {
      return this.repository.softDelete(id);
    }
    return this.repository.delete(id);
  }

  async findOne(query: Record<string, unknown>): Promise<ServiceResult<T | null>> {
    const conditions = this.buildConditions(query);
    return this.repository.findOne(conditions);
  }

  async count(query: Record<string, unknown> = {}): Promise<ServiceResult<number>> {
    const conditions = this.buildConditions(query);
    return this.repository.count(conditions, { includeDeleted: false });
  }

  async exists(id: TId): Promise<ServiceResult<boolean>> {
    return this.repository.exists(id);
  }

  async findWithPagination(params: PaginationParams, config: PaginateConfig<T> = {}): Promise<ServiceResult<PaginatedResult<T>>> {
    const {
      filter = {},
      allowedSortFields = ['createdAt', 'updatedAt'],
      defaultSort = 'createdAt',
      populate,
      select,
      includeDeleted = false,
    } = config;

    const conditions = this.buildConditions(filter);
    const sortField = params.sort && allowedSortFields.includes(params.sort) ? params.sort : defaultSort;
    const dbSortField = this.toDbFieldName(sortField);
    const populateConfigs = populate ? this.buildPopulateConfigs(populate) : undefined;
    const selectFields = select ? select.map((f: string) => this.toDbFieldName(f)) : undefined;

    return this.repository.findWithPagination(params, {
      where: conditions,
      orderBy: { field: dbSortField, order: params.order === 'asc' ? 'asc' : 'desc' },
      populate: populateConfigs,
      select: selectFields,
      includeDeleted,
      useSoftDeleteFilter: this.config.softDelete,
    });
  }

  async softDelete(id: TId): Promise<ServiceResult<boolean>> {
    return this.repository.softDelete(id);
  }

  async restore(id: TId): Promise<ServiceResult<T>> {
    return this.repository.restore(id);
  }

  async createMany(data: Partial<T>[]): Promise<ServiceResult<T[]>> {
    return this.repository.createMany(data);
  }

  async updateMany(filter: Record<string, unknown>, data: Partial<T>): Promise<ServiceResult<number>> {
    const conditions = this.buildConditions(filter);
    return this.repository.updateMany(conditions, data);
  }

  async deleteMany(ids: TId[]): Promise<ServiceResult<number>> {
    if (this.config.softDelete) {
      let count = 0;
      for (const id of ids) {
        const result = await this.repository.softDelete(id);
        if (result.success && result.data) count++;
      }
      return createSuccessResult(count);
    }
    return this.repository.deleteMany(ids);
  }

  protected buildConditions(query: Record<string, unknown>): QueryCondition[] {
    const conditions: QueryCondition[] = [];
    for (const [key, value] of Object.entries(query)) {
      if (key.startsWith('$')) continue;
      if (value === null) {
        conditions.push({ field: key, operator: 'isNull', value: null });
      } else if (Array.isArray(value)) {
        conditions.push({ field: key, operator: 'in', value });
      } else {
        conditions.push({ field: key, operator: 'eq', value });
      }
    }
    return conditions;
  }

  protected toDbFieldName(field: string): string {
    return field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  protected toEntityFieldName(field: string): string {
    return field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  protected buildPopulateConfigs(populate: string | string[]): { path: string; select?: string }[] {
    const paths = Array.isArray(populate) ? populate : [populate];
    return paths.map((path) => ({ path, select: undefined }));
  }

  protected getEntityName(): string {
    return this.config.entityName;
  }

  protected handleError<T>(error: unknown): ServiceResult<T> {
    if (error instanceof Error) {
      if ('code' in error) {
        const pgError = error as { code: string };
        if (pgError.code === '23505') {
          return createErrorResult(ErrorCode.CONFLICT, `${this.config.entityName}已存在`);
        }
      }
      return createErrorResult(ErrorCode.UNKNOWN_ERROR, error.message);
    }
    return createErrorResult(ErrorCode.UNKNOWN_ERROR, '未知错误');
  }
}
