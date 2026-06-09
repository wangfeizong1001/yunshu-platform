/**
 * API 模块导出
 * 统一导出所有 API 接口
 */

// 导出 request 实例
export { default as HttpRequest } from '../utils/request'

// 导出认证相关 API
export * from './auth'

// 导出用户相关 API
export * from './user'

// 导出租户相关 API
export * from './tenant'

// 导出系统管理相关 API
export * as systemApi from './system'

// 导出监控相关 API
export * as monitorApi from './monitor'

// 导出工具相关 API
export * from './tool'
