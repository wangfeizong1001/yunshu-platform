<template>
  <div class="sidebar">
    <!-- Logo 区域 -->
    <div class="logo-container">
      <img v-if="!isCollapsed" src="@/assets/logo.svg" alt="logo" class="logo" />
      <img v-else src="@/assets/logo-mini.svg" alt="logo" class="logo-mini" />
      <span v-if="!isCollapsed" class="title">云枢中台</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapsed"
      :collapse-transition="false"
      :unique-opened="true"
      :background-color="'#304156'"
      :text-color="'#bfcbd9'"
      :active-text-color="'var(--el-color-primary)'"
      router
    >
      <SidebarItem
        v-for="route in permissionRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
const permissionRoutes = computed(() => permissionStore.routes)
const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color: var(--sidebar-bg);
  overflow: hidden;
  position: relative;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: rgba(0, 0, 0, 0.2);

  .logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .logo-mini {
    width: 32px;
    height: 32px;
    margin: 0 auto;
  }

  .title {
    color: var(--el-color-white);
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
  }
}

:deep(.el-menu) {
  border-right: none;
  height: calc(100% - 60px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
