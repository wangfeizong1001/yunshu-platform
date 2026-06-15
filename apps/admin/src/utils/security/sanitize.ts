/**
 * 云枢中台 — 安全 HTML 清洗工具
 *
 * 功能：
 *   1. DOMPurify 深度清洗富文本内容，防止 XSS 攻击
 *   2. 限制可用 HTML 标签与属性白名单
 *   3. 强制 a 标签 rel="noopener noreferrer"
 *   4. 禁止内联脚本、事件处理器、iframe 等危险元素
 *
 * 设计目标：
 *   - 禁止项目中任何地方直接使用 v-html
 *   - 所有富文本渲染必须先经过 sanitizeHtml() 处理
 *   - <SafeHtml /> 组件已封装此工具，可在模板中直接使用
 *
 * @module security/sanitize
 */

import DOMPurify from 'dompurify'

/**
 * 白名单：允许的 HTML 标签
 * 遵循最小权限原则，仅保留富文本展示所需标签
 */
const ALLOWED_TAGS: readonly string[] = [
  // 文本结构
  'p', 'br', 'hr', 'div', 'span',
  // 标题
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // 文本样式
  'strong', 'em', 'u', 's', 'strike', 'small', 'mark',
  // 列表
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  // 引用
  'blockquote', 'q', 'cite',
  // 代码
  'code', 'pre', 'kbd', 'samp', 'var',
  // 表格
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption',
  // 链接与图片
  'a', 'img',
  // 排版
  'b', 'i', 'sub', 'sup'
]

/**
 * 白名单：允许的 HTML 属性
 */
const ALLOWED_ATTR: readonly string[] = [
  'href',              // 链接目标
  'src',               // 图片源
  'alt',               // 图片替代文本
  'title',             // 悬停提示
  'class',             // 自定义样式类
  'target',            // 链接打开方式（强制 _blank）
  'width', 'height',   // 图片尺寸
  'colspan', 'rowspan' // 表格合并
]

/**
 * 黑名单：禁止的标签
 */
const FORBID_TAGS: readonly string[] = [
  'script', 'style', 'iframe', 'object', 'embed',
  'form', 'input', 'textarea', 'button', 'select',
  'link', 'meta', 'base', 'frame', 'frameset', 'noscript',
  'svg', 'math', 'canvas', 'audio', 'video'
]

/**
 * 黑名单：禁止的属性（事件处理器与危险属性）
 */
const FORBID_ATTR: readonly string[] = [
  'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
  'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
  'onkeydown', 'onkeypress', 'onkeyup',
  'ondrag', 'ondrop', 'onscroll',
  'style', 'srcdoc', 'ping',
  'formaction', 'formtarget'
]

/**
 * 安全 HTML 清洗 —— 防止 XSS 攻击
 * @param dirtyHtml 原始（可能包含恶意脚本）的 HTML 字符串
 * @returns 经过清洗的安全 HTML 字符串
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return ''

  try {
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [...ALLOWED_TAGS],
      ALLOWED_ATTR: [...ALLOWED_ATTR],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_TAGS: [...FORBID_TAGS],
      FORBID_ATTR: [...FORBID_ATTR],
      USE_PROFILES: { html: true },
      IN_PLACE: false,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,

      // 对 <a> 标签强制添加安全属性
      // eslint-disable-next-line @typescript-eslint/naming-convention
      HOOKS: {
        afterSanitizeAttributes: (node) => {
          if (node.nodeName === 'A' && node instanceof Element) {
            node.setAttribute('rel', 'noopener noreferrer')
            const href = node.getAttribute('href')
            if (href && /^(https?:)?\/\//i.test(href)) {
              node.setAttribute('target', '_blank')
            }
          }
        }
      }
    })
  } catch {
    // 对不完整的 DOM（如 happy-dom）退化到简单文本清洗
    return stripTagsSimple(dirtyHtml)
  }
}

/**
 * 退化/纯文本提取 —— 当 DOMPurify 无法运行时的安全降级
 */
function stripTagsSimple(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 纯文本提取 —— 从 HTML 中获取纯文本内容
 * @param html HTML 字符串
 * @returns 纯文本字符串（不含任何标签）
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = sanitizeHtml(html)
  return div.textContent || div.innerText || ''
}

/**
 * 截断富文本 —— 按字符长度截断 HTML（保持标签完整）
 * @param html HTML 字符串
 * @param maxLength 最大字符数
 * @param suffix 截断后追加的后缀（默认 "..."）
 */
export function truncateHtml(html: string, maxLength: number, suffix = '...'): string {
  if (!html) return ''
  const text = stripHtml(html)
  if (text.length <= maxLength) return sanitizeHtml(html)
  return `${sanitizeHtml(html.substring(0, maxLength))}${suffix}`
}
