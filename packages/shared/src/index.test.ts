/**
 * @yunshu/shared 单元测试
 *
 * 测试目标：
 * - API 响应类型的结构化验证
 * - 分页元信息计算正确性
 * - 分页参数规范化边界处理
 * - 工具函数 createSuccessResult / createErrorResult
 * - 工具类型（编译时验证通过即可）
 */

import { describe, it, expect } from 'vitest';
import {
  calcPaginationMeta,
  normalizePagination,
  createPaginatedResult,
  createSuccessResult,
  createErrorResult,
  PAGINATION_DEFAULTS,
} from './index';

// ============================================================================
// calcPaginationMeta — 分页元信息计算
// ============================================================================

describe('calcPaginationMeta', () => {
  it('应正确计算首页的元信息', () => {
    const meta = calcPaginationMeta(1, 10, 50);
    expect(meta).toEqual({
      page: 1,
      limit: 10,
      total: 50,
      totalPages: 5,
      hasPrev: false,
      hasNext: true,
    });
  });

  it('应正确计算中间页的元信息', () => {
    const meta = calcPaginationMeta(3, 10, 50);
    expect(meta.page).toBe(3);
    expect(meta.totalPages).toBe(5);
    expect(meta.hasPrev).toBe(true);
    expect(meta.hasNext).toBe(true);
  });

  it('应正确计算末页的元信息', () => {
    const meta = calcPaginationMeta(5, 10, 50);
    expect(meta.hasPrev).toBe(true);
    expect(meta.hasNext).toBe(false);
  });

  it('总数为 0 时应返回 1 页', () => {
    const meta = calcPaginationMeta(1, 10, 0);
    expect(meta.totalPages).toBe(1);
    expect(meta.hasPrev).toBe(false);
    expect(meta.hasNext).toBe(false);
  });

  it('总数刚好等于每页数量时页数为 1', () => {
    const meta = calcPaginationMeta(1, 10, 10);
    expect(meta.totalPages).toBe(1);
  });

  it('总数刚好等于每页数量 + 1 时页数为 2', () => {
    const meta = calcPaginationMeta(1, 10, 11);
    expect(meta.totalPages).toBe(2);
  });

  it('大数量时应正确计算', () => {
    const meta = calcPaginationMeta(10, 20, 999);
    expect(meta.totalPages).toBe(50);
    expect(meta.hasPrev).toBe(true);
  });
});

// ============================================================================
// normalizePagination — 分页参数规范化
// ============================================================================

describe('normalizePagination', () => {
  it('应使用默认值处理空参数', () => {
    const result = normalizePagination({});
    expect(result).toEqual({
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
      sort: 'createdAt',
      order: 'desc',
    });
  });

  it('应使用自定义页码', () => {
    const result = normalizePagination({ page: 3, limit: 20 });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
  });

  it('负页码应被规范化为 1', () => {
    const result = normalizePagination({ page: -1 });
    expect(result.page).toBe(1);
  });

  it('页码 0 应被规范化为 1', () => {
    const result = normalizePagination({ page: 0 });
    expect(result.page).toBe(1);
  });

  it('超过最大限制应被截断', () => {
    const result = normalizePagination({ limit: 999 });
    expect(result.limit).toBe(PAGINATION_DEFAULTS.MAX_LIMIT);
  });

  it('limit 为 0 或负数应规范化为默认值', () => {
    const r1 = normalizePagination({ limit: 0 });
    expect(r1.limit).toBe(1);
    const r2 = normalizePagination({ limit: -5 });
    expect(r2.limit).toBe(1);
  });

  it('自定义排序字段和方向应保留', () => {
    const result = normalizePagination({ sort: 'name', order: 'asc' });
    expect(result.sort).toBe('name');
    expect(result.order).toBe('asc');
  });
});

// ============================================================================
// createPaginatedResult — 分页结果创建
// ============================================================================

describe('createPaginatedResult', () => {
  it('应正确创建分页结果', () => {
    const result = createPaginatedResult(['a', 'b', 'c'], 1, 10, 25);
    expect(result.data).toEqual(['a', 'b', 'c']);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
      hasPrev: false,
      hasNext: true,
    });
  });

  it('最后一页没有下一页', () => {
    const result = createPaginatedResult(['x'], 3, 10, 25);
    expect(result.pagination.hasNext).toBe(false);
  });
});

// ============================================================================
// createSuccessResult / createErrorResult — Service 结果
// ============================================================================

describe('createSuccessResult', () => {
  it('应创建成功结果', () => {
    const result = createSuccessResult({ id: 1, name: 'test' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 1, name: 'test' });
  });

  it('可选消息', () => {
    const result = createSuccessResult('data', '操作成功');
    expect(result.message).toBe('操作成功');
  });
});

describe('createErrorResult', () => {
  it('应创建错误结果', () => {
    const result = createErrorResult('NOT_FOUND', '资源不存在');
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      code: 'NOT_FOUND',
      message: '资源不存在',
      details: undefined,
    });
  });

  it('错误详情应传递', () => {
    const result = createErrorResult('VALIDATION', '校验失败', { field: 'email' });
    expect(result.error?.details).toEqual({ field: 'email' });
  });
});

// ============================================================================
// 常量验证
// ============================================================================

describe('PAGINATION_DEFAULTS', () => {
  it('默认页为 1', () => {
    expect(PAGINATION_DEFAULTS.PAGE).toBe(1);
  });

  it('默认每页数量为 10', () => {
    expect(PAGINATION_DEFAULTS.LIMIT).toBe(10);
  });

  it('最大每页数量为 100', () => {
    expect(PAGINATION_DEFAULTS.MAX_LIMIT).toBe(100);
  });
});

// ============================================================================
// HTTP 状态码常量验证
// ============================================================================

describe('HTTP_STATUS', () => {
  it('状态码应符合 HTTP 标准', async () => {
    const { HTTP_STATUS } = await import('./index');
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.INTERNAL_ERROR).toBe(500);
  });
});
