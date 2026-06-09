/**
 * 在线用户服务单元测试
 *
 * @module @yunshu/server-core/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OnlineService } from '../OnlineService';

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

describe('OnlineService', () => {
  let service: OnlineService;

  beforeEach(() => {
    service = new OnlineService();
  });

  describe('findById', () => {
    it('应返回存在的在线用户', async () => {
      const result = await service.findWithPagination({ page: 1, limit: 1 });
      if (result.data?.data.length) {
        const sessionId = result.data.data[0].sessionId;
        const byIdResult = await service.findById(sessionId);
        expect(byIdResult.success).toBe(true);
        expect(byIdResult.data?.sessionId).toBe(sessionId);
      }
    });

    it('不存在的用户应返回错误', async () => {
      const result = await service.findById('nonexistent_session');
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
        const user = result.data.data[0];
        expect(
          user.userName.includes('张三') ||
          user.loginAccount.includes('张三') ||
          user.ip.includes('张三')
        ).toBe(true);
      }
    });

    it('应支持用户名称筛选', async () => {
      const result = await service.findWithPagination({ userName: '张三', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持登录账号筛选', async () => {
      const result = await service.findWithPagination({ loginAccount: 'user1', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持升序排序', async () => {
      const result = await service.findWithPagination({ sort: 'loginTime', order: 'asc', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持降序排序', async () => {
      const result = await service.findWithPagination({ sort: 'loginTime', order: 'desc', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });
  });

  describe('getStats', () => {
    it('应返回在线用户统计信息', async () => {
      const result = await service.getStats();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.totalCount).toBeGreaterThanOrEqual(0);
      expect(result.data?.pcCount).toBeGreaterThanOrEqual(0);
      expect(result.data?.mobileCount).toBeGreaterThanOrEqual(0);
    });

    it('PC和移动端总数应等于总数', async () => {
      const result = await service.getStats();
      expect(result.success).toBe(true);
      const data = result.data;
      if (data) {
        expect(data.pcCount + data.mobileCount).toBe(data.totalCount);
      }
    });
  });

  describe('forceLogout', () => {
    it('应成功强制下线用户', async () => {
      const listResult = await service.findWithPagination({ page: 1, limit: 1 });
      if (listResult.data?.data.length) {
        const sessionId = listResult.data.data[0].sessionId;
        const result = await service.forceLogout(sessionId);
        expect(result.success).toBe(true);
        expect(result.data).toBe(true);
      }
    });

    it('不存在的用户应返回错误', async () => {
      const result = await service.forceLogout('nonexistent_session');
      expect(result.success).toBe(false);
    });
  });

  describe('forceLogoutBatch', () => {
    it('应成功批量强制下线用户', async () => {
      const result = await service.forceLogoutBatch(['session_1', 'session_2']);
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('number');
      expect(result.data).toBeGreaterThanOrEqual(0);
    });

    it('传入空数组应返回0', async () => {
      const result = await service.forceLogoutBatch([]);
      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('部分ID不存在时应返回实际下线数量', async () => {
      const result = await service.forceLogoutBatch(['nonexistent1', 'nonexistent2']);
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('number');
    });
  });
});
