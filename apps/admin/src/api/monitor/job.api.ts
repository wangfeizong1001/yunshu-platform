/**
 * 定时任务 API
 *
 * @module @yunshu/admin/api/monitor
 */

import { request } from '@/utils/request'
import type {
  IJob,
  IJobLog,
  IJobQuery,
  IJobLogQuery,
  IJobCreate,
  IJobUpdate,
} from '@yunshu/shared/types/monitor'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'

/** 定时任务分页响应 */
export type JobPageResp = PaginatedResponse<IJob>

/** 定时任务日志分页响应 */
export type JobLogPageResp = PaginatedResponse<IJobLog>

/**
 * 获取定时任务分页列表
 * @param params 查询参数
 */
export function getJobPage(params: IJobQuery) {
  return request<JobPageResp>({
    url: '/monitor/job/page',
    method: 'get',
    params,
  })
}

/**
 * 获取定时任务详情
 * @param id 任务ID
 */
export function getJobDetail(id: string) {
  return request<ApiResponse<IJob>>({
    url: `/monitor/job/${id}`,
    method: 'get',
  })
}

/**
 * 创建定时任务
 * @param data 任务表单数据
 */
export function createJob(data: IJobCreate) {
  return request<ApiResponse<IJob>>({
    url: '/monitor/job',
    method: 'post',
    data,
  })
}

/**
 * 更新定时任务
 * @param id 任务ID
 * @param data 任务表单数据
 */
export function updateJob(id: string, data: Partial<IJobUpdate>) {
  return request<ApiResponse<IJob>>({
    url: `/monitor/job/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除定时任务
 * @param id 任务ID
 */
export function deleteJob(id: string) {
  return request<ApiResponse<boolean>>({
    url: `/monitor/job/${id}`,
    method: 'delete',
  })
}

/**
 * 执行定时任务
 * @param jobId 任务ID
 */
export function executeJob(jobId: string) {
  return request<ApiResponse<{ logId: string }>>({
    url: '/monitor/job/execute',
    method: 'post',
    data: { jobId },
  })
}

/**
 * 更改任务状态
 * @param id 任务ID
 * @param status 状态
 */
export function changeJobStatus(id: string, status: '0' | '1') {
  return request<ApiResponse<IJob>>({
    url: '/monitor/job/status',
    method: 'put',
    data: { id, status },
  })
}

/**
 * 获取任务执行日志
 * @param params 查询参数
 */
export function getJobLogPage(params: IJobLogQuery) {
  return request<JobLogPageResp>({
    url: '/monitor/job/log/page',
    method: 'get',
    params,
  })
}

/**
 * 清空任务日志
 */
export function cleanJobLog() {
  return request<ApiResponse<boolean>>({
    url: '/monitor/job/log/clean',
    method: 'delete',
  })
}
