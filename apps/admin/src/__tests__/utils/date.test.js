import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatDateOnly,
  formatTimeOnly,
  getRelativeTime,
  getWeekDay,
  getAge,
} from '@/utils/date';
import dayjs from 'dayjs';
describe('date utils', () => {
  const testDate = '2024-01-15 10:30:00';
  describe('formatDate', () => {
    it('should format date with default format', () => {
      expect(formatDate(testDate)).toBe('2024-01-15 10:30:00');
    });
    it('should format date with custom format', () => {
      expect(formatDate(testDate, 'YYYY/MM/DD')).toBe('2024/01/15');
    });
  });
  describe('formatDateTime', () => {
    it('should format date with datetime format', () => {
      expect(formatDateTime(testDate)).toBe('2024-01-15 10:30:00');
    });
  });
  describe('formatDateOnly', () => {
    it('should format date with date only format', () => {
      expect(formatDateOnly(testDate)).toBe('2024-01-15');
    });
  });
  describe('formatTimeOnly', () => {
    it('should format date with time only format', () => {
      expect(formatTimeOnly(testDate)).toBe('10:30:00');
    });
  });
  describe('getRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(dayjs('2024-01-15 10:30:00').toDate());
    });
    afterEach(() => {
      vi.useRealTimers();
    });
    it('should return "刚刚" for time within 1 minute', () => {
      const recentTime = dayjs().subtract(30, 'second').toISOString();
      expect(getRelativeTime(recentTime)).toBe('刚刚');
    });
    it('should return minutes ago for time within 1 hour', () => {
      const recentTime = dayjs().subtract(30, 'minute').toISOString();
      expect(getRelativeTime(recentTime)).toBe('30分钟前');
    });
    it('should return hours ago for time within 1 day', () => {
      const recentTime = dayjs().subtract(3, 'hour').toISOString();
      expect(getRelativeTime(recentTime)).toBe('3小时前');
    });
    it('should return days ago for time within 1 month', () => {
      const recentTime = dayjs().subtract(5, 'day').toISOString();
      expect(getRelativeTime(recentTime)).toBe('5天前');
    });
    it('should return formatted date for time older than 1 month', () => {
      const oldTime = dayjs().subtract(2, 'month').toISOString();
      expect(getRelativeTime(oldTime)).toBe(formatDateOnly(oldTime));
    });
  });
  describe('getWeekDay', () => {
    it('should return correct week day', () => {
      expect(getWeekDay('2024-01-15')).toBe('星期一');
      expect(getWeekDay('2024-01-16')).toBe('星期二');
      expect(getWeekDay('2024-01-20')).toBe('星期六');
      expect(getWeekDay('2024-01-21')).toBe('星期日');
    });
  });
  describe('getAge', () => {
    it('should return correct age', () => {
      vi.useFakeTimers();
      vi.setSystemTime(dayjs('2024-01-15').toDate());
      expect(getAge('2000-01-01')).toBe(24);
      expect(getAge('2000-06-15')).toBe(23);
      expect(getAge('2024-01-15')).toBe(0);
      vi.useRealTimers();
    });
  });
});
//# sourceMappingURL=date.test.js.map
