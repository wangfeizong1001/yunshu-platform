/**
 * 操作日志控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { OperlogController } from '../OperlogController';

describe('OperlogController', () => {
  let controller: OperlogController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    controller = new OperlogController();
    jsonData = null;

    mockResponse = {
      status: vi.fn().mockImplementation(() => mockResponse) as any,
      json: vi.fn().mockImplementation((data) => {
        jsonData = data;
        return mockResponse;
      }) as any,
    };

    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应返回分页操作日志列表', async () => {
      mockRequest = { query: {} };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.rows).toBeDefined();
    });
  });

  describe('remove', () => {
    it('应成功删除操作日志', async () => {
      mockRequest = { params: { operId: '1' } };

      await controller.remove(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });

  describe('clean', () => {
    it('应成功清空操作日志', async () => {
      mockRequest = { body: {} };

      await controller.clean(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });
});
