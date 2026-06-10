<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <el-row :gutter="16" class="welcome-section">
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-left">
              <div class="welcome-text">
                <h2>早安，{{ userStore.nickname || userStore.username }}！祝您今天工作愉快~</h2>
                <p class="date-time">
                  <el-icon><Calendar /></el-icon>
                  {{ currentDateTime }}
                </p>
              </div>
            </div>
            <div class="welcome-right">
              <div class="today-stats">
                <div class="stat-item">
                  <span class="stat-label">今日任务</span>
                  <span class="stat-value warning">{{ todayStats.taskCount }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">已完成</span>
                  <span class="stat-value success">{{ todayStats.completedCount }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">进行中</span>
                  <span class="stat-value primary">{{ todayStats.inProgressCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 统计卡片区域 -->
    <el-row :gutter="16" class="stat-section">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #409eff">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.userCount }}</div>
            <div class="stat-label">用户总数</div>
          </div>
          <div class="stat-trend up">
            <el-icon><TrendCharts /></el-icon>
            <span>+12%</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #67c23a">
            <el-icon :size="32"><Key /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.roleCount }}</div>
            <div class="stat-label">角色总数</div>
          </div>
          <div class="stat-trend up">
            <el-icon><TrendCharts /></el-icon>
            <span>+3</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #e6a23c">
            <el-icon :size="32"><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.onlineCount }}</div>
            <div class="stat-label">在线人数</div>
          </div>
          <div class="stat-trend" :class="stats.onlineCount > 10 ? 'up' : 'down'">
            <el-icon><TrendCharts /></el-icon>
            <span>{{ stats.onlineCount > 10 ? '+5' : '-2' }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background-color: #f56c6c">
            <el-icon :size="32"><Connection /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayVisit }}</div>
            <div class="stat-label">今日访问量</div>
          </div>
          <div class="stat-trend up">
            <el-icon><TrendCharts /></el-icon>
            <span>+8%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作和服务器信息 -->
    <el-row :gutter="16" class="content-section">
      <el-col :xs="24" :lg="14">
        <!-- 快捷操作区域 -->
        <el-card shadow="hover" header="快捷操作" class="quick-action-card">
          <div class="quick-entry">
            <div
              v-for="item in quickEntries"
              :key="item.path"
              class="quick-item"
              @click="handleQuickEntry(item.path)"
            >
              <div class="quick-icon" :style="{ backgroundColor: item.color }">
                <el-icon :size="24"><component :is="item.icon" /></el-icon>
              </div>
              <span class="quick-title">{{ item.title }}</span>
              <span class="quick-desc">{{ item.desc }}</span>
            </div>
          </div>
        </el-card>

        <!-- 最近操作日志 -->
        <el-card shadow="hover" header="最近操作日志" class="log-card">
          <template #header-actions>
            <el-button type="primary" link @click="router.push('/monitor/operlog')">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </template>
          <el-table :data="operLogs" style="width: 100%" :show-header="true" size="small">
            <el-table-column prop="operName" label="操作人" width="100" />
            <el-table-column prop="operModule" label="操作模块" width="120" />
            <el-table-column prop="operType" label="操作类型" width="80">
              <template #default="{ row }">
                <el-tag :type="getOperTypeTagType(row.operType)" size="small">
                  {{ row.operType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operTime" label="操作时间" min-width="160">
              <template #default="{ row }">
                {{ formatTime(row.operTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
                  {{ row.status === '0' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <!-- 服务器信息 -->
        <el-card shadow="hover" header="服务器信息" class="server-card">
          <template #header-actions>
            <el-button type="primary" link @click="router.push('/monitor/server')">
              详情
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </template>
          <div class="server-info">
            <div class="server-header">
              <div class="server-name">
                <el-icon><Monitor /></el-icon>
                <span>{{ serverInfo.serverName }}</span>
              </div>
              <div class="server-status">
                <span class="status-dot"></span>
                <span>运行正常</span>
              </div>
            </div>

            <div class="server-base">
              <div class="base-item">
                <span class="base-label">操作系统</span>
                <span class="base-value">{{ serverInfo.os }}</span>
              </div>
              <div class="base-item">
                <span class="base-label">服务器地址</span>
                <span class="base-value">{{ serverInfo.hostName }}</span>
              </div>
              <div class="base-item">
                <span class="base-label">Java版本</span>
                <span class="base-value">{{ serverInfo.javaVersion }}</span>
              </div>
              <div class="base-item">
                <span class="base-label">数据库</span>
                <span class="base-value">{{ serverInfo.database }}</span>
              </div>
            </div>

            <div class="usage-section">
              <h4>资源使用率</h4>

              <div class="usage-item">
                <div class="usage-header">
                  <span class="usage-label">
                    <el-icon><Cpu /></el-icon>
                    CPU 使用率
                  </span>
                  <span class="usage-value">{{ serverInfo.cpuUsage }}%</span>
                </div>
                <el-progress
                  :percentage="serverInfo.cpuUsage"
                  :stroke-width="10"
                  :color="getProgressColor(serverInfo.cpuUsage)"
                  :show-text="false"
                />
              </div>

              <div class="usage-item">
                <div class="usage-header">
                  <span class="usage-label">
                    <el-icon><FolderOpened /></el-icon>
                    内存使用率
                  </span>
                  <span class="usage-value">{{ serverInfo.memoryUsage }}%</span>
                </div>
                <el-progress
                  :percentage="serverInfo.memoryUsage"
                  :stroke-width="10"
                  :color="getProgressColor(serverInfo.memoryUsage)"
                  :show-text="false"
                />
                <div class="usage-detail">
                  已用 {{ serverInfo.memoryUsed }} GB / 总计 {{ serverInfo.memoryTotal }} GB
                </div>
              </div>

              <div class="usage-item">
                <div class="usage-header">
                  <span class="usage-label">
                    <el-icon><FolderOpened /></el-icon>
                    磁盘使用率
                  </span>
                  <span class="usage-value">{{ serverInfo.diskUsage }}%</span>
                </div>
                <el-progress
                  :percentage="serverInfo.diskUsage"
                  :stroke-width="10"
                  :color="getProgressColor(serverInfo.diskUsage)"
                  :show-text="false"
                />
                <div class="usage-detail">
                  已用 {{ serverInfo.diskUsed }} GB / 总计 {{ serverInfo.diskTotal }} GB
                </div>
              </div>
            </div>

            <div class="uptime-section">
              <el-icon><Timer /></el-icon>
              <span>服务器运行时间：{{ formatUptime(serverInfo.uptime) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import {
    Calendar,
    TrendCharts,
    Monitor,
    Cpu,
    FolderOpened,
    Timer,
    ArrowRight,
  } from '@element-plus/icons-vue';
  import { getServerInfo } from '@/api/monitor/server.api';
  import { getOperlogPage } from '@/api/monitor/operlog.api';
  import { getOnlineList } from '@/api/monitor/online.api';
  import type { IServer } from '@yunshu/shared';
  import type { IOperlog } from '@yunshu/shared';
  import { formatDate } from '@/utils/format';

  const router = useRouter();
  const userStore = useUserStore();

  // 当前日期时间
  const currentDateTime = ref('');
  let timer: ReturnType<typeof setInterval>;

  // 统计数据
  const stats = ref({
    userCount: 128,
    roleCount: 8,
    onlineCount: 12,
    todayVisit: 1523,
  });

  // 今日任务统计
  const todayStats = ref({
    taskCount: 15,
    completedCount: 8,
    inProgressCount: 5,
  });

  // 服务器信息
  const serverInfo = ref<IServer>({
    serverName: '云枢生产服务器',
    os: 'Ubuntu 22.04 LTS',
    osArch: 'x64',
    cpuCount: 8,
    cpuUsage: 35.5,
    memoryUsed: 12.5,
    memoryTotal: 32,
    memoryUsage: 39.06,
    diskUsed: 256.8,
    diskTotal: 500,
    diskUsage: 51.36,
    bootTime: '',
    uptime: 2592000,
    jvm: '',
    javaVersion: '17.0.9',
    database: 'PostgreSQL 16.1',
    databaseVersion: '16.1',
    projectPath: '',
    hostName: 'yunshu-server-01',
    collectTime: '',
  });

  // 操作日志
  const operLogs = ref<IOperlog[]>([]);

  // 快捷入口
  const quickEntries = ref([
    {
      title: '用户管理',
      desc: '管理系统用户',
      path: '/system/user',
      icon: 'User',
      color: '#409eff',
    },
    {
      title: '角色管理',
      desc: '管理角色权限',
      path: '/system/role',
      icon: 'Key',
      color: '#67c23a',
    },
    {
      title: '菜单管理',
      desc: '管理系统菜单',
      path: '/system/menu',
      icon: 'Menu',
      color: '#e6a23c',
    },
    {
      title: '系统监控',
      desc: '监控服务器状态',
      path: '/monitor/server',
      icon: 'Monitor',
      color: '#f56c6c',
    },
  ]);

  /**
   * 更新时间
   */
  const updateDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];
    currentDateTime.value = `${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}:${seconds}`;
  };

  /**
   * 格式化时间
   */
  const formatTime = (time: string) => {
    return formatDate(time);
  };

  /**
   * 格式化运行时长
   */
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  /**
   * 获取操作类型标签颜色
   */
  const getOperTypeTagType = (
    type: string,
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
    const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      查询: 'info',
      新增: 'success',
      修改: 'warning',
      删除: 'danger',
      导出: 'primary',
      导入: 'primary',
    };
    return typeMap[type];
  };

  /**
   * 获取进度条颜色
   */
  const getProgressColor = (percentage: number) => {
    if (percentage < 60) return '#67c23a';
    if (percentage < 80) return '#e6a23c';
    return '#f56c6c';
  };

  /**
   * 跳转到快捷入口
   */
  const handleQuickEntry = (path: string) => {
    router.push(path);
  };

  /**
   * 获取服务器信息
   */
  const fetchServerInfo = async () => {
    try {
      const res = await getServerInfo();
      const responseData = res as Record<string, unknown>;
      if (responseData.data) {
        serverInfo.value = responseData.data as typeof serverInfo.value;
      }
    } catch {
      // 使用默认数据
    }
  };

  /**
   * 获取操作日志
   */
  const fetchOperLogs = async () => {
    try {
      const res = await getOperlogPage({ pageNum: 1, pageSize: 10 });
      const responseData = res as Record<string, unknown>;
      if (responseData.rows) {
        operLogs.value = responseData.rows as typeof operLogs.value;
      }
    } catch {
      // 使用默认数据
    }
  };

  /**
   * 获取在线人数
   */
  const fetchOnlineStats = async () => {
    try {
      const res = await getOnlineList();
      const responseData = res as Record<string, unknown>;
      const data = responseData.data as Record<string, unknown> | undefined;
      if (data) {
        stats.value.onlineCount = Number(data.onlineCount) || 0;
      }
    } catch {
      // 使用默认数据
    }
  };

  onMounted(() => {
    updateDateTime();
    timer = setInterval(updateDateTime, 1000);

    fetchServerInfo();
    fetchOperLogs();
    fetchOnlineStats();
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

<style scoped lang="scss">
  .dashboard {
    padding: 16px;

    .welcome-section {
      margin-bottom: 16px;
    }

    .welcome-card {
      background: linear-gradient(135deg, #409eff 0%, #53a8ff 50%, #66b1ff 100%);
      border: none;
      color: #fff;

      :deep(.el-card__body) {
        padding: 24px;
      }

      .welcome-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 16px;
        }
      }

      .welcome-left {
        .welcome-text {
          h2 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
          }

          .date-time {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }

      .welcome-right {
        .today-stats {
          display: flex;
          gap: 32px;

          @media (max-width: 768px) {
            gap: 16px;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .stat-label {
              font-size: 13px;
              opacity: 0.8;
              margin-bottom: 4px;
            }

            .stat-value {
              font-size: 28px;
              font-weight: bold;

              &.warning {
                color: #fdf6ec;
              }

              &.success {
                color: #f0f9eb;
              }

              &.primary {
                color: #fff;
              }
            }
          }
        }
      }
    }

    .stat-section {
      margin-bottom: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 16px;
      transition:
        transform 0.3s,
        box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        border-radius: 12px;
        color: #fff;
        flex-shrink: 0;
      }

      .stat-info {
        margin-left: 16px;
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 4px;
        }
      }

      .stat-trend {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;

        &.up {
          color: #67c23a;
        }

        &.down {
          color: #f56c6c;
        }
      }
    }

    .content-section {
      margin-bottom: 16px;
    }

    .quick-action-card {
      margin-bottom: 16px;

      .quick-entry {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;

        @media (max-width: 1200px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 12px;
          background: #f5f7fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #ecf5ff;
            transform: translateY(-2px);

            .quick-icon {
              transform: scale(1.1);
            }
          }

          .quick-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            color: #fff;
            margin-bottom: 12px;
            transition: transform 0.3s;
          }

          .quick-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .quick-desc {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }

    .log-card {
      :deep(.el-card__header) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;

        .el-card__header-title {
          font-weight: 600;
        }
      }
    }

    .server-card {
      :deep(.el-card__header) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;

        .el-card__header-title {
          font-weight: 600;
        }
      }

      .server-info {
        .server-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #ebeef5;
          margin-bottom: 16px;

          .server-name {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }

          .server-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #67c23a;

            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #67c23a;
              animation: pulse 2s infinite;
            }
          }
        }

        .server-base {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;

          .base-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .base-label {
              font-size: 12px;
              color: #909399;
            }

            .base-value {
              font-size: 13px;
              color: #606266;
            }
          }
        }

        .usage-section {
          h4 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: 600;
            color: #303133;
          }

          .usage-item {
            margin-bottom: 16px;

            &:last-child {
              margin-bottom: 0;
            }

            .usage-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;

              .usage-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: #606266;
              }

              .usage-value {
                font-size: 14px;
                font-weight: 600;
                color: #303133;
              }
            }

            .usage-detail {
              font-size: 12px;
              color: #909399;
              margin-top: 4px;
            }
          }
        }

        .uptime-section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #ebeef5;
          margin-top: 16px;
          font-size: 13px;
          color: #606266;
        }
      }
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }
</style>
