/**
 * 缓存预热机制模块
 *
 * 提供缓存预热和定时刷新功能，支持：
 * - 启动时预热关键数据
 * - 定时刷新缓存
 * - 按需预热
 * - 预热任务管理
 *
 * @module @yunshu/server-core/cache/CacheWarmup
 */

import { getRedisClient, isRedisAvailable } from './RedisClient';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 预热任务定义
 */
export interface WarmupTask<T = unknown> {
  /** 任务名称 */
  name: string;
  /** 预热数据获取函数 */
  loader: () => Promise<Array<{ key: string; value: T; ttl?: number }>>;
  /** 缓存键前缀 */
  keyPrefix?: string;
  /** 默认过期时间（秒） */
  ttl?: number;
  /** 是否启用定时刷新 */
  refreshEnabled?: boolean;
  /** 刷新间隔（毫秒） */
  refreshInterval?: number;
  /** 是否在启动时执行 */
  warmupOnStart?: boolean;
  /** 预热失败时的回调 */
  onError?: (error: Error) => void;
  /** 预热成功时的回调 */
  onSuccess?: (count: number) => void;
}

/**
 * 预热任务状态
 */
export interface WarmupTaskStatus {
  /** 任务名称 */
  name: string;
  /** 是否正在运行 */
  running: boolean;
  /** 上次执行时间 */
  lastRunAt?: Date;
  /** 上次执行结果 */
  lastResult?: 'success' | 'failed';
  /** 上次预热数量 */
  lastCount?: number;
  /** 上次错误信息 */
  lastError?: string;
  /** 执行次数 */
  runCount: number;
  /** 成功次数 */
  successCount: number;
  /** 失败次数 */
  failedCount: number;
}

/**
 * 预热器配置
 */
export interface WarmupManagerConfig {
  /** 是否启用预热 */
  enabled?: boolean;
  /** 并发预热任务数 */
  concurrency?: number;
  /** 单任务预热超时（毫秒） */
  taskTimeout?: number;
  /** 是否在启动时自动预热 */
  warmupOnStart?: boolean;
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<WarmupManagerConfig> = {
  enabled: true,
  concurrency: 3,
  taskTimeout: 30000,
  warmupOnStart: true,
};

// ============================================================================
// 缓存预热管理器
// ============================================================================

/**
 * 缓存预热管理器
 *
 * @example
 * ```typescript
 * const warmupManager = new CacheWarmupManager();
 *
 * // 注册预热任务
 * warmupManager.register({
 *   name: 'user-permissions',
 *   loader: async () => {
 *     const permissions = await Permission.find({});
 *     return permissions.map(p => ({
 *       key: `perm:${p.id}`,
 *       value: p,
 *       ttl: 3600,
 *     }));
 *   },
 *   refreshEnabled: true,
 *   refreshInterval: 60000,
 * });
 *
 * // 启动预热
 * await warmupManager.start();
 *
 * // 停止预热
 * await warmupManager.stop();
 * ```
 */
export class CacheWarmupManager {
  private config: Required<WarmupManagerConfig>;
  private tasks = new Map<string, WarmupTask>();
  private statuses = new Map<string, WarmupTaskStatus>();
  private refreshTimers = new Map<string, NodeJS.Timeout>();
  private started = false;

  constructor(config: WarmupManagerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 注册预热任务
   */
  register<T>(task: WarmupTask<T>): void {
    if (this.tasks.has(task.name)) {
      console.warn(`[Warmup] 任务 "${task.name}" 已存在，将被覆盖`);
    }

    this.tasks.set(task.name, task);
    this.statuses.set(task.name, {
      name: task.name,
      running: false,
      runCount: 0,
      successCount: 0,
      failedCount: 0,
    });

    console.log(`[Warmup] 已注册任务: ${task.name}`);
  }

  /**
   * 批量注册预热任务
   */
  registerAll<T>(tasks: WarmupTask<T>[]): void {
    for (const task of tasks) {
      this.register(task);
    }
  }

  /**
   * 注销预热任务
   */
  unregister(name: string): boolean {
    // 停止定时刷新
    this.stopRefresh(name);

    const deleted = this.tasks.delete(name);
    this.statuses.delete(name);

    if (deleted) {
      console.log(`[Warmup] 已注销任务: ${name}`);
    }

    return deleted;
  }

  /**
   * 启动预热管理器
   */
  async start(): Promise<void> {
    if (this.started) {
      console.warn('[Warmup] 管理器已启动');
      return;
    }

    this.started = true;
    console.log('[Warmup] 管理器已启动');

    // 启动时预热
    if (this.config.warmupOnStart) {
      await this.warmupAll();
    }

    // 启动定时刷新
    for (const [name, task] of this.tasks) {
      if (task.refreshEnabled) {
        this.startRefresh(name);
      }
    }
  }

  /**
   * 停止预热管理器
   */
  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    // 停止所有定时刷新
    for (const name of this.tasks.keys()) {
      this.stopRefresh(name);
    }

    this.started = false;
    console.log('[Warmup] 管理器已停止');
  }

  /**
   * 执行所有预热任务
   */
  async warmupAll(): Promise<Map<string, number>> {
    if (!this.config.enabled) {
      console.log('[Warmup] 预热已禁用');
      return new Map();
    }

    const results = new Map<string, number>();
    const taskNames = Array.from(this.tasks.keys());

    // 分批并发执行
    for (let i = 0; i < taskNames.length; i += this.config.concurrency) {
      const batch = taskNames.slice(i, i + this.config.concurrency);
      const batchResults = await Promise.all(
        batch.map((name) => this.warmup(name).then((count) => [name, count] as const)),
      );

      for (const [name, count] of batchResults) {
        results.set(name, count);
      }
    }

    return results;
  }

  /**
   * 执行单个预热任务
   */
  async warmup(name: string): Promise<number> {
    const task = this.tasks.get(name);
    const status = this.statuses.get(name);

    if (!task || !status) {
      console.warn(`[Warmup] 任务 "${name}" 不存在`);
      return 0;
    }

    if (status.running) {
      console.warn(`[Warmup] 任务 "${name}" 正在运行中`);
      return 0;
    }

    status.running = true;
    status.runCount++;

    try {
      // 带超时执行
      const items = await this.executeWithTimeout(task.loader(), this.config.taskTimeout);

      // 写入缓存
      const count = await this.writeToCache(items, task.keyPrefix, task.ttl);

      // 更新状态
      status.lastRunAt = new Date();
      status.lastResult = 'success';
      status.lastCount = count;
      status.successCount++;

      // 回调
      task.onSuccess?.(count);
      console.log(`[Warmup] 任务 "${name}" 完成，预热 ${count} 条数据`);

      return count;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // 更新状态
      status.lastRunAt = new Date();
      status.lastResult = 'failed';
      status.lastError = err.message;
      status.failedCount++;

      // 回调
      task.onError?.(err);
      console.error(`[Warmup] 任务 "${name}" 失败:`, err.message);

      return 0;
    } finally {
      status.running = false;
    }
  }

  /**
   * 带超时执行
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('预热任务超时')), timeout)),
    ]);
  }

  /**
   * 写入缓存
   */
  private async writeToCache<T>(
    items: Array<{ key: string; value: T; ttl?: number }>,
    keyPrefix?: string,
    defaultTtl?: number,
  ): Promise<number> {
    let count = 0;
    const prefix = keyPrefix ?? '';
    const ttl = defaultTtl ?? 300;

    // 写入 Redis
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient();
        if (redis) {
          const pipeline = redis.pipeline();

          for (const item of items) {
            const fullKey = `${prefix}${item.key}`;
            const itemTtl = item.ttl ?? ttl;
            const serialized =
              typeof item.value === 'string' ? item.value : JSON.stringify(item.value);

            pipeline.setex(fullKey, itemTtl, serialized);
            count++;
          }

          await pipeline.exec();
        }
      } catch (error) {
        console.error('[Warmup] Redis 写入失败:', error);
      }
    }

    return count;
  }

  /**
   * 启动定时刷新
   */
  private startRefresh(name: string): void {
    const task = this.tasks.get(name);
    if (!task || !task.refreshEnabled || !task.refreshInterval) {
      return;
    }

    // 先停止旧的定时器
    this.stopRefresh(name);

    const timer = setInterval(async () => {
      console.log(`[Warmup] 定时刷新任务: ${name}`);
      await this.warmup(name);
    }, task.refreshInterval);

    this.refreshTimers.set(name, timer);
    console.log(`[Warmup] 已启动定时刷新: ${name}，间隔 ${task.refreshInterval}ms`);
  }

  /**
   * 停止定时刷新
   */
  private stopRefresh(name: string): void {
    const timer = this.refreshTimers.get(name);
    if (timer) {
      clearInterval(timer);
      this.refreshTimers.delete(name);
      console.log(`[Warmup] 已停止定时刷新: ${name}`);
    }
  }

  /**
   * 手动刷新指定任务
   */
  async refresh(name: string): Promise<number> {
    return this.warmup(name);
  }

  /**
   * 获取任务状态
   */
  getStatus(name: string): WarmupTaskStatus | undefined {
    return this.statuses.get(name);
  }

  /**
   * 获取所有任务状态
   */
  getAllStatuses(): WarmupTaskStatus[] {
    return Array.from(this.statuses.values());
  }

  /**
   * 获取任务列表
   */
  getTaskNames(): string[] {
    return Array.from(this.tasks.keys());
  }

  /**
   * 检查是否已启动
   */
  isStarted(): boolean {
    return this.started;
  }

  /**
   * 启用/禁用预热
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }
}

// ============================================================================
// 全局预热管理器实例
// ============================================================================

let globalWarmupManager: CacheWarmupManager | null = null;

/**
 * 获取全局预热管理器
 */
export function getWarmupManager(): CacheWarmupManager {
  if (!globalWarmupManager) {
    globalWarmupManager = new CacheWarmupManager();
  }
  return globalWarmupManager;
}

/**
 * 重置全局预热管理器（仅用于测试）
 */
export function resetWarmupManager(): void {
  globalWarmupManager = null;
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 注册预热任务（便捷函数）
 */
export function registerWarmupTask<T>(task: WarmupTask<T>): void {
  getWarmupManager().register(task);
}

/**
 * 执行预热（便捷函数）
 */
export async function executeWarmup(name: string): Promise<number> {
  return getWarmupManager().warmup(name);
}

/**
 * 启动预热管理器（便捷函数）
 */
export async function startWarmupManager(): Promise<void> {
  await getWarmupManager().start();
}

/**
 * 停止预热管理器（便捷函数）
 */
export async function stopWarmupManager(): Promise<void> {
  await getWarmupManager().stop();
}
