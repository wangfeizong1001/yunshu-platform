/**
 * SSO单点登录 API
 */
import { request } from '@/utils/httpClient';
export const getSsoConfig = () => {
    return request({
        url: '/system/sso/config',
        method: 'GET'
    });
};
export const saveSsoConfig = (data) => {
    return request({
        url: '/system/sso/config',
        method: 'POST',
        data
    });
};
export const ssoLogin = (code, state) => {
    return request({
        url: '/system/sso/login',
        method: 'POST',
        data: { code, state }
    });
};
export const ssoLogout = () => {
    return request({
        url: '/system/sso/logout',
        method: 'POST'
    });
};
//# sourceMappingURL=sso.api.js.map