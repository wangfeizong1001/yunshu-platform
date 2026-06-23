<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'is-collapse': isCollapse }">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4a9eff" />
              <stop offset="100%" style="stop-color:#2c7ad6" />
            </linearGradient>
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logoGrad)" />
            <path d="M2 17l10 5 10-5" stroke="url(#logoGrad)" stroke-width="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="url(#logoGrad)" stroke-width="2" fill="none" />
          </svg>
          <span v-show="!isCollapse" class="logo-text">云枢中台</span>
        </div>
      </div>

      <el-scrollbar class="sidebar-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="var(--el-color-primary)"
          router
        >
          <sidebar-item
            v-for="route in menuRoutes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <header class="navbar">
        <div class="navbar-left">
          <hamburger
            :is-active="isCollapse"
            @toggle="toggleSidebar"
          />
          <breadcrumb />
        </div>

        <div class="navbar-right">
          <!-- 搜索 -->
          <search class="navbar-item" />

          <!-- 全屏 -->
          <full-screen class="navbar-item" />

          <!-- 语言切换 -->
          <language-switch class="navbar-item" />

          <!-- 用户信息 -->
          <el-dropdown class="navbar-item user-dropdown" @command="handleUserCommand">
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ userStore.nickname || userStore.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="setting">
                  <el-icon><Setting /></el-icon>
                  账户设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 标签页 -->
      <tags-view />

      <!-- 内容区 -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './components/SidebarItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Hamburger from './components/Hamburger.vue'
import FullScreen from './components/FullScreen.vue'
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import Search from './components/Search.vue'
import TagsView from './components/TagsView.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const isCollapse = ref(false)

// 获取菜单路由
const menuRoutes = computed(() => {
  return permissionStore.routes.filter(item => {
    return item.meta && !item.meta.hidden
  })
})

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 缓存的视图
const cachedViews = computed(() => {
  return permissionStore.cachedViews || []
})

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 用户菜单命令处理
const handleUserCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile/index')
      break
    case 'setting':
      router.push('/user/profile/index')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await userStore.logout()
        router.push('/login')
      } catch {
        // 取消操作
      }
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 210px;
  height: 100vh;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;

  &.is-collapse {
    width: 64px;
  }

  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b3a4a;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      .logo-img {
        width: 32px;
        height: 32px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
      }
    }
  }

  .sidebar-scrollbar {
    height: calc(100vh - 60px);

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .navbar-item {
      display: flex;
      align-items: center;
      padding: 0 12px;
      cursor: pointer;
      color: #5a5e66;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .user-dropdown {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .username {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
