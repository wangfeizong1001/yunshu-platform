/**
 * 安全 JSON 工具单元测试
 */

import { describe, it, expect } from 'vitest';
import { safeJsonParse, safeJsonStringify } from '../safeJson';

describe('safeJson', () => {
  it('safeJsonParse 应对有效 JSON 返回正确对象', () => {
    expect(safeJsonParse('{"a": 1}')).toEqual({ a: 1 });
    expect(safeJsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
    expect(safeJsonParse('"hello"')).toBe('hello');
    expect(safeJsonParse('true')).toBe(true);
    expect(safeJsonParse('null')).toBe(null);
  });

  it('safeJsonParse 对无效 JSON 不应抛出异常', () => {
    expect(() => safeJsonParse('{invalid json')).not.toThrow();
    expect(() => safeJsonParse('')).not.toThrow();
    expect(() => safeJsonParse('undefined')).not.toThrow();
  });

  it('safeJsonParse 对非字符串输入应安全处理', () => {
    // @ts-expect-error 测试非字符串输入
    expect(safeJsonParse(123)).toBeDefined();
  });

  it('safeJsonStringify 应对常规对象生成标准 JSON', () => {
    expect(safeJsonStringify({ a: 1, b: 'x' })).toBe('{"a":1,"b":"x"}');
    expect(safeJsonStringify([1, 2, 3])).toBe('[1,2,3]');
    expect(safeJsonStringify(null)).toBe('null');
  });

  it('safeJsonStringify 应支持 pretty-print（带 space 参数）', () => {
    const pretty = safeJsonStringify({ a: 1 }, 2);
    expect(pretty).toContain('\n');
    expect(pretty).toContain('  ');
  });

  it('safeJsonStringify 对循环引用对象应安全处理', () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    expect(() => safeJsonStringify(obj)).not.toThrow();
  });
});
