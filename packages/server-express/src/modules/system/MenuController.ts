/**
 * 菜单管理控制器
 *
 * @module @yunshu/server-express/modules/system
 */

import type { Request, Response } from 'express';
import type { SysMenu, SysMenuQuery, SysMenuForm } from '@yunshu/shared';
import { BaseController } from '../../controller/BaseController';

/** 模拟菜单数据 */
const mockMenus: SysMenu[] = [
  {
    menuId: 1,
    menuName: '系统管理',
    parentId: 0,
    path: '/system',
    component: undefined,
    isFrame: true,
    isCache: false,
    menuType: 'M',
    visible: '0',
    status: '0',
    icon: 'setting',
    orderNum: 1,
    children: [
      {
        menuId: 100,
        menuName: '用户管理',
        parentId: 1,
        path: 'user',
        component: '/system/user/index',
        isFrame: true,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:user:list',
        icon: 'user',
        orderNum: 1,
        createTime: '2024-01-15 08:00:00',
      },
      {
        menuId: 101,
        menuName: '角色管理',
        parentId: 1,
        path: 'role',
        component: '/system/role/index',
        isFrame: true,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:role:list',
        icon: 'role',
        orderNum: 2,
        createTime: '2024-01-15 08:00:00',
      },
      {
        menuId: 102,
        menuName: '菜单管理',
        parentId: 1,
        path: 'menu',
        component: '/system/menu/index',
        isFrame: true,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:menu:list',
        icon: 'menu',
        orderNum: 3,
        createTime: '2024-01-15 08:00:00',
      },
    ],
    createTime: '2024-01-15 08:00:00',
  },
  {
    menuId: 2,
    menuName: '系统监控',
    parentId: 0,
    path: '/monitor',
    component: undefined,
    isFrame: true,
    isCache: false,
    menuType: 'M',
    visible: '0',
    status: '0',
    icon: 'monitor',
    orderNum: 2,
    children: [
      {
        menuId: 200,
        menuName: '在线用户',
        parentId: 2,
        path: 'online',
        component: '/monitor/online/index',
        isFrame: true,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:online:list',
        icon: 'online',
        orderNum: 1,
        createTime: '2024-01-15 08:00:00',
      },
      {
        menuId: 201,
        menuName: '定时任务',
        parentId: 2,
        path: 'job',
        component: '/monitor/job/index',
        isFrame: true,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:job:list',
        icon: 'job',
        orderNum: 2,
        createTime: '2024-01-15 08:00:00',
      },
    ],
    createTime: '2024-01-15 08:00:00',
  },
];

export class MenuController extends BaseController {
  /**
   * 获取菜单分页列表
   */
  async list(req: Request, res: Response): Promise<Response> {
    const params: SysMenuQuery = {
      keyword: req.query.keyword as string,
      status: req.query.status as SysMenuQuery['status'],
      menuType: req.query.menuType as SysMenuQuery['menuType'],
    };

    const buildMenuTree = (menus: SysMenu[], parentId: number): SysMenu[] => {
      return menus
        .filter(m => m.parentId === parentId)
        .map(m => ({
          ...m,
          children: buildMenuTree(menus, m.menuId),
        }))
        .sort((a, b) => a.orderNum - b.orderNum);
    };

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    let filtered = [...allMenus];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(m => m.menuName.toLowerCase().includes(kw));
    }

    if (params.status) {
      filtered = filtered.filter(m => m.status === params.status);
    }

    if (params.menuType) {
      filtered = filtered.filter(m => m.menuType === params.menuType);
    }

    return this.success(res, filtered);
  }

  /**
   * 获取菜单树
   */
  async getTree(req: Request, res: Response): Promise<Response> {
    const { type } = req.query;

    const buildMenuTree = (menus: SysMenu[], parentId: number): SysMenu[] => {
      return menus
        .filter(m => m.parentId === parentId)
        .map(m => ({
          ...m,
          children: buildMenuTree(menus, m.menuId),
        }))
        .sort((a, b) => a.orderNum - b.orderNum);
    };

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    if (type === 'all') {
      return this.success(res, buildMenuTree(allMenus, 0));
    }

    return this.success(res, buildMenuTree(mockMenus, 0));
  }

  /**
   * 获取菜单详情
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    const menu = allMenus.find(m => m.menuId === Number(id));

    if (!menu) {
      return this.notFound(res, '菜单不存在');
    }

    return this.success(res, menu);
  }

  /**
   * 获取路由列表
   */
  async getRoutes(_req: Request, res: Response): Promise<Response> {
    const buildMenuTree = (menus: SysMenu[], parentId: number): SysMenu[] => {
      return menus
        .filter(m => m.parentId === parentId && m.status === '0')
        .map(m => ({
          ...m,
          children: buildMenuTree(menus, m.menuId),
        }))
        .sort((a, b) => a.orderNum - b.orderNum);
    };

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    const routes = buildMenuTree(allMenus, 0).filter(m => m.menuType !== 'F');

    return this.success(res, routes);
  }

  /**
   * 创建菜单
   */
  async create(req: Request, res: Response): Promise<Response> {
    const data: SysMenuForm = req.body;

    if (!data.menuName || !data.parentId || !data.menuType) {
      return this.badRequest(res, '请填写完整的菜单信息');
    }

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    const newMenu: SysMenu = {
      menuId: Math.max(...allMenus.map(m => m.menuId)) + 1,
      menuName: data.menuName,
      parentId: data.parentId,
      path: data.path || '',
      component: data.component,
      query: data.query,
      isFrame: data.isFrame ?? true,
      isCache: data.isCache ?? false,
      menuType: data.menuType,
      visible: data.visible || '0',
      status: data.status || '0',
      perms: data.perms,
      icon: data.icon || '',
      orderNum: data.orderNum ?? 0,
      createTime: new Date().toLocaleString('zh-CN'),
    };

    if (newMenu.parentId === 0) {
      mockMenus.push(newMenu);
    } else {
      const parent = allMenus.find(m => m.menuId === newMenu.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(newMenu);
      }
    }

    return this.created(res, newMenu, '创建成功');
  }

  /**
   * 更新菜单
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: SysMenuForm = req.body;

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    const index = allMenus.findIndex(m => m.menuId === Number(id));

    if (index === -1) {
      return this.notFound(res, '菜单不存在');
    }

    const menu = allMenus[index];
    const updatedMenu: SysMenu = {
      ...menu,
      menuName: data.menuName ?? menu.menuName,
      parentId: data.parentId ?? menu.parentId,
      path: data.path ?? menu.path,
      component: data.component ?? menu.component,
      query: data.query ?? menu.query,
      isFrame: data.isFrame ?? menu.isFrame,
      isCache: data.isCache ?? menu.isCache,
      menuType: data.menuType ?? menu.menuType,
      visible: data.visible ?? menu.visible,
      status: data.status ?? menu.status,
      perms: data.perms ?? menu.perms,
      icon: data.icon ?? menu.icon,
      orderNum: data.orderNum ?? menu.orderNum,
    };

    Object.assign(menu, updatedMenu);

    return this.success(res, updatedMenu, '更新成功');
  }

  /**
   * 删除菜单
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const allMenus = mockMenus.flatMap(m => {
      const result: SysMenu[] = [m];
      if (m.children) {
        result.push(...m.children);
      }
      return result;
    });

    const index = allMenus.findIndex(m => m.menuId === Number(id));

    if (index === -1) {
      return this.notFound(res, '菜单不存在');
    }

    const menu = allMenus[index];

    if (menu.parentId === 0) {
      const parentIndex = mockMenus.findIndex(m => m.menuId === Number(id));
      if (parentIndex !== -1) {
        mockMenus.splice(parentIndex, 1);
      }
    } else {
      const parentMenu = allMenus.find(m => m.menuId === menu.parentId);
      if (parentMenu && parentMenu.children) {
        const childIndex = parentMenu.children.findIndex(c => c.menuId === Number(id));
        if (childIndex !== -1) {
          parentMenu.children.splice(childIndex, 1);
        }
      }
    }

    return this.success(res, null, '删除成功');
  }

  /**
   * 导出菜单
   */
  async export(_req: Request, res: Response): Promise<Response> {
    return this.success(res, mockMenus);
  }
}

export const menuController = new MenuController();
