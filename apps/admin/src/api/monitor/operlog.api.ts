/**
 * 操作日志 API
 *
 * @module @yunshu/admin/api/monitor
 */

import { request } from '@/utils/request'
import type {
  IOperlog,
  IOperlogQuery,
} from '@yunshu/shared/types/monitor'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'

/** 操作日志分页响应 */
export type OperlogPageResp = PaginatedResponse<IOperlog>

/**
 * 获取操作日志分页列表
 * @param params 查询参数
 */
export function getOperlogPage(params: IOperlogQuery) {
  return request<OperlogPageResp>({
    url: '/monitor/operlog/page',
    method: 'get',
    params,
  })
}

/**
 * 获取操作日志详情
 * @param id 日志ID
 */
export function getOperlogDetail(id: string) {
  return request<ApiResponse<IOperlog>>({
    url: `/monitor/operlog/${id}`,
    method: 'get',
  })
}

/**
 * 删除操作日志
 * @param id 日志ID
 */
export function deleteOperlog(id: string) {
  return request<ApiResponse<boolean>>({
    url: `/monitor/operlog/${id}`,
    method: 'delete',
  })
}

/**
 * 批量删除操作日志
 * @param ids 日志ID数组
 */
export function batchDeleteOperlog(ids: string[]) {
  return request<ApiResponse<number>>({
    url: '/monitor/operlog/batch',
    method: 'delete',
    data: { ids },
  })
}

/**
 * 清空操作日志
 */
export function cleanOperlog() {
  return request<ApiResponse<boolean>>({
    url: '/monitor/operlog/clean',
    method: 'delete',
  })
}

/**
 * 导出操作日志
 * @param params 查询参数
 */
export function exportOperlog(params?: IOperlogQuery) {
  return request.download('/monitor/operlog/export', params, '操作日志.xlsx')
}
