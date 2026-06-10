<template>
  <div class="report-design">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <span class="title">{{ reportInfo?.reportName || '报表设计' }}</span>
      </div>
      <div class="toolbar-right">
        <el-button :icon="View" @click="handlePreview">预览</el-button>
        <el-button type="primary" :icon="Check" @click="handleSave">保存</el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧配置面板 -->
      <div class="left-panel">
        <el-tabs v-model="activeTab">
          <!-- 基础配置 -->
          <el-tab-pane label="基础配置" name="basic">
            <el-form label-width="100px">
              <el-form-item label="报表标题">
                <el-input v-model="reportConfig.title" placeholder="请输入报表标题" />
              </el-form-item>
              <el-form-item label="报表类型">
                <el-radio-group v-model="reportType">
                  <el-radio value="chart">图表</el-radio>
                  <el-radio value="table">表格</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  v-model="reportConfig.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 图表配置 -->
          <el-tab-pane label="图表配置" name="chart" v-if="reportType === 'chart'">
            <el-form label-width="100px">
              <el-form-item label="图表类型">
                <el-select v-model="chartConfig.type" placeholder="请选择图表类型">
                  <el-option label="折线图" value="line" />
                  <el-option label="柱状图" value="bar" />
                  <el-option label="饼图" value="pie" />
                  <el-option label="环形图" value="doughnut" />
                  <el-option label="面积图" value="area" />
                </el-select>
              </el-form-item>
              <el-form-item label="X轴字段">
                <el-select v-model="chartConfig.xAxis" placeholder="请选择X轴字段" clearable>
                  <el-option
                    v-for="field in availableFields"
                    :key="field"
                    :label="field"
                    :value="field"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Y轴字段">
                <el-select v-model="chartConfig.yAxis" placeholder="请选择Y轴字段" clearable>
                  <el-option
                    v-for="field in availableFields"
                    :key="field"
                    :label="field"
                    :value="field"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="显示图例">
                <el-switch v-model="chartConfig.showLegend" />
              </el-form-item>
              <el-form-item label="显示工具栏">
                <el-switch v-model="chartConfig.showToolbox" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 表格配置 -->
          <el-tab-pane label="表格配置" name="table" v-if="reportType === 'table'">
            <el-form label-width="100px">
              <el-form-item label="表格列配置">
                <el-button type="primary" size="small" :icon="Plus" @click="addTableColumn">
                  添加列
                </el-button>
              </el-form-item>
              <div class="column-list">
                <div
                  v-for="(column, index) in tableConfig.columns"
                  :key="index"
                  class="column-item"
                >
                  <el-input
                    v-model="column.title"
                    placeholder="列标题"
                    style="width: 120px; margin-right: 8px"
                  />
                  <el-input
                    v-model="column.field"
                    placeholder="字段名"
                    style="width: 120px; margin-right: 8px"
                  />
                  <el-input-number
                    v-model="column.width"
                    :min="50"
                    :max="500"
                    size="small"
                    style="width: 100px; margin-right: 8px"
                    placeholder="宽度"
                  />
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    circle
                    @click="removeTableColumn(index)"
                  />
                </div>
              </div>
            </el-form>
          </el-tab-pane>

          <!-- 数据配置 -->
          <el-tab-pane label="数据配置" name="data">
            <div class="data-config">
              <div class="data-header">
                <span>示例数据</span>
                <el-button type="primary" size="small" :icon="Upload">导入数据</el-button>
              </div>
              <div class="data-editor">
                <textarea v-model="dataJson" placeholder="请输入JSON格式的数据" />
              </div>
              <el-button type="primary" size="small" @click="parseData">解析数据</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧预览区 -->
      <div class="right-panel">
        <div class="preview-header">
          <span>实时预览</span>
        </div>
        <div class="preview-content" ref="previewRef">
          <!-- 图表预览 -->
          <div v-if="reportType === 'chart'" class="chart-container" ref="chartRef"></div>

          <!-- 表格预览 -->
          <div v-else class="table-container">
            <el-table :data="previewData" stripe border style="width: 100%">
              <el-table-column
                v-for="column in tableConfig.columns"
                :key="column.field"
                :prop="column.field"
                :label="column.title"
                :width="column.width"
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="报表预览" width="80%" top="5vh">
      <div class="preview-dialog">
        <div ref="previewDialogRef"></div>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleExportPreview">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { ArrowLeft, View, Check, Plus, Delete, Upload } from '@element-plus/icons-vue';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';
  import { getReport, updateReport, type ReportForm } from '@/api/report.api';
  import { exportToPDF } from '@/utils/export';

  const router = useRouter();
  const route = useRoute();

  // 状态
  const loading = ref(false);
  const saving = ref(false);
  const reportId = ref<number>();
  const reportInfo = ref<any>(null);
  const activeTab = ref('basic');
  const previewDialogVisible = ref(false);
  const chartRef = ref<HTMLElement>();
  const previewRef = ref<HTMLElement>();
  const previewDialogRef = ref<HTMLElement>();
  let chartInstance: echarts.ECharts | null = null;

  // 报表类型
  const reportType = ref<'chart' | 'table'>('chart');

  // 报表配置
  const reportConfig = reactive({
    title: '',
    description: '',
  });

  // 图表配置
  const chartConfig = reactive({
    type: 'line',
    xAxis: '',
    yAxis: '',
    showLegend: true,
    showToolbox: true,
  });

  // 表格配置
  const tableConfig = reactive({
    columns: [
      { title: '名称', field: 'name', width: 150 },
      { title: '数值', field: 'value', width: 150 },
    ],
  });

  // 数据
  const rawData = ref<any[]>([]);
  const dataJson = ref('');
  const previewData = ref<any[]>([]);

  // 可用字段
  const availableFields = ref<string[]>([]);

  // 返回
  function handleBack() {
    router.push('/report/list');
  }

  // 解析数据
  function parseData() {
    try {
      if (!dataJson.value.trim()) {
        ElMessage.warning('请输入数据');
        return;
      }

      const parsed = JSON.parse(dataJson.value);
      if (!Array.isArray(parsed)) {
        ElMessage.error('数据必须是数组格式');
        return;
      }

      rawData.value = parsed;
      previewData.value = parsed;

      // 提取字段
      if (parsed.length > 0) {
        availableFields.value = Object.keys(parsed[0]);
        if (!chartConfig.xAxis && availableFields.value.length > 0) {
          chartConfig.xAxis = availableFields.value[0];
        }
        if (!chartConfig.yAxis && availableFields.value.length > 1) {
          chartConfig.yAxis = availableFields.value[1];
        }
      }

      ElMessage.success('数据解析成功');
      updateChart();
    } catch (error) {
      ElMessage.error('数据格式错误，请检查JSON格式');
      console.error('解析数据失败:', error);
    }
  }

  // 添加表格列
  function addTableColumn() {
    tableConfig.columns.push({
      title: `列${tableConfig.columns.length + 1}`,
      field: `field${tableConfig.columns.length + 1}`,
      width: 150,
    });
  }

  // 删除表格列
  function removeTableColumn(index: number) {
    tableConfig.columns.splice(index, 1);
  }

  // 更新图表
  function updateChart() {
    if (!chartRef.value) return;

    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value);
    }

    let option: EChartsOption = {};

    if (rawData.value.length === 0) {
      option = {
        title: { text: reportConfig.title || '暂无数据' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [],
      };
    } else {
      const xAxisData = rawData.value.map((item) => item[chartConfig.xAxis]);
      const seriesData = rawData.value.map((item) => item[chartConfig.yAxis]);

      option = {
        title: {
          text: reportConfig.title,
        },
        tooltip: {
          trigger: chartConfig.type === 'pie' ? 'item' : 'axis',
        },
        legend: {
          show: chartConfig.showLegend,
          data: [chartConfig.yAxis],
        },
        toolbox: {
          show: chartConfig.showToolbox,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis:
          chartConfig.type === 'pie'
            ? undefined
            : {
                type: 'category',
                data: xAxisData,
                name: chartConfig.xAxis,
              },
        yAxis:
          chartConfig.type === 'pie'
            ? undefined
            : {
                type: 'value',
                name: chartConfig.yAxis,
              },
        series: [
          {
            name: chartConfig.yAxis,
            type: chartConfig.type as any,
            data:
              chartConfig.type === 'pie'
                ? rawData.value.map((item) => ({
                    name: item[chartConfig.xAxis],
                    value: item[chartConfig.yAxis],
                  }))
                : seriesData,
            areaStyle: chartConfig.type === 'area' ? {} : undefined,
          },
        ],
      };
    }

    chartInstance.setOption(option, true);
  }

  // 预览
  function handlePreview() {
    previewDialogVisible.value = true;

    nextTick(() => {
      if (reportType.value === 'chart' && previewDialogRef.value) {
        const previewChart = echarts.init(previewDialogRef.value);
        previewChart.setOption(chartInstance?.getOption() || {});

        // 窗口大小变化时重绘
        const resizeObserver = new ResizeObserver(() => {
          previewChart.resize();
        });
        resizeObserver.observe(previewDialogRef.value);
      }
    });
  }

  // 导出预览
  async function handleExportPreview() {
    if (!previewRef.value) return;

    try {
      await exportToPDF(previewRef.value, reportConfig.title || 'report');
      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error('导出失败:', error);
    }
  }

  // 保存
  async function handleSave() {
    if (!reportId.value) return;

    saving.value = true;
    try {
      const config = {
        title: reportConfig.title,
        description: reportConfig.description,
        chartType: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        showLegend: chartConfig.showLegend,
        showToolbox: chartConfig.showToolbox,
        columns: tableConfig.columns,
        data: rawData.value,
      };

      const updateData: ReportForm = {
        reportId: reportId.value,
        reportName: reportConfig.title || reportInfo.value?.reportName,
        reportType: reportType.value,
        description: reportConfig.description,
        config: JSON.stringify(config),
        status: reportInfo.value?.status,
      };

      await updateReport(updateData);
      ElMessage.success('保存成功');
    } catch (error) {
      ElMessage.error('保存失败');
      console.error('保存失败:', error);
    } finally {
      saving.value = false;
    }
  }

  // 加载报表数据
  async function loadReport() {
    const id = route.params.id as string;
    if (!id) return;

    reportId.value = parseInt(id);

    loading.value = true;
    try {
      const res = (await getReport(reportId.value)) as any;
      reportInfo.value = res.data;

      // 设置基础信息
      reportConfig.title = res.data.reportName;
      reportConfig.description = res.data.description;
      reportType.value = res.data.reportType as 'chart' | 'table';

      // 解析配置
      if (res.data.config) {
        try {
          const config = JSON.parse(res.data.config);
          if (config.title) reportConfig.title = config.title;
          if (config.description) reportConfig.description = config.description;
          if (config.chartType) chartConfig.type = config.chartType;
          if (config.xAxis) chartConfig.xAxis = config.xAxis;
          if (config.yAxis) chartConfig.yAxis = config.yAxis;
          if (config.showLegend !== undefined) chartConfig.showLegend = config.showLegend;
          if (config.showToolbox !== undefined) chartConfig.showToolbox = config.showToolbox;
          if (config.columns) tableConfig.columns = config.columns;
          if (config.data) {
            rawData.value = config.data;
            previewData.value = config.data;
            dataJson.value = JSON.stringify(config.data, null, 2);

            if (config.data.length > 0) {
              availableFields.value = Object.keys(config.data[0]);
            }
          }
        } catch (e) {
          console.error('解析配置失败:', e);
        }
      }

      // 等待DOM更新后渲染图表
      nextTick(() => {
        updateChart();
      });
    } catch (error) {
      ElMessage.error('加载报表失败');
      console.error('加载报表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 监听配置变化
  watch(
    [reportType, () => chartConfig.type, () => chartConfig.xAxis, () => chartConfig.yAxis],
    () => {
      if (reportType.value === 'chart') {
        updateChart();
      }
    },
  );

  // 窗口大小变化时重绘图表
  function handleResize() {
    chartInstance?.resize();
  }

  onMounted(() => {
    loadReport();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  });
</script>

<style scoped lang="scss">
  .report-design {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background-color: #fff;
      border-bottom: 1px solid #e4e7ed;

      .toolbar-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }
    }

    .main-content {
      flex: 1;
      display: flex;
      gap: 16px;
      padding: 16px;
      overflow: hidden;

      .left-panel {
        width: 400px;
        background-color: #fff;
        border-radius: 4px;
        overflow-y: auto;

        :deep(.el-tabs__content) {
          padding: 16px;
        }

        .column-list {
          .column-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
        }

        .data-config {
          .data-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .data-editor {
            textarea {
              width: 100%;
              height: 300px;
              padding: 12px;
              border: 1px solid #dcdfe6;
              border-radius: 4px;
              resize: none;
              font-family: monospace;
              font-size: 13px;

              &:focus {
                outline: none;
                border-color: #409eff;
              }
            }
          }
        }
      }

      .right-panel {
        flex: 1;
        background-color: #fff;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .preview-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e4e7ed;
          font-weight: 600;
          color: #303133;
        }

        .preview-content {
          flex: 1;
          padding: 20px;
          overflow: auto;

          .chart-container {
            width: 100%;
            height: 100%;
            min-height: 400px;
          }

          .table-container {
            width: 100%;
          }
        }
      }
    }
  }

  .preview-dialog {
    min-height: 500px;

    div {
      width: 100%;
      height: 500px;
    }
  }
</style>
