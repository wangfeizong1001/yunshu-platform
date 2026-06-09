/**
 * 服务器监控服务单元测试
 *
 * @module @yunshu/server-core/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServerService } from '../ServerService';

// Mock @yunshu/shared 模块
vi.mock('@yunshu/shared', () => ({
  createSuccessResult: vi.fn((data, message) => ({
    success: true,
    data,
    message,
  })),
}));

// Mock BaseService
vi.mock('../../base/BaseService', () => ({
  BaseService: vi.fn().mockImplementation(() => ({})),
}));

// Mock os module - 使用命名导出配合 default，兼容 import os from 'os'
vi.mock('os', () => {
  const mockOs = {
    platform: vi.fn(() => 'linux'),
    arch: vi.fn(() => 'x64'),
    totalmem: vi.fn(() => 16 * 1024 * 1024 * 1024), // 16GB
    freemem: vi.fn(() => 4 * 1024 * 1024 * 1024), // 4GB
    cpus: vi.fn(() => [
      { model: 'Intel Xeon E5-2680 v4 @ 2.40GHz' },
      { model: 'Intel Xeon E5-2680 v4 @ 2.40GHz' },
      { model: 'Intel Xeon E5-2680 v4 @ 2.40GHz' },
      { model: 'Intel Xeon E5-2680 v4 @ 2.40GHz' },
    ]),
    uptime: vi.fn(() => 864000), // 10 days
    hostname: vi.fn(() => 'test-server'),
  };
  return {
    default: mockOs,
    ...mockOs,
  };
});

describe('ServerService', () => {
  let service: ServerService;

  beforeEach(() => {
    service = new ServerService();
  });

  describe('getServerInfo', () => {
    it('应返回服务器监控信息', async () => {
      const result = await service.getServerInfo();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('应包含必要的服务器字段', async () => {
      const result = await service.getServerInfo();
      expect(result.data?.serverName).toBeDefined();
      expect(result.data?.os).toBeDefined();
      expect(result.data?.osArch).toBeDefined();
      expect(result.data?.cpuCount).toBeDefined();
      expect(result.data?.cpuUsage).toBeDefined();
      expect(result.data?.memoryUsed).toBeDefined();
      expect(result.data?.memoryTotal).toBeDefined();
      expect(result.data?.memoryUsage).toBeDefined();
      expect(result.data?.diskUsed).toBeDefined();
      expect(result.data?.diskTotal).toBeDefined();
      expect(result.data?.diskUsage).toBeDefined();
      expect(result.data?.uptime).toBeDefined();
      expect(result.data?.collectTime).toBeDefined();
    });

    it('内存使用率计算应正确', async () => {
      const result = await service.getServerInfo();
      const { memoryUsed, memoryTotal, memoryUsage } = result.data!;
      const expectedUsage = (memoryUsed / memoryTotal) * 100;
      expect(Math.abs(memoryUsage - expectedUsage)).toBeLessThan(1);
    });

    it('CPU使用率应在合理范围内', async () => {
      const result = await service.getServerInfo();
      expect(result.data?.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(result.data?.cpuUsage).toBeLessThanOrEqual(100);
    });

    it('内存使用率应在合理范围内', async () => {
      const result = await service.getServerInfo();
      expect(result.data?.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(result.data?.memoryUsage).toBeLessThanOrEqual(100);
    });

    it('磁盘使用率应在合理范围内', async () => {
      const result = await service.getServerInfo();
      expect(result.data?.diskUsage).toBeGreaterThanOrEqual(0);
      expect(result.data?.diskUsage).toBeLessThanOrEqual(100);
    });
  });

  describe('getCpuInfo', () => {
    it('应返回CPU信息', async () => {
      const result = await service.getCpuInfo();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('应包含CPU核心数和型号', async () => {
      const result = await service.getCpuInfo();
      expect(result.data?.coreCount).toBeDefined();
      expect(result.data?.coreCount).toBe(4);
      expect(result.data?.usage).toBeDefined();
      expect(result.data?.model).toBeDefined();
    });

    it('CPU使用率应在合理范围内', async () => {
      const result = await service.getCpuInfo();
      expect(result.data?.usage).toBeGreaterThanOrEqual(0);
      expect(result.data?.usage).toBeLessThanOrEqual(100);
    });
  });

  describe('getMemoryInfo', () => {
    it('应返回内存信息', async () => {
      const result = await service.getMemoryInfo();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('应包含内存使用量、总量和使用率', async () => {
      const result = await service.getMemoryInfo();
      expect(result.data?.used).toBeDefined();
      expect(result.data?.total).toBeDefined();
      expect(result.data?.usage).toBeDefined();
      expect(result.data?.unit).toBe('GB');
    });

    it('内存使用率计算应正确', async () => {
      const result = await service.getMemoryInfo();
      const { used, total, usage } = result.data!;
      const expectedUsage = (used / total) * 100;
      expect(Math.abs(usage - expectedUsage)).toBeLessThan(1);
    });
  });

  describe('getDiskInfo', () => {
    it('应返回磁盘信息', async () => {
      const result = await service.getDiskInfo();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('应包含磁盘使用量、总量和使用率', async () => {
      const result = await service.getDiskInfo();
      expect(result.data?.used).toBeDefined();
      expect(result.data?.total).toBeDefined();
      expect(result.data?.usage).toBeDefined();
      expect(result.data?.unit).toBe('GB');
    });

    it('磁盘使用率计算应正确', async () => {
      const result = await service.getDiskInfo();
      const { used, total, usage } = result.data!;
      const expectedUsage = (used / total) * 100;
      expect(Math.abs(usage - expectedUsage)).toBeLessThan(1);
    });
  });

  describe('getJvmInfo', () => {
    it('应返回JVM信息', async () => {
      const result = await service.getJvmInfo();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('应包含JVM名称、版本和运行时信息', async () => {
      const result = await service.getJvmInfo();
      expect(result.data?.name).toBeDefined();
      expect(result.data?.version).toBeDefined();
      expect(result.data?.runtime).toBeDefined();
    });

    it('应返回正确的JVM版本', async () => {
      const result = await service.getJvmInfo();
      expect(result.data?.name).toBe('OpenJDK 17.0.9');
      expect(result.data?.version).toBe('17.0.9');
    });
  });
});
