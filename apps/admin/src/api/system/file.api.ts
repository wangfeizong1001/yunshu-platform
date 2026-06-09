/**
 * 文件管理 API
 */

import request from '@/utils/request'

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
  return request({
    url: '/system/file/list',
    method: 'get',
    params
  })
}

export const getFilePage = (params?: FileQuery) => {
  return request({
    url: '/system/file/page',
    method: 'get',
    params
  })
}

export const getFile = (fileId: number) => {
  return request({
    url: `/system/file/${fileId}`,
    method: 'get'
  })
}

export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/system/file/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteFile = (fileId: number) => {
  return request({
    url: `/system/file/${fileId}`,
    method: 'delete'
  })
}

export const batchDeleteFile = (fileIds: number[]) => {
  return request({
    url: '/system/file/batch',
    method: 'delete',
    data: fileIds
  })
}

export const downloadFile = (fileId: number) => {
  return request({
    url: `/system/file/download/${fileId}`,
    method: 'get',
    responseType: 'blob'
  })
}

export const previewFile = (fileId: number) => {
  return request({
    url: `/system/file/preview/${fileId}`,
    method: 'get'
  })
}
