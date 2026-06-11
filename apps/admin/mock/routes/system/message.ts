/**
 * 站内消息 Mock API
 * @module mock/routes/system/message
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../../utils/response'
import { delay, randomDelay } from '../../utils/delay'
import { db, type Message } from '../../utils/database'

export default [
  /**
   * 获取消息分页列表
   */
  {
    url: '/api/system/message/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; title?: string; type?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { title, type, status } = query

      let list = [...db.messages]

      // 筛选
      if (title) {
        list = list.filter(m => m.title.includes(title))
      }
      if (type) {
        list = list.filter(m => m.type === type)
      }
      if (status) {
        list = list.filter(m => m.status === status)
      }

      // 排序
      list.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

      // 分页
      const total = list.length
      const start = (pageNum - 1) * pageSize
      const paginatedList = list.slice(start, start + pageSize)

      return pageResult(paginatedList, total, pageNum, pageSize)
    }
  },

  /**
   * 获取消息列表
   */
  {
    url: '/api/system/message/list',
    method: 'get',
    response: async ({ query }: { query: { title?: string; type?: string; status?: string } }) => {
      await delay()

      const { title, type, status } = query

      let list = [...db.messages]

      if (title) {
        list = list.filter(m => m.title.includes(title))
      }
      if (type) {
        list = list.filter(m => m.type === type)
      }
      if (status) {
        list = list.filter(m => m.status === status)
      }

      list.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

      return success(list)
    }
  },

  /**
   * 获取未读消息数量
   */
  {
    url: '/api/system/message/unread/count',
    method: 'get',
    response: async () => {
      await delay()
      const count = db.messages.filter(m => m.status === '0').length
      return success(count)
    }
  },

  /**
   * 获取消息详情
   */
  {
    url: '/api/system/message/:messageId',
    method: 'get',
    response: async ({ params }: { params: { messageId: string } }) => {
      await delay()

      const messageId = parseInt(params.messageId)
      const message = db.messages.find(m => m.messageId === messageId)

      if (!message) {
        return fail('消息不存在', 404)
      }

      return success(message)
    }
  },

  /**
   * 发送消息
   */
  {
    url: '/api/system/message',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const { title, content, type, priority, receiverIds } = body
      
      if (!title || !content || !receiverIds || receiverIds.length === 0) {
        return fail('请填写完整信息')
      }

      const maxId = Math.max(...db.messages.map(m => m.messageId), 0)
      
      // 对每个接收者创建一条消息
      receiverIds.forEach((receiverId: number, index: number) => {
        const receiver = db.users.find(u => u.userId === receiverId)
        if (receiver) {
          db.messages.push({
            messageId: maxId + 1 + index,
            title,
            content,
            type: type || 'normal',
            priority: priority || 'medium',
            status: '0',
            senderId: 1,
            senderName: '管理员',
            receiverId,
            receiverName: receiver.nickname || receiver.username,
            sendTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
          })
        }
      })

      return success({
        successCount: receiverIds.length,
        failCount: 0,
        message: '发送成功'
      }, '发送成功')
    }
  },

  /**
   * 删除消息
   */
  {
    url: '/api/system/message/:messageId',
    method: 'delete',
    response: async ({ params }: { params: { messageId: string } }) => {
      await delay()

      const messageId = parseInt(params.messageId)
      const index = db.messages.findIndex(m => m.messageId === messageId)

      if (index === -1) {
        return fail('消息不存在', 404)
      }

      db.messages.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 批量删除消息
   */
  {
    url: '/api/system/message/batch',
    method: 'delete',
    response: async ({ body }: { body: { messageIds: number[] } }) => {
      await delay()

      const { messageIds } = body
      if (!messageIds || messageIds.length === 0) {
        return fail('请选择要删除的消息')
      }

      db.messages = db.messages.filter(m => !messageIds.includes(m.messageId))
      return success(null, '删除成功')
    }
  },

  /**
   * 标记已读
   */
  {
    url: '/api/system/message/:messageId/read',
    method: 'put',
    response: async ({ params }: { params: { messageId: string } }) => {
      await delay()

      const messageId = parseInt(params.messageId)
      const message = db.messages.find(m => m.messageId === messageId)

      if (!message) {
        return fail('消息不存在', 404)
      }

      message.status = '1'
      message.readTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      return success(null, '标记成功')
    }
  },

  /**
   * 全部标记已读
   */
  {
    url: '/api/system/message/read-all',
    method: 'put',
    response: async () => {
      await delay()

      const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
      db.messages.forEach(m => {
        if (m.status === '0') {
          m.status = '1'
          m.readTime = now
        }
      })
      return success(null, '全部标记成功')
    }
  },

  /**
   * 获取已发送消息
   */
  {
    url: '/api/system/message/sent',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; title?: string; type?: string } }) => {
      await delay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { title, type } = query

      let list = db.messages.filter(m => m.senderId === 1)

      if (title) {
        list = list.filter(m => m.title.includes(title))
      }
      if (type) {
        list = list.filter(m => m.type === type)
      }

      list.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

      const total = list.length
      const start = (pageNum - 1) * pageSize
      const paginatedList = list.slice(start, start + pageSize)

      return pageResult(paginatedList, total, pageNum, pageSize)
    }
  }
] as MockMethod[]
