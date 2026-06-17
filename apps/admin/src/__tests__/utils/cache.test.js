import { describe, it, expect, beforeEach } from 'vitest';
import { cache } from '@/utils/cache';
describe('cache utils - 基础行为', () => {
    beforeEach(() => {
        // 先恢复默认配置
        cache.updateConfig({ enabled: true, type: 'local' });
        cache.clear();
    });
    it('set/get 基本存取', () => {
        cache.set('hello', { a: 1, b: 'str' });
        expect(cache.get('hello')).toEqual({ a: 1, b: 'str' });
    });
    it('get 不存在时返回 undefined，传入 defaultValue 则返回 defaultValue', () => {
        expect(cache.get('missing')).toBeUndefined();
        expect(cache.get('missing', 'default')).toBe('default');
    });
    it('remove 能移除指定缓存', () => {
        cache.set('to-remove', 123);
        cache.remove('to-remove');
        expect(cache.get('to-remove')).toBeUndefined();
    });
    it('clear 能清空全部缓存', () => {
        cache.set('a', 1);
        cache.set('b', 2);
        cache.clear();
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBeUndefined();
    });
    it('has 能正确判断缓存是否存在', () => {
        expect(cache.has('not-yet')).toBe(false);
        cache.set('present', 1);
        expect(cache.has('present')).toBe(true);
    });
    it('ttl 过期后返回 undefined', () => {
        cache.set('short', 1, { ttl: 1 });
        // 等待过期
        const start = Date.now();
        while (Date.now() - start < 2) {
            /* no-op */
        }
        expect(cache.get('short')).toBeUndefined();
    });
    it('updateConfig enabled=false 时不写入、读到的是默认值', () => {
        cache.updateConfig({ enabled: false });
        cache.set('should-not-save', 1);
        expect(cache.get('should-not-save')).toBeUndefined();
        // 恢复
        cache.updateConfig({ enabled: true });
        cache.set('ok', 1);
        expect(cache.get('ok')).toBe(1);
    });
});
//# sourceMappingURL=cache.test.js.map