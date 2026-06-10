/**
 * 云枢中台 — 结构化日志工具（基于 Winston）
 *
 * 核心特性：
 *  1. 日志级别：debug / info / warn / error + 兼容原有 fatal（映射到 error）
 *  2. 结构化字段：自动注入 timestamp / pid / level / message + 上下文字典
 *  3. 生产环境：JSON 输出；开发环境：彩色日志
 *  4. 敏感字段脱敏：password / secret / token / authorization / cookie / jwt / credit / card / cvv → [REDACTED]
 *  5. Loki 可选接入：配置 LOKI_URL 环境变量后自动附加 Grafana Loki transport
 *  6. 统一 API：logger.info/warn/error/fatal/debug(message, context?) / logger.setLevel(level) / setLogLevel(level)
 *
 * @module @yunshu/server-core/utils/logger
 */

import winston from 'winston';

// --------------------------------------------------------------------------
// 类型
// --------------------------------------------------------------------------

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

// --------------------------------------------------------------------------
// 敏感字段脱敏
// --------------------------------------------------------------------------

const SENSITIVE_KEYS: ReadonlyArray<RegExp> = [
  /password/i,
  /secret/i,
  /token/i,
  /^authorization$/i,
  /cookie/i,
  /jwt/i,
  /credit/i,
  /^card$/i,
  /cvv/i,
];

function redact(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(redact);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((re) => re.test(k))) {
      result[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null) {
      result[k] = redact(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

// --------------------------------------------------------------------------
// 自定义格式化：开发环境彩色 + 结构化字段
// --------------------------------------------------------------------------

const devFormat = winston.format.printf((info) => {
  const { timestamp, level, message, pid, ...rest } = info as Record<string, unknown> & {
    timestamp: string; level: string; message: string; pid?: number;
  };
  const contextEntries = Object.entries(rest as Record<string, unknown>).filter(
    ([, v]) => typeof v !== 'symbol',
  );
  const contextStr = contextEntries.length
    ? contextEntries
        .map(([k, v]) => {
          try {
            return `${k}=${typeof v === 'object' ? JSON.stringify(redact(v)) : String(v)}`;
          } catch {
            return `${k}=<unserializable>`;
          }
        })
        .join(' ')
    : '';
  return `${timestamp} ${level} (${pid ?? process.pid}) ${message}${contextStr ? ' ' + contextStr : ''}`;
});

const baseTransports: winston.transport[] = [];

const isProd =
  (process.env.NODE_ENV ?? '').toLowerCase() === 'production' ||
  (process.env.NODE_ENV ?? '').toLowerCase() === 'prod';

// --------------------------------------------------------------------------
// Loki Transport（可选）
// --------------------------------------------------------------------------

async function attachLokiTransportIfConfigured(w: winston.Logger): Promise<void> {
  const lokiUrl = process.env.LOKI_URL;
  if (!lokiUrl) return;
  try {
    const lokiModule = await import('winston-loki');
    // 该包导出有变化，兼容两种常见方式
    const LokiTransport: {
      new (opts: Record<string, unknown>): winston.transport;
    } = (lokiModule.default as unknown as { new (opts: Record<string, unknown>): winston.transport } | undefined)
      ?? (lokiModule as unknown as { LokiTransport: { new (opts: Record<string, unknown>): winston.transport } }).LokiTransport;
    const labels: Record<string, string> = {
      app: process.env.LOKI_APP ?? 'yunshu-platform',
      job: process.env.LOKI_JOB ?? 'backend',
      env: process.env.NODE_ENV ?? 'development',
    };
    w.add(new LokiTransport({ host: lokiUrl, labels, json: true }));
    logger.info('[logger] 已附加 Loki transport', { host: lokiUrl, labels });
  } catch (err) {
    // 降级：仅输出提示，不影响主日志
    console.warn('[logger] 初始化 Loki transport 失败，请确认已安装 winston-loki:', err instanceof Error ? err.message : String(err));
  }
}

// --------------------------------------------------------------------------
// 构建 logger 实例
// --------------------------------------------------------------------------

const levelFromEnv: string = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
const initialLevel: Exclude<LogLevel, 'fatal'> =
  levelFromEnv === 'debug' || levelFromEnv === 'info' || levelFromEnv === 'warn' || levelFromEnv === 'error'
    ? levelFromEnv
    : 'info';

const loggerInstance: winston.Logger = winston.createLogger({
  level: initialLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format((info) => {
      // 自动脱敏所有上下文字段
      return redact(info) as winston.Logform.TransformableInfo;
    })(),
    isProd ? winston.format.json() : winston.format.combine(winston.format.colorize(), devFormat),
  ),
  transports: baseTransports,
  exitOnError: false,
});

// 控制台输出（始终挂载）
loggerInstance.add(
  new winston.transports.Console({
    level: initialLevel,
    handleExceptions: true,
  }),
);

// 若配置了 Loki，异步附加 transport（不阻塞启动）
// 注意：import() 在 ESM/CJS 混合场景可能需要上层确保安装 winston-loki
// 此处放在模块作用域顶层，启动时自动触发
if (typeof process !== 'undefined' && typeof process.env.LOKI_URL === 'string') {
  attachLokiTransportIfConfigured(loggerInstance).catch(() => {
    /* 已在函数内 warn */
  });
}

// --------------------------------------------------------------------------
// 对外 API（与旧自研 logger 保持一致）
// --------------------------------------------------------------------------

function mergeMeta(ctx: LogContext | Error | unknown | undefined): LogContext {
  if (ctx === undefined) return {};
  if (ctx instanceof Error) return { error: { name: ctx.name, message: ctx.message, stack: ctx.stack } };
  if (typeof ctx === 'object' && ctx !== null) return ctx as LogContext;
  return { extra: ctx };
}

export const logger = {
  debug: (message: string, ctx?: LogContext | unknown): void => {
    loggerInstance.debug(message, mergeMeta(ctx));
  },
  info: (message: string, ctx?: LogContext | unknown): void => {
    loggerInstance.info(message, mergeMeta(ctx));
  },
  warn: (message: string, ctx?: LogContext | unknown): void => {
    loggerInstance.warn(message, mergeMeta(ctx));
  },
  error: (message: string, ctx?: LogContext | Error | unknown): void => {
    loggerInstance.error(message, mergeMeta(ctx));
  },
  fatal: (message: string, ctx?: LogContext | Error | unknown): void => {
    // Winston npm levels 无 fatal，映射到 error 级别上报（保留 API 兼容）
    loggerInstance.error(message, { ...mergeMeta(ctx), fatal: true });
  },
  setLevel: (level: LogLevel): void => {
    const mapped = level === 'fatal' ? 'error' : level;
    loggerInstance.level = mapped;
    for (const t of loggerInstance.transports) {
      t.level = mapped;
    }
  },
};

export function setLogLevel(level: LogLevel): void {
  logger.setLevel(level);
}

export default logger;
