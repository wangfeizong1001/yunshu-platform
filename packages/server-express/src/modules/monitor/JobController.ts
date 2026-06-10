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

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;
const MAX_INVOKE_TARGET_LENGTH = 500;
const MAX_CRON_LENGTH = 100;

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
// 校验工具
// ============================================================================

const DANGEROUS_PATTERNS = [
  /[;|`]/,
  /&&/,
  /\$\(/,
  /</,
  />/,
  /rm\s+-/,
  /sudo\s/,
  /wget\s+/,
  /curl\s+/,
];

function isValidJobName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length >= 1 && name.length <= 100;
}

function isValidJobGroup(group: unknown): group is string {
  return typeof group === 'string' && group.trim().length >= 1 && group.length <= 100;
}

function isValidInvokeTarget(target: unknown): target is string {
  if (typeof target !== 'string') return false;
  if (target.length === 0 || target.length > MAX_INVOKE_TARGET_LENGTH) return false;
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(target)) return false;
  }
  return true;
}

function isValidCronExpression(cron: unknown): cron is string {
  if (typeof cron !== 'string') return false;
  const trimmed = cron.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_CRON_LENGTH) return false;
  const tokens = trimmed.split(/\s+/);
  // 简单检查：5 到 7 个空格分隔的 token
  return tokens.length >= 5 && tokens.length <= 7;
}

function isValidBinaryStatus(s: unknown): s is '0' | '1' {
  return s === '0' || s === '1';
}

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
    const { page, limit } = normalizePagination(req.query);
    const jobNameParam = this.safeParam(req.query.jobName, MAX_QUERY_PARAM_LENGTH);
    const jobGroupParam = this.safeParam(req.query.jobGroup, MAX_QUERY_PARAM_LENGTH);
    const statusParam = this.safeParam(req.query.status, 1);

    let filtered = [...jobs];
    if (jobNameParam) filtered = filtered.filter(i => i.jobName.includes(jobNameParam));
    if (jobGroupParam) filtered = filtered.filter(i => i.jobGroup === jobGroupParam);
    if (statusParam) filtered = filtered.filter(i => i.status === statusParam);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  /**
   * 定时任务详情
   */
  async getDetail(req: Request, res: Response) {
    const jobId = Number(req.params.jobId);
    if (!Number.isFinite(jobId)) return this.badRequest(res, 'jobId 参数非法');
    const item = jobs.find(i => i.jobId === jobId);
    if (!item) return this.notFound(res, '任务不存在');
    return this.success(res, item, '查询成功');
  }

  /**
   * 创建定时任务
   */
  async create(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as Partial<SysJob>;
    if (!isValidJobName(body.jobName)) return this.badRequest(res, 'jobName 长度 1-100');
    if (!isValidJobGroup(body.jobGroup)) return this.badRequest(res, 'jobGroup 长度 1-100');
    if (!isValidInvokeTarget(body.invokeTarget)) return this.badRequest(res, 'invokeTarget 非法（长度或内容违规）');
    if (!isValidCronExpression(body.cronExpression)) return this.badRequest(res, 'cronExpression 格式错误');

    const misfirePolicy = body.misfirePolicy ?? '1';
    if (misfirePolicy !== '0' && misfirePolicy !== '1' && misfirePolicy !== '2') {
      return this.badRequest(res, 'misfirePolicy 必须是 0/1/2');
    }
    const concurrent = body.concurrent ?? '1';
    if (!isValidBinaryStatus(concurrent)) return this.badRequest(res, 'concurrent 必须是 0 或 1');
    const status = body.status ?? '0';
    if (!isValidBinaryStatus(status)) return this.badRequest(res, 'status 必须是 0 或 1');

    const remark = typeof body.remark === 'string' ? body.remark.slice(0, MAX_FIELD_LENGTH) : '';

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const item: SysJob = {
      jobId: ++jobIdSeed,
      jobName: body.jobName,
      jobGroup: body.jobGroup,
      invokeTarget: body.invokeTarget,
      cronExpression: body.cronExpression,
      misfirePolicy,
      concurrent,
      status,
      remark,
      createdAt: now,
      updatedAt: now,
    };
    jobs.push(item);
    return this.success(res, item, '创建成功');
  }

  /**
   * 更新定时任务
   */
  async update(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const jobId = Number(req.params.jobId);
    if (!Number.isFinite(jobId)) return this.badRequest(res, 'jobId 参数非法');

    const exist = jobs.find(i => i.jobId === jobId);
    if (!exist) return this.notFound(res, '任务不存在');
    const idx = jobs.indexOf(exist);

    const body = req.body as Partial<SysJob>;

    if (body.jobName !== undefined && !isValidJobName(body.jobName)) {
      return this.badRequest(res, 'jobName 长度 1-100');
    }
    if (body.jobGroup !== undefined && !isValidJobGroup(body.jobGroup)) {
      return this.badRequest(res, 'jobGroup 长度 1-100');
    }
    if (body.invokeTarget !== undefined && !isValidInvokeTarget(body.invokeTarget)) {
      return this.badRequest(res, 'invokeTarget 非法（长度或内容违规）');
    }
    if (body.cronExpression !== undefined && !isValidCronExpression(body.cronExpression)) {
      return this.badRequest(res, 'cronExpression 格式错误');
    }
    if (body.misfirePolicy !== undefined
      && body.misfirePolicy !== '0' && body.misfirePolicy !== '1' && body.misfirePolicy !== '2') {
      return this.badRequest(res, 'misfirePolicy 必须是 0/1/2');
    }
    if (body.concurrent !== undefined && !isValidBinaryStatus(body.concurrent)) {
      return this.badRequest(res, 'concurrent 必须是 0 或 1');
    }
    if (body.status !== undefined && !isValidBinaryStatus(body.status)) {
      return this.badRequest(res, 'status 必须是 0 或 1');
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    jobs[idx] = {
      jobId,
      jobName: body.jobName ?? exist.jobName,
      jobGroup: body.jobGroup ?? exist.jobGroup,
      invokeTarget: body.invokeTarget ?? exist.invokeTarget,
      cronExpression: body.cronExpression ?? exist.cronExpression,
      misfirePolicy: body.misfirePolicy ?? exist.misfirePolicy,
      concurrent: body.concurrent ?? exist.concurrent,
      status: body.status ?? exist.status,
      remark: typeof body.remark === 'string' ? body.remark.slice(0, MAX_FIELD_LENGTH) : exist.remark,
      createdAt: exist.createdAt,
      updatedAt: now,
    };
    return this.success(res, jobs[idx], '更新成功');
  }

  /**
   * 删除定时任务
   */
  async remove(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const jobId = Number(req.params.jobId);
    if (!Number.isFinite(jobId)) return this.badRequest(res, 'jobId 参数非法');

    const idx = jobs.findIndex(i => i.jobId === jobId);
    if (idx === -1) return this.notFound(res, '任务不存在');
    const removed = jobs.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }

  /**
   * 立即执行一次任务
   */
  async run(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as { jobId?: unknown };
    const jobId = Number(body.jobId);
    if (!Number.isFinite(jobId)) return this.badRequest(res, 'jobId 参数非法');

    const job = jobs.find(i => i.jobId === jobId);
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
  }

  /**
   * 切换任务状态
   */
  async changeStatus(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as { jobId?: unknown; status?: unknown };
    const jobId = Number(body.jobId);
    if (!Number.isFinite(jobId)) return this.badRequest(res, 'jobId 参数非法');

    const job = jobs.find(i => i.jobId === jobId);
    if (!job) return this.notFound(res, '任务不存在');

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newStatus = body.status;
    if (!isValidBinaryStatus(newStatus)) {
      return this.badRequest(res, 'status 必须是 0 或 1');
    }
    job.status = newStatus;
    job.updatedAt = now;

    return this.success(res, job, '状态切换成功');
  }

  /**
   * 任务日志分页查询
   */
  async getLogList(req: Request, res: Response) {
    const { page, limit } = normalizePagination(req.query);
    const jobNameParam = this.safeParam(req.query.jobName, MAX_QUERY_PARAM_LENGTH);
    const jobGroupParam = this.safeParam(req.query.jobGroup, MAX_QUERY_PARAM_LENGTH);
    const statusParam = this.safeParam(req.query.status, 1);

    let filtered = [...jobLogs];
    if (jobNameParam) filtered = filtered.filter(i => i.jobName.includes(jobNameParam));
    if (jobGroupParam) filtered = filtered.filter(i => i.jobGroup === jobGroupParam);
    if (statusParam) filtered = filtered.filter(i => i.status === statusParam);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return this.paginate(res, createPaginatedResult(data, page, limit, total), '查询成功');
  }

  /**
   * 删除任务日志
   */
  async deleteLog(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const jobLogId = Number(req.params.jobLogId);
    if (!Number.isFinite(jobLogId)) return this.badRequest(res, 'jobLogId 参数非法');

    const idx = jobLogs.findIndex(i => i.jobLogId === jobLogId);
    if (idx === -1) return this.notFound(res, '任务日志不存在');
    const removed = jobLogs.splice(idx, 1)[0];
    return this.success(res, removed, '删除成功');
  }

  /**
   * 清空任务日志
   */
  async cleanLog(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const count = jobLogs.length;
    jobLogs.length = 0;
    return this.success(res, { cleaned: count }, `日志清空成功，共清除 ${count} 条`);
  }
}

export const jobController = new JobController();
