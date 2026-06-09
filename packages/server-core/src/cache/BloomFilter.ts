/**
 * 布隆过滤器
 *
 * 用于缓存穿透防护：快速判断一个 key「一定不存在」或「可能存在」。
 *
 * @module @yunshu/server-core/cache/BloomFilter
 */

/** 布隆过滤器配置 */
export interface BloomFilterConfig {
  expectedInsertions?: number;
  falsePositiveRate?: number;
  useRedis?: boolean;
  redisKey?: string;
}

/** 布隆过滤器统计 */
export interface BloomFilterStats {
  bitSize: number;
  hashCount: number;
  insertions: number;
  queries: number;
  theoreticalFPR: number;
  fillRate: number;
}

// 哈希函数
function fnv1a(str: string, seed: number = 0): number {
  let hash = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

function generateKHashes(key: string, k: number, bitSize: number): number[] {
  const hash1 = fnv1a(key, 0);
  const hash2 = jenkins(key, hash1);
  const positions: number[] = [];
  for (let i = 0; i < k; i++) {
    positions.push(((hash1 + i * hash2) >>> 0) % bitSize);
  }
  return positions;
}

// 内存布隆过滤器
class MemoryBloomFilter {
  private bitArray: Uint32Array;
  private readonly bitSize: number;
  private readonly hashCount: number;
  private insertionCount = 0;
  private queryCount = 0;

  constructor(config: Required<Omit<BloomFilterConfig, 'useRedis' | 'redisKey'>>) {
    const ln2 = Math.log(2);
    this.bitSize = Math.ceil(-config.expectedInsertions * Math.log(config.falsePositiveRate) / (ln2 * ln2));
    this.hashCount = Math.max(1, Math.round((this.bitSize / config.expectedInsertions) * ln2));
    this.bitArray = new Uint32Array(Math.ceil(this.bitSize / 32));
  }

  add(key: string): void {
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
    for (const pos of positions) {
      const arrayIndex = pos >>> 5;
      const bitIndex = pos & 31;
      const current = this.bitArray[arrayIndex] ?? 0;
      this.bitArray[arrayIndex] = current | (1 << bitIndex);
    }
    this.insertionCount++;
  }

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

  addAll(keys: string[]): void {
    for (const key of keys) this.add(key);
  }

  checkAndAdd(key: string): boolean {
    const positions = generateKHashes(key, this.hashCount, this.bitSize);
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

  clear(): void {
    this.bitArray.fill(0);
    this.insertionCount = 0;
    this.queryCount = 0;
  }

  getStats(): BloomFilterStats {
    let setBits = 0;
    for (let i = 0; i < this.bitArray.length; i++) {
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
    const theoreticalFPR = Math.pow(1 - Math.exp(-k * n / m), k);
    return { bitSize: m, hashCount: k, insertions: n, queries: this.queryCount, theoreticalFPR, fillRate: setBits / m };
  }
}

// 全局默认过滤器
let defaultFilter: MemoryBloomFilter | null = null;

function getDefaultFilter(): MemoryBloomFilter {
  if (!defaultFilter) {
    defaultFilter = initBloomFilter();
  }
  return defaultFilter;
}

/** 初始化默认布隆过滤器 */
export function initBloomFilter(config: BloomFilterConfig = {}): MemoryBloomFilter {
  const effectiveConfig = {
    expectedInsertions: config.expectedInsertions ?? 10000,
    falsePositiveRate: config.falsePositiveRate ?? 0.01,
  };
  defaultFilter = new MemoryBloomFilter(effectiveConfig);
  return defaultFilter;
}

/** 创建布隆过滤器 */
export function createBloomFilter(config: BloomFilterConfig = {}): MemoryBloomFilter {
  return new MemoryBloomFilter({
    expectedInsertions: config.expectedInsertions ?? 10000,
    falsePositiveRate: config.falsePositiveRate ?? 0.01,
  });
}

/** 添加元素 */
export function bloomAdd(key: string): void {
  getDefaultFilter().add(key);
}

/** 批量添加 */
export function bloomAddAll(keys: string[]): void {
  getDefaultFilter().addAll(keys);
}

/** 检查元素是否可能存在 */
export function bloomMightContain(key: string): boolean {
  return getDefaultFilter().mightContain(key);
}

/** 检查并添加 */
export function bloomCheckAndAdd(key: string): boolean {
  return getDefaultFilter().checkAndAdd(key);
}

/** 清空默认过滤器 */
export function bloomClear(): void {
  getDefaultFilter().clear();
}

/** 获取默认过滤器统计 */
export function bloomGetStats(): BloomFilterStats {
  return getDefaultFilter().getStats();
}
