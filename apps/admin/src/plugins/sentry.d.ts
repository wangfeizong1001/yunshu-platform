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
/**
 * 初始化 Sentry。无 DSN 时不做任何事。
 */
export declare function initSentry(_app: App, router?: Router, opts?: SentryInitOptions): Promise<void>;
//# sourceMappingURL=sentry.d.ts.map