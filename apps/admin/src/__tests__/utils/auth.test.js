import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getToken, setToken, removeToken, hasToken } from '@/utils/auth';
describe('auth utils', () => {
    const testToken = 'test-token-123';
    beforeEach(() => {
        removeToken();
    });
    afterEach(() => {
        removeToken();
    });
    describe('setToken', () => {
        it('should set token and be readable via getToken', () => {
            setToken(testToken);
            expect(getToken()).toBe(testToken);
        });
    });
    describe('getToken', () => {
        it('should return empty string when no token exists', () => {
            expect(getToken()).toBe('');
        });
        it('should return stored token when it exists', () => {
            setToken(testToken);
            expect(getToken()).toBe(testToken);
        });
    });
    describe('removeToken', () => {
        it('should remove token', () => {
            setToken(testToken);
            removeToken();
            expect(getToken()).toBe('');
        });
    });
    describe('hasToken', () => {
        it('should return false when no token', () => {
            expect(hasToken()).toBe(false);
        });
        it('should return true when token exists', () => {
            setToken(testToken);
            expect(hasToken()).toBe(true);
        });
    });
});
//# sourceMappingURL=auth.test.js.map