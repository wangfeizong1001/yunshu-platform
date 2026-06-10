/**
 * sanitize 单元测试
 *
 * 由于 happy-dom 与 DOMPurify 的 DOM 子节点处理不完全兼容，
 * 此处采用 mock DOMPurify.sanitize，重点测试我们自己封装的逻辑：
 *  1. 空值 / undefined / null 处理
 *  2. 自定义配置的正确传递
 *  3. target=_blank 自动注入 rel="noopener noreferrer"
 *  4. 异常回退为空字符串
 *  5. stripHtml / truncateHtml 的字符串级语义
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import DOMPurify from 'dompurify';
import { sanitizeHtml, stripHtml, truncateHtml } from '@/utils/security/sanitize';

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((dirty: string) => dirty), // 默认为透传，让我们能检验自定义逻辑
  },
}));

describe('utils/security/sanitize', () => {
  beforeEach(() => {
    vi.mocked(DOMPurify.sanitize).mockImplementation((dirty: string) => dirty);
  });

  describe('sanitizeHtml', () => {
    it('空字符串 / null / undefined 返回空字符串', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
    });

    it('对 target=_blank 的链接自动注入 rel="noopener noreferrer"', () => {
      const html = '<a href="https://example.com" target="_blank">link</a>';
      const out = sanitizeHtml(html);
      expect(out).toMatch(/rel="noopener noreferrer"/i);
    });

    it('已有 rel 属性则不重复注入', () => {
      const html = '<a href="x" target="_blank" rel="nofollow">x</a>';
      const out = sanitizeHtml(html);
      const matches = out.match(/rel=/gi) ?? [];
      expect(matches.length).toBe(1);
    });

    it('普通文本不受影响', () => {
      expect(sanitizeHtml('Hello world')).toBe('Hello world');
    });

    it('自定义 ALLOWED_TAGS 会被传递给 DOMPurify.sanitize', () => {
      sanitizeHtml('<b>hi</b>', { ALLOWED_TAGS: ['b'] });
      const secondArg = vi.mocked(DOMPurify.sanitize).mock.calls[0][1];
      expect(secondArg).toMatchObject({ ALLOWED_TAGS: ['b'] });
    });

    it('自定义 ALLOWED_ATTR 会被传递', () => {
      sanitizeHtml('<p data-x="1">hi</p>', { ALLOWED_ATTR: ['data-x'] });
      const secondArg = vi.mocked(DOMPurify.sanitize).mock.calls[0][1];
      expect(secondArg).toMatchObject({ ALLOWED_ATTR: ['data-x'] });
    });

    it('ALLOW_DATA_URI=true 时会开启 ALLOW_DATA_ATTR', () => {
      sanitizeHtml('<p>hi</p>', { ALLOW_DATA_URI: true });
      const secondArg = vi.mocked(DOMPurify.sanitize).mock.calls[0][1];
      expect(secondArg).toMatchObject({ ALLOW_DATA_ATTR: true });
    });

    it('DOMPurify 抛异常时回退为空字符串且通过 console.warn', () => {
      vi.mocked(DOMPurify.sanitize).mockImplementation(() => {
        throw new Error('boom');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(sanitizeHtml('<p>hi</p>')).toBe('');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('stripHtml', () => {
    it('剥除所有标签', () => {
      expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
    });

    it('空值安全', () => {
      expect(stripHtml('')).toBe('');
      expect(stripHtml(null)).toBe('');
      expect(stripHtml(undefined)).toBe('');
    });

    it('把 &nbsp; 与多余空白合并为单空格', () => {
      expect(stripHtml('a&nbsp;&nbsp;b   c')).toBe('a b c');
    });
  });

  describe('truncateHtml', () => {
    it('短内容原样返回（经 sanitizeHtml）', () => {
      const html = 'Hello';
      expect(truncateHtml(html, 100)).toBe('Hello');
    });

    it('长内容被截断并以 ... 结尾', () => {
      const html = '<p>' + 'a'.repeat(200) + '</p>';
      const out = truncateHtml(html, 50);
      expect(out).toMatch(/\.\.\.<\/p>$/);
      expect(out.length).toBeLessThan(html.length);
    });

    it('被截断后的内容会做 HTML 转义', () => {
      const plain = '<script>alert(1)</script>'.repeat(20);
      const out = truncateHtml(plain, 20);
      // 不应保留原始 script 标签
      expect(out).not.toContain('<script>');
    });
  });
});
