<template>
  <div class="layout-container" :class="{ dark: isDark }">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo" v-if="!sidebarCollapsed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4a9eff" />
              <stop offset="100%" style="stop-color:#2c7ad6" />
            </linearGradient>
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logoGradient)" />
            <path d="M2 17l10 5 10-5" stroke="url(#logoGradient)" stroke-width="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="url(#logoGradient)" stroke-width="2" fill="none" />
          </svg>
          <span>云枢 Playground</span>
        </div>
        <div class="logo-mini" v-else>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4a9eff" />
              <stop offset="100%" style="stop-color:#2c7ad6" />
            </linearGradient>
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logoGradient2)" />
          </svg>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div v-for="group in navGroups" :key="group.name" class="nav-group">
          <div class="nav-group-title" v-if="!sidebarCollapsed">{{ group.name }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: $route.name === item.name }"
          >
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-text" v-if="!sidebarCollapsed">{{ item.title }}</span>
          </router-link>
        </div>
      </nav>
    </aside>
    <main class="main-content">
      <header class="header">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <component :is="sidebarCollapsed ? Expand : Fold" />
        </button>
        <div class="header-right">
          <button class="theme-toggle" @click="toggleTheme">
            <component :is="isDark ? Sunny : Moon" />
          </button>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  HomeFilled,
  Button,
  Grid,
  PieChart,
  Upload,
  Monitor,
  Fold,
  Expand,
  Moon,
  Sunny,
} from '@element-plus/icons-vue';

const sidebarCollapsed = ref(false);
const isDark = ref(false);

const navGroups = [
  {
    name: '首页',
    items: [
      { path: '/', name: 'home', title: '首页', icon: HomeFilled },
    ],
  },
  {
    name: '基础组件',
    items: [
      { path: '/button', name: 'button', title: 'Button 按钮', icon: Button },
      { path: '/table', name: 'table', title: 'Table 表格', icon: Grid },
    ],
  },
  {
    name: '图表组件',
    items: [
      { path: '/line-chart', name: 'line-chart', title: '折线图', icon: PieChart },
      { path: '/bar-chart', name: 'bar-chart', title: '柱状图', icon: PieChart },
      { path: '/pie-chart', name: 'pie-chart', title: '饼图', icon: PieChart },
      { path: '/ring-chart', name: 'ring-chart', title: '环形图', icon: PieChart },
      { path: '/area-chart', name: 'area-chart', title: '面积图', icon: PieChart },
      { path: '/gauge', name: 'gauge', title: '仪表盘', icon: Monitor },
    ],
  },
  {
    name: '表单组件',
    items: [
      { path: '/upload', name: 'upload', title: '文件上传', icon: Upload },
    ],
  },
];

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('playground-theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }
});

onUnmounted(() => {
  localStorage.setItem('playground-theme', isDark.value ? 'dark' : 'light');
});
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;

  &.collapsed {
    width: 64px;
  }

  &-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-nav {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #4a9eff;
}

.logo-mini {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-group {
  margin-bottom: 8px;

  &-title {
    padding: 8px 16px 4px;
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(74, 158, 255, 0.08);
  }

  &.active {
    background: rgba(74, 158, 255, 0.15);
    color: #4a9eff;

    .nav-icon {
      color: #4a9eff;
    }
  }

  &-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &-text {
    font-size: 14px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 220px;
  transition: margin-left 0.3s;

  .sidebar.collapsed & {
    margin-left: 64px;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
}

.collapse-btn,
.theme-toggle {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-color);
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dark {
  .sidebar {
    background: var(--sidebar-bg-dark);
    border-right-color: var(--border-color-dark);
  }

  .header {
    background: var(--sidebar-bg-dark);
    border-bottom-color: var(--border-color-dark);
  }

  .nav-item {
    color: var(--text-color-dark);

    &:hover {
      background: rgba(74, 158, 255, 0.1);
    }
  }

  .collapse-btn,
  .theme-toggle {
    color: var(--text-color-dark);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
