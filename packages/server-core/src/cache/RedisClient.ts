/**
 * Redis 客户端类型定义
 *
 * @module @yunshu/server-core/cache/RedisClient
 */

/** Redis 连接配置 */
export interface RedisConfig {
  /** 主机地址 */
  host?: string;
  /** 端口 */
  port?: number;
  /** 密码 */
  password?: string;
  /** 数据库编号 */
  db?: number;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟（毫秒） */
  retryDelayMs?: number;
}

/** Redis 客户端状态 */
export type RedisClientStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

/** Redis 健康检查结果 */
export interface RedisHealthCheckResult {
  /** 是否健康 */
  healthy: boolean;
  /** 响应时间（毫秒） */
  latency?: number;
  /** 状态 */
  status?: RedisClientStatus;
  /** 错误信息 */
  error?: string;
}
