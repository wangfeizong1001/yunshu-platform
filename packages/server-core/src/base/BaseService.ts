/**
 * 后端核心 — BaseService 抽象类
 *
 * 提供通用 CRUD 操作的完整实现，支持：
 * - MongoDB Mongoose 集成（默认）
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
import { BusinessError, ErrorCode } from '../errors/BusinessError';

// ============================================================================
// 类型定义
// ============================================================================

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
  select?: string;
  /** 是否包含已软删除的记录 */
  includeDeleted?: boolean;
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<BaseServiceConfig> = {
  entityName: '资源',
  softDelete: false,
  deletedAtField: 'deletedAt',
};

// ============================================================================
// BaseService 抽象类
// ============================================================================

/**
 * 基础服务抽象类
 *
 * @template TModel — Mongoose Model 类型
 * @template TDocument — Mongoose Document 类型
 * @template TCreateDTO — 创建 DTO 类型
 * @template TUpdateDTO — 更新 DTO 类型
 *
 * @example
 * ```typescript
 * class UserService extends BaseService<UserModel, IUser, CreateUserDTO, UpdateUserDTO> {
 *   constructor() {
 *     super(UserModel, { entityName: '用户', softDelete: true });
 *   }
 *
 *   // 自定义业务方法
 *   async findByEmail(email: string): Promise<ServiceResult<IUser>> {
 *     return this.findOne({ email });
 *   }
 * }
 * ```
 */
export abstract class BaseService<
  TModel = unknown,
  TDocument = unknown,
  TCreateDTO = Partial<TDocument>,
  TUpdateDTO = Partial<TDocument>,
> {
  protected readonly model: TModel;
  protected readonly config: Required<BaseServiceConfig>;

  constructor(model: TModel, config: BaseServiceConfig) {
    this.model = model;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ==========================================================================
  // 抽象方法（子类必须实现）
  // ==========================================================================

  /**
   * 构建包含软删除过滤的基础查询条件
   */
  protected buildBaseFilter(query: Record<string, unknown>): Record<string, unknown> {
    if (!this.config.softDelete) return query;
    return { ...query, [this.config.deletedAtField]: { $exists: false } };
  }

  // ==========================================================================
  // CRUD 标准实现
  // ==========================================================================

  /**
   * 根据 ID 查找
   */
  async findById(id: string): Promise<ServiceResult<TDocument>> {
    try {
      const filter = this.buildBaseFilter({ _id: id });
      const doc = await (this.model as any).findOne(filter);

      if (!doc) {
        return createErrorResult(
          ErrorCode.NOT_FOUND,
          `${this.config.entityName}不存在`,
        );
      }

      return createSuccessResult(doc as TDocument);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 查找全部
   */
  async findAll(query: Record<string, unknown> = {}): Promise<ServiceResult<TDocument[]>> {
    try {
      const filter = this.buildBaseFilter(query);
      const docs = await (this.model as any).find(filter);
      return createSuccessResult(docs as TDocument[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 创建
   */
  async create(data: TCreateDTO): Promise<ServiceResult<TDocument>> {
    try {
      const doc = await (this.model as any).create(data);
      return createSuccessResult(doc as TDocument, `${this.config.entityName}创建成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 更新
   */
  async update(id: string, data: TUpdateDTO): Promise<ServiceResult<TDocument>> {
    try {
      const filter = this.buildBaseFilter({ _id: id });
      const doc = await (this.model as any).findOneAndUpdate(filter, data, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return createErrorResult(
          ErrorCode.NOT_FOUND,
          `${this.config.entityName}不存在`,
        );
      }

      return createSuccessResult(doc as TDocument, `${this.config.entityName}更新成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 删除（支持软删除）
   */
  async delete(id: string): Promise<ServiceResult<boolean>> {
    try {
      if (this.config.softDelete) {
        return this.softDeleteById(id);
      }

      const filter = this.buildBaseFilter({ _id: id });
      const result = await (this.model as any).deleteOne(filter);

      if (result.deletedCount === 0) {
        return createErrorResult(
          ErrorCode.NOT_FOUND,
          `${this.config.entityName}不存在`,
        );
      }

      return createSuccessResult(true, `${this.config.entityName}删除成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 扩展方法
  // ==========================================================================

  /**
   * 根据条件查找单个
   */
  async findOne(query: Record<string, unknown>): Promise<ServiceResult<TDocument | null>> {
    try {
      const filter = this.buildBaseFilter(query);
      const doc = await (this.model as any).findOne(filter);
      return createSuccessResult(doc as TDocument | null);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 统计数量
   */
  async count(query: Record<string, unknown> = {}): Promise<ServiceResult<number>> {
    try {
      const filter = this.buildBaseFilter(query);
      const count = await (this.model as any).countDocuments(filter);
      return createSuccessResult(count);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 检查是否存在
   */
  async exists(id: string): Promise<ServiceResult<boolean>> {
    try {
      const filter = this.buildBaseFilter({ _id: id });
      const result = await (this.model as any).exists(filter);
      return createSuccessResult(!!result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 分页查询
   */
  async findWithPagination(
    params: PaginationParams,
    config: PaginateConfig<TDocument> = {},
  ): Promise<ServiceResult<PaginatedResult<TDocument>>> {
    try {
      const {
        filter = {},
        allowedSortFields = ['createdAt', 'updatedAt'],
        defaultSort = 'createdAt',
        populate,
        select,
        includeDeleted = false,
      } = config;

      const page = params.page ?? 1;
      const limit = Math.min(params.limit ?? 10, 100);
      const skip = (page - 1) * limit;

      // 构建查询条件
      const queryFilter = includeDeleted
        ? filter
        : { ...filter, ...(this.config.softDelete ? { [this.config.deletedAtField]: { $exists: false } } : {}) };

      // 安全排序（白名单）
      const sortField = params.sort && allowedSortFields.includes(params.sort)
        ? params.sort
        : defaultSort;
      const sortOrder = params.order === 'asc' ? 1 : -1;
      const sort = { [sortField]: sortOrder };

      // 并行查询
      let queryChain = (this.model as any)
        .find(queryFilter)
        .skip(skip)
        .limit(limit)
        .sort(sort);

      if (select) queryChain = queryChain.select(select);
      if (populate) {
        if (Array.isArray(populate)) {
          for (const p of populate) queryChain = queryChain.populate(p);
        } else {
          queryChain = queryChain.populate(populate);
        }
      }

      const [data, total] = await Promise.all([
        queryChain.exec(),
        (this.model as any).countDocuments(queryFilter),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return createSuccessResult({
        data: data as TDocument[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 软删除
  // ==========================================================================

  /**
   * 软删除
   */
  private async softDeleteById(id: string): Promise<ServiceResult<boolean>> {
    const filter = this.buildBaseFilter({ _id: id });
    const updateData = { [this.config.deletedAtField]: new Date() };

    const result = await (this.model as any).updateOne(filter, updateData);

    if (result.matchedCount === 0) {
      return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
    }

    return createSuccessResult(true, `${this.config.entityName}已删除`);
  }

  /**
   * 恢复软删除
   */
  async restore(id: string): Promise<ServiceResult<TDocument>> {
    try {
      const updateData = { $unset: { [this.config.deletedAtField]: 1 } };
      const doc = await (this.model as any).findByIdAndUpdate(id, updateData, { new: true });

      if (!doc) {
        return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
      }

      return createSuccessResult(doc as TDocument, `${this.config.entityName}已恢复`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 错误处理
  // ==========================================================================

  /**
   * 统一错误处理 — 将各种错误转为 ServiceResult 格式
   */
  protected handleError<T>(error: unknown): ServiceResult<T> {
    if (error instanceof BusinessError) {
      return {
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
        message: error.message,
      };
    }

    if (error instanceof Error) {
      // Mongoose ValidationError
      if (error.name === 'ValidationError') {
        return {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: `数据校验失败: ${error.message}`,
          },
          message: '数据校验失败',
        };
      }

      // Mongoose CastError（无效 ID 等）
      if (error.name === 'CastError') {
        return {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: `参数格式错误: ${error.message}`,
          },
          message: '参数格式错误',
        };
      }

      return {
        success: false,
        error: {
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.message,
        },
        message: error.message,
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: '未知错误',
      },
      message: '未知错误',
    };
  }
}
