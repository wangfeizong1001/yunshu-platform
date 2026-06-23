/**
 * 认证相关 API
 */
import { request } from '@/utils/httpClient';
// 获取验证码
export function getCaptchaApi() {
    return request({
        url: '/auth/captcha',
        method: 'GET'
    });
}
// 登录
export function loginApi(data) {
    return request({
        url: '/auth/login',
        method: 'POST',
        data
    });
}
// 退出登录
export function logoutApi() {
    return request({
        url: '/auth/logout',
        method: 'POST'
    });
}
// 获取用户信息
export function getUserInfoApi() {
    return request({
        url: '/auth/userinfo',
        method: 'GET'
    });
}
// 获取路由菜单
export function getRoutersApi() {
    return request({
        url: '/system/menu/getRouters',
        method: 'GET'
    });
}
//# sourceMappingURL=auth.js.map