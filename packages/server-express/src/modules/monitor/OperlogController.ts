/**
 * 操作日志控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import type { IOperlogQuery } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';
import { operlogService } from '@yunshu/server-core/modules/monitor';

export class OperlogController extends BaseController {
  /**
   * 获取操作日志分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: IOperlogQuery = {
      search: req.query.search as string,
      operName: req.query.operName as string,
      operType: req.query.operType as IOperlogQuery['operType'],
      operModule: req.query.operModule as string,
      status: req.query.status as IOperlogQuery['status'],
      beginTime: req.query.beginTime as string,
      endTime: req.query.endTime as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
    };

    const result = await operlogService.findWithPagination(params);
    return this.handleResult(res, result);
  }

  /**
   * 获取操作日志详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await operlogService.findById(id);
    return this.handleResult(res, result);
  }

  /**
   * 删除操作日志
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await operlogService.delete(id);
    return this.handleResult(res, result);
  }

  /**
   * 批量删除操作日志
   */
  async deleteBatch(req: Request, res: Response): Promise<Response> {
    const { ids } = req.body as { ids: string[] };
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return this.badRequest(res, '请选择要删除的日志');
    }
    const result = await operlogService.deleteBatch(ids);
    return this.handleResult(res, result);
  }

  /**
   * 清空操作日志
   */
  async clean(req: Request, res: Response): Promise<Response> {
    const result = await operlogService.clean();
    return this.handleResult(res, result);
  }

  /**
   * 导出操作日志
   */
  async export(req: Request, res: Response): Promise<Response> {
    const params: IOperlogQuery = {
      search: req.query.search as string,
      operName: req.query.operName as string,
      operType: req.query.operType as IOperlogQuery['operType'],
      status: req.query.status as IOperlogQuery['status'],
      beginTime: req.query.beginTime as string,
      endTime: req.query.endTime as string,
      page: 1,
      limit: 10000,
    };

    const result = await operlogService.findWithPagination(params);
    if (!result.success) {
      return this.handleResult(res, result);
    }

    return this.success(res, result.data?.data || [], '导出成功');
  }
}

export const operlogController = new OperlogController();
