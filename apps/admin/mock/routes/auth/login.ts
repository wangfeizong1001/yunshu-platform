/**
 * 认证相关 Mock API
 * @module mock/routes/auth
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import { db } from '../utils/database';

export default [
  /**
   * 用户登录
   */
  {
    url: '/api/auth/login',
    method: 'post',
    response: async ({
      body,
    }: {
      body: { username: string; password: string; code?: string; uuid?: string };
    }) => {
      await randomDelay(200, 500);

      const { username, password } = body;

      if (!username || !password) {
        return fail('用户名或密码不能为空', 400);
      }

      const user = db.users.find((u) => u.username === username);

      if (!user) {
        return fail('用户名或密码错误', 401);
      }

      if (user.password !== password) {
        return fail('用户名或密码错误', 401);
      }

      if (user.status === '1') {
        return fail('账号已被停用', 401);
      }

      // 更新登录信息
      user.loginIp = '127.0.0.1';
      user.loginDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

      // 获取用户角色
      const roles = db.roles.filter((r) => user.roleId.includes(r.roleId)).map((r) => r.roleKey);

      // 获取用户权限
      const permissions = roles.includes('admin')
        ? ['*:*:*']
        : db.roles.filter((r) => user.roleId.includes(r.roleId)).flatMap((r) => r.permissions);

      return success(
        {
          token: `mock-token-${Date.now()}-${user.userId}`,
          expires: 720,
          userId: user.userId,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          roles,
          permissions,
        },
        '登录成功',
      );
    },
  },

  /**
   * 用户登出
   */
  {
    url: '/api/auth/logout',
    method: 'post',
    response: async () => {
      await delay(100);
      return success(null, '退出成功');
    },
  },

  /**
   * 获取用户信息
   */
  {
    url: '/api/auth/userinfo',
    method: 'get',
    response: async (options: { headers?: { authorization?: string } }) => {
      await delay();

      const token = options.headers?.authorization;
      if (!token) {
        return fail('未授权', 401);
      }

      // 从 token 中提取用户 ID（mock 实现）
      const tokenMatch = token.match(/mock-token-.*-(\d+)/);
      const userId = tokenMatch ? parseInt(tokenMatch[1]) : 1;

      const user = db.users.find((u) => u.userId === userId);
      if (!user) {
        return fail('用户不存在', 404);
      }

      // 获取用户角色
      const roles = db.roles
        .filter((r) => user.roleId.includes(r.roleId))
        .map((r) => ({ roleId: r.roleId, roleName: r.roleName, roleKey: r.roleKey }));

      // 获取用户权限
      const permissions = roles.some((r) => r.roleKey === 'admin')
        ? ['*:*:*']
        : db.roles.filter((r) => user.roleId.includes(r.roleId)).flatMap((r) => r.permissions);

      // 获取部门名称
      const dept = db.depts.find((d) => d.deptId === user.deptId);

      return success({
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        sex: user.sex,
        deptId: user.deptId,
        deptName: dept?.deptName || '',
        postId: user.postId,
        posts: db.posts.filter((p) => user.postId.includes(p.postId)).map((p) => p.postName),
        roles,
        roleId: user.roleId,
        permissions,
        status: user.status,
        loginIp: user.loginIp,
        loginDate: user.loginDate,
      });
    },
  },

  /**
   * 获取验证码
   */
  {
    url: '/api/auth/captcha',
    method: 'get',
    response: async () => {
      await delay();
      return success({
        uuid: `captcha-${Date.now()}`,
        img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNNUzEyPC90ZXh0Pjwvc3ZnPg==',
        code: 'CM12',
      });
    },
  },

  /**
   * 刷新令牌
   */
  {
    url: '/api/auth/refresh',
    method: 'post',
    response: async (options: { headers?: { authorization?: string } }) => {
      await delay();
      const token = options.headers?.authorization;
      if (!token) {
        return fail('未授权', 401);
      }
      return success({
        token: `mock-token-refresh-${Date.now()}`,
        expires: 720,
      });
    },
  },
] as MockMethod[];
