/**
 * 岗位管理 Mock API
 * @module mock/routes/system/post
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../../utils/response';
import { delay, randomDelay } from '../../utils/delay';
import { db, type Post } from '../../utils/database';

export default [
  /**
   * 获取岗位分页列表
   */
  {
    url: '/api/system/post/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; keyword?: string; status?: string };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { keyword, status } = query;

      let list = [...db.posts];

      if (keyword) {
        list = list.filter((p) => p.postName.includes(keyword) || p.postCode.includes(keyword));
      }
      if (status) {
        list = list.filter((p) => p.status === status);
      }

      list.sort((a, b) => a.postSort - b.postSort);

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取岗位列表
   */
  {
    url: '/api/system/post/list',
    method: 'get',
    response: async ({ query }: { query: { keyword?: string; status?: string } }) => {
      await delay();

      const { keyword, status } = query;

      let list = [...db.posts];

      if (keyword) {
        list = list.filter((p) => p.postName.includes(keyword) || p.postCode.includes(keyword));
      }
      if (status) {
        list = list.filter((p) => p.status === status);
      }

      return success(list);
    },
  },

  /**
   * 获取岗位详情
   */
  {
    url: '/api/system/post/:postId',
    method: 'get',
    response: async ({ params }: { params: { postId: string } }) => {
      await delay();

      const post = db.posts.find((p) => p.postId === parseInt(params.postId));
      if (!post) {
        return fail('岗位不存在', 404);
      }

      return success(post);
    },
  },

  /**
   * 新增岗位
   */
  {
    url: '/api/system/post',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      if (db.posts.some((p) => p.postCode === body.postCode)) {
        return fail('岗位编码已存在');
      }

      const maxId = Math.max(...db.posts.map((p) => p.postId));
      const newPost: Post = {
        postId: maxId + 1,
        postCode: body.postCode,
        postName: body.postName,
        postSort: body.postSort || db.posts.length + 1,
        status: body.status || '0',
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      db.posts.push(newPost);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改岗位
   */
  {
    url: '/api/system/post/:postId',
    method: 'put',
    response: async ({ params, body }: { params: { postId: string }; body: any }) => {
      await delay();

      const index = db.posts.findIndex((p) => p.postId === parseInt(params.postId));
      if (index === -1) {
        return fail('岗位不存在', 404);
      }

      if (
        body.postCode &&
        db.posts.some((p) => p.postCode === body.postCode && p.postId !== parseInt(params.postId))
      ) {
        return fail('岗位编码已存在');
      }

      db.posts[index] = {
        ...db.posts[index],
        ...body,
        postId: parseInt(params.postId),
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除岗位
   */
  {
    url: '/api/system/post/:postId',
    method: 'delete',
    response: async ({ params }: { params: { postId: string } }) => {
      await delay();

      const postId = parseInt(params.postId);

      // 检查是否有用户使用此岗位
      if (db.users.some((u) => u.postId.includes(postId))) {
        return fail('岗位下存在用户，无法删除');
      }

      const index = db.posts.findIndex((p) => p.postId === postId);
      if (index === -1) {
        return fail('岗位不存在', 404);
      }

      db.posts.splice(index, 1);
      return success(null, '删除成功');
    },
  },
] as MockMethod[];
