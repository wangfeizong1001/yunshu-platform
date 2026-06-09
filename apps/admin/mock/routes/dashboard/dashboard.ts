/**
 * 大屏看板 Mock API
 * @module mock/routes/dashboard/dashboard
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// 模拟大屏看板数据
interface Dashboard {
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

const dashboards: Dashboard[] = [
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

// 生成统计数据
function getStats() {
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

// 生成销售趋势数据
function getSalesTrend() {
  const data: any[] = []
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

// 生成区域销售数据
function getRegionSales() {
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

// 生成分类占比数据
function getCategoryData() {
  return [
    { name: '电子产品', value: 35 },
    { name: '服装', value: 25 },
    { name: '食品', value: 18 },
    { name: '家居', value: 12 },
    { name: '其他', value: 10 }
  ]
}

// 生成实时数据
function getRealTimeData() {
  return {
    timestamp: new Date().toLocaleString(),
    data: {
      currentOrders: Math.floor(Math.random() * 100) + 50,
      currentUsers: Math.floor(Math.random() * 50) + 20,
      currentRevenue: Math.floor(Math.random() * 10000) + 5000
    }
  }
}

export default [
  /**
   * 获取大屏看板分页列表
   */
  {
    url: '/api/dashboard/list',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; dashboardName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { dashboardName, status } = query

      let list = [...dashboards]

      // 筛选
      if (dashboardName) {
        list = list.filter(d => d.dashboardName.includes(dashboardName))
      }
      if (status) {
        list = list.filter(d => d.status === status)
      }

      // 排序
      list.sort((a, b) => b.dashboardId - a.dashboardId)

      // 分页
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取大屏看板详情
   */
  {
    url: '/api/dashboard/:dashboardId',
    method: 'get',
    response: async ({ params }: { params: { dashboardId: string } }) => {
      await delay()

      const dashboard = dashboards.find(d => d.dashboardId === parseInt(params.dashboardId))
      if (!dashboard) {
        return fail('大屏看板不存在', 404)
      }

      return success(dashboard)
    }
  },

  /**
   * 获取大屏统计数据
   */
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: async () => {
      await delay()
      return success(getStats())
    }
  },

  /**
   * 获取实时数据
   */
  {
    url: '/api/dashboard/realtime',
    method: 'get',
    response: async () => {
      await delay(100)
      return success(getRealTimeData())
    }
  },

  /**
   * 获取销售趋势数据
   */
  {
    url: '/api/dashboard/sales-trend',
    method: 'get',
    response: async () => {
      await delay()
      return success(getSalesTrend())
    }
  },

  /**
   * 获取区域销售数据
   */
  {
    url: '/api/dashboard/region-sales',
    method: 'get',
    response: async () => {
      await delay()
      return success(getRegionSales())
    }
  },

  /**
   * 获取分类占比数据
   */
  {
    url: '/api/dashboard/category',
    method: 'get',
    response: async () => {
      await delay()
      return success(getCategoryData())
    }
  },

  /**
   * 新增大屏看板
   */
  {
    url: '/api/dashboard',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      // 检查大屏编码是否已存在
      if (dashboards.some(d => d.dashboardCode === body.dashboardCode)) {
        return fail('大屏编码已存在')
      }

      const maxId = Math.max(...dashboards.map(d => d.dashboardId))
      const newDashboard: Dashboard = {
        dashboardId: maxId + 1,
        dashboardName: body.dashboardName,
        dashboardCode: body.dashboardCode,
        description: body.description || '',
        config: body.config || '',
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        createBy: 'admin',
        remark: body.remark || ''
      }

      dashboards.push(newDashboard)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改大屏看板
   */
  {
    url: '/api/dashboard',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = dashboards.findIndex(d => d.dashboardId === body.dashboardId)
      if (index === -1) {
        return fail('大屏看板不存在', 404)
      }

      // 检查大屏编码是否与其他大屏冲突
      if (body.dashboardCode && dashboards.some(d => d.dashboardCode === body.dashboardCode && d.dashboardId !== body.dashboardId)) {
        return fail('大屏编码已存在')
      }

      dashboards[index] = {
        ...dashboards[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除大屏看板
   */
  {
    url: '/api/dashboard/:dashboardId',
    method: 'delete',
    response: async ({ params }: { params: { dashboardId: string } }) => {
      await delay()

      const index = dashboards.findIndex(d => d.dashboardId === parseInt(params.dashboardId))
      if (index === -1) {
        return fail('大屏看板不存在', 404)
      }

      dashboards.splice(index, 1)
      return success(null, '删除成功')
    }
  }
] as MockMethod[]
