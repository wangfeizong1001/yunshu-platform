/**
 * 系统通知 Mock API
 * @module mock/routes/system/notice
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 通知数据 ==========
interface SysNotice {
  noticeId: number
  noticeTitle: string
  noticeType: string
  status: string
  priority: string
  content: string
  publisher: string
  publishTime: string
  expireTime: string
  targetType: string
  targetIds: string
  viewCount: number
  createTime: string
  updateTime: string
  remark: string
}

let notices: SysNotice[] = [
  {
    noticeId: 1,
    noticeTitle: '系统升级通知',
    noticeType: '1',
    status: '0',
    priority: 'high',
    content: '尊敬的用户，系统将于本周六凌晨2:00-6:00进行升级维护，届时系统将暂时无法访问，请提前做好准备。',
    publisher: '管理员',
    publishTime: '2024-01-15 10:00:00',
    expireTime: '2024-01-20 23:59:59',
    targetType: 'all',
    targetIds: '',
    viewCount: 256,
    createTime: '2024-01-14 15:00:00',
    updateTime: '2024-01-14 15:00:00',
    remark: '重要通知'
  },
  {
    noticeId: 2,
    noticeTitle: '新增功能上线公告',
    noticeType: '2',
    status: '0',
    priority: 'normal',
    content: '系统新增了数据可视化功能，用户可以在仪表盘页面查看详细的数据统计图表。',
    publisher: '产品部',
    publishTime: '2024-01-12 09:00:00',
    expireTime: '',
    targetType: 'all',
    targetIds: '',
    viewCount: 189,
    createTime: '2024-01-11 14:00:00',
    updateTime: '2024-01-11 14:00:00',
    remark: '新功能公告'
  },
  {
    noticeId: 3,
    noticeTitle: '密码安全提醒',
    noticeType: '1',
    status: '0',
    priority: 'high',
    content: '为保障账户安全，建议您定期更换密码，并启用双因素认证。',
    publisher: '安全中心',
    publishTime: '2024-01-10 14:00:00',
    expireTime: '2024-02-10 23:59:59',
    targetType: 'all',
    targetIds: '',
    viewCount: 312,
    createTime: '2024-01-10 11:00:00',
    updateTime: '2024-01-10 11:00:00',
    remark: '安全提醒'
  },
  {
    noticeId: 4,
    noticeTitle: '春节放假安排',
    noticeType: '2',
    status: '1',
    priority: 'normal',
    content: '根据国家规定，春节期间（2月9日至2月17日）放假调休，2月18日（周日）正常上班。',
    publisher: '人事行政部',
    publishTime: '2024-01-08 16:00:00',
    expireTime: '2024-02-18 23:59:59',
    targetType: 'all',
    targetIds: '',
    viewCount: 456,
    createTime: '2024-01-08 10:00:00',
    updateTime: '2024-01-08 10:00:00',
    remark: '放假通知'
  },
  {
    noticeId: 5,
    noticeTitle: '用户培训课程通知',
    noticeType: '1',
    status: '0',
    priority: 'normal',
    content: '本周五下午3点将进行新功能培训，培训内容涵盖系统所有新特性，请各部门准时参加。',
    publisher: '培训部',
    publishTime: '2024-01-05 11:00:00',
    expireTime: '2024-01-10 18:00:00',
    targetType: 'dept',
    targetIds: '1,2,3',
    viewCount: 78,
    createTime: '2024-01-04 14:00:00',
    updateTime: '2024-01-04 14:00:00',
    remark: '培训通知'
  },
  {
    noticeId: 6,
    noticeTitle: '数据备份通知',
    noticeType: '2',
    status: '0',
    priority: 'low',
    content: '系统将于每周日凌晨2:00自动进行数据备份，备份时间约30分钟。',
    publisher: '运维部',
    publishTime: '2024-01-02 10:00:00',
    expireTime: '',
    targetType: 'all',
    targetIds: '',
    viewCount: 145,
    createTime: '2024-01-02 09:00:00',
    updateTime: '2024-01-02 09:00:00',
    remark: '常规通知'
  },
  {
    noticeId: 7,
    noticeTitle: '系统故障处理完成公告',
    noticeType: '2',
    status: '0',
    priority: 'high',
    content: '2024年1月3日发生的系统访问异常已处理完毕，所有服务已恢复正常，感谢您的耐心等待。',
    publisher: '技术支持部',
    publishTime: '2024-01-03 18:00:00',
    expireTime: '',
    targetType: 'all',
    targetIds: '',
    viewCount: 523,
    createTime: '2024-01-03 17:30:00',
    updateTime: '2024-01-03 17:30:00',
    remark: '故障处理公告'
  },
  {
    noticeId: 8,
    noticeTitle: '年度总结报告提交通知',
    noticeType: '1',
    status: '0',
    priority: 'normal',
    content: '请各部门于1月20日前提交2023年度工作总结报告，报告模板可在文档中心下载。',
    publisher: '总经理办公室',
    publishTime: '2024-01-01 09:00:00',
    expireTime: '2024-01-20 18:00:00',
    targetType: 'role',
    targetIds: '1,2,3',
    viewCount: 234,
    createTime: '2023-12-28 14:00:00',
    updateTime: '2023-12-28 14:00:00',
    remark: '年度总结'
  }
]

export default [
  /**
   * 获取通知分页列表
   */
  {
    url: '/api/system/notice/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; noticeTitle?: string; noticeType?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { noticeTitle, noticeType, status } = query

      let list = [...notices]

      if (noticeTitle) {
        list = list.filter(n => n.noticeTitle.includes(noticeTitle))
      }
      if (noticeType) {
        list = list.filter(n => n.noticeType === noticeType)
      }
      if (status) {
        list = list.filter(n => n.status === status)
      }

      list.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取通知列表
   */
  {
    url: '/api/system/notice/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(notices.filter(n => n.status === '0'))
    }
  },

  /**
   * 获取通知详情
   */
  {
    url: '/api/system/notice/:noticeId',
    method: 'get',
    response: async ({ params }: { params: { noticeId: string } }) => {
      await delay()

      const notice = notices.find(n => n.noticeId === parseInt(params.noticeId))
      if (!notice) {
        return fail('通知不存在', 404)
      }

      return success(notice)
    }
  },

  /**
   * 新增通知
   */
  {
    url: '/api/system/notice',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      const maxId = Math.max(...notices.map(n => n.noticeId), 0)
      const newNotice: SysNotice = {
        noticeId: maxId + 1,
        noticeTitle: body.noticeTitle,
        noticeType: body.noticeType || '1',
        status: body.status || '0',
        priority: body.priority || 'normal',
        content: body.content,
        publisher: body.publisher || '管理员',
        publishTime: body.publishTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
        expireTime: body.expireTime || '',
        targetType: body.targetType || 'all',
        targetIds: body.targetIds || '',
        viewCount: 0,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || ''
      }

      notices.push(newNotice)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改通知
   */
  {
    url: '/api/system/notice',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = notices.findIndex(n => n.noticeId === body.noticeId)
      if (index === -1) {
        return fail('通知不存在', 404)
      }

      notices[index] = {
        ...notices[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除通知
   */
  {
    url: '/api/system/notice/:noticeId',
    method: 'delete',
    response: async ({ params }: { params: { noticeId: string } }) => {
      await delay()

      const index = notices.findIndex(n => n.noticeId === parseInt(params.noticeId))
      if (index === -1) {
        return fail('通知不存在', 404)
      }

      notices.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 修改通知状态
   */
  {
    url: '/api/system/notice/:noticeId/status',
    method: 'put',
    response: async ({ params, body }: { params: { noticeId: string }; body: { status: string } }) => {
      await delay()

      const notice = notices.find(n => n.noticeId === parseInt(params.noticeId))
      if (!notice) {
        return fail('通知不存在', 404)
      }

      notice.status = body.status
      notice.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success(null, '状态修改成功')
    }
  },

  /**
   * 撤回通知
   */
  {
    url: '/api/system/notice/:noticeId/withdraw',
    method: 'put',
    response: async ({ params }: { params: { noticeId: string } }) => {
      await delay()

      const notice = notices.find(n => n.noticeId === parseInt(params.noticeId))
      if (!notice) {
        return fail('通知不存在', 404)
      }

      notice.status = '1'
      notice.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success(null, '撤回成功')
    }
  },

  /**
   * 发布通知
   */
  {
    url: '/api/system/notice/:noticeId/publish',
    method: 'put',
    response: async ({ params }: { params: { noticeId: string } }) => {
      await delay()

      const notice = notices.find(n => n.noticeId === parseInt(params.noticeId))
      if (!notice) {
        return fail('通知不存在', 404)
      }

      notice.status = '0'
      notice.publishTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      notice.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return success(null, '发布成功')
    }
  },

  /**
   * 导出通知
   */
  {
    url: '/api/system/notice/export',
    method: 'get',
    response: async () => {
      await delay()
      return success({ downloadUrl: '/downloads/notice_export.xlsx' })
    }
  }
] as MockMethod[]
