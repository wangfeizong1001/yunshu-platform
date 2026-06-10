/**
 * 文件管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface FileQuery {
  pageNum?: number
  pageSize?: number
  fileName?: string
  fileType?: string
}

export interface FileForm {
  fileId?: number
  fileName?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  uploadUser?: string
  uploadTime?: string
}

export interface FileInfo {
  fileId: number
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploadUser: string
  uploadTime: string
}

export const getFileList = (params?: FileQuery) => {
  return request<unknown>({
    url: '/system/file/list',
    method: 'GET',
    params
  })
}

export const getFilePage = (params?: FileQuery) => {
  return request<unknown>({
    url: '/system/file/page',
    method: 'GET',
    params
  })
}

export const getFile = (fileId: number) => {
  return request<unknown>({
    url: `/system/file/${fileId}`,
    method: 'GET'
  })
}

export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request<unknown>({
    url: '/system/file/upload',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteFile = (fileId: number) => {
  return request<unknown>({
    url: `/system/file/${fileId}`,
    method: 'DELETE'
  })
}

export const batchDeleteFile = (fileIds: number[]) => {
  return request<unknown>({
    url: '/system/file/batch',
    method: 'DELETE',
    data: fileIds
  })
}

export const downloadFile = (fileId: number) => {
  return request<unknown>({
    url: `/system/file/download/${fileId}`,
    method: 'GET',
    responseType: 'blob'
  })
}

export const previewFile = (fileId: number) => {
  return request<unknown>({
    url: `/system/file/preview/${fileId}`,
    method: 'GET'
  })
}
