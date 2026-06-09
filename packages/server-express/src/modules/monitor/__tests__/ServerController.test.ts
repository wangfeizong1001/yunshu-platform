/**
 * 服务器监控控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { ServerController } from '../ServerController';

// Mock 服务层
vi.mock('@yunshu/server-core/modules/monitor', () => ({
  serverService: {
    getServerInfo: vi.fn(),
    getCpuInfo: vi.fn(),
    getMemoryInfo: vi.fn(),
    getDiskInfo: vi.fn(),
    getJvmInfo: vi.fn(),
  },
}));

import { serverService } from '@yunshu/server-core/modules/monitor';

describe('ServerController', () => {
  let controller: ServerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;
  let statusCode: number;

  beforeEach(() => {
    controller = new ServerController();
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

  describe('getServerInfo', () => {
    it('应返回服务器信息', async () => {
      const mockInfo = {
        os: 'Linux',
        hostname: 'server01',
        cpuNum: 8,
        totalMemory: 16384,
        usedMemory: 8192,
        availableMemory: 8192,
      };
      (serverService.getServerInfo as any).mockResolvedValue({ success: true, data: mockInfo });

      mockRequest = { body: {} };

      await controller.getServerInfo(mockRequest as Request, mockResponse as Response);

      expect(serverService.getServerInfo).toHaveBeenCalled();
      expect(jsonData).toEqual(mockInfo);
    });
  });

  describe('getCpuInfo', () => {
    it('应返回CPU信息', async () => {
      const mockCpuInfo = {
        cpuNum: 8,
        used: 45.5,
        idle: 54.5,
        model: 'Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz',
      };
      (serverService.getCpuInfo as any).mockResolvedValue({ success: true, data: mockCpuInfo });

      mockRequest = { body: {} };

      await controller.getCpuInfo(mockRequest as Request, mockResponse as Response);

      expect(serverService.getCpuInfo).toHaveBeenCalled();
      expect(jsonData).toEqual(mockCpuInfo);
    });
  });

  describe('getMemoryInfo', () => {
    it('应返回内存信息', async () => {
      const mockMemoryInfo = {
        total: 16384,
        used: 8192,
        available: 8192,
        usage: 50.0,
      };
      (serverService.getMemoryInfo as any).mockResolvedValue({ success: true, data: mockMemoryInfo });

      mockRequest = { body: {} };

      await controller.getMemoryInfo(mockRequest as Request, mockResponse as Response);

      expect(serverService.getMemoryInfo).toHaveBeenCalled();
      expect(jsonData).toEqual(mockMemoryInfo);
    });
  });

  describe('getDiskInfo', () => {
    it('应返回磁盘信息', async () => {
      const mockDiskInfo = [
        {
          dir: '/',
          type: 'ext4',
          total: 500000,
          used: 250000,
          available: 250000,
          usage: 50.0,
        },
      ];
      (serverService.getDiskInfo as any).mockResolvedValue({ success: true, data: mockDiskInfo });

      mockRequest = { body: {} };

      await controller.getDiskInfo(mockRequest as Request, mockResponse as Response);

      expect(serverService.getDiskInfo).toHaveBeenCalled();
      expect(jsonData).toEqual(mockDiskInfo);
    });
  });

  describe('getJvmInfo', () => {
    it('应返回JVM信息', async () => {
      const mockJvmInfo = {
        javaVersion: '17.0.1',
        javaHome: '/usr/local/java',
        maxMemory: 4096,
        totalMemory: 2048,
        freeMemory: 1024,
        usage: 50.0,
      };
      (serverService.getJvmInfo as any).mockResolvedValue({ success: true, data: mockJvmInfo });

      mockRequest = { body: {} };

      await controller.getJvmInfo(mockRequest as Request, mockResponse as Response);

      expect(serverService.getJvmInfo).toHaveBeenCalled();
      expect(jsonData).toEqual(mockJvmInfo);
    });
  });
});
