/**
 * 报表管理相关 API
 */
import { request } from '@/utils/httpClient';
// 获取报表列表
export function getReportList(params) {
    return request({
        url: '/report/list',
        method: 'GET',
        params
    });
}
// 获取报表分页列表
export function getReportPage(params) {
    return request({
        url: '/report/page',
        method: 'GET',
        params
    });
}
// 获取报表详情
export function getReport(reportId) {
    return request({
        url: `/report/${reportId}`,
        method: 'GET'
    });
}
// 新增报表
export function addReport(data) {
    return request({
        url: '/report',
        method: 'POST',
        data
    });
}
// 修改报表
export function updateReport(data) {
    return request({
        url: '/report',
        method: 'PUT',
        data
    });
}
// 删除报表
export function deleteReport(reportId) {
    return request({
        url: `/report/${reportId}`,
        method: 'DELETE'
    });
}
// 批量删除报表
export function batchDeleteReport(reportIds) {
    return request({
        url: '/report/batch',
        method: 'DELETE',
        data: reportIds
    });
}
// 获取报表数据
export function getReportData(params) {
    return request({
        url: '/report/data',
        method: 'GET',
        params
    });
}
// 导出报表
export function exportReport(reportId, format, params) {
    return request({
        url: '/report/export',
        method: 'GET',
        params: { reportId, format, ...params },
        responseType: 'blob'
    });
}
//# sourceMappingURL=report.api.js.map