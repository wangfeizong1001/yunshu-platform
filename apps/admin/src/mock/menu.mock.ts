/**
 * 菜单 Mock 数据
 */

import type { SysMenu } from '@yunshu/shared'

// 生成 Mock 菜单数据
export const mockMenuList: SysMenu[] = [
  // 系统管理目录
  {
    menuId: 1,
    menuName: '系统管理',
    parentId: 0,
    path: '/system',
    component: '',
    query: '',
    isFrame: false,
    isCache: false,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'Setting',
    orderNum: 1,
    children: [
      {
        menuId: 101,
        menuName: '用户管理',
        parentId: 1,
        path: 'user',
        component: '/system/user/UserList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:user:list',
        icon: 'User',
        orderNum: 1,
      },
      {
        menuId: 102,
        menuName: '角色管理',
        parentId: 1,
        path: 'role',
        component: '/system/role/RoleList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:role:list',
        icon: 'Role',
        orderNum: 2,
      },
      {
        menuId: 103,
        menuName: '菜单管理',
        parentId: 1,
        path: 'menu',
        component: '/system/menu/MenuList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:menu:list',
        icon: 'Menu',
        orderNum: 3,
      },
      {
        menuId: 104,
        menuName: '部门管理',
        parentId: 1,
        path: 'dept',
        component: '/system/dept/DeptTree',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:dept:list',
        icon: 'Dept',
        orderNum: 4,
      },
      {
        menuId: 105,
        menuName: '岗位管理',
        parentId: 1,
        path: 'post',
        component: '/system/post/PostList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:post:list',
        icon: 'Post',
        orderNum: 5,
      },
    ],
  },
  // 工具目录
  {
    menuId: 2,
    menuName: '系统工具',
    parentId: 0,
    path: '/tool',
    component: '',
    query: '',
    isFrame: false,
    isCache: false,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'Tools',
    orderNum: 2,
    children: [
      {
        menuId: 201,
        menuName: '字典管理',
        parentId: 2,
        path: 'dict',
        component: '/tool/dict/DictList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:dict:list',
        icon: 'Document',
        orderNum: 1,
      },
      {
        menuId: 202,
        menuName: '参数管理',
        parentId: 2,
        path: 'config',
        component: '/tool/config/ConfigList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:config:list',
        icon: 'Setting',
        orderNum: 2,
      },
    ],
  },
  // 监控目录
  {
    menuId: 3,
    menuName: '系统监控',
    parentId: 0,
    path: '/monitor',
    component: '',
    query: '',
    isFrame: false,
    isCache: false,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'Monitor',
    orderNum: 3,
    children: [
      {
        menuId: 301,
        menuName: '在线用户',
        parentId: 3,
        path: 'online',
        component: '/monitor/online/OnlineList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:online:list',
        icon: 'User',
        orderNum: 1,
      },
      {
        menuId: 302,
        menuName: '操作日志',
        parentId: 3,
        path: 'log/oper',
        component: '/monitor/log/OperLogList',
        query: '',
        isFrame: false,
        isCache: false,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:oper:list',
        icon: 'Document',
        orderNum: 2,
      },
    ],
  },
]

// 获取菜单树 Mock
export function getMockMenuTree(params?: any): SysMenu[] {
  let menuList = mockMenuList

  // 关键词过滤
  if (params?.menuName) {
    const filterMenus = (menus: SysMenu[]): SysMenu[] => {
      return menus
        .filter((menu) => menu.menuName.includes(params.menuName))
        .map((menu) => ({
          ...menu,
          children: menu.children ? filterMenus(menu.children) : undefined,
        }))
    }
    menuList = filterMenus(menuList)
  }

  // 状态过滤
  if (params?.status) {
    const filterByStatus = (menus: SysMenu[]): SysMenu[] => {
      return menus
        .filter((menu) => menu.status === params.status)
        .map((menu) => ({
          ...menu,
          children: menu.children ? filterByStatus(menu.children) : undefined,
        }))
    }
    menuList = filterByStatus(menuList)
  }

  return menuList
}

// 获取菜单详情 Mock
export function getMockMenuDetail(menuId: number): SysMenu | undefined {
  const findMenu = (menus: SysMenu[]): SysMenu | undefined => {
    for (const menu of menus) {
      if (menu.menuId === menuId) return menu
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return undefined
  }
  return findMenu(mockMenuList)
}
