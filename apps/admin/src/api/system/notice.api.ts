/**
 * 通知公告 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface NoticeQuery {
  pageNum?: number
  pageSize?: number
  noticeTitle?: string
  noticeType?: string
  status?: string
}

export interface NoticeForm {
  noticeId?: number
  noticeTitle?: string
  noticeType?: string
  noticeContent?: string
  status?: string
  remark?: string
}

export interface NoticeInfo {
  noticeId: number
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  remark: string
  createTime: string
}

export const getNoticeList = (params?: NoticeQuery) => {
  return request<unknown>({
    url: '/system/notice/list',
    method: 'GET',
    params
  })
}

export const getNoticePage = (params?: NoticeQuery) => {
  return request<unknown>({
    url: '/system/notice/page',
    method: 'GET',
    params
  })
}

export const getNotice = (noticeId: number) => {
  return request<unknown>({
    url: `/system/notice/${noticeId}`,
    method: 'GET'
  })
}

export const addNotice = (data: NoticeForm) => {
  return request<unknown>({
    url: '/system/notice',
    method: 'POST',
    data
  })
}

export const updateNotice = (data: NoticeForm) => {
  return request<unknown>({
    url: '/system/notice',
    method: 'PUT',
    data
  })
}

export const deleteNotice = (noticeId: number) => {
  return request<unknown>({
    url: `/system/notice/${noticeId}`,
    method: 'DELETE'
  })
}

export const batchDeleteNotice = (noticeIds: number[]) => {
  return request<unknown>({
    url: '/system/notice/batch',
    method: 'DELETE',
    data: noticeIds
  })
}

export const publishNotice = (noticeId: number) => {
  return request<unknown>({
    url: `/system/notice/publish/${noticeId}`,
    method: 'PUT'
  })
}

export const withdrawNotice = (noticeId: number) => {
  return request<unknown>({
    url: `/system/notice/withdraw/${noticeId}`,
    method: 'PUT'
  })
}

export const getNoticeDetail = (noticeId: number) => {
  return request<unknown>({
    url: `/system/notice/${noticeId}`,
    method: 'GET'
  })
}
