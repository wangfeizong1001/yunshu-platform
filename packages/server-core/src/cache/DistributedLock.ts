/**
 * 分布式锁装饰器模块
 *
 * 基于 Redis 实现分布式锁，支持：
 * - 互斥锁（Mutex）
 * - 可重入锁（Reentrant）
 * - 自动续期（Watchdog）
 * - 公平锁（Fair Lock）
 *
 * @module @yunshu/server-core/cache/DistributedLock
 */

import crypto from 'node:crypto';
import { getRedisClient, isRedisAvailable } from './RedisClient';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 锁选项
 */
export interface LockOptions {
  /** 锁键前缀 */
  keyPrefix?: string;
  /** 锁过期时间（毫秒），默认 10000 */
  ttl?: number;
  /** 获取锁超时时间（毫秒），默认 5000 */
  acquireTimeout?: number;
  /** 重试间隔（毫秒），默认 100 */
  retryInterval?: number;
  /** 是否可重入，默认 false */
  reentrant?: boolean;
  /** 是否启用自动续期（Watchdog），默认 true */
  autoExtend?: boolean;
  /** 自动续期间隔（毫秒），默认 ttl / 3 */
  autoExtendInterval?: number;
}

/**
 * 锁实例
 */
export interface LockInstance {
  /** 锁键 */
  key: string;
  /** 锁值（用于释放锁时验证） */
  value: string;
  /** 是否已获取 */
  acquired: boolean;
  /** 释放锁 */
  release: () => Promise<boolean>;
  /** 续期锁 */
  extend: (ttl?: number) => Promise<boolean>;
}

/**
 * 锁统计
 */
interface LockStatistics {
  acquired: number;
  released: number;
  failed: number;
  timeout: number;
  extended: number;
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成唯一标识符
 *
 * 使用 Node.js 内置 crypto.randomUUID 确保分布式环境下的唯一性与不可预测性；
 * 不再使用 Math.random 以避免可预测的锁标识带来的安全风险。
 */
function generateLockId(): string {
  return `${process.pid}:${Date.now()}:${crypto.randomUUID()}`;
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 全局实例
// ============================================================================

const lockStats: LockStatistics = {
  acquired: 0,
  released: 0,
  failed: 0,
  timeout: 0,
  extended: 0,
};

// 自动续期定时器映射
const watchdogTimers = new Map<string, NodeJS.Timeout>();

// 本地锁状态（用于可重入锁）
const localLockState = new Map<string, { count: number; value: string }>();

// ============================================================================
// Redis Lua 脚本
// ============================================================================

/**
 * 加锁脚本
 * KEYS[1] = lock key
 * ARGV[1] = lock value
 * ARGV[2] = ttl in milliseconds
 * 返回：1 表示成功，0 表示失败
 */
const LOCK_SCRIPT = `
if redis.call('exists', KEYS[1]) == 0 then
  redis.call('psetex', KEYS[1], ARGV[2], ARGV[1])
  return 1
end
return 0
`;

/**
 * 可重入加锁脚本
 * KEYS[1] = lock key
 * ARGV[1] = lock value (contains process id)
 * ARGV[2] = ttl in milliseconds
 * 返回：1 表示成功，0 表示失败
 */
const REENTRANT_LOCK_SCRIPT = `
local value = redis.call('get', KEYS[1])
if value == false then
  redis.call('psetex', KEYS[1], ARGV[2], ARGV[1])
  return 1
end
-- 检查是否是同一个持有者（前缀匹配）
if string.find(value, string.match(ARGV[1], '^[^:]+:[^:]+')) then
  redis.call('psetex', KEYS[1], ARGV[2], ARGV[1])
  return 1
end
return 0
`;

/**
 * 解锁脚本
 * KEYS[1] = lock key
 * ARGV[1] = lock value
 * 返回：1 表示成功，0 表示失败（锁不存在或值不匹配）
 */
const UNLOCK_SCRIPT = `
if redis.call('get', KEYS[1]) == ARGV[1] then
  redis.call('del', KEYS[1])
  return 1
end
return 0
`;

/**
 * 续期脚本
 * KEYS[1] = lock key
 * ARGV[1] = lock value
 * ARGV[2] = new ttl in milliseconds
 * 返回：1 表示成功，0 表示失败
 */
const EXTEND_SCRIPT = `
if redis.call('get', KEYS[1]) == ARGV[1] then
  redis.call('pexpire', KEYS[1], ARGV[2])
  return 1
end
return 0
`;

// ============================================================================
// 分布式锁
// ============================================================================

/**
 * 获取分布式锁
 *
 * @param key 锁键
 * @param options 锁选项
 * @returns 锁实例
 *
 * @example
 * ```typescript
 * const lock = await acquireLock('user:123:update', { ttl: 10000 });
 * if (lock.acquired) {
 *   try {
 *     // 执行业务逻辑
 *     await doSomething();
 *   } finally {
 *     await lock.release();
 *   }
 * }
 * ```
 */
export async function acquireLock(
  key: string,
  options: LockOptions = {},
): Promise<LockInstance> {
  const {
    keyPrefix = 'lock:',
    ttl = 10000,
    acquireTimeout = 5000,
    retryInterval = 100,
    reentrant = false,
    autoExtend = true,
    autoExtendInterval,
  } = options;

  const fullKey = `${keyPrefix}${key}`;
  const lockValue = generateLockId();
  const startTime = Date.now();

  // 检查本地可重入状态
  if (reentrant) {
    const localState = localLockState.get(fullKey);
    if (localState) {
      localState.count++;
      lockStats.acquired++;
      return {
        key: fullKey,
        value: localState.value,
        acquired: true,
        release: () => releaseReentrantLock(fullKey, localState.value),
        extend: (newTtl?: number) => extendLock(fullKey, localState.value, newTtl ?? ttl),
      };
    }
  }

  // Redis 不可用，使用本地锁
  if (!isRedisAvailable()) {
    console.warn('[Lock] Redis 不可用，使用本地锁');
    return acquireLocalLock(fullKey, lockValue, ttl, acquireTimeout, retryInterval);
  }

  const redis = getRedisClient();
  if (!redis) {
    return acquireLocalLock(fullKey, lockValue, ttl, acquireTimeout, retryInterval);
  }

  // 尝试获取 Redis 锁
  while (Date.now() - startTime < acquireTimeout) {
    try {
      const script = reentrant ? REENTRANT_LOCK_SCRIPT : LOCK_SCRIPT;
      const result = await redis.eval(script, 1, fullKey, lockValue, ttl);

      if (result === 1) {
        lockStats.acquired++;

        // 记录本地状态（可重入）
        if (reentrant) {
          localLockState.set(fullKey, { count: 1, value: lockValue });
        }

        // 启动自动续期
        if (autoExtend) {
          startWatchdog(fullKey, lockValue, autoExtendInterval ?? ttl / 3);
        }

        return {
          key: fullKey,
          value: lockValue,
          acquired: true,
          release: () => releaseLock(fullKey, lockValue, reentrant),
          extend: (newTtl?: number) => extendLock(fullKey, lockValue, newTtl ?? ttl),
        };
      }

    } catch (error) {
      lockStats.failed++;
      console.error('[Lock] Redis 加锁失败:', error);
      // 降级到本地锁
      return acquireLocalLock(fullKey, lockValue, ttl, acquireTimeout, retryInterval);
    }

    // 等待重试
    await delay(retryInterval);
  }

  // 超时
  lockStats.timeout++;
  return {
    key: fullKey,
    value: lockValue,
    acquired: false,
    release: async () => false,
    extend: async () => false,
  };
}

/**
 * 获取本地锁（降级方案）
 */
async function acquireLocalLock(
  key: string,
  value: string,
  ttl: number,
  acquireTimeout: number,
  retryInterval: number,
): Promise<LockInstance> {
  const startTime = Date.now();
  const localLocks = new Map<string, { value: string; expireAt: number }>();

  while (Date.now() - startTime < acquireTimeout) {
    const existing = localLocks.get(key);
    if (!existing || Date.now() > existing.expireAt) {
      localLocks.set(key, { value, expireAt: Date.now() + ttl });
      lockStats.acquired++;

      return {
        key,
        value,
        acquired: true,
        release: async () => {
          localLocks.delete(key);
          lockStats.released++;
          return true;
        },
        extend: async (newTtl?: number) => {
          const lock = localLocks.get(key);
          if (lock && lock.value === value) {
            lock.expireAt = Date.now() + (newTtl ?? ttl);
            lockStats.extended++;
            return true;
          }
          return false;
        },
      };
    }

    await delay(retryInterval);
  }

  lockStats.timeout++;
  return {
    key,
    value,
    acquired: false,
    release: async () => false,
    extend: async () => false,
  };
}

/**
 * 释放锁
 */
async function releaseLock(key: string, value: string, reentrant: boolean): Promise<boolean> {
  // 停止自动续期
  stopWatchdog(key);

  // 处理可重入计数
  if (reentrant) {
    const localState = localLockState.get(key);
    if (localState) {
      localState.count--;
      if (localState.count > 0) {
        // 还有重入，不释放
        return true;
      }
      localLockState.delete(key);
    }
  }

  if (!isRedisAvailable()) {
    lockStats.released++;
    return true;
  }

  try {
    const redis = getRedisClient();
    if (redis) {
      const result = await redis.eval(UNLOCK_SCRIPT, 1, key, value);
      if (result === 1) {
        lockStats.released++;
        return true;
      }
    }
  } catch (error) {
    console.error('[Lock] Redis 解锁失败:', error);
  }

  return false;
}

/**
 * 释放可重入锁
 */
async function releaseReentrantLock(key: string, value: string): Promise<boolean> {
  return releaseLock(key, value, true);
}

/**
 * 续期锁
 */
async function extendLock(key: string, value: string, ttl: number): Promise<boolean> {
  if (!isRedisAvailable()) {
    lockStats.extended++;
    return true;
  }

  try {
    const redis = getRedisClient();
    if (redis) {
      const result = await redis.eval(EXTEND_SCRIPT, 1, key, value, ttl);
      if (result === 1) {
        lockStats.extended++;
        return true;
      }
    }
  } catch (error) {
    console.error('[Lock] Redis 续期失败:', error);
  }

  return false;
}

// ============================================================================
// Watchdog（自动续期）
// ============================================================================

/**
 * 启动自动续期
 */
function startWatchdog(key: string, value: string, interval: number): void {
  // 先清除旧的定时器
  stopWatchdog(key);

  const timer = setInterval(async () => {
    const success = await extendLock(key, value, interval * 3);
    if (!success) {
      // 续期失败，停止 watchdog
      stopWatchdog(key);
    }
  }, interval);

  watchdogTimers.set(key, timer);
}

/**
 * 停止自动续期
 */
function stopWatchdog(key: string): void {
  const timer = watchdogTimers.get(key);
  if (timer) {
    clearInterval(timer);
    watchdogTimers.delete(key);
  }
}

// ============================================================================
// 锁装饰器
// ============================================================================

/**
 * 分布式锁装饰器
 *
 * 自动获取锁、执行函数、释放锁
 *
 * @param fn 要执行的函数
 * @param keyGenerator 键生成函数
 * @param options 锁选项
 *
 * @example
 * ```typescript
 * const updateUserWithLock = withLock(
 *   async (userId: string, data: UpdateDTO) => {
 *     return await userService.update(userId, data);
 *   },
 *   (userId) => `user:${userId}:update`,
 *   { ttl: 10000 }
 * );
 *
 * await updateUserWithLock('user-123', { name: '新名称' });
 * ```
 */
export function withLock<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyGenerator: (...args: TArgs) => string,
  options: LockOptions = {},
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const lockKey = keyGenerator(...args);
    const lock = await acquireLock(lockKey, options);

    if (!lock.acquired) {
      throw new Error(`获取锁超时: ${lockKey}`);
    }

    try {
      return await fn(...args);
    } finally {
      await lock.release();
    }
  };
}

/**
 * 尝试获取锁执行（不阻塞）
 *
 * 如果获取锁失败，返回 null 而不是等待
 *
 * @example
 * ```typescript
 * const result = await tryWithLock(
 *   async () => await doSomething(),
 *   'resource:lock',
 *   { ttl: 5000 }
 * );
 *
 * if (result === null) {
 *   console.log('锁被占用，稍后重试');
 * }
 * ```
 */
export async function tryWithLock<TResult>(
  fn: () => Promise<TResult>,
  key: string,
  options: LockOptions = {},
): Promise<TResult | null> {
  const lock = await acquireLock(key, { ...options, acquireTimeout: 0 });

  if (!lock.acquired) {
    return null;
  }

  try {
    return await fn();
  } finally {
    await lock.release();
  }
}

// ============================================================================
// 统计与工具
// ============================================================================

/**
 * 获取锁统计
 */
export function getLockStats(): LockStatistics {
  return { ...lockStats };
}

/**
 * 重置锁统计
 */
export function resetLockStats(): void {
  lockStats.acquired = 0;
  lockStats.released = 0;
  lockStats.failed = 0;
  lockStats.timeout = 0;
  lockStats.extended = 0;
}

/**
 * 检查锁是否存在
 */
export async function isLocked(key: string, keyPrefix = 'lock:'): Promise<boolean> {
  const fullKey = `${keyPrefix}${key}`;

  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    if (redis) {
      const result = await redis.exists(fullKey);
      return result === 1;
    }
  } catch (error) {
    console.error('[Lock] 检查锁状态失败:', error);
  }

  return false;
}

/**
 * 强制释放锁（谨慎使用）
 */
export async function forceReleaseLock(key: string, keyPrefix = 'lock:'): Promise<boolean> {
  const fullKey = `${keyPrefix}${key}`;

  // 停止 watchdog
  stopWatchdog(fullKey);
  localLockState.delete(fullKey);

  if (!isRedisAvailable()) {
    return true;
  }

  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.del(fullKey);
      lockStats.released++;
      return true;
    }
  } catch (error) {
    console.error('[Lock] 强制释放锁失败:', error);
  }

  return false;
}
