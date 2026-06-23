import { describe, it, expect } from 'vitest';
import { sanitizeHtml, stripHtml, truncateHtml } from '@/utils/security/sanitize';

describe('sanitize utils', () => {
  it('stripHtml 正确移除 HTML 标签', () => {
    expect(stripHtml('<div>hello</div>')).toBe('hello');
    expect(stripHtml('<p><span>x</span></p>')).toBe('x');
    expect(stripHtml('plain text')).toBe('plain text');
  });

  it('sanitizeHtml 返回安全字符串', () => {
    const result = sanitizeHtml('<script>alert(1)</script>safe');
    expect(typeof result).toBe('string');
    expect(result.toLowerCase()).not.toContain('<script');
  });

  it('sanitizeHtml 保留安全标签的文本', () => {
    const result = sanitizeHtml('<p>hello <b>world</b></p>');
    expect(result).toContain('hello');
    expect(result).toContain('world');
  });

  it('truncateHtml 能截断内容', () => {
    const truncated = truncateHtml('hello world', 5);
    expect(typeof truncated).toBe('string');
    expect(truncated.length).toBeLessThanOrEqual(5 + 3);
  });

  it('空值返回空字符串', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(stripHtml('')).toBe('');
    expect(truncateHtml('', 10)).toBe('');
  });
});
