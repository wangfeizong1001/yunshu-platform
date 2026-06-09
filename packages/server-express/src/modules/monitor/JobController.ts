/**
 * 定时任务控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import type { IJobQuery, IJobLogQuery, IJobCreate, IJobUpdate, IJobExecute } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';
import { jobService } from '@yunshu/server-core/modules/monitor';

export class JobController extends BaseController {
  /**
   * 获取定时任务分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: IJobQuery = {
      search: req.query.search as string,
      jobName: req.query.jobName as string,
      jobGroup: req.query.jobGroup as IJobQuery['jobGroup'],
      status: req.query.status as IJobQuery['status'],
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
    };

    const result = await jobService.findWithPagination(params);
    return this.handleResult(res, result);
  }

  /**
   * 获取定时任务详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await jobService.findById(id);
    return this.handleResult(res, result);
  }

  /**
   * 创建定时任务
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: IJobCreate = req.body;
    if (!data.jobName || !data.invokeTarget || !data.cronExpression) {
      return this.badRequest(res, '请填写完整的任务信息');
    }
    const result = await jobService.create(data);
    return this.handleResult(res, result, 201);
  }

  /**
   * 更新定时任务
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: IJobUpdate = { ...req.body, jobId: id };
    const result = await jobService.update(id, data);
    return this.handleResult(res, result);
  }

  /**
   * 删除定时任务
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await jobService.delete(id);
    return this.handleResult(res, result);
  }

  /**
   * 执行定时任务
   */
  async execute(req: Request, res: Response): Promise<Response> {
    const data: IJobExecute = req.body;
    if (!data.jobId) {
      return this.badRequest(res, '请提供任务ID');
    }
    const result = await jobService.execute(data);
    return this.handleResult(res, result);
  }

  /**
   * 更改任务状态
   */
  async changeStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body as { id: string; status: '0' | '1' };
    if (!id || status === undefined) {
      return this.badRequest(res, '请提供任务ID和状态');
    }
    const result = await jobService.changeStatus(id, status);
    return this.handleResult(res, result);
  }

  /**
   * 获取任务执行日志
   */
  async listLogs(req: Request, res: Response): Promise<Response> {
    const params: IJobLogQuery = {
      search: req.query.search as string,
      jobId: req.query.jobId as string,
      jobName: req.query.jobName as string,
      status: req.query.status as IJobLogQuery['status'],
      beginTime: req.query.beginTime as string,
      endTime: req.query.endTime as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
    };

    const result = await jobService.findLogsWithPagination(params);
    return this.handleResult(res, result);
  }

  /**
   * 清空任务日志
   */
  async cleanLogs(req: Request, res: Response): Promise<Response> {
    const result = await jobService.cleanLogs();
    return this.handleResult(res, result);
  }
}

export const jobController = new JobController();
