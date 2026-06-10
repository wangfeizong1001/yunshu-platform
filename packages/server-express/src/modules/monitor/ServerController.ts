/**
 * 服务器监控控制器
 *
 * 提供服务器运行状态信息接口，包括 CPU、内存、磁盘和 Node.js 运行时信息。
 * 由于当前为 Node.js 后端，JVM 信息替换为 V8/Node 运行时信息。
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import os from 'os';
import v8 from 'v8';

// ============================================================================
// ServerController
// ============================================================================

/**
 * 服务器监控控制器
 */
export class ServerController extends BaseController {
  /**
   * 获取全部服务器信息
   */
  async getServerInfo(req: Request, res: Response) {
    try {
      const info = {
        cpu: this._getCpuInfo(),
        memory: this._getMemoryInfo(),
        disk: this._getDiskInfo(),
        jvm: this._getJvmInfo(),
        system: this._getSystemInfo(),
      };
      return this.success(res, info, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 获取 CPU 信息
   */
  async getCpuInfo(req: Request, res: Response) {
    try {
      return this.success(res, this._getCpuInfo(), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 获取内存信息
   */
  async getMemoryInfo(req: Request, res: Response) {
    try {
      return this.success(res, this._getMemoryInfo(), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 获取磁盘信息
   *
   * @remarks
   * 由于 Node.js 标准库不直接提供磁盘使用率，此处提供模拟数据。
   * 生产环境可使用 systeminformation、node-diskusage 等第三方库。
   */
  async getDiskInfo(req: Request, res: Response) {
    try {
      return this.success(res, this._getDiskInfo(), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 获取 Node.js/V8 运行时信息（代替传统 JVM 信息）
   */
  async getJvmInfo(req: Request, res: Response) {
    try {
      return this.success(res, this._getJvmInfo(), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  // ========================================================================
  // 私有方法：信息收集
  // ========================================================================

  /** 获取 CPU 信息 */
  private _getCpuInfo() {
    const cpus = os.cpus();
    const coreCount = cpus.length;
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;

    for (const cpu of cpus) {
      user += cpu.times.user;
      nice += cpu.times.nice;
      sys += cpu.times.sys;
      idle += cpu.times.idle;
      irq += cpu.times.irq;
    }

    const total = user + nice + sys + idle + irq;
    const usage = ((total - idle) / total) * 100;

    return {
      coreCount,
      model: cpus[0]?.model || 'unknown',
      speedMHz: cpus[0]?.speed || 0,
      loadAvg: os.loadavg(),
      usagePercent: Number(usage.toFixed(2)),
      userPercent: Number(((user / total) * 100).toFixed(2)),
      systemPercent: Number(((sys / total) * 100).toFixed(2)),
      idlePercent: Number(((idle / total) * 100).toFixed(2)),
    };
  }

  /** 获取内存信息 */
  private _getMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
      total: total,
      totalGB: Number((total / 1024 / 1024 / 1024).toFixed(2)),
      used: used,
      usedGB: Number((used / 1024 / 1024 / 1024).toFixed(2)),
      free: free,
      freeGB: Number((free / 1024 / 1024 / 1024).toFixed(2)),
      usagePercent: Number(((used / total) * 100).toFixed(2)),
      freePercent: Number(((free / total) * 100).toFixed(2)),
    };
  }

  /** 获取磁盘信息（模拟数据） */
  private _getDiskInfo() {
    return {
      drives: [
        { name: '/', totalGB: 500, usedGB: 280, freeGB: 220, usagePercent: 56.0, filesystem: 'ext4' },
        { name: '/data', totalGB: 1000, usedGB: 650, freeGB: 350, usagePercent: 65.0, filesystem: 'ext4' },
        { name: '/var/log', totalGB: 200, usedGB: 45, freeGB: 155, usagePercent: 22.5, filesystem: 'ext4' },
      ],
    };
  }

  /** 获取 Node.js/V8 运行时信息 */
  private _getJvmInfo() {
    const mem = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();
    const spaceStats = v8.getHeapSpaceStatistics();

    return {
      runtimeName: 'Node.js',
      runtimeVersion: process.version,
      v8Version: process.versions.v8,
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      heapTotal: mem.heapTotal,
      heapTotalMB: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
      heapUsed: mem.heapUsed,
      heapUsedMB: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      heapLimit: heapStats.heap_size_limit,
      heapLimitMB: Number((heapStats.heap_size_limit / 1024 / 1024).toFixed(2)),
      external: mem.external,
      externalMB: Number((mem.external / 1024 / 1024).toFixed(2)),
      rss: mem.rss,
      rssMB: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapUsagePercent: Number(((mem.heapUsed / heapStats.heap_size_limit) * 100).toFixed(2)),
      garbageCollection: {
        totalHeapSize: heapStats.total_heap_size,
        totalAvailableSize: heapStats.total_available_size,
        usedHeapSize: heapStats.used_heap_size,
      },
      heapSpaces: spaceStats.map(s => ({
        spaceName: s.space_name,
        sizeMB: Number((s.space_size / 1024 / 1024).toFixed(2)),
        usedMB: Number((s.space_used_size / 1024 / 1024).toFixed(2)),
        availableMB: Number((s.space_available_size / 1024 / 1024).toFixed(2)),
      })),
      startArgs: process.argv,
      pid: process.pid,
    };
  }

  /** 获取系统信息 */
  private _getSystemInfo() {
    const ifaces = os.networkInterfaces();
    const ipList: string[] = [];
    for (const name of Object.keys(ifaces)) {
      const iface = ifaces[name];
      if (!iface) continue;
      for (const addr of iface) {
        if (addr.family === 'IPv4' && !addr.internal) {
          ipList.push(addr.address);
        }
      }
    }

    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      osRelease: os.release(),
      osType: os.type(),
      kernelVersion: os.version ? os.version() : os.release(),
      nodeVersion: process.version,
      uptimeSeconds: os.uptime(),
      userCount: 1,
      ipAddresses: ipList.length > 0 ? ipList : ['127.0.0.1'],
      homeDir: os.homedir(),
      tempDir: os.tmpdir(),
    };
  }
}

export const serverController = new ServerController();
