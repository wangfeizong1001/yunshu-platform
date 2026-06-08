/**
 * 短信服务 API
 */

import { request } from '@/utils/request'
import type {
  SmsConfig,
  SmsTemplate,
  SmsTemplateQuery,
  SmsTemplatePageResp,
  SmsLog,
  SmsLogQuery,
  SmsLogPageResp,
  SmsSendReq,
  SmsSendResp,
} from '@yunshu/shared/types/sms'

/**
 * 获取短信配置
 */
export function getSmsConfig() {
  return request<SmsConfig>({
    url: '/system/sms/config',
    method: 'get',
  })
}

/**
 * 修改短信配置
 * @param data 配置数据
 */
export function updateSmsConfig(data: Partial<SmsConfig>) {
  return request<void>({
    url: '/system/sms/config',
    method: 'put',
    data,
  })
}

/**
 * 获取短信模板列表
 * @param params 查询参数
 */
export function getSmsTemplateList(params: SmsTemplateQuery) {
  return request<SmsTemplatePageResp>({
    url: '/system/sms/template/list',
    method: 'get',
    params,
  })
}

/**
 * 获取短信模板详情
 * @param id 模板ID
 */
export function getSmsTemplateDetail(id: number) {
  return request<SmsTemplate>({
    url: `/system/sms/template/${id}`,
    method: 'get',
  })
}

/**
 * 新增短信模板
 * @param data 模板数据
 */
export function createSmsTemplate(data: Partial<SmsTemplate>) {
  return request<void>({
    url: '/system/sms/template',
    method: 'post',
    data,
  })
}

/**
 * 修改短信模板
 * @param data 模板数据
 */
export function updateSmsTemplate(data: Partial<SmsTemplate>) {
  return request<void>({
    url: '/system/sms/template',
    method: 'put',
    data,
  })
}

/**
 * 删除短信模板
 * @param id 模板ID
 */
export function deleteSmsTemplate(id: number) {
  return request<void>({
    url: `/system/sms/template/${id}`,
    method: 'delete',
  })
}

/**
 * 发送短信
 * @param data 发送参数
 */
export function sendSms(data: SmsSendReq) {
  return request<SmsSendResp>({
    url: '/system/sms/send',
    method: 'post',
    data,
  })
}

/**
 * 批量发送短信
 * @param mobiles 手机号列表
 * @param templateCode 模板CODE
 * @param params 模板参数
 */
export function batchSendSms(mobiles: string[], templateCode: string, params?: Record<string, string>) {
  return request<SmsSendResp[]>({
    url: '/system/sms/batch/send',
    method: 'post',
    data: { mobiles, templateCode, params },
  })
}

/**
 * 获取短信日志列表
 * @param params 查询参数
 */
export function getSmsLogList(params: SmsLogQuery) {
  return request<SmsLogPageResp>({
    url: '/system/sms/log/list',
    method: 'get',
    params,
  })
}

/**
 * 获取短信日志详情
 * @param id 日志ID
 */
export function getSmsLogDetail(id: number) {
  return request<SmsLog>({
    url: `/system/sms/log/${id}`,
    method: 'get',
  })
}

/**
 * 测试短信发送
 * @param data 发送参数
 */
export function testSmsSend(data: SmsSendReq) {
  return request<SmsSendResp>({
    url: '/system/sms/test',
    method: 'post',
    data,
  })
}
