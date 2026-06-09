/**
 * 短信服务 API
 */

import request from '@/utils/request'

export interface SmsQuery {
  pageNum?: number
  pageSize?: number
  phone?: string
  type?: string
}

export interface SmsForm {
  smsId?: number
  phone?: string
  type?: string
  content?: string
  status?: string
  sendTime?: string
  remark?: string
}

export interface SmsInfo {
  smsId: number
  phone: string
  type: string
  content: string
  status: string
  sendTime: string
  remark: string
}

export interface SmsConfig {
  smsType: string
  accessKey: string
  secretKey: string
  region: string
  signName: string
  templateCode: string
}

export const getSmsList = (params?: SmsQuery) => {
  return request({
    url: '/system/sms/list',
    method: 'get',
    params
  })
}

export const getSmsPage = (params?: SmsQuery) => {
  return request({
    url: '/system/sms/page',
    method: 'get',
    params
  })
}

export const getSms = (smsId: number) => {
  return request({
    url: `/system/sms/${smsId}`,
    method: 'get'
  })
}

export const getSmsConfig = () => {
  return request({
    url: '/system/sms/config',
    method: 'get'
  })
}

export const saveSmsConfig = (data: SmsConfig) => {
  return request({
    url: '/system/sms/config',
    method: 'post',
    data
  })
}

export const sendSms = (phone: string, content: string) => {
  return request({
    url: '/system/sms/send',
    method: 'post',
    data: { phone, content }
  })
}

// 获取短信日志列表
export const getSmsLogList = (params?: SmsQuery) => {
  return request({
    url: '/system/sms/log/page',
    method: 'get',
    params
  })
}
