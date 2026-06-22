<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>仪表盘</h1>
      <p>用于展示单一指标的进度</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本仪表盘</h2>
        <p>展示单一指标的仪表盘</p>
      </div>
      <div class="demo-content">
        <v-chart :option="basicOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>多指针仪表盘</h2>
        <p>展示多个指标对比</p>
      </div>
      <div class="demo-content">
        <v-chart :option="multiPointerOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>分段仪表盘</h2>
        <p>不同区间显示不同颜色</p>
      </div>
      <div class="demo-content">
        <v-chart :option="segmentOption" class="chart" autoresize />
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
            <span class="prop-label">数值</span>
            <el-slider v-model="gaugeValue" :min="0" :max="100" />
          </div>
          <div class="prop-item">
            <span class="prop-label">起始角度</span>
            <el-slider v-model="startAngle" :min="0" :max="360" />
          </div>
          <div class="prop-item">
            <span class="prop-label">结束角度</span>
            <el-slider v-model="endAngle" :min="0" :max="360" />
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
import { GaugeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent]);

const gaugeValue = ref(75);
const startAngle = ref(200);
const endAngle = ref(-20);

const basicOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      radius: '75%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: { lineStyle: { width: 12, color: [[1, '#4a9eff']] } },
      pointer: { length: '60%', itemStyle: { color: '#4a9eff' } },
      axisTick: { distance: -12, length: 4, lineStyle: { color: '#fff', width: 2 } },
      splitLine: { distance: -20, length: 10, lineStyle: { color: '#fff', width: 3 } },
      axisLabel: { color: '#999', distance: 20, fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}%', color: '#303133' },
      data: [{ value: 75, name: '完成率' }],
    },
  ],
}));

const multiPointerOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      radius: '75%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: { lineStyle: { width: 12, color: [[0.3, '#67c23a'], [0.7, '#4a9eff'], [1, '#f56c6c']] } },
      pointer: [{ length: '50%', itemStyle: { color: '#4a9eff' } }, { length: '70%', itemStyle: { color: '#67c23a' } }],
      axisTick: { distance: -12, length: 4, lineStyle: { color: '#fff', width: 2 } },
      splitLine: { distance: -20, length: 10, lineStyle: { color: '#fff', width: 3 } },
      axisLabel: { color: '#999', distance: 20, fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}%', color: '#303133' },
      data: [{ value: 75, name: '当前' }, { value: 60, name: '目标' }],
    },
  ],
}));

const segmentOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      radius: '75%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.3, '#67c23a'],
            [0.7, '#e6a23c'],
            [1, '#f56c6c'],
          ],
        },
      },
      pointer: { length: '60%', itemStyle: { color: '#f56c6c' } },
      axisTick: { distance: -12, length: 4, lineStyle: { color: '#fff', width: 2 } },
      splitLine: { distance: -20, length: 10, lineStyle: { color: '#fff', width: 3 } },
      axisLabel: { color: '#999', distance: 20, fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}%', color: '#303133' },
      data: [{ value: 85, name: '使用率' }],
    },
  ],
}));

const customOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      radius: '75%',
      startAngle: startAngle.value,
      endAngle: endAngle.value,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: { lineStyle: { width: 12, color: [[1, '#4a9eff']] } },
      pointer: { length: '60%', itemStyle: { color: '#4a9eff' } },
      axisTick: { distance: -12, length: 4, lineStyle: { color: '#fff', width: 2 } },
      splitLine: { distance: -20, length: 10, lineStyle: { color: '#fff', width: 3 } },
      axisLabel: { color: '#999', distance: 20, fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}%', color: '#303133' },
      data: [{ value: gaugeValue.value, name: '完成率' }],
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
