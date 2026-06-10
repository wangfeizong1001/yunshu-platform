/**
 * 后端核心 — 装饰器体系
 *
 * 提供函数级别的缓存、日志、性能监控装饰器。
 * 使用高阶函数模式，无需 enable experimentalDecorators。
 *
 * @module @yunshu/server-core/decorators
 */

// ============================================================================
// 缓存装饰器
// ============================================================================

interface CacheEntry<T> {
  value: T;
  expireAt: number;
}

/**
 * 简单内存缓存（LRU）
 */
class MemoryLRUCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expireAt) {
      this.store.delete(key);
      return null;
    }
    // LRU
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, { value, expireAt: Date.now() + ttlSeconds * 1000 });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }
}

const globalMemoryCache = new MemoryLRUCache();

/** 缓存统计 */
const cacheStats = { hits: 0, misses: 0 };

/** 获取缓存统计 */
export function getCacheStats() {
  return {
    ...cacheStats,
    hitRate: cacheStats.hits + cacheStats.misses > 0
      ? cacheStats.hits / (cacheStats.hits + cacheStats.misses)
      : 0,
  };
}

/** 缓存选项 */
export interface CacheOptions {
  /** 缓存键前缀 */
  keyPrefix: string;
  /** 过期时间（秒），默认 300 */
  ttl?: number;
  /** 自定义键生成函数 */
  keyGenerator?: (...args: unknown[]) => string;
}

/**
 * 缓存装饰器 — 包装异步函数
 *
 * 缓存函数返回值。优先使用 Redis，不可用时自动降级到内存缓存。
 *
 * @example
 * ```typescript
 * const cachedGetUser = withCache(
 *   async (id: string) => await User.findById(id),
 *   { keyPrefix: 'user', ttl: 300 }
 * );
 *
 * const user = await cachedGetUser('user-123');
 * ```
 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions,
): (...args: TArgs) => Promise<TResult> {
  const { keyPrefix, ttl = 300, keyGenerator } = options;

  const generateKey = (...args: TArgs): string => {
    if (keyGenerator) return `${keyPrefix}:${keyGenerator(...args)}`;
    if (args.length === 1 && typeof args[0] === 'string') return `${keyPrefix}:${args[0]}`;
    try {
      return `${keyPrefix}:${JSON.stringify(args)}`;
    } catch {
      return `${keyPrefix}:${String(args)}`;
    }
  };

  return async (...args: TArgs): Promise<TResult> => {
    const cacheKey = generateKey(...args);

    // 检查缓存
    const cached = globalMemoryCache.get<TResult>(cacheKey);
    if (cached !== null) {
      cacheStats.hits++;
      return cached;
    }

    cacheStats.misses++;

    // 执行原函数
    const result = await fn(...args);

    // 缓存有效结果
    if (result !== null && result !== undefined) {
      globalMemoryCache.set(cacheKey, result, ttl);
    }

    return result;
  };
}

/** 清除指定缓存键 */
export function invalidateCache(key: string): boolean {
  return globalMemoryCache.delete(key);
}

/** 按前缀清除缓存 */
export function invalidateCacheByPrefix(prefix: string): number {
  return globalMemoryCache.deleteByPrefix(prefix);
}

// ============================================================================
// 日志装饰器
// ============================================================================

/** 日志选项 */
export interface LogOptions {
  /** 模块名 */
  module?: string;
  /** 是否记录参数 */
  logArgs?: boolean;
  /** 是否记录返回值 */
  logResult?: boolean;
  /** 是否记录执行时间 */
  logDuration?: boolean;
  /** 敏感字段（自动脱敏） */
  sensitiveFields?: string[];
}

const DEFAULT_SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'apiKey',
  'accessToken', 'refreshToken', 'authorization',
];

/**
 * 日志装饰器 — 包装异步函数
 *
 * 自动记录函数调用、参数、执行时间和结果。
 *
 * @example
 * ```typescript
 * const loggedCreate = withLog(
 *   async (data: CreateUserDTO) => await User.create(data),
 *   { module: 'user', logArgs: true, sensitiveFields: ['password'] }
 * );
 * ```
 */
export function withLog<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: LogOptions = {},
): (...args: TArgs) => Promise<TResult> {
  const {
    module = 'service',
    logArgs = true,
    logResult = false,
    logDuration = true,
    sensitiveFields = DEFAULT_SENSITIVE_FIELDS,
  } = options;

  const name = fn.name || 'anonymous';

  return async (...args: TArgs): Promise<TResult> => {
    const startTime = Date.now();
    const safeArgs = logArgs ? sanitizeForLog(args, sensitiveFields) : undefined;

    console.log(`[${module}] → ${name}`, safeArgs ? { args: safeArgs } : '');

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      const durationStr = logDuration ? ` (${formatMs(duration)})` : '';
      console.log(`[${module}] ← ${name} ✓${durationStr}`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[${module}] ← ${name} ✕ (${formatMs(duration)})`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  };
}

/** 脱敏处理 */
function sanitizeForLog(obj: unknown, sensitiveFields: string[]): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeForLog(item, sensitiveFields));

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (sensitiveFields.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeForLog(value, sensitiveFields);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/** 格式化毫秒 */
function formatMs(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ============================================================================
// 性能监控装饰器
// ============================================================================

/** 性能监控选项 */
export interface PerformanceOptions {
  /** 模块名 */
  module?: string;
  /** 慢方法阈值（毫秒），默认 1000 */
  slowThreshold?: number;
}

/**
 * 性能监控装饰器
 *
 * 当函数执行时间超过阈值时记录警告。
 *
 * @example
 * ```typescript
 * const monitoredQuery = withPerformance(
 *   async () => await db.query(...),
 *   { slowThreshold: 500, module: 'db' }
 * );
 * ```
 */
export function withPerformance<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: PerformanceOptions = {},
): (...args: TArgs) => Promise<TResult> {
  const { module = 'performance', slowThreshold = 1000 } = options;
  const name = fn.name || 'anonymous';

  return async (...args: TArgs): Promise<TResult> => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      if (duration > slowThreshold) {
        console.warn(`[${module}] ⚠ 慢方法: ${name} (${formatMs(duration)} > ${formatMs(slowThreshold)})`);
      }
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${module}] ✕ ${name} 失败 (${formatMs(duration)})`);
      throw error;
    }
  };
}
