/**
 * 登录日志控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import type { ILogininforQuery } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';
import { logininforService } from '@yunshu/server-core/modules/monitor';

export class LogininforController extends BaseController {
  /**
   * 获取登录日志分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: ILogininforQuery = {
      search: req.query.search as string,
      userName: req.query.userName as string,
      loginAccount: req.query.loginAccount as string,
      status: req.query.status as ILogininforQuery['status'],
      operationType: req.query.operationType as ILogininforQuery['operationType'],
      beginTime: req.query.beginTime as string,
      endTime: req.query.endTime as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
    };

    const result = await logininforService.findWithPagination(params);
    return this.handleResult(res, result);
  }

  /**
   * 获取登录日志详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await logininforService.findById(id);
    return this.handleResult(res, result);
  }

  /**
   * 删除登录日志
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await logininforService.delete(id);
    return this.handleResult(res, result);
  }

  /**
   * 批量删除登录日志
   */
  async deleteBatch(req: Request, res: Response): Promise<Response> {
    const { ids } = req.body as { ids: string[] };
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return this.badRequest(res, '请选择要删除的日志');
    }
    const result = await logininforService.deleteBatch(ids);
    return this.handleResult(res, result);
  }

  /**
   * 清空登录日志
   */
  async clean(req: Request, res: Response): Promise<Response> {
    const result = await logininforService.clean();
    return this.handleResult(res, result);
  }

  /**
   * 解锁账号
   */
  async unlock(req: Request, res: Response): Promise<Response> {
    const { loginAccount } = req.body as { loginAccount: string };
    if (!loginAccount) {
      return this.badRequest(res, '请提供登录账号');
    }
    const result = await logininforService.unlock(loginAccount);
    return this.handleResult(res, result);
  }

  /**
   * 导出登录日志
   */
  async export(req: Request, res: Response): Promise<Response> {
    const params: ILogininforQuery = {
      search: req.query.search as string,
      userName: req.query.userName as string,
      status: req.query.status as ILogininforQuery['status'],
      operationType: req.query.operationType as ILogininforQuery['operationType'],
      beginTime: req.query.beginTime as string,
      endTime: req.query.endTime as string,
      page: 1,
      limit: 10000,
    };

    const result = await logininforService.findWithPagination(params);
    if (!result.success) {
      return this.handleResult(res, result);
    }

    return this.success(res, result.data?.data || [], '导出成功');
  }
}

export const logininforController = new LogininforController();
