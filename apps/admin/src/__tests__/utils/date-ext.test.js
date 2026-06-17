import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatDateOnly, formatTimeOnly, getRelativeTime, getWeekDay, getAge } from '@/utils/date';
describe('date utils', () => {
    const fixed = new Date('2024-01-15T10:30:45');
    it('formatDate 默认格式 YYYY-MM-DD HH:mm:ss', () => {
        expect(formatDate(fixed)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
    it('formatDate 支持自定义格式', () => {
        expect(formatDate(fixed, 'YYYY-MM-DD')).toBe('2024-01-15');
    });
    it('formatDateTime 返回标准时间', () => {
        expect(formatDateTime(fixed)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
    it('formatDateOnly 返回日期部分', () => {
        expect(formatDateOnly(fixed)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    it('formatTimeOnly 返回时间部分', () => {
        expect(formatTimeOnly(fixed)).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
    it('getRelativeTime 对近期返回相对时间', () => {
        const recent = new Date(Date.now() - 60_000);
        const text = getRelativeTime(recent);
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
    });
    it('getRelativeTime 对 null/undefined 不抛出', () => {
        expect(() => getRelativeTime(null)).not.toThrow();
        expect(() => getRelativeTime(undefined)).not.toThrow();
    });
    it('getWeekDay 返回一周中的某一天', () => {
        const day = getWeekDay(fixed);
        expect(typeof day).toBe('string');
        expect(day.length).toBeGreaterThan(0);
    });
    it('getAge 返回年龄（正整数）', () => {
        const age = getAge('1990-05-15');
        expect(typeof age).toBe('number');
        expect(age).toBeGreaterThan(0);
    });
    it('所有日期函数对无效输入返回合理结果', () => {
        expect(typeof formatDate(null)).toBe('string');
        expect(typeof formatDate(undefined)).toBe('string');
        expect(typeof getAge(null)).toBe('number');
    });
});
//# sourceMappingURL=date-ext.test.js.map