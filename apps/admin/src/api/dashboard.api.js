/**
 * 大屏看板相关 API
 */
import { request } from '@/utils/httpClient';
// 获取大屏看板列表
export function getDashboardList(params) {
    return request({
        url: '/dashboard/list',
        method: 'GET',
        params
    });
}
// 获取大屏看板详情
export function getDashboard(dashboardId) {
    return request({
        url: `/dashboard/${dashboardId}`,
        method: 'GET'
    });
}
// 获取大屏统计数据
export function getDashboardStats() {
    return request({
        url: '/dashboard/stats',
        method: 'GET'
    });
}
// 获取实时数据
export function getRealTimeData() {
    return request({
        url: '/dashboard/realtime',
        method: 'GET'
    });
}
// 获取销售趋势数据
export function getSalesTrendData() {
    return request({
        url: '/dashboard/sales-trend',
        method: 'GET'
    });
}
// 获取区域销售数据
export function getRegionSalesData() {
    return request({
        url: '/dashboard/region-sales',
        method: 'GET'
    });
}
// 获取分类占比数据
export function getCategoryData() {
    return request({
        url: '/dashboard/category',
        method: 'GET'
    });
}
// 新增大屏看板
export function addDashboard(data) {
    return request({
        url: '/dashboard',
        method: 'POST',
        data
    });
}
// 更新大屏看板
export function updateDashboard(data) {
    return request({
        url: '/dashboard',
        method: 'PUT',
        data
    });
}
// 删除大屏看板
export function deleteDashboard(dashboardId) {
    return request({
        url: `/dashboard/${dashboardId}`,
        method: 'DELETE'
    });
}
//# sourceMappingURL=dashboard.api.js.map