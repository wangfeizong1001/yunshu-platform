/**
 * 报表管理相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

// 报表查询参数
export interface ReportQuery {
  pageNum?: number
  pageSize?: number
  reportName?: string
  reportCode?: string
  reportType?: string
  status?: string
}

// 报表表单
export interface ReportForm {
  reportId?: number
  reportName?: string
  reportCode?: string
  reportType?: string
  description?: string
  config?: string
  status?: string
  remark?: string
}

// 报表信息
export interface ReportInfo {
  reportId: number
  reportName: string
  reportCode: string
  reportType: string
  description: string
  config: string
  status: string
  createTime: string
  updateTime: string
  createBy: string
  remark: string
}

// 报表数据请求参数
export interface ReportDataQuery {
  reportId: number
  params?: Record<string, unknown>
}

// 获取报表列表
export function getReportList(params: ReportQuery) {
  return request<unknown>({
    url: '/report/list',
    method: 'GET',
    params
  })
}

// 获取报表分页列表
export function getReportPage(params: ReportQuery) {
  return request<unknown>({
    url: '/report/page',
    method: 'GET',
    params
  })
}

// 获取报表详情
export function getReport(reportId: number) {
  return request<unknown>({
    url: `/report/${reportId}`,
    method: 'GET'
  })
}

// 新增报表
export function addReport(data: ReportForm) {
  return request<unknown>({
    url: '/report',
    method: 'POST',
    data
  })
}

// 修改报表
export function updateReport(data: ReportForm) {
  return request<unknown>({
    url: '/report',
    method: 'PUT',
    data
  })
}

// 删除报表
export function deleteReport(reportId: number) {
  return request<unknown>({
    url: `/report/${reportId}`,
    method: 'DELETE'
  })
}

// 批量删除报表
export function batchDeleteReport(reportIds: number[]) {
  return request<unknown>({
    url: '/report/batch',
    method: 'DELETE',
    data: reportIds
  })
}

// 获取报表数据
export function getReportData(params: ReportDataQuery) {
  return request<unknown>({
    url: '/report/data',
    method: 'GET',
    params
  })
}

// 导出报表
export function exportReport(reportId: number, format: string, params?: Record<string, unknown>) {
  return request<unknown>({
    url: '/report/export',
    method: 'GET',
    params: { reportId, format, ...params },
    responseType: 'blob'
  })
}
