/**
 * 文件管理控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { SysFile, SysFileQuery } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟文件数据 */
const mockFiles: SysFile[] = [
  {
    fileId: 1,
    fileName: 'logo.png',
    originalName: '云枢Logo.png',
    filePath: '/uploads/2024/06/logo.png',
    fileSize: 25600,
    fileType: '.png',
    storageType: 'oss',
    createBy: 'admin',
    createTime: '2024-06-10 10:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-10 10:00:00',
    remark: '系统Logo',
  },
  {
    fileId: 2,
    fileName: 'avatar.jpg',
    originalName: '用户头像.jpg',
    filePath: '/uploads/2024/06/avatar.jpg',
    fileSize: 51200,
    fileType: '.jpg',
    storageType: 'oss',
    createBy: 'admin',
    createTime: '2024-06-09 15:30:00',
    updateBy: 'admin',
    updateTime: '2024-06-09 15:30:00',
    remark: '用户头像',
  },
  {
    fileId: 3,
    fileName: 'document.pdf',
    originalName: '产品说明文档.pdf',
    filePath: '/uploads/2024/06/document.pdf',
    fileSize: 1024000,
    fileType: '.pdf',
    storageType: 'oss',
    createBy: 'admin',
    createTime: '2024-06-08 09:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-08 09:00:00',
    remark: '产品文档',
  },
  {
    fileId: 4,
    fileName: 'video.mp4',
    originalName: '产品演示视频.mp4',
    filePath: '/uploads/2024/06/video.mp4',
    fileSize: 51200000,
    fileType: '.mp4',
    storageType: 'oss',
    createBy: 'admin',
    createTime: '2024-06-07 14:00:00',
    updateBy: 'admin',
    updateTime: '2024-06-07 14:00:00',
    remark: '演示视频',
  },
];

export class FileController extends BaseController {
  /**
   * 获取文件分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: SysFileQuery = {
      keyword: req.query.keyword as string,
      storageType: req.query.storageType as SysFileQuery['storageType'],
      fileType: req.query.fileType as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageNum: Number(req.query.pageNum) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    };

    let filtered = [...mockFiles];

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
   * 获取文件详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const file = mockFiles.find(f => f.fileId === Number(id));

    if (!file) {
      return this.notFound(res, '文件不存在');
    }

    return this.success(res, file);
  }

  /**
   * 上传文件
   */
  async upload(req: Request, res: Response): Promise<Response> {
    const file = req.file;

    if (!file) {
      return this.badRequest(res, '请选择要上传的文件');
    }

    const newFile: SysFile = {
      fileId: Math.max(...mockFiles.map(f => f.fileId)) + 1,
      fileName: file.originalname,
      originalName: file.originalname,
      filePath: `/uploads/${Date.now()}-${file.originalname}`,
      fileSize: file.size,
      fileType: file.originalname.substring(file.originalname.lastIndexOf('.')),
      storageType: 'oss',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN'),
    };

    mockFiles.push(newFile);

    return this.created(res, {
      fileId: newFile.fileId,
      fileName: newFile.fileName,
      filePath: newFile.filePath,
      fileSize: newFile.fileSize,
      fileType: newFile.fileType,
    }, '上传成功');
  }

  /**
   * 下载文件
   */
  async download(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const file = mockFiles.find(f => f.fileId === Number(id));

    if (!file) {
      return this.notFound(res, '文件不存在');
    }

    return this.success(res, {
      fileId: file.fileId,
      fileName: file.fileName,
      filePath: file.filePath,
      fileSize: file.fileSize,
    });
  }

  /**
   * 删除文件
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const index = mockFiles.findIndex(f => f.fileId === Number(id));

    if (index === -1) {
      return this.notFound(res, '文件不存在');
    }

    mockFiles.splice(index, 1);
    return this.success(res, null, '删除成功');
  }

  /**
   * 批量删除文件
   */
  async batchDelete(req: Request, res: Response): Promise<Response> {
    const { ids } = req.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return this.badRequest(res, '请选择要删除的文件');
    }

    ids.forEach(id => {
      const index = mockFiles.findIndex(f => f.fileId === id);
      if (index !== -1) {
        mockFiles.splice(index, 1);
      }
    });

    return this.success(res, null, '批量删除成功');
  }

  /**
   * 更新文件信息
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { remark } = req.body;
    const file = mockFiles.find(f => f.fileId === Number(id));

    if (!file) {
      return this.notFound(res, '文件不存在');
    }

    file.remark = remark || file.remark;
    file.updateTime = new Date().toLocaleString('zh-CN');

    return this.success(res, file, '更新成功');
  }

  /**
   * 获取存储使用统计
   */
  async getStorageStats(req: Request, res: Response): Promise<Response> {
    const stats = {
      totalFiles: mockFiles.length,
      totalSize: mockFiles.reduce((sum, f) => sum + f.fileSize, 0),
      byStorageType: {
        local: mockFiles.filter(f => f.storageType === 'local').length,
        oss: mockFiles.filter(f => f.storageType === 'oss').length,
        cos: mockFiles.filter(f => f.storageType === 'cos').length,
      },
      byFileType: {
        image: mockFiles.filter(f => ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(f.fileType)).length,
        video: mockFiles.filter(f => ['.mp4', '.avi', '.mov', '.wmv'].includes(f.fileType)).length,
        document: mockFiles.filter(f => ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(f.fileType)).length,
        other: mockFiles.filter(f => !['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mov', '.wmv', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(f.fileType)).length,
      },
    };

    return this.success(res, stats);
  }

  /**
   * 导出文件列表
   */
  async export(req: Request, res: Response): Promise<Response> {
    return this.success(res, mockFiles);
  }
}

export const fileController = new FileController();
