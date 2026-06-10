/**
 * 数据库连接模块入口
 *
 * 提供数据库连接管理和事务支持。
 *
 * @module @yunshu/server-core/database
 */

// ============================================================================
// PostgreSQL
// ============================================================================

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
