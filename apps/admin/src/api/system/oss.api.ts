/**
 * OSS文件存储 API
 */

import request from '@/utils/request'

export interface OssQuery {
  pageNum?: number
  pageSize?: number
  fileName?: string
  bucketName?: string
}

export interface OssForm {
  ossId?: number
  fileName?: string
  originalName?: string
  fileSuffix?: string
  url?: string
  bucketName?: string
  fileSize?: number
}

export interface OssInfo {
  ossId: number
  fileName: string
  originalName: string
  fileSuffix: string
  url: string
  bucketName: string
  fileSize: number
  createTime: string
}

export interface OssConfig {
  ossType: string
  endpoint: string
  accessKey: string
  secretKey: string
  bucketName: string
  domain: string
  region: string
}

export const getOssList = (params?: OssQuery) => {
  return request({
    url: '/system/oss/list',
    method: 'get',
    params
  })
}

export const getOssPage = (params?: OssQuery) => {
  return request({
    url: '/system/oss/page',
    method: 'get',
    params
  })
}

export const getOss = (ossId: number) => {
  return request({
    url: `/system/oss/${ossId}`,
    method: 'get'
  })
}

export const getOssConfig = () => {
  return request({
    url: '/system/oss/config',
    method: 'get'
  })
}

export const uploadOss = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/system/oss/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteOss = (ossId: number) => {
  return request({
    url: `/system/oss/${ossId}`,
    method: 'delete'
  })
}

export const batchDeleteOss = (ossIds: number[]) => {
  return request({
    url: '/system/oss/batch',
    method: 'delete',
    data: ossIds
  })
}

export const downloadOss = (ossId: number) => {
  return request({
    url: `/system/oss/download/${ossId}`,
    method: 'get',
    responseType: 'blob'
  })
}
