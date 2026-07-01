<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>环形图</h1>
      <p>空心的饼图，便于展示内部数据</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本环形图</h2>
        <p>空心的饼图展示</p>
      </div>
      <div class="demo-content">
        <v-chart :option="basicOption" class="chart" autoresize />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带中心文字</h2>
        <p>在环形中心显示汇总数据</p>
      </div>
      <div class="demo-content">
        <v-chart :option="centerTextOption" class="chart" autoresize />
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
            <span class="prop-label">内半径</span>
            <el-slider v-model="innerRadius" :min="20" :max="70" />
          </div>
          <div class="prop-item">
            <span class="prop-label">外半径</span>
            <el-slider v-model="outerRadius" :min="50" :max="90" />
          </div>
          <div class="prop-item">
            <span class="prop-label">显示中心文字</span>
            <el-switch v-model="showCenterText" />
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
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

const innerRadius = ref(50);
const outerRadius = ref(75);
const showCenterText = ref(true);

const basicOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['50%', '75%'],
      avoidLabelOverlap: false,
      data: [
        { value: 335, name: '直接访问' },
        { value: 278, name: '邮件营销' },
        { value: 189, name: '联盟广告' },
        { value: 158, name: '搜索引擎' },
        { value: 100, name: '其他' },
      ],
    },
  ],
}));

const centerTextOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['50%', '75%'],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: [
        { value: 335, name: '直接访问' },
        { value: 278, name: '邮件营销' },
        { value: 189, name: '联盟广告' },
        { value: 158, name: '搜索引擎' },
        { value: 100, name: '其他' },
      ],
    },
  ],
}));

const customOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: [`${innerRadius.value}%`, `${outerRadius.value}%`],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: [
        { value: 335, name: '直接访问' },
        { value: 278, name: '邮件营销' },
        { value: 189, name: '联盟广告' },
        { value: 158, name: '搜索引擎' },
        { value: 100, name: '其他' },
      ],
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
