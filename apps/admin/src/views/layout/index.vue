<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapsed ? '64px' : '240px'" class="sidebar">
      <div class="logo">
        <img v-if="!isCollapsed" src="@/assets/logo.svg" alt="logo" />
        <span v-if="!isCollapsed" class="title">云枢中台</span>
        <el-icon v-else><Box /></el-icon>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <template v-for="menu in menus" :key="menu.path">
          <el-sub-menu v-if="menu.children?.length" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">{{ userInfo?.nickname || '用户' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Fold, Expand, Box } from '@element-plus/icons-vue'
import { usePermissionStore } from '@/store/modules/permission.store'
import { resetRouter } from '@/router'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const isCollapsed = ref(false)

const userInfo = computed(() => permissionStore.userInfo)

// 模拟菜单数据
const menus = ref([
  {
    path: '/dashboard',
    title: '首页',
    icon: 'HomeFilled',
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'Setting',
    children: [
      { path: '/system/user', title: '用户管理' },
      { path: '/system/role', title: '角色管理' },
      { path: '/system/menu', title: '菜单管理' },
      { path: '/system/dept', title: '部门管理' },
      { path: '/system/post', title: '岗位管理' },
    ],
  },
])

const activeMenu = computed(() => route.path)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    path: item.path,
    title: item.meta?.title as string,
  }))
})

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function handleCommand(command: string) {
  switch (command) {
    case 'logout':
      handleLogout()
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  permissionStore.clearPermission()
  resetRouter()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background-color: #2b3a4a;

    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .title {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .sidebar-menu {
    border-right: none;
    background-color: transparent;

    :deep(.el-menu) {
      background-color: transparent;
    }

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      color: #bfcbd9;

      &:hover {
        background-color: #263445;
      }
    }

    :deep(.el-menu-item.is-active) {
      background-color: #409eff !important;
      color: #fff;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;

  .left {
    display: flex;
    align-items: center;

    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 16px;
    }
  }

  .right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .username {
        margin-left: 8px;
      }
    }
  }
}

.main {
  background-color: #f0f2f5;
  padding: 16px;
  overflow-y: auto;
}
</style>
