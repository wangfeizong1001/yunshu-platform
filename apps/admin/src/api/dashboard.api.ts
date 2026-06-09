/**
 * 大屏看板相关 API
 */

import request from '@/utils/request'

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
  data: Record<string, any>
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
  return request({
    url: '/dashboard/list',
    method: 'get',
    params
  })
}

// 获取大屏看板详情
export function getDashboard(dashboardId: number) {
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'get'
  })
}

// 获取大屏统计数据
export function getDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

// 获取实时数据
export function getRealTimeData() {
  return request({
    url: '/dashboard/realtime',
    method: 'get'
  })
}

// 获取销售趋势数据
export function getSalesTrendData() {
  return request({
    url: '/dashboard/sales-trend',
    method: 'get'
  })
}

// 获取区域销售数据
export function getRegionSalesData() {
  return request({
    url: '/dashboard/region-sales',
    method: 'get'
  })
}

// 获取分类占比数据
export function getCategoryData() {
  return request({
    url: '/dashboard/category',
    method: 'get'
  })
}

// 新增大屏看板
export function addDashboard(data: Partial<DashboardInfo>) {
  return request({
    url: '/dashboard',
    method: 'post',
    data
  })
}

// 更新大屏看板
export function updateDashboard(data: Partial<DashboardInfo>) {
  return request({
    url: '/dashboard',
    method: 'put',
    data
  })
}

// 删除大屏看板
export function deleteDashboard(dashboardId: number) {
  return request({
    url: `/dashboard/${dashboardId}`,
    method: 'delete'
  })
}
