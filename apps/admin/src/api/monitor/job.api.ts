/**
 * 定时任务 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface JobQuery {
  pageNum?: number
  pageSize?: number
  jobName?: string
  jobGroup?: string
  status?: string
}

export interface JobForm {
  jobId?: number
  jobName?: string
  jobGroup?: string
  jobType?: string
  cronExpression?: string
  targetBean?: string
  targetMethod?: string
  targetParams?: string
  invokeTarget?: string
  misfirePolicy?: string
  concurrent?: string
  status?: string
  remark?: string
}

export interface JobInfo {
  jobId: number
  jobName: string
  jobGroup: string
  jobType: string
  cronExpression: string
  targetBean: string
  targetMethod: string
  targetParams: string
  invokeTarget: string
  misfirePolicy: string
  concurrent: string
  status: string
  remark: string
  createTime: string
}

export interface JobLogQuery {
  pageNum?: number
  pageSize?: number
  jobName?: string
  jobGroup?: string
  status?: string
  startTime?: string
  endTime?: string
}

export interface JobLogInfo {
  jobLogId: number
  jobName: string
  jobGroup: string
  jobType: string
  cronExpression: string
  targetBean: string
  targetMethod: string
  targetParams: string
  status: string
  exceptionInfo: string
  createTime: string
}

export const getJobList = (params?: JobQuery) => {
  return request<unknown>({
    url: '/monitor/job/list',
    method: 'GET',
    params
  })
}

export const getJobPage = (params?: JobQuery) => {
  return request<unknown>({
    url: '/monitor/job/page',
    method: 'GET',
    params
  })
}

export const getJob = (jobId: number) => {
  return request<unknown>({
    url: `/monitor/job/${jobId}`,
    method: 'GET'
  })
}

export const addJob = (data: JobForm) => {
  return request<unknown>({
    url: '/monitor/job',
    method: 'POST',
    data
  })
}

export const updateJob = (data: JobForm) => {
  return request<unknown>({
    url: '/monitor/job',
    method: 'PUT',
    data
  })
}

export const deleteJob = (jobId: number) => {
  return request<unknown>({
    url: `/monitor/job/${jobId}`,
    method: 'DELETE'
  })
}

export const batchDeleteJob = (jobIds: number[]) => {
  return request<unknown>({
    url: '/monitor/job/batch',
    method: 'DELETE',
    data: jobIds
  })
}

export const runJob = (jobId: number) => {
  return request<unknown>({
    url: `/monitor/job/run`,
    method: 'POST',
    params: { jobId }
  })
}

export const changeJobStatus = (jobId: number, status: string) => {
  return request<unknown>({
    url: '/monitor/job/changeStatus',
    method: 'PUT',
    params: { jobId, status }
  })
}

export const getJobLogList = (params?: JobLogQuery) => {
  return request<unknown>({
    url: '/monitor/job/log/list',
    method: 'GET',
    params
  })
}

export const getJobLogPage = (params?: JobLogQuery) => {
  return request<unknown>({
    url: '/monitor/job/log/page',
    method: 'GET',
    params
  })
}

export const getJobLog = (jobLogId: number) => {
  return request<unknown>({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'GET'
  })
}

export const deleteJobLog = (jobLogId: number) => {
  return request<unknown>({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'DELETE'
  })
}

export const cleanJobLog = () => {
  return request<unknown>({
    url: '/monitor/job/log/clean',
    method: 'DELETE'
  })
}

