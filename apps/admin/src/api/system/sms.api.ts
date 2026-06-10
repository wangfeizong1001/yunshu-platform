/**
 * 短信服务 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

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
  return request<{ rows: SmsInfo[]; total: number }>({
    url: '/system/sms/list',
    method: 'GET',
    params
  })
}

export const getSmsPage = (params?: SmsQuery) => {
  return request<{ rows: SmsInfo[]; total: number }>({
    url: '/system/sms/page',
    method: 'GET',
    params
  })
}

export const getSms = (smsId: number) => {
  return request<SmsInfo>({
    url: `/system/sms/${smsId}`,
    method: 'GET'
  })
}

export const getSmsConfig = () => {
  return request<SmsConfig>({
    url: '/system/sms/config',
    method: 'GET'
  })
}

export const saveSmsConfig = (data: SmsConfig) => {
  return request<void>({
    url: '/system/sms/config',
    method: 'POST',
    data
  })
}

export const sendSms = (phone: string, content: string) => {
  return request<void>({
    url: '/system/sms/send',
    method: 'POST',
    data: { phone, content }
  })
}

export const getSmsLogList = (params?: SmsQuery) => {
  return request<{ rows: SmsInfo[]; total: number }>({
    url: '/system/sms/log/page',
    method: 'GET',
    params
  })
}
