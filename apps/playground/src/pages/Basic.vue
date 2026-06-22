<template>
  <div class="page-container">
    <div class="page-header">
      <h1>基础组件</h1>
      <p>常用的基础 UI 组件</p>
    </div>
    <div class="component-grid">
      <router-link to="/button" class="component-card">
        <div class="card-icon">
          <Button />
        </div>
        <div class="card-title">Button 按钮</div>
        <div class="card-desc">按钮用于触发一个操作，如提交表单、打开对话框等</div>
      </router-link>
      <router-link to="/table" class="component-card">
        <div class="card-icon">
          <Grid />
        </div>
        <div class="card-title">Table 表格</div>
        <div class="card-desc">表格用于展示多条结构类似的数据</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Grid } from '@element-plus/icons-vue';
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
  grid-template-columns: repeat(2, 1fr);
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
