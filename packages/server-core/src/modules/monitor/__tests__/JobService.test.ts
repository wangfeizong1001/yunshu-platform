/**
 * 定时任务服务单元测试
 *
 * @module @yunshu/server-core/modules/monitor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JobService } from '../JobService';
import type { IJobCreate, IJobUpdate, IJobExecute } from '@yunshu/shared';

// Mock @yunshu/shared 模块
vi.mock('@yunshu/shared', () => ({
  ErrorCode: {
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
  },
  createSuccessResult: vi.fn((data, message) => ({
    success: true,
    data,
    message,
  })),
  createErrorResult: vi.fn((code, message) => ({
    success: false,
    error: { code, message },
  })),
  createPaginatedResult: vi.fn((data, page, limit, total) => ({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasPrev: page > 1,
      hasNext: page * limit < total,
    },
  })),
}));

// Mock BaseService
vi.mock('../../base/BaseService', () => ({
  BaseService: vi.fn().mockImplementation(() => ({})),
}));

describe('JobService', () => {
  let service: JobService;

  beforeEach(() => {
    service = new JobService();
  });

  describe('findById', () => {
    it('应返回存在的定时任务', async () => {
      const result = await service.findById('1');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.jobId).toBe('1');
    });

    it('不存在的任务应返回错误', async () => {
      const result = await service.findById('999');
      expect(result.success).toBe(false);
    });
  });

  describe('findWithPagination', () => {
    it('应返回分页结果', async () => {
      const result = await service.findWithPagination({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.data).toBeInstanceOf(Array);
    });

    it('应支持关键词搜索', async () => {
      const result = await service.findWithPagination({ search: '备份', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        const job = result.data.data[0];
        expect(
          job.jobName.toLowerCase().includes('备份') ||
            job.invokeTarget.toLowerCase().includes('备份'),
        ).toBe(true);
      }
    });

    it('应支持任务名称筛选', async () => {
      const result = await service.findWithPagination({ jobName: '数据备份', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].jobName).toBe('数据备份');
      }
    });

    it('应支持任务分组筛选', async () => {
      const result = await service.findWithPagination({ jobGroup: 'system', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].jobGroup).toBe('system');
      }
    });

    it('应支持状态筛选', async () => {
      const result = await service.findWithPagination({ status: '1', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].status).toBe('1');
      }
    });

    it('应支持升序排序', async () => {
      const result = await service.findWithPagination({
        sort: 'jobName',
        order: 'asc',
        page: 1,
        limit: 10,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('create', () => {
    it('应成功创建定时任务', async () => {
      const newJob: IJobCreate = {
        jobName: '测试任务',
        jobGroup: 'default',
        invokeTarget: 'testJob.execute',
        cronExpression: '0 0 12 * * ?',
        misfirePolicy: '1',
        concurrent: '1',
        remark: '测试任务备注',
      };
      const result = await service.create(newJob);
      expect(result.success).toBe(true);
      expect(result.data?.jobName).toBe('测试任务');
      expect(result.data?.status).toBe('0');
      expect(result.data?.runCount).toBe(0);
    });
  });

  describe('update', () => {
    it('应成功更新定时任务', async () => {
      const updateData: IJobUpdate = {
        jobName: '更新的任务名称',
      };
      const result = await service.update('1', updateData);
      expect(result.success).toBe(true);
      expect(result.data?.jobName).toBe('更新的任务名称');
    });

    it('更新不存在的任务应返回错误', async () => {
      const result = await service.update('999', { jobName: 'test' });
      expect(result.success).toBe(false);
    });
  });

  describe('delete', () => {
    it('应成功删除定时任务', async () => {
      const result = await service.delete('1');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('删除不存在的任务应返回错误', async () => {
      const result = await service.delete('999');
      expect(result.success).toBe(false);
    });
  });

  describe('execute', () => {
    it('应成功执行定时任务', async () => {
      const executeData: IJobExecute = {
        jobId: '1',
      };
      const result = await service.execute(executeData);
      expect(result.success).toBe(true);
      expect(result.data?.logId).toBeDefined();
    });

    it('执行不存在的任务应返回错误', async () => {
      const result = await service.execute({ jobId: '999' });
      expect(result.success).toBe(false);
    });
  });

  describe('changeStatus', () => {
    it('应成功启用任务', async () => {
      const result = await service.changeStatus('1', '0');
      expect(result.success).toBe(true);
    });

    it('应成功暂停任务', async () => {
      const result = await service.changeStatus('1', '1');
      expect(result.success).toBe(true);
    });

    it('变更不存在的任务状态应返回错误', async () => {
      const result = await service.changeStatus('999', '0');
      expect(result.success).toBe(false);
    });
  });

  describe('findLogsWithPagination', () => {
    it('应返回任务日志分页结果', async () => {
      const result = await service.findLogsWithPagination({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.data).toBeInstanceOf(Array);
    });

    it('应支持任务ID筛选', async () => {
      const result = await service.findLogsWithPagination({ jobId: '1', page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.data?.data.length) {
        expect(result.data.data[0].jobId).toBe('1');
      }
    });

    it('应支持状态筛选', async () => {
      const result = await service.findLogsWithPagination({ status: '0', page: 1, limit: 10 });
      expect(result.success).toBe(true);
    });

    it('应支持时间范围筛选', async () => {
      const beginTime = new Date(Date.now() - 3600000).toISOString();
      const endTime = new Date().toISOString();
      const result = await service.findLogsWithPagination({
        beginTime,
        endTime,
        page: 1,
        limit: 10,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('cleanLogs', () => {
    it('应成功清理所有任务日志', async () => {
      const result = await service.cleanLogs();
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });
});
