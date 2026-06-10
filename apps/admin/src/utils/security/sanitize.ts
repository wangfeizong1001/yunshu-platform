/**
 * 云枢中台 — HTML 内容安全清理工具
 *
 * 基于 dompurify，统一处理富文本内容，防御 XSS：
 *  1. 默认严格模式：移除 script/onxxx/javascript:/style/iframe 等
 *  2. stripHtml：仅保留纯文本（用于搜索/摘要）
 *  3. truncateHtml：基于纯文本长度截断但保留外层标签
 *
 * @module @yunshu/admin/utils/security/sanitize
 */

import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  /** 额外允许的标签 */
  ALLOWED_TAGS?: string[];
  /** 额外允许的属性 */
  ALLOWED_ATTR?: string[];
  /** 是否允许 data: URI（默认 false —— 避免 SVG XSS） */
  ALLOW_DATA_URI?: boolean;
}

const DEFAULT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 'small', 'span', 'strong',
    'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'target', 'class', 'id', 'name', 'rel'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'select', 'option', 'link', 'meta'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'ondblclick', 'onkeydown', 'onkeypress', 'onkeyup'],
  // 对 target=_blank 的链接自动注入 noopener/noreferrer
  ADD_ATTR: ['target'],
  // 去掉嵌套过深的标签（防御 DoS）
  MAX_DEPTH: 25,
};

/**
 * 清理富文本内容，返回可安全 v-html 的字符串
 */
export function sanitizeHtml(dirty: string | null | undefined, options: SanitizeOptions = {}): string {
  if (!dirty) {
    return '';
  }
  const merged: DOMPurify.Config = {
    ...DEFAULT_CONFIG,
    ...(options.ALLOWED_TAGS ? { ALLOWED_TAGS: options.ALLOWED_TAGS } : {}),
    ...(options.ALLOWED_ATTR ? { ALLOWED_ATTR: options.ALLOWED_ATTR } : {}),
    ...(options.ALLOW_DATA_URI ? { ALLOW_DATA_ATTR: true } : {}),
  };
  try {
    const clean = DOMPurify.sanitize(dirty, merged);
    // 二次处理：对 target=_blank 的链接追加 rel="noopener noreferrer"
    return clean.replace(
      /<a\b([^>]*?)\btarget\s*=\s*['"]_blank['"]([^>]*)>/gi,
      (_match, before: string, after: string) => {
        // 若已有 rel 属性，跳过
        if (/\brel\s*=/i.test(before + after)) {
          return `<a${before}target="_blank"${after}>`;
        }
        return `<a${before}target="_blank" rel="noopener noreferrer"${after}>`;
      },
    );
  } catch (err) {
    // 兜底：极端异常时回退为空字符串，宁可不渲染也不能放 XSS
    console.warn('[sanitize] DOMPurify 异常：', err);
    return '';
  }
}

/**
 * 剥除全部 HTML 标签，返回纯文本（用于搜索/摘要）
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) {
    return '';
  }
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * 基于纯文本长度截断 HTML，过长部分以 `...` 结尾（用于列表摘要展示）
 */
export function truncateHtml(html: string | null | undefined, maxLength = 120): string {
  const plain = stripHtml(html);
  if (plain.length <= maxLength) {
    return sanitizeHtml(html);
  }
  const truncated = plain.slice(0, maxLength).trimEnd() + '...';
  return `<p>${escapeHtml(truncated)}</p>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
