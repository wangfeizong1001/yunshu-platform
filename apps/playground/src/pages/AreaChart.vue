<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>面积图</h1>
      <p>填充折线下方区域的图表</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本面积图</h2>
        <p>单系列面积图</p>
      </div>
      <div class="demo-content">
        <v-chart :option="basicOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>多系列面积图</h2>
        <p>多个数据系列的对比展示</p>
      </div>
      <div class="demo-content">
        <v-chart :option="multiSeriesOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>堆叠面积图</h2>
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
            <span class="prop-label">透明度</span>
            <el-slider v-model="opacity" :min="10" :max="100" />
          </div>
          <div class="prop-item">
            <span class="prop-label">平滑曲线</span>
            <el-switch v-model="smooth" />
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

const opacity = ref(30);
const smooth = ref(true);

const basicOption = computed(() => ({
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

const multiSeriesOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额', '访问量'] },
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
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [600, 750, 820, 780, 900, 850, 920],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 193, 7, 0.3)' },
            { offset: 1, color: 'rgba(255, 193, 7, 0)' },
          ],
        },
      },
    },
  ],
}));

const stackedOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['线上', '线下'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '线上',
      type: 'line',
      stack: 'total',
      smooth: true,
      data: [320, 332, 301, 334, 390, 330, 320],
      areaStyle: {},
    },
    {
      name: '线下',
      type: 'line',
      stack: 'total',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310],
      areaStyle: {},
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
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `rgba(74, 158, 255, ${opacity.value / 100})` },
            { offset: 1, color: 'rgba(74, 158, 255, 0)' },
          ],
        },
      },
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
