/**
 * 菜单管理控制器
 *
 * 提供系统菜单相关的 CRUD 操作接口，包括菜单列表查询、树形结构、菜单详情、
 * 新增、修改、删除以及按用户获取菜单树等功能。
 *
 * @module system/MenuController
 */

import type { Request, Response } from 'express';
import { BaseController } from '../../controller/BaseController';

// ============================================================================
// 类型定义
// ============================================================================

/** 菜单类型 M目录 C菜单 F按钮 */
type MenuType = 'M' | 'C' | 'F';

/** 是否可见 0显示 1隐藏 */
type MenuVisible = '0' | '1';

/** 菜单状态 0正常 1停用 */
type MenuStatus = '0' | '1';

/** 是否外链 0否 1是 */
type MenuFrame = '0' | '1';

/** 是否缓存 0不缓存 1缓存 */
type MenuCache = '0' | '1';

/** 菜单数据结构 */
interface Menu {
  /** 菜单ID */
  menuId: string;
  /** 菜单名称 */
  menuName: string;
  /** 父菜单ID（NULL 或空表示根节点） */
  parentId: string | null;
  /** 显示顺序 */
  orderNum: number;
  /** 路由地址 */
  path: string;
  /** 组件路径 */
  component: string;
  /** 路由参数 */
  query: string;
  /** 是否外链 0否 1是 */
  isFrame: MenuFrame;
  /** 是否缓存 0不缓存 1缓存 */
  isCache: MenuCache;
  /** 菜单类型 M目录 C菜单 F按钮 */
  menuType: MenuType;
  /** 是否可见 0显示 1隐藏 */
  visible: MenuVisible;
  /** 状态 0正常 1停用 */
  status: MenuStatus;
  /** 权限标识 */
  perms: string;
  /** 图标 */
  icon: string;
}

/** 带 children 的树形菜单节点 */
interface MenuTreeNode extends Menu {
  children: MenuTreeNode[];
}

/** 菜单查询参数 */
interface MenuQueryParams {
  /** 菜单名称（模糊匹配） */
  menuName?: string;
  /** 状态 */
  status?: MenuStatus;
}

/** 创建菜单请求体 */
interface MenuCreateBody {
  menuName: string;
  parentId?: string | null;
  orderNum?: number;
  path?: string;
  component?: string;
  query?: string;
  isFrame?: MenuFrame;
  isCache?: MenuCache;
  menuType?: MenuType;
  visible?: MenuVisible;
  status?: MenuStatus;
  perms?: string;
  icon?: string;
}

/** 更新菜单请求体 */
interface MenuUpdateBody extends MenuCreateBody {
  menuId: string;
}

// ============================================================================
// Mock 数据（内存存储）
// ============================================================================

let mockMenus: Menu[] = [
  {
    menuId: 'm-1',
    menuName: '系统管理',
    parentId: null,
    orderNum: 1,
    path: '/system',
    component: 'Layout',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'system',
  },
  {
    menuId: 'm-100',
    menuName: '用户管理',
    parentId: 'm-1',
    orderNum: 1,
    path: 'user',
    component: 'system/user/index',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:user:list',
    icon: 'user',
  },
  {
    menuId: 'm-101',
    menuName: '角色管理',
    parentId: 'm-1',
    orderNum: 2,
    path: 'role',
    component: 'system/role/index',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:role:list',
    icon: 'peoples',
  },
  {
    menuId: 'm-102',
    menuName: '菜单管理',
    parentId: 'm-1',
    orderNum: 3,
    path: 'menu',
    component: 'system/menu/index',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:menu:list',
    icon: 'tree-table',
  },
  {
    menuId: 'm-2',
    menuName: '系统监控',
    parentId: null,
    orderNum: 2,
    path: '/monitor',
    component: 'Layout',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'monitor',
  },
  {
    menuId: 'm-200',
    menuName: '在线用户',
    parentId: 'm-2',
    orderNum: 1,
    path: 'online',
    component: 'monitor/online/index',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:online:list',
    icon: 'online',
  },
  {
    menuId: 'm-3',
    menuName: '系统工具',
    parentId: null,
    orderNum: 3,
    path: '/tool',
    component: 'Layout',
    query: '',
    isFrame: '0',
    isCache: '0',
    menuType: 'M',
    visible: '1',
    status: '1',
    perms: '',
    icon: 'tool',
  },
];

// ============================================================================
// 控制器实现
// ============================================================================

/**
 * 菜单管理控制器类
 *
 * 继承 BaseController，封装了系统菜单的全部 CRUD 操作与树形结构生成。
 */
export class MenuController extends BaseController {
  /**
   * 菜单列表查询（全量不分页）
   *
   * 支持按 menuName（模糊匹配）、status 过滤，按 orderNum 排序。
   */
  async list(req: Request, res: Response) {
    try {
      const query = req.query as unknown as MenuQueryParams;

      const filtered = mockMenus.filter((m) => {
        if (query.menuName && !m.menuName.includes(query.menuName)) {
          return false;
        }
        if (query.status && m.status !== query.status) {
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
   * 获取菜单树形结构
   *
   * parentId 为 NULL/空 的节点为根节点，递归组合 children。
   */
  async getTree(req: Request, res: Response) {
    try {
      const tree = this.buildTree(mockMenus);
      return this.success(res, tree, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 根据 menuId 获取菜单详情
   */
  async getById(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const menu = mockMenus.find((m) => m.menuId === menuId);
      if (!menu) {
        return this.notFound(res, '菜单不存在');
      }
      return this.success(res, menu, '获取成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 创建菜单
   */
  async create(req: Request, res: Response) {
    try {
      const body = req.body as MenuCreateBody;
      if (!body.menuName) {
        return this.badRequest(res, 'menuName 必填');
      }

      const menuId = `m-${Date.now()}`;
      const newMenu: Menu = {
        menuId,
        menuName: body.menuName,
        parentId: body.parentId ?? null,
        orderNum: body.orderNum ?? 0,
        path: body.path ?? '',
        component: body.component ?? '',
        query: body.query ?? '',
        isFrame: body.isFrame ?? '0',
        isCache: body.isCache ?? '0',
        menuType: body.menuType ?? 'C',
        visible: body.visible ?? '0',
        status: body.status ?? '0',
        perms: body.perms ?? '',
        icon: body.icon ?? '#',
      };

      mockMenus.push(newMenu);
      return this.created(res, newMenu, '创建成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 更新菜单
   */
  async update(req: Request, res: Response) {
    try {
      const body = req.body as MenuUpdateBody;
      if (!body.menuId) {
        return this.badRequest(res, 'menuId 必填');
      }

      const idx = mockMenus.findIndex((m) => m.menuId === body.menuId);
      if (idx === -1) {
        return this.notFound(res, '菜单不存在');
      }

      const exist = mockMenus[idx];
      if (!exist) return this.notFound(res, '菜单不存在');
      mockMenus[idx] = {
        menuId: exist.menuId,
        menuName: body.menuName,
        parentId: body.parentId !== undefined ? body.parentId : exist.parentId,
        orderNum: body.orderNum ?? exist.orderNum,
        path: body.path ?? exist.path,
        component: body.component ?? exist.component,
        query: body.query ?? exist.query,
        isFrame: body.isFrame ?? exist.isFrame,
        isCache: body.isCache ?? exist.isCache,
        menuType: body.menuType ?? exist.menuType,
        visible: body.visible ?? exist.visible,
        status: body.status ?? exist.status,
        perms: body.perms ?? exist.perms,
        icon: body.icon ?? exist.icon,
      };

      return this.success(res, mockMenus[idx], '更新成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 删除菜单
   */
  async remove(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const idx = mockMenus.findIndex((m) => m.menuId === menuId);
      if (idx === -1) {
        return this.notFound(res, '菜单不存在');
      }

      mockMenus.splice(idx, 1);
      return this.success(res, { menuId }, '删除成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  /**
   * 按用户获取菜单树
   *
   * 简化实现：与 getTree 返回相同的树形结构。
   */
  async getTreeByUserId(req: Request, res: Response) {
    try {
      const tree = this.buildTree(mockMenus);
      return this.success(res, tree, '查询成功');
    } catch (err) {
      return this.error(res, err as Error, 500);
    }
  }

  // ========================================================================
  // 私有工具方法
  // ========================================================================

  /**
   * 将扁平菜单列表转换为树形结构
   */
  private buildTree(list: Menu[]): MenuTreeNode[] {
    const map = new Map<string, MenuTreeNode>();
    const roots: MenuTreeNode[] = [];

    for (const item of list) {
      map.set(item.menuId, { ...item, children: [] });
    }

    for (const item of list) {
      const node = map.get(item.menuId)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const sortRecursive = (nodes: MenuTreeNode[]) => {
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

/** 菜单控制器单例实例 */
export const menuController = new MenuController();
