/**
 * 操作日志 Mock API
 * @module mock/routes/monitor/operlog
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'
import { db } from '../utils/database'

export default [
  /**
   * 获取操作日志分页列表
   */
  {
    url: '/api/monitor/operlog/page',
    method: 'get',
    response: async ({ query }: { query: { page?: string; limit?: string; operName?: string; operType?: string; operModule?: string; status?: string; beginTime?: string; endTime?: string } }) => {
      await randomDelay()

      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const { operName, operType, operModule, status, beginTime, endTime } = query

      let list = [...db.operlogs]

      if (operName) {
        list = list.filter(log => log.operName.includes(operName))
      }
      if (operType) {
        list = list.filter(log => log.operType === operType)
      }
      if (operModule) {
        list = list.filter(log => log.operModule.includes(operModule))
      }
      if (status) {
        list = list.filter(log => log.status === status)
      }
      if (beginTime) {
        list = list.filter(log => log.operTime >= beginTime)
      }
      if (endTime) {
        list = list.filter(log => log.operTime <= endTime)
      }

      // 按时间倒序
      list.sort((a, b) => b.operTime.localeCompare(a.operTime))

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, page, limit)
    }
  },

  /**
   * 获取操作日志列表
   */
  {
    url: '/api/monitor/operlog/list',
    method: 'get',
    response: async ({ query }: { query: { operName?: string; operType?: string; status?: string } }) => {
      await delay()

      const { operName, operType, status } = query

      let list = [...db.operlogs]

      if (operName) {
        list = list.filter(log => log.operName.includes(operName))
      }
      if (operType) {
        list = list.filter(log => log.operType === operType)
      }
      if (status) {
        list = list.filter(log => log.status === status)
      }

      return success(list)
    }
  },

  /**
   * 获取操作日志详情
   */
  {
    url: '/api/monitor/operlog/:operId',
    method: 'get',
    response: async ({ params }: { params: { operId: string } }) => {
      await delay()

      const operlog = db.operlogs.find(log => log.operId === params.operId)
      if (!operlog) {
        return fail('日志不存在', 404)
      }

      return success(operlog)
    }
  },

  /**
   * 删除操作日志
   */
  {
    url: '/api/monitor/operlog/:operId',
    method: 'delete',
    response: async ({ params }: { params: { operId: string } }) => {
      await delay()

      const index = db.operlogs.findIndex(log => log.operId === params.operId)
      if (index === -1) {
        return fail('日志不存在', 404)
      }

      db.operlogs.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 批量删除操作日志
   */
  {
    url: '/api/monitor/operlog/batch',
    method: 'delete',
    response: async ({ body }: { body: { operIds: string[] } }) => {
      await delay()

      const { operIds } = body
      if (!operIds || operIds.length === 0) {
        return fail('请选择要删除的日志')
      }

      db.operlogs = db.operlogs.filter(log => !operIds.includes(log.operId))
      return success(null, `删除成功${operIds.length}条`)
    }
  },

  /**
   * 清空操作日志
   */
  {
    url: '/api/monitor/operlog/clean',
    method: 'delete',
    response: async () => {
      await delay()
      const count = db.operlogs.length
      db.operlogs = []
      return success(null, `清空成功${count}条`)
    }
  }
] as MockMethod[]
