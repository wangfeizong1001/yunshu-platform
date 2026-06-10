/**
 * 报表管理相关 API
 */
import request from '@/utils/request';
// 获取报表列表
export function getReportList(params) {
    return request({
        url: '/report/list',
        method: 'get',
        params
    });
}
// 获取报表分页列表
export function getReportPage(params) {
    return request({
        url: '/report/page',
        method: 'get',
        params
    });
}
// 获取报表详情
export function getReport(reportId) {
    return request({
        url: `/report/${reportId}`,
        method: 'get'
    });
}
// 新增报表
export function addReport(data) {
    return request({
        url: '/report',
        method: 'post',
        data
    });
}
// 修改报表
export function updateReport(data) {
    return request({
        url: '/report',
        method: 'put',
        data
    });
}
// 删除报表
export function deleteReport(reportId) {
    return request({
        url: `/report/${reportId}`,
        method: 'delete'
    });
}
// 批量删除报表
export function batchDeleteReport(reportIds) {
    return request({
        url: '/report/batch',
        method: 'delete',
        data: reportIds
    });
}
// 获取报表数据
export function getReportData(params) {
    return request({
        url: '/report/data',
        method: 'get',
        params
    });
}
// 导出报表
export function exportReport(reportId, format, params) {
    return request({
        url: '/report/export',
        method: 'get',
        params: { reportId, format, ...params },
        responseType: 'blob'
    });
}
//# sourceMappingURL=report.api.js.map