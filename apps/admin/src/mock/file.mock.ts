/**
 * 文件管理 Mock 数据
 */

import type { SysFile, SysFilePageResp, SysFileUploadResp } from '@yunshu/shared/types/system'

// 文件管理 Mock 数据
export const mockFileList: SysFile[] = [
  {
    fileId: 1,
    fileName: '产品需求文档.pdf',
    originalName: '产品需求文档.pdf',
    filePath: '/uploads/files/2024/01/product_requirements.pdf',
    fileSize: 2048576,
    fileType: 'pdf',
    storageType: 'local',
    createBy: 'admin',
    createTime: '2024-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:30:00',
    remark: '',
  },
  {
    fileId: 2,
    fileName: '用户头像.png',
    originalName: 'avatar.png',
    filePath: '/uploads/images/2024/01/avatar_001.png',
    fileSize: 51200,
    fileType: 'png',
    storageType: 'local',
    createBy: 'admin',
    createTime: '2024-01-14 15:20:00',
    updateBy: 'admin',
    updateTime: '2024-01-14 15:20:00',
    remark: '',
  },
  {
    fileId: 3,
    fileName: '财务报表.xlsx',
    originalName: '财务报表_2024年1月.xlsx',
    filePath: '/uploads/files/2024/01/financial_report.xlsx',
    fileSize: 1048576,
    fileType: 'xlsx',
    storageType: 'oss',
    ossConfig: 'aliyun-oss',
    createBy: 'admin',
    createTime: '2024-01-13 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-13 09:00:00',
    remark: '',
  },
  {
    fileId: 4,
    fileName: '系统架构图.jpg',
    originalName: '架构图.jpg',
    filePath: '/uploads/images/2024/01/architecture.jpg',
    fileSize: 1536000,
    fileType: 'jpg',
    storageType: 'local',
    createBy: 'admin',
    createTime: '2024-01-12 14:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-12 14:00:00',
    remark: '',
  },
  {
    fileId: 5,
    fileName: '接口文档.docx',
    originalName: '接口文档v2.docx',
    filePath: '/uploads/files/2024/01/api_docs.docx',
    fileSize: 819200,
    fileType: 'docx',
    storageType: 'local',
    createBy: 'admin',
    createTime: '2024-01-11 11:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-11 11:30:00',
    remark: '',
  },
  {
    fileId: 6,
    fileName: '演示视频.mp4',
    originalName: '产品演示.mp4',
    filePath: '/uploads/videos/2024/01/demo.mp4',
    fileSize: 52428800,
    fileType: 'mp4',
    storageType: 'oss',
    ossConfig: 'aliyun-oss',
    createBy: 'admin',
    createTime: '2024-01-10 16:45:00',
    updateBy: 'admin',
    updateTime: '2024-01-10 16:45:00',
    remark: '',
  },
]

// 获取文件分页列表 Mock
export function getMockFilePage(params: any): SysFilePageResp {
  const { pageNum = 1, pageSize = 10, keyword = '', storageType = '', fileType = '' } = params

  let filteredList = mockFileList

  if (keyword) {
    filteredList = filteredList.filter(
      (item) =>
        item.fileName.includes(keyword) ||
        item.originalName?.includes(keyword)
    )
  }

  if (storageType) {
    filteredList = filteredList.filter((item) => item.storageType === storageType)
  }

  if (fileType) {
    filteredList = filteredList.filter((item) => item.fileType === fileType)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取文件详情 Mock
export function getMockFileDetail(fileId: number): SysFile | undefined {
  return mockFileList.find((item) => item.fileId === fileId)
}

// 上传文件 Mock
export function uploadMockFile(file: File): SysFileUploadResp {
  const newFile: SysFile = {
    fileId: Math.max(...mockFileList.map((u) => u.fileId)) + 1,
    fileName: file.name,
    originalName: file.name,
    filePath: `/uploads/files/2024/01/${Date.now()}_${file.name}`,
    fileSize: file.size,
    fileType: file.name.split('.').pop() || '',
    storageType: 'local',
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
    updateBy: 'admin',
    updateTime: new Date().toLocaleString(),
  }
  mockFileList.push(newFile)
  return {
    fileId: newFile.fileId,
    fileName: newFile.fileName,
    filePath: newFile.filePath,
    fileSize: newFile.fileSize,
    fileType: newFile.fileType,
  }
}

// 删除文件 Mock
export function deleteMockFile(fileId: number): boolean {
  const index = mockFileList.findIndex((u) => u.fileId === fileId)
  if (index !== -1) {
    mockFileList.splice(index, 1)
    return true
  }
  return false
}

// 批量删除文件 Mock
export function batchDeleteMockFile(fileIds: number[]): boolean {
  let deleted = false
  fileIds.forEach((fileId) => {
    const index = mockFileList.findIndex((u) => u.fileId === fileId)
    if (index !== -1) {
      mockFileList.splice(index, 1)
      deleted = true
    }
  })
  return deleted
}
