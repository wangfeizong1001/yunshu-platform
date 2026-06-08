/**
 * 定时任务服务
 *
 * @module @yunshu/server-core/modules/monitor
 */

import type { IJob, IJobLog, IJobQuery, IJobLogQuery, IJobCreate, IJobUpdate, IJobExecute } from '@yunshu/shared';
import type { ServiceResult, PaginatedResult } from '@yunshu/shared';
import { createSuccessResult, createErrorResult, createPaginatedResult } from '@yunshu/shared';
import { ErrorCode } from '../../errors/BusinessError';
import { BaseService } from '../../base/BaseService';

interface JobModel {
  // Mock model interface
}

const mockJobs: IJob[] = [
  {
    jobId: '1',
    jobName: '数据备份',
    jobGroup: 'system',
    invokeTarget: 'backupJob.execute',
    cronExpression: '0 0 2 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-01-15T08:00:00Z',
    nextValidTime: new Date(Date.now() + 18 * 3600000).toISOString(),
    lastRunTime: new Date(Date.now() - 18 * 3600000).toISOString(),
    runCount: 30,
    remark: '每日凌晨2点执行数据备份',
  },
  {
    jobId: '2',
    jobName: '日志清理',
    jobGroup: 'system',
    invokeTarget: 'logCleanJob.execute',
    cronExpression: '0 0 3 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-01-10T10:00:00Z',
    nextValidTime: new Date(Date.now() + 17 * 3600000).toISOString(),
    lastRunTime: new Date(Date.now() - 17 * 3600000).toISOString(),
    runCount: 45,
    remark: '每日凌晨3点清理30天前的日志',
  },
  {
    jobId: '3',
    jobName: '缓存预热',
    jobGroup: 'system',
    invokeTarget: 'cacheWarmupJob.execute',
    cronExpression: '0 0/30 * * * ?',
    misfirePolicy: '0',
    concurrent: '0',
    status: '0',
    createTime: '2024-02-01T09:00:00Z',
    nextValidTime: new Date(Date.now() + 30 * 60000).toISOString(),
    lastRunTime: new Date(Date.now() - 30 * 60000).toISOString(),
    runCount: 120,
    remark: '每30分钟预热热门数据缓存',
  },
  {
    jobId: '4',
    jobName: '报表生成',
    jobGroup: 'default',
    invokeTarget: 'reportGenerateJob.execute',
    cronExpression: '0 0 8 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '1',
    createTime: '2024-02-15T14:00:00Z',
    nextValidTime: new Date(Date.now() + 26 * 3600000).toISOString(),
    lastRunTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    runCount: 15,
    remark: '每天早上8点生成日报报表',
  },
  {
    jobId: '5',
    jobName: '订单超时处理',
    jobGroup: 'default',
    invokeTarget: 'orderTimeoutJob.execute',
    cronExpression: '0 0/5 * * * ?',
    misfirePolicy: '0',
    concurrent: '0',
    status: '0',
    createTime: '2024-03-01T11:00:00Z',
    nextValidTime: new Date(Date.now() + 5 * 60000).toISOString(),
    lastRunTime: new Date(Date.now() - 5 * 60000).toISOString(),
    runCount: 500,
    remark: '每5分钟检查并处理超时订单',
  },
  {
    jobId: '6',
    jobName: '用户活跃度统计',
    jobGroup: 'custom',
    invokeTarget: 'userActivityStatJob.execute',
    cronExpression: '0 0 0 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-03-10T16:00:00Z',
    nextValidTime: new Date(Date.now() + 24 * 3600000).toISOString(),
    lastRunTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    runCount: 20,
    remark: '每天统计用户活跃度数据',
  },
  {
    jobId: '7',
    jobName: '短信发送队列',
    jobGroup: 'default',
    invokeTarget: 'smsSendJob.execute',
    cronExpression: '0 0/1 * * * ?',
    misfirePolicy: '0',
    concurrent: '0',
    status: '0',
    createTime: '2024-03-15T08:30:00Z',
    nextValidTime: new Date(Date.now() + 1 * 60000).toISOString(),
    lastRunTime: new Date(Date.now() - 1 * 60000).toISOString(),
    runCount: 1000,
    remark: '每分钟处理待发送短信队列',
  },
  {
    jobId: '8',
    jobName: '文件清理',
    jobGroup: 'system',
    invokeTarget: 'fileCleanJob.execute',
    cronExpression: '0 0 4 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-03-20T10:00:00Z',
    nextValidTime: new Date(Date.now() + 16 * 3600000).toISOString(),
    lastRunTime: new Date(Date.now() - 16 * 3600000).toISOString(),
    runCount: 10,
    remark: '每天凌晨4点清理临时文件',
  },
];

const mockJobLogs: IJobLog[] = [];

for (let i = 1; i <= 100; i++) {
  const job = mockJobs[i % mockJobs.length];
  const status = i % 10 === 0 ? '1' : '0';
  mockJobLogs.push({
    logId: String(i),
    jobId: job.jobId,
    jobName: job.jobName,
    jobGroup: job.jobGroup,
    invokeTarget: job.invokeTarget,
    status,
    executeTime: new Date(Date.now() - i * 3600000).toISOString(),
    costTime: Math.floor(Math.random() * 5000) + 100,
    message: status === '0' ? '任务执行成功' : '任务执行失败',
    error: status === '0' ? undefined : 'Connection timeout',
    createTime: new Date(Date.now() - i * 3600000).toISOString(),
  });
}

export class JobService extends BaseService<JobModel, IJob, IJobCreate, IJobUpdate> {
  constructor() {
    super({} as JobModel, { entityName: '定时任务', softDelete: false });
  }

  async findById(id: string): Promise<ServiceResult<IJob>> {
    const item = mockJobs.find((job) => job.jobId === id);
    if (!item) {
      return createErrorResult(ErrorCode.NOT_FOUND, '定时任务不存在');
    }
    return createSuccessResult(item);
  }

  async findWithPagination(
    params: IJobQuery,
  ): Promise<ServiceResult<PaginatedResult<IJob>>> {
    let filtered = [...mockJobs];

    // 关键词搜索
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jobName.toLowerCase().includes(search) ||
          job.invokeTarget.toLowerCase().includes(search),
      );
    }

    // 筛选任务名称
    if (params.jobName) {
      filtered = filtered.filter((job) => job.jobName === params.jobName);
    }

    // 筛选任务分组
    if (params.jobGroup) {
      filtered = filtered.filter((job) => job.jobGroup === params.jobGroup);
    }

    // 筛选状态
    if (params.status) {
      filtered = filtered.filter((job) => job.status === params.status);
    }

    // 排序
    const sortField = params.sort || 'createTime';
    const sortOrder = params.order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField];
      const bVal = (b as Record<string, unknown>)[sortField];
      if (aVal < bVal) return -sortOrder;
      if (aVal > bVal) return sortOrder;
      return 0;
    });

    // 分页
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return createSuccessResult(createPaginatedResult(data, page, limit, total));
  }

  async create(data: IJobCreate): Promise<ServiceResult<IJob>> {
    const newJob: IJob = {
      jobId: String(mockJobs.length + 1),
      ...data,
      status: '0',
      createTime: new Date().toISOString(),
      runCount: 0,
    };
    mockJobs.push(newJob);
    return createSuccessResult(newJob, '定时任务创建成功');
  }

  async update(id: string, data: IJobUpdate): Promise<ServiceResult<IJob>> {
    const index = mockJobs.findIndex((job) => job.jobId === id);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '定时任务不存在');
    }
    const updated = { ...mockJobs[index], ...data };
    mockJobs[index] = updated;
    return createSuccessResult(updated, '定时任务更新成功');
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    const index = mockJobs.findIndex((job) => job.jobId === id);
    if (index === -1) {
      return createErrorResult(ErrorCode.NOT_FOUND, '定时任务不存在');
    }
    mockJobs.splice(index, 1);
    return createSuccessResult(true, '定时任务删除成功');
  }

  async execute(data: IJobExecute): Promise<ServiceResult<{ logId: string }>> {
    const job = mockJobs.find((j) => j.jobId === data.jobId);
    if (!job) {
      return createErrorResult(ErrorCode.NOT_FOUND, '定时任务不存在');
    }

    const log: IJobLog = {
      logId: String(mockJobLogs.length + 1),
      jobId: job.jobId,
      jobName: job.jobName,
      jobGroup: job.jobGroup,
      invokeTarget: job.invokeTarget,
      status: Math.random() > 0.1 ? '0' : '1',
      executeTime: new Date().toISOString(),
      costTime: Math.floor(Math.random() * 3000) + 100,
      message: '任务执行成功',
      createTime: new Date().toISOString(),
    };

    mockJobLogs.unshift(log);
    job.runCount = (job.runCount || 0) + 1;
    job.lastRunTime = log.executeTime;

    return createSuccessResult({ logId: log.logId }, '任务执行成功');
  }

  async changeStatus(id: string, status: IJob['status']): Promise<ServiceResult<IJob>> {
    const job = mockJobs.find((j) => j.jobId === id);
    if (!job) {
      return createErrorResult(ErrorCode.NOT_FOUND, '定时任务不存在');
    }
    job.status = status;
    return createSuccessResult(job, status === '0' ? '任务已启用' : '任务已暂停');
  }

  async findLogsWithPagination(
    params: IJobLogQuery,
  ): Promise<ServiceResult<PaginatedResult<IJobLog>>> {
    let filtered = [...mockJobLogs];

    // 关键词搜索
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.jobName.toLowerCase().includes(search) ||
          log.invokeTarget.toLowerCase().includes(search),
      );
    }

    // 筛选任务ID
    if (params.jobId) {
      filtered = filtered.filter((log) => log.jobId === params.jobId);
    }

    // 筛选任务名称
    if (params.jobName) {
      filtered = filtered.filter((log) => log.jobName === params.jobName);
    }

    // 筛选执行状态
    if (params.status) {
      filtered = filtered.filter((log) => log.status === params.status);
    }

    // 时间范围
    if (params.beginTime) {
      filtered = filtered.filter((log) => log.executeTime >= params.beginTime!);
    }
    if (params.endTime) {
      filtered = filtered.filter((log) => log.executeTime <= params.endTime!);
    }

    // 排序
    const sortField = params.sort || 'executeTime';
    const sortOrder = params.order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField];
      const bVal = (b as Record<string, unknown>)[sortField];
      if (aVal < bVal) return -sortOrder;
      if (aVal > bVal) return sortOrder;
      return 0;
    });

    // 分页
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return createSuccessResult(createPaginatedResult(data, page, limit, total));
  }

  async cleanLogs(): Promise<ServiceResult<boolean>> {
    mockJobLogs.length = 0;
    return createSuccessResult(true, '任务日志清理成功');
  }
}

export const jobService = new JobService();
