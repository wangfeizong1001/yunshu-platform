<template>
  <div class="page-container">
    <div class="page-header">
      <h1>图表组件</h1>
      <p>基于 ECharts 的数据可视化组件</p>
    </div>
    <div class="component-grid">
      <router-link to="/line-chart" class="component-card">
        <div class="card-icon">
          <PieChart />
        </div>
        <div class="card-title">折线图</div>
        <div class="card-desc">用于展示数据随时间变化的趋势</div>
      </router-link>
      <router-link to="/bar-chart" class="component-card">
        <div class="card-icon">
          <PieChart />
        </div>
        <div class="card-title">柱状图</div>
        <div class="card-desc">用于比较不同类别数据的数值大小</div>
      </router-link>
      <router-link to="/pie-chart" class="component-card">
        <div class="card-icon">
          <PieChart />
        </div>
        <div class="card-title">饼图</div>
        <div class="card-desc">用于展示数据的占比关系</div>
      </router-link>
      <router-link to="/ring-chart" class="component-card">
        <div class="card-icon">
          <PieChart />
        </div>
        <div class="card-title">环形图</div>
        <div class="card-desc">空心的饼图，便于展示内部数据</div>
      </router-link>
      <router-link to="/area-chart" class="component-card">
        <div class="card-icon">
          <PieChart />
        </div>
        <div class="card-title">面积图</div>
        <div class="card-desc">填充折线下方区域的图表</div>
      </router-link>
      <router-link to="/gauge" class="component-card">
        <div class="card-icon">
          <Monitor />
        </div>
        <div class="card-title">仪表盘</div>
        <div class="card-desc">用于展示单一指标的进度</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PieChart, Monitor } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1000px;
}

.page-header {
  margin-bottom: 32px;

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

.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.component-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #ebeef5;

  &:hover {
    border-color: #4a9eff;
    box-shadow: 0 2px 12px rgba(74, 158, 255, 0.15);
  }

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(74, 158, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a9eff;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;

  .dark & {
    color: #fff;
  }
}

.card-desc {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;

  .dark & {
    color: #c0c4cc;
  }
}
</style>
