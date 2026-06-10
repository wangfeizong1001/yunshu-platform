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
  /** 部门名称（模糊匹配） */
  deptName?: string;
  /** 状态 */
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
// 控制器实现
// ============================================================================

/**
 * 部门管理控制器类
 *
 * 继承 BaseController，封装了系统部门的全部 CRUD 操作与树形结构生成。
 */
export class DeptController extends BaseController {
  /**
   * 部门列表查询（全量不分页）
   *
   * 支持按 deptName（模糊匹配）、status 过滤。
   */
  async list(req: Request, res: Response) {
    try {
      const query = req.query as unknown as DeptQueryParams;

      const filtered = mockDepts.filter((d) => {
        if (query.deptName && !d.deptName.includes(query.deptName)) {
          return false;
        }
        if (query.status && d.status !== query.status) {
          return false;
        }
        return true;
      });

      filtered.sort((a, b) => a.orderNum - b.orderNum);
      return this.success(res, filtered, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 获取部门树形结构
   */
  async getTree(req: Request, res: Response) {
    try {
      const tree = this.buildTree(mockDepts);
      return this.success(res, tree, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 根据 deptId 获取部门详情
   */
  async getById(req: Request, res: Response) {
    try {
      const { deptId } = req.params;
      const dept = mockDepts.find((d) => d.deptId === deptId);
      if (!dept) {
        return this.notFound(res, '部门不存在');
      }
      return this.success(res, dept, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 创建部门
   */
  async create(req: Request, res: Response) {
    try {
      const body = req.body as DeptCreateBody;
      if (!body.deptName) {
        return this.badRequest(res, 'deptName 必填');
      }

      const deptId = `d-${Date.now()}`;
      const parentId = body.parentId ?? null;
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
        orderNum: body.orderNum ?? 0,
        leader: body.leader ?? '',
        phone: body.phone ?? '',
        email: body.email ?? '',
        status: body.status ?? '0',
      };

      mockDepts.push(newDept);
      return this.created(res, newDept, '创建成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新部门
   */
  async update(req: Request, res: Response) {
    try {
      const body = req.body as DeptUpdateBody;
      if (!body.deptId) {
        return this.badRequest(res, 'deptId 必填');
      }

      const idx = mockDepts.findIndex((d) => d.deptId === body.deptId);
      if (idx === -1) {
        return this.notFound(res, '部门不存在');
      }

      const exist = mockDepts[idx];
      if (!exist) return this.notFound(res, '部门不存在');
      mockDepts[idx] = {
        deptId: exist.deptId,
        parentId: body.parentId !== undefined ? body.parentId : exist.parentId,
        ancestors: body.ancestors ?? exist.ancestors,
        deptName: body.deptName,
        orderNum: body.orderNum ?? exist.orderNum,
        leader: body.leader ?? exist.leader,
        phone: body.phone ?? exist.phone,
        email: body.email ?? exist.email,
        status: body.status ?? exist.status,
      };

      return this.success(res, mockDepts[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 删除部门
   */
  async remove(req: Request, res: Response) {
    try {
      const { deptId } = req.params;
      const idx = mockDepts.findIndex((d) => d.deptId === deptId);
      if (idx === -1) {
        return this.notFound(res, '部门不存在');
      }

      mockDepts.splice(idx, 1);
      return this.success(res, { deptId }, '删除成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  // ========================================================================
  // 私有工具方法
  // ========================================================================

  /**
   * 将扁平部门列表转换为树形结构
   */
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
        if (n.children.length > 0) {
          sortRecursive(n.children);
        }
      }
    };
    sortRecursive(roots);

    return roots;
  }
}

/** 部门控制器单例实例 */
export const deptController = new DeptController();
