<template>
  <div class="report-view">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <span class="title">{{ reportInfo?.reportName || '报表查看' }}</span>
      </div>
      <div class="toolbar-right">
        <el-dropdown @command="handleExport">
          <el-button type="primary" :icon="Download">
            导出
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="excel">导出 Excel</el-dropdown-item>
              <el-dropdown-item command="pdf">导出 PDF</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content" ref="reportRef">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-empty description="加载失败">
          <el-button type="primary" @click="handleRefresh">重试</el-button>
        </el-empty>
      </div>

      <!-- 报表内容 -->
      <div v-else class="report-content">
        <!-- 报表头部 -->
        <div class="report-header">
          <h1 class="report-title">{{ reportConfig.title || reportInfo?.reportName }}</h1>
          <p v-if="reportConfig.description" class="report-description">
            {{ reportConfig.description }}
          </p>
          <div class="report-meta">
            <span>创建时间: {{ formatTime(reportInfo?.createTime) }}</span>
            <span>更新时间: {{ formatTime(reportInfo?.updateTime) }}</span>
          </div>
        </div>

        <!-- 图表展示 -->
        <div v-if="reportType === 'chart'" class="chart-wrapper">
          <div ref="chartRef" class="chart-container"></div>
        </div>

        <!-- 表格展示 -->
        <div v-else class="table-wrapper">
          <el-table :data="tableData" stripe border style="width: 100%">
            <el-table-column
              v-for="column in reportConfig.columns"
              :key="column.field"
              :prop="column.field"
              :label="column.title"
              :width="column.width"
            />
          </el-table>
        </div>

        <!-- 数据明细 -->
        <div v-if="showDataDetail" class="data-detail">
          <div class="detail-header">
            <h3>数据明细</h3>
          </div>
          <el-table :data="reportConfig.data" stripe border style="width: 100%" max-height="400">
            <el-table-column
              v-for="(field, index) in dataFields"
              :key="index"
              :prop="field"
              :label="field"
              show-overflow-tooltip
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download, Refresh, ArrowDown } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import { getReport } from '@/api/report.api'
import type { ReportInfo } from '@/api/report.api'
import { exportToExcel, exportToPDF } from '@/utils/export'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(true)
const error = ref(false)
const reportId = ref<number>()
const reportInfo = ref<unknown>(null)
const reportType = ref<'chart' | 'table'>('chart')
const chartRef = ref<HTMLElement>()
const reportRef = ref<HTMLElement>()
const showDataDetail = ref(true)
let chartInstance: echarts.ECharts | null = null

// 报表列配置
interface ReportColumn {
  field: string
  title: string
  width?: string | number
}

// 报表配置
const reportConfig = reactive({
  title: '',
  description: '',
  chartType: 'line',
  xAxis: '',
  yAxis: '',
  showLegend: true,
  showToolbox: true,
  columns: [] as ReportColumn[],
  data: [] as Record<string, unknown>[]
})

// 表格数据
const tableData = computed(() => reportConfig.data)

// 数据字段
const dataFields = computed(() => {
  if (reportConfig.data.length > 0) {
    return Object.keys(reportConfig.data[0])
  }
  return []
})

// 返回
function handleBack() {
  router.push('/report/list')
}

// 刷新
function handleRefresh() {
  loadReport()
}

// 格式化时间
function formatTime(time: string | undefined) {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 渲染图表
function renderChart() {
  if (!chartRef.value) return
  
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  
  let option: EChartsOption = {}
  
  if (reportConfig.data.length === 0) {
    option = {
      title: { 
        text: '暂无数据', 
        left: 'center',
        top: 'center'
      }
    }
  } else {
    const xAxisData = reportConfig.data.map(item => item[reportConfig.xAxis])
    const seriesData = reportConfig.data.map(item => item[reportConfig.yAxis])
    
    option = {
      title: {
        text: reportConfig.title,
        left: 'center'
      },
      tooltip: {
        trigger: reportConfig.chartType === 'pie' ? 'item' : 'axis'
      },
      legend: {
        show: reportConfig.showLegend,
        data: [reportConfig.yAxis],
        bottom: 0
      },
      toolbox: {
        show: reportConfig.showToolbox,
        feature: {
          saveAsImage: {}
        },
        right: 20
      },
      xAxis:
        reportConfig.chartType === 'pie'
          ? undefined
          : {
              type: 'category',
              data: xAxisData,
              name: reportConfig.xAxis,
              axisLabel: {
                rotate: xAxisData.length > 8 ? 45 : 0
              }
            },
      yAxis:
        reportConfig.chartType === 'pie'
          ? undefined
          : {
              type: 'value',
              name: reportConfig.yAxis
            },
      grid: {
        left: '3%',
        right: '4%',
        bottom: reportConfig.showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true
      },
      series: [
        {
          name: reportConfig.yAxis,
          type: reportConfig.chartType as string,
          data:
            reportConfig.chartType === 'pie'
              ? reportConfig.data.map(item => ({
                  name: item[reportConfig.xAxis],
                  value: item[reportConfig.yAxis]
                }))
              : seriesData,
          areaStyle: reportConfig.chartType === 'area' ? {} : undefined,
          smooth: reportConfig.chartType === 'line' || reportConfig.chartType === 'area'
        }
      ]
    }
  }
  
  chartInstance.setOption(option, true)
}

// 导出
async function handleExport(type: string) {
  try {
    if (type === 'excel') {
      if (reportConfig.data.length === 0) {
        ElMessage.warning('暂无数据可导出')
        return
      }
      exportToExcel(reportConfig.data, reportConfig.title || 'report')
      ElMessage.success('导出成功')
    } else if (type === 'pdf') {
      if (!reportRef.value) return
      await exportToPDF(reportRef.value, reportConfig.title || 'report')
      ElMessage.success('导出成功')
    }
  } catch (error) {
    ElMessage.error('导出失败')
    console.error('导出失败:', error)
  }
}

// 加载报表数据
async function loadReport() {
  const id = route.params.id as string
  if (!id) return
  
  reportId.value = parseInt(id)
  loading.value = true
  error.value = false
  
  try {
    // 获取报表信息
    const res = await getReport(reportId.value) as { data: ReportInfo }
    reportInfo.value = res.data
    reportType.value = res.data.reportType as 'chart' | 'table'
    
    // 解析配置
    if (res.data.config) {
      try {
        const config = JSON.parse(res.data.config) as ReportColumn[]
        reportConfig.columns = config
      } catch (e) {
        console.error('解析配置失败:', e)
      }
    }
    
    // 等待DOM更新后渲染
    await nextTick()
    
    if (reportType.value === 'chart') {
      renderChart()
    }
  } catch (err) {
    error.value = true
    ElMessage.error('加载报表失败')
    console.error('加载报表失败:', err)
  } finally {
    loading.value = false
  }
}

// 窗口大小变化时重绘图表
onMounted(() => {
  loadReport()
  
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped lang="scss">
.report-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-fill-color-light);

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    position: sticky;
    top: 0;
    z-index: 100;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .main-content {
    flex: 1;
    padding: 20px;

    .loading-container,
    .error-container {
      background-color: var(--el-bg-color);
      padding: 40px;
      border-radius: 4px;
    }

    .report-content {
      background-color: var(--el-bg-color);
      padding: 40px;
      border-radius: 4px;
      max-width: 1400px;
      margin: 0 auto;

      .report-header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--el-fill-color-light);

        .report-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--el-text-color-primary);
          margin: 0 0 12px 0;
        }

        .report-description {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin: 0 0 16px 0;
        }

        .report-meta {
          display: flex;
          justify-content: center;
          gap: 32px;
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }

      .chart-wrapper {
        margin-bottom: 40px;

        .chart-container {
          width: 100%;
          height: 500px;
        }
      }

      .table-wrapper {
        margin-bottom: 40px;
      }

      .data-detail {
        border-top: 1px solid var(--el-fill-color-light);
        padding-top: 24px;

        .detail-header {
          margin-bottom: 16px;

          h3 {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
