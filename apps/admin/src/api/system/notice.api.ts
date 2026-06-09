/**
 * 通知公告 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/notice/list',
    method: 'get',
    params
  })
}

export const getNoticePage = (params?: NoticeQuery) => {
  return request({
    url: '/system/notice/page',
    method: 'get',
    params
  })
}

export const getNotice = (noticeId: number) => {
  return request({
    url: `/system/notice/${noticeId}`,
    method: 'get'
  })
}

export const addNotice = (data: NoticeForm) => {
  return request({
    url: '/system/notice',
    method: 'post',
    data
  })
}

export const updateNotice = (data: NoticeForm) => {
  return request({
    url: '/system/notice',
    method: 'put',
    data
  })
}

export const deleteNotice = (noticeId: number) => {
  return request({
    url: `/system/notice/${noticeId}`,
    method: 'delete'
  })
}

export const batchDeleteNotice = (noticeIds: number[]) => {
  return request({
    url: '/system/notice/batch',
    method: 'delete',
    data: noticeIds
  })
}

export const publishNotice = (noticeId: number) => {
  return request({
    url: `/system/notice/publish/${noticeId}`,
    method: 'put'
  })
}

export const withdrawNotice = (noticeId: number) => {
  return request({
    url: `/system/notice/withdraw/${noticeId}`,
    method: 'put'
  })
}

export const getNoticeDetail = (noticeId: number) => {
  return request({
    url: `/system/notice/${noticeId}`,
    method: 'get'
  })
}
