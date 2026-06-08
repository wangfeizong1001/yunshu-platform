/**
 * 角色管理 Mock API
 * @module mock/routes/system/role
 */

import { MockMethod } from 'vite-plugin-mock'
import { success, fail, pageResult } from '../utils/response'
import { delay, randomDelay } from '../utils/delay'
import { db, type Role } from '../utils/database'

/** 格式化角色数据 */
function formatRole(role: Role) {
  return {
    ...role,
    menuIds: role.menuId ? [role.menuId] : [],
    deptIds: []
  }
}

export default [
  /**
   * 获取角色分页列表
   */
  {
    url: '/api/system/role/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string; keyword?: string; status?: string } }) => {
      await randomDelay()

      const pageNum = parseInt(query.pageNum || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const { keyword, status } = query

      let list = [...db.roles]

      if (keyword) {
        list = list.filter(r =>
          r.roleName.includes(keyword) ||
          r.roleKey.includes(keyword)
        )
      }
      if (status) {
        list = list.filter(r => r.status === status)
      }

      list.sort((a, b) => a.roleSort - b.roleSort)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const paginatedList = list.slice(start, end)

      return pageResult(paginatedList, list.length, pageNum, pageSize)
    }
  },

  /**
   * 获取角色列表
   */
  {
    url: '/api/system/role/list',
    method: 'get',
    response: async ({ query }: { query: { keyword?: string; status?: string } }) => {
      await delay()

      const { keyword, status } = query

      let list = [...db.roles]

      if (keyword) {
        list = list.filter(r =>
          r.roleName.includes(keyword) ||
          r.roleKey.includes(keyword)
        )
      }
      if (status) {
        list = list.filter(r => r.status === status)
      }

      return success(list)
    }
  },

  /**
   * 获取角色详情
   */
  {
    url: '/api/system/role/:roleId',
    method: 'get',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      return success(formatRole(role))
    }
  },

  /**
   * 新增角色
   */
  {
    url: '/api/system/role',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay()

      if (db.roles.some(r => r.roleKey === body.roleKey)) {
        return fail('角色标识已存在')
      }

      const maxId = Math.max(...db.roles.map(r => r.roleId))
      const newRole: Role = {
        roleId: maxId + 1,
        roleName: body.roleName,
        roleKey: body.roleKey,
        roleSort: body.roleSort || db.roles.length + 1,
        dataScope: body.dataScope || '5',
        menuCheckStrictly: body.menuCheckStrictly !== false,
        deptCheckStrictly: body.deptCheckStrictly !== false,
        status: body.status || '0',
        permissions: body.permissions || [],
        remark: body.remark || '',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      db.roles.push(newRole)
      return success(null, '新增成功')
    }
  },

  /**
   * 修改角色
   */
  {
    url: '/api/system/role/:roleId',
    method: 'put',
    response: async ({ params, body }: { params: { roleId: string }; body: any }) => {
      await delay()

      const index = db.roles.findIndex(r => r.roleId === parseInt(params.roleId))
      if (index === -1) {
        return fail('角色不存在', 404)
      }

      if (body.roleKey && db.roles.some(r => r.roleKey === body.roleKey && r.roleId !== parseInt(params.roleId))) {
        return fail('角色标识已存在')
      }

      db.roles[index] = {
        ...db.roles[index],
        ...body,
        roleId: parseInt(params.roleId)
      }

      return success(null, '修改成功')
    }
  },

  /**
   * 删除角色
   */
  {
    url: '/api/system/role/:roleId',
    method: 'delete',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay()

      const index = db.roles.findIndex(r => r.roleId === parseInt(params.roleId))
      if (index === -1) {
        return fail('角色不存在', 404)
      }

      if (parseInt(params.roleId) === 1) {
        return fail('不能删除超级管理员角色')
      }

      db.roles.splice(index, 1)
      return success(null, '删除成功')
    }
  },

  /**
   * 修改角色状态
   */
  {
    url: '/api/system/role/:roleId/status',
    method: 'put',
    response: async ({ params, body }: { params: { roleId: string }; body: { status: string } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      role.status = body.status
      return success(null, '状态修改成功')
    }
  },

  /**
   * 获取角色菜单列表
   */
  {
    url: '/api/system/role/:roleId/menus',
    method: 'get',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      // 返回该角色的菜单ID列表
      const menuIds = db.menus
        .filter(m => role.permissions.some(p => m.perms === p))
        .map(m => m.menuId)

      return success(menuIds)
    }
  },

  /**
   * 分配角色菜单权限
   */
  {
    url: '/api/system/role/:roleId/menus',
    method: 'put',
    response: async ({ params, body }: { params: { roleId: string }; body: { menuIds: number[] } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      // 根据菜单ID获取权限标识
      const menus = db.menus.filter(m => body.menuIds.includes(m.menuId) && m.perms)
      role.permissions = menus.map(m => m.perms!).filter(Boolean)
      role.permissions.push('*:*:*') // 管理员拥有所有权限

      return success(null, '菜单权限分配成功')
    }
  },

  /**
   * 获取角色数据权限
   */
  {
    url: '/api/system/role/:roleId/dataScope',
    method: 'get',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      return success({
        roleId: role.roleId,
        dataScope: role.dataScope,
        deptIds: []
      })
    }
  },

  /**
   * 分配角色数据权限
   */
  {
    url: '/api/system/role/:roleId/dataScope',
    method: 'put',
    response: async ({ params, body }: { params: { roleId: string }; body: { dataScope: string; deptIds?: number[] } }) => {
      await delay()

      const role = db.roles.find(r => r.roleId === parseInt(params.roleId))
      if (!role) {
        return fail('角色不存在', 404)
      }

      role.dataScope = body.dataScope
      return success(null, '数据权限修改成功')
    }
  }
] as MockMethod[]
