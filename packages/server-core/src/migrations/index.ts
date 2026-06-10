/**
 * 数据迁移模块入口
 *
 * 提供数据迁移工具，支持从 MongoDB 到 PostgreSQL 的迁移。
 *
 * @module @yunshu/server-core/migrations
 */

export { MigrationUtils } from './MigrationUtils';

export type {
  TableDefinition,
  ColumnDefinition,
  IndexDefinition,
  ForeignKeyDefinition,
  MigrationResult,
} from './MigrationUtils';

export { AUDIT_COLUMNS, AUDIT_INDEXES, createAuditableTable } from './MigrationUtils';
