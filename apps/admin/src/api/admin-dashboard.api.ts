/**
 * 管理后台仪表盘 API
 */

import { request } from '@/utils/httpClient'

// 仪表盘概览统计
export interface DashboardOverview {
  userCount: number
  roleCount: number
  onlineCount: number
  todayVisit: number
  userGrowth: number
  roleGrowth: number
  onlineGrowth: number
  visitGrowth: number
}

// 用户增长趋势数据（最近7天）
export interface UserGrowthData {
  date: string
  newUsers: number
  activeUsers: number
  logins: number
}

// 操作类型分布
export interface OperationTypeData {
  name: string
  value: number
}

// 系统资源使用趋势（最近24小时）
export interface SystemResourceData {
  time: string
  cpu: number
  memory: number
  disk: number
}

// 登录分布数据（按小时）
export interface LoginDistributionData {
  hour: string
  count: number
}

// 获取仪表盘概览
export function getDashboardOverview() {
  return request<DashboardOverview>({
    url: '/api/admin-dashboard/overview',
    method: 'GET'
  })
}

// 获取用户增长趋势
export function getUserGrowthTrend() {
  return request<UserGrowthData[]>({
    url: '/api/admin-dashboard/user-growth',
    method: 'GET'
  })
}

// 获取操作类型分布
export function getOperationTypeDistribution() {
  return request<OperationTypeData[]>({
    url: '/api/admin-dashboard/operation-types',
    method: 'GET'
  })
}

// 获取系统资源趋势
export function getSystemResourceTrend() {
  return request<SystemResourceData[]>({
    url: '/api/admin-dashboard/resource-trend',
    method: 'GET'
  })
}

// 获取登录时间分布
export function getLoginDistribution() {
  return request<LoginDistributionData[]>({
    url: '/api/admin-dashboard/login-distribution',
    method: 'GET'
  })
}
