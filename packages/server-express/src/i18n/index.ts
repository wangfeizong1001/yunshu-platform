import type { Request } from 'express';
import { messages } from './locales'

// 获取语言（从请求头或查询参数）
export function getLocale(req: Request): string {
  // 优先从查询参数获取
  if (req.query && typeof req.query.lang === 'string') {
    const lang = req.query.lang;
    if (messages[lang as keyof typeof messages]) {
      return lang;
    }
  }

  // 从请求头获取
  const acceptLanguage = req.headers?.['accept-language'];
  if (acceptLanguage) {
    // 简单解析 accept-language 头
    if (acceptLanguage.startsWith('en')) {
      return 'en';
    }
    if (acceptLanguage.startsWith('zh')) {
      return 'zh-CN';
    }
  }

  // 默认语言
  return 'zh-CN';
}

// 翻译函数
export function t(locale: string, key: string, params?: Record<string, string | number>): string {
  const localeMessages = messages[locale as keyof typeof messages] || messages['zh-CN'];

  // 使用点号路径获取嵌套消息
  const keys = key.split('.');
  let value: unknown = localeMessages;

  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // 如果找不到对应的 key，返回原始 key
      return key;
    }
  }

  // 如果找到的是对象而非字符串，返回原始 key
  if (typeof value !== 'string') {
    return key;
  }

  // 替换参数
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : `{${paramKey}}`;
    });
  }

  return value;
}

// 创建 i18n 实例
export function createI18n() {
  return {
    getLocale,
    t,
    messages,
  }
}

export default {
  getLocale,
  t,
  messages,
}
