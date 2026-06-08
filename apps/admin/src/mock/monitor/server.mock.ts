/**
 * 服务器监控 Mock 数据
 *
 * @module @yunshu/admin/mock/monitor
 */

import type { IServer } from '@yunshu/shared/types/monitor'

export const serverMockData: IServer = {
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
  bootTime: new Date(Date.now() - 30 * 86400000).toISOString(),
  uptime: 2592000,
  jvm: 'OpenJDK 17.0.9',
  javaVersion: '17.0.9',
  database: 'PostgreSQL 16.1',
  databaseVersion: '16.1',
  projectPath: '/app/yunshu-platform',
  hostName: 'yunshu-server-01',
  collectTime: new Date().toISOString(),
}
