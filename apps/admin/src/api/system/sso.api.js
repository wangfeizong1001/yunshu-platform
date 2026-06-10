/**
 * SSO单点登录 API
 */
import request from '@/utils/request';
export const getSsoConfig = () => {
    return request({
        url: '/system/sso/config',
        method: 'get'
    });
};
export const saveSsoConfig = (data) => {
    return request({
        url: '/system/sso/config',
        method: 'post',
        data
    });
};
export const ssoLogin = (code, state) => {
    return request({
        url: '/system/sso/login',
        method: 'post',
        data: { code, state }
    });
};
export const ssoLogout = () => {
    return request({
        url: '/system/sso/logout',
        method: 'post'
    });
};
//# sourceMappingURL=sso.api.js.map