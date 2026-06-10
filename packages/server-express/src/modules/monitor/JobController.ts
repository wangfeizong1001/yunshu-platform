/**
 * 定时任务控制器
 *
 * 提供定时任务的完整 CRUD 接口，以及任务执行、状态切换、任务日志管理等功能。
 *
 * @module @yunshu/server-express/modules/monitor
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 定时任务 */
interface SysJob {
  jobId: number;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  cronExpression: string;
  misfirePolicy: '0' | '1' | '2';
  concurrent: '0' | '1';
  status: '0' | '1';
  remark: string;
  createdAt: string;
  updatedAt: string;
}

/** 任务日志 */
interface SysJobLog {
  jobLogId: number;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  jobMessage: string;
  status: '0' | '1';
  exceptionInfo: string;
  createdAt: string;
}

// ============================================================================
// Mock 数据
// ============================================================================

let jobIdSeed = 3;
let jobLogIdSeed = 5;

const jobs: SysJob[] = [
  {
    jobId: 1,
    jobName: '系统默认（无参）',
    jobGroup: 'SYSTEM',
    invokeTarget: 'ryTask.ryNoParams',
    cronExpression: '0/10 * * * * ?',
    misfirePolicy: '1',
    concurrent: '0',
    status: '0',
    remark: '',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    jobId: 2,
    jobName: '系统默认（有参）',
    jobGroup: 'SYSTEM',
    invokeTarget: 'ryTask.ryParams("ry")',
    cronExpression: '0/15 * * * * ?',
    misfirePolicy: '1',
    concurrent: '0',
    status: '0',
    remark: '',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    jobId: 3,
    jobName: '数据清理任务',
    jobGroup: 'DEFAULT',
    invokeTarget: 'cleanTask.cleanExpiredData()',
    cronExpression: '0 0 2 * * ?',
    misfirePolicy: '2',
    concurrent: '1',
    status: '1',
    remark: '每日凌晨 2 点执行',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
];

const jobLogs: SysJobLog[] = [
  { jobLogId: 1, jobName: '系统默认（无参）', jobGroup: 'SYSTEM', invokeTarget: 'ryTask.ryNoParams', jobMessage: '任务执行成功', status: '0', exceptionInfo: '', createdAt: '2024-01-15 10:00:00' },
  { jobLogId: 2, jobName: '系统默认（有参）', jobGroup: 'SYSTEM', invokeTarget: 'ryTask.ryParams("ry")', jobMessage: '任务执行成功', status: '0', exceptionInfo: '', createdAt: '2024-01-15 10:15:00' },
  { jobLogId: 3, jobName: '数据清理任务', jobGroup: 'DEFAULT', invokeTarget: 'cleanTask.cleanExpiredData()', jobMessage: '任务执行失败', status: '1', exceptionInfo: 'Error: connection timeout', createdAt: '2024-01-15 02:00:00' },
  { jobLogId: 4, jobName: '系统默认（无参）', jobGroup: 'SYSTEM', invokeTarget: 'ryTask.ryNoParams', jobMessage: '任务执行成功', status: '0', exceptionInfo: '', createdAt: '2024-01-15 10:30:00' },
  { jobLogId: 5, jobName: '系统默认（有参）', jobGroup: 'SYSTEM', invokeTarget: 'ryTask.ryParams("ry")', jobMessage: '任务执行成功', status: '0', exceptionInfo: '', createdAt: '2024-01-15 10:45:00' },
];

// ============================================================================
// JobController
// ============================================================================

/**
 * 定时任务控制器
 */
export class JobController extends BaseController {
  /**
   * 定时任务分页查询
   */
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { jobName, jobGroup, status } = req.query;

      let filtered = [...jobs];
      if (jobName) filtered = filtered.filter(i => i.jobName.includes(String(jobName)));
      if (jobGroup) filtered = filtered.filter(i => i.jobGroup === jobGroup);
      if (status) filtered = filtered.filter(i => i.status === status);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 定时任务详情
   */
  async getDetail(req: Request, res: Response) {
    try {
      const jobId = Number(req.params.jobId);
      const item = jobs.find(i => i.jobId === jobId);
      if (!item) return this.notFound(res, '任务不存在');
      return this.success(res, item, '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 创建定时任务
   */
  async create(req: Request, res: Response) {
    try {
      const {
        jobName,
        jobGroup = 'DEFAULT',
        invokeTarget,
        cronExpression,
        misfirePolicy = '1',
        concurrent = '1',
        status = '0',
        remark = '',
      } = req.body;

      if (!jobName || !invokeTarget || !cronExpression) {
        return this.badRequest(res, '任务名称、调用目标和 cron 表达式不能为空');
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const item: SysJob = {
        jobId: ++jobIdSeed,
        jobName,
        jobGroup,
        invokeTarget,
        cronExpression,
        misfirePolicy,
        concurrent,
        status,
        remark,
        createdAt: now,
        updatedAt: now,
      };
      jobs.push(item);
      return this.success(res, item, '创建成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 更新定时任务
   */
  async update(req: Request, res: Response) {
    try {
      const jobId = Number(req.params.jobId);
      const idx = jobs.findIndex(i => i.jobId === jobId);
      if (idx === -1) return this.notFound(res, '任务不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      jobs[idx] = { ...jobs[idx], ...req.body, jobId, updatedAt: now };
      return this.success(res, jobs[idx], '更新成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除定时任务
   */
  async remove(req: Request, res: Response) {
    try {
      const jobId = Number(req.params.jobId);
      const idx = jobs.findIndex(i => i.jobId === jobId);
      if (idx === -1) return this.notFound(res, '任务不存在');
      const removed = jobs.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 立即执行一次任务
   *
   * @param req - body: { jobId: number }
   */
  async run(req: Request, res: Response) {
    try {
      const { jobId } = req.body;
      const job = jobs.find(i => i.jobId === Number(jobId));
      if (!job) return this.notFound(res, '任务不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const log: SysJobLog = {
        jobLogId: ++jobLogIdSeed,
        jobName: job.jobName,
        jobGroup: job.jobGroup,
        invokeTarget: job.invokeTarget,
        jobMessage: '任务手动执行成功',
        status: '0',
        exceptionInfo: '',
        createdAt: now,
      };
      jobLogs.push(log);

      return this.success(res, { jobId: job.jobId, executedAt: now }, '任务执行成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 切换任务状态
   *
   * @param req - body: { jobId, status }
   */
  async changeStatus(req: Request, res: Response) {
    try {
      const { jobId, status } = req.body;
      const idx = jobs.findIndex(i => i.jobId === Number(jobId));
      if (idx === -1) return this.notFound(res, '任务不存在');

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const job = jobs[idx];
      if (!job) return this.notFound(res, '任务不存在');
      job.status = status;
      job.updatedAt = now;

      return this.success(res, job, '状态切换成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 任务日志分页查询
   */
  async getLogList(req: Request, res: Response) {
    try {
      const { page, limit } = normalizePagination(req.query);
      const { jobName, jobGroup, status } = req.query;

      let filtered = [...jobLogs];
      if (jobName) filtered = filtered.filter(i => i.jobName.includes(String(jobName)));
      if (jobGroup) filtered = filtered.filter(i => i.jobGroup === jobGroup);
      if (status) filtered = filtered.filter(i => i.status === status);

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 删除任务日志
   */
  async deleteLog(req: Request, res: Response) {
    try {
      const jobLogId = Number(req.params.jobLogId);
      const idx = jobLogs.findIndex(i => i.jobLogId === jobLogId);
      if (idx === -1) return this.notFound(res, '任务日志不存在');
      const removed = jobLogs.splice(idx, 1)[0];
      return this.success(res, removed, '删除成功');
    } catch (e) {
      return this.error(res, e as Error);
    }
  }

  /**
   * 清空任务日志
   */
  async cleanLog(req: Request, res: Response) {
    try {
      const count = jobLogs.length;
      jobLogs.length = 0;
      return this.success(res, { cleaned: count }, `日志清空成功，共清除 ${count} 条`);
    } catch (e) {
      return this.error(res, e as Error);
    }
  }
}

export const jobController = new JobController();
