/**
 * 服务器监控服务
 *
 * @module @yunshu/server-core/modules/monitor
 */

import type { IServer } from '@yunshu/shared';
import type { ServiceResult } from '@yunshu/shared';
import { createSuccessResult } from '@yunshu/shared';
import { BaseService } from '../../base/BaseService';

interface ServerModel {
  // Mock model interface
}

/**
 * 获取服务器监控信息
 */
function getServerInfo(): IServer {
  const os = require('os');
  const platform = os.platform();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  // 模拟磁盘信息
  const totalDisk = 500 * 1024 * 1024 * 1024; // 500GB
  const freeDisk = 200 * 1024 * 1024 * 1024; // 200GB
  const usedDisk = totalDisk - freeDisk;

  // 模拟CPU使用率
  const cpuUsage = Math.random() * 60 + 10; // 10% - 70%

  // 模拟内存使用率
  const memoryUsage = (usedMem / totalMem) * 100;

  // 模拟磁盘使用率
  const diskUsage = (usedDisk / totalDisk) * 100;

  const osName = platform === 'win32' ? 'Windows Server 2022' : platform === 'darwin' ? 'macOS Sonoma' : 'Ubuntu 22.04 LTS';
  const osArch = os.arch();
  const cpuCount = os.cpus().length;

  // 获取CPU型号
  const cpuModel = os.cpus()[0]?.model || 'Intel Xeon';

  // 计算运行时间
  const uptime = os.uptime();

  return {
    serverName: '云枢生产服务器',
    os: osName,
    osArch,
    cpuCount,
    cpuUsage: Math.round(cpuUsage * 100) / 100,
    memoryUsed: Math.round(usedMem / (1024 * 1024 * 1024) * 100) / 100,
    memoryTotal: Math.round(totalMem / (1024 * 1024 * 1024) * 100) / 100,
    memoryUsage: Math.round(memoryUsage * 100) / 100,
    diskUsed: Math.round(usedDisk / (1024 * 1024 * 1024) * 100) / 100,
    diskTotal: Math.round(totalDisk / (1024 * 1024 * 1024) * 100) / 100,
    diskUsage: Math.round(diskUsage * 100) / 100,
    bootTime: new Date(Date.now() - uptime * 1000).toISOString(),
    uptime: Math.round(uptime),
    jvm: 'OpenJDK 17.0.9',
    javaVersion: '17.0.9',
    database: 'PostgreSQL 16.1',
    databaseVersion: '16.1',
    projectPath: '/app/yunshu-platform',
    hostName: os.hostname(),
    collectTime: new Date().toISOString(),
  };
}

export class ServerService extends BaseService<ServerModel, IServer, Partial<IServer>, Partial<IServer>> {
  constructor() {
    super({} as ServerModel, { entityName: '服务器监控', softDelete: false });
  }

  async getServerInfo(): Promise<ServiceResult<IServer>> {
    const info = getServerInfo();
    return createSuccessResult(info);
  }

  async getCpuInfo(): Promise<ServiceResult<{ coreCount: number; usage: number; model: string }>> {
    const info = getServerInfo();
    return createSuccessResult({
      coreCount: info.cpuCount,
      usage: info.cpuUsage,
      model: 'Intel Xeon / Apple Silicon',
    });
  }

  async getMemoryInfo(): Promise<ServiceResult<{ used: number; total: number; usage: number; unit: string }>> {
    const info = getServerInfo();
    return createSuccessResult({
      used: info.memoryUsed,
      total: info.memoryTotal,
      usage: info.memoryUsage,
      unit: 'GB',
    });
  }

  async getDiskInfo(): Promise<ServiceResult<{ used: number; total: number; usage: number; unit: string }>> {
    const info = getServerInfo();
    return createSuccessResult({
      used: info.diskUsed,
      total: info.diskTotal,
      usage: info.diskUsage,
      unit: 'GB',
    });
  }

  async getJvmInfo(): Promise<ServiceResult<{ name: string; version: string; runtime: string }>> {
    const info = getServerInfo();
    return createSuccessResult({
      name: info.jvm,
      version: info.javaVersion,
      runtime: 'Java HotSpot(TM) 64-Bit Server VM',
    });
  }
}

export const serverService = new ServerService();
