<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #409eff">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.userCount }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #67c23a">
            <el-icon :size="32"><Role /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.roleCount }}</div>
            <div class="stat-label">角色总数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #e6a23c">
            <el-icon :size="32"><Menu /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.menuCount }}</div>
            <div class="stat-label">菜单总数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #f56c6c">
            <el-icon :size="32"><Post /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.postCount }}</div>
            <div class="stat-label">岗位总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card shadow="hover" header="快捷入口">
          <div class="quick-entry">
            <el-button
              v-for="item in quickEntries"
              :key="item.path"
              @click="router.push(item.path)"
            >
              <el-icon><component :is="item.icon" /></el-icon>
              {{ item.title }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" header="系统信息">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="前端框架">Vue 3 + TypeScript</el-descriptions-item>
            <el-descriptions-item label="UI 框架">Element Plus</el-descriptions-item>
            <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Role, Menu, Post } from '@element-plus/icons-vue'

const router = useRouter()

const stats = ref({
  userCount: 128,
  roleCount: 8,
  menuCount: 56,
  postCount: 12,
})

const quickEntries = ref([
  { title: '用户管理', path: '/system/user', icon: 'User' },
  { title: '角色管理', path: '/system/role', icon: 'Role' },
  { title: '菜单管理', path: '/system/menu', icon: 'Menu' },
  { title: '部门管理', path: '/system/dept', icon: 'Dept' },
  { title: '岗位管理', path: '/system/post', icon: 'Post' },
])
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    display: flex;
    align-items: center;

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      color: #fff;
    }

    .stat-info {
      margin-left: 16px;

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .quick-entry {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
