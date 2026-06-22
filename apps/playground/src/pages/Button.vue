<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>Button 按钮</h1>
      <p>按钮用于触发一个操作，如提交表单、打开对话框等</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>基本用法</h2>
        <p>使用 type 属性定义按钮类型</p>
      </div>
      <div class="demo-content">
        <div class="button-group">
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>尺寸</h2>
        <p>使用 size 属性定义按钮尺寸</p>
      </div>
      <div class="demo-content">
        <div class="button-group">
          <el-button size="large">大型按钮</el-button>
          <el-button>默认按钮</el-button>
          <el-button size="small">小型按钮</el-button>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>状态</h2>
        <p>禁用状态和加载状态</p>
      </div>
      <div class="demo-content">
        <div class="button-group">
          <el-button disabled>禁用按钮</el-button>
          <el-button type="primary" disabled>禁用主要按钮</el-button>
          <el-button loading>加载中</el-button>
          <el-button type="primary" loading>加载中</el-button>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>图标按钮</h2>
        <p>使用 icon 属性添加图标</p>
      </div>
      <div class="demo-content">
        <div class="button-group">
          <el-button icon="Edit">编辑</el-button>
          <el-button icon="Share">分享</el-button>
          <el-button icon="Delete">删除</el-button>
          <el-button icon="Search"></el-button>
          <el-button circle icon="Search"></el-button>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>按钮组</h2>
        <p>使用 el-button-group 包裹按钮</p>
      </div>
      <div class="demo-content">
        <el-button-group>
          <el-button type="primary" icon="ArrowLeft">上一页</el-button>
          <el-button type="primary">下一页</el-button>
          <el-button type="primary" icon="ArrowRight"></el-button>
        </el-button-group>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整按钮属性</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">类型</span>
            <el-select v-model="buttonType" class="prop-select">
              <el-option label="默认" value="default" />
              <el-option label="主要" value="primary" />
              <el-option label="成功" value="success" />
              <el-option label="警告" value="warning" />
              <el-option label="危险" value="danger" />
            </el-select>
          </div>
          <div class="prop-item">
            <span class="prop-label">尺寸</span>
            <el-select v-model="buttonSize" class="prop-select">
              <el-option label="大型" value="large" />
              <el-option label="默认" value="default" />
              <el-option label="小型" value="small" />
            </el-select>
          </div>
          <div class="prop-item">
            <span class="prop-label">禁用</span>
            <el-switch v-model="buttonDisabled" />
          </div>
          <div class="prop-item">
            <span class="prop-label">加载中</span>
            <el-switch v-model="buttonLoading" />
          </div>
        </div>
        <el-button
          :type="buttonType"
          :size="buttonSize"
          :disabled="buttonDisabled"
          :loading="buttonLoading"
        >
          预览按钮
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const buttonType = ref<'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'>('primary');
const buttonSize = ref<'large' | 'default' | 'small'>('default');
const buttonDisabled = ref(false);
const buttonLoading = ref(false);
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

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

.prop-select {
  width: 120px;
}
</style>
