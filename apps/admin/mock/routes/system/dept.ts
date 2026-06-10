/**
 * 部门管理 Mock API
 * @module mock/routes/system/dept
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import { db, type Dept } from '../utils/database';

/** 递归构建部门树 */
function buildDeptTree(depts: Dept[], parentId: number = 0): any[] {
  return depts
    .filter((d) => d.parentId === parentId)
    .sort((a, b) => a.deptId - b.deptId)
    .map((d) => ({
      ...d,
      children: buildDeptTree(depts, d.deptId),
      hasChildren: depts.some((c) => c.parentId === d.deptId),
    }));
}

/** 扁平化部门树 */
function flattenDeptTree(depts: any[]): Dept[] {
  const result: Dept[] = [];
  for (const dept of depts) {
    const { children, ...deptData } = dept;
    result.push(deptData);
    if (children && children.length > 0) {
      result.push(...flattenDeptTree(children));
    }
  }
  return result;
}

export default [
  /**
   * 获取部门列表
   */
  {
    url: '/api/system/dept/list',
    method: 'get',
    response: async () => {
      await delay();
      const tree = buildDeptTree(db.depts, 0);
      return success(tree);
    },
  },

  /**
   * 获取部门树（用于选择器）
   */
  {
    url: '/api/system/dept/treeselect',
    method: 'get',
    response: async () => {
      await delay();
      const tree = buildDeptTree(db.depts, 0);
      return success(tree);
    },
  },

  /**
   * 获取角色对应的部门树
   */
  {
    url: '/api/system/dept/roleDeptTreeselect/:roleId',
    method: 'get',
    response: async ({ params }: { params: { roleId: string } }) => {
      await delay();

      const role = db.roles.find((r) => r.roleId === parseInt(params.roleId));
      if (!role) {
        return fail('角色不存在', 404);
      }

      const deptTree = buildDeptTree(db.depts, 0);
      const checkedKeys: number[] = [];

      // 根据数据权限范围确定选中的部门
      if (role.dataScope === '1') {
        // 全部数据权限
        checkedKeys.push(0);
      } else if (role.dataScope === '2') {
        // 自定数据权限
        checkedKeys.push(100, 101); // 示例
      } else if (role.dataScope === '3') {
        // 本部门数据权限
        checkedKeys.push(100);
      } else if (role.dataScope === '4') {
        // 本部门及以下
        const flatDepts = flattenDeptTree(deptTree);
        const rootDept = flatDepts.find((d) => d.deptId === 100);
        if (rootDept) {
          checkedKeys.push(100);
        }
      }

      return success({
        depts: deptTree,
        checkedKeys,
      });
    },
  },

  /**
   * 获取部门详情
   */
  {
    url: '/api/system/dept/:deptId',
    method: 'get',
    response: async ({ params }: { params: { deptId: string } }) => {
      await delay();

      const dept = db.depts.find((d) => d.deptId === parseInt(params.deptId));
      if (!dept) {
        return fail('部门不存在', 404);
      }

      return success(dept);
    },
  },

  /**
   * 新增部门
   */
  {
    url: '/api/system/dept',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      const maxId = Math.max(...flattenDeptTree(db.depts).map((d) => d.deptId));
      const ancestors = body.parentId === 0 ? '0' : `${body.ancestors || '0'},${body.parentId}`;

      const newDept: Dept = {
        deptId: maxId + 1,
        parentId: body.parentId || 0,
        ancestors,
        deptName: body.deptName,
        leader: body.leader,
        phone: body.phone,
        email: body.email,
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      // 添加到对应的父部门children中
      if (body.parentId === 0) {
        db.depts.push(newDept);
      } else {
        // 扁平化部门列表中查找
        const flatDepts = flattenDeptTree(db.depts);
        const parentIndex = flatDepts.findIndex((d) => d.deptId === body.parentId);
        if (parentIndex > -1) {
          // 简单处理：直接添加
          db.depts.push(newDept);
        }
      }

      return success(null, '新增成功');
    },
  },

  /**
   * 修改部门
   */
  {
    url: '/api/system/dept/:deptId',
    method: 'put',
    response: async ({ params, body }: { params: { deptId: string }; body: any }) => {
      await delay();

      const flatDepts = flattenDeptTree(db.depts);
      const index = flatDepts.findIndex((d) => d.deptId === parseInt(params.deptId));
      if (index === -1) {
        return fail('部门不存在', 404);
      }

      // 更新祖先路径
      if (body.parentId !== undefined && body.parentId !== flatDepts[index].parentId) {
        body.ancestors = body.parentId === 0 ? '0' : `${body.ancestors || '0'},${body.parentId}`;
      }

      // 更新数据库中的部门
      const deptIndex = db.depts.findIndex((d) => d.deptId === parseInt(params.deptId));
      if (deptIndex > -1) {
        db.depts[deptIndex] = { ...db.depts[deptIndex], ...body };
      }

      return success(null, '修改成功');
    },
  },

  /**
   * 删除部门
   */
  {
    url: '/api/system/dept/:deptId',
    method: 'delete',
    response: async ({ params }: { params: { deptId: string } }) => {
      await delay();

      const flatDepts = flattenDeptTree(db.depts);
      const deptId = parseInt(params.deptId);

      // 检查是否有子部门
      if (flatDepts.some((d) => d.parentId === deptId)) {
        return fail('存在子部门，无法删除');
      }

      // 检查是否有用户
      if (db.users.some((u) => u.deptId === deptId)) {
        return fail('部门下存在用户，无法删除');
      }

      const index = db.depts.findIndex((d) => d.deptId === deptId);
      if (index === -1) {
        return fail('部门不存在', 404);
      }

      db.depts.splice(index, 1);
      return success(null, '删除成功');
    },
  },
] as MockMethod[];
