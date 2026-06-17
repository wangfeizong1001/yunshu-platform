import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/httpClient';
export const getUserListApi = (params) => {
    return httpGet('/system/user/list', params);
};
export const getUserDetailApi = (id) => {
    return httpGet(`/system/user/${id}`);
};
export const createUserApi = (data) => {
    return httpPost('/system/user', data);
};
export const updateUserApi = (id, data) => {
    return httpPut(`/system/user/${id}`, data);
};
export const deleteUserApi = (id) => {
    return httpDelete(`/system/user/${id}`);
};
export const resetPasswordApi = (id) => {
    return httpPost(`/system/user/${id}/reset-password`);
};
//# sourceMappingURL=user.js.map