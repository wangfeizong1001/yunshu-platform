/**
 * 操作日志 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface OperlogQuery {
  pageNum?: number
  pageSize?: number
  title?: string
  operName?: string
  businessType?: string
  status?: string
  startTime?: string
  endTime?: string
}

export interface OperlogInfo {
  operId: number
  title: string
  businessType: string
  method: string
  requestMethod: string
  operatorType: string
  operName: string
  deptName: string
  operUrl: string
  operIp: string
  operLocation: string
  operParam: string
  jsonResult: string
  status: string
  errorMsg: string
  operTime: string
  costTime: number
}

export const getOperlogList = (params?: OperlogQuery) => {
  return request<unknown>({
    url: '/monitor/operlog/list',
    method: 'GET',
    params
  })
}

export const getOperlogPage = (params?: OperlogQuery) => {
  return request<unknown>({
    url: '/monitor/operlog/page',
    method: 'GET',
    params
  })
}

export const getOperlog = (operId: number) => {
  return request<unknown>({
    url: `/monitor/operlog/${operId}`,
    method: 'GET'
  })
}

export const deleteOperlog = (operId: number) => {
  return request<unknown>({
    url: `/monitor/operlog/${operId}`,
    method: 'DELETE'
  })
}

export const batchDeleteOperlog = (operIds: number[]) => {
  return request<unknown>({
    url: '/monitor/operlog/batch',
    method: 'DELETE',
    data: operIds
  })
}

export const cleanOperlog = () => {
  return request<unknown>({
    url: '/monitor/operlog/clean',
    method: 'DELETE'
  })
}

