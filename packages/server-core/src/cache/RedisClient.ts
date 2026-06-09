/**
 * Redis 连接管理器
 *
 * 提供单例模式的 Redis 连接管理，支持：
 * - 连接池管理（通过 ioredis 内置）
 * - 健康检查
 * - 优雅关闭
 *
 * @module @yunshu/server-core/cache/RedisClient
 */

import type { Redis, RedisOptions } from 'ioredis';

// ============================================================================
// 类型定义
// ============================================================================

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

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<Omit<RedisConfig, 'password'>> & { password?: string } = {
  host: 'localhost',
  port: 6379,
  db: 0,
  maxRetries: 3,
  retryDelayMs: 1000,
};

// ============================================================================
// Redis 连接管理器
// ============================================================================

/**
 * Redis 连接管理器（单例模式）
 */
export class RedisClientManager {
  private static instance: RedisClientManager | null = null;

  private client: Redis | null = null;
  private config: RedisConfig = {};
  private status: RedisClientStatus = 'disconnected';
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  /** 获取单例实例 */
  public static getInstance(): RedisClientManager {
    if (!RedisClientManager.instance) {
      RedisClientManager.instance = new RedisClientManager();
    }
    return RedisClientManager.instance;
  }

  /** 重置单例（仅用于测试） */
  public static resetInstance(): void {
    if (RedisClientManager.instance?.client) {
      RedisClientManager.instance.client.disconnect();
    }
    RedisClientManager.instance = null;
  }

  /** 连接 Redis */
  public async connect(config: RedisConfig = {}): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.client && this.status === 'connected') {
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

  private async doConnect(): Promise<void> {
    this.status = 'connecting';

    try {
      const ioredisModule = await import('ioredis');
      const RedisCtor = ioredisModule.default ?? ioredisModule.Redis;

      const options: RedisOptions = {
        host: this.config.host,
        port: this.config.port,
        db: this.config.db,
        password: this.config.password,
        maxRetriesPerRequest: this.config.maxRetries ?? 3,
        enableReadyCheck: true,
        lazyConnect: false,
        retryStrategy: (times: number) => {
          const delay = this.config.retryDelayMs ?? 1000;
          return Math.min(times * delay, 10000);
        },
      };

      this.client = new RedisCtor(options) as Redis;

      this.client.on('connect', () => {
        this.status = 'connected';
        console.log('[Redis] 已连接');
      });

      this.client.on('reconnecting', () => {
        this.status = 'reconnecting';
        console.log('[Redis] 尝试重连...');
      });

      this.client.on('error', (err) => {
        this.status = 'error';
        console.error('[Redis] 连接错误:', err.message);
      });

      // 等待连接就绪
      await new Promise<void>((resolve, reject) => {
        if (!this.client) {
          reject(new Error('Redis client 未初始化'));
          return;
        }
        const timeout = setTimeout(() => {
          reject(new Error('Redis 连接超时'));
        }, 5000);
        this.client.once('ready', () => {
          clearTimeout(timeout);
          this.status = 'connected';
          resolve();
        });
        this.client.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

    } catch (error) {
      this.status = 'error';
      this.client = null;
      throw error;
    }
  }

  /** 获取 Redis 客户端 */
  public getClient(): Redis | null {
    return this.client;
  }

  /** 获取当前状态 */
  public getStatus(): RedisClientStatus {
    return this.status;
  }

  /** 检查是否已连接 */
  public isAvailable(): boolean {
    return this.client !== null && this.status === 'connected';
  }

  /** 健康检查 */
  public async healthCheck(): Promise<RedisHealthCheckResult> {
    if (!this.client) {
      return {
        healthy: false,
        status: this.status,
        error: 'Redis 客户端未初始化',
      };
    }

    try {
      const startTime = Date.now();
      await this.client.ping();
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        latency,
        status: this.status,
      };
    } catch (error) {
      return {
        healthy: false,
        status: this.status,
        error: error instanceof Error ? error.message : '健康检查失败',
      };
    }
  }

  /** 关闭连接 */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.status = 'disconnected';
      console.log('[Redis] 已断开连接');
    }
  }

  /** 获取配置 */
  public getConfig(): RedisConfig {
    return { ...this.config };
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/** 获取 Redis 客户端 */
export function getRedisClient(): ReturnType<typeof RedisClientManager.prototype.getClient> {
  return RedisClientManager.getInstance().getClient();
}

/** 检查 Redis 是否可用 */
export function isRedisAvailable(): boolean {
  return RedisClientManager.getInstance().isAvailable();
}

/** 获取当前状态 */
export function getRedisStatus(): RedisClientStatus {
  return RedisClientManager.getInstance().getStatus();
}

/** 初始化 Redis 连接 */
export async function initRedis(config: RedisConfig = {}): Promise<void> {
  await RedisClientManager.getInstance().connect(config);
}

/** 关闭 Redis 连接 */
export async function closeRedis(): Promise<void> {
  await RedisClientManager.getInstance().disconnect();
}

/** Redis 健康检查 */
export async function healthCheck(): Promise<RedisHealthCheckResult> {
  return RedisClientManager.getInstance().healthCheck();
}
