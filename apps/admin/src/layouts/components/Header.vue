<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="header-left">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="toggleSidebar">
        <el-icon :size="20">
          <Fold v-if="!isCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- 面包屑 -->
      <Breadcrumb class="breadcrumb" />
    </div>

    <!-- 右侧 -->
    <div class="header-right">
      <!-- 搜索 -->
      <div class="header-item">
        <Search />
      </div>

      <!-- 全屏 -->
      <div class="header-item">
        <FullScreen />
      </div>

      <!-- 通知 -->
      <div class="header-item">
        <Notification />
      </div>

      <!-- 语言切换 -->
      <div class="header-item">
        <LanguageSwitch />
      </div>

      <!-- 主题切换 -->
      <div class="header-item theme-toggle" @click="toggleTheme" title="切换主题">
        <el-icon :size="18">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </div>

      <!-- 用户信息 -->
      <div class="header-item user-info">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="username">{{ username }}</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
const username = computed(() => userStore.username)
const isDark = computed(() => appStore.theme === 'dark')

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const toggleTheme = () => {
  appStore.toggleTheme()
}

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch {
        ElMessage.error('退出登录失败')
      }
      break
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--background);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  color: var(--text-secondary);

  &:hover {
    color: var(--el-color-primary);
  }
}

.breadcrumb {
  margin-left: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-item {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color $transition-duration $transition-function;

  &:hover {
    color: var(--el-color-primary);
  }
}

.theme-toggle {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s;

  &:hover {
    color: var(--el-color-primary);
  }
}

.user-info {
  padding: 0 8px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  font-size: 14px;
}
</style>
