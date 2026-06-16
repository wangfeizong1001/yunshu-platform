import { describe, it, expect, beforeEach } from 'vitest';
import { storageGet, storageSet, storageRemove, storageClear, storageHas, storageUpdate, pkey } from '@/utils/security/storage';
describe('security/storage utils', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    it('storageSet / storageGet 基本存取', () => {
        storageSet('key', { a: 1 });
        expect(storageGet('key')).toEqual({ a: 1 });
    });
    it('storageGet 不存在返回 null', () => {
        expect(storageGet('missing')).toBeNull();
    });
    it('storageRemove 能移除指定键', () => {
        storageSet('x', 1);
        storageRemove('x');
        expect(storageGet('x')).toBeNull();
    });
    it('storageClear 能清空全部', () => {
        storageSet('a', 1);
        storageSet('b', 2);
        storageClear();
        expect(storageGet('a')).toBeNull();
        expect(storageGet('b')).toBeNull();
    });
    it('storageHas 能正确判断存在', () => {
        expect(storageHas('y')).toBe(false);
        storageSet('y', 1);
        expect(storageHas('y')).toBe(true);
    });
    it('storageUpdate 能基于原值原子更新', () => {
        storageSet('count', { n: 0 });
        storageUpdate('count', (prev) => ({ n: (prev?.n ?? 0) + 1 }));
        expect(storageGet('count')).toEqual({ n: 1 });
    });
    it('sessionStorage 驱动可独立存储', () => {
        storageSet('s-key', 'local-val');
        storageSet('s-key', 'session-val', undefined, 'session');
        expect(storageGet('s-key', 'local')).toBe('local-val');
        expect(storageGet('s-key', 'session')).toBe('session-val');
    });
    it('ttl 过期后读取返回 null', () => {
        storageSet('short', 'val', 1);
        // eslint-disable-next-line no-restricted-globals
        const start = Date.now();
        while (Date.now() - start < 2) {
            // 等待过期
        }
        expect(storageGet('short')).toBeNull();
    });
    it('pkey 返回带前缀的键', () => {
        expect(pkey('x')).toBe('yunshu:x');
    });
});
//# sourceMappingURL=storage-ext.test.js.map