/**
 * 在线用户 Mock API
 * @module mock/routes/monitor/online
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import { db } from '../utils/database';

export default [
  /**
   * 获取在线用户分页列表
   */
  {
    url: '/api/monitor/online/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { page?: string; limit?: string; userName?: string };
    }) => {
      await randomDelay();

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const { userName } = query;

      let list = [...db.onlineUsers];

      if (userName) {
        list = list.filter(
          (u) => u.userName.includes(userName) || u.loginAccount.includes(userName),
        );
      }

      list.sort((a, b) => b.loginTime.localeCompare(a.loginTime));

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, page, limit);
    },
  },

  /**
   * 获取在线用户列表
   */
  {
    url: '/api/monitor/online/list',
    method: 'get',
    response: async () => {
      await delay();
      return success(db.onlineUsers);
    },
  },

  /**
   * 获取在线用户统计
   */
  {
    url: '/api/monitor/online/stats',
    method: 'get',
    response: async () => {
      await delay();

      const totalCount = db.onlineUsers.length;
      const pcCount = db.onlineUsers.filter(
        (u) => !u.os.includes('iOS') && !u.os.includes('Android'),
      ).length;
      const mobileCount = totalCount - pcCount;

      return success({
        totalCount,
        pcCount,
        mobileCount,
      });
    },
  },

  /**
   * 强退用户
   */
  {
    url: '/api/monitor/online/:sessionId',
    method: 'delete',
    response: async ({ params }: { params: { sessionId: string } }) => {
      await delay();

      const index = db.onlineUsers.findIndex((u) => u.sessionId === params.sessionId);
      if (index === -1) {
        return fail('用户不存在或已下线', 404);
      }

      db.onlineUsers.splice(index, 1);
      return success(null, '强退成功');
    },
  },

  /**
   * 批量强退用户
   */
  {
    url: '/api/monitor/online/batch',
    method: 'delete',
    response: async ({ body }: { body: { sessionIds: string[] } }) => {
      await delay();

      const { sessionIds } = body;
      if (!sessionIds || sessionIds.length === 0) {
        return fail('请选择要强退的用户');
      }

      const before = db.onlineUsers.length;
      db.onlineUsers = db.onlineUsers.filter((u) => !sessionIds.includes(u.sessionId));
      const after = db.onlineUsers.length;

      return success(null, `强退成功${before - after}人`);
    },
  },
] as MockMethod[];
