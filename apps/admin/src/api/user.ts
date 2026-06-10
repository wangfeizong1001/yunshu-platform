import { get, post, put, del } from '../utils/request';

export interface IUser {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  roles: string[];
  createTime: string;
}

export interface IUserListParams extends Record<string, unknown> {
  page: number;
  pageSize: number;
  username?: string;
  status?: number;
}

export const getUserListApi = (params: IUserListParams) => {
  return get<{ list: IUser[]; total: number }>('/system/user/list', params);
};

export const getUserDetailApi = (id: string) => {
  return get<IUser>(`/system/user/${id}`);
};

export const createUserApi = (data: Partial<IUser>) => {
  return post('/system/user', data);
};

export const updateUserApi = (id: string, data: Partial<IUser>) => {
  return put(`/system/user/${id}`, data);
};

export const deleteUserApi = (id: string) => {
  return del(`/system/user/${id}`);
};

export const resetPasswordApi = (id: string) => {
  return post(`/system/user/${id}/reset-password`);
};
