/**
 * 登录日志控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { LogininforController } from '../LogininforController';

describe('LogininforController', () => {
  let controller: LogininforController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    controller = new LogininforController();
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
    it('应返回分页登录日志列表', async () => {
      mockRequest = { query: {} };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.rows).toBeDefined();
      expect(jsonData.data.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('remove', () => {
    it('应成功删除登录日志', async () => {
      mockRequest = { params: { infoId: '1' } };

      await controller.remove(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });

  describe('clean', () => {
    it('应成功清空登录日志', async () => {
      mockRequest = { body: {} };

      await controller.clean(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });
});
