/**
 * 登录日志 API
 *
 * @module @yunshu/admin/api/monitor
 */

import { request } from '@/utils/request'
import type {
  ILogininfor,
  ILogininforQuery,
} from '@yunshu/shared/types/monitor'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'

/** 登录日志分页响应 */
export type LogininforPageResp = PaginatedResponse<ILogininfor>

/**
 * 获取登录日志分页列表
 * @param params 查询参数
 */
export function getLogininforPage(params: ILogininforQuery) {
  return request<LogininforPageResp>({
    url: '/monitor/logininfor/page',
    method: 'get',
    params,
  })
}

/**
 * 获取登录日志详情
 * @param id 日志ID
 */
export function getLogininforDetail(id: string) {
  return request<ApiResponse<ILogininfor>>({
    url: `/monitor/logininfor/${id}`,
    method: 'get',
  })
}

/**
 * 删除登录日志
 * @param id 日志ID
 */
export function deleteLogininfor(id: string) {
  return request<ApiResponse<boolean>>({
    url: `/monitor/logininfor/${id}`,
    method: 'delete',
  })
}

/**
 * 批量删除登录日志
 * @param ids 日志ID数组
 */
export function batchDeleteLogininfor(ids: string[]) {
  return request<ApiResponse<number>>({
    url: '/monitor/logininfor/batch',
    method: 'delete',
    data: { ids },
  })
}

/**
 * 清空登录日志
 */
export function cleanLogininfor() {
  return request<ApiResponse<boolean>>({
    url: '/monitor/logininfor/clean',
    method: 'delete',
  })
}

/**
 * 解锁账号
 * @param loginAccount 登录账号
 */
export function unlockAccount(loginAccount: string) {
  return request<ApiResponse<boolean>>({
    url: '/monitor/logininfor/unlock',
    method: 'post',
    data: { loginAccount },
  })
}

/**
 * 导出登录日志
 * @param params 查询参数
 */
export function exportLogininfor(params?: ILogininforQuery) {
  return request.download('/monitor/logininfor/export', params, '登录日志.xlsx')
}
