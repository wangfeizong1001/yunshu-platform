<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>云枢中台 Playground</h1>
        <p>组件演示与交互测试平台</p>
        <p class="description">在这里，您可以查看和测试云枢中台的所有组件，实时调整属性，复制代码片段，体验亮色/暗色主题</p>
      </div>
      <div class="hero-visual">
        <div class="visual-card">
          <div class="card-icon">
            <component :is="Setting" />
          </div>
          <div class="card-title">设计系统</div>
          <div class="card-desc">基于设计令牌的统一设计体系</div>
        </div>
        <div class="visual-card">
          <div class="card-icon">
            <component :is="Grid" />
          </div>
          <div class="card-title">组件库</div>
          <div class="card-desc">丰富的 Vue 3 组件</div>
        </div>
        <div class="visual-card">
          <div class="card-icon">
            <component :is="PieChart" />
          </div>
          <div class="card-title">数据可视化</div>
          <div class="card-desc">基于 ECharts 的图表组件</div>
        </div>
      </div>
    </div>
    <div class="feature-section">
      <h2>组件分类</h2>
      <div class="feature-grid">
        <router-link
          v-for="category in categories"
          :key="category.name"
          :to="category.path"
          class="feature-card"
        >
          <div class="feature-icon">
            <component :is="category.icon" />
          </div>
          <div class="feature-title">{{ category.name }}</div>
          <div class="feature-count">{{ category.count }} 个组件</div>
        </router-link>
      </div>
    </div>
    <div class="quick-start">
      <h2>快速开始</h2>
      <div class="code-block">
        <pre><code>$ pnpm playground:dev</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Setting, Grid, PieChart, Edit, Upload } from '@element-plus/icons-vue';

const categories = [
  { name: '基础组件', path: '/basic', icon: Edit, count: 4 },
  { name: '图表组件', path: '/chart', icon: PieChart, count: 6 },
  { name: '数据组件', path: '/data', icon: Grid, count: 4 },
  { name: '表单组件', path: '/form', icon: Upload, count: 2 },
];
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.hero-content {
  flex: 1;

  h1 {
    font-size: 42px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 16px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 18px;
    color: #606266;
    margin-bottom: 8px;

    &.description {
      font-size: 14px;
      color: #909399;
      line-height: 1.6;
    }

    .dark & {
      color: #c0c4cc;
    }
  }
}

.hero-visual {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.visual-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .dark & {
    background: #2d3748;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #4a9eff 0%, #2c7ad6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;

  .dark & {
    color: #fff;
  }
}

.card-desc {
  font-size: 12px;
  color: #909399;

  .dark & {
    color: #c0c4cc;
  }
}

.feature-section {
  padding: 40px 0;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;

    .dark & {
      color: #fff;
    }
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feature-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #ebeef5;

  &:hover {
    border-color: #4a9eff;
    transform: translateY(-2px);
  }

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: rgba(74, 158, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a9eff;
  font-size: 24px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;

  .dark & {
    color: #fff;
  }
}

.feature-count {
  font-size: 14px;
  color: #909399;

  .dark & {
    color: #c0c4cc;
  }
}

.quick-start {
  padding: 40px 0;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;

    .dark & {
      color: #fff;
    }
  }
}

.code-block {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 24px;
  overflow-x: auto;

  .dark & {
    background: #1a202c;
  }

  pre {
    margin: 0;

    code {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      color: #303133;

      .dark & {
        color: #e2e8f0;
      }
    }
  }
}
</style>
