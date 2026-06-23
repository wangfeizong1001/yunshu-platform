/**
 * 大屏看板 Mock 数据
 */

import type { DashboardInfo, DashboardStats, SalesTrendData, RegionSalesData, CategoryData } from '@/api/dashboard.api'


// 生成 Mock 大屏看板数据
export const mockDashboardList: DashboardInfo[] = [
  {
    dashboardId: 1,
    dashboardName: '企业运营监控大屏',
    dashboardCode: 'ENTERPRISE_MONITOR',
    description: '企业整体运营数据监控大屏',
    config: JSON.stringify({
      title: '企业运营监控大屏',
      widgets: []
    }),
    status: '0',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
    createBy: 'admin',
    remark: '默认运营监控'
  },
  {
    dashboardId: 2,
    dashboardName: '销售数据分析大屏',
    dashboardCode: 'SALES_ANALYSIS',
    description: '销售数据实时监控与分析',
    config: JSON.stringify({
      title: '销售数据分析大屏',
      widgets: []
    }),
    status: '0',
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 16:45:00',
    createBy: 'admin',
    remark: '销售部门使用'
  }
]

// 获取大屏统计数据 Mock
export function getMockDashboardStats(): DashboardStats {
  return {
    totalUsers: 12580,
    activeUsers: 8920,
    totalOrders: 45680,
    totalRevenue: 1258600,
    userGrowthRate: 12.5,
    orderGrowthRate: 8.3,
    revenueGrowthRate: 15.2,
    onlineUsers: 1256
  }
}

// 获取销售趋势数据 Mock
export function getMockSalesTrendData(): SalesTrendData[] {
  const data: SalesTrendData[] = []
  const dates = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  dates.forEach((date) => {
    data.push({
      date,
      sales: Math.floor(Math.random() * 200000) + 50000,
      orders: Math.floor(Math.random() * 5000) + 1000,
      visitors: Math.floor(Math.random() * 10000) + 3000
    })
  })
  return data
}

// 获取区域销售数据 Mock
export function getMockRegionSalesData(): RegionSalesData[] {
  return [
    { name: '北京', value: 125800, longitude: 116.46, latitude: 39.92 },
    { name: '上海', value: 98500, longitude: 121.48, latitude: 31.22 },
    { name: '广州', value: 86200, longitude: 113.23, latitude: 23.16 },
    { name: '深圳', value: 78300, longitude: 114.07, latitude: 22.62 },
    { name: '杭州', value: 65400, longitude: 120.19, latitude: 30.26 },
    { name: '成都', value: 54200, longitude: 104.06, latitude: 30.67 },
    { name: '武汉', value: 48300, longitude: 114.31, latitude: 30.52 },
    { name: '西安', value: 39800, longitude: 108.95, latitude: 34.27 }
  ]
}

// 获取分类占比数据 Mock
export function getMockCategoryData(): CategoryData[] {
  return [
    { name: '电子产品', value: 35 },
    { name: '服装', value: 25 },
    { name: '食品', value: 18 },
    { name: '家居', value: 12 },
    { name: '其他', value: 10 }
  ]
}

// 获取实时数据 Mock
export function getMockRealTimeData() {
  return {
    timestamp: new Date().toLocaleString(),
    data: {
      currentOrders: Math.floor(Math.random() * 100) + 50,
      currentUsers: Math.floor(Math.random() * 50) + 20,
      currentRevenue: Math.floor(Math.random() * 10000) + 5000
    }
  }
}

// 获取大屏看板列表 Mock
export function getMockDashboardList(params: any): { total: number; rows: DashboardInfo[] } {
  const { pageNum = 1, pageSize = 10, dashboardName = '', status = '' } = params

  let filteredList = mockDashboardList

  if (dashboardName) {
    filteredList = filteredList.filter((dashboard) =>
      dashboard.dashboardName.includes(dashboardName)
    )
  }

  if (status) {
    filteredList = filteredList.filter((dashboard) => dashboard.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows
  }
}
