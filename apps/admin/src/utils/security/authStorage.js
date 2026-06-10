/**
 * 云枢中台 — 认证信息安全存储工具
 *
 * 基于 js-cookie 管理 Token 与用户资料，相比 localStorage：
 *  1. 天然支持 HttpOnly / Secure / SameSite 等安全属性（若后端配合下发 Cookie）
 *  2. 前端侧读写也遵循 cookie 安全配置（secure/sameSite/expires）
 *  3. 区分「记住我(7 天)」与「会话级」存储策略
 *
 * @module @yunshu/admin/utils/security/authStorage
 */
import Cookies from 'js-cookie';
// Token Cookie Key
const TOKEN_KEY = 'yunshu_token';
// 用户资料 Cookie Key
const PROFILE_KEY = 'yunshu_profile';
// Cookie 通用安全属性
const SECURE_COOKIE_ATTRS = {
    sameSite: 'Strict',
    secure: import.meta.env.PROD, // 生产环境强制 HTTPS
    path: '/',
};
const REMEMBER_DAYS = 7;
/** ------------------------------------------------------------------
 * Token 管理
 * ------------------------------------------------------------------ */
/**
 * 写入 Token
 * @param token JWT / Bearer token 字符串
 * @param remember 是否记住我（true = 7 天；false = 会话级）
 */
export function setToken(token, remember = false) {
    if (remember) {
        Cookies.set(TOKEN_KEY, token, { ...SECURE_COOKIE_ATTRS, expires: REMEMBER_DAYS });
    }
    else {
        Cookies.set(TOKEN_KEY, token, { ...SECURE_COOKIE_ATTRS });
    }
}
/**
 * 读取 Token
 */
export function getToken() {
    return Cookies.get(TOKEN_KEY);
}
/**
 * 移除 Token
 */
export function removeToken() {
    Cookies.remove(TOKEN_KEY, { ...SECURE_COOKIE_ATTRS });
}
/**
 * 是否存在 Token
 */
export function hasToken() {
    return Boolean(Cookies.get(TOKEN_KEY));
}
/** ------------------------------------------------------------------
 * 用户资料（轻量存储，不承载敏感信息）
 * ------------------------------------------------------------------ */
/**
 * 写入用户资料（序列化为 JSON 存 Cookie）
 * 注意：只存非敏感字段（id / nickname / avatar 等）
 */
export function setUserProfile(profile, remember = false) {
    const payload = JSON.stringify(profile);
    if (remember) {
        Cookies.set(PROFILE_KEY, payload, { ...SECURE_COOKIE_ATTRS, expires: REMEMBER_DAYS });
    }
    else {
        Cookies.set(PROFILE_KEY, payload, { ...SECURE_COOKIE_ATTRS });
    }
}
/**
 * 读取用户资料
 */
export function getUserProfile() {
    const raw = Cookies.get(PROFILE_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
/**
 * 清理用户资料
 */
export function clearUserProfile() {
    Cookies.remove(PROFILE_KEY, { ...SECURE_COOKIE_ATTRS });
}
/**
 * 一次性清理全部认证信息（登出用）
 */
export function clearAuth() {
    removeToken();
    clearUserProfile();
}
//# sourceMappingURL=authStorage.js.map