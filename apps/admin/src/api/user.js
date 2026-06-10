import { get, post, put, del } from '../utils/request';
export const getUserListApi = (params) => {
  return get('/system/user/list', params);
};
export const getUserDetailApi = (id) => {
  return get(`/system/user/${id}`);
};
export const createUserApi = (data) => {
  return post('/system/user', data);
};
export const updateUserApi = (id, data) => {
  return put(`/system/user/${id}`, data);
};
export const deleteUserApi = (id) => {
  return del(`/system/user/${id}`);
};
export const resetPasswordApi = (id) => {
  return post(`/system/user/${id}/reset-password`);
};
//# sourceMappingURL=user.js.map
