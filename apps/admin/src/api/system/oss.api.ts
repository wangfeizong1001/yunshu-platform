/**
 * OSS文件存储 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

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
  return request<{ rows: OssInfo[]; total: number }>({
    url: '/system/oss/list',
    method: 'GET',
    params
  })
}

export const getOssPage = (params?: OssQuery) => {
  return request<{ rows: OssInfo[]; total: number }>({
    url: '/system/oss/page',
    method: 'GET',
    params
  })
}

export const getOss = (ossId: number) => {
  return request<OssInfo>({
    url: `/system/oss/${ossId}`,
    method: 'GET'
  })
}

export const getOssConfig = () => {
  return request<OssConfig>({
    url: '/system/oss/config',
    method: 'GET'
  })
}

export const uploadOss = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request<void>({
    url: '/system/oss/upload',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteOss = (ossId: number) => {
  return request<void>({
    url: `/system/oss/${ossId}`,
    method: 'DELETE'
  })
}

export const batchDeleteOss = (ossIds: number[]) => {
  return request<void>({
    url: '/system/oss/batch',
    method: 'DELETE',
    data: ossIds
  })
}

export const downloadOss = (ossId: number) => {
  return request<Blob>({
    url: `/system/oss/download/${ossId}`,
    method: 'GET',
    responseType: 'blob'
  })
}
