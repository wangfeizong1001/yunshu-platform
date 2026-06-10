/**
 * 大屏看板相关 API
 */
import request from '@/utils/request';
// 获取大屏看板列表
export function getDashboardList(params) {
  return request({
    url: '/dashboard/list',
    method: 'get',
    params,
  });
}
// 获取大屏看板详情
export function getDashboard(dashboardId) {
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'get',
  });
}
// 获取大屏统计数据
export function getDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get',
  });
}
// 获取实时数据
export function getRealTimeData() {
  return request({
    url: '/dashboard/realtime',
    method: 'get',
  });
}
// 获取销售趋势数据
export function getSalesTrendData() {
  return request({
    url: '/dashboard/sales-trend',
    method: 'get',
  });
}
// 获取区域销售数据
export function getRegionSalesData() {
  return request({
    url: '/dashboard/region-sales',
    method: 'get',
  });
}
// 获取分类占比数据
export function getCategoryData() {
  return request({
    url: '/dashboard/category',
    method: 'get',
  });
}
// 新增大屏看板
export function addDashboard(data) {
  return request({
    url: '/dashboard',
    method: 'post',
    data,
  });
}
// 更新大屏看板
export function updateDashboard(data) {
  return request({
    url: '/dashboard',
    method: 'put',
    data,
  });
}
// 删除大屏看板
export function deleteDashboard(dashboardId) {
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'delete',
  });
}
//# sourceMappingURL=dashboard.api.js.map
