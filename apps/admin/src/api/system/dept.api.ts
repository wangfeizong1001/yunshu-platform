/**
 * 部门管理 API
 */

import { request, httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient'

export interface DeptQuery {
  deptName?: string
  status?: string
}

export interface DeptForm {
  deptId?: number
  parentId?: number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
  remark?: string
}

export interface DeptInfo {
  deptId: number
  parentId: number
  deptName: string
  orderNum: number
  leader: string
  phone: string
  email: string
  status: string
  remark: string
  createTime: string
}

export const getDeptList = (params?: DeptQuery) => {
  return request<unknown>({
    url: '/system/dept/list',
    method: 'GET',
    params
  })
}

export const getDept = (deptId: number) => {
  return request<unknown>({
    url: `/system/dept/${deptId}`,
    method: 'GET'
  })
}

export const getDeptTreeSelect = () => {
  return request<unknown>({
    url: '/system/dept/treeSelect',
    method: 'GET'
  })
}

export const getDeptTree = (params?: DeptQuery) => {
  return request<unknown>({
    url: '/system/dept/tree',
    method: 'GET',
    params
  })
}

export const getDeptExcludeChild = (deptId: number) => {
  return request<unknown>({
    url: `/system/dept/list/excludeChild/${deptId}`,
    method: 'GET'
  })
}

export const addDept = (data: DeptForm) => {
  return request<unknown>({
    url: '/system/dept',
    method: 'POST',
    data
  })
}

export const updateDept = (data: DeptForm) => {
  return request<unknown>({
    url: '/system/dept',
    method: 'PUT',
    data
  })
}

export const deleteDept = (deptId: number) => {
  return request<unknown>({
    url: `/system/dept/${deptId}`,
    method: 'DELETE'
  })
}
