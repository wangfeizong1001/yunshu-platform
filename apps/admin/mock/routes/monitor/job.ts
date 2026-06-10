/**
 * 定时任务 Mock API
 * @module mock/routes/monitor/job
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import { db, type Job, type JobLog } from '../utils/database';

export default [
  /**
   * 获取任务分页列表
   */
  {
    url: '/api/monitor/job/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: {
        page?: string;
        limit?: string;
        jobName?: string;
        jobGroup?: string;
        status?: string;
      };
    }) => {
      await randomDelay();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const { jobName, jobGroup, status } = query;

      let list = [...db.jobs];

      if (jobName) {
        list = list.filter((j) => j.jobName.includes(jobName));
      }
      if (jobGroup) {
        list = list.filter((j) => j.jobGroup === jobGroup);
      }
      if (status) {
        list = list.filter((j) => j.status === status);
      }

      list.sort((a, b) => a.createTime.localeCompare(b.createTime));

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, page, limit);
    },
  },

  /**
   * 获取任务列表
   */
  {
    url: '/api/monitor/job/list',
    method: 'get',
    response: async ({ query }: { query: { jobName?: string; status?: string } }) => {
      await delay();

      const { jobName, status } = query;

      let list = [...db.jobs];

      if (jobName) {
        list = list.filter((j) => j.jobName.includes(jobName));
      }
      if (status) {
        list = list.filter((j) => j.status === status);
      }

      return success(list);
    },
  },

  /**
   * 获取任务详情
   */
  {
    url: '/api/monitor/job/:jobId',
    method: 'get',
    response: async ({ params }: { params: { jobId: string } }) => {
      await delay();

      const job = db.jobs.find((j) => j.jobId === params.jobId);
      if (!job) {
        return fail('任务不存在', 404);
      }

      return success(job);
    },
  },

  /**
   * 新增任务
   */
  {
    url: '/api/monitor/job',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      const maxId = Math.max(...db.jobs.map((j) => parseInt(j.jobId)));
      const newJob: Job = {
        jobId: String(maxId + 1),
        jobName: body.jobName,
        jobGroup: body.jobGroup || 'default',
        invokeTarget: body.invokeTarget,
        cronExpression: body.cronExpression,
        misfirePolicy: body.misfirePolicy || '0',
        concurrent: body.concurrent || '0',
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        nextValidTime: '2024-02-01 00:00:00',
        remark: body.remark || '',
      };

      db.jobs.push(newJob);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改任务
   */
  {
    url: '/api/monitor/job/:jobId',
    method: 'put',
    response: async ({ params, body }: { params: { jobId: string }; body: any }) => {
      await delay();

      const index = db.jobs.findIndex((j) => j.jobId === params.jobId);
      if (index === -1) {
        return fail('任务不存在', 404);
      }

      db.jobs[index] = {
        ...db.jobs[index],
        ...body,
        jobId: params.jobId,
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除任务
   */
  {
    url: '/api/monitor/job/:jobId',
    method: 'delete',
    response: async ({ params }: { params: { jobId: string } }) => {
      await delay();

      const index = db.jobs.findIndex((j) => j.jobId === params.jobId);
      if (index === -1) {
        return fail('任务不存在', 404);
      }

      db.jobs.splice(index, 1);
      return success(null, '删除成功');
    },
  },

  /**
   * 修改任务状态
   */
  {
    url: '/api/monitor/job/:jobId/status',
    method: 'put',
    response: async ({ params, body }: { params: { jobId: string }; body: { status: string } }) => {
      await delay();

      const job = db.jobs.find((j) => j.jobId === params.jobId);
      if (!job) {
        return fail('任务不存在', 404);
      }

      job.status = body.status;
      return success(null, '状态修改成功');
    },
  },

  /**
   * 执行一次任务
   */
  {
    url: '/api/monitor/job/:jobId/execute',
    method: 'post',
    response: async ({ params }: { params: { jobId: string } }) => {
      await delay(1000); // 执行任务需要更长时间

      const job = db.jobs.find((j) => j.jobId === params.jobId);
      if (!job) {
        return fail('任务不存在', 404);
      }

      // 添加执行日志
      const newLog: JobLog = {
        logId: String(Date.now()),
        jobId: job.jobId,
        jobName: job.jobName,
        jobGroup: job.jobGroup,
        invokeTarget: job.invokeTarget,
        status: Math.random() > 0.1 ? '0' : '1',
        executeTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        costTime: Math.floor(Math.random() * 5000) + 500,
        message: '执行成功',
        error: undefined,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      db.jobLogs.unshift(newLog);

      return success(null, '执行成功');
    },
  },

  /**
   * 获取任务日志分页列表
   */
  {
    url: '/api/monitor/job/log/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { page?: string; limit?: string; jobName?: string; jobId?: string; status?: string };
    }) => {
      await randomDelay();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const { jobName, jobId, status } = query;

      let list = [...db.jobLogs];

      if (jobName) {
        list = list.filter((log) => log.jobName.includes(jobName));
      }
      if (jobId) {
        list = list.filter((log) => log.jobId === jobId);
      }
      if (status) {
        list = list.filter((log) => log.status === status);
      }

      list.sort((a, b) => b.executeTime.localeCompare(a.executeTime));

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, page, limit);
    },
  },

  /**
   * 清空任务日志
   */
  {
    url: '/api/monitor/job/log/clean',
    method: 'delete',
    response: async () => {
      await delay();
      const count = db.jobLogs.length;
      db.jobLogs = [];
      return success(null, `清空成功${count}条`);
    },
  },
] as MockMethod[];
