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
/** ------------------------------------------------------------------
 * Token 管理
 * ------------------------------------------------------------------ */
/**
 * 写入 Token
 * @param token JWT / Bearer token 字符串
 * @param remember 是否记住我（true = 7 天；false = 会话级）
 */
export declare function setToken(token: string, remember?: boolean): void;
/**
 * 读取 Token
 */
export declare function getToken(): string | undefined;
/**
 * 移除 Token
 */
export declare function removeToken(): void;
/**
 * 是否存在 Token
 */
export declare function hasToken(): boolean;
/** ------------------------------------------------------------------
 * 用户资料（轻量存储，不承载敏感信息）
 * ------------------------------------------------------------------ */
/**
 * 写入用户资料（序列化为 JSON 存 Cookie）
 * 注意：只存非敏感字段（id / nickname / avatar 等）
 */
export declare function setUserProfile<T extends Record<string, unknown>>(profile: T, remember?: boolean): void;
/**
 * 读取用户资料
 */
export declare function getUserProfile<T extends Record<string, unknown> = Record<string, unknown>>(): T | null;
/**
 * 清理用户资料
 */
export declare function clearUserProfile(): void;
/**
 * 一次性清理全部认证信息（登出用）
 */
export declare function clearAuth(): void;
//# sourceMappingURL=authStorage.d.ts.map