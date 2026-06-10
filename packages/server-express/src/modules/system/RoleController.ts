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
  type PaginationParams,
} from '@yunshu/shared';

// ============================================================================
// 类型定义
// ============================================================================

/** 数据权限范围
 * 1 全部数据权限
 * 2 自定数据权限
 * 3 本部门数据权限
 * 4 本部门及以下数据权限
 * 5 仅本人数据权限
 */
type DataScope = '1' | '2' | '3' | '4' | '5';

/** 角色状态 */
type RoleStatus = '0' | '1';

/** 角色数据结构 */
interface Role {
  /** 角色ID */
  roleId: string;
  /** 角色名称 */
  roleName: string;
  /** 角色权限字符串 */
  roleKey: string;
  /** 显示顺序 */
  roleSort: number;
  /** 数据范围 */
  dataScope: DataScope;
  /** 状态 0正常 1停用 */
  status: RoleStatus;
  /** 备注 */
  remark: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 角色查询参数 */
interface RoleQueryParams extends PaginationParams {
  /** 角色名称（模糊匹配） */
  roleName?: string;
  /** 角色权限字符串（模糊匹配） */
  roleKey?: string;
  /** 状态 */
  status?: RoleStatus;
}

/** 创建角色请求体 */
interface RoleCreateBody {
  roleName: string;
  roleKey: string;
  roleSort?: number;
  dataScope?: DataScope;
  status?: RoleStatus;
  remark?: string;
}

/** 更新角色请求体 */
interface RoleUpdateBody extends RoleCreateBody {
  roleId: string;
}

/** 批量删除请求体 */
interface BatchRemoveBody {
  roleIds: string[];
}

/** 修改状态请求体 */
interface ChangeStatusBody {
  roleId: string;
  status: RoleStatus;
}

// ============================================================================
// Mock 数据（内存存储）
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

/**
 * 角色管理控制器类
 *
 * 继承 BaseController，封装了系统角色的全部 CRUD 操作。
 */
export class RoleController extends BaseController {
  /**
   * 角色分页列表查询
   *
   * 支持按 roleName、roleKey（模糊匹配）、status 过滤
   */
  async list(req: Request, res: Response) {
    try {
      const query = req.query as unknown as RoleQueryParams;
      const { page, limit } = normalizePagination(query);

      const filtered = mockRoles.filter((r) => {
        if (query.roleName && !r.roleName.includes(query.roleName)) {
          return false;
        }
        if (query.roleKey && !r.roleKey.includes(query.roleKey)) {
          return false;
        }
        if (query.status && r.status !== query.status) {
          return false;
        }
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
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 根据 roleId 获取角色详情
   */
  async getById(req: Request, res: Response) {
    try {
      const { roleId } = req.params;
      const role = mockRoles.find((r) => r.roleId === roleId);
      if (!role) {
        return this.notFound(res, '角色不存在');
      }
      return this.success(res, role, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 创建角色
   */
  async create(req: Request, res: Response) {
    try {
      const body = req.body as RoleCreateBody;
      if (!body.roleName || !body.roleKey) {
        return this.badRequest(res, 'roleName 和 roleKey 必填');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const roleId = `r-${Date.now().toString().padStart(32, '0')}`;

      const newRole: Role = {
        roleId,
        roleName: body.roleName,
        roleKey: body.roleKey,
        roleSort: body.roleSort ?? 0,
        dataScope: body.dataScope ?? '1',
        status: body.status ?? '0',
        remark: body.remark ?? '',
        created_at: now,
        updated_at: now,
      };

      mockRoles.push(newRole);
      return this.created(res, newRole, '创建成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新角色信息
   */
  async update(req: Request, res: Response) {
    try {
      const body = req.body as RoleUpdateBody;
      if (!body.roleId) {
        return this.badRequest(res, 'roleId 必填');
      }

      const idx = mockRoles.findIndex((r) => r.roleId === body.roleId);
      if (idx === -1) {
        return this.notFound(res, '角色不存在');
      }

      const exist = mockRoles[idx];
      if (!exist) return this.notFound(res, '角色不存在');
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockRoles[idx] = {
        roleId: exist.roleId,
        roleName: body.roleName,
        roleKey: body.roleKey,
        roleSort: body.roleSort ?? exist.roleSort,
        dataScope: body.dataScope ?? exist.dataScope,
        status: body.status ?? exist.status,
        remark: body.remark ?? exist.remark,
        created_at: exist.created_at,
        updated_at: now,
      };

      return this.success(res, mockRoles[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 删除单个角色
   */
  async remove(req: Request, res: Response) {
    try {
      const { roleId } = req.params;
      const idx = mockRoles.findIndex((r) => r.roleId === roleId);
      if (idx === -1) {
        return this.notFound(res, '角色不存在');
      }

      mockRoles.splice(idx, 1);
      return this.success(res, { roleId }, '删除成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 批量删除角色
   *
   * body: { roleIds: string[] }
   */
  async batchRemove(req: Request, res: Response) {
    try {
      const body = req.body as BatchRemoveBody;
      if (!body.roleIds || !Array.isArray(body.roleIds) || body.roleIds.length === 0) {
        return this.badRequest(res, 'roleIds 必须为非空数组');
      }

      const before = mockRoles.length;
      mockRoles = mockRoles.filter((r) => !body.roleIds.includes(r.roleId));
      const deleted = before - mockRoles.length;

      return this.success(res, { deleted, roleIds: body.roleIds }, `批量删除成功，共删除 ${deleted} 条`);
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 修改角色状态
   *
   * body: { roleId, status }
   */
  async changeStatus(req: Request, res: Response) {
    try {
      const body = req.body as ChangeStatusBody;
      if (!body.roleId || !body.status) {
        return this.badRequest(res, 'roleId 和 status 必填');
      }

      const role = mockRoles.find((r) => r.roleId === body.roleId);
      if (!role) {
        return this.notFound(res, '角色不存在');
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      role.status = body.status;
      role.updated_at = now;

      return this.success(res, role, '状态修改成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 获取全部角色列表（不分页，用于下拉选择）
   */
  async getAll(req: Request, res: Response) {
    try {
      const list = [...mockRoles].sort((a, b) => a.roleSort - b.roleSort);
      return this.success(res, list, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }
}

/** 角色控制器单例实例 */
export const roleController = new RoleController();
