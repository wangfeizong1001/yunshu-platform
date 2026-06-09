<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- 侧边栏 -->
    <Sidebar class="sidebar-container" />

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <Header class="header-container" />

      <!-- 标签页 -->
      <TagsView class="tags-view-container" />

      <!-- 内容区 -->
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TagsView from './components/TagsView.vue'

const appStore = useAppStore()
const isCollapsed = computed(() => appStore.sidebarCollapsed)
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.sidebar-container {
  width: $layout-sidebar-width;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: $z-index-sticky;
  transition: width $transition-duration $transition-function;
}

.main-container {
  flex: 1;
  margin-left: $layout-sidebar-width;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left $transition-duration $transition-function;
}

.header-container {
  height: $layout-header-height;
  position: fixed;
  top: 0;
  right: 0;
  left: $layout-sidebar-width;
  z-index: $z-index-sticky;
  transition: left $transition-duration $transition-function;
}

.tags-view-container {
  height: $layout-tags-view-height;
  position: fixed;
  top: $layout-header-height;
  right: 0;
  left: $layout-sidebar-width;
  z-index: $z-index-sticky;
  transition: left $transition-duration $transition-function;
}

.app-main {
  margin-top: $layout-header-height + $layout-tags-view-height;
  padding: $spacing-base;
  min-height: calc(100vh - #{$layout-header-height} - #{$layout-tags-view-height});
  background: #f0f2f5;
  overflow-y: auto;
}

// 侧边栏折叠状态
.sidebar-collapsed {
  .sidebar-container {
    width: $layout-sidebar-collapsed-width;
  }

  .main-container {
    margin-left: $layout-sidebar-collapsed-width;
  }

  .header-container {
    left: $layout-sidebar-collapsed-width;
  }

  .tags-view-container {
    left: $layout-sidebar-collapsed-width;
  }
}
</style>
