/**
 * 第三方登录 API
 */
import request from '@/utils/request';
export const getThirdConfigList = () => {
    return request({
        url: '/system/third/config/list',
        method: 'get'
    });
};
export const getThirdConfig = (thirdType) => {
    return request({
        url: `/system/third/config/${thirdType}`,
        method: 'get'
    });
};
export const saveThirdConfig = (data) => {
    return request({
        url: '/system/third/config',
        method: 'post',
        data
    });
};
export const updateThirdConfig = (data) => {
    return request({
        url: '/system/third/config',
        method: 'put',
        data
    });
};
export const thirdLogin = (data) => {
    return request({
        url: '/system/third/login',
        method: 'post',
        data
    });
};
export const bindThirdAccount = (data) => {
    return request({
        url: '/system/third/bind',
        method: 'post',
        data
    });
};
export const unbindThirdAccount = (thirdType) => {
    return request({
        url: `/system/third/unbind/${thirdType}`,
        method: 'post'
    });
};
// 获取第三方登录日志列表
export const getThirdLoginLogList = (params) => {
    return request({
        url: '/system/third/log/page',
        method: 'get',
        params
    });
};
//# sourceMappingURL=third.api.js.map