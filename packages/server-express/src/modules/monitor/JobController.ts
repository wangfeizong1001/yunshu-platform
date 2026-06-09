/**
 * 定时任务控制器
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import type { IJobQuery, IJobLogQuery, IJobCreate, IJobUpdate, IJobExecute } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

interface Job {
  jobId: string;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  cronExpression: string;
  status: '0' | '1';
  remark?: string;
  createTime: string;
  updateTime: string;
}

interface JobLog {
  jobLogId: string;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  status: '0' | '1';
  jobMessage?: string;
  exceptionInfo?: string;
  createTime: string;
}

function createInitialJobs(): Job[] {
  return [
    {
      jobId: '1',
      jobName: '系统数据同步',
      jobGroup: 'SYSTEM',
      invokeTarget: 'systemSyncTask.execute()',
      cronExpression: '0 0 2 * * ?',
      status: '0',
      remark: '每天凌晨2点执行数据同步',
      createTime: '2024-01-15 08:00:00',
      updateTime: '2024-06-01 10:30:00',
    },
    {
      jobId: '2',
      jobName: '临时文件清理',
      jobGroup: 'SYSTEM',
      invokeTarget: 'cleanTempFileTask.execute()',
      cronExpression: '0 0 1 * * ?',
      status: '0',
      remark: '每天凌晨1点清理临时文件',
      createTime: '2024-01-15 09:00:00',
      updateTime: '2024-06-01 10:30:00',
    },
    {
      jobId: '3',
      jobName: '用户信息同步',
      jobGroup: 'DEFAULT',
      invokeTarget: 'userSyncTask.execute()',
      cronExpression: '0 */30 * * * ?',
      status: '1',
      remark: '每30分钟同步一次用户信息',
      createTime: '2024-03-10 14:00:00',
      updateTime: '2024-06-01 10:30:00',
    },
  ];
}

function createInitialJobLogs(): JobLog[] {
  return [
  {
    jobLogId: '1',
    jobName: '系统数据同步',
    jobGroup: 'SYSTEM',
    invokeTarget: 'systemSyncTask.execute()',
    status: '0',
    jobMessage: '任务执行成功',
    createTime: '2024-06-10 02:00:00',
  },
  {
    jobLogId: '2',
    jobName: '临时文件清理',
    jobGroup: 'SYSTEM',
    invokeTarget: 'cleanTempFileTask.execute()',
    status: '1',
    jobMessage: '任务执行失败',
    exceptionInfo: 'FileNotFoundException: temp directory not found',
    createTime: '2024-06-10 01:00:00',
  },
  ];
}

export class JobController extends BaseController {
  private mockJobs: Job[] = createInitialJobs();
  private mockJobLogs: JobLog[] = createInitialJobLogs();

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

    let filtered = [...this.mockJobs];

    if (params.jobName) {
      filtered = filtered.filter(j => j.jobName.includes(params.jobName as string));
    }

    if (params.jobGroup) {
      filtered = filtered.filter(j => j.jobGroup === params.jobGroup);
    }

    if (params.status) {
      filtered = filtered.filter(j => j.status === params.status);
    }

    const total = filtered.length;
    const pageNum = params.page ?? 1;
    const pageSize = params.limit ?? 10;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取定时任务详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const job = this.mockJobs.find(j => j.jobId === id);
    if (!job) {
      return this.notFound(res, '任务不存在');
    }
    return this.success(res, job);
  }

  /**
   * 创建定时任务
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: IJobCreate = req.body;
    if (!data.jobName || !data.invokeTarget || !data.cronExpression) {
      return this.badRequest(res, '请填写完整的任务信息');
    }

    const newJob: Job = {
      jobId: String(this.mockJobs.length + 1),
      jobName: data.jobName,
      jobGroup: data.jobGroup || 'DEFAULT',
      invokeTarget: data.invokeTarget,
      cronExpression: data.cronExpression,
      status: '1',
      remark: data.remark,
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    this.mockJobs.push(newJob);
    return this.created(res, newJob);
  }

  /**
   * 更新定时任务
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: IJobUpdate = { ...req.body, jobId: id };
    const index = this.mockJobs.findIndex(j => j.jobId === id);

    if (index === -1) {
      return this.notFound(res, '任务不存在');
    }

    this.mockJobs[index] = {
      ...this.mockJobs[index],
      jobName: data.jobName ?? this.mockJobs[index].jobName,
      jobGroup: data.jobGroup ?? this.mockJobs[index].jobGroup,
      invokeTarget: data.invokeTarget ?? this.mockJobs[index].invokeTarget,
      cronExpression: data.cronExpression ?? this.mockJobs[index].cronExpression,
      status: (data.status as '0' | '1') ?? this.mockJobs[index].status,
      remark: data.remark ?? this.mockJobs[index].remark,
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, this.mockJobs[index]);
  }

  /**
   * 删除定时任务
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = this.mockJobs.findIndex(j => j.jobId === id);
    if (index === -1) {
      return this.notFound(res, '任务不存在');
    }
    this.mockJobs.splice(index, 1);
    return this.success(res, null);
  }

  /**
   * 执行定时任务
   */
  async execute(req: Request, res: Response): Promise<Response> {
    const data: IJobExecute = req.body;
    if (!data.jobId) {
      return this.badRequest(res, '请提供任务ID');
    }
    const job = this.mockJobs.find(j => j.jobId === data.jobId);
    if (!job) {
      return this.notFound(res, '任务不存在');
    }
    return this.success(res, { message: '任务已触发执行' });
  }

  /**
   * 更改任务状态
   */
  async changeStatus(req: Request, res: Response): Promise<Response> {
    const { id, status } = req.body as { id: string; status: '0' | '1' };
    if (!id || status === undefined) {
      return this.badRequest(res, '请提供任务ID和状态');
    }
    const index = this.mockJobs.findIndex(j => j.jobId === id);
    if (index === -1) {
      return this.notFound(res, '任务不存在');
    }
    this.mockJobs[index].status = status;
    this.mockJobs[index].updateTime = new Date().toLocaleString('zh-CN');
    return this.success(res, this.mockJobs[index]);
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

    let filtered = [...this.mockJobLogs];

    if (params.jobName) {
      filtered = filtered.filter(l => l.jobName.includes(params.jobName as string));
    }

    if (params.status) {
      filtered = filtered.filter(l => l.status === params.status);
    }

    const total = filtered.length;
    const logPage = params.page ?? 1;
    const logSize = params.limit ?? 10;
    const logStart = (logPage - 1) * logSize;
    const logEnd = logStart + logSize;
    const rows = filtered.slice(logStart, logEnd);

    return this.success(res, { total, rows });
  }

  /**
   * 清空任务日志
   */
  async cleanLogs(_req: Request, res: Response): Promise<Response> {
    this.mockJobLogs.length = 0;
    return this.success(res, null);
  }
}

export const jobController = new JobController();
