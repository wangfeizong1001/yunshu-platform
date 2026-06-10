/**
 * 定时任务 API
 */
export interface JobQuery {
  pageNum?: number;
  pageSize?: number;
  jobName?: string;
  jobGroup?: string;
  status?: string;
}
export interface JobForm {
  jobId?: number;
  jobName?: string;
  jobGroup?: string;
  jobType?: string;
  cronExpression?: string;
  targetBean?: string;
  targetMethod?: string;
  targetParams?: string;
  invokeTarget?: string;
  misfirePolicy?: string;
  concurrent?: string;
  status?: string;
  remark?: string;
}
export interface JobInfo {
  jobId: number;
  jobName: string;
  jobGroup: string;
  jobType: string;
  cronExpression: string;
  targetBean: string;
  targetMethod: string;
  targetParams: string;
  invokeTarget: string;
  misfirePolicy: string;
  concurrent: string;
  status: string;
  remark: string;
  createTime: string;
}
export interface JobLogQuery {
  pageNum?: number;
  pageSize?: number;
  jobName?: string;
  jobGroup?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}
export interface JobLogInfo {
  jobLogId: number;
  jobName: string;
  jobGroup: string;
  jobType: string;
  cronExpression: string;
  targetBean: string;
  targetMethod: string;
  targetParams: string;
  status: string;
  exceptionInfo: string;
  createTime: string;
}
export declare const getJobList: (params?: JobQuery) => Promise<unknown>;
export declare const getJobPage: (params?: JobQuery) => Promise<unknown>;
export declare const getJob: (jobId: number) => Promise<unknown>;
export declare const addJob: (data: JobForm) => Promise<unknown>;
export declare const updateJob: (data: JobForm) => Promise<unknown>;
export declare const deleteJob: (jobId: number) => Promise<unknown>;
export declare const batchDeleteJob: (jobIds: number[]) => Promise<unknown>;
export declare const runJob: (jobId: number) => Promise<unknown>;
export declare const changeJobStatus: (jobId: number, status: string) => Promise<unknown>;
export declare const getJobLogList: (params?: JobLogQuery) => Promise<unknown>;
export declare const getJobLogPage: (params?: JobLogQuery) => Promise<unknown>;
export declare const getJobLog: (jobLogId: number) => Promise<unknown>;
export declare const deleteJobLog: (jobLogId: number) => Promise<unknown>;
export declare const cleanJobLog: () => Promise<unknown>;
//# sourceMappingURL=job.api.d.ts.map
