/**
 * 在线用户控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { OnlineController } from '../OnlineController';

// Mock 服务层
vi.mock('@yunshu/server-core/modules/monitor', () => ({
  onlineService: {
    findWithPagination: vi.fn(),
    getStats: vi.fn(),
    forceLogout: vi.fn(),
    forceLogoutBatch: vi.fn(),
  },
}));

import { onlineService } from '@yunshu/server-core/modules/monitor';

describe('OnlineController', () => {
  let controller: OnlineController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;
  let statusCode: number;

  beforeEach(() => {
    controller = new OnlineController();
    jsonData = null;
    statusCode = 200;

    mockResponse = {
      status: vi.fn().mockImplementation((code) => {
        statusCode = code;
        return mockResponse;
      }) as any,
      json: vi.fn().mockImplementation((data) => {
        jsonData = data;
        return mockResponse;
      }) as any,
    };

    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应返回分页在线用户列表', async () => {
      const mockResult = {
        success: true,
        data: {
          data: [{ sessionId: 'abc123', userName: 'admin', loginTime: '2024-01-01' }],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
        },
      };

      (onlineService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(onlineService.findWithPagination).toHaveBeenCalledWith({
        search: undefined,
        userName: undefined,
        loginAccount: undefined,
        page: 1,
        limit: 10,
        sort: undefined,
        order: undefined,
      });
    });

    it('应支持搜索和筛选参数', async () => {
      const mockResult = { success: true, data: { data: [], pagination: {} } };
      (onlineService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: {
          search: 'admin',
          userName: 'admin',
          loginAccount: 'admin@example.com',
          page: '1',
          limit: '10',
        },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(onlineService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'admin',
          userName: 'admin',
        }),
      );
    });
  });

  describe('stats', () => {
    it('应返回在线用户统计信息', async () => {
      const mockStats = {
        total: 100,
        active: 80,
        inactive: 20,
      };
      (onlineService.getStats as any).mockResolvedValue({ success: true, data: mockStats });

      mockRequest = { body: {} };

      await controller.stats(mockRequest as Request, mockResponse as Response);

      expect(onlineService.getStats).toHaveBeenCalled();
      expect(jsonData.data).toEqual(mockStats);
    });
  });

  describe('forceLogout', () => {
    it('应成功强制用户下线', async () => {
      (onlineService.forceLogout as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { body: { sessionId: 'abc123' } };

      await controller.forceLogout(mockRequest as Request, mockResponse as Response);

      expect(onlineService.forceLogout).toHaveBeenCalledWith('abc123');
    });

    it('缺少sessionId应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.forceLogout(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('forceLogoutBatch', () => {
    it('应成功批量强制用户下线', async () => {
      (onlineService.forceLogoutBatch as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { body: { sessionIds: ['abc123', 'def456'] } };

      await controller.forceLogoutBatch(mockRequest as Request, mockResponse as Response);

      expect(onlineService.forceLogoutBatch).toHaveBeenCalledWith(['abc123', 'def456']);
    });

    it('空数组应返回400错误', async () => {
      mockRequest = { body: { sessionIds: [] } };

      await controller.forceLogoutBatch(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });

    it('无sessionIds参数应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.forceLogoutBatch(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });
});
