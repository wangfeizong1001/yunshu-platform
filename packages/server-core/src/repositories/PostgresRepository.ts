/**
 * PostgreSQL Repository 适配器
 *
 * 实现 IRepository 接口的 PostgreSQL 具体实现。
 *
 * @module @yunshu/server-core/repositories/PostgresRepository
 */

import type { Pool } from 'pg';
import type { IRepository, IEntity, QueryCondition, QueryConfig } from './IRepository';
import type { ServiceResult, PaginationParams, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult } from '@yunshu/shared';
import { ErrorCode } from '../errors/BusinessError';
import { PostgresQueryBuilder } from './PostgresQueryBuilder';

/**
 * PostgreSQL Repository 配置
 */
export interface PostgresRepositoryConfig {
  tableName: string;
  idField?: string;
  createdAtField?: string;
  updatedAtField?: string;
  softDeleteField?: string;
  entityName?: string;
}

/**
 * PostgreSQL Repository 适配器
 */
export class PostgresRepository<T extends IEntity>
  implements IRepository<T, string>
{
  protected pool: Pool;
  protected config: Required<PostgresRepositoryConfig>;

  constructor(pool: Pool, config: PostgresRepositoryConfig) {
    this.pool = pool;
    this.config = {
      idField: 'id',
      createdAtField: 'created_at',
      updatedAtField: 'updated_at',
      softDeleteField: 'deleted_at',
      entityName: config.tableName,
      ...config,
    };
  }

  getEntityName(): string {
    return this.config.entityName;
  }

  getTableName(): string {
    return this.config.tableName;
  }

  protected createQueryBuilder(): PostgresQueryBuilder<T> {
    return new PostgresQueryBuilder<T>(this.pool, {
      tableName: this.config.tableName,
      idField: this.config.idField,
      softDeleteField: this.config.softDeleteField,
      entityName: this.config.entityName,
    });
  }

  protected toSnakeCase(name: string): string {
    return name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  protected buildBaseConditions(config?: QueryConfig): QueryCondition[] {
    const conditions: QueryCondition[] = [];
    if (
      this.config.softDeleteField &&
      (config?.useSoftDeleteFilter ?? true) &&
      !config?.includeDeleted
    ) {
      conditions.push({
        field: this.config.softDeleteField,
        operator: 'isNull',
        value: null,
      });
    }
    return conditions;
  }

  // ==========================================================================
  // CRUD 操作
  // ==========================================================================

  async findById(id: string): Promise<ServiceResult<T | null>> {
    try {
      const qb = this.createQueryBuilder();
      return await qb
        .where({ field: this.config.idField, operator: 'eq', value: id })
        .executeOne();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findOne(where: QueryCondition[]): Promise<ServiceResult<T | null>> {
    try {
      const qb = this.createQueryBuilder();
      for (const condition of where) {
        qb.where(condition);
      }
      return await qb.executeOne();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findAll(config?: QueryConfig): Promise<ServiceResult<T[]>> {
    try {
      const qb = this.createQueryBuilder();
      const baseConditions = this.buildBaseConditions(config);
      for (const condition of baseConditions) {
        qb.where(condition);
      }
      if (config?.where) {
        for (const condition of config.where) {
          qb.where(condition);
        }
      }
      if (config?.orderBy) {
        qb.orderBy(config.orderBy);
      }
      if (config?.populate) {
        for (const populate of config.populate) {
          qb.populate(populate);
        }
      }
      if (config?.select) {
        qb.select(config.select);
      }
      if (config?.includeDeleted) {
        qb.withDeleted();
      }
      return await qb.executeMany();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(data: Partial<T>): Promise<ServiceResult<T>> {
    try {
      const now = new Date();
      const fields: string[] = [];
      const values: unknown[] = [];
      const placeholders: string[] = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(data)) {
        if (key === 'id' || key === 'createdAt' || key === 'updatedAt') continue;
        const snakeKey = this.toSnakeCase(key);
        fields.push(`"${snakeKey}"`);
        placeholders.push(`$${paramIndex}`);
        values.push(value);
        paramIndex++;
      }

      fields.push(`"${this.config.createdAtField}"`);
      fields.push(`"${this.config.updatedAtField}"`);
      placeholders.push(`$${paramIndex++}`);
      placeholders.push(`$${paramIndex++}`);
      values.push(now);
      values.push(now);

      const text = `
        INSERT INTO "${this.config.tableName}"
        (${fields.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;

      const result = await this.pool.query(text, values);
      const row = this.mapRowToEntity(result.rows[0]);
      return createSuccessResult(row as T, `${this.config.entityName}创建成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<ServiceResult<T>> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(data)) {
        if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt') continue;
        const snakeKey = this.toSnakeCase(key);
        fields.push(`"${snakeKey}" = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }

      fields.push(`"${this.config.updatedAtField}" = $${paramIndex}`);
      values.push(new Date());
      paramIndex++;
      values.push(id);

      const text = `
        UPDATE "${this.config.tableName}"
        SET ${fields.join(', ')}
        WHERE "${this.config.idField}" = $${paramIndex}
        ${this.config.softDeleteField ? `AND "${this.config.softDeleteField}" IS NULL` : ''}
        RETURNING *
      `;

      const result = await this.pool.query(text, values);

      if (result.rows.length === 0) {
        return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
      }

      const row = this.mapRowToEntity(result.rows[0]);
      return createSuccessResult(row as T, `${this.config.entityName}更新成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    try {
      const text = `
        DELETE FROM "${this.config.tableName}"
        WHERE "${this.config.idField}" = $1
        RETURNING "${this.config.idField}"
      `;
      const result = await this.pool.query(text, [id]);

      if (result.rowCount === 0) {
        return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
      }

      return createSuccessResult(true, `${this.config.entityName}删除成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 扩展操作
  // ==========================================================================

  async count(where?: QueryCondition[], config?: { includeDeleted?: boolean }): Promise<ServiceResult<number>> {
    try {
      const conditions = this.buildBaseConditions({ includeDeleted: config?.includeDeleted });
      if (where) {
        conditions.push(...where);
      }

      const params: unknown[] = [];
      const conditionParts: string[] = [];
      let paramIndex = 1;

      for (const condition of conditions) {
        const clause = this.buildConditionClause(condition, paramIndex);
        conditionParts.push(clause);
        if (condition.value !== null) {
          params.push(condition.value);
          paramIndex++;
        }
      }

      const whereClause = conditionParts.length > 0 ? `WHERE ${conditionParts.join(' AND ')}` : '';
      const text = `SELECT COUNT(*) as count FROM "${this.config.tableName}" ${whereClause}`;
      const result = await this.pool.query(text, params);

      const count = parseInt(result.rows[0]?.count || '0', 10);
      return createSuccessResult(count);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exists(id: string): Promise<ServiceResult<boolean>> {
    try {
      const text = `
        SELECT 1 FROM "${this.config.tableName}"
        WHERE "${this.config.idField}" = $1
        ${this.config.softDeleteField ? `AND "${this.config.softDeleteField}" IS NULL` : ''}
        LIMIT 1
      `;
      const result = await this.pool.query(text, [id]);
      return createSuccessResult(result.rows.length > 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findWithPagination(
    params: PaginationParams,
    config?: QueryConfig,
  ): Promise<ServiceResult<PaginatedResult<T>>> {
    try {
      const qb = this.createQueryBuilder();
      const baseConditions = this.buildBaseConditions(config);
      for (const condition of baseConditions) {
        qb.where(condition);
      }
      if (config?.where) {
        for (const condition of config.where) {
          qb.where(condition);
        }
      }
      if (config?.orderBy) {
        qb.orderBy(config.orderBy);
      } else {
        qb.orderBy({ field: this.config.createdAtField, order: 'desc' });
      }
      if (config?.includeDeleted) {
        qb.withDeleted();
      }
      return await qb.executePaginated(params);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 软删除
  // ==========================================================================

  async softDelete(id: string): Promise<ServiceResult<boolean>> {
    if (!this.config.softDeleteField) {
      return this.delete(id);
    }

    try {
      const text = `
        UPDATE "${this.config.tableName}"
        SET "${this.config.softDeleteField}" = $1
        WHERE "${this.config.idField}" = $2
        ${this.config.softDeleteField ? `AND "${this.config.softDeleteField}" IS NULL` : ''}
        RETURNING "${this.config.idField}"
      `;
      const result = await this.pool.query(text, [new Date(), id]);

      if (result.rowCount === 0) {
        return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
      }

      return createSuccessResult(true, `${this.config.entityName}已删除`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async restore(id: string): Promise<ServiceResult<T>> {
    if (!this.config.softDeleteField) {
      return createErrorResult(ErrorCode.UNKNOWN_ERROR, `${this.config.entityName}不支持软删除`);
    }

    try {
      const text = `
        UPDATE "${this.config.tableName}"
        SET "${this.config.softDeleteField}" = NULL
        WHERE "${this.config.idField}" = $1
        RETURNING *
      `;
      const result = await this.pool.query(text, [id]);

      if (result.rows.length === 0) {
        return createErrorResult(ErrorCode.NOT_FOUND, `${this.config.entityName}不存在`);
      }

      const row = this.mapRowToEntity(result.rows[0]);
      return createSuccessResult(row as T, `${this.config.entityName}已恢复`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 批量操作
  // ==========================================================================

  async createMany(data: Partial<T>[]): Promise<ServiceResult<T[]>> {
    if (data.length === 0) {
      return createSuccessResult([]);
    }

    try {
      const now = new Date();
      const fields: string[] = [];
      const rows: unknown[][] = [];
      let paramIndex = 1;

      const fieldSet = new Set<string>();
      for (const item of data) {
        for (const key of Object.keys(item)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            fieldSet.add(this.toSnakeCase(key));
          }
        }
      }
      fields.push(...fieldSet);
      fields.push(this.config.createdAtField);
      fields.push(this.config.updatedAtField);

      for (const item of data) {
        const row: unknown[] = [];
        for (const field of fields) {
          if (field === this.config.createdAtField || field === this.config.updatedAtField) {
            row.push(now);
          } else {
            const camelField = field.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
            row.push(item[camelField as keyof T] ?? null);
          }
        }
        rows.push(row);
      }

      const values: unknown[] = [];
      const valuePlaceholders: string[] = [];

      for (const row of rows) {
        const placeholders: string[] = [];
        for (const value of row) {
          placeholders.push(`$${paramIndex++}`);
          values.push(value);
        }
        valuePlaceholders.push(`(${placeholders.join(', ')})`);
      }

      const text = `
        INSERT INTO "${this.config.tableName}"
        (${fields.map((f) => `"${f}"`).join(', ')})
        VALUES ${valuePlaceholders.join(', ')}
        RETURNING *
      `;

      const result = await this.pool.query(text, values);
      const entities = result.rows.map((row) => this.mapRowToEntity(row));
      return createSuccessResult(entities as T[], `${this.config.entityName}批量创建成功`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateMany(where: QueryCondition[], data: Partial<T>): Promise<ServiceResult<number>> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(data)) {
        if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt') continue;
        const snakeKey = this.toSnakeCase(key);
        fields.push(`"${snakeKey}" = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }

      fields.push(`"${this.config.updatedAtField}" = $${paramIndex}`);
      values.push(new Date());
      paramIndex++;

      const conditionParts: string[] = [];
      for (const condition of where) {
        const clause = this.buildConditionClause(condition, paramIndex);
        conditionParts.push(clause);
        if (condition.value !== null) {
          values.push(condition.value);
          paramIndex++;
        }
      }

      if (this.config.softDeleteField) {
        conditionParts.push(`"${this.config.softDeleteField}" IS NULL`);
      }

      const text = `
        UPDATE "${this.config.tableName}"
        SET ${fields.join(', ')}
        WHERE ${conditionParts.join(' AND ')}
      `;

      const result = await this.pool.query(text, values);
      return createSuccessResult(result.rowCount ?? 0, `更新了 ${result.rowCount} 条记录`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteMany(ids: string[]): Promise<ServiceResult<number>> {
    if (ids.length === 0) {
      return createSuccessResult(0);
    }

    try {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
      const text = `
        DELETE FROM "${this.config.tableName}"
        WHERE "${this.config.idField}" IN (${placeholders})
      `;
      const result = await this.pool.query(text, ids);
      return createSuccessResult(result.rowCount ?? 0, `删除了 ${result.rowCount} 条记录`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // 辅助方法
  // ==========================================================================

  private buildConditionClause(condition: QueryCondition, paramIndex: number): string {
    const field = `"${this.toSnakeCase(condition.field)}"`;
    switch (condition.operator) {
      case 'eq': return `${field} = $${paramIndex}`;
      case 'ne': return `${field} <> $${paramIndex}`;
      case 'gt': return `${field} > $${paramIndex}`;
      case 'gte': return `${field} >= $${paramIndex}`;
      case 'lt': return `${field} < $${paramIndex}`;
      case 'lte': return `${field} <= $${paramIndex}`;
      case 'in': return `${field} = ANY($${paramIndex})`;
      case 'nin': return `${field} <> ALL($${paramIndex})`;
      case 'like': return `${field} LIKE $${paramIndex}`;
      case 'ilike': return `${field} ILIKE $${paramIndex}`;
      case 'isNull': return `${field} IS NULL`;
      case 'isNotNull': return `${field} IS NOT NULL`;
      default: return `${field} = $${paramIndex}`;
    }
  }

  private mapRowToEntity(row: Record<string, unknown>): Record<string, unknown> {
    const entity: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      entity[camelKey] = value;
    }
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

  protected handleError<T>(error: unknown): ServiceResult<T> {
    if (error instanceof Error) {
      if ('code' in error) {
        const pgError = error as { code: string; message: string };
        if (pgError.code === '23505') {
          return createErrorResult(ErrorCode.CONFLICT, `${this.config.entityName}已存在`);
        }
        if (pgError.code === '23503') {
          return createErrorResult(ErrorCode.VALIDATION_ERROR, `关联的${this.config.entityName}不存在`);
        }
      }
      return createErrorResult(ErrorCode.UNKNOWN_ERROR, error.message);
    }
    return createErrorResult(ErrorCode.UNKNOWN_ERROR, '未知错误');
  }
}
