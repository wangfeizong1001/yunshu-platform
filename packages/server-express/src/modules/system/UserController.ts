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
  isValidUUID,
  isValidEmail,
  isValidPhone,
  isValidStringLength,
  type PaginationParams,
} from '@yunshu/shared';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;

// ============================================================================
// 类型定义
// ============================================================================

/** 用户性别 */
type UserSex = '0' | '1' | '2';

/** 用户状态 */
type UserStatus = '0' | '1';

/** 用户数据结构 */
interface User {
  userId: string;
  userName: string;
  nickName: string;
  email: string;
  phone: string;
  sex: UserSex;
  avatar: string;
  deptId: string;
  status: UserStatus;
  remark: string;
  loginIp: string;
  loginDate: string;
  created_at: string;
  updated_at: string;
}

/** 用户查询参数 */
interface UserQueryParams extends PaginationParams {
  userName?: string;
  status?: UserStatus;
  deptId?: string;
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
 */
export class UserController extends BaseController {
  private extractQueryParam(value: unknown, max = MAX_QUERY_PARAM_LENGTH): string | undefined {
    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' && first.length > 0 && first.length <= max
        ? first
        : undefined;
    }
    return typeof value === 'string' && value.length > 0 && value.length <= max
      ? value
      : undefined;
  }

  async list(req: Request, res: Response) {
    const query = req.query as unknown as UserQueryParams;
    const { page, limit } = normalizePagination(query);

    const userName = this.extractQueryParam(query.userName);
    const statusRaw = this.extractQueryParam(query.status, 1);
    const status = (statusRaw === '0' || statusRaw === '1') ? statusRaw : undefined;
    const deptId = this.extractQueryParam(query.deptId);

    const filtered = mockUsers.filter((u) => {
      if (userName && !u.userName.includes(userName) && !u.nickName.includes(userName)) {
        return false;
      }
      if (status && u.status !== status) {
        return false;
      }
      if (deptId && u.deptId !== deptId) {
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const list = filtered.slice(start, start + limit);

    const isAdmin = this.isCurrentUserAdmin(req);
    const sanitizedList = list.map((u) => this.sanitizeUser(u, isAdmin));

    return this.paginate(
      res,
      createPaginatedResult(sanitizedList, page, limit, total),
      '查询成功',
    );
  }

  async getById(req: Request, res: Response) {
    const userId = this.safeParam(req.params.userId);
    if (!userId) {
      return this.badRequest(res, 'userId 格式错误');
    }
    const user = mockUsers.find((u) => u.userId === userId);
    if (!user) {
      return this.notFound(res, '用户不存在');
    }
    const sanitized = this.sanitizeUser(user, this.isCurrentUserAdmin(req));
    return this.success(res, sanitized, '获取成功');
  }

  async create(req: Request, res: Response) {
    const bodyErr = this.validateRequestBody(req.body, ['userName', 'nickName'], {
      userName: 50,
      nickName: 50,
      email: 100,
      phone: 20,
      remark: 500,
      avatar: 255,
      deptId: 50,
    });
    if (bodyErr) return this.badRequest(res, bodyErr);

    const body = req.body as Record<string, unknown>;
    const userName = String(body.userName).trim();
    const nickName = String(body.nickName).trim();

    if (!isValidStringLength(userName, 2, 50)) {
      return this.badRequest(res, 'userName 长度需在 2-50 字符之间');
    }
    if (!isValidStringLength(nickName, 2, 50)) {
      return this.badRequest(res, 'nickName 长度需在 2-50 字符之间');
    }

    const email = body.email !== undefined && body.email !== '' ? String(body.email) : '';
    const phone = body.phone !== undefined && body.phone !== '' ? String(body.phone) : '';

    if (email && !isValidEmail(email)) {
      return this.badRequest(res, '邮箱格式错误');
    }
    if (phone && !isValidPhone(phone)) {
      return this.badRequest(res, '手机号格式错误');
    }

    const sexRaw = body.sex !== undefined ? String(body.sex) : '2';
    const sex: UserSex = (sexRaw === '0' || sexRaw === '1' || sexRaw === '2') ? sexRaw : '2';
    const statusRaw = body.status !== undefined ? String(body.status) : '0';
    const status: UserStatus = (statusRaw === '0' || statusRaw === '1') ? statusRaw : '0';

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userId = `u-${Date.now().toString().padStart(32, '0')}`;

    const newUser: User = {
      userId,
      userName,
      nickName,
      email,
      phone,
      sex,
      avatar: body.avatar !== undefined ? String(body.avatar) : '',
      deptId: body.deptId !== undefined ? String(body.deptId) : '',
      status,
      remark: body.remark !== undefined ? String(body.remark) : '',
      loginIp: '-',
      loginDate: '-',
      created_at: now,
      updated_at: now,
    };

    mockUsers.push(newUser);
    return this.created(res, this.sanitizeUser(newUser, this.isCurrentUserAdmin(req)), '创建成功');
  }

  async update(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const userId = body.userId !== undefined ? String(body.userId) : '';
    if (!userId || !isValidUUID(userId)) {
      return this.badRequest(res, 'userId 必填且格式需为 UUID');
    }

    const idx = mockUsers.findIndex((u) => u.userId === userId);
    if (idx === -1) {
      return this.notFound(res, '用户不存在');
    }
    const exist = mockUsers[idx]!;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated: User = {
      userId: exist.userId,
      userName: exist.userName,
      nickName: exist.nickName,
      email: exist.email,
      phone: exist.phone,
      sex: exist.sex,
      avatar: exist.avatar,
      deptId: exist.deptId,
      status: exist.status,
      remark: exist.remark,
      loginIp: exist.loginIp,
      loginDate: exist.loginDate,
      created_at: exist.created_at,
      updated_at: now,
    };

    if (body.userName !== undefined) {
      const v = String(body.userName).trim();
      if (!isValidStringLength(v, 2, 50)) {
        return this.badRequest(res, 'userName 长度需在 2-50 字符之间');
      }
      updated.userName = v;
    }
    if (body.nickName !== undefined) {
      const v = String(body.nickName).trim();
      if (!isValidStringLength(v, 2, 50)) {
        return this.badRequest(res, 'nickName 长度需在 2-50 字符之间');
      }
      updated.nickName = v;
    }
    if (body.email !== undefined) {
      const v = String(body.email);
      if (v && !isValidEmail(v)) return this.badRequest(res, '邮箱格式错误');
      updated.email = v;
    }
    if (body.phone !== undefined) {
      const v = String(body.phone);
      if (v && !isValidPhone(v)) return this.badRequest(res, '手机号格式错误');
      updated.phone = v;
    }
    if (body.sex !== undefined) {
      const v = String(body.sex);
      if (v === '0' || v === '1' || v === '2') updated.sex = v as UserSex;
    }
    if (body.status !== undefined) {
      const v = String(body.status);
      if (v === '0' || v === '1') updated.status = v as UserStatus;
    }
    if (body.avatar !== undefined) updated.avatar = String(body.avatar);
    if (body.deptId !== undefined) updated.deptId = String(body.deptId);
    if (body.remark !== undefined) updated.remark = String(body.remark);

    mockUsers[idx] = updated;
    return this.success(res, this.sanitizeUser(updated, this.isCurrentUserAdmin(req)), '更新成功');
  }

  async remove(req: Request, res: Response) {
    const userId = this.safeParam(req.params.userId);
    if (!userId) {
      return this.badRequest(res, 'userId 格式错误');
    }
    const idx = mockUsers.findIndex((u) => u.userId === userId);
    if (idx === -1) {
      return this.notFound(res, '用户不存在');
    }
    mockUsers.splice(idx, 1);
    return this.success(res, { userId }, '删除成功');
  }

  async batchRemove(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const userIds = body.userIds;
    if (!Array.isArray(userIds)) {
      return this.badRequest(res, 'userIds 必须为数组');
    }

    const batchErr = this.validateBatchSize(userIds, MAX_BATCH_SIZE);
    if (batchErr) return this.badRequest(res, batchErr);

    const validIds: string[] = [];
    for (const id of userIds) {
      if (typeof id === 'string' && isValidUUID(id)) {
        validIds.push(id);
      }
    }
    if (validIds.length === 0) {
      return this.badRequest(res, 'userIds 中无有效 ID');
    }

    const before = mockUsers.length;
    mockUsers = mockUsers.filter((u) => !validIds.includes(u.userId));
    const deleted = before - mockUsers.length;

    return this.success(res, { deleted, userIds: validIds }, `批量删除成功，共删除 ${deleted} 条`);
  }

  async resetPwd(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const userId = body.userId !== undefined ? String(body.userId) : '';
    const password = body.password !== undefined ? String(body.password) : '';

    if (!userId || !isValidUUID(userId)) {
      return this.badRequest(res, 'userId 必填且格式需为 UUID');
    }
    if (!isValidStringLength(password, 6, 128)) {
      return this.badRequest(res, 'password 长度需在 6-128 字符之间');
    }

    const isAdmin = this.isCurrentUserAdmin(req);
    const currentUserId = this.getCurrentUserId(req);

    if (!isAdmin && currentUserId !== userId) {
      return this.forbidden(res, '无权限重置其他用户密码');
    }

    const user = mockUsers.find((u) => u.userId === userId);
    if (!user) {
      return this.notFound(res, '用户不存在');
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    user.updated_at = now;

    return this.success(res, { userId }, '密码重置成功');
  }

  async changeStatus(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const userId = body.userId !== undefined ? String(body.userId) : '';
    const statusRaw = body.status !== undefined ? String(body.status) : '';

    if (!userId || !isValidUUID(userId)) {
      return this.badRequest(res, 'userId 必填且格式需为 UUID');
    }
    if (statusRaw !== '0' && statusRaw !== '1') {
      return this.badRequest(res, 'status 必须为 0 或 1');
    }
    const status = statusRaw as UserStatus;

    const user = mockUsers.find((u) => u.userId === userId);
    if (!user) {
      return this.notFound(res, '用户不存在');
    }

    const isAdmin = this.isCurrentUserAdmin(req);
    if (!isAdmin && user.userName === 'admin') {
      return this.forbidden(res, '普通用户无权修改超级管理员状态');
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    user.status = status;
    user.updated_at = now;

    return this.success(res, this.sanitizeUser(user, isAdmin), '状态修改成功');
  }

  async getProfile(req: Request, res: Response) {
    const currentUserId = this.getCurrentUserId(req);
    let admin: User | undefined;

    if (currentUserId) {
      admin = mockUsers.find((u) => u.userId === currentUserId);
    }
    if (!admin) {
      admin = mockUsers.find((u) => u.userName === 'admin') ?? mockUsers[0];
    }
    if (!admin) {
      return this.notFound(res, '当前用户不存在');
    }
    return this.success(res, this.sanitizeUser(admin, true), '获取成功');
  }

  async updateProfile(req: Request, res: Response) {
    const currentUserId = this.getCurrentUserId(req);
    let admin: User | undefined;

    if (currentUserId) {
      admin = mockUsers.find((u) => u.userId === currentUserId);
    }
    if (!admin) {
      admin = mockUsers.find((u) => u.userName === 'admin') ?? mockUsers[0];
    }
    if (!admin) {
      return this.notFound(res, '当前用户不存在');
    }

    const idx = mockUsers.findIndex((u) => u.userId === admin!.userId);
    if (idx === -1) {
      return this.notFound(res, '当前用户不存在');
    }
    const exist = mockUsers[idx]!;

    const body = req.body as Record<string, unknown>;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated: User = {
      userId: exist.userId,
      userName: exist.userName,
      nickName: exist.nickName,
      email: exist.email,
      phone: exist.phone,
      sex: exist.sex,
      avatar: exist.avatar,
      deptId: exist.deptId,
      status: exist.status,
      remark: exist.remark,
      loginIp: exist.loginIp,
      loginDate: exist.loginDate,
      created_at: exist.created_at,
      updated_at: now,
    };

    if (body.userName !== undefined) {
      const v = String(body.userName).trim();
      if (!isValidStringLength(v, 2, 50)) {
        return this.badRequest(res, 'userName 长度需在 2-50 字符之间');
      }
      updated.userName = v;
    }
    if (body.nickName !== undefined) {
      const v = String(body.nickName).trim();
      if (!isValidStringLength(v, 2, 50)) {
        return this.badRequest(res, 'nickName 长度需在 2-50 字符之间');
      }
      updated.nickName = v;
    }
    if (body.email !== undefined) {
      const v = String(body.email);
      if (v && !isValidEmail(v)) return this.badRequest(res, '邮箱格式错误');
      updated.email = v;
    }
    if (body.phone !== undefined) {
      const v = String(body.phone);
      if (v && !isValidPhone(v)) return this.badRequest(res, '手机号格式错误');
      updated.phone = v;
    }
    if (body.sex !== undefined) {
      const v = String(body.sex);
      if (v === '0' || v === '1' || v === '2') updated.sex = v as UserSex;
    }
    if (body.avatar !== undefined) updated.avatar = String(body.avatar);
    if (body.deptId !== undefined) updated.deptId = String(body.deptId);
    if (body.remark !== undefined) updated.remark = String(body.remark);

    mockUsers[idx] = updated;
    return this.success(res, this.sanitizeUser(updated, true), '更新成功');
  }
}

/** 用户控制器单例实例 */
export const userController = new UserController();
