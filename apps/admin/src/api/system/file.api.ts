/**
 * 文件管理 API
 */

import { request } from '@/utils/request'
import type { SysFile, SysFileQuery, SysFilePageResp, SysFileUploadResp } from '@yunshu/shared/types/system'

/**
 * 获取文件分页列表
 * @param params 查询参数
 */
export function getFilePage(params: SysFileQuery) {
  return request<SysFilePageResp>({
    url: '/system/file/page',
    method: 'get',
    params,
  })
}

/**
 * 获取文件列表
 * @param params 查询参数
 */
export function getFileList(params?: SysFileQuery) {
  return request<SysFile[]>({
    url: '/system/file/list',
    method: 'get',
    params,
  })
}

/**
 * 获取文件详情
 * @param fileId 文件ID
 */
export function getFileDetail(fileId: number) {
  return request<SysFile>({
    url: `/system/file/${fileId}`,
    method: 'get',
  })
}

/**
 * 上传文件
 * @param file 文件
 */
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<SysFileUploadResp>({
    url: '/system/file/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 上传多个文件
 * @param files 文件列表
 */
export function uploadMultipleFiles(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return request<SysFileUploadResp[]>({
    url: '/system/file/upload/multiple',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 删除文件
 * @param fileId 文件ID
 */
export function deleteFile(fileId: number) {
  return request<void>({
    url: `/system/file/${fileId}`,
    method: 'delete',
  })
}

/**
 * 批量删除文件
 * @param fileIds 文件ID数组
 */
export function batchDeleteFile(fileIds: number[]) {
  return request<void>({
    url: '/system/file/batch',
    method: 'delete',
    data: { fileIds },
  })
}

/**
 * 下载文件
 * @param fileId 文件ID
 */
export function downloadFile(fileId: number) {
  return request.download(`/system/file/download/${fileId}`)
}

/**
 * 预览文件
 * @param fileId 文件ID
 * @returns 文件URL
 */
export function previewFile(fileId: number) {
  return request<string>({
    url: `/system/file/preview/${fileId}`,
    method: 'get',
  })
}
