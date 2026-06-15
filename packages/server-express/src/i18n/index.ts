import type { Request } from 'express';
import { messages as defaultMessages } from './locales';

const messagesStore: Record<string, Record<string, unknown>> = {
  'zh-CN': {},
  'en-US': {},
};

// 将默认的 messages 合并到 store 中（使用扁平化路径）
function flatten(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !(value instanceof Array)) {
      Object.assign(result, flatten(value as Record<string, unknown>, path));
    } else if (typeof value === 'string') {
      result[path] = value;
    }
  }
  return result;
}

// 合并默认翻译到 store
for (const locale of Object.keys(defaultMessages)) {
  const flat = flatten(defaultMessages[locale] as Record<string, unknown>);
  messagesStore[locale] = flat;
}

// 全局当前地区
let currentLocale: string = 'zh-CN';

/**
 * 从请求中解析语言
 */
export function getLocale(req: Request): string {
  if (req.query && typeof req.query.lang === 'string') {
    const lang = req.query.lang;
    if (messagesStore[lang]) {
      return lang;
    }
  }

  const acceptLanguage = req.headers?.['accept-language'];
  if (acceptLanguage) {
    if (acceptLanguage.startsWith('en')) {
      return 'en-US';
    }
    if (acceptLanguage.startsWith('zh')) {
      return 'zh-CN';
    }
  }

  return 'zh-CN';
}

/**
 * 翻译函数 - 接收地区 + key + 可选 params
 */
export function t(
  locale: string,
  key: string,
  params?: Record<string, string | number>,
): string {
  const localeMessages = messagesStore[locale] || messagesStore['zh-CN'] || {};
  const value = localeMessages[key];
  if (typeof value !== 'string') {
    return key;
  }
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : `{${paramKey}}`;
    });
  }
  return value;
}

/**
 * translate 别名 - 使用全局当前地区翻译
 */
export function translate(key: string, params?: Record<string, string | number>): string {
  return t(currentLocale, key, params);
}

/**
 * 设置全局当前地区
 */
export function setLocale(locale: string): void {
  currentLocale = locale;
}

/**
 * 获取全局当前地区
 */
export function getCurrentLocale(): string {
  return currentLocale;
}

/**
 * 注册/合并翻译键
 */
export function registerTranslations(
  locale: string,
  translations: Record<string, string>,
): void {
  if (!messagesStore[locale]) {
    messagesStore[locale] = {};
  }
  Object.assign(messagesStore[locale], translations);
}

/**
 * 创建 i18n 实例（向后兼容）
 */
export function createI18n() {
  return {
    getLocale,
    t,
    messages: messagesStore,
  };
}

export default {
  getLocale,
  t,
  messages: messagesStore,
};
