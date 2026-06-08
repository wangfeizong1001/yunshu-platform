/**
 * 操作日志 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params
  })
}

export const getOperlogPage = (params?: OperlogQuery) => {
  return request({
    url: '/monitor/operlog/page',
    method: 'get',
    params
  })
}

export const getOperlog = (operId: number) => {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'get'
  })
}

export const deleteOperlog = (operId: number) => {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'delete'
  })
}

export const batchDeleteOperlog = (operIds: number[]) => {
  return request({
    url: '/monitor/operlog/batch',
    method: 'delete',
    data: operIds
  })
}

export const cleanOperlog = () => {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}

