/**
 * 用户管理控制器
 *
 * 提供系统用户相关的 CRUD 操作接口，包括用户列表查询、用户详情、新增、修改、删除、
 * 批量删除、重置密码、修改状态以及个人信息管理等功能。
 *
 * @module system/UserController
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
  type PaginationParams,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 用户性别 */
type UserSex = '0' | '1' | '2';

/** 用户状态 */
type UserStatus = '0' | '1';

/** 用户数据结构 */
interface User {
  /** 用户ID（UUID） */
  userId: string;
  /** 登录账号 */
  userName: string;
  /** 用户昵称 */
  nickName: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 性别 0男 1女 2未知 */
  sex: UserSex;
  /** 头像 */
  avatar: string;
  /** 部门ID */
  deptId: string;
  /** 状态 0正常 1停用 */
  status: UserStatus;
  /** 备注 */
  remark: string;
  /** 最后登录IP */
  loginIp: string;
  /** 最后登录时间 */
  loginDate: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 用户查询参数 */
interface UserQueryParams extends PaginationParams {
  /** 用户名称（模糊匹配） */
  userName?: string;
  /** 状态 */
  status?: UserStatus;
  /** 部门ID */
  deptId?: string;
}

/** 创建用户请求体 */
interface UserCreateBody {
  userName: string;
  nickName: string;
  email?: string;
  phone?: string;
  sex?: UserSex;
  avatar?: string;
  deptId?: string;
  status?: UserStatus;
  remark?: string;
}

/** 更新用户请求体 */
interface UserUpdateBody extends UserCreateBody {
  userId: string;
}

/** 批量删除请求体 */
interface BatchRemoveBody {
  userIds: string[];
}

/** 重置密码请求体 */
interface ResetPwdBody {
  userId: string;
  password: string;
}

/** 修改状态请求体 */
interface ChangeStatusBody {
  userId: string;
  status: UserStatus;
}

// ============================================================================
// Mock 数据（内存存储）
// ============================================================================

let mockUsers: User[] = [
  {
    userId: 'u-00000000-0000-0000-0000-000000000001',
    userName: 'admin',
    nickName: '管理员',
    email: 'admin@yunshu.com',
    phone: '13800000001',
    sex: '1',
    avatar: '/static/avatar/admin.png',
    deptId: 'd-100',
    status: '0',
    remark: '超级管理员',
    loginIp: '127.0.0.1',
    loginDate: '2026-06-09 09:30:00',
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-06-09 09:30:00',
  },
  {
    userId: 'u-00000000-0000-0000-0000-000000000002',
    userName: 'zhangsan',
    nickName: '张三',
    email: 'zhangsan@yunshu.com',
    phone: '13800000002',
    sex: '0',
    avatar: '/static/avatar/user1.png',
    deptId: 'd-101',
    status: '0',
    remark: '研发部员工',
    loginIp: '192.168.1.10',
    loginDate: '2026-06-08 18:00:00',
    created_at: '2026-02-15 10:00:00',
    updated_at: '2026-06-08 18:00:00',
  },
  {
    userId: 'u-00000000-0000-0000-0000-000000000003',
    userName: 'lisi',
    nickName: '李四',
    email: 'lisi@yunshu.com',
    phone: '13800000003',
    sex: '0',
    avatar: '/static/avatar/user2.png',
    deptId: 'd-101',
    status: '0',
    remark: '研发部员工',
    loginIp: '192.168.1.11',
    loginDate: '2026-06-09 08:15:00',
    created_at: '2026-03-01 10:00:00',
    updated_at: '2026-06-09 08:15:00',
  },
  {
    userId: 'u-00000000-0000-0000-0000-000000000004',
    userName: 'wangwu',
    nickName: '王五',
    email: 'wangwu@yunshu.com',
    phone: '13800000004',
    sex: '0',
    avatar: '/static/avatar/user3.png',
    deptId: 'd-102',
    status: '1',
    remark: '市场部员工（已停用）',
    loginIp: '-',
    loginDate: '-',
    created_at: '2026-03-15 10:00:00',
    updated_at: '2026-05-20 10:00:00',
  },
  {
    userId: 'u-00000000-0000-0000-0000-000000000005',
    userName: 'zhaoliu',
    nickName: '赵六',
    email: 'zhaoliu@yunshu.com',
    phone: '13800000005',
    sex: '1',
    avatar: '/static/avatar/user4.png',
    deptId: 'd-103',
    status: '0',
    remark: '财务部员工',
    loginIp: '192.168.1.20',
    loginDate: '2026-06-09 09:00:00',
    created_at: '2026-04-01 10:00:00',
    updated_at: '2026-06-09 09:00:00',
  },
];

// ============================================================================
// 控制器实现
// ============================================================================

/**
 * 用户管理控制器类
 *
 * 继承 BaseController，封装了系统用户的全部 CRUD 操作。
 * 所有数据采用内存 Mock 存储，便于独立测试与演示。
 */
export class UserController extends BaseController {
  /**
   * 用户分页列表查询
   *
   * 支持按 userName（模糊匹配）、status、deptId 过滤。
   */
  async list(req: Request, res: Response) {
    try {
      const query = req.query as unknown as UserQueryParams;
      const { page, limit } = normalizePagination(query);

      const filtered = mockUsers.filter((u) => {
        if (query.userName && !u.userName.includes(query.userName) && !u.nickName.includes(query.userName)) {
          return false;
        }
        if (query.status && u.status !== query.status) {
          return false;
        }
        if (query.deptId && u.deptId !== query.deptId) {
          return false;
        }
        return true;
      });

      const total = filtered.length;
      const start = (page - 1) * limit;
      const list = filtered.slice(start, start + limit);

      return this.paginate(
        res,
        createPaginatedResult(list, page, limit, total),
        '查询成功',
      );
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 根据 userId 获取用户详情
   */
  async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = mockUsers.find((u) => u.userId === userId);
      if (!user) {
        return this.notFound(res, '用户不存在');
      }
      return this.success(res, user, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 创建用户
   */
  async create(req: Request, res: Response) {
    try {
      const body = req.body as UserCreateBody;
      if (!body.userName || !body.nickName) {
        return this.badRequest(res, 'userName 和 nickName 必填');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const userId = `u-${Date.now().toString().padStart(32, '0')}`;

      const newUser: User = {
        userId,
        userName: body.userName,
        nickName: body.nickName,
        email: body.email ?? '',
        phone: body.phone ?? '',
        sex: body.sex ?? '2',
        avatar: body.avatar ?? '',
        deptId: body.deptId ?? '',
        status: body.status ?? '0',
        remark: body.remark ?? '',
        loginIp: '-',
        loginDate: '-',
        created_at: now,
        updated_at: now,
      };

      mockUsers.push(newUser);
      return this.created(res, newUser, '创建成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新用户信息
   */
  async update(req: Request, res: Response) {
    try {
      const body = req.body as UserUpdateBody;
      if (!body.userId) {
        return this.badRequest(res, 'userId 必填');
      }

      const idx = mockUsers.findIndex((u) => u.userId === body.userId);
      if (idx === -1) {
        return this.notFound(res, '用户不存在');
      }

      const exist = mockUsers[idx];
      if (!exist) return this.notFound(res, '用户不存在');
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockUsers[idx] = {
        userId: exist.userId,
        userName: body.userName,
        nickName: body.nickName,
        email: body.email ?? exist.email,
        phone: body.phone ?? exist.phone,
        sex: body.sex ?? exist.sex,
        avatar: body.avatar ?? exist.avatar,
        deptId: body.deptId ?? exist.deptId,
        status: body.status ?? exist.status,
        remark: body.remark ?? exist.remark,
        loginIp: exist.loginIp,
        loginDate: exist.loginDate,
        created_at: exist.created_at,
        updated_at: now,
      };

      return this.success(res, mockUsers[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 删除单个用户
   */
  async remove(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const idx = mockUsers.findIndex((u) => u.userId === userId);
      if (idx === -1) {
        return this.notFound(res, '用户不存在');
      }

      mockUsers.splice(idx, 1);
      return this.success(res, { userId }, '删除成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 批量删除用户
   *
   * body: { userIds: string[] }
   */
  async batchRemove(req: Request, res: Response) {
    try {
      const body = req.body as BatchRemoveBody;
      if (!body.userIds || !Array.isArray(body.userIds) || body.userIds.length === 0) {
        return this.badRequest(res, 'userIds 必须为非空数组');
      }

      const before = mockUsers.length;
      mockUsers = mockUsers.filter((u) => !body.userIds.includes(u.userId));
      const deleted = before - mockUsers.length;

      return this.success(res, { deleted, userIds: body.userIds }, `批量删除成功，共删除 ${deleted} 条`);
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 重置用户密码
   *
   * body: { userId, password }
   */
  async resetPwd(req: Request, res: Response) {
    try {
      const body = req.body as ResetPwdBody;
      if (!body.userId || !body.password) {
        return this.badRequest(res, 'userId 和 password 必填');
      }

      const user = mockUsers.find((u) => u.userId === body.userId);
      if (!user) {
        return this.notFound(res, '用户不存在');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      user.updated_at = now;

      return this.success(res, { userId: body.userId }, '密码重置成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 修改用户状态
   *
   * body: { userId, status }
   */
  async changeStatus(req: Request, res: Response) {
    try {
      const body = req.body as ChangeStatusBody;
      if (!body.userId || !body.status) {
        return this.badRequest(res, 'userId 和 status 必填');
      }

      const user = mockUsers.find((u) => u.userId === body.userId);
      if (!user) {
        return this.notFound(res, '用户不存在');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      user.status = body.status;
      user.updated_at = now;

      return this.success(res, user, '状态修改成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 获取当前登录用户个人信息
   *
   * 简化实现：直接返回列表中第一个 admin 用户。
   */
  async getProfile(req: Request, res: Response) {
    try {
      const admin = mockUsers.find((u) => u.userName === 'admin') ?? mockUsers[0];
      if (!admin) {
        return this.notFound(res, '当前用户不存在');
      }
      return this.success(res, admin, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新当前登录用户个人信息
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const admin = mockUsers.find((u) => u.userName === 'admin') ?? mockUsers[0];
      if (!admin) {
        return this.notFound(res, '当前用户不存在');
      }

      const body = req.body as Partial<UserCreateBody>;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const idx = mockUsers.findIndex((u) => u.userId === admin.userId);
      if (idx === -1) {
        return this.notFound(res, '当前用户不存在');
      }
      const exist = mockUsers[idx];
      if (!exist) return this.notFound(res, '当前用户不存在');
      mockUsers[idx] = {
        userId: exist.userId,
        userName: body.userName ?? exist.userName,
        nickName: body.nickName ?? exist.nickName,
        email: body.email ?? exist.email,
        phone: body.phone ?? exist.phone,
        sex: body.sex ?? exist.sex,
        avatar: body.avatar ?? exist.avatar,
        deptId: body.deptId ?? exist.deptId,
        status: body.status ?? exist.status,
        remark: body.remark ?? exist.remark,
        loginIp: exist.loginIp,
        loginDate: exist.loginDate,
        created_at: exist.created_at,
        updated_at: now,
      };

      return this.success(res, mockUsers[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }
}

/** 用户控制器单例实例 */
export const userController = new UserController();
