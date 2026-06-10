/**
 * 云枢中台 — Sentry 前端初始化
 *
 * 仅在配置 VITE_SENTRY_DSN 时初始化。若未配置则 initSentry 是 no-op。
 *
 * 使用：在 main.ts 中 app.use(router) 之后、app.mount('#app') 之前调用
 *   import { initSentry } from './plugins/sentry';
 *   initSentry(app, router);
 *
 * @module @yunshu/admin/plugins/sentry
 */

import type { App } from 'vue';
import type { Router } from 'vue-router';

export interface SentryInitOptions {
  dsn?: string;
  release?: string;
  environment?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

const SENSITIVE_FIELDS = [
  'password', 'secret', 'token', 'authorization', 'cookie', 'jwt',
  'credit', 'card', 'cvv',
];

function scrubSensitiveData(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(scrubSensitiveData);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const lower = k.toLowerCase();
    if (SENSITIVE_FIELDS.some((s) => lower.includes(s))) {
      result[k] = '[Filtered]';
    } else if (typeof v === 'object' && v !== null) {
      result[k] = scrubSensitiveData(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

/**
 * 初始化 Sentry。无 DSN 时不做任何事。
 */
export async function initSentry(
  _app: App,
  router?: Router,
  opts: SentryInitOptions = {},
): Promise<void> {
  const dsn = opts.dsn ?? import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  try {
    // 动态导入 —— 避免未配置 DSN 时仍打包 sentry 依赖
    const SentryVue = await import('@sentry/vue');

    SentryVue.init({
      app: _app,
      dsn,
      release: opts.release ?? import.meta.env.VITE_SENTRY_RELEASE as string | undefined,
      environment: opts.environment ?? import.meta.env.MODE,
      integrations: router
        ? [new SentryVue.BrowserTracing({ routingInstrumentation: SentryVue.vueRouterInstrumentation(router) })]
        : [new SentryVue.BrowserTracing()],
      tracesSampleRate: opts.tracesSampleRate ?? 0.2,
      replaysSessionSampleRate: opts.replaysSessionSampleRate ?? 0.1,
      replaysOnErrorSampleRate: opts.replaysOnErrorSampleRate ?? 1.0,
      beforeSend(event) {
        if (event.request?.headers) {
          event.request.headers = scrubSensitiveData(event.request.headers) as Record<string, string>;
        }
        if (event.request?.cookies) {
          event.request.cookies = '[Filtered]';
        }
        if (event.extra) {
          event.extra = scrubSensitiveData(event.extra) as Record<string, unknown>;
        }
        return event;
      },
    });
  } catch (err) {
    // 降级：仅 warn，不阻断应用启动
    console.warn('[sentry] 初始化失败，请检查 @sentry/vue 是否已安装：', err instanceof Error ? err.message : String(err));
  }
}
