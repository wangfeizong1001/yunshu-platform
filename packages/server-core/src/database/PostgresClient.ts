/**
 * PostgreSQL 连接管理器
 *
 * 提供单例模式的 PostgreSQL 连接池管理，支持：
 * - 连接池管理
 * - 健康检查
 * - 事务支持
 * - 优雅关闭
 *
 * @module @yunshu/server-core/database/PostgresClient
 */

import type { Pool, PoolConfig, QueryResult, PoolClient } from 'pg';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * PostgreSQL 连接配置
 */
export interface PostgresConfig {
  /** 主机地址 */
  host?: string;
  /** 端口 */
  port?: number;
  /** 用户名 */
  user?: string;
  /** 密码 */
  password?: string;
  /** 数据库名 */
  database?: string;
  /** 连接池最小连接数 */
  min?: number;
  /** 连接池最大连接数 */
  max?: number;
  /** 连接空闲超时（毫秒） */
  idleTimeoutMillis?: number;
  /** 连接超时（毫秒） */
  connectionTimeoutMillis?: number;
  /** 最大重试次数 */
  maxRetries?: number;
}

/**
 * PostgreSQL 健康检查结果
 */
export interface PostgresHealthCheckResult {
  /** 是否健康 */
  healthy: boolean;
  /** 连接池状态 */
  poolStatus?: {
    total: number;
    idle: number;
    waiting: number;
  };
  /** 响应时间（毫秒） */
  latency?: number;
  /** 错误信息 */
  error?: string;
  /** 服务器版本 */
  version?: string;
}

/**
 * 事务选项
 */
export interface TransactionOptions {
  /** 隔离级别 */
  isolationLevel?: 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: PostgresConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'yunshu',
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxRetries: 3,
};

// ============================================================================
// PostgreSQL 连接管理器
// ============================================================================

/**
 * PostgreSQL 连接管理器（单例模式）
 *
 * @example
 * ```typescript
 * // 初始化连接
 * const pgManager = PostgresClientManager.getInstance();
 * await pgManager.connect({ host: 'localhost', database: 'mydb' });
 *
 * // 获取连接池
 * const pool = pgManager.getPool();
 * const result = await pool.query('SELECT * FROM users');
 *
 * // 执行事务
 * await pgManager.transaction(async (client) => {
 *   await client.query('INSERT INTO users (name) VALUES ($1)', ['Alice']);
 *   await client.query('INSERT INTO logs (action) VALUES ($1)', ['create_user']);
 * });
 *
 * // 健康检查
 * const health = await pgManager.healthCheck();
 * console.log(health.healthy);
 *
 * // 关闭连接
 * await pgManager.disconnect();
 * ```
 */
export class PostgresClientManager {
  private static instance: PostgresClientManager | null = null;

  private pool: Pool | null = null;
  private config: PostgresConfig = {};
  private connected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): PostgresClientManager {
    if (!PostgresClientManager.instance) {
      PostgresClientManager.instance = new PostgresClientManager();
    }
    return PostgresClientManager.instance;
  }

  /**
   * 重置单例（仅用于测试）
   */
  public static resetInstance(): void {
    if (PostgresClientManager.instance?.pool) {
      PostgresClientManager.instance.pool.end();
    }
    PostgresClientManager.instance = null;
  }

  /**
   * 连接 PostgreSQL
   */
  public async connect(config: PostgresConfig = {}): Promise<void> {
    // 如果正在连接中，等待连接完成
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // 如果已连接，直接返回
    if (this.pool && this.connected) {
      return;
    }

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.connectionPromise = this.doConnect();

    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  /**
   * 执行连接
   */
  private async doConnect(): Promise<void> {
    try {
      // 动态导入 pg
      const { Pool } = await import('pg');

      const poolConfig: PoolConfig = {
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        min: this.config.min,
        max: this.config.max,
        idleTimeoutMillis: this.config.idleTimeoutMillis,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis,
      };

      this.pool = new Pool(poolConfig);

      // 监听错误事件
      this.pool.on('error', (err) => {
        console.error('[PostgreSQL] 连接池错误:', err.message);
      });

      // 测试连接
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1');
        this.connected = true;
        console.log('[PostgreSQL] 已连接到数据库:', this.config.database);
      } finally {
        client.release();
      }

    } catch (error) {
      this.connected = false;
      this.pool = null;
      throw error;
    }
  }

  /**
   * 获取连接池
   */
  public getPool(): Pool {
    if (!this.pool) {
      throw new Error('PostgreSQL 连接池未初始化，请先调用 connect()');
    }
    return this.pool;
  }

  /**
   * 检查是否已连接
   */
  public isConnected(): boolean {
    return this.pool !== null && this.connected;
  }

  /**
   * 执行事务
   *
   * @example
   * ```typescript
   * const result = await pgManager.transaction(async (client) => {
   *   const userResult = await client.query('INSERT INTO users VALUES ($1) RETURNING *', ['Alice']);
   *   await client.query('INSERT INTO logs VALUES ($1)', ['user_created']);
   *   return userResult.rows[0];
   * });
   * ```
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
    options: TransactionOptions = {},
  ): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();

    try {
      // 开始事务
      if (options.isolationLevel) {
        await client.query(`BEGIN ISOLATION LEVEL ${options.isolationLevel}`);
      } else {
        await client.query('BEGIN');
      }

      // 执行回调
      const result = await callback(client);

      // 提交事务
      await client.query('COMMIT');

      return result;

    } catch (error) {
      // 回滚事务
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * 健康检查
   */
  public async healthCheck(): Promise<PostgresHealthCheckResult> {
    if (!this.pool) {
      return {
        healthy: false,
        error: 'PostgreSQL 连接池未初始化',
      };
    }

    try {
      const startTime = Date.now();

      const result = await this.pool.query('SELECT version()');
      const latency = Date.now() - startTime;

      const version = result.rows[0]?.version || '';

      return {
        healthy: true,
        latency,
        version,
        poolStatus: {
          total: this.pool.totalCount,
          idle: this.pool.idleCount,
          waiting: this.pool.waitingCount,
        },
      };

    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : '健康检查失败',
      };
    }
  }

  /**
   * 执行原始查询（便捷方法）
   */
  public async query<T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    const pool = this.getPool();
    return pool.query<T>(text, params);
  }

  /**
   * 关闭连接
   */
  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.connected = false;
      console.log('[PostgreSQL] 已断开连接');
    }
  }

  /**
   * 获取配置
   */
  public getConfig(): PostgresConfig {
    return { ...this.config };
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 获取连接池（便捷函数）
 */
export function getPostgresPool(): Pool {
  return PostgresClientManager.getInstance().getPool();
}

/**
 * 检查 PostgreSQL 是否可用
 */
export function isPostgresAvailable(): boolean {
  return PostgresClientManager.getInstance().isConnected();
}

/**
 * 初始化 PostgreSQL 连接（便捷函数）
 */
export async function initPostgres(config: PostgresConfig = {}): Promise<void> {
  await PostgresClientManager.getInstance().connect(config);
}

/**
 * 关闭 PostgreSQL 连接（便捷函数）
 */
export async function closePostgres(): Promise<void> {
  await PostgresClientManager.getInstance().disconnect();
}

/**
 * 执行事务（便捷函数）
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  options?: TransactionOptions,
): Promise<T> {
  return PostgresClientManager.getInstance().transaction(callback, options);
}
