/**
 * 通知公告管理 API
 */

import { request } from '@/utils/request'
import type {
  SysNotice,
  SysNoticeQuery,
  SysNoticeForm,
  SysNoticePageResp,
} from '@yunshu/shared/types/system'

/**
 * 获取通知公告分页列表
 * @param params 查询参数
 */
export function getNoticePage(params: SysNoticeQuery) {
  return request<SysNoticePageResp>({
    url: '/system/notice/page',
    method: 'get',
    params,
  })
}

/**
 * 获取通知公告列表
 * @param params 查询参数
 */
export function getNoticeList(params?: SysNoticeQuery) {
  return request<SysNotice[]>({
    url: '/system/notice/list',
    method: 'get',
    params,
  })
}

/**
 * 获取通知公告详情
 * @param noticeId 公告ID
 */
export function getNoticeDetail(noticeId: number) {
  return request<SysNotice>({
    url: `/system/notice/${noticeId}`,
    method: 'get',
  })
}

/**
 * 新增通知公告
 * @param data 通知公告表单数据
 */
export function addNotice(data: SysNoticeForm) {
  return request<SysNotice>({
    url: '/system/notice',
    method: 'post',
    data,
  })
}

/**
 * 修改通知公告
 * @param noticeId 公告ID
 * @param data 通知公告表单数据
 */
export function updateNotice(noticeId: number, data: SysNoticeForm) {
  return request<SysNotice>({
    url: `/system/notice/${noticeId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除通知公告
 * @param noticeId 公告ID
 */
export function deleteNotice(noticeId: number) {
  return request<void>({
    url: `/system/notice/${noticeId}`,
    method: 'delete',
  })
}

/**
 * 批量删除通知公告
 * @param noticeIds 公告ID数组
 */
export function batchDeleteNotice(noticeIds: number[]) {
  return request<void>({
    url: '/system/notice/batch',
    method: 'delete',
    data: { noticeIds },
  })
}

/**
 * 修改通知公告状态
 * @param noticeId 公告ID
 * @param status 状态
 */
export function changeNoticeStatus(noticeId: number, status: '0' | '1') {
  return request<void>({
    url: `/system/notice/${noticeId}/status`,
    method: 'put',
    data: { status },
  })
}

/**
 * 发布通知公告
 * @param noticeId 公告ID
 */
export function publishNotice(noticeId: number) {
  return request<void>({
    url: `/system/notice/${noticeId}/publish`,
    method: 'put',
  })
}

/**
 * 撤回通知公告
 * @param noticeId 公告ID
 */
export function withdrawNotice(noticeId: number) {
  return request<void>({
    url: `/system/notice/${noticeId}/withdraw`,
    method: 'put',
  })
}
