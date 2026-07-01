<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>折线图</h1>
      <p>用于展示数据随时间变化的趋势</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本折线图</h2>
        <p>展示单一数据系列的折线图</p>
      </div>
      <div class="demo-content">
        <v-chart :option="basicOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>多系列折线图</h2>
        <p>展示多个数据系列的对比</p>
      </div>
      <div class="demo-content">
        <v-chart :option="multiSeriesOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带面积填充</h2>
        <p>折线下方区域填充颜色</p>
      </div>
      <div class="demo-content">
        <v-chart :option="areaOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整图表属性</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">平滑曲线</span>
            <el-switch v-model="smooth" />
          </div>
          <div class="prop-item">
            <span class="prop-label">显示面积</span>
            <el-switch v-model="showArea" />
          </div>
          <div class="prop-item">
            <span class="prop-label">显示标记点</span>
            <el-switch v-model="showMarkPoint" />
          </div>
        </div>
        <v-chart :option="customOption" class="chart" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const smooth = ref(true);
const showArea = ref(false);
const showMarkPoint = ref(false);

const basicOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [{ name: '销售额', type: 'line', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] }],
}));

const multiSeriesOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额', '访问量', '订单数'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [
    { name: '销售额', type: 'line', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { name: '访问量', type: 'line', smooth: true, data: [600, 750, 820, 780, 900, 850, 920] },
    { name: '订单数', type: 'line', smooth: true, data: [120, 150, 140, 160, 200, 190, 210] },
  ],
}));

const areaOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(74, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(74, 158, 255, 0)' },
          ],
        },
      },
    },
  ],
}));

const customOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: smooth.value,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      areaStyle: showArea.value
        ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(74, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(74, 158, 255, 0)' },
              ],
            },
          }
        : {},
      markPoint: showMarkPoint.value
        ? {
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
          }
        : {},
    },
  ],
}));
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1000px;
}

.demo-header {
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 8px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 14px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.section-header {
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 13px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-content {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;

  .dark & {
    background: #1a202c;
  }
}

.chart {
  height: 300px;
}

.props-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-label {
  font-size: 14px;
  color: #606266;
  min-width: 80px;

  .dark & {
    color: #c0c4cc;
  }
}
</style>
