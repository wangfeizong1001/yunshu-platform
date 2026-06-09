/**
 * 服务器监控控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

export class ServerController extends BaseController {
  /**
   * 获取服务器信息
   */
  async getServerInfo(_req: Request, res: Response): Promise<Response> {
    return this.success(res, {
      computerName: 'YUNSHU-SERVER',
      computerIp: '192.168.1.100',
      userDir: '/root',
      osName: 'Linux',
      osArch: 'amd64',
    });
  }

  /**
   * 获取CPU信息
   */
  async getCpuInfo(_req: Request, res: Response): Promise<Response> {
    return this.success(res, {
      cpuNum: 4,
      used: 25.5,
      sys: 10.2,
      free: 64.3,
    });
  }

  /**
   * 获取内存信息
   */
  async getMemoryInfo(_req: Request, res: Response): Promise<Response> {
    return this.success(res, {
      total: 16384,
      used: 8192,
      free: 8192,
      usage: 50.0,
    });
  }

  /**
   * 获取磁盘信息
   */
  async getDiskInfo(_req: Request, res: Response): Promise<Response> {
    return this.success(res, [{
      dirName: '/',
      sysTypeName: 'ext4',
      typeName: '本地固定磁盘',
      total: '512.0 GB',
      free: '256.0 GB',
      used: '256.0 GB',
      usage: 50.0,
    }]);
  }

  /**
   * 获取JVM信息
   */
  async getJvmInfo(_req: Request, res: Response): Promise<Response> {
    return this.success(res, {
      total: 2048,
      max: 2048,
      free: 1024,
      version: '17.0.1',
      home: '/usr/lib/jvm/java-17-openjdk-amd64',
      startTime: '2024-06-01 10:00:00',
      runTime: '1h 30m',
      usage: 50.0,
      inputArgs: '-Xms512m -Xmx2048m',
    });
  }
}

export const serverController = new ServerController();
