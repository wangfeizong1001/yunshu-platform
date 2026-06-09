/**
 * 缓存预热管理器
 *
 * @module @yunshu/server-core/cache/CacheWarmup
 */



export interface WarmupTask {
  name: string;
  handler: () => Promise<void>;
  interval?: number;
  priority?: number;
}

export interface WarmupTaskStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  lastRun?: Date;
  lastDuration?: number;
  error?: string;
}

export interface WarmupManagerConfig {
  /** 最大并发任务数 */
  maxConcurrency?: number;
  /** 是否在启动时自动执行 */
  autoStart?: boolean;
  /** 启动延迟（毫秒） */
  startupDelay?: number;
  /** 错误回调 */
  onError?: (error: Error, task: WarmupTask) => void;
}

let warmupManager: CacheWarmupManager | null = null;
const tasks = new Map<string, WarmupTask>();
const taskStatus = new Map<string, WarmupTaskStatus>();

/** 缓存预热管理器 */
export class CacheWarmupManager {
  private config: Required<WarmupManagerConfig>;
  private running = false;
  private intervalIds = new Map<string, ReturnType<typeof setInterval>>();

  constructor(config: WarmupManagerConfig = {}) {
    this.config = {
      maxConcurrency: config.maxConcurrency ?? 3,
      autoStart: config.autoStart ?? false,
      startupDelay: config.startupDelay ?? 1000,
      onError: config.onError ?? (() => {}),
    };
  }

  /** 注册预热任务 */
  register(task: WarmupTask): void {
    tasks.set(task.name, task);
    taskStatus.set(task.name, { name: task.name, status: 'pending' });

    if (this.config.autoStart && !this.running) {
      setTimeout(() => this.start(), this.config.startupDelay);
    }
  }

  /** 执行所有预热任务 */
  async executeAll(): Promise<void> {
    const sortedTasks = Array.from(tasks.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    for (let i = 0; i < sortedTasks.length; i += this.config.maxConcurrency) {
      const batch = sortedTasks.slice(i, i + this.config.maxConcurrency);
      await Promise.all(batch.map((task) => this.executeTask(task)));
    }
  }

  /** 执行单个任务 */
  private async executeTask(task: WarmupTask): Promise<void> {
    const status = taskStatus.get(task.name);
    if (!status) return;

    status.status = 'running';

    const startTime = Date.now();

    try {
      await task.handler();
      status.status = 'completed';
      status.lastRun = new Date();
      status.lastDuration = Date.now() - startTime;
    } catch (error) {
      status.status = 'failed';
      status.error = error instanceof Error ? error.message : '未知错误';
      this.config.onError?.(error as Error, task);
    }
  }

  /** 启动定时预热 */
  start(): void {
    if (this.running) return;
    this.running = true;

    for (const [name, task] of tasks.entries()) {
      if (task.interval && task.interval > 0) {
        const intervalId = setInterval(() => {
          this.executeTask(task);
        }, task.interval);
        this.intervalIds.set(name, intervalId);
      }
    }

    this.executeAll();
  }

  /** 停止定时预热 */
  stop(): void {
    this.running = false;
    for (const intervalId of this.intervalIds.values()) {
      clearInterval(intervalId);
    }
    this.intervalIds.clear();
  }

  /** 获取任务状态 */
  getTaskStatus(name: string): WarmupTaskStatus | undefined {
    return taskStatus.get(name);
  }

  /** 获取所有任务状态 */
  getAllTaskStatus(): WarmupTaskStatus[] {
    return Array.from(taskStatus.values());
  }

  /** 清理 */
  destroy(): void {
    this.stop();
    tasks.clear();
    taskStatus.clear();
    warmupManager = null;
  }
}

/** 获取预热管理器 */
export function getWarmupManager(): CacheWarmupManager {
  if (!warmupManager) {
    warmupManager = new CacheWarmupManager();
  }
  return warmupManager;
}

/** 重置预热管理器 */
export function resetWarmupManager(): void {
  warmupManager?.destroy();
}

/** 注册预热任务 */
export function registerWarmupTask(task: WarmupTask): void {
  getWarmupManager().register(task);
}

/** 执行预热 */
export async function executeWarmup(): Promise<void> {
  await getWarmupManager().executeAll();
}

/** 启动预热管理器 */
export function startWarmupManager(): void {
  getWarmupManager().start();
}

/** 停止预热管理器 */
export function stopWarmupManager(): void {
  getWarmupManager().stop();
}
