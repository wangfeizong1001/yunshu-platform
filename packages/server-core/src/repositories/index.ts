/**
 * 数据访问层模块入口
 *
 * @module @yunshu/server-core/repositories
 */

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

export { PostgresQueryBuilder } from './PostgresQueryBuilder';
export type { PostgresQueryBuilderConfig } from './PostgresQueryBuilder';

export { PostgresRepository } from './PostgresRepository';
export type { PostgresRepositoryConfig } from './PostgresRepository';
