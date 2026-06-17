/**
 * 请求头构建工具
 *
 * 将拦截器中"注入 Token + 注入 tenant-id"的逻辑抽成可独立测试的纯函数。
 * 拦截器只负责调用，业务逻辑可被单元测试覆盖。
 */
import type { AxiosRequestConfig } from 'axios';
import { getToken } from '@/utils/auth';
import { addTenantIdToRequest } from '@/utils/tenant';

/**
 * 为请求注入认证相关的头：
 *  - Authorization: Bearer <token>（如果存在 Token）
 *  - tenant-id: <id>（如果存在租户 ID 且非 0）
 *
 * 不修改原 config，返回新对象以保持纯函数语义。
 */
export function buildAuthHeaders(
  config: AxiosRequestConfig = {},
  options: { tokenProvider?: () => string } = {},
): AxiosRequestConfig {
  const provider = options.tokenProvider ?? getToken;
  const token = provider();

  const next: AxiosRequestConfig = {
    ...config,
    headers: { ...(config.headers ?? {}) } as Record<string, string>,
  };

  // 注入租户 ID（如果存在）
  addTenantIdToRequest(next);

  // 注入 Token
  if (token) {
    (next.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return next;
}
