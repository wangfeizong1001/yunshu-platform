/**
 * 部门管理控制器
 *
 * 提供系统部门相关的 CRUD 操作接口，包括部门列表查询、树形结构、部门详情、
 * 新增、修改、删除等功能。
 *
 * @module system/DeptController
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;

// ============================================================================
// 类型定义
// ============================================================================

/** 部门状态 */
type DeptStatus = '0' | '1';

/** 部门数据结构 */
interface Dept {
  /** 部门ID */
  deptId: string;
  /** 父部门ID（NULL 或空表示根节点） */
  parentId: string | null;
  /** 祖级列表（逗号分隔的祖先ID路径） */
  ancestors: string;
  /** 部门名称 */
  deptName: string;
  /** 显示顺序 */
  orderNum: number;
  /** 负责人 */
  leader: string;
  /** 联系电话 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 状态 0正常 1停用 */
  status: DeptStatus;
}

/** 带 children 的树形部门节点 */
interface DeptTreeNode extends Dept {
  children: DeptTreeNode[];
}

/** 部门查询参数 */
interface DeptQueryParams {
  deptName?: string;
  status?: DeptStatus;
}

/** 创建部门请求体 */
interface DeptCreateBody {
  deptName: string;
  parentId?: string | null;
  ancestors?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: DeptStatus;
}

/** 更新部门请求体 */
interface DeptUpdateBody extends DeptCreateBody {
  deptId: string;
}

// ============================================================================
// Mock 数据（内存存储）
// ============================================================================

let mockDepts: Dept[] = [
  {
    deptId: 'd-100',
    parentId: null,
    ancestors: '0',
    deptName: '云枢科技',
    orderNum: 0,
    leader: 'admin',
    phone: '13800000001',
    email: 'admin@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-101',
    parentId: 'd-100',
    ancestors: '0,d-100',
    deptName: '研发部',
    orderNum: 1,
    leader: '张三',
    phone: '13800000002',
    email: 'rd@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-1011',
    parentId: 'd-101',
    ancestors: '0,d-100,d-101',
    deptName: '前端组',
    orderNum: 1,
    leader: '李四',
    phone: '13800000003',
    email: 'fe@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-1012',
    parentId: 'd-101',
    ancestors: '0,d-100,d-101',
    deptName: '后端组',
    orderNum: 2,
    leader: '王五',
    phone: '13800000004',
    email: 'be@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-102',
    parentId: 'd-100',
    ancestors: '0,d-100',
    deptName: '市场部',
    orderNum: 2,
    leader: '赵六',
    phone: '13800000005',
    email: 'marketing@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-103',
    parentId: 'd-100',
    ancestors: '0,d-100',
    deptName: '财务部',
    orderNum: 3,
    leader: '钱七',
    phone: '13800000006',
    email: 'finance@yunshu.com',
    status: '0',
  },
  {
    deptId: 'd-104',
    parentId: 'd-100',
    ancestors: '0,d-100',
    deptName: '人事部',
    orderNum: 4,
    leader: '孙八',
    phone: '13800000007',
    email: 'hr@yunshu.com',
    status: '1',
  },
];

// ============================================================================
// 私有校验工具
// ============================================================================

function isValidDeptName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length >= 2 && name.length <= 50;
}

function isValidDeptCode(code: unknown): code is string {
  return typeof code === 'string' && code.length >= 1 && code.length <= 20
    && /^[A-Za-z0-9_]+$/.test(code);
}

function isValidOrderNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 9999;
}

function isValidPhone(phone: unknown): boolean {
  if (phone === undefined || phone === null || phone === '') return true;
  return typeof phone === 'string' && /^1[3-9]\d{9}$/.test(phone);
}

function isValidEmail(email: unknown): boolean {
  if (email === undefined || email === null || email === '') return true;
  return typeof email === 'string'
    && email.length <= 100
    && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

// ============================================================================
// 控制器实现
// ============================================================================

/**
 * 部门管理控制器类
 */
export class DeptController extends BaseController {
  /**
   * 部门列表查询（全量不分页）
   */
  async list(req: Request, res: Response) {
    const query = req.query as unknown as DeptQueryParams;
    const deptNameParam = this.safeParam(query.deptName, MAX_QUERY_PARAM_LENGTH);
    const statusParam = this.safeParam(query.status, 1);

    const filtered = mockDepts.filter((d) => {
      if (deptNameParam && !d.deptName.includes(deptNameParam)) return false;
      if (statusParam && d.status !== statusParam) return false;
      return true;
    });

    filtered.sort((a, b) => a.orderNum - b.orderNum);
    return this.success(res, filtered, '查询成功');
  }

  /**
   * 获取部门树形结构
   */
  async getTree(req: Request, res: Response) {
    const tree = this.buildTree(mockDepts);
    return this.success(res, tree, '查询成功');
  }

  /**
   * 根据 deptId 获取部门详情
   */
  async getById(req: Request, res: Response) {
    const { deptId } = req.params;
    const safeId = this.safeParam(deptId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'deptId 参数非法');

    const dept = mockDepts.find((d) => d.deptId === safeId);
    if (!dept) return this.notFound(res, '部门不存在');
    return this.success(res, dept, '获取成功');
  }

  /**
   * 创建部门
   */
  async create(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as DeptCreateBody;
    if (!isValidDeptName(body.deptName)) return this.badRequest(res, 'deptName 长度 2-50');

    const orderNum = body.orderNum ?? 0;
    if (!isValidOrderNum(orderNum)) return this.badRequest(res, 'orderNum 必须是 0-9999 的数字');

    const status = body.status ?? '0';
    if (status !== '0' && status !== '1') return this.badRequest(res, 'status 必须是 0 或 1');

    const leader = typeof body.leader === 'string' ? body.leader.slice(0, 50) : '';
    if (!isValidPhone(body.phone)) return this.badRequest(res, 'phone 格式错误');
    if (!isValidEmail(body.email)) return this.badRequest(res, 'email 格式错误');

    const phone = typeof body.phone === 'string' ? body.phone : '';
    const email = typeof body.email === 'string' ? body.email : '';

    const deptId = `d-${Date.now()}`;
    const parentId = body.parentId !== undefined
      ? (body.parentId === null || body.parentId === '' ? null : String(body.parentId).slice(0, MAX_FIELD_LENGTH))
      : null;

    let ancestors = '0';
    if (parentId) {
      const parent = mockDepts.find((d) => d.deptId === parentId);
      ancestors = parent ? `${parent.ancestors},${parentId}` : `0,${parentId}`;
    }

    const newDept: Dept = {
      deptId,
      parentId,
      ancestors,
      deptName: body.deptName,
      orderNum,
      leader,
      phone,
      email,
      status,
    };

    mockDepts.push(newDept);
    return this.created(res, newDept, '创建成功');
  }

  /**
   * 更新部门
   */
  async update(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as DeptUpdateBody;
    const safeId = this.safeParam(body.deptId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'deptId 必填');

    const exist = mockDepts.find((d) => d.deptId === safeId);
    if (!exist) return this.notFound(res, '部门不存在');
    const idx = mockDepts.indexOf(exist);

    if (!isValidDeptName(body.deptName)) return this.badRequest(res, 'deptName 长度 2-50');

    const orderNum = body.orderNum ?? exist.orderNum;
    if (!isValidOrderNum(orderNum)) return this.badRequest(res, 'orderNum 必须是 0-9999 的数字');

    const status = body.status ?? exist.status;
    if (status !== '0' && status !== '1') return this.badRequest(res, 'status 必须是 0 或 1');

    const leader = typeof body.leader === 'string' ? body.leader.slice(0, 50) : exist.leader;
    if (!isValidPhone(body.phone)) return this.badRequest(res, 'phone 格式错误');
    if (!isValidEmail(body.email)) return this.badRequest(res, 'email 格式错误');

    const phone = typeof body.phone === 'string' ? body.phone : exist.phone;
    const email = typeof body.email === 'string' ? body.email : exist.email;

    const parentId = body.parentId !== undefined
      ? (body.parentId === null || body.parentId === '' ? null : String(body.parentId).slice(0, MAX_FIELD_LENGTH))
      : exist.parentId;

    let ancestors = exist.ancestors;
    if (parentId && parentId !== exist.parentId) {
      const parent = mockDepts.find((d) => d.deptId === parentId);
      ancestors = parent ? `${parent.ancestors},${parentId}` : `0,${parentId}`;
    } else if (!parentId) {
      ancestors = '0';
    }

    mockDepts[idx] = {
      deptId: exist.deptId,
      parentId,
      ancestors,
      deptName: body.deptName,
      orderNum,
      leader,
      phone,
      email,
      status,
    };

    return this.success(res, mockDepts[idx], '更新成功');
  }

  /**
   * 删除部门
   */
  async remove(req: Request, res: Response) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const { deptId } = req.params;
    const safeId = this.safeParam(deptId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'deptId 参数非法');

    const idx = mockDepts.findIndex((d) => d.deptId === safeId);
    if (idx === -1) return this.notFound(res, '部门不存在');

    mockDepts.splice(idx, 1);
    return this.success(res, { deptId: safeId }, '删除成功');
  }

  // ========================================================================
  // 私有工具方法
  // ========================================================================

  private buildTree(list: Dept[]): DeptTreeNode[] {
    const map = new Map<string, DeptTreeNode>();
    const roots: DeptTreeNode[] = [];

    for (const item of list) {
      map.set(item.deptId, { ...item, children: [] });
    }

    for (const item of list) {
      const node = map.get(item.deptId)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const sortRecursive = (nodes: DeptTreeNode[]) => {
      nodes.sort((a, b) => a.orderNum - b.orderNum);
      for (const n of nodes) {
        if (n.children.length > 0) sortRecursive(n.children);
      }
    };
    sortRecursive(roots);

    return roots;
  }
}

/** 部门控制器单例实例 */
export const deptController = new DeptController();
