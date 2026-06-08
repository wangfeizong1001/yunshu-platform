/**
 * 登录日志 Mock API
 * @module mock/routes/monitor/logininfor
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'
import { db } from '../utils/database'

export default [
  /**
   * 获取登录日志分页列表
   */
  {
    url: '/api/monitor/logininfor/page',
    method: 'get',
    response: async ({ query }: { query: { page?: string; limit?: string; userName?: string; status?: string; operationType?: string; beginTime?: string; endTime?: string } }) => {
      await randomDelay()

      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const { userName, status, operationType, beginTime, endTime } = query

      let list = [...db.logininfors]

      if (userName) {
        list = list.filter(log => log.userName.includes(userName) || log.loginAccount.includes(userName))
      }
      if (status) {
        list = list.filter(log => log.status === status)
      }
      if (operationType) {
        list = list.filter(log => log.operationType === operationType)
      }
      if (beginTime) {
        list = list.filter(log => log.loginTime >= beginTime)
      }
      if (endTime) {
        list = list.filter(log => log.loginTime <= endTime)
      }

      list.sort((a, b) => b.loginTime.localeCompare(a.loginTime))

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, page, limit)
    }
  },

  /**
   * 获取登录日志列表
   */
  {
    url: '/api/monitor/logininfor/list',
    method: 'get',
    response: async ({ query }: { query: { userName?: string; status?: string } }) => {
      await delay()

      const { userName, status } = query

      let list = [...db.logininfors]

      if (userName) {
        list = list.filter(log => log.userName.includes(userName))
      }
      if (status) {
        list = list.filter(log => log.status === status)
      }

      return success(list)
    }
  },

  /**
   * 删除登录日志
   */
  {
    url: '/api/monitor/logininfor/:infoId',
    method: 'delete',
    response: async ({ params }: { params: { infoId: string } }) => {
      await delay()

      const index = db.logininfors.findIndex(log => log.infoId === params.infoId)
      if (index === -1) {
        return fail('日志不存在', 404)
      }

      db.logininfors.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 批量删除登录日志
   */
  {
    url: '/api/monitor/logininfor/batch',
    method: 'delete',
    response: async ({ body }: { body: { infoIds: string[] } }) => {
      await delay()

      const { infoIds } = body
      if (!infoIds || infoIds.length === 0) {
        return fail('请选择要删除的日志')
      }

      db.logininfors = db.logininfors.filter(log => !infoIds.includes(log.infoId))
      return success(null, `删除成功${infoIds.length}条`)
    }
  },

  /**
   * 清空登录日志
   */
  {
    url: '/api/monitor/logininfor/clean',
    method: 'delete',
    response: async () => {
      await delay()
      const count = db.logininfors.length
      db.logininfors = []
      return success(null, `清空成功${count}条`)
    }
  },

  /**
   * 解锁账号
   */
  {
    url: '/api/monitor/logininfor/unlock/:userName',
    method: 'put',
    response: async ({ params }: { params: { userName: string } }) => {
      await delay()
      return success(null, '解锁成功')
    }
  }
] as MockMethod[]
