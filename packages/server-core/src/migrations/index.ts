/**
 * 数据迁移模块入口
 *
 * @module @yunshu/server-core/migrations
 */

export { MigrationUtils, AUDIT_COLUMNS, AUDIT_INDEXES, createAuditableTable } from './MigrationUtils';

export type {
  TableDefinition,
  ColumnDefinition,
  IndexDefinition,
  ForeignKeyDefinition,
  MigrationResult,
} from './MigrationUtils';
