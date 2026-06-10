import request from '@/utils/request';
import type { User, UserQuery } from './types';

export const getUserList = (params: UserQuery) => {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  });
};

export const getUser = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'get',
  });
};

export const createUser = (data: User) => {
  return request({
    url: '/user',
    method: 'post',
    data,
  });
};

export const updateUser = (data: User) => {
  return request({
    url: '/user',
    method: 'put',
    data,
  });
};

export const deleteUser = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'delete',
  });
};

export const batchDeleteUser = (ids: number[]) => {
  return request({
    url: '/user/batch',
    method: 'delete',
    data: { ids },
  });
};
