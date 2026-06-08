/**
 * OSS 文件存储 API
 */

import { request } from '@/utils/request'
import type {
  OssConfig,
  OssFile,
  OssFileQuery,
  OssFilePageResp,
  OssConfigResp,
  OssUploadResp,
} from '@yunshu/shared/types/oss'

/**
 * 获取文件列表
 * @param params 查询参数
 */
export function getOssFileList(params: OssFileQuery) {
  return request<OssFilePageResp>({
    url: '/system/oss/list',
    method: 'get',
    params,
  })
}

/**
 * 获取文件分页列表
 * @param params 查询参数
 */
export function getOssFilePage(params: OssFileQuery) {
  return request<OssFilePageResp>({
    url: '/system/oss/page',
    method: 'get',
    params,
  })
}

/**
 * 获取文件详情
 * @param fileId 文件ID
 */
export function getOssFileDetail(fileId: number) {
  return request<OssFile>({
    url: `/system/oss/${fileId}`,
    method: 'get',
  })
}

/**
 * 获取 OSS 配置
 */
export function getOssConfig() {
  return request<OssConfigResp>({
    url: '/system/oss/config',
    method: 'get',
  })
}

/**
 * 修改 OSS 配置
 * @param data 配置数据
 */
export function updateOssConfig(data: Partial<OssConfig>) {
  return request<void>({
    url: '/system/oss/config',
    method: 'put',
    data,
  })
}

/**
 * 上传文件
 * @param file 文件
 * @param configId 配置ID
 */
export function uploadOssFile(file: File, configId?: number) {
  const formData = new FormData()
  formData.append('file', file)
  if (configId) {
    formData.append('configId', String(configId))
  }
  return request<OssUploadResp>({
    url: '/system/oss/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 删除文件
 * @param fileId 文件ID
 */
export function deleteOssFile(fileId: number) {
  return request<void>({
    url: `/system/oss/${fileId}`,
    method: 'delete',
  })
}

/**
 * 批量删除文件
 * @param fileIds 文件ID数组
 */
export function batchDeleteOssFile(fileIds: number[]) {
  return request<void>({
    url: '/system/oss/batch',
    method: 'delete',
    data: { fileIds },
  })
}

/**
 * 下载文件
 * @param fileId 文件ID
 */
export function downloadOssFile(fileId: number) {
  return request.download(`/system/oss/download/${fileId}`)
}

/**
 * 预览文件
 * @param fileId 文件ID
 * @returns 文件URL
 */
export function previewOssFile(fileId: number) {
  return request<string>({
    url: `/system/oss/preview/${fileId}`,
    method: 'get',
  })
}

/**
 * 测试 OSS 连接
 * @param data 配置数据
 */
export function testOssConnection(data: Partial<OssConfig>) {
  return request<boolean>({
    url: '/system/oss/test',
    method: 'post',
    data,
  })
}
