/**
 * 服务器监控控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import { serverService } from '@yunshu/server-core/modules/monitor';

export class ServerController extends BaseController {
  /**
   * 获取服务器信息
   */
  async getServerInfo(req: Request, res: Response): Promise<Response> {
    const result = await serverService.getServerInfo();
    return this.handleResult(res, result);
  }

  /**
   * 获取CPU信息
   */
  async getCpuInfo(req: Request, res: Response): Promise<Response> {
    const result = await serverService.getCpuInfo();
    return this.handleResult(res, result);
  }

  /**
   * 获取内存信息
   */
  async getMemoryInfo(req: Request, res: Response): Promise<Response> {
    const result = await serverService.getMemoryInfo();
    return this.handleResult(res, result);
  }

  /**
   * 获取磁盘信息
   */
  async getDiskInfo(req: Request, res: Response): Promise<Response> {
    const result = await serverService.getDiskInfo();
    return this.handleResult(res, result);
  }

  /**
   * 获取JVM信息
   */
  async getJvmInfo(req: Request, res: Response): Promise<Response> {
    const result = await serverService.getJvmInfo();
    return this.handleResult(res, result);
  }
}

export const serverController = new ServerController();
