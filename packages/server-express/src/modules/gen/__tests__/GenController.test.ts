/**
 * 代码生成控制器单元测试
 *
 * @module @yunshu/server-express/modules/gen
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { GenController } from '../GenController';

// Mock GenService
vi.mock('../GenService', () => ({
  GenService: vi.fn().mockImplementation(() => ({
    getTablePage: vi.fn(),
    getTableList: vi.fn(),
    getTableDetail: vi.fn(),
    saveConfig: vi.fn(),
    getConfigList: vi.fn(),
    deleteConfig: vi.fn(),
    previewCode: vi.fn(),
    generateCode: vi.fn(),
    generateCodeZip: vi.fn(),
  })),
  genService: {
    getTablePage: vi.fn(),
    getTableList: vi.fn(),
    getTableDetail: vi.fn(),
    saveConfig: vi.fn(),
    getConfigList: vi.fn(),
    deleteConfig: vi.fn(),
    previewCode: vi.fn(),
    generateCode: vi.fn(),
    generateCodeZip: vi.fn(),
  },
}));

import { genService } from '../GenService';

describe('GenController', () => {
  let controller: GenController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;
  let statusCode: number;

  beforeEach(() => {
    controller = new GenController();
    jsonData = null;
    statusCode = 200;

    mockResponse = {
      status: vi.fn().mockImplementation((code) => {
        statusCode = code;
        return mockResponse;
      }) as any,
      json: vi.fn().mockImplementation((data) => {
        jsonData = data;
        return mockResponse;
      }) as any,
      setHeader: vi.fn() as any,
      send: vi.fn().mockImplementation((_data) => {
        return mockResponse;
      }) as any,
    };

    vi.clearAllMocks();
  });

  describe('getTablePage', () => {
    it('应返回分页数据库表列表', async () => {
      const mockResult = {
        data: {
          data: [{ tableName: 'sys_user', tableComment: '用户表' }],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      };

      (genService.getTablePage as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      await controller.getTablePage(mockRequest as Request, mockResponse as Response);

      expect(genService.getTablePage).toHaveBeenCalledWith({
        search: undefined,
        tableName: undefined,
        tableComment: undefined,
        page: 1,
        limit: 10,
        sort: 'createTime',
        order: 'desc',
      });
      expect(statusCode).toBe(200);
      expect(jsonData.success).toBe(true);
    });

    it('应支持搜索和筛选参数', async () => {
      const mockResult = { data: { data: [], pagination: {} } };
      (genService.getTablePage as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: {
          search: 'user',
          tableName: 'sys_user',
          tableComment: '用户',
          page: '1',
          limit: '10',
        },
      };

      await controller.getTablePage(mockRequest as Request, mockResponse as Response);

      expect(genService.getTablePage).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'user',
          tableName: 'sys_user',
        }),
      );
    });
  });

  describe('getTableList', () => {
    it('应返回所有数据库表列表', async () => {
      const mockTables = [
        { tableName: 'sys_user', tableComment: '用户表' },
        { tableName: 'sys_role', tableComment: '角色表' },
      ];
      (genService.getTableList as any).mockResolvedValue(mockTables);

      mockRequest = { body: {} };

      await controller.getTableList(mockRequest as Request, mockResponse as Response);

      expect(genService.getTableList).toHaveBeenCalled();
      expect(jsonData.success).toBe(true);
    });
  });

  describe('getTableDetail', () => {
    it('应返回表详情（包含字段信息）', async () => {
      const mockColumns = [
        { columnName: 'user_id', dataType: 'bigint', columnComment: '用户ID' },
      ];
      (genService.getTableDetail as any).mockResolvedValue(mockColumns);

      mockRequest = { params: { tableName: 'sys_user' } };

      await controller.getTableDetail(mockRequest as Request, mockResponse as Response);

      expect(genService.getTableDetail).toHaveBeenCalledWith('sys_user');
      expect(jsonData.success).toBe(true);
    });

    it('缺少表名应返回400错误', async () => {
      mockRequest = { params: {} };

      await controller.getTableDetail(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('getConfig', () => {
    it('应返回生成配置', async () => {
      const mockColumns = [{ columnName: 'user_id', dataType: 'bigint' }];
      (genService.getTableDetail as any).mockResolvedValue(mockColumns);

      mockRequest = { params: { tableName: 'sys_user' } };

      await controller.getConfig(mockRequest as Request, mockResponse as Response);

      expect(genService.getTableDetail).toHaveBeenCalledWith('sys_user');
      expect(jsonData.success).toBe(true);
      expect(jsonData.data.config.tableName).toBe('sys_user');
      expect(jsonData.data.columns).toEqual(mockColumns);
    });

    it('缺少表名应返回400错误', async () => {
      mockRequest = { params: {} };

      await controller.getConfig(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('saveConfig', () => {
    it('应成功保存生成配置', async () => {
      const config = {
        tableName: 'sys_user',
        className: 'SysUser',
        moduleName: 'system',
      };
      const mockResult = { ...config, genId: '1' };
      (genService.saveConfig as any).mockResolvedValue(mockResult);

      mockRequest = { body: config };

      await controller.saveConfig(mockRequest as Request, mockResponse as Response);

      expect(genService.saveConfig).toHaveBeenCalledWith(config);
      expect(statusCode).toBe(201);
    });

    it('缺少tableName应返回400错误', async () => {
      mockRequest = { body: { className: 'SysUser' } };

      await controller.saveConfig(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });

    it('缺少className应返回400错误', async () => {
      mockRequest = { body: { tableName: 'sys_user' } };

      await controller.saveConfig(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('getConfigList', () => {
    it('应返回生成配置列表', async () => {
      const mockConfigs = [{ tableName: 'sys_user', className: 'SysUser' }];
      (genService.getConfigList as any).mockResolvedValue(mockConfigs);

      mockRequest = { body: {} };

      await controller.getConfigList(mockRequest as Request, mockResponse as Response);

      expect(genService.getConfigList).toHaveBeenCalled();
      expect(jsonData.success).toBe(true);
    });
  });

  describe('deleteConfig', () => {
    it('应成功删除生成配置', async () => {
      (genService.deleteConfig as any).mockResolvedValue(true);

      mockRequest = { params: { genId: '1' } };

      await controller.deleteConfig(mockRequest as Request, mockResponse as Response);

      expect(genService.deleteConfig).toHaveBeenCalledWith('1');
      expect(jsonData.success).toBe(true);
    });

    it('缺少genId应返回400错误', async () => {
      mockRequest = { params: {} };

      await controller.deleteConfig(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('previewCode', () => {
    it('应成功预览生成的代码', async () => {
      const config = { tableName: 'sys_user' };
      const mockPreview = {
        tableName: 'sys_user',
        files: [{ fileName: 'SysUser.java', filePath: 'entity/SysUser.java' }],
      };
      (genService.getTableDetail as any).mockResolvedValue([{ columnName: 'user_id' }]);
      (genService.previewCode as any).mockResolvedValue(mockPreview);

      mockRequest = { body: config };

      await controller.previewCode(mockRequest as Request, mockResponse as Response);

      expect(genService.previewCode).toHaveBeenCalled();
      expect(jsonData.success).toBe(true);
    });

    it('缺少tableName应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.previewCode(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('generateCode', () => {
    it('应成功生成代码', async () => {
      const config = { tableName: 'sys_user' };
      const mockResult = { tableName: 'sys_user', fileCount: 8 };
      (genService.getTableDetail as any).mockResolvedValue([{ columnName: 'user_id' }]);
      (genService.generateCode as any).mockResolvedValue(mockResult);

      mockRequest = { body: config };

      await controller.generateCode(mockRequest as Request, mockResponse as Response);

      expect(genService.generateCode).toHaveBeenCalled();
      expect(jsonData.success).toBe(true);
    });

    it('缺少tableName应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.generateCode(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('downloadCode', () => {
    it('应成功下载代码ZIP包', async () => {
      const zipBuffer = Buffer.from('PK\u00123...');
      (genService.getTableDetail as any).mockResolvedValue([{ columnName: 'user_id' }]);
      (genService.generateCodeZip as any).mockResolvedValue(zipBuffer);

      mockRequest = {
        params: { tableName: 'sys_user' },
        query: { className: 'SysUser', moduleName: 'system' },
      };

      await controller.downloadCode(mockRequest as Request, mockResponse as Response);

      expect(genService.generateCodeZip).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/zip');
    });

    it('缺少tableName应返回400错误', async () => {
      mockRequest = { params: {}, query: {} };

      await controller.downloadCode(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });

    it('生成失败时应返回500错误', async () => {
      (genService.getTableDetail as any).mockResolvedValue([{ columnName: 'user_id' }]);
      (genService.generateCodeZip as any).mockRejectedValue(new Error('生成失败'));

      mockRequest = { params: { tableName: 'sys_user' }, query: {} };

      await controller.downloadCode(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(500);
    });
  });

  describe('syncTable', () => {
    it('应成功同步表结构', async () => {
      const mockColumns = [{ columnName: 'user_id', dataType: 'bigint' }];
      (genService.getTableDetail as any).mockResolvedValue(mockColumns);

      mockRequest = { params: { tableName: 'sys_user' } };

      await controller.syncTable(mockRequest as Request, mockResponse as Response);

      expect(genService.getTableDetail).toHaveBeenCalledWith('sys_user');
      expect(jsonData.success).toBe(true);
    });

    it('缺少tableName应返回400错误', async () => {
      mockRequest = { params: {} };

      await controller.syncTable(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });
});
