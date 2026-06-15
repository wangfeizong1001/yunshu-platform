/**
 * 短信配置 Mock API
 * @module mock/routes/system/sms
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'

// ========== 短信配置数据 ==========
interface SmsConfig {
  id: number
  provider: string
  accessKeyId: string
  accessKeySecret: string
  signName: string
  templateCode: string
  status: string
  remark: string
  createTime: string
  updateTime: string
}

let smsConfig: SmsConfig = {
  id: 1,
  provider: 'aliyun',
  accessKeyId: 'LTAI5t*******',
  accessKeySecret: 'K8p0*******',
  signName: '云枢科技',
  templateCode: 'SMS_123456789',
  status: '1',
  remark: '阿里云短信服务',
  createTime: '2024-01-01 10:00:00',
  updateTime: '2024-01-10 14:30:00'
}

// ========== 短信模板数据 ==========
interface SmsTemplate {
  templateId: number
  templateCode: string
  templateName: string
  content: string
  platform: string
  status: string
  remark: string
  createTime: string
  updateTime: string
}

let smsTemplates: SmsTemplate[] = [
  {
    templateId: 1,
    templateCode: 'SMS_LOGIN_CODE',
    templateName: '登录验证码',
    content: '您的登录验证码为：${code}，5分钟内有效。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户登录验证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-05 11:00:00'
  },
  {
    templateId: 2,
    templateCode: 'SMS_REG_CODE',
    templateName: '注册验证码',
    content: '您的注册验证码为：${code}，5分钟内有效。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户注册验证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-05 11:00:00'
  },
  {
    templateId: 3,
    templateCode: 'SMS_PWD_RESET',
    templateName: '密码重置',
    content: '您的密码重置验证码为：${code}，10分钟内有效。',
    platform: 'aliyun',
    status: '1',
    remark: '用于密码重置验证',
    createTime: '2024-01-02 09:00:00',
    updateTime: '2024-01-06 14:00:00'
  },
  {
    templateId: 4,
    templateCode: 'SMS_NOTICE',
    templateName: '系统通知',
    content: '【云枢科技】${content}',
    platform: 'aliyun',
    status: '1',
    remark: '系统通知消息',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-08 15:30:00'
  },
  {
    templateId: 5,
    templateCode: 'SMS_BATCH',
    templateName: '批量通知',
    content: '【云枢科技】${content}，如需帮助请联系客服。',
    platform: 'qcloud',
    status: '0',
    remark: '腾讯云批量通知模板',
    createTime: '2024-01-05 14:00:00',
    updateTime: '2024-01-10 09:00:00'
  }
]

// ========== 短信日志数据 ==========
interface SmsLog {
  logId: number
  phone: string
  templateCode: string
  templateName: string
  content: string
  params: string
  status: string
  sendTime: string
  errorMsg: string
  createTime: string
}

let smsLogs: SmsLog[] = []

// 生成模拟短信日志
for (let i = 1; i <= 100; i++) {
  const status = Math.random() > 0.1 ? '1' : '0'
  const template = smsTemplates[Math.floor(Math.random() * smsTemplates.length)]
  smsLogs.push({
    logId: i,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    templateCode: template.templateCode,
    templateName: template.templateName,
    content: template.content.replace('${code}', String(Math.floor(Math.random() * 9000 + 1000))),
    params: JSON.stringify({ code: Math.floor(Math.random() * 9000 + 1000) }),
    status,
    sendTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
    errorMsg: status === '1' ? '' : ['手机号格式错误', '余额不足', '模板不匹配', '黑名单限制'][Math.floor(Math.random() * 4)],
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
  })
}

export default [
  // ========== 短信配置 ==========
  /**
   * 获取短信配置
   */
  {
    url: '/api/system/sms/config',
    method: 'get',
    response: async () => {
      await delay()
      return success(smsConfig)
    }
  },

  /**
   * 保存短信配置
   */
  {
    url: '/api/system/sms/config',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      smsConfig = {
        ...smsConfig,
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '保存成功')
    }
  },

  /**
   * 测试短信发送
   */
  {
    url: '/api/system/sms/config/test',
    method: 'post',
    response: async ({ body }: { body: { phone: string } }) => {
      await delay()

      if (!body.phone || !/^1[3-9]\d{9}$/.test(body.phone)) {
        return fail('手机号格式不正确')
      }

      return success({
        success: true,
        message: '发送成功'
      }, '测试短信发送成功')
    }
  },

  // ========== 短信模板 ==========
  /**
   * 获取短信模板分页列表
   */
  {
    url: '/api/system/sms/template/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; templateName?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { templateName, status } = query

      let list = [...smsTemplates]

      if (templateName) {
        list = list.filter(t => t.templateName.includes(templateName) || t.templateCode.includes(templateName))
      }
      if (status) {
        list = list.filter(t => t.status === status)
      }

      list.sort((a, b) => b.templateId - a.templateId)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取短信模板列表
   */
  {
    url: '/api/system/sms/template/list',
    method: 'get',
    response: async () => {
      await delay()
      return success(smsTemplates.filter(t => t.status === '1'))
    }
  },

  /**
   * 获取短信模板详情
   */
  {
    url: '/api/system/sms/template/:templateId',
    method: 'get',
    response: async ({ params }: { params: { templateId: string } }) => {
      await delay()

      const template = smsTemplates.find(t => t.templateId === parseInt(params.templateId))
      if (!template) {
        return fail('模板不存在', 404)
      }

      return success(template)
    }
  },

  /**
   * 新增短信模板
   */
  {
    url: '/api/system/sms/template',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (smsTemplates.some(t => t.templateCode === body.templateCode)) {
        return fail('模板编码已存在')
      }

      const maxId = Math.max(...smsTemplates.map(t => t.templateId), 0)
      const newTemplate: SmsTemplate = {
        templateId: maxId + 1,
        templateCode: body.templateCode,
        templateName: body.templateName,
        content: body.content,
        platform: body.platform || 'aliyun',
        status: body.status || '1',
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      smsTemplates.push(newTemplate)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改短信模板
   */
  {
    url: '/api/system/sms/template',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay()

      const index = smsTemplates.findIndex(t => t.templateId === body.templateId)
      if (index === -1) {
        return fail('模板不存在', 404)
      }

      smsTemplates[index] = {
        ...smsTemplates[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除短信模板
   */
  {
    url: '/api/system/sms/template/:templateId',
    method: 'delete',
    response: async ({ params }: { params: { templateId: string } }) => {
      await delay()

      const index = smsTemplates.findIndex(t => t.templateId === parseInt(params.templateId))
      if (index === -1) {
        return fail('模板不存在', 404)
      }

      smsTemplates.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  // ========== 短信发送 ==========
  /**
   * 发送短信
   */
  {
    url: '/api/system/sms/send',
    method: 'post',
    response: async ({ body }: { body: { phones: string[]; templateCode: string; params: Record<string, string> } }) => {
      await delay()

      const { phones, templateCode, params } = body

      if (!phones || phones.length === 0) {
        return fail('请输入手机号')
      }

      if (!templateCode) {
        return fail('请选择短信模板')
      }

      const template = smsTemplates.find(t => t.templateCode === templateCode)
      if (!template) {
        return fail('模板不存在')
      }

      // 模拟发送
      return success({
        successCount: phones.length,
        failCount: 0,
        message: '发送成功'
      }, '发送成功')
    }
  },

  // ========== 短信日志 ==========
  /**
   * 获取短信日志分页列表
   */
  {
    url: '/api/system/sms/log/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; phone?: string; templateCode?: string; status?: string; startTime?: string; endTime?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { phone, templateCode, status, startTime, endTime } = query

      let list = [...smsLogs]

      if (phone) {
        list = list.filter(l => l.phone.includes(phone))
      }
      if (templateCode) {
        list = list.filter(l => l.templateCode === templateCode)
      }
      if (status) {
        list = list.filter(l => l.status === status)
      }

      list.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize

      return pageResult(list.slice(start, end), list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取短信日志详情
   */
  {
    url: '/api/system/sms/log/:logId',
    method: 'get',
    response: async ({ params }: { params: { logId: string } }) => {
      await delay()

      const log = smsLogs.find(l => l.logId === parseInt(params.logId))
      if (!log) {
        return fail('日志不存在', 404)
      }

      return success(log)
    }
  }
] as MockMethod[]
