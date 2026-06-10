/**
 * 菜单管理 Mock API
 * @module mock/routes/system/menu
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, treeResult } from '../../utils/response';
import { delay, randomDelay } from '../../utils/delay';
import { db, type Menu } from '../../utils/database';

/** 递归构建菜单树 */
function buildMenuTree(menus: Menu[], parentId: number = 0): any[] {
  return menus
    .filter((m) => m.parentId === parentId)
    .sort((a, b) => a.orderNum - b.orderNum)
    .map((m) => ({
      ...m,
      children: buildMenuTree(menus, m.menuId),
    }));
}

export default [
  /**
   * 获取菜单列表
   */
  {
    url: '/api/system/menu/list',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { keyword?: string; status?: string; menuType?: string };
    }) => {
      await delay();

      const { keyword, status, menuType } = query;

      let list = [...db.menus];

      if (keyword) {
        list = list.filter(
          (m) => m.menuName.includes(keyword) || (m.perms && m.perms.includes(keyword)),
        );
      }
      if (status) {
        list = list.filter((m) => m.status === status);
      }
      if (menuType) {
        list = list.filter((m) => m.menuType === menuType);
      }

      return success(list);
    },
  },

  /**
   * 获取菜单树
   */
  {
    url: '/api/system/menu/treeselect',
    method: 'get',
    response: async () => {
      await delay();
      const tree = buildMenuTree(db.menus, 0);
      return success(tree);
    },

    /**
     * 获取角色对应的菜单树
     */
  },
  {
    url: '/api/system/menu/roleMenuTreeselect/:roleId',
    method: 'get',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay();

      const role = db.roles.find((r) => r.roleId === parseInt(params.roleId));
      if (!role) {
        return fail('角色不存在', 404);
      }

      const menuTree = buildMenuTree(db.menus, 0);
      const checkedKeys = db.menus
        .filter((m) => role.permissions.some((p) => m.perms === p))
        .map((m) => m.menuId);

      return success({
        menus: menuTree,
        checkedKeys,
      });
    },
  },

  /**
   * 获取菜单详情
   */
  {
    url: '/api/system/menu/:menuId',
    method: 'get',
    response: async ({ params }: { params: { menuId: string } }) => {
      await delay();

      const menu = db.menus.find((m) => m.menuId === parseInt(params.menuId));
      if (!menu) {
        return fail('菜单不存在', 404);
      }

      return success(menu);
    },
  },

  /**
   * 新增菜单
   */
  {
    url: '/api/system/menu',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      const maxId = Math.max(...db.menus.map((m) => m.menuId));
      const newMenu: Menu = {
        menuId: maxId + 1,
        parentId: body.parentId || 0,
        menuName: body.menuName,
        path: body.path || '',
        component: body.component,
        query: body.query,
        isFrame: body.isFrame !== undefined ? body.isFrame : true,
        isCache: body.isCache || false,
        menuType: body.menuType || 'C',
        visible: body.visible || '0',
        status: body.status || '0',
        perms: body.perms,
        icon: body.icon || 'file',
        orderNum:
          body.orderNum || db.menus.filter((m) => m.parentId === (body.parentId || 0)).length + 1,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      db.menus.push(newMenu);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改菜单
   */
  {
    url: '/api/system/menu/:menuId',
    method: 'put',
    response: async ({ params, body }: { params: { menuId: string }; body: any }) => {
      await delay();

      const index = db.menus.findIndex((m) => m.menuId === parseInt(params.menuId));
      if (index === -1) {
        return fail('菜单不存在', 404);
      }

      db.menus[index] = {
        ...db.menus[index],
        ...body,
        menuId: parseInt(params.menuId),
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除菜单
   */
  {
    url: '/api/system/menu/:menuId',
    method: 'delete',
    response: async ({ params }: { params: { menuId: string } }) => {
      await delay();

      const menuId = parseInt(params.menuId);

      // 检查是否有子菜单
      if (db.menus.some((m) => m.parentId === menuId)) {
        return fail('存在子菜单，无法删除');
      }

      const index = db.menus.findIndex((m) => m.menuId === menuId);
      if (index === -1) {
        return fail('菜单不存在', 404);
      }

      db.menus.splice(index, 1);
      return success(null, '删除成功');
    },
  },
] as MockMethod[];
