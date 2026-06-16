/**
 * 云枢中台 — 安全 Token 存储工具
 *
 * 策略：
 *   - 使用 httpOnly Cookie 存储 Token（后端设置）
 *   - 前端维护 Token 状态到 Cookie（sameSite=strict, secure）
 *   - 敏感信息使用轻量级 Base64 + XOR 混淆（非加密，仅避免明文可读性）
 *
 * 说明：
 *   真正的安全防线在后端的 httpOnly Cookie。本模块仅负责：
 *     1. Token 的前端读取/写入（非敏感场景）
 *     2. 统一的存储 API 便于后续替换
 *
 * @module security/authStorage
 */
import Cookies from 'js-cookie';
/** Cookie Key —— 云枢中台认证 Token */
const TOKEN_KEY = 'YUNSHU_AUTH_TOKEN';
/** Cookie Key —— 云枢中台用户信息（脱敏后） */
const USER_KEY = 'YUNSHU_USER_INFO';
/** Token 过期时间：1 天 */
const TOKEN_EXPIRES_DAYS = 1;
/**
 * 轻量级字符串混淆（仅防止肉眼识别，非加密）
 */
function obfuscate(str) {
    if (!str)
        return '';
    // Base64 编码
    try {
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return btoa(binary);
    }
    catch {
        return btoa(unescape(encodeURIComponent(str)));
    }
}
/**
 * 反混淆
 */
function deobfuscate(str) {
    if (!str)
        return '';
    try {
        const binary = atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
            bytes[i] = binary.charCodeAt(i);
        return new TextDecoder().decode(bytes);
    }
    catch {
        try {
            return decodeURIComponent(escape(atob(str)));
        }
        catch {
            return '';
        }
    }
}
/**
 * 获取当前环境配置
 */
function isProdEnv() {
    return import.meta.env.PROD;
}
/**
 * 读取认证 Token
 * @returns Token 字符串（如不存在返回空字符串）
 */
export function getToken() {
    try {
        const raw = Cookies.get(TOKEN_KEY);
        if (!raw)
            return '';
        return deobfuscate(raw);
    }
    catch {
        return '';
    }
}
/**
 * 写入认证 Token
 * @param token JWT Token 字符串
 */
export function setToken(token) {
    try {
        Cookies.set(TOKEN_KEY, obfuscate(token), {
            expires: TOKEN_EXPIRES_DAYS,
            secure: isProdEnv(), // 生产环境仅 HTTPS 可访问
            sameSite: 'strict', // 防止 CSRF，禁止跨站携带
            path: '/'
        });
    }
    catch {
        // 静默失败 —— 避免存储异常抛至业务层
    }
}
/**
 * 清除认证 Token（登出时调用）
 */
export function removeToken() {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
}
/**
 * 检查是否已登录（仅检查 Token 是否存在，不校验有效性）
 */
export function hasToken() {
    return getToken().length > 0;
}
/**
 * 存储脱敏后的用户信息（头像、昵称等非敏感字段）
 * ⚠️ 不存储密码、Token、身份证号等敏感信息
 */
export function setUserProfile(profile) {
    try {
        Cookies.set(USER_KEY, obfuscate(JSON.stringify(profile)), {
            expires: TOKEN_EXPIRES_DAYS,
            secure: isProdEnv(),
            sameSite: 'strict',
            path: '/'
        });
    }
    catch {
        // 静默失败
    }
}
/**
 * 读取脱敏后的用户信息
 */
export function getUserProfile() {
    try {
        const raw = Cookies.get(USER_KEY);
        if (!raw)
            return null;
        return JSON.parse(deobfuscate(raw));
    }
    catch {
        return null;
    }
}
/**
 * 清除用户信息缓存
 */
export function clearUserProfile() {
    Cookies.remove(USER_KEY, { path: '/' });
}
//# sourceMappingURL=authStorage.js.map