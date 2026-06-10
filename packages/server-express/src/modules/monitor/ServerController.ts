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

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;

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
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const info = {
      cpu: this._getCpuInfo(),
      memory: this._getMemoryInfo(),
      disk: this._getDiskInfo(),
      jvm: this._getJvmInfo(),
      system: this._getSystemInfo(),
    };
    return this.success(res, info, '查询成功');
  }

  /**
   * 获取 CPU 信息
   */
  async getCpuInfo(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');
    return this.success(res, this._getCpuInfo(), '查询成功');
  }

  /**
   * 获取内存信息
   */
  async getMemoryInfo(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');
    return this.success(res, this._getMemoryInfo(), '查询成功');
  }

  /**
   * 获取磁盘信息
   *
   * @remarks
   * 由于 Node.js 标准库不直接提供磁盘使用率，此处提供模拟数据。
   * 生产环境可使用 systeminformation、node-diskusage 等第三方库。
   */
  async getDiskInfo(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');
    return this.success(res, this._getDiskInfo(), '查询成功');
  }

  /**
   * 获取 Node.js/V8 运行时信息（代替传统 JVM 信息）
   */
  async getJvmInfo(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');
    return this.success(res, this._getJvmInfo(), '查询成功');
  }

  // ========================================================================
  // 私有方法：信息收集
  // ========================================================================

  /** 获取 CPU 信息 */
  private _getCpuInfo() {
    const cpus = os.cpus();
    const coreCount = cpus.length || 0;
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
    const safeTotal = total === 0 ? 1 : total;
    const usage = ((safeTotal - idle) / safeTotal) * 100;

    const firstCpu = cpus[0];
    const load = os.loadavg();
    return {
      coreCount,
      model: (firstCpu?.model || 'unknown').slice(0, MAX_FIELD_LENGTH),
      speedMHz: firstCpu && Number.isFinite(firstCpu.speed) ? firstCpu.speed : 0,
      loadAvg: [
        Number.isFinite(load[0] ?? Number.NaN) ? Number((load[0] ?? 0).toFixed(2)) : 0,
        Number.isFinite(load[1] ?? Number.NaN) ? Number((load[1] ?? 0).toFixed(2)) : 0,
        Number.isFinite(load[2] ?? Number.NaN) ? Number((load[2] ?? 0).toFixed(2)) : 0,
      ],
      usagePercent: Number(usage.toFixed(2)),
      userPercent: Number(((user / safeTotal) * 100).toFixed(2)),
      systemPercent: Number(((sys / safeTotal) * 100).toFixed(2)),
      idlePercent: Number(((idle / safeTotal) * 100).toFixed(2)),
    };
  }

  /** 获取内存信息 */
  private _getMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const safeTotal = total === 0 ? 1 : total;

    return {
      total: Number.isFinite(total) ? total : 0,
      totalGB: Number((total / 1024 / 1024 / 1024).toFixed(2)),
      used: Number.isFinite(used) ? used : 0,
      usedGB: Number((used / 1024 / 1024 / 1024).toFixed(2)),
      free: Number.isFinite(free) ? free : 0,
      freeGB: Number((free / 1024 / 1024 / 1024).toFixed(2)),
      usagePercent: Number(((used / safeTotal) * 100).toFixed(2)),
      freePercent: Number(((free / safeTotal) * 100).toFixed(2)),
    };
  }

  /** 获取磁盘信息（模拟数据，路径脱敏到最后一段目录名） */
  private _getDiskInfo() {
    const sanitize = (p: string) => {
      const parts = p.split('/').filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : 'root';
    };
    return {
      drives: [
        { name: sanitize('/'), totalGB: 500, usedGB: 280, freeGB: 220, usagePercent: 56.0 },
        { name: sanitize('/data'), totalGB: 1000, usedGB: 650, freeGB: 350, usagePercent: 65.0 },
        { name: sanitize('/var/log'), totalGB: 200, usedGB: 45, freeGB: 155, usagePercent: 22.5 },
      ],
    };
  }

  /** 获取 Node.js/V8 运行时信息 */
  private _getJvmInfo() {
    const mem = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();
    const spaceStats = v8.getHeapSpaceStatistics();

    const heapLimit = heapStats.heap_size_limit || 1;
    const uptime = process.uptime();

    return {
      runtimeName: 'Node.js',
      runtimeVersion: String(process.version).slice(0, 32),
      v8Version: String(process.versions.v8).slice(0, 32),
      uptimeSeconds: Number.isFinite(uptime) ? Number(uptime.toFixed(2)) : 0,
      heapTotal: Number.isFinite(mem.heapTotal) ? mem.heapTotal : 0,
      heapTotalMB: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
      heapUsed: Number.isFinite(mem.heapUsed) ? mem.heapUsed : 0,
      heapUsedMB: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      heapLimit: heapStats.heap_size_limit || 0,
      heapLimitMB: Number((heapStats.heap_size_limit / 1024 / 1024).toFixed(2)),
      external: Number.isFinite(mem.external) ? mem.external : 0,
      externalMB: Number((mem.external / 1024 / 1024).toFixed(2)),
      rss: Number.isFinite(mem.rss) ? mem.rss : 0,
      rssMB: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapUsagePercent: Number(((mem.heapUsed / heapLimit) * 100).toFixed(2)),
      garbageCollection: {
        totalHeapSize: Number.isFinite(heapStats.total_heap_size) ? heapStats.total_heap_size : 0,
        totalAvailableSize: Number.isFinite(heapStats.total_available_size)
          ? heapStats.total_available_size
          : 0,
        usedHeapSize: Number.isFinite(heapStats.used_heap_size) ? heapStats.used_heap_size : 0,
      },
      heapSpaces: spaceStats.slice(0, 20).map((s) => ({
        spaceName: String(s.space_name).slice(0, 64),
        sizeMB: Number((s.space_size / 1024 / 1024).toFixed(2)),
        usedMB: Number((s.space_used_size / 1024 / 1024).toFixed(2)),
        availableMB: Number((s.space_available_size / 1024 / 1024).toFixed(2)),
      })),
      pid: process.pid,
    };
  }

  /** 获取系统信息（路径信息脱敏） */
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

    const hostname = os.hostname();
    return {
      hostname: String(hostname).slice(0, 128),
      platform: String(os.platform()).slice(0, 32),
      arch: String(os.arch()).slice(0, 32),
      osRelease: String(os.release()).slice(0, 64),
      osType: String(os.type()).slice(0, 32),
      kernelVersion: os.version
        ? String(os.version()).slice(0, 128)
        : String(os.release()).slice(0, 128),
      nodeVersion: String(process.version).slice(0, 32),
      uptimeSeconds: Number.isFinite(os.uptime()) ? os.uptime() : 0,
      ipAddresses: ipList.slice(0, 20),
    };
  }
}

export const serverController = new ServerController();
