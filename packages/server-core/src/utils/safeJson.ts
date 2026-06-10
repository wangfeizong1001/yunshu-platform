/**
 * 安全 JSON 工具 — 防止原型链污染 / 循环引用
 *
 * @module @yunshu/server-core/utils/safeJson
 */

import { safeJsonParse as sharedParse, safeJsonStringify as sharedStringify } from '@yunshu/shared';

export function safeJsonParse<T = unknown>(text: string): T {
  if (typeof text !== 'string') return text as unknown as T;
  return sharedParse<T>(text);
}

export function safeJsonStringify(value: unknown, space?: number): string {
  return sharedStringify(value, space);
}
