/**
 * 服务器监控控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { ServerController } from '../ServerController';

describe('ServerController', () => {
  let controller: ServerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    controller = new ServerController();
    jsonData = null;

    mockResponse = {
      status: vi.fn().mockImplementation(() => {
        return mockResponse;
      }) as any,
      json: vi.fn().mockImplementation((data) => {
        jsonData = data;
        return mockResponse;
      }) as any,
    };

    vi.clearAllMocks();
  });

  describe('getServerInfo', () => {
    it('应返回服务器信息', async () => {
      mockRequest = { body: {} };

      await controller.getServerInfo(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data).toBeDefined();
    });
  });

  describe('getCpuInfo', () => {
    it('应返回CPU信息', async () => {
      mockRequest = { body: {} };

      await controller.getCpuInfo(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.cpuNum).toBeDefined();
    });
  });

  describe('getMemoryInfo', () => {
    it('应返回内存信息', async () => {
      mockRequest = { body: {} };

      await controller.getMemoryInfo(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.total).toBeGreaterThan(0);
    });
  });

  describe('getDiskInfo', () => {
    it('应返回磁盘信息', async () => {
      mockRequest = { body: {} };

      await controller.getDiskInfo(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(Array.isArray(jsonData.data)).toBe(true);
    });
  });

  describe('getJvmInfo', () => {
    it('应返回JVM信息', async () => {
      mockRequest = { body: {} };

      await controller.getJvmInfo(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data).toBeDefined();
    });
  });
});
