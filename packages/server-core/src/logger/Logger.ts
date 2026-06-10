/**
 * 结构化日志工具
 *
 * 轻量级的层级化日志模块，核心特性：
 *  1. 支持 debug / info / warn / error 四个级别
 *  2. 每条日志自动携带时间戳、级别、消息、上下文对象
 *  3. 生产环境输出 JSON 格式，开发环境友好格式化输出
 *  4. withContext(prefix) 可创建带上下文前缀的子 logger
 *  5. 禁止裸调用 console.log / console.error，统一走本模块
 *
 * @module @yunshu/server-core/logger/Logger
 */

// ============================================================================
// 类型定义
// ============================================================================

/** 日志级别 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** 日志级别数字值（用于比较与过滤） */
const LEVEL_VALUE: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** 日志上下文对象：可携带任意附加信息 */
export interface LogContext {
  [key: string]: unknown;
}

/** 完整的一条日志记录结构 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  prefix?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// ============================================================================
// 环境配置
// ============================================================================

/** 当前启用的最低日志级别 */
function resolveCurrentLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL ?? '').toLowerCase();
  if (env === 'debug' || env === 'info' || env === 'warn' || env === 'error') {
    return env;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

let currentLevel: LogLevel = resolveCurrentLevel();

/** 是否为生产环境（决定输出格式） */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 动态设置日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/**
 * 获取当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

// ============================================================================
// 敏感字段过滤
// ============================================================================

const SENSITIVE_KEYS: ReadonlyArray<RegExp> = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /cookie/i,
  /jwt/i,
  /credit/i,
  /card/i,
  /cvv/i,
  /^pin$/i,
];

/**
 * 递归清理敏感字段，防止日志泄露密钥、密码等。
 */
function redact(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[Truncated]';
  if (value === null || value === undefined) return value;

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.some((re) => re.test(key))) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redact(val, depth + 1);
      }
    }
    return result;
  }

  return value;
}

// ============================================================================
// 格式化与输出
// ============================================================================

/**
 * 生产环境：输出单行 JSON，便于 ELK / Loki 等采集
 */
function formatProduction(entry: LogEntry): string {
  return JSON.stringify(redact(entry));
}

/**
 * 开发环境：彩色 / 结构化输出，便于本地调试
 */
function formatDevelopment(entry: LogEntry): string {
  const levelColor: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m', // green
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
  };
  const reset = '\x1b[0m';
  const color = levelColor[entry.level];
  const prefix = entry.prefix ? ` [${entry.prefix}]` : '';
  const header = `${entry.timestamp} ${color}[${entry.level.toUpperCase()}]${reset}${prefix} ${entry.message}`;

  const parts: Array<string> = [header];
  if (entry.context && Object.keys(entry.context).length > 0) {
    parts.push(
      JSON.stringify(redact(entry.context), null, 2)
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n'),
    );
  }
  if (entry.error) {
    parts.push(`  ${entry.error.name}: ${entry.error.message}`);
    if (entry.error.stack) {
      parts.push(
        entry.error.stack
          .split('\n')
          .map((line) => `    ${line}`)
          .join('\n'),
      );
    }
  }
  return parts.join('\n');
}

/**
 * 统一写入日志
 */
function writeLog(
  level: LogLevel,
  message: string,
  contextOrError?: LogContext | Error,
  prefix?: string,
): void {
  // 级别过滤
  if (LEVEL_VALUE[level] < LEVEL_VALUE[currentLevel]) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    prefix,
  };

  if (contextOrError instanceof Error) {
    entry.error = {
      name: contextOrError.name,
      message: contextOrError.message,
      stack: contextOrError.stack,
    };
  } else if (contextOrError !== undefined) {
    entry.context = contextOrError as LogContext;
  }

  const line = isProduction() ? formatProduction(entry) : formatDevelopment(entry);

  if (level === 'error') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

// ============================================================================
// Logger 类
// ============================================================================

/**
 * 日志类 —— 通过 withContext() 可创建带命名空间的子 Logger
 */
export class Logger {
  private readonly prefix: string | undefined;

  constructor(prefix?: string) {
    this.prefix = prefix;
  }

  debug(message: string, context?: LogContext): void {
    writeLog('debug', message, context, this.prefix);
  }

  info(message: string, context?: LogContext): void {
    writeLog('info', message, context, this.prefix);
  }

  warn(message: string, context?: LogContext): void {
    writeLog('warn', message, context, this.prefix);
  }

  error(message: string, contextOrError?: LogContext | Error): void {
    writeLog('error', message, contextOrError, this.prefix);
  }

  /**
   * 创建带前缀的子 Logger，用于区分不同模块/请求的日志
   *
   * @example
   *   const log = rootLogger.withContext('AuthController');
   *   log.info('login', { userId: 'u-123' });
   */
  withContext(subPrefix: string): Logger {
    const combined = this.prefix ? `${this.prefix}:${subPrefix}` : subPrefix;
    return new Logger(combined);
  }
}

// ============================================================================
// 默认导出
// ============================================================================

/** 根 Logger 实例（无前缀），项目应优先使用它或其派生实例 */
export const rootLogger = new Logger();

export default rootLogger;
