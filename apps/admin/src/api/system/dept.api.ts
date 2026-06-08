/**
 * 部门管理 API
 */

import { request } from '@/utils/request'
import type { SysDept, SysDeptQuery, SysDeptForm } from '@yunshu/shared/types/system'

/**
 * 获取部门树
 * @param params 查询参数
 */
export function getDeptTree(params?: SysDeptQuery) {
  return request<SysDept[]>({
    url: '/system/dept/tree',
    method: 'get',
    params,
  })
}

/**
 * 获取部门详情
 * @param deptId 部门ID
 */
export function getDeptDetail(deptId: number) {
  return request<SysDept>({
    url: `/system/dept/${deptId}`,
    method: 'get',
  })
}

/**
 * 新增部门
 * @param data 部门表单数据
 */
export function addDept(data: SysDeptForm) {
  return request<SysDept>({
    url: '/system/dept',
    method: 'post',
    data,
  })
}

/**
 * 修改部门
 * @param deptId 部门ID
 * @param data 部门表单数据
 */
export function updateDept(deptId: number, data: SysDeptForm) {
  return request<SysDept>({
    url: `/system/dept/${deptId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除部门
 * @param deptId 部门ID
 */
export function deleteDept(deptId: number) {
  return request<void>({
    url: `/system/dept/${deptId}`,
    method: 'delete',
  })
}

/**
 * 获取部门下拉树（只包含正常的部门）
 */
export function getDeptTreeSelect() {
  return request<SysDept[]>({
    url: '/system/dept/treeSelect',
    method: 'get',
  })
}

/**
 * 获取部门下拉树（包含禁用的部门）
 * @param includeDisabled 是否包含禁用的部门
 */
export function getDeptTreeSelectIncludeDisabled(includeDisabled = true) {
  return request<SysDept[]>({
    url: '/system/dept/treeSelect',
    method: 'get',
    params: { includeDisabled },
  })
}

/**
 * 获取部门列表（排除叶子节点，用于移动操作）
 * @param deptId 部门ID
 */
export function getDeptExcludeLeaf(deptId: number) {
  return request<SysDept[]>({
    url: `/system/dept/${deptId}/excludeLeaf`,
    method: 'get',
  })
}
