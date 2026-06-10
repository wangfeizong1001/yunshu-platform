/**
 * 云枢中台 — Sentry 后端中间件
 *
 * 提供 initSentry / sentryRequestHandler / sentryErrorHandler：
 *   1. 在其他中间件之前挂载 sentryRequestHandler
 *   2. 在全局 errorHandler 之前挂载 sentryErrorHandler
 *
 * 仅当环境变量 SENTRY_DSN 存在或显式传入 dsn 时初始化。
 *
 * @module @yunshu/server-express/middlewares/sentry
 */

import type { Request, Response, NextFunction, Express } from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express-serve-static-core';

const SENSITIVE_FIELDS: ReadonlyArray<string> = [
  'password', 'secret', 'token', 'authorization', 'cookie', 'jwt',
  'credit', 'card', 'cvv',
];

let initialized = false;
let requestHandlerRef: RequestHandler | null = null;
let errorHandlerRef: ErrorRequestHandler | null = null;

/** 初始化 Sentry（幂等） */
export function initSentry(dsn?: string): boolean {
  if (initialized) return true;
  const finalDsn = dsn ?? process.env.SENTRY_DSN;
  if (!finalDsn) return false;

  try {
    // 延迟 require，避免未安装依赖时报错（在 ESM/CJS 混合场景可用 require）
    // 若使用纯 ESM 环境，请替换为 await import('@sentry/node') 并在应用启动阶段调用
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require('@sentry/node') as {
      init: (opts: Record<string, unknown>) => void;
      Handlers: {
        requestHandler: () => RequestHandler;
        errorHandler: () => ErrorRequestHandler;
      };
    };

    Sentry.init({
      dsn: finalDsn,
      environment: process.env.NODE_ENV ?? 'development',
      release: process.env.SENTRY_RELEASE ?? undefined,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.2),
      beforeSend(event) {
        const req = event.request as Record<string, unknown> | undefined;
        if (req) {
          for (const k of Object.keys(req)) {
            if (SENSITIVE_FIELDS.some((s) => k.toLowerCase().includes(s))) {
              req[k] = '[Filtered]';
            }
          }
        }
        if (event.extra) {
          for (const k of Object.keys(event.extra)) {
            if (SENSITIVE_FIELDS.some((s) => k.toLowerCase().includes(s))) {
              (event.extra as Record<string, unknown>)[k] = '[Filtered]';
            }
          }
        }
        return event;
      },
    });

    requestHandlerRef = Sentry.Handlers.requestHandler();
    errorHandlerRef = Sentry.Handlers.errorHandler();
    initialized = true;
    return true;
  } catch (err) {
    console.warn('[sentry] 初始化失败，请确认已安装 @sentry/node：', err instanceof Error ? err.message : String(err));
    return false;
  }
}

/** Sentry 请求上下文中间件（放在其他中间件之前） */
export const sentryRequestHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!initialized) initSentry();
  if (requestHandlerRef) {
    requestHandlerRef(req, res, next);
  } else {
    next();
  }
};

/** Sentry 错误上报中间件（放在 errorHandler 之前） */
export const sentryErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (errorHandlerRef) {
    (errorHandlerRef as (e: unknown, r: Request, s: Response, n: NextFunction) => void)(err, req, res, next);
  } else {
    next(err as Error);
  }
};

/** 便捷组合：对 Express 实例一键挂载 Sentry */
export function setupSentryExpress(app: Express, dsn?: string): boolean {
  const ok = initSentry(dsn);
  if (!ok) return false;
  app.use(sentryRequestHandler);
  // 注意：errorHandler 由调用方在错误处理链中显式挂载
  app.use(sentryErrorHandler);
  return true;
}
