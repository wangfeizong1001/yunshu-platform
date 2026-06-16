/**
 * requestHeaders.ts 单元测试
 *
 * 验证请求头构建工具能正确注入：
 *  - Authorization: Bearer <token>
 *  - tenant-id: <id>
 *
 * 与 httpClient.test.ts 不同的是：这里直接测纯函数，
 * 不依赖 axios 拦截器，因此能可靠地验证头注入行为。
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { buildAuthHeaders } from '@/utils/requestHeaders';
import { setTenantId, removeTenantId } from '@/utils/tenant';
describe('buildAuthHeaders', () => {
    beforeEach(() => {
        // 每个用例独立 — 清理租户
        removeTenantId();
    });
    it('当没有 Token 和 tenantId 时，返回的 headers 中不应包含 Authorization / tenant-id', () => {
        const result = buildAuthHeaders({ url: '/api/test' }, { tokenProvider: () => '' });
        const headers = result.headers;
        expect(headers.Authorization).toBeUndefined();
        expect(headers['tenant-id']).toBeUndefined();
    });
    it('当提供 Token 时，应注入 Authorization: Bearer <token>', () => {
        const result = buildAuthHeaders({ url: '/api/test' }, { tokenProvider: () => 'jwt-abc-123' });
        const headers = result.headers;
        expect(headers.Authorization).toBe('Bearer jwt-abc-123');
    });
    it('当设置 tenantId 时，应注入 tenant-id 头', () => {
        setTenantId('42');
        const result = buildAuthHeaders({ url: '/api/test' }, { tokenProvider: () => '' });
        const headers = result.headers;
        expect(headers['tenant-id']).toBe('42');
    });
    it('tenantId 为 "0" 时不应注入 tenant-id 头（超级管理员）', () => {
        setTenantId('0');
        const result = buildAuthHeaders({ url: '/api/test' }, { tokenProvider: () => '' });
        const headers = result.headers;
        expect(headers['tenant-id']).toBeUndefined();
    });
    it('同时提供 Token 和 tenantId 时，两个头都应注入', () => {
        setTenantId('7');
        const result = buildAuthHeaders({ url: '/api/test' }, { tokenProvider: () => 'jwt-xyz' });
        const headers = result.headers;
        expect(headers.Authorization).toBe('Bearer jwt-xyz');
        expect(headers['tenant-id']).toBe('7');
    });
    it('不应修改原始 config 对象（保持纯函数语义）', () => {
        setTenantId('99');
        const original = { url: '/api/test', headers: { 'X-Existing': 'value' } };
        const result = buildAuthHeaders(original, { tokenProvider: () => 'tok' });
        const originalHeaders = original.headers;
        // 原始 config 不应被污染
        expect(originalHeaders.Authorization).toBeUndefined();
        expect(originalHeaders['tenant-id']).toBeUndefined();
        expect(originalHeaders['X-Existing']).toBe('value');
        // 新 config 应有所有内容
        const newHeaders = result.headers;
        expect(newHeaders.Authorization).toBe('Bearer tok');
        expect(newHeaders['tenant-id']).toBe('99');
        expect(newHeaders['X-Existing']).toBe('value');
    });
});
//# sourceMappingURL=requestHeaders.test.js.map