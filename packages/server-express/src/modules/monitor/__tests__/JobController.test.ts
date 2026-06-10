/**
 * 定时任务控制器单元测试
 *
 * @module @yunshu/server-express/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';
import { JobController } from '../JobController';

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
      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data).toBeDefined();
      expect(jsonData.data.rows).toBeDefined();
    });

    it('应支持搜索和筛选参数', async () => {
      mockRequest = {
        query: {
          search: '数据',
          jobName: '数据',
          jobGroup: 'SYSTEM',
          status: '0',
          page: '1',
          limit: '10',
        },
      };

      await controller.list(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(Array.isArray(jsonData.data.rows)).toBe(true);
    });
  });

  describe('getById', () => {
    it('应返回指定ID的任务详情', async () => {
      mockRequest = { params: { id: '1' } };

      await controller.getDetail(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.jobId).toBe('1');
    });

    it('不存在的任务应返回404', async () => {
      mockRequest = { params: { id: '999' } };

      await controller.getDetail(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(404);
    });
  });

  describe('create', () => {
    it('应成功创建定时任务', async () => {
      const newJob = {
        jobName: '测试任务',
        invokeTarget: 'testJob.execute',
        cronExpression: '0 0 12 * * ?',
      };
      mockRequest = { body: newJob };

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(201);
      expect(jsonData.data.jobName).toBe('测试任务');
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
      mockRequest = { params: { id: '1' }, body: updateData };

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('应成功删除定时任务', async () => {
      mockRequest = { params: { id: '1' } };

      await controller.remove(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });

  describe('execute', () => {
    it('应成功执行定时任务', async () => {
      mockRequest = { body: { jobId: '1' } };

      await controller.run(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });

    it('缺少jobId应返回400错误', async () => {
      mockRequest = { body: {} };

      await controller.run(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('changeStatus', () => {
    it('应成功更改任务状态', async () => {
      mockRequest = { body: { id: '1', status: '0' } };

      await controller.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.status).toBe('0');
    });

    it('缺少参数应返回400错误', async () => {
      mockRequest = { body: { id: '1' } };

      await controller.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(statusCode).toBe(400);
    });
  });

  describe('listLogs', () => {
    it('应返回任务日志分页列表', async () => {
      mockRequest = {
        query: { jobId: '1', page: '1', limit: '10' },
      };

      await controller.getLogList(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
      expect(jsonData.data.rows).toBeDefined();
    });
  });

  describe('cleanLogs', () => {
    it('应成功清空任务日志', async () => {
      mockRequest = { body: {} };

      await controller.cleanLog(mockRequest as Request, mockResponse as Response);

      expect(jsonData.success).toBe(true);
    });
  });
});
