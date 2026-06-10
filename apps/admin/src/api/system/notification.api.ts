/**
 * 通知 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface NotificationQuery {
  pageNum?: number
  pageSize?: number
  title?: string
  type?: string
  status?: string
  level?: string
}

export interface NotificationForm {
  notificationId?: number
  title?: string
  content?: string
  type?: string
  level?: string
  targetType?: string
  targetIds?: number[]
  isPushed?: boolean
  pushTime?: string
  expireTime?: string
}

export interface NotificationInfo {
  notificationId: number
  title: string
  content: string
  type: string
  level: string
  status: string
  targetType: string
  targetIds?: number[]
  isPushed: boolean
  pushTime?: string
  expireTime?: string
  createBy: string
  createTime: string
  updateTime?: string
}

export const getNotificationList = (params?: NotificationQuery) => {
  return request<{ rows: NotificationInfo[]; total: number }>({
    url: '/system/notification/list',
    method: 'GET',
    params
  })
}

export const getNotificationPage = (params?: NotificationQuery) => {
  return request<{ rows: NotificationInfo[]; total: number }>({
    url: '/system/notification/page',
    method: 'GET',
    params
  })
}

export const getNotification = (notificationId: number) => {
  return request<NotificationInfo>({
    url: `/system/notification/${notificationId}`,
    method: 'GET'
  })
}

export const createNotification = (data: NotificationForm) => {
  return request<void>({
    url: '/system/notification',
    method: 'POST',
    data
  })
}

export const updateNotification = (data: NotificationForm) => {
  return request<void>({
    url: '/system/notification',
    method: 'PUT',
    data
  })
}

export const deleteNotification = (notificationId: number) => {
  return request<void>({
    url: `/system/notification/${notificationId}`,
    method: 'DELETE'
  })
}

export const batchDeleteNotification = (notificationIds: number[]) => {
  return request<void>({
    url: '/system/notification/batch',
    method: 'DELETE',
    data: notificationIds
  })
}

export const pushNotification = (notificationId: number) => {
  return request<void>({
    url: `/system/notification/${notificationId}/push`,
    method: 'POST'
  })
}

export const recallNotification = (notificationId: number) => {
  return request<void>({
    url: `/system/notification/${notificationId}/recall`,
    method: 'POST'
  })
}

export const getNotificationStats = () => {
  return request<{ total: number; unread: number; today: number }>({
    url: '/system/notification/stats',
    method: 'GET'
  })
}
