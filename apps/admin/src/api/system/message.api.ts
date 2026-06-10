/**
 * 站内消息 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface MessageQuery {
  pageNum?: number
  pageSize?: number
  title?: string
  type?: string
  status?: string
  senderId?: number
  receiverId?: number
}

export interface MessageForm {
  messageId?: number
  title?: string
  content?: string
  type?: string
  priority?: string
  receiverIds?: number[]
  receiverNames?: string[]
}

export interface MessageInfo {
  messageId: number
  title: string
  content: string
  type: string
  priority: string
  status: string
  senderId: number
  senderName: string
  receiverId: number
  receiverName: string
  sendTime: string
  readTime?: string
}

export interface SendMessageResult {
  successCount: number
  failCount: number
  message: string
}

export const getMessageList = (params?: MessageQuery) => {
  return request<unknown>({
    url: '/system/message/list',
    method: 'GET',
    params
  })
}

export const getMessagePage = (params?: MessageQuery) => {
  return request<unknown>({
    url: '/system/message/page',
    method: 'GET',
    params
  })
}

export const getUnreadMessageCount = () => {
  return request<unknown>({
    url: '/system/message/unread/count',
    method: 'GET'
  })
}

export const getMessage = (messageId: number) => {
  return request<unknown>({
    url: `/system/message/${messageId}`,
    method: 'GET'
  })
}

export const sendMessage = (data: MessageForm) => {
  return request<unknown>({
    url: '/system/message',
    method: 'POST',
    data
  })
}

export const deleteMessage = (messageId: number) => {
  return request<unknown>({
    url: `/system/message/${messageId}`,
    method: 'DELETE'
  })
}

export const batchDeleteMessage = (messageIds: number[]) => {
  return request<unknown>({
    url: '/system/message/batch',
    method: 'DELETE',
    data: messageIds
  })
}

export const markAsRead = (messageId: number) => {
  return request<unknown>({
    url: `/system/message/${messageId}/read`,
    method: 'PUT'
  })
}

export const markAllAsRead = () => {
  return request<unknown>({
    url: '/system/message/read-all',
    method: 'PUT'
  })
}

export const getSentMessages = (params?: MessageQuery) => {
  return request<unknown>({
    url: '/system/message/sent',
    method: 'GET',
    params
  })
}
