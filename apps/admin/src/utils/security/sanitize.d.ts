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
export interface SanitizeOptions {
  /** 额外允许的标签 */
  ALLOWED_TAGS?: string[];
  /** 额外允许的属性 */
  ALLOWED_ATTR?: string[];
  /** 是否允许 data: URI（默认 false —— 避免 SVG XSS） */
  ALLOW_DATA_URI?: boolean;
}
/**
 * 清理富文本内容，返回可安全 v-html 的字符串
 */
export declare function sanitizeHtml(
  dirty: string | null | undefined,
  options?: SanitizeOptions,
): string;
/**
 * 剥除全部 HTML 标签，返回纯文本（用于搜索/摘要）
 */
export declare function stripHtml(html: string | null | undefined): string;
/**
 * 基于纯文本长度截断 HTML，过长部分以 `...` 结尾（用于列表摘要展示）
 */
export declare function truncateHtml(html: string | null | undefined, maxLength?: number): string;
//# sourceMappingURL=sanitize.d.ts.map
