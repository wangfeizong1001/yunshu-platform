/**
 * 数据库连接模块入口
 *
 * @module @yunshu/server-core/database
 */

export {
  PostgresClientManager,
  getPostgresPool,
  isPostgresAvailable,
  initPostgres,
  closePostgres,
  withTransaction,
} from './PostgresClient';

export type {
  PostgresConfig,
  PostgresHealthCheckResult,
  TransactionOptions,
} from './PostgresClient';
