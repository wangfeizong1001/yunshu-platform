/**
 * 管理后台仪表盘 Mock API
 * @module mock/routes/admin-dashboard/admin-dashboard
 */

import { MockMethod } from 'vite-plugin-mock'
import { success } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 类型定义（与前端 api 同步） ==========
interface DashboardOverview {
  userCount: number
  roleCount: number
  onlineCount: number
  todayVisit: number
  userGrowth: number
  roleGrowth: number
  onlineGrowth: number
  visitGrowth: number
}

interface UserGrowthData {
  date: string          // YYYY-MM-DD
  newUsers: number
  activeUsers: number
  logins: number
}

interface OperationTypeData {
  name: string
  value: number
}

interface SystemResourceData {
  time: string          // HH:mm
  cpu: number
  memory: number
  disk: number
}

interface LoginDistributionData {
  hour: string          // HH
  count: number
}

interface TaskStats {
  totalCount: number
  completedCount: number
  inProgressCount: number
  totalGrowth: number
  completedGrowth: number
  inProgressGrowth: number
}

// ========== 数据生成 ==========
function getOverview(): DashboardOverview {
  return {
    userCount: 128,
    roleCount: 8,
    onlineCount: 12,
    todayVisit: 1523,
    userGrowth: 12.5,
    roleGrowth: 3.2,
    onlineGrowth: -2.1,
    visitGrowth: 8.6,
  }
}

/** 生成最近 7 天的用户增长数据 —— 使用 YYYY-MM-DD 格式，与真实后端契约对齐 */
function getUserGrowthData(): UserGrowthData[] {
  const data: UserGrowthData[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    data.push({
      date: `${yyyy}-${mm}-${dd}`,
      newUsers: Math.floor(Math.random() * 30) + 10,
      activeUsers: Math.floor(Math.random() * 100) + 80,
      logins: Math.floor(Math.random() * 200) + 150,
    })
  }
  return data
}

function getOperationTypeData(): OperationTypeData[] {
  return [
    { name: '查询', value: 3421 },
    { name: '新增', value: 586 },
    { name: '修改', value: 423 },
    { name: '删除', value: 128 },
    { name: '导出', value: 95 },
    { name: '登录', value: 2156 },
  ]
}

/** 最近 24 小时系统资源趋势，每 2 小时一个采样点 */
function getSystemResourceData(): SystemResourceData[] {
  const data: SystemResourceData[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now)
    d.setHours(now.getHours() - i * 2, 0, 0, 0)
    const hour = String(d.getHours()).padStart(2, '0')
    data.push({
      time: `${hour}:00`,
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 35,
      disk: Math.floor(Math.random() * 15) + 45,
    })
  }
  return data
}

/** 登录时间分布（按小时统计） */
function getLoginDistributionData(): LoginDistributionData[] {
  const data: LoginDistributionData[] = []
  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, '0')
    let base: number
    if (i >= 9 && i <= 18) {
      base = Math.floor(Math.random() * 80) + 60
    } else if (i >= 19 && i <= 22) {
      base = Math.floor(Math.random() * 40) + 30
    } else if (i >= 6 && i <= 8) {
      base = Math.floor(Math.random() * 30) + 20
    } else {
      base = Math.floor(Math.random() * 10) + 2
    }
    data.push({ hour, count: base })
  }
  return data
}

/** 今日任务统计 */
function getTaskStats(): TaskStats {
  return {
    totalCount: 15,
    completedCount: 8,
    inProgressCount: 5,
    totalGrowth: 12.5,
    completedGrowth: 8.3,
    inProgressGrowth: -2.1,
  }
}

/** 服务器信息（与 IServer 兼容的简化版本） */
function getServerInfo() {
  const now = new Date()
  return {
    serverName: '云枢生产服务器',
    os: 'Ubuntu 22.04 LTS',
    osArch: 'x64',
    cpuCount: 8,
    cpuUsage: Math.round((Math.random() * 40 + 20) * 10) / 10,
    memoryUsed: 12.5,
    memoryTotal: 32,
    memoryUsage: 39.06,
    diskUsed: 256.8,
    diskTotal: 500,
    diskUsage: 51.36,
    bootTime: now.toISOString(),
    uptime: 2592000,
    javaVersion: '17.0.9',
    database: 'PostgreSQL 16.1',
    projectPath: '/opt/yunshu',
    hostName: 'yunshu-server-01',
    collectTime: now.toISOString(),
    jvm: 'OpenJDK 17.0.9',
  }
}

export default [
  {
    url: '/api/admin-dashboard/overview',
    method: 'get',
    response: async () => {
      await delay()
      return success(getOverview())
    },
  },
  {
    url: '/api/admin-dashboard/user-growth',
    method: 'get',
    response: async () => {
      await randomDelay()
      return success(getUserGrowthData())
    },
  },
  {
    url: '/api/admin-dashboard/operation-types',
    method: 'get',
    response: async () => {
      await delay()
      return success(getOperationTypeData())
    },
  },
  {
    url: '/api/admin-dashboard/resource-trend',
    method: 'get',
    response: async () => {
      await delay()
      return success(getSystemResourceData())
    },
  },
  {
    url: '/api/admin-dashboard/login-distribution',
    method: 'get',
    response: async () => {
      await delay()
      return success(getLoginDistributionData())
    },
  },
  {
    url: '/api/admin-dashboard/task-stats',
    method: 'get',
    response: async () => {
      await delay()
      return success(getTaskStats())
    },
  },
  {
    url: '/api/admin-dashboard/server-info',
    method: 'get',
    response: async () => {
      await delay()
      return success(getServerInfo())
    },
  },
] as MockMethod[]
