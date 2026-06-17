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

// ==================== 大屏设计器 API ====================

/** 大屏配置信息 */
export interface IDashboardConfig {
  dashboardId?: number;
  dashboardName: string;
  dashboardCode?: string;
  description?: string;
  config: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  remark?: string;
}

/** 大屏模板信息 */
export interface IDashboardTemplate {
  id: string;
  name: string;
  config: string;
  description?: string;
}

/**
 * 获取大屏模板列表
 * @returns 模板列表
 */
export async function getDashboardTemplates(): Promise<IDashboardTemplate[]> {
  try {
    const response = await request<IDashboardTemplate[]>({
      url: '/dashboard/templates',
      method: 'GET',
    });
    
    // 处理响应数据
    const responseData = response as unknown as Record<string, unknown>;
    if (responseData && responseData.success && responseData.data) {
      return responseData.data as IDashboardTemplate[];
    }
    
    // 如果没有数据，返回默认模板
    return [
      { id: 'enterprise', name: '企业运营监控', config: '', description: '企业运营数据监控大屏模板' },
      { id: 'sales', name: '销售数据分析', config: '', description: '销售数据可视化分析模板' },
      { id: 'realtime', name: '实时数据监控', config: '', description: '实时数据监控大屏模板' },
    ];
  } catch (error) {
    console.error('获取模板列表失败:', error);
    // 返回默认模板
    return [
      { id: 'enterprise', name: '企业运营监控', config: '', description: '企业运营数据监控大屏模板' },
      { id: 'sales', name: '销售数据分析', config: '', description: '销售数据可视化分析模板' },
      { id: 'realtime', name: '实时数据监控', config: '', description: '实时数据监控大屏模板' },
    ];
  }
}

/**
 * 获取大屏详情
 * @param dashboardId 大屏ID
 * @returns 大屏配置信息
 */
export async function getDashboard(dashboardId: number): Promise<IDashboardConfig | null> {
  try {
    const response = await request<IDashboardConfig>({
      url: `/dashboard/${dashboardId}`,
      method: 'GET',
    });
    
    const responseData = response as unknown as Record<string, unknown>;
    if (responseData && responseData.success && responseData.data) {
      return responseData.data as IDashboardConfig;
    }
    return null;
  } catch (error) {
    console.error('获取大屏详情失败:', error);
    return null;
  }
}

/**
 * 保存大屏配置
 * @param dashboard 大屏配置数据
 * @returns 保存结果（包含新创建的ID）
 */
export async function saveDashboard(dashboard: Partial<IDashboardConfig>): Promise<{ dashboardId: number } | null> {
  try {
    const response = await request<{ dashboardId: number }>({
      url: '/dashboard',
      method: 'POST',
      data: dashboard,
    });
    
    const responseData = response as unknown as Record<string, unknown>;
    if (responseData && responseData.success) {
      return { dashboardId: (responseData.data as { dashboardId: number }).dashboardId || Date.now() };
    }
    return null;
  } catch (error) {
    console.error('保存大屏失败:', error);
    return null;
  }
}

/**
 * 更新大屏配置
 * @param dashboardId 大屏ID
 * @param dashboard 大屏配置数据
 * @returns 更新结果
 */
export async function updateDashboard(dashboardId: number, dashboard: Partial<IDashboardConfig>): Promise<boolean> {
  try {
    const response = await request<void>({
      url: `/dashboard/${dashboardId}`,
      method: 'PUT',
      data: dashboard,
    });
    
    const responseData = response as unknown as Record<string, unknown>;
    return responseData && responseData.success === true;
  } catch (error) {
    console.error('更新大屏失败:', error);
    return false;
  }
}

/**
 * 删除大屏
 * @param dashboardId 大屏ID
 * @returns 删除结果
 */
export async function deleteDashboard(dashboardId: number): Promise<boolean> {
  try {
    const response = await request<void>({
      url: `/dashboard/${dashboardId}`,
      method: 'DELETE',
    });
    
    const responseData = response as unknown as Record<string, unknown>;
    return responseData && responseData.success === true;
  } catch (error) {
    console.error('删除大屏失败:', error);
    return false;
  }
}

/**
 * 获取大屏列表
 * @param params 查询参数
 * @returns 大屏列表
 */
export async function getDashboardList(params?: {
  pageNum?: number;
  pageSize?: number;
  dashboardName?: string;
  status?: string;
}): Promise<{ rows: IDashboardConfig[]; total: number }> {
  try {
    const response = await request<{ rows: IDashboardConfig[]; total: number }>({
      url: '/dashboard/list',
      method: 'GET',
      params,
    });
    
    const responseData = response as unknown as Record<string, unknown>;
    if (responseData && responseData.success && responseData.data) {
      return responseData.data as { rows: IDashboardConfig[]; total: number };
    }
    return { rows: [], total: 0 };
  } catch (error) {
    console.error('获取大屏列表失败:', error);
    return { rows: [], total: 0 };
  }
}
