/**
 * 操作日志服务单元测试
 *
 * @module @yunshu/server-core/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OperlogService } from '../OperlogService';
import type { IOperlogCreate } from '@yunshu/shared';

// Mock @yunshu/shared 模块
vi.mock('@yunshu/shared', () => ({
  ErrorCode: {
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
  },
  createSuccessResult: vi.fn((data, message) => ({
    success: true,
    data,
    message,
  })),
  createErrorResult: vi.fn((code, message) => ({
    success: false,
    error: { code, message },
  })),
  createPaginatedResult: vi.fn((data, page, limit, total) => ({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasPrev: page > 1,
      hasNext: page * limit < total,
    },
  })),
}));

// Mock BaseService
vi.mock('../../base/BaseService', () => ({
  BaseService: vi.fn().mockImplementation(() => ({})),
}));

describe('OperlogService', () => {
  let service: OperlogService;

  beforeEach(() => {
    service = new OperlogService();
  });

  describe('findById', () => {
    it('应返回存在的操作日志', async () => {
      const result = await service.findById('1');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.operId).toBe('1');
    });

    it('不存在的日志应返回错误', async () => {
      const result = await service.findById('999');
      expect(result.success).toBe(false);
    });
  });

  describe('findWithPagination', () => {
    it('应返回分页结果', async () => {
      const result = await service.findWithPagination({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.data).toBeInstanceOf(Array);
    });

    it('应支持关键词搜索', async () => {
      const result = await service.findWithPagination({ search: '张三', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        const log = result.data.data[0];
        expect(
          log.operName.includes('张三') ||
          log.operModule.includes('张三') ||
          log.operUrl.includes('张三')
        ).toBe(true);
      }
    });

    it('应支持操作人筛选', async () => {
      const result = await service.findWithPagination({ operName: '张三', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].operName).toBe('张三');
      }
    });

    it('应支持操作类型筛选', async () => {
      const result = await service.findWithPagination({ operType: '查询', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持模块筛选', async () => {
      const result = await service.findWithPagination({ operModule: '用户管理', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持状态筛选', async () => {
      const result = await service.findWithPagination({ status: '0', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持时间范围筛选', async () => {
      const beginTime = new Date(Date.now() - 3600000).toISOString();
      const endTime = new Date().toISOString();
      const result = await service.findWithPagination({ beginTime, endTime, page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持升序排序', async () => {
      const result = await service.findWithPagination({ sort: 'operTime', order: 'asc', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });
  });

  describe('create', () => {
    it('应成功创建操作日志', async () => {
      const newLog: IOperlogCreate = {
        operName: '测试用户',
        operTime: new Date().toISOString(),
        operType: '查询',
        operModule: '用户管理',
        status: '0',
        requestMethod: 'GET',
        operUrl: '/api/system/user/1',
        operIp: '192.168.1.100',
      };
      const result = await service.create(newLog);
      expect(result.success).toBe(true);
      expect(result.data?.operName).toBe('测试用户');
      expect(result.data?.operSystem).toBe('Unknown');
      expect(result.data?.browser).toBe('Unknown');
    });

    it('应使用默认值填充可选字段', async () => {
      const newLog: IOperlogCreate = {
        operName: '测试用户',
        operTime: new Date().toISOString(),
        operType: '新增',
        operModule: '角色管理',
        status: '0',
        requestMethod: 'POST',
        operUrl: '/api/system/role',
        operIp: '192.168.1.100',
      };
      const result = await service.create(newLog);
      expect(result.success).toBe(true);
      expect(result.data?.costTime).toBe(0);
      expect(result.data?.operLocation).toBe('Unknown');
      expect(result.data?.operParam).toBe('');
      expect(result.data?.jsonResult).toBe('');
    });
  });

  describe('delete', () => {
    it('应成功删除操作日志', async () => {
      const result = await service.delete('1');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('删除不存在的日志应返回错误', async () => {
      const result = await service.delete('999');
      expect(result.success).toBe(false);
    });
  });

  describe('clean', () => {
    it('应成功清理所有操作日志', async () => {
      const result = await service.clean();
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });

  describe('deleteBatch', () => {
    it('应成功批量删除操作日志', async () => {
      const result = await service.deleteBatch(['1', '2', '3']);
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('number');
      expect(result.data).toBeGreaterThanOrEqual(0);
    });

    it('传入空数组应返回0', async () => {
      const result = await service.deleteBatch([]);
      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('部分ID不存在时应返回实际删除数量', async () => {
      const result = await service.deleteBatch(['1', '999', '888']);
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('number');
    });
  });
});
