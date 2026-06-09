/**
 * 定时任务类型定义
 *
 * @module @yunshu/shared/types/monitor
 */

/** 任务状态 */
export type JobStatus = '0' | '1' | '2' | '3' | '4';
/**
 * 0=正常
 * 1=暂停
 * 2=删除
 * 3=未开始
 * 4=执行中
 */

/** 任务分组 */
export type JobGroup = 'default' | 'system' | 'custom';

/** 执行策略 */
export type MisfirePolicy = '0' | '1' | '2';
/**
 * 0=默认策略
 * 1=立即执行
 * 2=执行一次
 */

/** 任务并发策略 */
export type ConcurrentPolicy = '0' | '1';
/**
 * 0=允许并发
 * 1=禁止并发
 */

/** 任务实体 */
export interface IJob {
  /** 任务ID */
  jobId: string;
  /** 任务名称 */
  jobName: string;
  /** 任务分组 */
  jobGroup: JobGroup;
  /** 调用目标 */
  invokeTarget: string;
  /** cron表达式 */
  cronExpression: string;
  /** 执行策略 */
  misfirePolicy: MisfirePolicy;
  /** 是否并发执行 */
  concurrent: ConcurrentPolicy;
  /** 状态 */
  status: JobStatus;
  /** 创建时间 */
  createTime: string;
  /** 下次执行时间 */
  nextValidTime?: string;
  /** 最后执行时间 */
  lastRunTime?: string;
  /** 执行次数 */
  runCount?: number;
  /** 备注 */
  remark?: string;
}

/** 任务执行日志实体 */
export interface IJobLog {
  /** 日志ID */
  logId: string;
  /** 任务ID */
  jobId: string;
  /** 任务名称 */
  jobName: string;
  /** 任务分组 */
  jobGroup: JobGroup;
  /** 调用目标 */
  invokeTarget: string;
  /** 执行状态 */
  status: '0' | '1';
  /** 执行时间 */
  executeTime: string;
  /** 耗时(毫秒) */
  costTime: number;
  /** 执行信息 */
  message: string;
  /** 异常信息 */
  error?: string;
  /** 创建时间 */
  createTime: string;
}

/** 任务查询参数 */
export interface IJobQuery {
  /** 关键词搜索 */
  search?: string;
  /** 任务名称 */
  jobName?: string;
  /** 任务分组 */
  jobGroup?: JobGroup;
  /** 任务状态 */
  status?: JobStatus;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/** 任务日志查询参数 */
export interface IJobLogQuery {
  /** 关键词搜索 */
  search?: string;
  /** 任务ID */
  jobId?: string;
  /** 任务名称 */
  jobName?: string;
  /** 执行状态 */
  status?: '0' | '1';
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/** 任务创建参数 */
export interface IJobCreate {
  jobName: string;
  jobGroup: JobGroup;
  invokeTarget: string;
  cronExpression: string;
  misfirePolicy: MisfirePolicy;
  concurrent: ConcurrentPolicy;
  remark?: string;
}

/** 任务更新参数 */
export interface IJobUpdate {
  jobId: string;
  jobName?: string;
  jobGroup?: JobGroup;
  invokeTarget?: string;
  cronExpression?: string;
  misfirePolicy?: MisfirePolicy;
  concurrent?: ConcurrentPolicy;
  status?: JobStatus;
  remark?: string;
}

/** 任务执行参数 */
export interface IJobExecute {
  jobId: string;
}
