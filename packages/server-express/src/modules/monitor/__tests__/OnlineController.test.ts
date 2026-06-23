/**
 * 在线用户控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { OnlineController } from '../OnlineController';

describe('OnlineController', () => {
  let controller: OnlineController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    controller = new OnlineController();
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
    it('应返回分页在线用户列表', async () => {
      mockRequest = { query: {} };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.rows).toBeDefined();
    });
  });

  describe('forceLogout', () => {
    it('应成功强制用户下线', async () => {
      mockRequest = { params: { tokenId: 'abc123' } };

      await controller.forceLogout(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });
});
