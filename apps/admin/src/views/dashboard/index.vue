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
              <el-icon><component :is="PieChartIcon" /></el-icon>
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
                  :percentage="Number(serverInfo.cpuUsage) || 0"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.cpuUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ Number(serverInfo.cpuUsage) || 0 }}%</div>
            </div>
            <div class="server-stat-item">
              <div class="server-stat-label">内存使用率</div>
              <div class="server-stat-bar">
                <el-progress
                  :percentage="Number(serverInfo.memoryUsage) || 0"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.memoryUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ Number(serverInfo.memoryUsage) || 0 }}%</div>
            </div>
            <div class="server-stat-item">
              <div class="server-stat-label">磁盘使用率</div>
              <div class="server-stat-bar">
                <el-progress
                  :percentage="Number(serverInfo.diskUsage) || 0"
                  :stroke-width="8"
                  :color="getProgressColor(serverInfo.diskUsage)"
                  :show-text="false"
                />
              </div>
              <div class="server-stat-value">{{ Number(serverInfo.diskUsage) || 0 }}%</div>
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
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import {
  Calendar,
  Sunny,
  Moon,
  CaretTop,
  CaretBottom,
  TrendCharts,
  User,
  Key,
  UserFilled,
  Connection,
  DataAnalysis,
  PieChart as PieChartIcon,
  Monitor,
  Histogram,
  MagicStick,
  Document,
  Lock,
  Cpu,
  ArrowRight,
} from '@element-plus/icons-vue'
import {
  getDashboardOverview,
  getUserGrowthTrend,
  getOperationTypeDistribution,
  getSystemResourceTrend,
  getLoginDistribution,
  getTaskStats,
  type DashboardOverview,
  type UserGrowthData,
  type OperationTypeData,
  type SystemResourceData,
  type LoginDistributionData,
} from '@/api/admin-dashboard.api'
import { request, type ApiResponse } from '@/utils/httpClient'
import { getOperlogPage } from '@/api/monitor/operlog.api'
import type { IServer, IOperlog } from '@yunshu/shared'

// ========== 常量配置 ==========
// 操作日志 status 字段值常量（与后端约定）
const OPERLOG_STATUS_SUCCESS = '0'
const OPERLOG_STATUS_FAIL = '1'

// 操作类型 -> Element Plus tag 类型的映射（扩展版，命中不到时回退到 info）
const OPER_TYPE_TAG_MAP: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
  查询: 'info',
  新增: 'success',
  创建: 'success',
  修改: 'warning',
  更新: 'warning',
  删除: 'danger',
  导出: 'primary',
  导入: 'primary',
  登录: 'success',
  登出: 'info',
  重置密码: 'warning',
}

// 图表主题色 —— 统一定义，便于未来主题切换
const CHART_THEME = {
  primary: '#4a9eff',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  muted: '#606266',
  tooltipBg: 'rgba(255, 255, 255, 0.95)',
  border: '#e4e7ed',
  text: '#303133',
  textMuted: '#606266',
  labelMuted: '#909399',
  splitLine: '#f0f2f5',
}

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
  VisualMapComponent,
])

const router = useRouter()
const userStore = useUserStore()

// ========== 时间相关 ==========
const currentDateTime = ref('')
let clockTimer: ReturnType<typeof setInterval> | undefined

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
  visitGrowth: 0,
})

const userGrowthData = ref<UserGrowthData[]>([])
const operationTypeData = ref<OperationTypeData[]>([])
const systemResourceData = ref<SystemResourceData[]>([])
const loginDistributionData = ref<LoginDistributionData[]>([])
const taskStats = ref<TaskStats>({
  totalCount: 0,
  completedCount: 0,
  inProgressCount: 0,
  totalGrowth: 0,
  completedGrowth: 0,
  inProgressGrowth: 0,
})

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
  collectTime: '',
})

const operLogs = ref<IOperlog[]>([])
const growthTrendType = ref<'newUsers' | 'activeUsers' | 'logins'>('activeUsers')

// 请求取消控制器 —— 离开页面时中断未完成请求
const abortController = new AbortController()
let pollingTimer: ReturnType<typeof setInterval> | undefined

// ========== 快捷统计 ==========
const quickStats = computed(() => [
  {
    label: '今日任务',
    value: String(taskStats.value.totalCount),
    trend: taskStats.value.totalGrowth,
  },
  {
    label: '已完成',
    value: String(taskStats.value.completedCount),
    trend: taskStats.value.completedGrowth,
  },
  {
    label: '进行中',
    value: String(taskStats.value.inProgressCount),
    trend: taskStats.value.inProgressGrowth,
  },
])

// ========== 统计卡片配置（图标现在是真正的组件引用，不再是字符串） ==========
const statCards = [
  { key: 'userCount' as const, growthKey: 'userGrowth' as const, label: '用户总数', icon: User, color: CHART_THEME.primary },
  { key: 'roleCount' as const, growthKey: 'roleGrowth' as const, label: '角色总数', icon: Key, color: CHART_THEME.success },
  { key: 'onlineCount' as const, growthKey: 'onlineGrowth' as const, label: '在线人数', icon: UserFilled, color: CHART_THEME.warning },
  { key: 'todayVisit' as const, growthKey: 'visitGrowth' as const, label: '今日访问', icon: Connection, color: CHART_THEME.danger },
]

// ========== 快捷入口 ==========
const quickEntries = [
  { title: '用户管理', path: '/system/user', icon: User, color: CHART_THEME.primary },
  { title: '角色管理', path: '/system/role', icon: Key, color: CHART_THEME.success },
  { title: '菜单管理', path: '/system/menu', icon: MagicStick, color: CHART_THEME.warning },
  { title: '系统监控', path: '/monitor/server', icon: Monitor, color: CHART_THEME.danger },
  { title: '操作日志', path: '/monitor/operlog', icon: Document, color: CHART_THEME.info },
  { title: '登录日志', path: '/monitor/logininfor', icon: Lock, color: CHART_THEME.muted },
]

// ========== 图表配置 ==========

// 用户增长趋势图 —— 根据 growthTrendType 高亮对应系列
const userGrowthChartOption = computed<EChartsOption>(() => {
  const dates = userGrowthData.value.map((d) => dayjs(d.date).format('MM-DD'))
  const extract = (key: 'newUsers' | 'activeUsers' | 'logins') =>
    userGrowthData.value.map((d) => d[key])

  // 高亮当前选中的类型：线宽增大、symbol 增大
  const buildSeries = (
    name: string,
    key: 'newUsers' | 'activeUsers' | 'logins',
    color: string,
  ) => {
    const isActive = growthTrendType.value === key
    return {
      name,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle' as const,
      symbolSize: isActive ? 10 : 6,
      data: extract(key),
      lineStyle: { width: isActive ? 3 : 2, color, opacity: isActive ? 1 : 0.65 },
      itemStyle: { color, opacity: isActive ? 1 : 0.65 },
      areaStyle: {
        opacity: isActive ? 1 : 0.35,
        color: {
          type: 'linear' as const,
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color}4D` },
            { offset: 1, color: `${color}0D` },
          ],
        },
      },
    }
  }

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: CHART_THEME.tooltipBg,
      borderColor: CHART_THEME.border,
      borderWidth: 1,
      textStyle: { color: CHART_THEME.text },
    },
    legend: {
      data: ['新增用户', '活跃用户', '登录次数'],
      bottom: 0,
      textStyle: { color: CHART_THEME.textMuted },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: CHART_THEME.border } },
      axisLabel: { color: CHART_THEME.labelMuted },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
      axisLabel: { color: CHART_THEME.labelMuted },
    },
    series: [
      buildSeries('新增用户', 'newUsers', CHART_THEME.primary),
      buildSeries('活跃用户', 'activeUsers', CHART_THEME.success),
      buildSeries('登录次数', 'logins', CHART_THEME.warning),
    ],
  }
})

// 操作类型分布图（环形饼图）
const operationTypeChartOption = computed<EChartsOption>(() => {
  const colors = [
    CHART_THEME.primary,
    CHART_THEME.success,
    CHART_THEME.warning,
    CHART_THEME.danger,
    CHART_THEME.info,
    CHART_THEME.muted,
  ]
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: CHART_THEME.tooltipBg,
      borderColor: CHART_THEME.border,
      borderWidth: 1,
      textStyle: { color: CHART_THEME.text },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: CHART_THEME.textMuted },
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle',
    },
    color: colors,
    series: [
      {
        name: '操作类型',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', formatter: '{b}\n{d}%' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' },
        },
        labelLine: { show: false },
        data: operationTypeData.value.map((item) => ({
          value: item.value,
          name: item.name,
        })),
      },
    ],
  }
})

// 系统资源使用趋势图
const resourceChartOption = computed<EChartsOption>(() => {
  const times = systemResourceData.value.map((d) => d.time)
  const cpuData = systemResourceData.value.map((d) => d.cpu)
  const memoryData = systemResourceData.value.map((d) => d.memory)
  const diskData = systemResourceData.value.map((d) => d.disk)

  const buildLine = (name: string, data: number[], color: string) => ({
    name,
    type: 'line' as const,
    smooth: true,
    symbol: 'circle' as const,
    symbolSize: 4,
    data,
    lineStyle: { width: 2, color },
    itemStyle: { color },
  })

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: CHART_THEME.tooltipBg,
      borderColor: CHART_THEME.border,
      borderWidth: 1,
      textStyle: { color: CHART_THEME.text },
      formatter: (params: unknown[]) => {
        const list = params as Array<{ seriesName: string; value: number; color: string; axisValueLabel?: string; axisValue?: string }>
        const axisValue = list[0]?.axisValueLabel ?? list[0]?.axisValue ?? ''
        let html = `<div style="font-weight:600;margin-bottom:4px">${axisValue}</div>`
        list.forEach((p) => {
          html += `<div style="display:flex;align-items:center;gap:8px;margin:2px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span>${p.seriesName}: ${p.value}%</span>
          </div>`
        })
        return html
      },
    },
    legend: {
      data: ['CPU', '内存', '磁盘'],
      bottom: 0,
      textStyle: { color: CHART_THEME.textMuted },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLine: { lineStyle: { color: CHART_THEME.border } },
      axisLabel: { color: CHART_THEME.labelMuted },
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
      axisLabel: { color: CHART_THEME.labelMuted, formatter: '{value}%' },
    },
    series: [
      buildLine('CPU', cpuData, CHART_THEME.primary),
      buildLine('内存', memoryData, CHART_THEME.success),
      buildLine('磁盘', diskData, CHART_THEME.warning),
    ],
  }
})

// 登录时间分布图（柱状图）
const loginDistributionChartOption = computed<EChartsOption>(() => {
  const hours = loginDistributionData.value.map((d) => `${d.hour}:00`)
  const counts = loginDistributionData.value.map((d) => d.count)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: CHART_THEME.tooltipBg,
      borderColor: CHART_THEME.border,
      borderWidth: 1,
      textStyle: { color: CHART_THEME.text },
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: CHART_THEME.border } },
      axisLabel: { color: CHART_THEME.labelMuted, interval: 2, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
      axisLabel: { color: CHART_THEME.labelMuted },
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
              { offset: 1, color: CHART_THEME.primary },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#a0cfff' },
                { offset: 1, color: '#66b1ff' },
              ],
            },
          },
        },
      },
    ],
  }
})

// ========== 工具函数 ==========

/** 数字格式化：>= 1 万显示 x.xw；其他按千分位显示。 */
const formatNumber = (num: number) => {
  const n = Number(num) || 0
  if (n >= 10000) {
    return `${(n / 10000).toFixed(1)}w`
  }
  return n.toLocaleString('zh-CN')
}

/** 时间格式化：解析 ISO/任意时间字符串，按 "YYYY-MM-DD HH:mm" 输出。 */
const formatTime = (time: string) => {
  if (!time) return '-'
  const d = dayjs(time)
  if (!d.isValid()) return String(time)
  return d.format('YYYY-MM-DD HH:mm')
}

/** 进度条颜色：安全归一化 percentage 值。 */
const getProgressColor = (percentage: number) => {
  const p = Number(percentage) || 0
  if (p < 60) return CHART_THEME.success
  if (p < 80) return CHART_THEME.warning
  return CHART_THEME.danger
}

/** 操作类型 -> tag 类型（兜底为 info）。 */
const getOperTypeTagType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  if (!type) return 'info'
  return OPER_TYPE_TAG_MAP[type] || 'info'
}

/** 操作日志状态文本。 */
const getStatusText = (status: string | number) => {
  const s = typeof status === 'number' ? String(status) : status
  return s === OPERLOG_STATUS_SUCCESS ? '成功' : '失败'
}

/** 操作日志状态 tag 类型。 */
const getStatusTagType = (status: string | number) => {
  const s = typeof status === 'number' ? String(status) : status
  return s === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger'
}

const handleQuickEntry = (path: string) => {
  router.push(path)
}

// ========== 数据加载（带类型安全 + 错误上报 + 默认数据兜底） ==========

const DEFAULT_OVERVIEW: DashboardOverview = {
  userCount: 128,
  roleCount: 8,
  onlineCount: 12,
  todayVisit: 1523,
  userGrowth: 12.5,
  roleGrowth: 3.2,
  onlineGrowth: -2.1,
  visitGrowth: 8.6,
}

const DEFAULT_TASK_STATS: TaskStats = {
  totalCount: 15,
  completedCount: 8,
  inProgressCount: 5,
  totalGrowth: 12.5,
  completedGrowth: 8.3,
  inProgressGrowth: -2.1,
}

function pickData<T>(resp: ApiResponse<T> | undefined | null): T | undefined {
  return resp && resp.success && resp.data !== undefined && resp.data !== null
    ? resp.data
    : undefined
}

const fetchOverview = async () => {
  try {
    const res = await getDashboardOverview()
    const data = pickData(res) ?? DEFAULT_OVERVIEW
    Object.assign(overview, data)
  } catch (err) {
    console.error('[dashboard] fetchOverview failed:', err)
    Object.assign(overview, DEFAULT_OVERVIEW)
  }
}

const fetchUserGrowth = async () => {
  try {
    const res = await getUserGrowthTrend()
    const data = pickData(res)
    if (data && data.length) {
      userGrowthData.value = data
    }
  } catch (err) {
    console.error('[dashboard] fetchUserGrowth failed:', err)
  }
}

const fetchOperationType = async () => {
  try {
    const res = await getOperationTypeDistribution()
    const data = pickData(res)
    if (data && data.length) {
      operationTypeData.value = data
    }
  } catch (err) {
    console.error('[dashboard] fetchOperationType failed:', err)
  }
}

const fetchSystemResource = async () => {
  try {
    const res = await getSystemResourceTrend()
    const data = pickData(res)
    if (data && data.length) {
      systemResourceData.value = data
    }
  } catch (err) {
    console.error('[dashboard] fetchSystemResource failed:', err)
  }
}

const fetchLoginDistribution = async () => {
  try {
    const res = await getLoginDistribution()
    const data = pickData(res)
    if (data && data.length) {
      loginDistributionData.value = data
    }
  } catch (err) {
    console.error('[dashboard] fetchLoginDistribution failed:', err)
  }
}

const fetchTaskStats = async () => {
  try {
    const res = await getTaskStats()
    const data = pickData(res) ?? DEFAULT_TASK_STATS
    Object.assign(taskStats.value, data)
  } catch (err) {
    console.error('[dashboard] fetchTaskStats failed:', err)
    Object.assign(taskStats.value, DEFAULT_TASK_STATS)
  }
}

const fetchServerInfo = async () => {
  try {
    // 走统一 request 接口，/api/admin-dashboard/server-info 返回 IServer
    const res = await request<IServer>({
      url: '/api/admin-dashboard/server-info',
      method: 'GET',
    })
    const data = pickData(res)
    if (data) {
      serverInfo.value = { ...serverInfo.value, ...data }
    }
  } catch (err) {
    console.error('[dashboard] fetchServerInfo failed:', err)
  }
}

const fetchOperLogs = async () => {
  try {
    const res = await getOperlogPage({ pageNum: 1, pageSize: 10 })
    // 兼容 rows 直接存在或嵌套在 data 下两种契约
    const maybeRows = (res as unknown as { rows?: IOperlog[] }).rows
      ?? (res as unknown as { data?: { rows?: IOperlog[] } }).data?.rows
    if (Array.isArray(maybeRows)) {
      operLogs.value = maybeRows
    }
  } catch (err) {
    console.error('[dashboard] fetchOperLogs failed:', err)
  }
}

// 一次性加载所有仪表盘数据
const loadAll = () => {
  fetchOverview()
  fetchUserGrowth()
  fetchOperationType()
  fetchSystemResource()
  fetchLoginDistribution()
  fetchTaskStats()
  fetchServerInfo()
  fetchOperLogs()
}

onMounted(() => {
  updateDateTime()
  clockTimer = setInterval(updateDateTime, 1000)

  loadAll()

  // 每 30 秒轮询一次"实时性较强"的数据：在线人数 / 系统资源 / 任务统计
  pollingTimer = setInterval(() => {
    if (document.hidden) return
    fetchOverview()
    fetchSystemResource()
    fetchTaskStats()
  }, 30_000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  if (pollingTimer) clearInterval(pollingTimer)
  try {
    abortController.abort()
  } catch {
    /* noop */
  }
})
</script>

<style scoped lang="scss">
// ========== 颜色变量（优先继承 Element Plus 主题变量，便于暗色模式） ==========
$color-primary: var(--el-color-primary, #4a9eff);
$color-success: var(--el-color-success, #67C23A);
$color-warning: var(--el-color-warning, #E6A23C);
$color-danger: var(--el-color-danger, #F56C6C);
$color-text-primary: var(--el-text-color-primary, #303133);
$color-text-regular: var(--el-text-color-regular, #606266);
$color-text-secondary: var(--el-text-color-secondary, #909399);
$color-border-lighter: var(--el-border-color-lighter, #f0f2f5);
$color-fill-light: var(--el-fill-color-light, #fafafa);
$color-fill-blank: var(--el-bg-color, #ffffff);
$shadow-light: var(--el-box-shadow-light, 0 2px 8px rgba(0, 0, 0, 0.04));
$shadow: var(--el-box-shadow, 0 8px 24px rgba(0, 0, 0, 0.08));

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
    background: linear-gradient(135deg, $color-primary 0%, color-mix(in srgb, $color-primary, #fff 30%) 50%, color-mix(in srgb, $color-primary, #fff 55%) 100%);
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
    background: $color-fill-blank;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: $shadow-light;
    transition: all 0.3s;
    overflow: hidden;
    border: 1px solid $color-border-lighter;

    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow;
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
        color: $color-text-primary;
        line-height: 1.2;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: $color-text-secondary;
      }
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      font-size: 13px;

      &.up {
        color: $color-success;
      }

      &.down {
        color: $color-danger;
      }

      .trend-label {
        color: $color-text-secondary;
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }

  // ========== 图表卡片 ==========
  .chart-section {
    margin-bottom: 16px;
  }

  .chart-card {
    background: $color-fill-blank;
    border-radius: 12px;
    padding: 20px;
    height: 360px;
    margin-bottom: 16px;
    box-shadow: $shadow-light;
    border: 1px solid $color-border-lighter;

    @media (max-width: 768px) {
      height: 300px;
      padding: 16px;
    }

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
        color: $color-text-primary;

        .el-icon {
          color: $color-primary;
        }
      }

      .chart-subtitle {
        font-size: 12px;
        color: $color-text-secondary;
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
    background: $color-fill-blank;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: $shadow-light;
    border: 1px solid $color-border-lighter;

    .action-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: 16px;

      .el-icon {
        color: $color-primary;
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
        background: $color-fill-light;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          background: color-mix(in srgb, $color-primary, #fff 85%);
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
          color: $color-text-regular;
          text-align: center;
        }
      }
    }
  }

  // ========== 服务器状态 ==========
  .server-card {
    background: $color-fill-blank;
    border-radius: 12px;
    padding: 20px;
    box-shadow: $shadow-light;
    border: 1px solid $color-border-lighter;

    .server-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: 16px;

      .el-icon {
        color: $color-primary;
      }

      .status-badge {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: normal;

        &.up {
          background: color-mix(in srgb, $color-success, #fff 85%);
          color: $color-success;
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
          color: $color-text-regular;
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
          color: $color-text-primary;
          flex-shrink: 0;
        }
      }
    }
  }

  // ========== 操作日志 ==========
  .log-card {
    background: $color-fill-blank;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
    box-shadow: $shadow-light;
    border: 1px solid $color-border-lighter;

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
        color: $color-text-primary;

        .el-icon {
          color: $color-primary;
        }
      }
    }
  }
}
</style>
