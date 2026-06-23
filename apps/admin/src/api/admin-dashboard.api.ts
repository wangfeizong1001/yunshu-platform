/**
 * 管理后台仪表盘 API
 */

import { request, type ApiResponse } from '@/utils/httpClient'

/** 仪表盘概览统计 */
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

/** 用户增长趋势（日期格式 YYYY-MM-DD） */
export interface UserGrowthData {
  date: string
  newUsers: number
  activeUsers: number
  logins: number
}

/** 操作类型分布 */
export interface OperationTypeData {
  name: string
  value: number
}

/** 系统资源使用趋势（最近 24 小时） */
export interface SystemResourceData {
  time: string
  cpu: number
  memory: number
  disk: number
}

/** 登录分布数据（按小时） */
export interface LoginDistributionData {
  hour: string
  count: number
}

/** 今日任务统计 */
export interface TaskStats {
  totalCount: number
  completedCount: number
  inProgressCount: number
  totalGrowth: number
  completedGrowth: number
  inProgressGrowth: number
}

/**
 * 统一的响应数据提取：确保 success === true 且 data 存在
 * 失败时直接抛出错误（或返回 undefined），避免消费方层层 if (res.data) 判断
 */
function extractData<T>(resp: ApiResponse<T>, fallback?: T): T | undefined {
  if (resp?.success && resp.data !== undefined && resp.data !== null) {
    return resp.data
  }
  return fallback
}

// 获取仪表盘概览
export async function getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
  return request<DashboardOverview>({
    url: '/admin-dashboard/overview',
    method: 'GET'
  })
}

// 获取用户增长趋势
export async function getUserGrowthTrend(): Promise<ApiResponse<UserGrowthData[]>> {
  return request<UserGrowthData[]>({
    url: '/admin-dashboard/user-growth',
    method: 'GET'
  })
}

// 获取操作类型分布
export async function getOperationTypeDistribution(): Promise<ApiResponse<OperationTypeData[]>> {
  return request<OperationTypeData[]>({
    url: '/admin-dashboard/operation-types',
    method: 'GET'
  })
}

// 获取系统资源趋势
export async function getSystemResourceTrend(): Promise<ApiResponse<SystemResourceData[]>> {
  return request<SystemResourceData[]>({
    url: '/admin-dashboard/resource-trend',
    method: 'GET'
  })
}

// 获取登录时间分布
export async function getLoginDistribution(): Promise<ApiResponse<LoginDistributionData[]>> {
  return request<LoginDistributionData[]>({
    url: '/admin-dashboard/login-distribution',
    method: 'GET'
  })
}

// 获取今日任务统计
export async function getTaskStats(): Promise<ApiResponse<TaskStats>> {
  return request<TaskStats>({
    url: '/admin-dashboard/task-stats',
    method: 'GET'
  })
}

export { extractData }
