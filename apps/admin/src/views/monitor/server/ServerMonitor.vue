<template>
  <div class="page-container">
    <el-row :gutter="20">
      <!-- 基本信息 -->
      <el-col :span="24">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
              <el-button :icon="Refresh" circle @click="loadData" />
            </div>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="服务器名称">{{ serverInfo.serverName }}</el-descriptions-item>
            <el-descriptions-item label="主机名">{{ serverInfo.hostName }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ serverInfo.os }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ serverInfo.osArch }}</el-descriptions-item>
            <el-descriptions-item label="项目路径" :span="2">{{ serverInfo.projectPath }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-row">
      <!-- CPU信息 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>CPU信息</span>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-value">
              <span class="value">{{ serverInfo.cpuUsage }}</span>
              <span class="unit">%</span>
            </div>
            <div class="progress-bar">
              <el-progress :percentage="serverInfo.cpuUsage" :stroke-width="12" status="exception" />
            </div>
            <div class="stat-detail">
              <span>核心数: {{ serverInfo.cpuCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 内存信息 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>内存信息</span>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-value">
              <span class="value">{{ serverInfo.memoryUsage }}</span>
              <span class="unit">%</span>
            </div>
            <div class="progress-bar">
              <el-progress :percentage="serverInfo.memoryUsage" :stroke-width="12" status="warning" />
            </div>
            <div class="stat-detail">
              <span>已用: {{ serverInfo.memoryUsed }}GB / {{ serverInfo.memoryTotal }}GB</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 磁盘信息 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>磁盘信息</span>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-value">
              <span class="value">{{ serverInfo.diskUsage }}</span>
              <span class="unit">%</span>
            </div>
            <div class="progress-bar">
              <el-progress :percentage="serverInfo.diskUsage" :stroke-width="12" status="success" />
            </div>
            <div class="stat-detail">
              <span>已用: {{ serverInfo.diskUsed }}GB / {{ serverInfo.diskTotal }}GB</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- Java虚拟机 -->
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>Java虚拟机</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="JVM名称">{{ serverInfo.jvm }}</el-descriptions-item>
            <el-descriptions-item label="Java版本">{{ serverInfo.javaVersion }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 数据库 -->
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>数据库</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="数据库类型">{{ serverInfo.database }}</el-descriptions-item>
            <el-descriptions-item label="数据库版本">{{ serverInfo.databaseVersion }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="24">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>运行信息</span>
            </div>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="开机时间">{{ formatDate(serverInfo.bootTime) }}</el-descriptions-item>
            <el-descriptions-item label="运行时间">{{ formatUptime(serverInfo.uptime) }}</el-descriptions-item>
            <el-descriptions-item label="数据采集时间">{{ formatDate(serverInfo.collectTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import type { IServer } from '@yunshu/shared'
import * as serverApi from '@/api/monitor/server.api'

const serverInfo = ref<IServer>({
  serverName: '-',
  os: '-',
  osArch: '-',
  cpuCount: 0,
  cpuUsage: 0,
  memoryUsed: 0,
  memoryTotal: 0,
  memoryUsage: 0,
  diskUsed: 0,
  diskTotal: 0,
  diskUsage: 0,
  bootTime: '',
  uptime: 0,
  jvm: '-',
  javaVersion: '-',
  database: '-',
  databaseVersion: '-',
  projectPath: '-',
  hostName: '-',
  collectTime: '',
})

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const formatUptime = (seconds: number | undefined) => {
  if (!seconds) return '-'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}天 ${hours}小时 ${minutes}分钟`
}

const loadData = async () => {
  try {
    const res = await serverApi.getServerInfo() as { success: boolean; data: IServer }
    if (res.success) {
      serverInfo.value = res.data
    }
  } catch {
    ElMessage.error('获取服务器信息失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  .info-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .stats-row {
    margin-bottom: 16px;
  }

  .stat-card {
    .card-header {
      font-weight: 600;
    }

    .stat-content {
      .stat-value {
        text-align: center;
        margin-bottom: 16px;

        .value {
          font-size: 36px;
          font-weight: 700;
          color: #303133;
        }

        .unit {
          font-size: 18px;
          color: #909399;
        }
      }

      .progress-bar {
        margin-bottom: 12px;
      }

      .stat-detail {
        text-align: center;
        font-size: 13px;
        color: #909399;
      }
    }
  }
}
</style>
