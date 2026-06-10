/**
 * 大屏看板相关 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

// 大屏看板信息
export interface DashboardInfo {
  dashboardId: number
  dashboardName: string
  dashboardCode: string
  description: string
  config: string
  status: string
  createTime: string
  updateTime: string
  createBy: string
  remark: string
}

// 大屏统计数据
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  totalRevenue: number
  userGrowthRate: number
  orderGrowthRate: number
  revenueGrowthRate: number
  onlineUsers: number
}

// 实时数据
export interface RealTimeData {
  timestamp: string
  data: Record<string, unknown>
}

// 销售趋势数据
export interface SalesTrendData {
  date: string
  sales: number
  orders: number
  visitors: number
}

// 区域销售数据
export interface RegionSalesData {
  name: string
  value: number
  longitude: number
  latitude: number
}

// 分类占比数据
export interface CategoryData {
  name: string
  value: number
}

// 获取大屏看板列表
export function getDashboardList(params?: { pageNum?: number; pageSize?: number; dashboardName?: string; status?: string }) {
  return request<unknown>({
    url: '/dashboard/list',
    method: 'GET',
    params
  })
}

// 获取大屏看板详情
export function getDashboard(dashboardId: number) {
  return request<unknown>({
    url: `/dashboard/${dashboardId}`,
    method: 'GET'
  })
}

// 获取大屏统计数据
export function getDashboardStats() {
  return request<unknown>({
    url: '/dashboard/stats',
    method: 'GET'
  })
}

// 获取实时数据
export function getRealTimeData() {
  return request<unknown>({
    url: '/dashboard/realtime',
    method: 'GET'
  })
}

// 获取销售趋势数据
export function getSalesTrendData() {
  return request<unknown>({
    url: '/dashboard/sales-trend',
    method: 'GET'
  })
}

// 获取区域销售数据
export function getRegionSalesData() {
  return request<unknown>({
    url: '/dashboard/region-sales',
    method: 'GET'
  })
}

// 获取分类占比数据
export function getCategoryData() {
  return request<unknown>({
    url: '/dashboard/category',
    method: 'GET'
  })
}

// 新增大屏看板
export function addDashboard(data: Partial<DashboardInfo>) {
  return request<unknown>({
    url: '/dashboard',
    method: 'POST',
    data
  })
}

// 更新大屏看板
export function updateDashboard(data: Partial<DashboardInfo>) {
  return request<unknown>({
    url: '/dashboard',
    method: 'PUT',
    data
  })
}

// 删除大屏看板
export function deleteDashboard(dashboardId: number) {
  return request<unknown>({
    url: `/dashboard/${dashboardId}`,
    method: 'DELETE'
  })
}
