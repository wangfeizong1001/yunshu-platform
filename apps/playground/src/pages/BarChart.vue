<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>柱状图</h1>
      <p>用于比较不同类别数据的数值大小</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本柱状图</h2>
        <p>展示单一数据系列的柱状图</p>
      </div>
      <div class="demo-content">
        <v-chart :option="basicOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>多系列柱状图</h2>
        <p>展示多个数据系列的对比</p>
      </div>
      <div class="demo-content">
        <v-chart :option="multiSeriesOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>堆叠柱状图</h2>
        <p>数据堆叠展示</p>
      </div>
      <div class="demo-content">
        <v-chart :option="stackedOption" class="chart" autoresize />
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
            <span class="prop-label">柱宽</span>
            <el-slider v-model="barWidth" :min="10" :max="100" />
          </div>
          <div class="prop-item">
            <span class="prop-label">渐变填充</span>
            <el-switch v-model="gradient" />
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
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const barWidth = ref(50);
const gradient = ref(false);

const basicOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D', '产品E'] },
  yAxis: { type: 'value' },
  series: [{ name: '销量', type: 'bar', data: [320, 450, 280, 520, 400] }],
}));

const multiSeriesOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额', '成本'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D', '产品E'] },
  yAxis: { type: 'value' },
  series: [
    { name: '销售额', type: 'bar', data: [320, 450, 280, 520, 400] },
    { name: '成本', type: 'bar', data: [200, 280, 180, 320, 250] },
  ],
}));

const stackedOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['线上', '线下'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D', '产品E'] },
  yAxis: { type: 'value' },
  series: [
    { name: '线上', type: 'bar', stack: 'total', data: [180, 250, 150, 300, 220] },
    { name: '线下', type: 'bar', stack: 'total', data: [140, 200, 130, 220, 180] },
  ],
}));

const customOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D', '产品E'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销量',
      type: 'bar',
      barWidth: `${barWidth.value}%`,
      data: [320, 450, 280, 520, 400],
      itemStyle: gradient.value
        ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4a9eff' },
                { offset: 1, color: '#2c7ad6' },
              ],
            },
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
  min-width: 60px;

  .dark & {
    color: #c0c4cc;
  }
}
</style>
