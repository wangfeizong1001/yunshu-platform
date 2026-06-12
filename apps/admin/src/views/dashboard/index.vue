<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <el-row :gutter="16" class="welcome-section">
      <el-col :span="24">
        <div class="welcome-card">
          <div class="welcome-left">
            <h2>
              <span class="greeting">{{ greetingText }}</span>
              {{ userStore.nickname || userStore.username }}！
            </h2>
            <p class="date-time">
              <el-icon><Calendar /></el-icon>
              {{ currentDateTime }}
              <span class="separator">·</span>
              <el-icon><Sunny v-if="isDaytime" /><Moon v-else /></el-icon>
              {{ isDaytime ? '白天' : '夜晚' }}
            </p>
          </div>
          <div class="welcome-right">
            <div class="quick-stat" v-for="item in quickStats" :key="item.label">
              <span class="stat-label">{{ item.label }}</span>
              <span class="stat-value">{{ item.value }}</span>
              <span class="stat-trend" :class="item.trend >= 0 ? 'up' : 'down'">
                <el-icon><CaretTop v-if="item.trend >= 0" /><CaretBottom v-else /></el-icon>
                {{ Math.abs(item.trend) }}%
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 统计卡片区域 -->
    <el-row :gutter="16" class="stat-section">
      <el-col :xs="24" :sm="12" :md="6" v-for="(card, idx) in statCards" :key="card.key">
        <div class="stat-card" :style="{ '--card-color': card.color }">
          <div class="stat-icon">
            <el-icon :size="28"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatNumber(overview[card.key] || 0) }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
          <div class="stat-trend" :class="overview[card.growthKey] >= 0 ? 'up' : 'down'">
            <el-icon><TrendCharts /></el-icon>
            <span>{{ overview[card.growthKey] >= 0 ? '+' : '' }}{{ overview[card.growthKey] }}%</span>
            <span class="trend-label">较昨日</span>
          </div>
          <div class="mini-chart" ref="miniChartRefs" :data-index="idx"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域第一行 -->
    <el-row :gutter="16" class="chart-section">
      <el-col :xs="24" :lg="14">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon><DataAnalysis /></el-icon>
              <span>用户活跃趋势</span>
            </div>
            <div class="chart-tabs">
              <el-radio-group v-model="growthTrendType" size="small">
                <el-radio-button value="newUsers">新增用户</el-radio-button>
                <el-radio-button value="activeUsers">活跃用户</el-radio-button>
                <el-radio-button value="logins">登录次数</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="userGrowthChartOption" autoresize />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :lg="10">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon><PieChart /></el-icon>
              <span>操作类型分布</span>
            </div>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="operationTypeChartOption" autoresize />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域第二行 -->
    <el-row :gutter="16" class="chart-section">
      <el-col :xs="24" :lg="14">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon><Monitor /></el-icon>
              <span>系统资源使用率</span>
            </div>
            <div class="chart-subtitle">最近 24 小时</div>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="resourceChartOption" autoresize />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :lg="10">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon><Histogram /></el-icon>
              <span>登录时间分布</span>
            </div>
            <div class="chart-subtitle">按小时统计</div>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="loginDistributionChartOption" autoresize />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作和操作日志 -->
    <el-row :gutter="16" class="content-section">
      <el-col :xs="24" :lg="8">
        <!-- 快捷操作区域 -->
        <div class="action-card">
          <div class="action-header">
            <el-icon><MagicStick /></el-icon>
            <span>快捷操作</span>
          </div>
          <div class="quick-entry">
            <div
              v-for="item in quickEntries"
              :key="item.path"
              class="quick-item"
              @click="handleQuickEntry(item.path)"
            >
              <div class="quick-icon" :style="{ backgroundColor: item.color }">
                <el-icon :size="20"><component :is="item.icon" /></el-icon>
              </div>
              <span class="quick-title">{{ item.title }}</span>
            </div>
          </div>
        </div>

        <!-- 服务器信息概览 -->
        <div class="server-card">
          <div class="server-header">
            <el-icon><Cpu /></el-icon>
            <span>系统状态</span>
            <span class="status-badge up">运行正常</span>
          </div>
          <div class="server-stats">
            <div class="server-stat-item">
              <div class="server-stat-label">CPU 使用率</div>
              <div class="server-stat-bar">
                <el-progress
                  :percentage="serverInfo.cpuUsage"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.cpuUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ serverInfo.cpuUsage }}%</div>
            </div>
            <div class="server-stat-item">
              <div class="server-stat-label">内存使用率</div>
              <div class="server-stat-bar">
                <el-progress
                  :percentage="serverInfo.memoryUsage"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.memoryUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ serverInfo.memoryUsage }}%</div>
            </div>
            <div class="server-stat-item">
              <div class="server-stat-label">磁盘使用率</div>
              <div class="server-stat-bar">
                <el-progress
                  :percentage="serverInfo.diskUsage"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.diskUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ serverInfo.diskUsage }}%</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :lg="16">
        <!-- 最近操作日志 -->
        <div class="log-card">
          <div class="log-header">
            <div class="log-title">
              <el-icon><Document /></el-icon>
              <span>最近操作日志</span>
            </div>
            <el-button type="primary" link @click="router.push('/monitor/operlog')">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <el-table :data="operLogs" style="width: 100%" :show-header="true" size="default" stripe>
            <el-table-column prop="operName" label="操作人" width="100" />
            <el-table-column prop="operModule" label="操作模块" width="120" />
            <el-table-column prop="operType" label="操作类型" width="80">
              <template #default="{ row }">
                <el-tag :type="getOperTypeTagType(row.operType)" size="small">
                  {{ row.operType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operTime" label="操作时间" min-width="160">
              <template #default="{ row }">
                {{ formatTime(row.operTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
                  {{ row.status === '0' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import {
  getDashboardOverview,
  getUserGrowthTrend,
  getOperationTypeDistribution,
  getSystemResourceTrend,
  getLoginDistribution,
  type DashboardOverview,
  type UserGrowthData,
  type OperationTypeData,
  type SystemResourceData,
  type LoginDistributionData
} from '@/api/admin-dashboard.api'
import { getServerInfo } from '@/api/monitor/server.api'
import { getOperlogPage } from '@/api/monitor/operlog.api'
import { getOnlineList } from '@/api/monitor/online.api'
import type { IServer, IOperlog } from '@yunshu/shared'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent
])

const router = useRouter()
const userStore = useUserStore()

// ========== 时间相关 ==========
const currentDateTime = ref('')
let timer: ReturnType<typeof setInterval>

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

const isDaytime = computed(() => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18
})

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]
  currentDateTime.value = `${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}:${seconds}`
}

// ========== 数据相关 ==========
const overview = reactive<DashboardOverview>({
  userCount: 0,
  roleCount: 0,
  onlineCount: 0,
  todayVisit: 0,
  userGrowth: 0,
  roleGrowth: 0,
  onlineGrowth: 0,
  visitGrowth: 0
})

const userGrowthData = ref<UserGrowthData[]>([])
const operationTypeData = ref<OperationTypeData[]>([])
const systemResourceData = ref<SystemResourceData[]>([])
const loginDistributionData = ref<LoginDistributionData[]>([])

const serverInfo = ref<IServer>({
  serverName: '云枢生产服务器',
  os: '',
  osArch: '',
  cpuCount: 0,
  cpuUsage: 35,
  memoryUsed: 0,
  memoryTotal: 0,
  memoryUsage: 40,
  diskUsed: 0,
  diskTotal: 0,
  diskUsage: 50,
  bootTime: '',
  uptime: 0,
  jvm: '',
  javaVersion: '',
  database: '',
  databaseVersion: '',
  projectPath: '',
  hostName: '',
  collectTime: ''
})

const operLogs = ref<IOperlog[]>([])
const growthTrendType = ref<'newUsers' | 'activeUsers' | 'logins'>('activeUsers')

// ========== 快捷统计 ==========
const quickStats = computed(() => [
  { label: '今日任务', value: '15', trend: 12.5 },
  { label: '已完成', value: '8', trend: 8.3 },
  { label: '进行中', value: '5', trend: -2.1 }
])

// ========== 统计卡片配置 ==========
const statCards = [
  { key: 'userCount', growthKey: 'userGrowth', label: '用户总数', icon: 'User', color: '#409EFF' },
  { key: 'roleCount', growthKey: 'roleGrowth', label: '角色总数', icon: 'Key', color: '#67C23A' },
  { key: 'onlineCount', growthKey: 'onlineGrowth', label: '在线人数', icon: 'UserFilled', color: '#E6A23C' },
  { key: 'todayVisit', growthKey: 'visitGrowth', label: '今日访问', icon: 'Connection', color: '#F56C6C' }
]

// ========== 快捷入口 ==========
const quickEntries = [
  { title: '用户管理', path: '/system/user', icon: 'User', color: '#409EFF' },
  { title: '角色管理', path: '/system/role', icon: 'Key', color: '#67C23A' },
  { title: '菜单管理', path: '/system/menu', icon: 'Menu', color: '#E6A23C' },
  { title: '系统监控', path: '/monitor/server', icon: 'Monitor', color: '#F56C6C' },
  { title: '操作日志', path: '/monitor/operlog', icon: 'Document', color: '#909399' },
  { title: '登录日志', path: '/monitor/logininfor', icon: 'Lock', color: '#606266' }
]

// ========== 图表配置 ==========

// 用户增长趋势图
const userGrowthChartOption = computed<EChartsOption>(() => {
  const dates = userGrowthData.value.map(d => d.date)
  const getSeriesData = (key: 'newUsers' | 'activeUsers' | 'logins') =>
    userGrowthData.value.map(d => d[key])

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: { color: '#303133' }
    },
    legend: {
      data: ['新增用户', '活跃用户', '登录次数'],
      bottom: 0,
      textStyle: { color: '#606266' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f2f5' } },
      axisLabel: { color: '#909399' }
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: getSeriesData('newUsers'),
        lineStyle: { width: 2, color: '#409EFF' },
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        }
      },
      {
        name: '活跃用户',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: getSeriesData('activeUsers'),
        lineStyle: { width: 2, color: '#67C23A' },
        itemStyle: { color: '#67C23A' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ]
          }
        }
      },
      {
        name: '登录次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: getSeriesData('logins'),
        lineStyle: { width: 2, color: '#E6A23C' },
        itemStyle: { color: '#E6A23C' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
              { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
            ]
          }
        }
      }
    ]
  }
})

// 操作类型分布图（环形饼图）
const operationTypeChartOption = computed<EChartsOption>(() => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#606266']
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#606266' },
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle'
    },
    color: colors,
    series: [
      {
        name: '操作类型',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        labelLine: {
          show: false
        },
        data: operationTypeData.value.map((item, idx) => ({
          value: item.value,
          name: item.name
        }))
      }
    ]
  }
})

// 系统资源使用趋势图
const resourceChartOption = computed<EChartsOption>(() => {
  const times = systemResourceData.value.map(d => d.time)
  const cpuData = systemResourceData.value.map(d => d.cpu)
  const memoryData = systemResourceData.value.map(d => d.memory)
  const diskData = systemResourceData.value.map(d => d.disk)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      formatter: (params: any) => {
        let html = `<div style="font-weight: 600; margin-bottom: 4px">${params[0].axisValue}</div>`
        params.forEach((p: any) => {
          html += `<div style="display: flex; align-items: center; gap: 8px; margin: 2px 0">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${p.color}"></span>
            <span>${p.seriesName}: ${p.value}%</span>
          </div>`
        })
        return html
      }
    },
    legend: {
      data: ['CPU', '内存', '磁盘'],
      bottom: 0,
      textStyle: { color: '#606266' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: '#f0f2f5' } },
      axisLabel: { color: '#909399', formatter: '{value}%' }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: cpuData,
        lineStyle: { width: 2, color: '#409EFF' },
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '内存',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: memoryData,
        lineStyle: { width: 2, color: '#67C23A' },
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '磁盘',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: diskData,
        lineStyle: { width: 2, color: '#E6A23C' },
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
})

// 登录时间分布图（柱状图）
const loginDistributionChartOption = computed<EChartsOption>(() => {
  const hours = loginDistributionData.value.map(d => `${d.hour}:00`)
  const counts = loginDistributionData.value.map(d => d.count)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: { color: '#909399', interval: 2, fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f2f5' } },
      axisLabel: { color: '#909399' }
    },
    series: [
      {
        name: '登录次数',
        type: 'bar',
        barWidth: '55%',
        data: counts,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#79bbff' },
              { offset: 1, color: '#409EFF' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#a0cfff' },
                { offset: 1, color: '#66b1ff' }
              ]
            }
          }
        }
      }
    ]
  }
})

// ========== 工具函数 ==========
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const formatTime = (time: string) => {
  return time
}

const getProgressColor = (percentage: number) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

const getOperTypeTagType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    查询: 'info',
    新增: 'success',
    修改: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'primary'
  }
  return typeMap[type] || 'info'
}

const handleQuickEntry = (path: string) => {
  router.push(path)
}

// ========== 数据加载 ==========
const fetchOverview = async () => {
  try {
    const res = await getDashboardOverview() as any
    if (res.data) {
      Object.assign(overview, res.data)
    }
  } catch {
    // 默认数据
    Object.assign(overview, {
      userCount: 128,
      roleCount: 8,
      onlineCount: 12,
      todayVisit: 1523,
      userGrowth: 12.5,
      roleGrowth: 3.2,
      onlineGrowth: -2.1,
      visitGrowth: 8.6
    })
  }
}

const fetchUserGrowth = async () => {
  try {
    const res = await getUserGrowthTrend() as any
    if (res.data) {
      userGrowthData.value = res.data
    }
  } catch {
    // 默认数据
    userGrowthData.value = [
      { date: '周一', newUsers: 25, activeUsers: 120, logins: 180 },
      { date: '周二', newUsers: 32, activeUsers: 135, logins: 210 },
      { date: '周三', newUsers: 28, activeUsers: 145, logins: 225 },
      { date: '周四', newUsers: 18, activeUsers: 110, logins: 160 },
      { date: '周五', newUsers: 35, activeUsers: 155, logins: 240 },
      { date: '周六', newUsers: 12, activeUsers: 85, logins: 120 },
      { date: '周日', newUsers: 15, activeUsers: 90, logins: 130 }
    ]
  }
}

const fetchOperationType = async () => {
  try {
    const res = await getOperationTypeDistribution() as any
    if (res.data) {
      operationTypeData.value = res.data
    }
  } catch {
    operationTypeData.value = [
      { name: '查询', value: 3421 },
      { name: '新增', value: 586 },
      { name: '修改', value: 423 },
      { name: '删除', value: 128 },
      { name: '导出', value: 95 },
      { name: '登录', value: 2156 }
    ]
  }
}

const fetchSystemResource = async () => {
  try {
    const res = await getSystemResourceTrend() as any
    if (res.data) {
      systemResourceData.value = res.data
    }
  } catch {
    // 默认数据
    const data: SystemResourceData[] = []
    for (let i = 0; i < 12; i++) {
      const hour = (i * 2).toString().padStart(2, '0')
      data.push({
        time: `${hour}:00`,
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 35,
        disk: Math.floor(Math.random() * 15) + 45
      })
    }
    systemResourceData.value = data
  }
}

const fetchLoginDistribution = async () => {
  try {
    const res = await getLoginDistribution() as any
    if (res.data) {
      loginDistributionData.value = res.data
    }
  } catch {
    const data: LoginDistributionData[] = []
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0')
      let base = 5
      if (i >= 9 && i <= 18) base = Math.floor(Math.random() * 80) + 60
      else if (i >= 19 && i <= 22) base = Math.floor(Math.random() * 40) + 30
      else if (i >= 6 && i <= 8) base = Math.floor(Math.random() * 30) + 20
      else base = Math.floor(Math.random() * 10) + 2
      data.push({ hour, count: base })
    }
    loginDistributionData.value = data
  }
}

const fetchServerInfo = async () => {
  try {
    const res = await getServerInfo() as any
    if (res.data) {
      serverInfo.value = { ...serverInfo.value, ...res.data }
    }
  } catch {
    // 使用默认数据
  }
}

const fetchOperLogs = async () => {
  try {
    const res = await getOperlogPage({ pageNum: 1, pageSize: 10 }) as any
    if (res.rows) {
      operLogs.value = res.rows
    }
  } catch {
    // 使用默认数据
  }
}

const fetchOnlineStats = async () => {
  try {
    const res = await getOnlineList() as any
    const data = res.data as Record<string, unknown> | undefined
    if (data) {
      overview.onlineCount = Number(data.onlineCount) || 0
    }
  } catch {
    // 使用默认数据
  }
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)

  fetchOverview()
  fetchUserGrowth()
  fetchOperationType()
  fetchSystemResource()
  fetchLoginDistribution()
  fetchServerInfo()
  fetchOperLogs()
  fetchOnlineStats()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 16px;

  // ========== 欢迎区域 ==========
  .welcome-section {
    margin-bottom: 16px;
  }

  .welcome-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background: linear-gradient(135deg, #409EFF 0%, #66b1ff 50%, #79bbff 100%);
    border-radius: 12px;
    color: #fff;
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.25);

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    .welcome-left {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;

        .greeting {
          opacity: 0.9;
          margin-right: 8px;
        }
      }

      .date-time {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 14px;
        opacity: 0.9;

        .separator {
          opacity: 0.5;
        }
      }
    }

    .welcome-right {
      display: flex;
      gap: 48px;

      @media (max-width: 768px) {
        gap: 24px;
      }

      .quick-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;

        .stat-label {
          font-size: 13px;
          opacity: 0.85;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          opacity: 0.9;
        }
      }
    }
  }

  // ========== 统计卡片 ==========
  .stat-section {
    margin-bottom: 16px;
  }

  .stat-card {
    position: relative;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;
    overflow: hidden;
    border: 1px solid #f0f2f5;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 12px;
      color: #fff;
      background: var(--card-color);
      margin-bottom: 12px;
    }

    .stat-info {
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #303133;
        line-height: 1.2;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      font-size: 13px;

      &.up {
        color: #67C23A;
      }

      &.down {
        color: #F56C6C;
      }

      .trend-label {
        color: #c0c4cc;
        margin-left: 4px;
        font-size: 12px;
      }
    }

    .mini-chart {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 120px;
      height: 50px;
      opacity: 0.3;
    }
  }

  // ========== 图表卡片 ==========
  .chart-section {
    margin-bottom: 16px;
  }

  .chart-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    height: 360px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f2f5;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .chart-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;

        .el-icon {
          color: #409EFF;
        }
      }

      .chart-subtitle {
        font-size: 12px;
        color: #909399;
      }

      .chart-tabs {
        :deep(.el-radio-button__inner) {
          padding: 6px 14px;
        }
      }
    }

    .chart-body {
      height: calc(100% - 50px);

      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }

  // ========== 快捷操作 ==========
  .content-section {
    margin-bottom: 16px;
  }

  .action-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f2f5;

    .action-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;

      .el-icon {
        color: #409EFF;
      }
    }

    .quick-entry {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      .quick-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 14px 8px;
        background: #fafafa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          background: #ecf5ff;
          transform: translateY(-2px);
        }

        .quick-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          color: #fff;
        }

        .quick-title {
          font-size: 12px;
          color: #606266;
          text-align: center;
        }
      }
    }
  }

  // ========== 服务器状态 ==========
  .server-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f2f5;

    .server-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;

      .el-icon {
        color: #409EFF;
      }

      .status-badge {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: normal;

        &.up {
          background: #f0f9eb;
          color: #67C23A;
        }
      }
    }

    .server-stats {
      .server-stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;

        .server-stat-label {
          width: 80px;
          font-size: 13px;
          color: #606266;
          flex-shrink: 0;
        }

        .server-stat-bar {
          flex: 1;
        }

        .server-stat-value {
          width: 40px;
          text-align: right;
          font-size: 13px;
          font-weight: 600;
          color: #303133;
          flex-shrink: 0;
        }
      }
    }
  }

  // ========== 操作日志 ==========
  .log-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f2f5;

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .log-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;

        .el-icon {
          color: #409EFF;
        }
      }
    }
  }
}
</style>
