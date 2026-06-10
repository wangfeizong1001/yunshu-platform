/**
 * OSS 文件存储 Mock 数据
 */
// OSS 配置 Mock 数据
export const mockOssConfig = {
  id: 1,
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  bucket: 'yunshu-oss',
  endpoint: 'oss-cn-shanghai.aliyuncs.com',
  domain: 'https://static.yunshu.com',
  prefix: 'uploads/',
  type: 'aliyun',
  status: '1',
  remark: '阿里云 OSS 配置',
  createBy: 'admin',
  createTime: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateTime: '2024-01-15 14:30:00',
};
// OSS 配置列表
export const mockOssConfigList = [
  {
    id: 1,
    accessKey: 'ali-access-key',
    secretKey: 'ali-secret-key',
    bucket: 'yunshu-aliyun',
    endpoint: 'oss-cn-shanghai.aliyuncs.com',
    domain: 'https://aliyun.yunshu.com',
    prefix: 'uploads/',
    type: 'aliyun',
    status: '1',
    remark: '阿里云 OSS',
    createBy: 'admin',
    createTime: '2024-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    accessKey: 'qcloud-access-key',
    secretKey: 'qcloud-secret-key',
    bucket: 'yunshu-cos-1251234567',
    endpoint: 'cos.ap-shanghai.myqcloud.com',
    domain: 'https://cos.yunshu.com',
    prefix: 'uploads/',
    type: 'qcloud',
    status: '0',
    remark: '腾讯云 COS',
    createBy: 'admin',
    createTime: '2024-01-02 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-10 11:00:00',
  },
  {
    id: 3,
    accessKey: 'qiniu-access-key',
    secretKey: 'qiniu-secret-key',
    bucket: 'yunshu-qiniu',
    endpoint: 'https://upload.qiniup.com',
    domain: 'https://qiniu.yunshu.com',
    prefix: 'uploads/',
    type: 'qiniu',
    status: '0',
    remark: '七牛云存储',
    createBy: 'admin',
    createTime: '2024-01-03 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-12 15:00:00',
  },
  {
    id: 4,
    accessKey: '',
    secretKey: '',
    bucket: '',
    endpoint: '',
    domain: '',
    prefix: 'uploads/',
    type: 'local',
    status: '1',
    remark: '本地存储（默认）',
    createBy: 'admin',
    createTime: '2024-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-01 10:00:00',
  },
];
// OSS 文件 Mock 数据
export const mockOssFileList = [
  {
    id: 1,
    fileName: '产品需求文档.pdf',
    originalName: '产品需求文档.pdf',
    filePath: '/uploads/files/2024/01/product_requirements.pdf',
    fileSize: 2048576,
    fileType: 'pdf',
    storageType: 'aliyun',
    ossConfigId: 1,
    createBy: 'admin',
    createTime: '2024-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:30:00',
    remark: '',
  },
  {
    id: 2,
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
    id: 3,
    fileName: '财务报表.xlsx',
    originalName: '财务报表_2024年1月.xlsx',
    filePath: '/uploads/files/2024/01/financial_report.xlsx',
    fileSize: 1048576,
    fileType: 'xlsx',
    storageType: 'aliyun',
    ossConfigId: 1,
    createBy: 'admin',
    createTime: '2024-01-13 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-13 09:00:00',
    remark: '',
  },
  {
    id: 4,
    fileName: '系统架构图.jpg',
    originalName: '架构图.jpg',
    filePath: '/uploads/images/2024/01/architecture.jpg',
    fileSize: 1536000,
    fileType: 'jpg',
    storageType: 'qcloud',
    ossConfigId: 2,
    createBy: 'admin',
    createTime: '2024-01-12 14:00:00',
    updateBy: 'admin',
    updateTime: '2024-01-12 14:00:00',
    remark: '',
  },
  {
    id: 5,
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
    id: 6,
    fileName: '演示视频.mp4',
    originalName: '产品演示.mp4',
    filePath: '/uploads/videos/2024/01/demo.mp4',
    fileSize: 52428800,
    fileType: 'mp4',
    storageType: 'aliyun',
    ossConfigId: 1,
    createBy: 'admin',
    createTime: '2024-01-10 16:45:00',
    updateBy: 'admin',
    updateTime: '2024-01-10 16:45:00',
    remark: '',
  },
];
// 获取 OSS 配置 Mock
export function getMockOssConfig() {
  return {
    current: mockOssConfig,
    configs: mockOssConfigList,
  };
}
// 获取 OSS 文件分页列表 Mock
export function getMockOssFilePage(params) {
  const { pageNum = 1, pageSize = 10, keyword = '', storageType = '', fileType = '' } = params;
  let filteredList = [...mockOssFileList];
  if (keyword) {
    filteredList = filteredList.filter(
      (item) => item.fileName.includes(keyword) || item.originalName?.includes(keyword),
    );
  }
  if (storageType) {
    filteredList = filteredList.filter((item) => item.storageType === storageType);
  }
  if (fileType) {
    filteredList = filteredList.filter((item) => item.fileType === fileType);
  }
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const rows = filteredList.slice(start, end);
  return {
    total: filteredList.length,
    rows,
  };
}
// 获取 OSS 文件列表 Mock
export function getMockOssFileList(params) {
  const { storageType = '' } = params || {};
  if (storageType) {
    return mockOssFileList.filter((item) => item.storageType === storageType);
  }
  return mockOssFileList;
}
// 获取 OSS 文件详情 Mock
export function getMockOssFileDetail(fileId) {
  return mockOssFileList.find((item) => item.id === fileId);
}
// 上传 OSS 文件 Mock
export function uploadMockOssFile(file, configId) {
  const storageType = configId === 1 ? 'aliyun' : configId === 2 ? 'qcloud' : 'local';
  const newFile = {
    id: Math.max(...mockOssFileList.map((u) => u.id)) + 1,
    fileName: file.name,
    originalName: file.name,
    filePath: `/uploads/files/2024/01/${Date.now()}_${file.name}`,
    fileSize: file.size,
    fileType: file.name.split('.').pop() || '',
    storageType: storageType,
    ossConfigId: configId,
    createBy: 'admin',
    createTime: new Date().toLocaleString(),
    updateBy: 'admin',
    updateTime: new Date().toLocaleString(),
  };
  mockOssFileList.push(newFile);
  return {
    fileId: newFile.id,
    fileName: newFile.fileName,
    filePath: newFile.filePath,
    fileSize: newFile.fileSize,
    fileType: newFile.fileType,
    url: `https://cdn.yunshu.com${newFile.filePath}`,
  };
}
// 删除 OSS 文件 Mock
export function deleteMockOssFile(fileId) {
  const index = mockOssFileList.findIndex((u) => u.id === fileId);
  if (index !== -1) {
    mockOssFileList.splice(index, 1);
    return true;
  }
  return false;
}
// 批量删除 OSS 文件 Mock
export function batchDeleteMockOssFile(fileIds) {
  let deleted = false;
  fileIds.forEach((fileId) => {
    const index = mockOssFileList.findIndex((u) => u.id === fileId);
    if (index !== -1) {
      mockOssFileList.splice(index, 1);
      deleted = true;
    }
  });
  return deleted;
}
//# sourceMappingURL=oss.mock.js.map
