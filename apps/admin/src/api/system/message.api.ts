/**
 * 站内消息 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/message/list',
    method: 'get',
    params
  })
}

export const getMessagePage = (params?: MessageQuery) => {
  return request({
    url: '/system/message/page',
    method: 'get',
    params
  })
}

export const getUnreadMessageCount = () => {
  return request({
    url: '/system/message/unread/count',
    method: 'get'
  })
}

export const getMessage = (messageId: number) => {
  return request({
    url: `/system/message/${messageId}`,
    method: 'get'
  })
}

export const sendMessage = (data: MessageForm) => {
  return request({
    url: '/system/message',
    method: 'post',
    data
  })
}

export const deleteMessage = (messageId: number) => {
  return request({
    url: `/system/message/${messageId}`,
    method: 'delete'
  })
}

export const batchDeleteMessage = (messageIds: number[]) => {
  return request({
    url: '/system/message/batch',
    method: 'delete',
    data: messageIds
  })
}

export const markAsRead = (messageId: number) => {
  return request({
    url: `/system/message/${messageId}/read`,
    method: 'put'
  })
}

export const markAllAsRead = () => {
  return request({
    url: '/system/message/read-all',
    method: 'put'
  })
}

export const getSentMessages = (params?: MessageQuery) => {
  return request({
    url: '/system/message/sent',
    method: 'get',
    params
  })
}
