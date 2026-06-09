/**
 * 对象存储控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { OssConfig, OssFile, OssFileQuery, OssStorageType } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟OSS配置数据 */
const mockOssConfigs: OssConfig[] = [
  {
    id: 1,
    accessKey: 'LTAI***********',
    secretKey: '***********',
    bucket: 'yunshu-bucket',
    endpoint: 'oss-cn-shanghai.aliyuncs.com',
    domain: 'https://assets.yunshu.com',
    prefix: 'uploads/',
    type: 'aliyun',
    status: '1',
    remark: '阿里云OSS配置',
    createBy: 'admin',
    createTime: '2024-01-15 08:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
  {
    id: 2,
    accessKey: 'AKID***********',
    secretKey: '***********',
    bucket: 'yunshu-tcloud',
    endpoint: 'cos.ap-shanghai.myqcloud.com',
    domain: 'https://cos.yunshu.com',
    prefix: 'files/',
    type: 'qcloud',
    status: '0',
    remark: '腾讯云COS配置',
    createBy: 'admin',
    createTime: '2024-01-20 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-01 10:30:00',
  },
];

/** 模拟OSS文件数据 */
const mockOssFiles: OssFile[] = [
  {
    id: 1,
    fileName: 'logo.png',
    originalName: '云枢Logo.png',
    filePath: '/uploads/2024/06/logo.png',
    fileSize: 25600,
    fileType: '.png',
    storageType: 'aliyun',
    ossConfigId: 1,
    createBy: 'admin',
    createTime: '2024-06-10 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-10 10:00:00',
    remark: '系统Logo',
  },
  {
    id: 2,
    fileName: 'banner.jpg',
    originalName: '首页横幅.jpg',
    filePath: '/uploads/2024/06/banner.jpg',
    fileSize: 128000,
    fileType: '.jpg',
    storageType: 'aliyun',
    ossConfigId: 1,
    createBy: 'admin',
    createTime: '2024-06-09 15:30:00',
    updateBy: 'admin',
    updateTime: '2024-06-09 15:30:00',
    remark: '首页横幅图',
  },
  {
    id: 3,
    fileName: 'document.pdf',
    originalName: '产品说明文档.pdf',
    filePath: '/files/2024/06/document.pdf',
    fileSize: 1024000,
    fileType: '.pdf',
    storageType: 'qcloud',
    ossConfigId: 2,
    createBy: 'admin',
    createTime: '2024-06-08 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-08 09:00:00',
    remark: '产品文档',
  },
];

export class OssController extends BaseController {
  // ==================== OSS配置管理 ====================

  /**
   * 获取OSS配置列表
   */
  async listConfigs(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockOssConfigs);
  }

  /**
   * 获取OSS配置详情
   */
  async getConfigById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockOssConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, 'OSS配置不存在');
    }

    return this.success(res, config);
  }

  /**
   * 获取当前使用的OSS配置
   */
  async getCurrentConfig(req: Request, res: Response): Promise<Response> {
    const current = mockOssConfigs.find(c => c.status === '1');

    return this.success(res, current || null);
  }

  /**
   * 创建OSS配置
   */
  async createConfig(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    if (!data.accessKey || !data.secretKey || !data.bucket || !data.endpoint || !data.type) {
      return this.badRequest(res, '请填写完整的OSS配置信息');
    }

    const newConfig: OssConfig = {
      id: Math.max(...mockOssConfigs.map(c => c.id)) + 1,
      accessKey: data.accessKey,
      secretKey: data.secretKey,
      bucket: data.bucket,
      endpoint: data.endpoint,
      domain: data.domain || '',
      prefix: data.prefix || '',
      type: data.type as OssStorageType,
      status: data.status || '0',
      remark: data.remark || '',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockOssConfigs.push(newConfig);
    return this.created(res, newConfig, '创建成功');
  }

  /**
   * 更新OSS配置
   */
  async updateConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    const index = mockOssConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, 'OSS配置不存在');
    }

    mockOssConfigs[index] = {
      ...mockOssConfigs[index],
      accessKey: data.accessKey ?? mockOssConfigs[index].accessKey,
      secretKey: data.secretKey ?? mockOssConfigs[index].secretKey,
      bucket: data.bucket ?? mockOssConfigs[index].bucket,
      endpoint: data.endpoint ?? mockOssConfigs[index].endpoint,
      domain: data.domain ?? mockOssConfigs[index].domain,
      prefix: data.prefix ?? mockOssConfigs[index].prefix,
      type: data.type ?? mockOssConfigs[index].type,
      status: data.status ?? mockOssConfigs[index].status,
      remark: data.remark ?? mockOssConfigs[index].remark,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    return this.success(res, mockOssConfigs[index], '更新成功');
  }

  /**
   * 删除OSS配置
   */
  async deleteConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockOssConfigs.findIndex(c => c.id === Number(id));

    if (index === -1) {
      return this.notFound(res, 'OSS配置不存在');
    }

    mockOssConfigs.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 设置默认OSS配置
   */
  async setDefaultConfig(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    mockOssConfigs.forEach(c => {
      c.status = c.id === Number(id) ? '1' : '0';
    });

    return this.success(res, null, '设置默认配置成功');
  }

  /**
   * 测试OSS连接
   */
  async testConnection(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const config = mockOssConfigs.find(c => c.id === Number(id));

    if (!config) {
      return this.notFound(res, 'OSS配置不存在');
    }

    return this.success(res, { success: true, message: '连接测试成功' });
  }

  // ==================== OSS文件管理 ====================

  /**
   * 获取OSS文件分页列表
   */
  async listFiles(req: Request, res: Response): Promise<Response> {
    const params: OssFileQuery = {
      keyword: req.query.keyword as string,
      storageType: req.query.storageType as OssStorageType,
      fileType: req.query.fileType as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockOssFiles];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.fileName.toLowerCase().includes(kw) ||
          f.originalName?.toLowerCase().includes(kw),
      );
    }

    if (params.storageType) {
      filtered = filtered.filter(f => f.storageType === params.storageType);
    }

    if (params.fileType) {
      filtered = filtered.filter(f => f.fileType === params.fileType);
    }

    const total = filtered.length;
    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const rows = filtered.slice(start, end);

    return this.success(res, { total, rows });
  }

  /**
   * 获取OSS文件详情
   */
  async getFileById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const file = mockOssFiles.find(f => f.id === Number(id));

    if (!file) {
      return this.notFound(res, '文件不存在');
    }

    return this.success(res, file);
  }

  /**
   * 上传文件到OSS
   */
  async uploadFile(req: Request, res: Response): Promise<Response> {
    const file = req.file;

    if (!file) {
      return this.badRequest(res, '请选择要上传的文件');
    }

    const currentConfig = mockOssConfigs.find(c => c.status === '1');

    const newFile: OssFile = {
      id: Math.max(...mockOssFiles.map(f => f.id)) + 1,
      fileName: `${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      filePath: `/${currentConfig?.prefix || 'uploads/'}${Date.now()}-${file.originalname}`,
      fileSize: file.size,
      fileType: file.originalname.substring(file.originalname.lastIndexOf('.')),
      storageType: currentConfig?.type || 'aliyun',
      ossConfigId: currentConfig?.id,
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockOssFiles.push(newFile);

    return this.created(res, {
      fileId: newFile.id,
      fileName: newFile.fileName,
      filePath: newFile.filePath,
      fileSize: newFile.fileSize,
      fileType: newFile.fileType,
      url: `${currentConfig?.domain || ''}${newFile.filePath}`,
    }, '上传成功');
  }

  /**
   * 删除OSS文件
   */
  async deleteFile(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockOssFiles.findIndex(f => f.id === Number(id));

    if (index === -1) {
      return this.notFound(res, '文件不存在');
    }

    mockOssFiles.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 批量删除OSS文件
   */
  async batchDeleteFiles(req: Request, res: Response): Promise<Response> {
    const { ids } = req.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return this.badRequest(res, '请选择要删除的文件');
    }

    ids.forEach(id => {
      const index = mockOssFiles.findIndex(f => f.id === id);
      if (index !== -1) {
        mockOssFiles.splice(index, 1);
      }
    });

    return this.success(res, null, '批量删除成功');
  }

  /**
   * 获取存储统计
   */
  async getStorageStats(req: Request, res: Response): Promise<Response> {
    const stats = {
      totalFiles: mockOssFiles.length,
      totalSize: mockOssFiles.reduce((sum, f) => sum + f.fileSize, 0),
      byStorageType: {
        aliyun: mockOssFiles.filter(f => f.storageType === 'aliyun').length,
        qcloud: mockOssFiles.filter(f => f.storageType === 'qcloud').length,
        qiniu: mockOssFiles.filter(f => f.storageType === 'qiniu').length,
        local: mockOssFiles.filter(f => f.storageType === 'local').length,
      },
    };

    return this.success(res, stats);
  }

  /**
   * 导出OSS文件列表
   */
  async exportFiles(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockOssFiles);
  }
}

export const ossController = new OssController();
