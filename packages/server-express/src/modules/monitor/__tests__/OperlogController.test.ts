/**
 * 操作日志控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { OperlogController } from '../OperlogController';

// Mock 服务层
vi.mock('@yunshu/server-core/modules/monitor', () => ({
  operlogService: {
    findById: vi.fn(),
    findWithPagination: vi.fn(),
    delete: vi.fn(),
    deleteBatch: vi.fn(),
    clean: vi.fn(),
  },
}));

import { operlogService } from '@yunshu/server-core/modules/monitor';

describe('OperlogController', () => {
  let controller: OperlogController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;
  let statusCode: number;

  beforeEach(() => {
    controller = new OperlogController();
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
    it('应返回分页操作日志列表', async () => {
      const mockResult = {
        success: true,
        data: {
          data: [{ operId: '1', operName: 'admin', status: '0' }],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
        },
      };

      (operlogService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(operlogService.findWithPagination).toHaveBeenCalledWith({
        search: undefined,
        operName: undefined,
        operType: undefined,
        operModule: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined,
        page: 1,
        limit: 10,
        sort: undefined,
        order: undefined,
      });
    });

    it('应支持搜索和筛选参数', async () => {
      const mockResult = { success: true, data: { data: [], pagination: {} } };
      (operlogService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: {
          search: 'admin',
          operName: 'admin',
          operType: 'update',
          operModule: 'user',
          status: '0',
          beginTime: '2024-01-01',
          endTime: '2024-12-31',
          page: '1',
          limit: '10',
        },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(operlogService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'admin',
          operName: 'admin',
          status: '0',
        }),
      );
    });
  });

  describe('getById', () => {
    it('应返回指定ID的操作日志详情', async () => {
      const mockLog = { operId: '1', operName: 'admin' };
      (operlogService.findById as any).mockResolvedValue({ success: true, data: mockLog });

      mockRequest = { params: { id: '1' } };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(operlogService.findById).toHaveBeenCalledWith('1');
    });

    it('不存在的日志应返回错误', async () => {
      (operlogService.findById as any).mockResolvedValue({
        success: false,
        error: { message: '操作日志不存在' },
      });

      mockRequest = { params: { id: '999' } };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(false);
    });
  });

  describe('delete', () => {
    it('应成功删除操作日志', async () => {
      (operlogService.delete as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { params: { id: '1' } };

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(operlogService.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteBatch', () => {
    it('应成功批量删除操作日志', async () => {
      (operlogService.deleteBatch as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { body: { ids: ['1', '2', '3'] } };

      await controller.deleteBatch(mockRequest as Request, mockResponse as Response);

      expect(operlogService.deleteBatch).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('空数组应返回400错误', async () => {
      mockRequest = { body: { ids: [] } };

      await controller.deleteBatch(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });

    it('无ids参数应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.deleteBatch(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('clean', () => {
    it('应成功清空操作日志', async () => {
      (operlogService.clean as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { body: {} };

      await controller.clean(mockRequest as Request, mockResponse as Response);

      expect(operlogService.clean).toHaveBeenCalled();
    });
  });

  describe('export', () => {
    it('应成功导出操作日志', async () => {
      const mockData = [{ operId: '1', operName: 'admin' }];
      (operlogService.findWithPagination as any).mockResolvedValue({
        success: true,
        data: { data: mockData, pagination: { total: 1 } },
      });

      mockRequest = { query: {} };

      await controller.export(mockRequest as Request, mockResponse as Response);

      expect(operlogService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10000 }),
      );
      expect(jsonData.data).toEqual(mockData);
    });

    it('查询失败时应返回错误', async () => {
      (operlogService.findWithPagination as any).mockResolvedValue({
        success: false,
        error: { message: '查询失败' },
      });

      mockRequest = { query: {} };

      await controller.export(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(false);
    });
  });
});
