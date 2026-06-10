/**
 * 数据访问层模块入口
 *
 * 提供统一的数据访问抽象，支持多数据库适配器。
 *
 * @module @yunshu/server-core/repositories
 */

// ============================================================================
// 接口定义
// ============================================================================

export type {
  IEntity,
  ISoftDelete,
  QueryOperator,
  QueryCondition,
  SortConfig,
  PopulateConfig,
  QueryConfig,
  IRepository,
  IRepositoryFactory,
  IQueryBuilder,
} from './IRepository';

// ============================================================================
// PostgreSQL 实现
// ============================================================================

export { PostgresQueryBuilder } from './PostgresQueryBuilder';
export type { PostgresQueryBuilderConfig } from './PostgresQueryBuilder';

export { PostgresRepository } from './PostgresRepository';
export type { PostgresRepositoryConfig } from './PostgresRepository';
