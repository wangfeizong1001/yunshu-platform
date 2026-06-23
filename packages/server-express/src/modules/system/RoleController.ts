/**
 * 角色管理控制器
 *
 * 提供系统角色相关的 CRUD 操作接口，包括角色列表查询、角色详情、新增、修改、删除、
 * 批量删除、修改状态以及全部角色查询等功能。
 *
 * @module system/RoleController
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';
import {
  createPaginatedResult,
  normalizePagination,
  isValidUUID,
  isValidStringLength,
  type PaginationParams,
} from '@yunshu/shared';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const ROLE_KEY_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{1,49}$/;

// ============================================================================
// 类型定义
// ============================================================================

type DataScope = '1' | '2' | '3' | '4' | '5';
type RoleStatus = '0' | '1';

interface Role {
  roleId: string;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: DataScope;
  status: RoleStatus;
  remark: string;
  created_at: string;
  updated_at: string;
}

interface RoleQueryParams extends PaginationParams {
  roleName?: string;
  roleKey?: string;
  status?: RoleStatus;
}

// ============================================================================
// Mock 数据
// ============================================================================

let mockRoles: Role[] = [
  {
    roleId: 'r-00000000-0000-0000-0000-000000000001',
    roleName: '超级管理员',
    roleKey: 'admin',
    roleSort: 1,
    dataScope: '1',
    status: '0',
    remark: '超级管理员，拥有全部权限',
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-01-01 00:00:00',
  },
  {
    roleId: 'r-00000000-0000-0000-0000-000000000002',
    roleName: '普通角色',
    roleKey: 'common',
    roleSort: 2,
    dataScope: '5',
    status: '0',
    remark: '普通用户，仅本人数据权限',
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-01-01 00:00:00',
  },
  {
    roleId: 'r-00000000-0000-0000-0000-000000000003',
    roleName: '部门经理',
    roleKey: 'dept_manager',
    roleSort: 3,
    dataScope: '4',
    status: '0',
    remark: '本部门及以下数据权限',
    created_at: '2026-02-15 10:00:00',
    updated_at: '2026-02-15 10:00:00',
  },
  {
    roleId: 'r-00000000-0000-0000-0000-000000000004',
    roleName: '研发人员',
    roleKey: 'developer',
    roleSort: 4,
    dataScope: '3',
    status: '0',
    remark: '仅本部门数据权限',
    created_at: '2026-03-01 10:00:00',
    updated_at: '2026-03-01 10:00:00',
  },
  {
    roleId: 'r-00000000-0000-0000-0000-000000000005',
    roleName: '访客',
    roleKey: 'guest',
    roleSort: 5,
    dataScope: '5',
    status: '1',
    remark: '访客角色，已停用',
    created_at: '2026-04-01 10:00:00',
    updated_at: '2026-05-20 10:00:00',
  },
];

// ============================================================================
// 控制器实现
// ============================================================================

export class RoleController extends BaseController {
  private checkIsAdmin(req: Request): boolean {
    const role = (req as unknown as { user?: { role?: string } }).user?.role;
    return role === 'admin' || role === 'super_admin';
  }

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
    const query = req.query as unknown as RoleQueryParams;
    const { page, limit } = normalizePagination(query);

    const roleName = this.extractQueryParam(query.roleName);
    const roleKey = this.extractQueryParam(query.roleKey);
    const statusRaw = this.extractQueryParam(query.status, 1);
    const status = (statusRaw === '0' || statusRaw === '1') ? statusRaw : undefined;

    const filtered = mockRoles.filter((r) => {
      if (roleName && !r.roleName.includes(roleName)) return false;
      if (roleKey && !r.roleKey.includes(roleKey)) return false;
      if (status && r.status !== status) return false;
      return true;
    });

    filtered.sort((a, b) => a.roleSort - b.roleSort);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const list = filtered.slice(start, start + limit);

    return this.paginate(
      res,
      createPaginatedResult(list, page, limit, total),
      '查询成功',
    );
  }

  async getById(req: Request, res: Response) {
    const roleId = this.safeParam(req.params.roleId);
    if (!roleId) return this.badRequest(res, 'roleId 格式错误');
    const role = mockRoles.find((r) => r.roleId === roleId);
    if (!role) return this.notFound(res, '角色不存在');
    return this.success(res, role, '获取成功');
  }

  async create(req: Request, res: Response) {
    const bodyErr = this.validateRequestBody(req.body, ['roleName', 'roleKey'], {
      roleName: 50,
      roleKey: 50,
      remark: 500,
    });
    if (bodyErr) return this.badRequest(res, bodyErr);

    const body = req.body as Record<string, unknown>;
    const roleName = String(body.roleName).trim();
    const roleKey = String(body.roleKey).trim();

    if (!isValidStringLength(roleName, 2, 50)) {
      return this.badRequest(res, 'roleName 长度需在 2-50 字符之间');
    }
    if (!ROLE_KEY_REGEX.test(roleKey)) {
      return this.badRequest(res, 'roleKey 必须以字母开头，包含字母数字下划线，长度 2-50');
    }

    const dataScopeRaw = body.dataScope !== undefined ? String(body.dataScope) : '1';
    const dataScope: DataScope =
      (dataScopeRaw === '1' || dataScopeRaw === '2' || dataScopeRaw === '3' ||
        dataScopeRaw === '4' || dataScopeRaw === '5')
        ? dataScopeRaw
        : '1';

    const statusRaw = body.status !== undefined ? String(body.status) : '0';
    const status: RoleStatus = (statusRaw === '0' || statusRaw === '1') ? statusRaw : '0';

    let roleSort = 0;
    if (body.roleSort !== undefined) {
      const n = Number(body.roleSort);
      if (Number.isFinite(n)) roleSort = n;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const roleId = `r-${Date.now().toString().padStart(32, '0')}`;

    const newRole: Role = {
      roleId,
      roleName,
      roleKey,
      roleSort,
      dataScope,
      status,
      remark: body.remark !== undefined ? String(body.remark) : '',
      created_at: now,
      updated_at: now,
    };

    mockRoles.push(newRole);
    return this.created(res, newRole, '创建成功');
  }

  async update(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const roleId = body.roleId !== undefined ? String(body.roleId) : '';
    if (!roleId || !isValidUUID(roleId)) {
      return this.badRequest(res, 'roleId 必填且格式需为 UUID');
    }

    const idx = mockRoles.findIndex((r) => r.roleId === roleId);
    if (idx === -1) return this.notFound(res, '角色不存在');
    const exist = mockRoles[idx]!;

    if (!this.checkIsAdmin(req) && exist.roleKey === 'admin') {
      return this.forbidden(res, '普通用户无权修改超级管理员角色');
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated: Role = {
      roleId: exist.roleId,
      roleName: exist.roleName,
      roleKey: exist.roleKey,
      roleSort: exist.roleSort,
      dataScope: exist.dataScope,
      status: exist.status,
      remark: exist.remark,
      created_at: exist.created_at,
      updated_at: now,
    };

    if (body.roleName !== undefined) {
      const v = String(body.roleName).trim();
      if (!isValidStringLength(v, 2, 50)) {
        return this.badRequest(res, 'roleName 长度需在 2-50 字符之间');
      }
      updated.roleName = v;
    }
    if (body.roleKey !== undefined) {
      const v = String(body.roleKey).trim();
      if (!ROLE_KEY_REGEX.test(v)) {
        return this.badRequest(res, 'roleKey 必须以字母开头，包含字母数字下划线，长度 2-50');
      }
      updated.roleKey = v;
    }
    if (body.roleSort !== undefined) {
      const n = Number(body.roleSort);
      if (Number.isFinite(n)) updated.roleSort = n;
    }
    if (body.dataScope !== undefined) {
      const v = String(body.dataScope);
      if (v === '1' || v === '2' || v === '3' || v === '4' || v === '5') {
        updated.dataScope = v as DataScope;
      }
    }
    if (body.status !== undefined) {
      const v = String(body.status);
      if (v === '0' || v === '1') {
        if (exist.roleKey === 'admin' && v === '1') {
          return this.forbidden(res, '不能将超级管理员角色设置为停用状态');
        }
        updated.status = v as RoleStatus;
      }
    }
    if (body.remark !== undefined) updated.remark = String(body.remark);

    mockRoles[idx] = updated;
    return this.success(res, updated, '更新成功');
  }

  async remove(req: Request, res: Response) {
    const roleId = this.safeParam(req.params.roleId);
    if (!roleId) return this.badRequest(res, 'roleId 格式错误');

    const target = mockRoles.find((r) => r.roleId === roleId);
    if (target && target.roleKey === 'admin') {
      return this.forbidden(res, '不能删除超级管理员角色');
    }

    const idx = mockRoles.findIndex((r) => r.roleId === roleId);
    if (idx === -1) return this.notFound(res, '角色不存在');

    mockRoles.splice(idx, 1);
    return this.success(res, { roleId }, '删除成功');
  }

  async batchRemove(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const roleIds = body.roleIds;
    if (!Array.isArray(roleIds)) {
      return this.badRequest(res, 'roleIds 必须为数组');
    }

    const batchErr = this.validateBatchSize(roleIds, MAX_BATCH_SIZE);
    if (batchErr) return this.badRequest(res, batchErr);

    const validIds: string[] = [];
    for (const id of roleIds) {
      if (typeof id === 'string' && isValidUUID(id)) {
        const target = mockRoles.find((r) => r.roleId === id);
        if (target && target.roleKey === 'admin') {
          return this.forbidden(res, '不能批量删除超级管理员角色');
        }
        validIds.push(id);
      }
    }
    if (validIds.length === 0) return this.badRequest(res, 'roleIds 中无有效 ID');

    const before = mockRoles.length;
    mockRoles = mockRoles.filter((r) => !validIds.includes(r.roleId));
    const deleted = before - mockRoles.length;

    return this.success(
      res,
      { deleted, roleIds: validIds },
      `批量删除成功，共删除 ${deleted} 条`,
    );
  }

  async changeStatus(req: Request, res: Response) {
    const body = req.body as Record<string, unknown>;
    const roleId = body.roleId !== undefined ? String(body.roleId) : '';
    const statusRaw = body.status !== undefined ? String(body.status) : '';

    if (!roleId || !isValidUUID(roleId)) {
      return this.badRequest(res, 'roleId 必填且格式需为 UUID');
    }
    if (statusRaw !== '0' && statusRaw !== '1') {
      return this.badRequest(res, 'status 必须为 0 或 1');
    }
    const status = statusRaw as RoleStatus;

    const role = mockRoles.find((r) => r.roleId === roleId);
    if (!role) return this.notFound(res, '角色不存在');

    if (role.roleKey === 'admin' && status === '1') {
      return this.forbidden(res, '不能将超级管理员角色设置为停用状态');
    }
    if (!this.checkIsAdmin(req) && role.roleKey === 'admin') {
      return this.forbidden(res, '普通用户无权修改超级管理员角色状态');
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    role.status = status;
    role.updated_at = now;

    return this.success(res, role, '状态修改成功');
  }

  async getAll(req: Request, res: Response) {
    const list = [...mockRoles].sort((a, b) => a.roleSort - b.roleSort);
    return this.success(res, list, '查询成功');
  }
}

export const roleController = new RoleController();
