/**
 * 服务器监控类型定义
 *
 * @module @yunshu/shared/types/monitor
 */

/** 服务器信息实体 */
export interface IServer {
  /** 服务器名称 */
  serverName: string;
  /** 操作系统 */
  os: string;
  /** 系统架构 */
  osArch: string;
  /** CPU核心数 */
  cpuCount: number;
  /** CPU使用率 */
  cpuUsage: number;
  /** 内存使用 */
  memoryUsed: number;
  /** 内存总量 */
  memoryTotal: number;
  /** 内存使用率 */
  memoryUsage: number;
  /** 磁盘使用 */
  diskUsed: number;
  /** 磁盘总量 */
  diskTotal: number;
  /** 磁盘使用率 */
  diskUsage: number;
  /** 开机时间 */
  bootTime: string;
  /** 运行时间(秒) */
  uptime: number;
  /** JVM信息 */
  jvm: string;
  /** Java版本 */
  javaVersion: string;
  /** 数据库类型 */
  database: string;
  /** 数据库版本 */
  databaseVersion: string;
  /** 项目路径 */
  projectPath: string;
  /** 主机名 */
  hostName: string;
  /** 数据采集时间 */
  collectTime: string;
}

/** CPU信息 */
export interface ICpuInfo {
  /** 核心数 */
  coreCount: number;
  /** 使用率 */
  usage: number;
  /** 型号 */
  model: string;
}

/** 内存信息 */
export interface IMemoryInfo {
  /** 已使用 */
  used: number;
  /** 总计 */
  total: number;
  /** 使用率 */
  usage: number;
  /** 单位 */
  unit: string;
}

/** 磁盘信息 */
export interface IDiskInfo {
  /** 已使用 */
  used: number;
  /** 总计 */
  total: number;
  /** 使用率 */
  usage: number;
  /** 单位 */
  unit: string;
}

/** JVM信息 */
export interface IJvmInfo {
  /** JVM名称 */
  name: string;
  /** 版本 */
  version: string;
  /** 运行时 */
  runtime: string;
  /** 启动时间 */
  startTime: string;
  /** 运行时间 */
  uptime: number;
}
