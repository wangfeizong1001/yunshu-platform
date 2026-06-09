/**
 * 短信服务 Mock 数据
 */

import type {
  SmsConfig,
  SmsTemplate,
  SmsTemplatePageResp,
  SmsLog,
  SmsLogPageResp,
  SmsSendResp,
} from '@yunshu/shared'

// 短信配置 Mock 数据
export const mockSmsConfig: SmsConfig = {
  id: 1,
  platform: 'aliyun',
  accessKey: 'ali-access-key',
  secretKey: 'ali-secret-key',
  signName: '云枢中台',
  templateCode: 'SMS_123456789',
  status: '1',
  createBy: 'admin',
  createTime: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateTime: '2024-01-15 14:30:00',
}

// 短信模板 Mock 数据
export const mockSmsTemplateList: SmsTemplate[] = [
  {
    id: 1,
    templateCode: 'SMS_123456789',
    templateName: '登录验证码',
    content: '您的登录验证码为：${code}，5分钟内有效，请勿泄露给他人。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户登录验证',
    createBy: 'admin',
    createTime: '2024-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    templateCode: 'SMS_123456790',
    templateName: '注册验证码',
    content: '您的注册验证码为：${code}，5分钟内有效，请勿泄露给他人。',
    platform: 'aliyun',
    status: '1',
    remark: '用于用户注册验证',
    createBy: 'admin',
    createTime: '2024-01-02 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-16 09:00:00',
  },
  {
    id: 3,
    templateCode: 'SMS_223456789',
    templateName: '密码重置验证码',
    content: '您正在重置密码，验证码为：${code}，5分钟内有效。',
    platform: 'qcloud',
    status: '1',
    remark: '用于密码重置',
    createBy: 'admin',
    createTime: '2024-01-03 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-17 10:00:00',
  },
  {
    id: 4,
    templateCode: 'SMS_123456791',
    templateName: '订单通知',
    content: '您的订单${orderId}已发货，预计${deliveryDate}送达，请注意查收。',
    platform: 'aliyun',
    status: '0',
    remark: '订单发货通知',
    createBy: 'admin',
    createTime: '2024-01-04 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-18 11:00:00',
  },
  {
    id: 5,
    templateCode: 'SMS_123456792',
    templateName: '活动通知',
    content: '尊敬的用户，${activityName}活动即将开始，期待您的参与！',
    platform: 'aliyun',
    status: '1',
    remark: '营销活动通知',
    createBy: 'admin',
    createTime: '2024-01-05 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-19 12:00:00',
  },
]

// 短信日志 Mock 数据
export const mockSmsLogList: SmsLog[] = [
  {
    id: 1,
    mobile: '13800138000',
    templateCode: 'SMS_123456789',
    params: '{"code":"123456"}',
    content: '您的登录验证码为：123456，5分钟内有效，请勿泄露给他人。',
    status: '1',
    sendTime: '2024-01-15 10:30:00',
    errorMsg: '',
    createBy: 'system',
    createTime: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    mobile: '13800138001',
    templateCode: 'SMS_123456790',
    params: '{"code":"654321"}',
    content: '您的注册验证码为：654321，5分钟内有效，请勿泄露给他人。',
    status: '1',
    sendTime: '2024-01-15 11:00:00',
    errorMsg: '',
    createBy: 'system',
    createTime: '2024-01-15 11:00:00',
  },
  {
    id: 3,
    mobile: '13800138002',
    templateCode: 'SMS_123456789',
    params: '{"code":"111111"}',
    content: '您的登录验证码为：111111，5分钟内有效，请勿泄露给他人。',
    status: '0',
    sendTime: '2024-01-15 11:30:00',
    errorMsg: '手机号格式错误',
    createBy: 'system',
    createTime: '2024-01-15 11:30:00',
  },
  {
    id: 4,
    mobile: '13800138003',
    templateCode: 'SMS_223456789',
    params: '{"code":"222222"}',
    content: '您正在重置密码，验证码为：222222，5分钟内有效。',
    status: '1',
    sendTime: '2024-01-15 12:00:00',
    errorMsg: '',
    createBy: 'system',
    createTime: '2024-01-15 12:00:00',
  },
  {
    id: 5,
    mobile: '13800138004',
    templateCode: 'SMS_123456791',
    params: '{"orderId":"ORDER20240115001","deliveryDate":"2024-01-18"}',
    content: '您的订单ORDER20240115001已发货，预计2024-01-18送达，请注意查收。',
    status: '1',
    sendTime: '2024-01-15 14:00:00',
    errorMsg: '',
    createBy: 'system',
    createTime: '2024-01-15 14:00:00',
  },
  {
    id: 6,
    mobile: '13800138005',
    templateCode: 'SMS_123456792',
    params: '{"activityName":"新年特惠活动"}',
    content: '尊敬的用户，新年特惠活动即将开始，期待您的参与！',
    status: '0',
    sendTime: '2024-01-15 15:00:00',
    errorMsg: '模板未启用',
    createBy: 'system',
    createTime: '2024-01-15 15:00:00',
  },
]

// 获取短信配置 Mock
export function getMockSmsConfig(): SmsConfig {
  return mockSmsConfig
}

// 获取短信模板列表 Mock
export function getMockSmsTemplatePage(params: any): SmsTemplatePageResp {
  const { pageNum = 1, pageSize = 10, keyword = '', platform = '', status = '' } = params

  let filteredList = [...mockSmsTemplateList]

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.templateCode.includes(keyword) ||
        item.templateName.includes(keyword) ||
        item.content.includes(keyword)
    )
  }

  if (platform) {
    filteredList = filteredList.filter((item) => item.platform === platform)
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取短信模板详情 Mock
export function getMockSmsTemplateDetail(id: number): SmsTemplate | undefined {
  return mockSmsTemplateList.find((item) => item.id === id)
}

// 获取短信日志列表 Mock
export function getMockSmsLogPage(params: any): SmsLogPageResp {
  const { pageNum = 1, pageSize = 10, mobile = '', templateCode = '', status = '', startDate = '', endDate = '' } = params

  let filteredList = [...mockSmsLogList]

  if (mobile) {
    filteredList = filteredList.filter((item) => item.mobile.includes(mobile))
  }

  if (templateCode) {
    filteredList = filteredList.filter((item) => item.templateCode === templateCode)
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  if (startDate) {
    filteredList = filteredList.filter((item) => item.sendTime >= startDate)
  }

  if (endDate) {
    filteredList = filteredList.filter((item) => item.sendTime <= endDate)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 发送短信 Mock
export function sendMockSms(params: { mobile: string; templateCode: string; params?: Record<string, string> }): SmsSendResp {
  const template = mockSmsTemplateList.find((t) => t.templateCode === params.templateCode)

  if (!template) {
    return {
      success: false,
      errorMsg: '模板不存在',
    }
  }

  if (template.status === '0') {
    return {
      success: false,
      errorMsg: '模板未启用',
    }
  }

  // 模拟发送成功
  const newLog: SmsLog = {
    id: Math.max(...mockSmsLogList.map((l) => l.id)) + 1,
    mobile: params.mobile,
    templateCode: params.templateCode,
    params: JSON.stringify(params.params || {}),
    content: template.content,
    status: '1',
    sendTime: new Date().toLocaleString(),
    errorMsg: '',
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
  }
  mockSmsLogList.unshift(newLog)

  return {
    success: true,
    messageId: `MSG${Date.now()}`,
  }
}

// 测试短信发送 Mock
export function testMockSmsSend(params: { mobile: string; templateCode: string; params?: Record<string, string> }): SmsSendResp {
  if (!params.mobile.match(/^1[3-9]\d{9}$/)) {
    return {
      success: false,
      errorMsg: '手机号格式不正确',
    }
  }

  return {
    success: true,
    messageId: `TEST${Date.now()}`,
  }
}
