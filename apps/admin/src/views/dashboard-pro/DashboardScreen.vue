<template>
  <div class="dashboard-screen" :class="{ 'fullscreen': isFullscreen }">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">企业运营监控大屏</h1>
        <div class="current-time">{{ currentTime }}</div>
      </div>
      <div class="header-right">
        <el-button class="refresh-btn" :icon="Refresh" @click="refreshData" circle />
        <el-button class="fullscreen-btn" :icon="FullScreen" @click="toggleFullscreen" circle />
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="dashboard-body">
      <!-- 左侧面板 -->
      <div class="panel left-panel">
        <!-- 销售趋势图 -->
        <div class="chart-card">
          <div class="chart-title">销售趋势</div>
          <v-chart class="chart" :option="salesTrendOption" autoresize />
        </div>
        <!-- 订单统计 -->
        <div class="chart-card">
          <div class="chart-title">订单统计</div>
          <v-chart class="chart" :option="orderStatsOption" autoresize />
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="panel center-panel">
        <!-- 核心指标 -->
        <div class="metrics-row">
          <div class="metric-item" v-for="(metric, index) in metrics" :key="index">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-trend" :class="metric.trend > 0 ? 'up' : 'down'">
              <el-icon><ArrowDown /></el-icon>
              <span>{{ Math.abs(metric.trend) }}%</span>
            </div>
          </div>
        </div>
        <!-- 地图 -->
        <div class="chart-card map-card">
          <div class="chart-title">区域销售分布</div>
          <v-chart class="chart" :option="mapOption" autoresize />
        </div>
        <!-- 实时数据 -->
        <div class="realtime-data">
          <div class="realtime-title">实时数据</div>
          <div class="realtime-items">
            <div class="realtime-item">
              <span class="realtime-label">当前订单:</span>
              <span class="realtime-value">{{ realtimeData.currentOrders }}</span>
            </div>
            <div class="realtime-item">
              <span class="realtime-label">在线用户:</span>
              <span class="realtime-value">{{ realtimeData.currentUsers }}</span>
            </div>
            <div class="realtime-item">
              <span class="realtime-label">实时营收:</span>
              <span class="realtime-value">¥{{ realtimeData.currentRevenue }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel right-panel">
        <!-- 分类占比 -->
        <div class="chart-card">
          <div class="chart-title">分类占比</div>
          <v-chart class="chart" :option="categoryOption" autoresize />
        </div>
        <!-- 用户增长 -->
        <div class="chart-card">
          <div class="chart-title">用户增长</div>
          <v-chart class="chart" :option="userGrowthOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent
} from 'echarts/components'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  FullScreen,
  ArrowDown
} from '@element-plus/icons-vue'
import {
  getDashboardStats,
  getSalesTrendData,
  getRegionSalesData,
  getCategoryData,
  getRealTimeData
} from '@/api/dashboard.api'
import type {
  DashboardStats,
  SalesTrendData,
  RegionSalesData,
  CategoryData
} from '@/api/dashboard.api'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent
])

// ===== 大屏深色主题色板（集中定义，便于维护和主题切换）=====
const DASHBOARD_COLORS = {
  cyan: '#00d4ff',
  gold: '#ffd700',
  green: '#00ff88',
  red: '#ff6b6b',
  purple: '#a855f7',
  darkBlue: '#0066ff',
  bgPrimary: '#0a0e27',
  bgSecondary: '#1a1f3a',
  text: '#ffffff',
} as const

const CATEGORY_COLORS = [
  DASHBOARD_COLORS.cyan,
  DASHBOARD_COLORS.gold,
  DASHBOARD_COLORS.green,
  DASHBOARD_COLORS.red,
  DASHBOARD_COLORS.purple,
]

const isFullscreen = ref(false)
const currentTime = ref('')
const realtimeData = ref({
  currentOrders: 0,
  currentUsers: 0,
  currentRevenue: 0
})

const stats = ref<DashboardStats | null>(null)
const salesTrendData = ref<SalesTrendData[]>([])
const regionSalesData = ref<RegionSalesData[]>([])
const categoryData = ref<CategoryData[]>([])

let timeInterval: ReturnType<typeof setInterval> | null = null
let realtimeInterval: ReturnType<typeof setInterval> | null = null

const metrics = computed(() => {
  if (!stats.value) return []
  return [
    { label: '总用户数', value: stats.value.totalUsers.toLocaleString(), trend: stats.value.userGrowthRate },
    { label: '活跃用户', value: stats.value.activeUsers.toLocaleString(), trend: 8.5 },
    { label: '总订单数', value: stats.value.totalOrders.toLocaleString(), trend: stats.value.orderGrowthRate },
    { label: '总营收', value: `¥${stats.value.totalRevenue.toLocaleString()}`, trend: stats.value.revenueGrowthRate }
  ]
})

const salesTrendOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesTrendData.value.map(d => d.date),
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.map(d => d.sales),
        itemStyle: { color: DASHBOARD_COLORS.cyan },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 212, 255, 0)' }
            ]
          }
        }
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.map(d => d.orders),
        itemStyle: { color: DASHBOARD_COLORS.gold },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 215, 0, 0)' }
            ]
          }
        }
      }
    ]
  }
})

const orderStatsOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: salesTrendData.value.slice(-6).map(d => d.date),
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } }
    },
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: salesTrendData.value.slice(-6).map(d => d.orders),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: DASHBOARD_COLORS.cyan },
              { offset: 1, color: DASHBOARD_COLORS.darkBlue }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
})

const mapOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c}'
    },
    visualMap: {
      min: 0,
      max: 150000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: [DASHBOARD_COLORS.darkBlue, DASHBOARD_COLORS.cyan, DASHBOARD_COLORS.green]
      },
      textStyle: {
        color: DASHBOARD_COLORS.text
      }
    },
    geo: {
      map: 'china',
      roam: true,
      label: {
        show: true,
        color: DASHBOARD_COLORS.text
      },
      itemStyle: {
        areaColor: 'rgba(0, 102, 255, 0.2)',
        borderColor: DASHBOARD_COLORS.cyan
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(0, 212, 255, 0.5)'
        },
        label: {
          color: DASHBOARD_COLORS.text
        }
      }
    },
    series: [
      {
        name: '销售额',
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: regionSalesData.value.map(d => ({ name: d.name, value: d.value }))
      }
    ]
  }
})

const categoryOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: DASHBOARD_COLORS.text }
    },
    series: [
      {
        name: '分类占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: DASHBOARD_COLORS.bgPrimary,
          borderWidth: 2
        },
        label: {
          show: true,
          color: DASHBOARD_COLORS.text
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: categoryData.value.map((d, index) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: CATEGORY_COLORS[index] }
        }))
      }
    ]
  }
})

const userGrowthOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesTrendData.value.slice(-6).map(d => d.date),
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: DASHBOARD_COLORS.cyan } },
      axisLabel: { color: DASHBOARD_COLORS.text },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } }
    },
    series: [
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        data: salesTrendData.value.slice(-6).map(d => d.visitors),
        itemStyle: { color: DASHBOARD_COLORS.green },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
              { offset: 1, color: 'rgba(0, 255, 136, 0)' }
            ]
          }
        }
      }
    ]
  }
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long'
  })
}

const fetchStats = async () => {
  try {
    const res = await getDashboardStats()
    const responseData = res as Record<string, unknown>
    if (responseData.data) {
      stats.value = responseData.data as typeof stats.value
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchSalesTrend = async () => {
  try {
    const res = await getSalesTrendData()
    const responseData = res as Record<string, unknown>
    if (responseData.data) {
      salesTrendData.value = responseData.data as typeof salesTrendData.value
    }
  } catch (error) {
    console.error('获取销售趋势数据失败:', error)
  }
}

const fetchRegionSales = async () => {
  try {
    const res = await getRegionSalesData()
    const responseData = res as Record<string, unknown>
    if (responseData.data) {
      regionSalesData.value = responseData.data as typeof regionSalesData.value
    }
  } catch (error) {
    console.error('获取区域销售数据失败:', error)
  }
}

const fetchCategoryData = async () => {
  try {
    const res = await getCategoryData()
    const responseData = res as Record<string, unknown>
    if (responseData.data) {
      categoryData.value = responseData.data as typeof categoryData.value
    }
  } catch (error) {
    console.error('获取分类数据失败:', error)
  }
}

const fetchRealtimeData = async () => {
  try {
    const res = await getRealTimeData()
    const responseData = res as Record<string, unknown>
    const data = responseData.data as Record<string, unknown> | undefined
    if (data?.data) {
      realtimeData.value = data.data as typeof realtimeData.value
    }
  } catch (error) {
    console.error('获取实时数据失败:', error)
  }
}

const refreshData = () => {
  fetchStats()
  fetchSalesTrend()
  fetchRegionSales()
  fetchCategoryData()
  ElMessage.success('数据已刷新')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  realtimeInterval = setInterval(fetchRealtimeData, 3000)

  fetchStats()
  fetchSalesTrend()
  fetchRegionSales()
  fetchCategoryData()
  fetchRealtimeData()
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (realtimeInterval) clearInterval(realtimeInterval)
})
</script>

<style scoped lang="scss">
// ===== 大屏深色主题变量（局部作用域，不污染全局）=====
$dash-cyan: #00d4ff;
$dash-gold: #ffd700;
$dash-green: #00ff88;
$dash-red: #ff6b6b;
$dash-dark-blue: #0066ff;
$dash-bg-primary: #0a0e27;
$dash-bg-secondary: #1a1f3a;
$dash-text: #ffffff;
// 透明色派生
$dash-cyan-05: rgba(0, 212, 255, 0.05);
$dash-cyan-10: rgba(0, 212, 255, 0.1);
$dash-cyan-20: rgba(0, 212, 255, 0.2);
$dash-cyan-30: rgba(0, 212, 255, 0.3);
$dash-cyan-50: rgba(0, 212, 255, 0.5);
$dash-dark-blue-10: rgba(0, 102, 255, 0.1);
$dash-dark-blue-20: rgba(0, 102, 255, 0.2);

.dashboard-screen {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, $dash-bg-primary 0%, $dash-bg-secondary 50%, $dash-bg-primary 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  &.fullscreen {
    padding: 10px;
  }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 25px;
  background: linear-gradient(90deg, $dash-dark-blue-10 0%, $dash-cyan-10 50%, $dash-dark-blue-10 100%);
  border: 1px solid $dash-cyan-20;
  border-radius: 8px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 30px;

    .dashboard-title {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      color: $dash-cyan;
      text-shadow: 0 0 10px $dash-cyan-50;
    }

    .current-time {
      font-size: 16px;
      color: $dash-text;
      opacity: 0.8;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;

    .refresh-btn,
    .fullscreen-btn {
      width: 40px;
      height: 40px;
      background: $dash-cyan-10;
      border: 1px solid $dash-cyan-30;
      color: $dash-cyan;

      &:hover {
        background: $dash-cyan-20;
        border-color: $dash-cyan-50;
      }
    }
  }
}

.dashboard-body {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
  height: calc(100vh - 120px);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  flex: 1;
  background: $dash-cyan-05;
  border: 1px solid $dash-cyan-20;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;

  .chart-title {
    font-size: 16px;
    font-weight: bold;
    color: $dash-cyan;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid $dash-cyan-20;
  }

  .chart {
    flex: 1;
    min-height: 0;
  }
}

.map-card {
  flex: 2;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .metric-item {
    background: $dash-cyan-10;
    border: 1px solid $dash-cyan-20;
    border-radius: 8px;
    padding: 20px;
    text-align: center;

    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: $dash-cyan;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 14px;
      color: $dash-text;
      opacity: 0.8;
      margin-bottom: 8px;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 14px;

      &.up {
        color: $dash-green;
      }

      &.down {
        color: $dash-red;
      }
    }
  }
}

.realtime-data {
  background: $dash-cyan-05;
  border: 1px solid $dash-cyan-20;
  border-radius: 8px;
  padding: 15px;

  .realtime-title {
    font-size: 16px;
    font-weight: bold;
    color: $dash-cyan;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid $dash-cyan-20;
  }

  .realtime-items {
    display: flex;
    justify-content: space-around;

    .realtime-item {
      text-align: center;

      .realtime-label {
        display: block;
        font-size: 14px;
        color: $dash-text;
        opacity: 0.8;
        margin-bottom: 8px;
      }

      .realtime-value {
        font-size: 24px;
        font-weight: bold;
        color: $dash-gold;
      }
    }
  }
}
</style>
