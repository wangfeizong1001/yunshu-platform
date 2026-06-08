/**
 * 在线用户 API
 *
 * @module @yunshu/admin/api/monitor
 */

import { request } from '@/utils/request'
import type {
  IOnline,
  IOnlineQuery,
  IOnlineStats,
} from '@yunshu/shared/types/monitor'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'

/** 在线用户分页响应 */
export type OnlinePageResp = PaginatedResponse<IOnline>

/**
 * 获取在线用户分页列表
 * @param params 查询参数
 */
export function getOnlinePage(params: IOnlineQuery) {
  return request<OnlinePageResp>({
    url: '/monitor/online/page',
    method: 'get',
    params,
  })
}

/**
 * 获取在线用户统计
 */
export function getOnlineStats() {
  return request<ApiResponse<IOnlineStats>>({
    url: '/monitor/online/stats',
    method: 'get',
  })
}

/**
 * 强制用户下线
 * @param sessionId 会话编号
 */
export function forceLogout(sessionId: string) {
  return request<ApiResponse<boolean>>({
    url: '/monitor/online/force-logout',
    method: 'post',
    data: { sessionId },
  })
}

/**
 * 批量强制用户下线
 * @param sessionIds 会话编号数组
 */
export function batchForceLogout(sessionIds: string[]) {
  return request<ApiResponse<number>>({
    url: '/monitor/online/batch-force-logout',
    method: 'post',
    data: { sessionIds },
  })
}
