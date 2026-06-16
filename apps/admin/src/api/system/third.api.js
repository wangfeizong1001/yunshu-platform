/**
 * 第三方登录 API
 */
import { request } from '@/utils/httpClient';
export const getThirdConfigList = () => {
    return request({
        url: '/system/third/config/list',
        method: 'GET'
    });
};
export const getThirdConfig = (thirdType) => {
    return request({
        url: `/system/third/config/${thirdType}`,
        method: 'GET'
    });
};
export const saveThirdConfig = (data) => {
    return request({
        url: '/system/third/config',
        method: 'POST',
        data
    });
};
export const updateThirdConfig = (data) => {
    return request({
        url: '/system/third/config',
        method: 'PUT',
        data
    });
};
export const thirdLogin = (data) => {
    return request({
        url: '/system/third/login',
        method: 'POST',
        data
    });
};
export const bindThirdAccount = (data) => {
    return request({
        url: '/system/third/bind',
        method: 'POST',
        data
    });
};
export const unbindThirdAccount = (thirdType) => {
    return request({
        url: `/system/third/unbind/${thirdType}`,
        method: 'POST'
    });
};
export const getThirdLoginLogList = (params) => {
    return request({
        url: '/system/third/log/page',
        method: 'GET',
        params
    });
};
//# sourceMappingURL=third.api.js.map