/**
 * 报表管理相关 API
 */

import request from '@/utils/request';

// 报表查询参数
export interface ReportQuery {
  pageNum?: number;
  pageSize?: number;
  reportName?: string;
  reportCode?: string;
  reportType?: string;
  status?: string;
}

// 报表表单
export interface ReportForm {
  reportId?: number;
  reportName?: string;
  reportCode?: string;
  reportType?: string;
  description?: string;
  config?: string;
  status?: string;
  remark?: string;
}

// 报表信息
export interface ReportInfo {
  reportId: number;
  reportName: string;
  reportCode: string;
  reportType: string;
  description: string;
  config: string;
  status: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  remark: string;
}

// 报表数据请求参数
export interface ReportDataQuery {
  reportId: number;
  params?: Record<string, any>;
}

// 获取报表列表
export function getReportList(params: ReportQuery) {
  return request({
    url: '/report/list',
    method: 'get',
    params,
  });
}

// 获取报表分页列表
export function getReportPage(params: ReportQuery) {
  return request({
    url: '/report/page',
    method: 'get',
    params,
  });
}

// 获取报表详情
export function getReport(reportId: number) {
  return request({
    url: `/report/${reportId}`,
    method: 'get',
  });
}

// 新增报表
export function addReport(data: ReportForm) {
  return request({
    url: '/report',
    method: 'post',
    data,
  });
}

// 修改报表
export function updateReport(data: ReportForm) {
  return request({
    url: '/report',
    method: 'put',
    data,
  });
}

// 删除报表
export function deleteReport(reportId: number) {
  return request({
    url: `/report/${reportId}`,
    method: 'delete',
  });
}

// 批量删除报表
export function batchDeleteReport(reportIds: number[]) {
  return request({
    url: '/report/batch',
    method: 'delete',
    data: reportIds,
  });
}

// 获取报表数据
export function getReportData(params: ReportDataQuery) {
  return request({
    url: '/report/data',
    method: 'get',
    params,
  });
}

// 导出报表
export function exportReport(reportId: number, format: string, params?: Record<string, any>) {
  return request({
    url: '/report/export',
    method: 'get',
    params: { reportId, format, ...params },
    responseType: 'blob',
  });
}
