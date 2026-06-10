/**
 * 轻量级结构化 JSON 日志工具
 *
 * 支持 info/warn/error/debug 级别，
 * 自动注入时间戳、pid，并支持 requestId 上下文。
 *
 * @module @yunshu/server-core/utils/logger
 */

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// 日志上下文
export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

// 全局日志级别
let globalLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

const LEVEL_VALUE: Record<LogLevel, number> = {
  debug: 0, info: 1, warn: 2, error: 3, fatal: 4,
};

export function setLogLevel(level: LogLevel): void {
  globalLogLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_VALUE[level] >= LEVEL_VALUE[globalLogLevel];
}

function redactSensitive(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitive);
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = String(key).toLowerCase();
    if (/password|secret|token|authorization|cookie|jwt|credit|card|cvv/.test(lowerKey)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactSensitive(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function writeLog(level: LogLevel, message: string, context?: LogContext | Error | unknown): void {
  if (!shouldLog(level)) return;
  const entry: Record<string, unknown> = {
    level,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    message,
  };
  if (context instanceof Error) {
    entry.error = { name: context.name, message: context.message, stack: context.stack };
  } else if (typeof context === 'object' && context !== null) {
    Object.assign(entry, redactSensitive(context) as Record<string, unknown>);
  } else if (context !== undefined) {
    entry.extra = context;
  }
  const line = JSON.stringify(entry);
  if (level === 'error' || level === 'fatal') process.stderr.write(line + '\n');
  else process.stdout.write(line + '\n');
}

export const logger = {
  debug: (message: string, ctx?: LogContext | unknown) => writeLog('debug', message, ctx),
  info: (message: string, ctx?: LogContext | unknown) => writeLog('info', message, ctx),
  warn: (message: string, ctx?: LogContext | unknown) => writeLog('warn', message, ctx),
  error: (message: string, ctx?: LogContext | Error | unknown) => writeLog('error', message, ctx),
  fatal: (message: string, ctx?: LogContext | Error | unknown) => writeLog('fatal', message, ctx),
  setLevel: setLogLevel,
};

export default logger;
