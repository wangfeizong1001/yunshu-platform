/**
 * 布隆过滤器（Bloom Filter）
 *
 * 用于缓存穿透防护：快速判断一个 key 「一定不存在」
 * 或「可能存在」，避免无效查询打到数据库。
 *
 * 特性：
 * - 基于位运算的内存高效实现
 * - 支持内存模式和 Redis 模式（分布式共享）
 * - 支持自动重建
 *
 * @module @yunshu/server-core/cache/BloomFilter
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 布隆过滤器配置
 */
export interface BloomFilterConfig {
  /** 预期元素数量，默认 10000 */
  expectedInsertions?: number;
  /** 允许的误判率，默认 0.01 (1%) */
  falsePositiveRate?: number;
  /** 是否使用 Redis 模式（分布式共享），默认 false */
  useRedis?: boolean;
  /** Redis 中存储的键名 */
  redisKey?: string;
}

/**
 * 布隆过滤器统计
 */
export interface BloomFilterStats {
  /** 位数组大小（位） */
  bitSize: number;
  /** 哈希函数数量 */
  hashCount: number;
  /** 插入的元素数量 */
  insertions: number;
  /** 查询次数 */
  queries: number;
  /** 理论误判率 */
  theoreticalFPR: number;
  /** 当前实际占用比例 */
  fillRate: number;
}

// ============================================================================
// 哈希函数
// ============================================================================

/**
 * FNV-1a 哈希（快速、简单）
 */
function fnv1a(str: string, seed: number = 0): number {
  let hash = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Jenkins 哈希
 */
function jenkins(str: string, seed: number = 0): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash += hash << 10;
    hash ^= hash >>> 6;
  }
  hash += hash << 3;
  hash ^= hash >>> 11;
  hash += hash << 15;
  return hash >>> 0;
}

/**
 * 生成 k 个哈希值（使用双重哈希技术）
 */
function generateKHashes(key: string, k: number, bitSize: number): number[] {
  const hash1 = fnv1a(key, 0);
  const hash2 = jenkins(key, hash1);
  const positions: number[] = [];

  for (let i = 0; i < k; i++) {
    const combined = (hash1 + i * hash2) >>> 0;
    positions.push(combined % bitSize);
  }

  return positions;
}

// ============================================================================
// 内存布隆过滤器
// ============================================================================

/**
 * 内存布隆过滤器实现
 */
class MemoryBloomFilter {
  private bitArray: Uint32Array;
  private readonly bitSize: number;
  private readonly hashCount: number;
  private readonly expectedInsertions: number;
  private readonly falsePositiveRate: number;
  private insertionCount = 0;
  private queryCount = 0;

  constructor(config: Required<Omit<BloomFilterConfig, 'useRedis' | 'redisKey'>>) {
    this.expectedInsertions = config.expectedInsertions;
    this.falsePositiveRate = config.falsePositiveRate;

    // 计算最佳位数组大小: m = -n * ln(p) / (ln(2))^2
    const ln2 = Math.log(2);
    this.bitSize = Math.ceil(
      -config.expectedInsertions * Math.log(config.falsePositiveRate) / (ln2 * ln2)
    );

    // 计算最佳哈希函数数量: k = m / n * ln(2)
    this.hashCount = Math.max(1, Math.round((this.bitSize / config.expectedInsertions) * ln2));

    // 创建位数组（使用 Uint32Array，每 32 位为一个单元）
    const arraySize = Math.ceil(this.bitSize / 32);
    this.bitArray = new Uint32Array(arraySize);
  }

  /**
   * 添加元素
   */
  add(key: string): void {
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
    for (const pos of positions) {
      const arrayIndex = pos >>> 5; // pos / 32
      const bitIndex = pos & 31;    // pos % 32
      const current = this.bitArray[arrayIndex] ?? 0;
      this.bitArray[arrayIndex] = current | (1 << bitIndex);
    }
    this.insertionCount++;
  }

  /**
   * 检查元素是否可能存在
   *
   * @returns true = 可能存在（有小概率误判），false = 一定不存在
   */
  mightContain(key: string): boolean {
    this.queryCount++;
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
    for (const pos of positions) {
      const arrayIndex = pos >>> 5;
      const bitIndex = pos & 31;
      const current = this.bitArray[arrayIndex] ?? 0;
      if ((current & (1 << bitIndex)) === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 批量添加
   */
  addAll(keys: string[]): void {
    for (const key of keys) {
      this.add(key);
    }
  }

  /**
   * 检查并添加（如果不存在则添加）
   *
   * @returns true = 可能已存在，false = 确实不存在（已添加）
   */
  checkAndAdd(key: string): boolean {
    const positions = generateKHashes(key, this.hashCount, this.bitSize);

    // 先检查是否已存在
    let exists = true;
    for (const pos of positions) {
      const arrayIndex = pos >>> 5;
      const bitIndex = pos & 31;
      const current = this.bitArray[arrayIndex] ?? 0;
      if ((current & (1 << bitIndex)) === 0) {
        exists = false;
        break;
      }
    }

    if (!exists) {
      // 不存在，添加
      for (const pos of positions) {
        const arrayIndex = pos >>> 5;
        const bitIndex = pos & 31;
        const current = this.bitArray[arrayIndex] ?? 0;
        this.bitArray[arrayIndex] = current | (1 << bitIndex);
      }
      this.insertionCount++;
    }

    this.queryCount++;
    return exists;
  }

  /**
   * 清空过滤器
   */
  clear(): void {
    this.bitArray.fill(0);
    this.insertionCount = 0;
    this.queryCount = 0;
  }

  /**
   * 获取统计信息
   */
  getStats(): BloomFilterStats {
    let setBits = 0;
    for (let i = 0; i < this.bitArray.length; i++) {
      // 统计每 32 位中 1 的数量
      const val = this.bitArray[i];
      if (val === undefined) continue;
      let x = val;
      x = x - ((x >>> 1) & 0x55555555);
      x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
      x = (x + (x >>> 4)) & 0x0F0F0F0F;
      x = x + (x >>> 8);
      x = x + (x >>> 16);
      setBits += x & 0x3F;
    }

    const n = this.insertionCount;
    const k = this.hashCount;
    const m = this.bitSize;
    // 理论误判率: (1 - e^(-kn/m))^k
    const theoreticalFPR = Math.pow(1 - Math.exp(-k * n / m), k);

    return {
      bitSize: m,
      hashCount: k,
      insertions: n,
      queries: this.queryCount,
      theoreticalFPR,
      fillRate: setBits / m,
    };
  }
}

// ============================================================================
// Redis 布隆过滤器
// ============================================================================

/**
 * Redis 布隆过滤器（基于 Redis 位操作实现分布式共享）
 */
class RedisBloomFilter {
  private redis: ReturnType<typeof import('./RedisClient').getRedisClient>;
  private readonly redisKey: string;
  private readonly bitSize: number;
  private readonly hashCount: number;

  constructor(
    redis: ReturnType<typeof import('./RedisClient').getRedisClient>,
    config: Required<Omit<BloomFilterConfig, 'useRedis'>>,
  ) {
    this.redis = redis;
    this.redisKey = config.redisKey;
    const ln2 = Math.log(2);
    this.bitSize = Math.ceil(
      -config.expectedInsertions * Math.log(config.falsePositiveRate) / (ln2 * ln2)
    );
    this.hashCount = Math.max(1, Math.round((this.bitSize / config.expectedInsertions) * ln2));
  }

  async add(key: string): Promise<void> {
    if (!this.redis) return;
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
    for (const pos of positions) {
      await this.redis.setbit(this.redisKey, pos, 1);
    }
  }

  async mightContain(key: string): Promise<boolean> {
    if (!this.redis) return false;
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
    for (const pos of positions) {
      const bit = await this.redis.getbit(this.redisKey, pos);
      if (bit === 0) {
        return false;
      }
    }
    return true;
  }

  async addAll(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.add(key);
    }
  }

  async clear(): Promise<void> {
    if (this.redis) {
      await this.redis.del(this.redisKey);
    }
  }
}

// ============================================================================
// 全局管理
// ============================================================================

/**
 * 全局默认布隆过滤器（内存模式）
 */
let defaultFilter: MemoryBloomFilter | null = null;

/**
 * 初始化默认布隆过滤器
 */
export function initBloomFilter(config: BloomFilterConfig = {}): MemoryBloomFilter {
  const effectiveConfig = {
    expectedInsertions: config.expectedInsertions ?? 10000,
    falsePositiveRate: config.falsePositiveRate ?? 0.01,
  };
  defaultFilter = new MemoryBloomFilter(effectiveConfig);
  return defaultFilter;
}

/**
 * 获取默认布隆过滤器（懒初始化）
 */
function getDefaultFilter(): MemoryBloomFilter {
  if (!defaultFilter) {
    defaultFilter = initBloomFilter();
  }
  return defaultFilter;
}

/**
 * 创建布隆过滤器
 */
export function createBloomFilter(config: BloomFilterConfig = {}): MemoryBloomFilter {
  const effectiveConfig = {
    expectedInsertions: config.expectedInsertions ?? 10000,
    falsePositiveRate: config.falsePositiveRate ?? 0.01,
  };
  return new MemoryBloomFilter(effectiveConfig);
}

/**
 * 创建 Redis 布隆过滤器
 */
export function createRedisBloomFilter(
  redis: ReturnType<typeof import('./RedisClient').getRedisClient>,
  config: BloomFilterConfig = {},
): RedisBloomFilter {
  const effectiveConfig = {
    expectedInsertions: config.expectedInsertions ?? 10000,
    falsePositiveRate: config.falsePositiveRate ?? 0.01,
    redisKey: config.redisKey ?? 'bloom:default',
  };
  return new RedisBloomFilter(redis, effectiveConfig);
}

// ============================================================================
// 便捷函数（使用默认过滤器）
// ============================================================================

/**
 * 添加元素到默认过滤器
 */
export function bloomAdd(key: string): void {
  getDefaultFilter().add(key);
}

/**
 * 批量添加
 */
export function bloomAddAll(keys: string[]): void {
  getDefaultFilter().addAll(keys);
}

/**
 * 检查元素是否可能存在
 */
export function bloomMightContain(key: string): boolean {
  return getDefaultFilter().mightContain(key);
}

/**
 * 检查并添加
 */
export function bloomCheckAndAdd(key: string): boolean {
  return getDefaultFilter().checkAndAdd(key);
}

/**
 * 清空默认过滤器
 */
export function bloomClear(): void {
  getDefaultFilter().clear();
}

/**
 * 获取默认过滤器统计
 */
export function bloomGetStats(): BloomFilterStats {
  return getDefaultFilter().getStats();
}
