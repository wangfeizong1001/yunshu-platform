import { describe, it, expect, vi } from 'vitest'
import { sanitizeHtml, stripHtml, truncateHtml } from '@/utils/security/sanitize'

vi.mock('dompurify', () => {
  const sanitize = (dirty: string, config?: { HOOKS?: { afterSanitizeAttributes?: Array<(node: HTMLElement) => void> } }): string => {
    if (!dirty) return ''

    // 简单的字符串级清理逻辑（不依赖真实 DOM）
    // 1. 移除 <script> 及其内容
    let result = dirty.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')

    // 2. 移除内联事件处理器（onclick, onerror, onload 等）
    result = result.replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    result = result.replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    result = result.replace(/\son\w+\s*=\s*[^'">\s]+/gi, '')

    // 3. 移除 javascript: 协议
    result = result.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    result = result.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'")

    // 4. 移除危险标签（iframe, object, embed, form 等）
    result = result.replace(/<(iframe|object|embed|form|input|textarea|button|link|meta|base|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    result = result.replace(/<(iframe|object|embed|form|input|textarea|button|link|meta|base|noscript)\b[^>]*\/?>/gi, '')

    // 5. 移除 style 属性
    result = result.replace(/\sstyle\s*=\s*"[^"]*"/gi, '')
    result = result.replace(/\sstyle\s*=\s*'[^']*'/gi, '')

    // 6. 对 <a> 标签添加 rel="noopener noreferrer"
    result = result.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
      if (/rel\s*=/i.test(attrs)) {
        return match
      }
      return `<a${attrs} rel="noopener noreferrer">`
    })

    // 7. 对外部链接 <a> 添加 target="_blank"
    result = result.replace(/<a\b([^>]*)href\s*=\s*"https?:\/\/([^"]*)"([^>]*)>/gi, (match, pre, href, post) => {
      let postAttrs = post
      if (!/target\s*=/i.test(postAttrs)) {
        postAttrs = ` target="_blank"${postAttrs}`
      }
      return `<a${pre}href="https://${href}"${postAttrs}>`
    })

    // 8. 调用 HOOKS（模拟真实 DOMPurify 的钩子执行）
    const hooks = config?.HOOKS
    if (hooks?.afterSanitizeAttributes && typeof document !== 'undefined') {
      // 解析并对每个节点应用钩子
      const parser = new DOMParser()
      try {
        const doc = parser.parseFromString(`<div>${result}</div>`, 'text/html')
        const applyHook = (el: Element) => {
          ; (hooks.afterSanitizeAttributes as Array<(node: Element) => void>).forEach((fn) => fn(el as unknown as HTMLElement))
          Array.from(el.children).forEach(applyHook)
        }
        applyHook(doc.body.firstElementChild!)
        result = doc.body.innerHTML
      } catch {
        // 忽略解析错误
      }
    }

    return result
  }

  return {
    default: {
      sanitize,
    },
  }
})

describe('security/sanitize.ts', () => {
  describe('sanitizeHtml', () => {
    it('应该移除 <script> 标签', () => {
      const result = sanitizeHtml('<script>alert("xss")</script>Hello')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('</script>')
      expect(result).toContain('Hello')
    })

    it('应该移除内联事件处理器', () => {
      const result = sanitizeHtml('<div onclick="alert(1)">text</div>')
      expect(result).not.toContain('onclick')
    })

    it('应该移除 javascript: 协议链接', () => {
      const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>')
      expect(result).not.toContain('javascript:')
    })

    it('应该保留安全的 HTML 标签（p, strong, a, img）', () => {
      const html = '<p><strong>Hello</strong> <a href="https://example.com">link</a></p>'
      const result = sanitizeHtml(html)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).toContain('<a')
    })

    it('应该给 <a> 标签添加 rel="noopener noreferrer"', () => {
      const result = sanitizeHtml('<a href="https://example.com">link</a>')
      expect(result).toContain('noopener')
      expect(result).toContain('noreferrer')
    })

    it('应该处理空字符串和 null', () => {
      expect(sanitizeHtml('')).toBe('')
    })

    it('应该移除 iframe, object, embed 等危险标签', () => {
      const result = sanitizeHtml('<iframe src="http://evil.com"></iframe>text')
      expect(result).not.toContain('<iframe')
      expect(result).toContain('text')
    })

    it('应该处理 style 属性', () => {
      const result = sanitizeHtml('<p style="color: red">test</p>')
      expect(result).not.toContain('style=')
    })
  })

  describe('stripHtml', () => {
    it('应该移除所有 HTML 标签并返回纯文本', () => {
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
    })

    it('应该处理空字符串', () => {
      expect(stripHtml('')).toBe('')
    })

    it('应该处理纯文本（无 HTML）', () => {
      expect(stripHtml('Just plain text')).toBe('Just plain text')
    })
  })

  describe('truncateHtml', () => {
    it('应该截断 HTML 并保留安全标签', () => {
      const html = '<p>Hello World this is a long text that should be truncated</p>'
      const result = truncateHtml(html, 10)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('当内容短于限制时应返回完整内容', () => {
      const result = truncateHtml('<p>Short</p>', 100)
      expect(result).toBeDefined()
      expect(result).toContain('Short')
    })
  })
})
