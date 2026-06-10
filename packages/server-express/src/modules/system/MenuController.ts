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

const MAX_BATCH_SIZE = 100;
const MAX_QUERY_PARAM_LENGTH = 100;
const MAX_FIELD_LENGTH = 500;

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
// 私有校验工具
// ============================================================================

function isValidMenuName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length >= 1 && name.length <= 50;
}

function isValidMenuType(t: unknown): t is MenuType {
  return t === 'M' || t === 'C' || t === 'F';
}

function isValidBinary(v: unknown): v is '0' | '1' {
  return v === '0' || v === '1';
}

function isValidOrderNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 9999;
}

function isSystemMenu(menu: Menu): boolean {
  return menu.menuType === 'M' && menu.menuName.includes('系统');
}

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
   */
  async list(req: Request, res: Response) {
    const query = req.query as unknown as MenuQueryParams;

    const menuNameParam = this.safeParam(query.menuName, MAX_QUERY_PARAM_LENGTH);
    const statusParam = this.safeParam(query.status, 1);

    const filtered = mockMenus.filter((m) => {
      if (menuNameParam && !m.menuName.includes(menuNameParam)) return false;
      if (statusParam && m.status !== statusParam) return false;
      return true;
    });

    filtered.sort((a, b) => a.orderNum - b.orderNum);
    return this.success(res, filtered, '查询成功');
  }

  /**
   * 获取菜单树形结构
   */
  async getTree(req: Request, res: Response) {
    const tree = this.buildTree(mockMenus);
    return this.success(res, tree, '查询成功');
  }

  /**
   * 根据 menuId 获取菜单详情
   */
  async getById(req: Request, res: Response) {
    const { menuId } = req.params;
    const safeId = this.safeParam(menuId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'menuId 参数非法');

    const menu = mockMenus.find((m) => m.menuId === safeId);
    if (!menu) return this.notFound(res, '菜单不存在');
    return this.success(res, menu, '获取成功');
  }

  /**
   * 创建菜单
   */
  async create(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as MenuCreateBody;
    if (!isValidMenuName(body.menuName)) return this.badRequest(res, 'menuName 长度 1-50');

    const menuType = body.menuType ?? 'C';
    if (!isValidMenuType(menuType)) return this.badRequest(res, 'menuType 必须是 M/C/F');

    const orderNum = body.orderNum ?? 0;
    if (!isValidOrderNum(orderNum)) return this.badRequest(res, 'orderNum 必须是 0-9999 的数字');

    const visible = body.visible ?? '0';
    if (!isValidBinary(visible)) return this.badRequest(res, 'visible 必须是 0 或 1');
    const status = body.status ?? '0';
    if (!isValidBinary(status)) return this.badRequest(res, 'status 必须是 0 或 1');
    const isFrame = body.isFrame ?? '0';
    if (!isValidBinary(isFrame)) return this.badRequest(res, 'isFrame 必须是 0 或 1');
    const isCache = body.isCache ?? '0';
    if (!isValidBinary(isCache)) return this.badRequest(res, 'isCache 必须是 0 或 1');

    const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '';
    const component = typeof body.component === 'string' ? body.component.slice(0, 200) : '';
    const query = typeof body.query === 'string' ? body.query.slice(0, 200) : '';
    const perms = typeof body.perms === 'string' ? body.perms.slice(0, 200) : '';
    const icon = typeof body.icon === 'string' ? body.icon.slice(0, 100) : '#';

    const parentId = body.parentId !== undefined
      ? (body.parentId === null || body.parentId === '' ? null : String(body.parentId).slice(0, MAX_FIELD_LENGTH))
      : null;

    const menuId = `m-${Date.now()}`;
    const newMenu: Menu = {
      menuId,
      menuName: body.menuName,
      parentId,
      orderNum,
      path,
      component,
      query,
      isFrame,
      isCache,
      menuType,
      visible,
      status,
      perms,
      icon,
    };

    mockMenus.push(newMenu);
    return this.created(res, newMenu, '创建成功');
  }

  /**
   * 更新菜单
   */
  async update(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const body = req.body as MenuUpdateBody;
    const safeId = this.safeParam(body.menuId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'menuId 必填');

    const exist = mockMenus.find((m) => m.menuId === safeId);
    if (!exist) return this.notFound(res, '菜单不存在');
    const idx = mockMenus.indexOf(exist);

    if (!isValidMenuName(body.menuName)) return this.badRequest(res, 'menuName 长度 1-50');

    const menuType = body.menuType ?? exist.menuType;
    if (!isValidMenuType(menuType)) return this.badRequest(res, 'menuType 必须是 M/C/F');

    const orderNum = body.orderNum ?? exist.orderNum;
    if (!isValidOrderNum(orderNum)) return this.badRequest(res, 'orderNum 必须是 0-9999 的数字');

    const visible = body.visible ?? exist.visible;
    if (!isValidBinary(visible)) return this.badRequest(res, 'visible 必须是 0 或 1');
    const status = body.status ?? exist.status;
    if (!isValidBinary(status)) return this.badRequest(res, 'status 必须是 0 或 1');
    const isFrame = body.isFrame ?? exist.isFrame;
    if (!isValidBinary(isFrame)) return this.badRequest(res, 'isFrame 必须是 0 或 1');
    const isCache = body.isCache ?? exist.isCache;
    if (!isValidBinary(isCache)) return this.badRequest(res, 'isCache 必须是 0 或 1');

    const path = typeof body.path === 'string' ? body.path.slice(0, 200) : exist.path;
    const component = typeof body.component === 'string' ? body.component.slice(0, 200) : exist.component;
    const query = typeof body.query === 'string' ? body.query.slice(0, 200) : exist.query;
    const perms = typeof body.perms === 'string' ? body.perms.slice(0, 200) : exist.perms;
    const icon = typeof body.icon === 'string' ? body.icon.slice(0, 100) : exist.icon;
    const parentId = body.parentId !== undefined
      ? (body.parentId === null || body.parentId === '' ? null : String(body.parentId).slice(0, MAX_FIELD_LENGTH))
      : exist.parentId;

    mockMenus[idx] = {
      menuId: exist.menuId,
      menuName: body.menuName,
      parentId,
      orderNum,
      path,
      component,
      query,
      isFrame,
      isCache,
      menuType,
      visible,
      status,
      perms,
      icon,
    };

    return this.success(res, mockMenus[idx], '更新成功');
  }

  /**
   * 删除菜单
   */
  async remove(req: Request, res: Response) {
    const role = this.getCurrentUserRole(req);
    if (role !== 'admin') return this.forbidden(res, '需要管理员权限');

    const { menuId } = req.params;
    const safeId = this.safeParam(menuId, MAX_FIELD_LENGTH);
    if (!safeId) return this.badRequest(res, 'menuId 参数非法');

    const target = mockMenus.find((m) => m.menuId === safeId);
    if (!target) return this.notFound(res, '菜单不存在');
    const idx = mockMenus.indexOf(target);

    if (isSystemMenu(target)) {
      return this.forbidden(res, '系统内置菜单不允许删除');
    }

    mockMenus.splice(idx, 1);
    return this.success(res, { menuId: safeId }, '删除成功');
  }

  /**
   * 按用户获取菜单树
   */
  async getTreeByUserId(req: Request, res: Response) {
    const tree = this.buildTree(mockMenus);
    return this.success(res, tree, '查询成功');
  }

  // ========================================================================
  // 私有工具方法
  // ========================================================================

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
        if (n.children.length > 0) sortRecursive(n.children);
      }
    };
    sortRecursive(roots);

    return roots;
  }
}

/** 菜单控制器单例实例 */
export const menuController = new MenuController();
