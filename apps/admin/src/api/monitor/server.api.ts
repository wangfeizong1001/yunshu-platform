/**
 * 服务器监控 API
 *
 * @module @yunshu/admin/api/monitor
 */

import { request } from '@/utils/request'
import type { IServer } from '@yunshu/shared/types/monitor'
import type { ApiResponse } from '@yunshu/shared'

/**
 * 获取服务器信息
 */
export function getServerInfo() {
  return request<ApiResponse<IServer>>({
    url: '/monitor/server/info',
    method: 'get',
  })
}

/**
 * 获取CPU信息
 */
export function getCpuInfo() {
  return request<ApiResponse<{ coreCount: number; usage: number; model: string }>>({
    url: '/monitor/server/cpu',
    method: 'get',
  })
}

/**
 * 获取内存信息
 */
export function getMemoryInfo() {
  return request<ApiResponse<{ used: number; total: number; usage: number; unit: string }>>({
    url: '/monitor/server/memory',
    method: 'get',
  })
}

/**
 * 获取磁盘信息
 */
export function getDiskInfo() {
  return request<ApiResponse<{ used: number; total: number; usage: number; unit: string }>>({
    url: '/monitor/server/disk',
    method: 'get',
  })
}

/**
 * 获取JVM信息
 */
export function getJvmInfo() {
  return request<ApiResponse<{ name: string; version: string; runtime: string }>>({
    url: '/monitor/server/jvm',
    method: 'get',
  })
}
