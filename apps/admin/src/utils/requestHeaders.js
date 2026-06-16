import { getToken } from '@/utils/auth';
import { addTenantIdToRequest } from '@/utils/tenant';
/**
 * 为请求注入认证相关的头：
 *  - Authorization: Bearer <token>（如果存在 Token）
 *  - tenant-id: <id>（如果存在租户 ID 且非 0）
 *
 * 不修改原 config，返回新对象以保持纯函数语义。
 */
export function buildAuthHeaders(config = {}, options = {}) {
    const provider = options.tokenProvider ?? getToken;
    const token = provider();
    const next = {
        ...config,
        headers: { ...(config.headers ?? {}) },
    };
    // 注入租户 ID（如果存在）
    addTenantIdToRequest(next);
    // 注入 Token
    if (token) {
        next.headers.Authorization = `Bearer ${token}`;
    }
    return next;
}
//# sourceMappingURL=requestHeaders.js.map