/**
 * 登录日志服务单元测试
 *
 * @module @yunshu/server-core/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogininforService } from '../LogininforService';
import type { ILogininforCreate } from '@yunshu/shared';

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

describe('LogininforService', () => {
  let service: LogininforService;

  beforeEach(() => {
    service = new LogininforService();
  });

  describe('findById', () => {
    it('应返回存在的登录日志', async () => {
      const result = await service.findById('1');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.infoId).toBe('1');
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
          log.userName.includes('张三') ||
          log.loginAccount.includes('张三') ||
          log.ip.includes('张三')
        ).toBe(true);
      }
    });

    it('应支持用户名称筛选', async () => {
      const result = await service.findWithPagination({ userName: '张三', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].userName).toBe('张三');
      }
    });

    it('应支持登录账号筛选', async () => {
      const result = await service.findWithPagination({ loginAccount: 'admin1', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持状态筛选', async () => {
      const result = await service.findWithPagination({ status: '0', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持操作类型筛选', async () => {
      const result = await service.findWithPagination({ operationType: '登录', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持时间范围筛选', async () => {
      const beginTime = new Date(Date.now() - 3600000).toISOString();
      const endTime = new Date().toISOString();
      const result = await service.findWithPagination({ beginTime, endTime, page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持升序排序', async () => {
      const result = await service.findWithPagination({ sort: 'loginTime', order: 'asc', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });
  });

  describe('create', () => {
    it('应成功创建登录日志', async () => {
      const newLog: ILogininforCreate = {
        userName: '测试用户',
        loginAccount: 'testuser',
        status: '0',
        loginLocation: '北京市朝阳区',
        operationType: '登录',
        loginTime: new Date().toISOString(),
        ip: '192.168.1.100',
      };
      const result = await service.create(newLog);
      expect(result.success).toBe(true);
      expect(result.data?.userName).toBe('测试用户');
      expect(result.data?.os).toBe('Unknown');
      expect(result.data?.browser).toBe('Unknown');
    });

    it('应使用默认操作系统和浏览器', async () => {
      const newLog: ILogininforCreate = {
        userName: '测试用户',
        loginAccount: 'testuser',
        status: '0',
        operationType: '登录',
        loginTime: new Date().toISOString(),
        ip: '192.168.1.100',
      };
      const result = await service.create(newLog);
      expect(result.success).toBe(true);
      expect(result.data?.os).toBe('Unknown');
      expect(result.data?.browser).toBe('Unknown');
    });
  });

  describe('delete', () => {
    it('应成功删除登录日志', async () => {
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
    it('应成功清理所有登录日志', async () => {
      const result = await service.clean();
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });

  describe('deleteBatch', () => {
    it('应成功批量删除登录日志', async () => {
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

  describe('unlock', () => {
    it('应成功解锁账号', async () => {
      const result = await service.unlock('admin1');
      expect(result.success).toBe(true);
    });

    it('未找到锁定记录应返回错误', async () => {
      const result = await service.unlock('nonexistent');
      expect(result.success).toBe(false);
    });
  });
});
