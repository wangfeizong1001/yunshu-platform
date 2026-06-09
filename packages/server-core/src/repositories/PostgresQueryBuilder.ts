/**
 * PostgreSQL 查询构建器
 *
 * 提供链式调用的 SQL 查询构建能力，
 * 自动处理参数化查询以防止 SQL 注入。
 *
 * @module @yunshu/server-core/repositories/PostgresQueryBuilder
 */

import type { Pool } from 'pg';
import type {
  QueryCondition,
  SortConfig,
  PopulateConfig,
  IQueryBuilder,
  IEntity,
} from './IRepository';
import type { ServiceResult, PaginationParams, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult } from '@yunshu/shared';
import { ErrorCode } from '../errors/BusinessError';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * PostgreSQL 查询构建器配置
 */
export interface PostgresQueryBuilderConfig {
  /** 表名 */
  tableName: string;
  /** 主键字段名，默认 id */
  idField?: string;
  /** 软删除字段名，为空表示不支持软删除 */
  softDeleteField?: string;
  /** 实体名称（用于错误消息） */
  entityName?: string;
}

// ============================================================================
// 查询构建器实现
// ============================================================================

/**
 * PostgreSQL 链式查询构建器
 */
export class PostgresQueryBuilder<T extends IEntity>
  implements IQueryBuilder<T>
{
  private pool: Pool;
  private config: Required<PostgresQueryBuilderConfig>;

  private conditions: QueryCondition[] = [];
  private orGroups: QueryCondition[][] = [];
  private sortConfigs: SortConfig[] = [];
  private populateConfigs: PopulateConfig[] = [];
  private selectFields: string[] | null = null;
  private offsetCount: number | null = null;
  private limitCount: number | null = null;
  private includeDeleted: boolean = false;

  constructor(pool: Pool, config: PostgresQueryBuilderConfig) {
    this.pool = pool;
    this.config = {
      idField: 'id',
      entityName: config.tableName,
      softDeleteField: 'deleted_at',
      ...config,
    };
  }

  // ==========================================================================
  // 链式方法
  // ==========================================================================

  /**
   * 添加查询条件（AND）
   */
  where(condition: QueryCondition): this {
    this.conditions.push(condition);
    return this;
  }

  /**
   * 添加 OR 条件组
   */
  orWhere(conditions: QueryCondition[]): this {
    this.orGroups.push(conditions);
    return this;
  }

  /**
   * 添加排序
   */
  orderBy(config: SortConfig): this {
    this.sortConfigs.push(config);
    return this;
  }

  /**
   * 添加关联查询（JOIN）
   */
  populate(config: PopulateConfig): this {
    this.populateConfigs.push(config);
    return this;
  }

  /**
   * 选择字段
   */
  select(fields: string[]): this {
    this.selectFields = fields;
    return this;
  }

  /**
   * 设置偏移量
   */
  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }

  /**
   * 设置限制数量
   */
  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  /**
   * 包含已删除记录
   */
  withDeleted(): this {
    this.includeDeleted = true;
    return this;
  }

  // ==========================================================================
  // 执行方法
  // ==========================================================================

  /**
   * 执行查询，返回单个结果
   */
  async executeOne(): Promise<ServiceResult<T | null>> {
    try {
      const { text, params } = this.buildSelectQuery(false);
      const result = await this.pool.query(text, params);

      if (result.rows.length === 0) {
        return createSuccessResult(null);
      }

      const row = this.mapRowToEntity(result.rows[0]);
      return createSuccessResult(row as T);

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 执行查询，返回多个结果
   */
  async executeMany(): Promise<ServiceResult<T[]>> {
    try {
      const { text, params } = this.buildSelectQuery(false);
      const result = await this.pool.query(text, params);

      const rows = result.rows.map((row) => this.mapRowToEntity(row));
      return createSuccessResult(rows as T[]);

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 执行分页查询
   */
  async executePaginated(
    params: PaginationParams,
  ): Promise<ServiceResult<PaginatedResult<T>>> {
    try {
      const page = Math.max(1, params.page ?? 1);
      const limit = Math.min(Math.max(1, params.limit ?? 10), 100);
      const offset = (page - 1) * limit;

      // 构建主查询
      const { text: selectText, params: selectParams } = this.buildSelectQuery(false);
      const { text: countText, params: countParams } = this.buildCountQuery();

      // 并行执行查询和计数
      const [dataResult, countResult] = await Promise.all([
        this.pool.query(`${selectText} OFFSET $${selectParams.length + 1} LIMIT $${selectParams.length + 2}`,
          [...selectParams, offset, limit]),
        this.pool.query(countText, countParams),
      ]);

      const total = parseInt(countResult.rows[0]?.count || '0', 10);
      const totalPages = Math.ceil(total / limit) || 1;

      const rows = dataResult.rows.map((row) => this.mapRowToEntity(row));

      return createSuccessResult({
        data: rows as T[],
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

  /**
   * 执行计数
   */
  async executeCount(): Promise<ServiceResult<number>> {
    try {
      const { text, params } = this.buildCountQuery();
      const result = await this.pool.query(text, params);

      const count = parseInt(result.rows[0]?.count || '0', 10);
      return createSuccessResult(count);

    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 查询构建
  // ==========================================================================

  /**
   * 构建 SELECT 查询
   */
  private buildSelectQuery(withPagination: boolean): { text: string; params: unknown[] } {
    const params: unknown[] = [];
    let paramIndex = 1;

    // SELECT 字段
    let selectClause = '*';
    if (this.selectFields && this.selectFields.length > 0) {
      selectClause = this.selectFields.map((f) => this.escapeIdentifier(f)).join(', ');
    }

    // FROM 子句
    let fromClause = `FROM ${this.escapeIdentifier(this.config.tableName)}`;

    // JOIN 子句
    let joinClause = '';
    for (const populate of this.populateConfigs) {
      // 简化的 JOIN 实现，实际应根据外键配置
      const joinTable = populate.path;
      joinClause += `\nLEFT JOIN ${this.escapeIdentifier(joinTable)} ON ${this.escapeIdentifier(this.config.tableName)}.${this.escapeIdentifier(populate.path + '_id')} = ${this.escapeIdentifier(joinTable)}.id`;
    }

    // WHERE 子句
    const { whereClause, whereParams } = this.buildWhereClause(paramIndex);
    params.push(...whereParams);
    paramIndex += whereParams.length;

    // ORDER BY 子句
    let orderByClause = '';
    if (this.sortConfigs.length > 0) {
      const orderParts = this.sortConfigs.map((sort) =>
        `${this.escapeIdentifier(sort.field)} ${sort.order.toUpperCase()}`
      );
      orderByClause = `ORDER BY ${orderParts.join(', ')}`;
    } else {
      orderByClause = `ORDER BY ${this.escapeIdentifier(this.config.idField)} DESC`;
    }

    // LIMIT 子句
    let limitClause = '';
    if (withPagination && this.limitCount !== null) {
      limitClause = `LIMIT ${this.limitCount}`;
    }

    // OFFSET 子句
    let offsetClause = '';
    if (withPagination && this.offsetCount !== null) {
      offsetClause = `OFFSET ${this.offsetCount}`;
    }

    const text = `SELECT ${selectClause} ${fromClause}${joinClause} ${whereClause} ${orderByClause} ${limitClause} ${offsetClause}`.trim();

    return { text, params };
  }

  /**
   * 构建 COUNT 查询
   */
  private buildCountQuery(): { text: string; params: unknown[] } {
    const params: unknown[] = [];

    const { whereClause, whereParams } = this.buildWhereClause(1);
    params.push(...whereParams);

    const text = `SELECT COUNT(*) as count FROM ${this.escapeIdentifier(this.config.tableName)} ${whereClause}`;

    return { text, params };
  }

  /**
   * 构建 WHERE 子句
   */
  private buildWhereClause(startIndex: number): { whereClause: string; whereParams: unknown[] } {
    const params: unknown[] = [];
    const conditions: string[] = [];
    let paramIndex = startIndex;

    // 添加软删除过滤
    if (this.config.softDeleteField && !this.includeDeleted) {
      conditions.push(`${this.escapeIdentifier(this.config.softDeleteField)} IS NULL`);
    }

    // 添加 AND 条件
    for (const condition of this.conditions) {
      const { clause, param } = this.buildConditionClause(condition, paramIndex);
      conditions.push(clause);
      params.push(param);
      paramIndex++;
    }

    // 添加 OR 条件组
    for (const orGroup of this.orGroups) {
      const orClauses: string[] = [];
      for (const condition of orGroup) {
        const { clause, param } = this.buildConditionClause(condition, paramIndex);
        orClauses.push(clause);
        params.push(param);
        paramIndex++;
      }
      conditions.push(`(${orClauses.join(' OR ')})`);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    return { whereClause, whereParams: params };
  }

  /**
   * 构建单个条件子句
   */
  private buildConditionClause(
    condition: QueryCondition,
    paramIndex: number,
  ): { clause: string; param: unknown } {
    const field = this.escapeIdentifier(condition.field);
    const paramName = `$${paramIndex}`;

    switch (condition.operator) {
      case 'eq':
        return { clause: `${field} = ${paramName}`, param: condition.value };
      case 'ne':
        return { clause: `${field} <> ${paramName}`, param: condition.value };
      case 'gt':
        return { clause: `${field} > ${paramName}`, param: condition.value };
      case 'gte':
        return { clause: `${field} >= ${paramName}`, param: condition.value };
      case 'lt':
        return { clause: `${field} < ${paramName}`, param: condition.value };
      case 'lte':
        return { clause: `${field} <= ${paramName}`, param: condition.value };
      case 'in':
        return { clause: `${field} = ANY(${paramName})`, param: condition.value };
      case 'nin':
        return { clause: `${field} <> ALL(${paramName})`, param: condition.value };
      case 'like':
        return { clause: `${field} LIKE ${paramName}`, param: condition.value };
      case 'ilike':
        return { clause: `${field} ILIKE ${paramName}`, param: condition.value };
      case 'isNull':
        return { clause: `${field} IS NULL`, param: null };
      case 'isNotNull':
        return { clause: `${field} IS NOT NULL`, param: null };
      default:
        return { clause: `${field} = ${paramName}`, param: condition.value };
    }
  }

  /**
   * 转义标识符（防止 SQL 注入）
   */
  private escapeIdentifier(name: string): string {
    // PostgreSQL 标识符使用双引号包裹
    return `"${name.replace(/"/g, '""')}"`;
  }

  /**
   * 映射数据库行到实体
   */
  private mapRowToEntity(row: Record<string, unknown>): Record<string, unknown> {
    const entity: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
      // 转换 snake_case 到 camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      entity[camelKey] = value;
    }

    // 处理 createdAt 和 updatedAt
    if (entity.createdAt) {
      entity.createdAt = new Date(entity.createdAt as string);
    }
    if (entity.updatedAt) {
      entity.updatedAt = new Date(entity.updatedAt as string);
    }
    if (entity.deletedAt && entity.deletedAt !== null) {
      entity.deletedAt = new Date(entity.deletedAt as string);
    }

    return entity;
  }

  /**
   * 错误处理
   */
  private handleError<T>(error: unknown): ServiceResult<T> {
    if (error instanceof Error) {
      // PostgreSQL 错误码处理
      if ('code' in error) {
        const pgError = error as { code: string; message: string };
        // 唯一性约束冲突
        if (pgError.code === '23505') {
          return createErrorResult(ErrorCode.CONFLICT, `${this.config.entityName}已存在`);
        }
        // 外键约束冲突
        if (pgError.code === '23503') {
          return createErrorResult(ErrorCode.VALIDATION_ERROR, `关联数据不存在`);
        }
      }
      return createErrorResult(ErrorCode.UNKNOWN_ERROR, error.message);
    }
    return createErrorResult(ErrorCode.UNKNOWN_ERROR, '查询执行失败');
  }
}
