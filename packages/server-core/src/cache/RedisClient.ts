/**
 * Redis 客户端管理模块
 *
 * 提供单例模式的 Redis 连接管理，支持：
 * - 连接池管理
 * - 健康检查
 * - 自动重连
 * - 优雅关闭
 *
 * @module @yunshu/server-core/cache/RedisClient
 */

import type Redis from 'ioredis';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * Redis 连接配置
 */
export interface RedisConfig {
  /** Redis 主机地址 */
  host?: string;
  /** Redis 端口 */
  port?: number;
  /** 密码 */
  password?: string;
  /** 数据库索引 */
  db?: number;
  /** 键前缀 */
  keyPrefix?: string;
  /** 连接超时（毫秒） */
  connectTimeout?: number;
  /** 最大重试次数 */
  maxRetriesPerRequest?: number;
  /** 是否启用离线队列 */
  enableOfflineQueue?: boolean;
  /** 离线队列最大长度 */
  offlineQueueMaxSize?: number;
}

/**
 * Redis 客户端状态
 */
export type RedisClientStatus = 'disconnected' | 'connecting' | 'connected' | 'ready' | 'error';

/**
 * Redis 健康检查结果
 */
export interface RedisHealthCheckResult {
  /** 是否健康 */
  healthy: boolean;
  /** 状态 */
  status: RedisClientStatus;
  /** 响应时间（毫秒） */
  latency?: number;
  /** 错误信息 */
  error?: string;
  /** 服务器信息 */
  serverInfo?: {
    version?: string;
    connectedClients?: number;
    usedMemory?: string;
    uptime?: number;
  };
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<Omit<RedisConfig, 'password'>> & { password?: string } = {
  host: 'localhost',
  port: 6379,
  password: undefined,
  db: 0,
  keyPrefix: 'yunshu:',
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  offlineQueueMaxSize: 100,
};

// ============================================================================
// Redis 客户端管理器
// ============================================================================

/**
 * Redis 客户端管理器（单例模式）
 *
 * @example
 * ```typescript
 * // 初始化
 * const redisManager = RedisClientManager.getInstance();
 * await redisManager.connect({ host: 'localhost', port: 6379 });
 *
 * // 获取客户端
 * const client = redisManager.getClient();
 * if (client) {
 *   await client.set('key', 'value');
 * }
 *
 * // 健康检查
 * const health = await redisManager.healthCheck();
 * console.log(health.healthy);
 *
 * // 关闭连接
 * await redisManager.disconnect();
 * ```
 */
export class RedisClientManager {
  private static instance: RedisClientManager | null = null;

  private client: Redis | null = null;
  private status: RedisClientStatus = 'disconnected';
  private config: RedisConfig = {};
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): RedisClientManager {
    if (!RedisClientManager.instance) {
      RedisClientManager.instance = new RedisClientManager();
    }
    return RedisClientManager.instance;
  }

  /**
   * 重置单例（仅用于测试）
   */
  public static resetInstance(): void {
    RedisClientManager.instance = null;
  }

  /**
   * 连接 Redis
   */
  public async connect(config: RedisConfig = {}): Promise<void> {
    // 如果正在连接中，等待连接完成
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // 如果已连接且配置相同，直接返回
    if (this.client && this.status === 'ready') {
      return;
    }

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.status = 'connecting';

    this.connectionPromise = this.doConnect();

    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  /**
   * 执行连接逻辑
   */
  private async doConnect(): Promise<void> {
    try {
      // 动态导入 ioredis
      const IORedis = await import('ioredis');

      const mergedConfig = { ...DEFAULT_CONFIG, ...this.config };

      this.client = new IORedis.default({
        host: mergedConfig.host,
        port: mergedConfig.port,
        password: mergedConfig.password,
        db: mergedConfig.db,
        keyPrefix: mergedConfig.keyPrefix,
        connectTimeout: mergedConfig.connectTimeout,
        maxRetriesPerRequest: mergedConfig.maxRetriesPerRequest,
        enableOfflineQueue: mergedConfig.enableOfflineQueue,
        // 重试策略
        retryStrategy: (times: number) => {
          if (times > mergedConfig.maxRetriesPerRequest) {
            console.error('[Redis] 连接重试次数超过上限，停止重试');
            return null; // 停止重试
          }
          // 指数退避：1s, 2s, 4s, 8s...
          const delay = Math.min(times * 1000, 10000);
          console.warn(`[Redis] 第 ${times} 次重试连接，延迟 ${delay}ms`);
          return delay;
        },
      });

      // 事件监听
      this.client.on('connect', () => {
        this.status = 'connected';
        console.log('[Redis] 已连接到服务器');
      });

      this.client.on('ready', () => {
        this.status = 'ready';
        console.log('[Redis] 客户端就绪');
      });

      this.client.on('error', (error: Error) => {
        console.error('[Redis] 连接错误:', error.message);
        this.status = 'error';
      });

      this.client.on('close', () => {
        console.warn('[Redis] 连接已关闭');
        this.status = 'disconnected';
      });

      this.client.on('reconnecting', () => {
        this.status = 'connecting';
        console.log('[Redis] 正在重新连接...');
      });

      // 等待就绪
      await new Promise<void>((resolve, reject) => {
        if (!this.client) {
          reject(new Error('Redis 客户端未初始化'));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error('Redis 连接超时'));
        }, mergedConfig.connectTimeout);

        this.client!.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.client!.once('error', (error: Error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    } catch (error) {
      this.status = 'error';
      this.client = null;
      throw error;
    }
  }

  /**
   * 获取 Redis 客户端
   */
  public getClient(): Redis | null {
    return this.client;
  }

  /**
   * 检查是否已连接
   */
  public isConnected(): boolean {
    return this.client !== null && this.status === 'ready';
  }

  /**
   * 获取当前状态
   */
  public getStatus(): RedisClientStatus {
    return this.status;
  }

  /**
   * 健康检查
   */
  public async healthCheck(): Promise<RedisHealthCheckResult> {
    if (!this.client || this.status !== 'ready') {
      return {
        healthy: false,
        status: this.status,
        error: 'Redis 客户端未连接',
      };
    }

    try {
      const startTime = Date.now();

      // 执行 PING 命令
      const pong = await this.client.ping();
      const latency = Date.now() - startTime;

      if (pong !== 'PONG') {
        return {
          healthy: false,
          status: this.status,
          latency,
          error: 'PING 响应异常',
        };
      }

      // 获取服务器信息
      const info = await this.client.info();
      const serverInfo = this.parseRedisInfo(info);

      return {
        healthy: true,
        status: this.status,
        latency,
        serverInfo,
      };
    } catch (error) {
      return {
        healthy: false,
        status: this.status,
        error: error instanceof Error ? error.message : '健康检查失败',
      };
    }
  }

  /**
   * 解析 Redis INFO 命令输出
   */
  private parseRedisInfo(info: string): RedisHealthCheckResult['serverInfo'] {
    const result: RedisHealthCheckResult['serverInfo'] = {};

    const lines = info.split('\r\n');
    for (const line of lines) {
      const parts = line.split(':');
      const value = parts[1];
      if (!value) continue;

      if (line.startsWith('redis_version:')) {
        result.version = value;
      } else if (line.startsWith('connected_clients:')) {
        result.connectedClients = parseInt(value, 10);
      } else if (line.startsWith('used_memory_human:')) {
        result.usedMemory = value;
      } else if (line.startsWith('uptime_in_seconds:')) {
        result.uptime = parseInt(value, 10);
      }
    }

    return result;
  }

  /**
   * 断开连接
   */
  public async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.quit();
    } catch (error) {
      // 强制关闭
      this.client.disconnect(false);
    } finally {
      this.client = null;
      this.status = 'disconnected';
      console.log('[Redis] 已断开连接');
    }
  }

  /**
   * 获取配置
   */
  public getConfig(): RedisConfig {
    return { ...this.config };
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 获取 Redis 客户端（便捷函数）
 */
export function getRedisClient(): Redis | null {
  return RedisClientManager.getInstance().getClient();
}

/**
 * 检查 Redis 是否可用
 */
export function isRedisAvailable(): boolean {
  return RedisClientManager.getInstance().isConnected();
}

/**
 * 初始化 Redis 连接（便捷函数）
 */
export async function initRedis(config: RedisConfig = {}): Promise<void> {
  await RedisClientManager.getInstance().connect(config);
}

/**
 * 关闭 Redis 连接（便捷函数）
 */
export async function closeRedis(): Promise<void> {
  await RedisClientManager.getInstance().disconnect();
}
