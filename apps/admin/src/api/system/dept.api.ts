/**
 * 部门管理 API
 */

import request from '@/utils/request';

export interface DeptQuery {
  deptName?: string;
  status?: string;
}

export interface DeptForm {
  deptId?: number;
  parentId?: number;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  remark?: string;
}

export interface DeptInfo {
  deptId: number;
  parentId: number;
  deptName: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  remark: string;
  createTime: string;
}

export const getDeptList = (params?: DeptQuery) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params,
  });
};

export const getDept = (deptId: number) => {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'get',
  });
};

export const getDeptTreeSelect = () => {
  return request({
    url: '/system/dept/treeSelect',
    method: 'get',
  });
};

export const getDeptTree = (params?: DeptQuery) => {
  return request({
    url: '/system/dept/tree',
    method: 'get',
    params,
  });
};

export const getDeptExcludeChild = (deptId: number) => {
  return request({
    url: `/system/dept/list/excludeChild/${deptId}`,
    method: 'get',
  });
};

export const addDept = (data: DeptForm) => {
  return request({
    url: '/system/dept',
    method: 'post',
    data,
  });
};

export const updateDept = (data: DeptForm) => {
  return request({
    url: '/system/dept',
    method: 'put',
    data,
  });
};

export const deleteDept = (deptId: number) => {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'delete',
  });
};
