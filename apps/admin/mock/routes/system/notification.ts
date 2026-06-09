/**
 * 通知 Mock API
 * @module mock/routes/system/notification
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../../utils/response'
import { delay, randomDelay } from '../../utils/delay'
import { db, type Notification } from '../../utils/database'

export default [
  /**
   * 获取通知分页列表
   */
  {
    url: '/api/system/notification/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; title?: string; type?: string; status?: string; level?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { title, type, status, level } = query

      let list = [...db.notifications]

      if (title) {
        list = list.filter(n => n.title.includes(title))
      }
      if (type) {
        list = list.filter(n => n.type === type)
      }
      if (status) {
        list = list.filter(n => n.status === status)
      }
      if (level) {
        list = list.filter(n => n.level === level)
      }

      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

      const total = list.length
      const start = (pageNum - 1) * pageSize
      const paginatedList = list.slice(start, start + pageSize)

      return pageResult(paginatedList, total, pageNum, pageSize)
    }
  },

  /**
   * 获取通知列表
   */
  {
    url: '/api/system/notification/list',
    method: 'get',
    response: async ({ query }: { query: { title?: string; type?: string; status?: string; level?: string } }) => {
      await delay()

      const { title, type, status, level } = query

      let list = [...db.notifications]

      if (title) {
        list = list.filter(n => n.title.includes(title))
      }
      if (type) {
        list = list.filter(n => n.type === type)
      }
      if (status) {
        list = list.filter(n => n.status === status)
      }
      if (level) {
        list = list.filter(n => n.level === level)
      }

      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

      return success(list)
    }
  },

  /**
   * 获取通知详情
   */
  {
    url: '/api/system/notification/:notificationId',
    method: 'get',
    response: async ({ params }: { params: { notificationId: string } }) => {
      await delay()

      const notificationId = parseInt(params.notificationId)
      const notification = db.notifications.find(n => n.notificationId === notificationId)

      if (!notification) {
        return fail('通知不存在', 404)
      }

      return success(notification)
    }
  },

  /**
   * 创建通知
   */
  {
    url: '/api/system/notification',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const { title, content, type, level, targetType, targetIds, isPushed, pushTime, expireTime } = body
      
      if (!title || !content) {
        return fail('请填写完整信息')
      }

      const maxId = Math.max(...db.notifications.map(n => n.notificationId), 0)
      
      const newNotification: Notification = {
        notificationId: maxId + 1,
        title,
        content,
        type: type || '通知',
        level: level || 'info',
        status: '0',
        targetType: targetType || 'all',
        targetIds,
        isPushed: isPushed || false,
        pushTime: isPushed ? pushTime || new Date().toISOString().slice(0, 19).replace('T', ' ') : undefined,
        expireTime,
        createBy: 'admin',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      db.notifications.push(newNotification)
      return success(null, '创建成功')
    }
  },

  /**
   * 更新通知
   */
  {
    url: '/api/system/notification',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const { notificationId, title, content, type, level, targetType, targetIds, isPushed, pushTime, expireTime, status } = body

      if (!notificationId) {
        return fail('通知ID不能为空')
      }

      const index = db.notifications.findIndex(n => n.notificationId === notificationId)
      if (index === -1) {
        return fail('通知不存在', 404)
      }

      db.notifications[index] = {
        ...db.notifications[index],
        title: title || db.notifications[index].title,
        content: content || db.notifications[index].content,
        type: type || db.notifications[index].type,
        level: level || db.notifications[index].level,
        targetType: targetType || db.notifications[index].targetType,
        targetIds,
        isPushed: isPushed !== undefined ? isPushed : db.notifications[index].isPushed,
        pushTime,
        expireTime,
        status: status || db.notifications[index].status,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '更新成功')
    }
  },

  /**
   * 删除通知
   */
  {
    url: '/api/system/notification/:notificationId',
    method: 'delete',
    response: async ({ params }: { params: { notificationId: string } }) => {
      await delay()

      const notificationId = parseInt(params.notificationId)
      const index = db.notifications.findIndex(n => n.notificationId === notificationId)

      if (index === -1) {
        return fail('通知不存在', 404)
      }

      db.notifications.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 批量删除通知
   */
  {
    url: '/api/system/notification/batch',
    method: 'delete',
    response: async ({ body }: { body: { notificationIds: number[] } }) => {
      await delay()

      const { notificationIds } = body
      if (!notificationIds || notificationIds.length === 0) {
        return fail('请选择要删除的通知')
      }

      db.notifications = db.notifications.filter(n => !notificationIds.includes(n.notificationId))
      return success(null, `删除成功`)
    }
  },

  /**
   * 推送通知
   */
  {
    url: '/api/system/notification/:notificationId/push',
    method: 'post',
    response: async ({ params }: { params: { notificationId: string } }) => {
      await delay()

      const notificationId = parseInt(params.notificationId)
      const notification = db.notifications.find(n => n.notificationId === notificationId)

      if (!notification) {
        return fail('通知不存在', 404)
      }

      notification.isPushed = true
      notification.pushTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      return success(null, '推送成功')
    }
  },

  /**
   * 撤回通知
   */
  {
    url: '/api/system/notification/:notificationId/recall',
    method: 'post',
    response: async ({ params }: { params: { notificationId: string } }) => {
      await delay()

      const notificationId = parseInt(params.notificationId)
      const notification = db.notifications.find(n => n.notificationId === notificationId)

      if (!notification) {
        return fail('通知不存在', 404)
      }

      notification.isPushed = false
      notification.status = '1'
      notification.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      return success(null, '撤回成功')
    }
  },

  /**
   * 获取通知统计
   */
  {
    url: '/api/system/notification/stats',
    response: async () => {
      await delay()
      
      const total = db.notifications.length
      const pushed = db.notifications.filter(n => n.isPushed).length
      const active = db.notifications.filter(n => n.status === '0').length
      
      return success({
        total,
        pushed,
        active,
        recalled: total - pushed
      })
    }
  }
] as MockMethod[]
