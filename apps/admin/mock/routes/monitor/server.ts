/**
 * 服务监控 Mock API
 * @module mock/routes/monitor/server
 */

import { MockMethod } from 'vite-plugin-mock';
import { success } from '../utils/response';
import { delay } from '../utils/delay';

export default [
  /**
   * 获取服务器信息
   */
  {
    url: '/api/monitor/server',
    method: 'get',
    response: async () => {
      await delay(500); // 服务器信息获取稍慢

      return success({
        serverName: '云枢中台服务器',
        os: 'Linux',
        osArch: 'amd64',
        cpuCount: 8,
        cpuUsage: Math.random() * 40 + 10, // 10-50%
        memoryUsed: Math.floor(Math.random() * 8 + 8), // 8-16GB
        memoryTotal: 16,
        memoryUsage: Math.random() * 30 + 20, // 20-50%
        diskUsed: Math.floor(Math.random() * 200 + 100), // 100-300GB
        diskTotal: 500,
        diskUsage: Math.random() * 30 + 20, // 20-50%
        bootTime: '2024-01-01 08:00:00',
        uptime: Math.floor(Date.now() / 1000) - 1704067200,
        jvm: 'OpenJDK 17.0.9',
        javaVersion: '17.0.9',
        database: 'PostgreSQL',
        databaseVersion: '16.0',
        projectPath: '/opt/yunshu/server',
        hostName: 'yunshu-server-01',
        collectTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      });
    },
  },

  /**
   * 获取CPU信息
   */
  {
    url: '/api/monitor/server/cpu',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        coreCount: 8,
        usage: Math.random() * 40 + 10,
        model: 'Intel(R) Xeon(R) Platinum 8260C CPU @ 2.40GHz',
      });
    },
  },

  /**
   * 获取内存信息
   */
  {
    url: '/api/monitor/server/memory',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        used: Math.floor(Math.random() * 8 + 8),
        total: 16,
        usage: Math.random() * 30 + 20,
        unit: 'GB',
      });
    },
  },

  /**
   * 获取磁盘信息
   */
  {
    url: '/api/monitor/server/disk',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        used: Math.floor(Math.random() * 200 + 100),
        total: 500,
        usage: Math.random() * 30 + 20,
        unit: 'GB',
      });
    },
  },

  /**
   * 获取JVM信息
   */
  {
    url: '/api/monitor/server/jvm',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        name: 'OpenJDK 64-Bit Server VM',
        version: '17.0.9',
        runtime: 'OpenJDK Runtime Environment',
        startTime: '2024-01-01 08:00:00',
        uptime: Math.floor((Date.now() - new Date('2024-01-01T08:00:00').getTime()) / 1000),
      });
    },
  },
] as MockMethod[];
