<template>
  <div class="server-info">
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="info-item">
          <span class="label">服务器名称</span>
          <span class="value">{{ data.serverName }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">操作系统</span>
          <span class="value">{{ data.os }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">系统架构</span>
          <span class="value">{{ data.osArch }}</span>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :span="8">
        <div class="info-item">
          <span class="label">CPU核心数</span>
          <span class="value">{{ data.cpuCount }} 核</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">CPU使用率</span>
          <span class="value">
            <el-progress :percentage="data.cpuUsage" :stroke-width="8" status="exception" />
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">内存使用率</span>
          <span class="value">
            <el-progress :percentage="data.memoryUsage" :stroke-width="8" status="warning" />
          </span>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :span="8">
        <div class="info-item">
          <span class="label">内存使用</span>
          <span class="value">{{ data.memoryUsed }}GB / {{ data.memoryTotal }}GB</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">磁盘使用</span>
          <span class="value">{{ data.diskUsed }}GB / {{ data.diskTotal }}GB</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">磁盘使用率</span>
          <span class="value">
            <el-progress :percentage="data.diskUsage" :stroke-width="8" status="success" />
          </span>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :span="8">
        <div class="info-item">
          <span class="label">JVM信息</span>
          <span class="value">{{ data.jvm }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">Java版本</span>
          <span class="value">{{ data.javaVersion }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item">
          <span class="label">数据库</span>
          <span class="value">{{ data.database }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { IServer } from '@yunshu/shared'

interface Props {
  data: IServer
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.server-info {
  .info-item {
    display: flex;
    flex-direction: column;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;

    .label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }

    .value {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }

  .mt-16 {
    margin-top: 16px;
  }
}
</style>
