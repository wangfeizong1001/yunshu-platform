/**
 * Token 管理工具（兼容层）
 *
 * ⚠️  本模块为兼容层，内部实际转发至 @/utils/security/authStorage
 * 新增代码请直接导入 security/authStorage，便于后续统一替换策略。
 *
 * 安全策略：
 *   - Cookie（sameSite=strict, secure in prod）存储
 *   - Base64 + XOR 轻量级混淆（仅避免明文可读性）
 *   - 生产环境仅 HTTPS 可访问
 *
 * @module utils/auth
 */
import { getToken as secureGetToken, setToken as secureSetToken, removeToken as secureRemoveToken, hasToken } from './security/authStorage';
/**
 * 读取认证 Token
 * @returns Token 字符串，如不存在返回空字符串
 */
export const getToken = () => {
    return secureGetToken();
};
/**
 * 写入认证 Token
 * @param token JWT Token 字符串
 */
export const setToken = (token) => {
    return secureSetToken(token);
};
/**
 * 清除认证 Token（登出时调用）
 */
export const removeToken = () => {
    return secureRemoveToken();
};
/**
 * 检查当前是否持有有效 Token（仅检查存在性，不校验有效性）
 */
export { hasToken };
//# sourceMappingURL=auth.js.map