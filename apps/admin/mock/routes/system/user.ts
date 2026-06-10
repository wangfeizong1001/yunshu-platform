/**
 * 用户管理 Mock API
 * @module mock/routes/system/user
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import { db, type User } from '../utils/database';

/** 部门名称映射 */
function getDeptName(deptId: number): string {
  const dept = db.depts.find((d) => d.deptId === deptId);
  return dept?.deptName || '';
}

/** 格式化用户数据 */
function formatUser(user: User) {
  return {
    ...user,
    deptName: getDeptName(user.deptId),
    posts: db.posts.filter((p) => user.postId.includes(p.postId)).map((p) => p.postName),
    roles: db.roles
      .filter((r) => user.roleId.includes(r.roleId))
      .map((r) => ({ roleId: r.roleId, roleName: r.roleName, roleKey: r.roleKey })),
  };
}

export default [
  /**
   * 获取用户分页列表
   */
  {
    url: '/api/system/user/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: {
        pageNum?: string;
        pageSize?: string;
        keyword?: string;
        status?: string;
        deptId?: string;
      };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { keyword, status, deptId } = query;

      let list = [...db.users];

      // 筛选
      if (keyword) {
        list = list.filter(
          (u) =>
            u.username.includes(keyword) ||
            u.nickname.includes(keyword) ||
            u.email.includes(keyword) ||
            u.phone.includes(keyword),
        );
      }
      if (status) {
        list = list.filter((u) => u.status === status);
      }
      if (deptId) {
        list = list.filter((u) => u.deptId === parseInt(deptId));
      }

      // 排序
      list.sort((a, b) => b.userId - a.userId);

      // 分页
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end).map(formatUser);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取用户列表
   */
  {
    url: '/api/system/user/list',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { keyword?: string; status?: string; deptId?: string };
    }) => {
      await delay();

      const { keyword, status, deptId } = query;

      let list = [...db.users];

      if (keyword) {
        list = list.filter((u) => u.username.includes(keyword) || u.nickname.includes(keyword));
      }
      if (status) {
        list = list.filter((u) => u.status === status);
      }
      if (deptId) {
        list = list.filter((u) => u.deptId === parseInt(deptId));
      }

      return success(list.map(formatUser));
    },
  },

  /**
   * 获取用户详情
   */
  {
    url: '/api/system/user/:userId',
    method: 'get',
    response: async ({ params }: { params: { userId: string } }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      return success(formatUser(user));
    },
  },

  /**
   * 新增用户
   */
  {
    url: '/api/system/user',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      // 检查用户名是否已存在
      if (db.users.some((u) => u.username === body.username)) {
        return fail('用户名已存在');
      }

      const maxId = Math.max(...db.users.map((u) => u.userId));
      const newUser: User = {
        userId: maxId + 1,
        username: body.username,
        password: body.password || '123456',
        nickname: body.nickname,
        email: body.email || '',
        phone: body.phone || '',
        sex: body.sex || '0',
        avatar: body.avatar || '',
        status: body.status || '0',
        deptId: body.deptId || 100,
        postId: body.postId || [],
        roleId: body.roleId || [],
        loginIp: '',
        loginDate: '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || '',
      };

      db.users.push(newUser);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改用户
   */
  {
    url: '/api/system/user/:userId',
    method: 'put',
    response: async ({ params, body }: { params: { userId: string }; body: any }) => {
      await delay();

      const index = db.users.findIndex((u) => u.userId === parseInt(params.userId));
      if (index === -1) {
        return fail('用户不存在', 404);
      }

      // 检查用户名是否与其他用户冲突
      if (
        body.username &&
        db.users.some((u) => u.username === body.username && u.userId !== parseInt(params.userId))
      ) {
        return fail('用户名已存在');
      }

      db.users[index] = {
        ...db.users[index],
        ...body,
        userId: parseInt(params.userId), // 确保 userId 不被修改
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除用户
   */
  {
    url: '/api/system/user/:userId',
    method: 'delete',
    response: async ({ params }: { params: { userId: string } }) => {
      await delay();

      const index = db.users.findIndex((u) => u.userId === parseInt(params.userId));
      if (index === -1) {
        return fail('用户不存在', 404);
      }

      // 不允许删除超级管理员
      if (parseInt(params.userId) === 1) {
        return fail('不能删除超级管理员');
      }

      db.users.splice(index, 1);
      return success(null, '删除成功');
    },
  },

  /**
   * 批量删除用户
   */
  {
    url: '/api/system/user/batch',
    method: 'delete',
    response: async ({ body }: { body: { userIds: number[] } }) => {
      await delay();

      const { userIds } = body;
      if (!userIds || userIds.length === 0) {
        return fail('请选择要删除的用户');
      }

      // 过滤掉超级管理员
      const idsToDelete = userIds.filter((id) => id !== 1);
      db.users = db.users.filter((u) => !idsToDelete.includes(u.userId));

      return success(null, `删除成功${idsToDelete.length}条`);
    },
  },

  /**
   * 修改用户状态
   */
  {
    url: '/api/system/user/:userId/status',
    method: 'put',
    response: async ({
      params,
      body,
    }: {
      params: { userId: string };
      body: { status: string };
    }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      user.status = body.status;
      return success(null, '状态修改成功');
    },
  },

  /**
   * 重置用户密码
   */
  {
    url: '/api/system/user/:userId/password',
    method: 'put',
    response: async ({
      params,
      body,
    }: {
      params: { userId: string };
      body: { password: string };
    }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      user.password = body.password || '123456';
      return success(null, '密码重置成功');
    },
  },

  /**
   * 导出用户
   */
  {
    url: '/api/system/user/export',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        downloadUrl: '/downloads/user_export.xlsx',
      });
    },
  },

  /**
   * 获取用户岗位列表
   */
  {
    url: '/api/system/user/:userId/posts',
    method: 'get',
    response: async ({ params }: { params: { userId: string } }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      return success(user.postId);
    },
  },

  /**
   * 分配用户岗位
   */
  {
    url: '/api/system/user/:userId/posts',
    method: 'put',
    response: async ({
      params,
      body,
    }: {
      params: { userId: string };
      body: { postIds: number[] };
    }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      user.postId = body.postIds || [];
      return success(null, '岗位分配成功');
    },
  },

  /**
   * 获取用户角色列表
   */
  {
    url: '/api/system/user/:userId/roles',
    method: 'get',
    response: async ({ params }: { params: { userId: string } }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      return success(user.roleId);
    },
  },

  /**
   * 分配用户角色
   */
  {
    url: '/api/system/user/:userId/roles',
    method: 'put',
    response: async ({
      params,
      body,
    }: {
      params: { userId: string };
      body: { roleIds: number[] };
    }) => {
      await delay();

      const user = db.users.find((u) => u.userId === parseInt(params.userId));
      if (!user) {
        return fail('用户不存在', 404);
      }

      user.roleId = body.roleIds || [];
      return success(null, '角色分配成功');
    },
  },
] as MockMethod[];
