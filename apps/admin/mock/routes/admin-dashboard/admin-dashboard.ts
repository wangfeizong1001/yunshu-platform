/**
 * 管理后台仪表盘 Mock API
 * @module mock/routes/admin-dashboard/admin-dashboard
 */

import { MockMethod } from 'vite-plugin-mock'
import { success } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// 仪表盘概览统计
function getOverview() {
  return {
    userCount: 128,
    roleCount: 8,
    onlineCount: 12,
    todayVisit: 1523,
    userGrowth: 12.5,
    roleGrowth: 3.2,
    onlineGrowth: -2.1,
    visitGrowth: 8.6
  }
}

// 用户增长趋势（最近7天）
function getUserGrowthData() {
  const data: any[] = []
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  days.forEach((day) => {
    data.push({
      date: day,
      newUsers: Math.floor(Math.random() * 30) + 10,
      activeUsers: Math.floor(Math.random() * 100) + 80,
      logins: Math.floor(Math.random() * 200) + 150
    })
  })
  return data
}

// 操作类型分布
function getOperationTypeData() {
  return [
    { name: '查询', value: 3421 },
    { name: '新增', value: 586 },
    { name: '修改', value: 423 },
    { name: '删除', value: 128 },
    { name: '导出', value: 95 },
    { name: '登录', value: 2156 }
  ]
}

// 系统资源趋势（最近24小时，每2小时一个点）
function getSystemResourceData() {
  const data: any[] = []
  for (let i = 0; i < 12; i++) {
    const hour = (i * 2).toString().padStart(2, '0')
    data.push({
      time: `${hour}:00`,
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 35,
      disk: Math.floor(Math.random() * 15) + 45
    })
  }
  return data
}

// 登录时间分布（按小时统计）
function getLoginDistributionData() {
  const data: any[] = []
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0')
    // 模拟白天多，晚上少
    let base = 5
    if (i >= 9 && i <= 18) {
      base = Math.floor(Math.random() * 80) + 60
    } else if (i >= 19 && i <= 22) {
      base = Math.floor(Math.random() * 40) + 30
    } else if (i >= 6 && i <= 8) {
      base = Math.floor(Math.random() * 30) + 20
    } else {
      base = Math.floor(Math.random() * 10) + 2
    }
    data.push({
      hour: `${hour}`,
      count: base
    })
  }
  return data
}

export default [
  /**
   * 获取仪表盘概览统计
   */
  {
    url: '/api/admin-dashboard/overview',
    method: 'get',
    response: async () => {
      await delay()
      return success(getOverview())
    }
  },

  /**
   * 获取用户增长趋势
   */
  {
    url: '/api/admin-dashboard/user-growth',
    method: 'get',
    response: async () => {
      await randomDelay()
      return success(getUserGrowthData())
    }
  },

  /**
   * 获取操作类型分布
   */
  {
    url: '/api/admin-dashboard/operation-types',
    method: 'get',
    response: async () => {
      await delay()
      return success(getOperationTypeData())
    }
  },

  /**
   * 获取系统资源使用趋势
   */
  {
    url: '/api/admin-dashboard/resource-trend',
    method: 'get',
    response: async () => {
      await delay()
      return success(getSystemResourceData())
    }
  },

  /**
   * 获取登录时间分布
   */
  {
    url: '/api/admin-dashboard/login-distribution',
    method: 'get',
    response: async () => {
      await delay()
      return success(getLoginDistributionData())
    }
  }
] as MockMethod[]
