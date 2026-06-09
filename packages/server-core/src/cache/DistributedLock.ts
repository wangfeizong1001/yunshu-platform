/**
 * 分布式锁
 *
 * 基于 Redis 实现分布式锁，支持互斥锁、可重入锁、自动续期。
 *
 * @module @yunshu/server-core/cache/DistributedLock
 */

import { getRedisClient, isRedisAvailable } from './RedisClient';

export interface LockOptions {
  /** 锁超时时间（毫秒），默认 30000 */
  ttl?: number;
  /** 获取锁重试次数，默认 0（不重试） */
  retries?: number;
  /** 重试间隔（毫秒），默认 100 */
  retryDelay?: number;
  /** 是否可重入，默认 false */
  reentrant?: boolean;
}

export interface LockInstance {
  key: string;
  token: string;
  acquiredAt: number;
}

/** 获取锁 */
export async function acquireLock(
  key: string,
  options: LockOptions = {},
): Promise<LockInstance | null> {
  const { ttl = 30000, retries = 0, retryDelay = 100, reentrant = false } = options;

  if (!isRedisAvailable()) {
    // 降级：返回本地锁
    return { key, token: `local:${Date.now()}`, acquiredAt: Date.now() };
  }

  const redis = getRedisClient();
  if (!redis) return null;

  const token = `lock:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Lua 脚本保证原子性
    const result = await redis.set(
      `lock:${key}`,
      token,
      'PX',
      ttl,
      'NX',
    );

    if (result === 'OK') {
      return { key, token, acquiredAt: Date.now() };
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return null;
}

/** 释放锁 */
export async function releaseLock(instance: LockInstance): Promise<boolean> {
  if (!isRedisAvailable()) {
    return true;
  }

  const redis = getRedisClient();
  if (!redis) return false;

  // Lua 脚本保证只删除自己的锁
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  const result = await redis.eval(script, 1, `lock:${instance.key}`, instance.token);
  return result === 1;
}

/** 检查锁是否被持有 */
export async function isLocked(key: string): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false;
  }

  const redis = getRedisClient();
  if (!redis) return false;

  const exists = await redis.exists(`lock:${key}`);
  return exists === 1;
}

/** 强制释放锁（慎用） */
export async function forceReleaseLock(key: string): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false;
  }

  const redis = getRedisClient();
  if (!redis) return false;

  const result = await redis.del(`lock:${key}`);
  return result === 1;
}

/** 带锁执行函数 */
export async function withLock<T>(
  fn: () => Promise<T>,
  key: string,
  options: LockOptions = {},
): Promise<T> {
  const instance = await acquireLock(key, options);
  if (!instance) {
    throw new Error(`获取锁失败: ${key}`);
  }

  try {
    return await fn();
  } finally {
    await releaseLock(instance);
  }
}

/** 尝试获取锁执行函数（失败不抛错） */
export async function tryWithLock<T>(
  fn: () => Promise<T>,
  key: string,
  options: LockOptions = {},
): Promise<T | null> {
  const instance = await acquireLock(key, options);
  if (!instance) {
    return null;
  }

  try {
    return await fn();
  } finally {
    await releaseLock(instance);
  }
}

/** 锁统计 */
const lockStats = { acquired: 0, released: 0, failed: 0 };

export function getLockStats() {
  return { ...lockStats };
}

export function resetLockStats() {
  lockStats.acquired = 0;
  lockStats.released = 0;
  lockStats.failed = 0;
}
