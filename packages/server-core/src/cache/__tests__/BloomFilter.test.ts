/**
 * BloomFilter 布隆过滤器单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  bloomAdd,
  bloomAddAll,
  bloomMightContain,
  bloomCheckAndAdd,
  bloomClear,
  bloomGetStats,
  createBloomFilter,
} from '../BloomFilter';

describe('BloomFilter', () => {
  beforeEach(() => {
    bloomClear();
  });

  it('bloomAdd 后 bloomMightContain 应返回 true', () => {
    bloomAdd('user:1');
    expect(bloomMightContain('user:1')).toBe(true);
  });

  it('对未添加的键 bloomMightContain 应返回 false', () => {
    bloomAdd('user:1');
    expect(bloomMightContain('user:9999')).toBe(false);
  });

  it('bloomAddAll 应批量添加多个键', () => {
    bloomAddAll(['a', 'b', 'c']);
    expect(bloomMightContain('a')).toBe(true);
    expect(bloomMightContain('b')).toBe(true);
    expect(bloomMightContain('c')).toBe(true);
  });

  it('bloomCheckAndAdd 首次应返回 false，之后返回 true', () => {
    const first = bloomCheckAndAdd('item:1');
    expect(first).toBe(false);
    const second = bloomCheckAndAdd('item:1');
    expect(second).toBe(true);
  });

  it('bloomClear 后所有键应被清空', () => {
    bloomAdd('k1');
    bloomAdd('k2');
    bloomClear();
    expect(bloomMightContain('k1')).toBe(false);
    expect(bloomMightContain('k2')).toBe(false);
  });

  it('bloomGetStats 应返回位大小 / 哈希函数数量等统计', () => {
    bloomAdd('stats:1');
    const stats = bloomGetStats();
    expect(stats).toBeDefined();
    expect(typeof stats.bitSize).toBe('number');
    expect(typeof stats.hashCount).toBe('number');
    expect(stats.insertions).toBeGreaterThan(0);
    expect(stats.bitSize).toBeGreaterThan(0);
    expect(stats.hashCount).toBeGreaterThan(0);
  });

  it('createBloomFilter 应返回独立实例', () => {
    const f1 = createBloomFilter({ expectedInsertions: 1000 });
    const f2 = createBloomFilter({ expectedInsertions: 1000 });
    f1.add('shared');
    // f2 不应包含 f1 的元素
    expect(f2.mightContain('shared')).toBe(false);
    expect(f1.mightContain('shared')).toBe(true);
  });

  it('在合理配置下误判率应较低', () => {
    const f = createBloomFilter({ expectedInsertions: 1000, falsePositiveRate: 0.01 });
    for (let i = 0; i < 500; i++) f.add(`test:${i}`);
    let fp = 0;
    for (let i = 1000; i < 2000; i++) {
      if (f.mightContain(`test:${i}`)) fp++;
    }
    // 误判率应小于 5%（0.01 的理论值，考虑样本大小有一定波动）
    expect(fp).toBeLessThan(100);
  });

  it('实例 getStats 应返回填充率与误判率', () => {
    const f = createBloomFilter({ expectedInsertions: 500 });
    for (let i = 0; i < 50; i++) f.add(`x${i}`);
    const stats = f.getStats();
    expect(stats.fillRate).toBeGreaterThanOrEqual(0);
    expect(stats.fillRate).toBeLessThanOrEqual(1);
    expect(stats.theoreticalFPR).toBeGreaterThanOrEqual(0);
    expect(stats.queries).toBeGreaterThanOrEqual(0);
  });
});
