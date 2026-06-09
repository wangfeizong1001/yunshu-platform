/**
 * 定时任务控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { JobController } from '../JobController';

// Mock 服务层
vi.mock('@yunshu/server-core/modules/monitor', () => ({
  jobService: {
    findById: vi.fn(),
    findWithPagination: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
    changeStatus: vi.fn(),
    findLogsWithPagination: vi.fn(),
    cleanLogs: vi.fn(),
  },
}));

import { jobService } from '@yunshu/server-core/modules/monitor';

describe('JobController', () => {
  let controller: JobController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;
  let statusCode: number;

  beforeEach(() => {
    controller = new JobController();
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
    };

    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应返回分页任务列表', async () => {
      const mockResult = {
        success: true,
        data: {
          data: [
            { jobId: '1', jobName: '数据备份', jobGroup: 'system', status: '0' },
          ],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
        },
      };

      (jobService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jobService.findWithPagination).toHaveBeenCalledWith({
        search: undefined,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined,
        page: 1,
        limit: 10,
        sort: undefined,
        order: undefined,
      });
    });

    it('应支持搜索和筛选参数', async () => {
      const mockResult = { success: true, data: { data: [], pagination: {} } };
      (jobService.findWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: {
          search: '备份',
          jobName: '数据备份',
          jobGroup: 'system',
          status: '0',
          page: '1',
          limit: '10',
        },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jobService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '备份',
          jobName: '数据备份',
          jobGroup: 'system',
          status: '0',
        }),
      );
    });
  });

  describe('getById', () => {
    it('应返回指定ID的任务详情', async () => {
      const mockJob = { jobId: '1', jobName: '数据备份' };
      (jobService.findById as any).mockResolvedValue({ success: true, data: mockJob });

      mockRequest = { params: { id: '1' } };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(jobService.findById).toHaveBeenCalledWith('1');
    });

    it('不存在的任务应返回错误', async () => {
      (jobService.findById as any).mockResolvedValue({
        success: false,
        error: { message: '定时任务不存在' },
      });

      mockRequest = { params: { id: '999' } };

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(false);
    });
  });

  describe('create', () => {
    it('应成功创建定时任务', async () => {
      const newJob = {
        jobName: '测试任务',
        invokeTarget: 'testJob.execute',
        cronExpression: '0 0 12 * * ?',
      };
      const mockResult = { success: true, data: { jobId: '10', ...newJob } };
      (jobService.create as any).mockResolvedValue(mockResult);

      mockRequest = { body: newJob };

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(201);
      expect(jobService.create).toHaveBeenCalledWith(newJob);
    });

    it('缺少必填字段应返回400错误', async () => {
      mockRequest = { body: { jobName: '测试任务' } };

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
      expect(jsonData.success).toBe(false);
    });
  });

  describe('update', () => {
    it('应成功更新定时任务', async () => {
      const updateData = { jobName: '更新后的任务' };
      const mockResult = { success: true, data: { jobId: '1', ...updateData } };
      (jobService.update as any).mockResolvedValue(mockResult);

      mockRequest = { params: { id: '1' }, body: updateData };

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(jobService.update).toHaveBeenCalledWith('1', { jobId: '1', ...updateData });
    });
  });

  describe('delete', () => {
    it('应成功删除定时任务', async () => {
      (jobService.delete as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { params: { id: '1' } };

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(jobService.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('execute', () => {
    it('应成功执行定时任务', async () => {
      const mockResult = { success: true, data: { logId: '100' } };
      (jobService.execute as any).mockResolvedValue(mockResult);

      mockRequest = { body: { jobId: '1' } };

      await controller.execute(mockRequest as Request, mockResponse as Response);

      expect(jobService.execute).toHaveBeenCalledWith({ jobId: '1' });
    });

    it('缺少jobId应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.execute(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('changeStatus', () => {
    it('应成功更改任务状态', async () => {
      const mockResult = { success: true, data: { jobId: '1', status: '0' } };
      (jobService.changeStatus as any).mockResolvedValue(mockResult);

      mockRequest = { body: { id: '1', status: '0' } };

      await controller.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(jobService.changeStatus).toHaveBeenCalledWith('1', '0');
    });

    it('缺少参数应返回400错误', async () => {
      mockRequest = { body: { id: '1' } };

      await controller.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('listLogs', () => {
    it('应返回任务日志分页列表', async () => {
      const mockResult = {
        success: true,
        data: {
          data: [{ logId: '1', jobId: '1', status: '0' }],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      };
      (jobService.findLogsWithPagination as any).mockResolvedValue(mockResult);

      mockRequest = {
        query: { jobId: '1', page: '1', limit: '10' },
      };

      await controller.listLogs(mockRequest as Request, mockResponse as Response);

      expect(jobService.findLogsWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ jobId: '1' }),
      );
    });
  });

  describe('cleanLogs', () => {
    it('应成功清空任务日志', async () => {
      (jobService.cleanLogs as any).mockResolvedValue({ success: true, data: true });

      mockRequest = { body: {} };

      await controller.cleanLogs(mockRequest as Request, mockResponse as Response);

      expect(jobService.cleanLogs).toHaveBeenCalled();
    });
  });
});
