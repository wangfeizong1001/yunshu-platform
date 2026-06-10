/**
 * 定时任务 API
 */

import request from '@/utils/request';

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

export const getJobList = (params?: JobQuery) => {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params,
  });
};

export const getJobPage = (params?: JobQuery) => {
  return request({
    url: '/monitor/job/page',
    method: 'get',
    params,
  });
};

export const getJob = (jobId: number) => {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'get',
  });
};

export const addJob = (data: JobForm) => {
  return request({
    url: '/monitor/job',
    method: 'post',
    data,
  });
};

export const updateJob = (data: JobForm) => {
  return request({
    url: '/monitor/job',
    method: 'put',
    data,
  });
};

export const deleteJob = (jobId: number) => {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'delete',
  });
};

export const batchDeleteJob = (jobIds: number[]) => {
  return request({
    url: '/monitor/job/batch',
    method: 'delete',
    data: jobIds,
  });
};

export const runJob = (jobId: number) => {
  return request({
    url: `/monitor/job/run`,
    method: 'post',
    params: { jobId },
  });
};

export const changeJobStatus = (jobId: number, status: string) => {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    params: { jobId, status },
  });
};

export const getJobLogList = (params?: JobLogQuery) => {
  return request({
    url: '/monitor/job/log/list',
    method: 'get',
    params,
  });
};

export const getJobLogPage = (params?: JobLogQuery) => {
  return request({
    url: '/monitor/job/log/page',
    method: 'get',
    params,
  });
};

export const getJobLog = (jobLogId: number) => {
  return request({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'get',
  });
};

export const deleteJobLog = (jobLogId: number) => {
  return request({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'delete',
  });
};

export const cleanJobLog = () => {
  return request({
    url: '/monitor/job/log/clean',
    method: 'delete',
  });
};
