/**
 * 统一配置管理服务
 *
 * 提供环境变量解析、类型转换、默认值填充与校验的统一入口，支持：
 * - 单例模式的 ConfigService 类
 * - 从 process.env 或自定义对象读取配置
 * - 支持 dotenv 动态加载（若安装了 dotenv 包）
 * - 按路径（如 'postgres.host'）访问配置
 * - 必填字段校验
 *
 * @module @yunshu/server-core/config/ConfigService
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 服务器配置
 */
export interface ServerConfig {
  /** 监听端口 */
  port: number;
  /** 监听主机地址 */
  host: string;
  /** CORS 允许的源（多个以逗号分隔或通配符 '*'） */
  corsOrigin: string;
  /** API 路由前缀（如 '/api/v1'） */
  apiPrefix: string;
}

/**
 * PostgreSQL 数据库配置
 *
 * @remarks 与 PostgresClient 内部使用的 PostgresConfig 区分命名，
 *          避免类型导出冲突。此处命名为 PostgresDbConfig。
 */
export interface PostgresDbConfig {
  /** 主机地址 */
  host: string;
  /** 端口 */
  port: number;
  /** 数据库名 */
  database: string;
  /** 用户名 */
  user: string;
  /** 密码 */
  password: string;
  /** 是否启用 SSL */
  ssl: boolean;
  /** 连接池最大连接数 */
  maxPoolSize: number;
  /** 连接池最小连接数 */
  minPoolSize: number;
  /** 连接空闲超时（毫秒） */
  idleTimeout: number;
  /** 连接超时（毫秒） */
  connectionTimeout: number;
}

/**
 * Redis 缓存配置
 *
 * @remarks 与 RedisClient 内部使用的 RedisConfig 区分命名，避免类型导出冲突。
 *          此处命名为 RedisCacheConfig。
 */
export interface RedisCacheConfig {
  /** 主机地址 */
  host: string;
  /** 端口 */
  port: number;
  /** 密码（可选） */
  password?: string;
  /** 数据库索引 */
  db: number;
  /** 键前缀 */
  keyPrefix: string;
  /** 每个请求的最大重试次数 */
  maxRetriesPerRequest: number;
  /** 是否启用离线队列 */
  enableOfflineQueue: boolean;
}

/**
 * 认证配置
 */
export interface AuthConfig {
  /** JWT 签名密钥 */
  jwtSecret: string;
  /** JWT 访问令牌过期时间（如 '15m'、'1h'、'7d'） */
  jwtExpiresIn: string;
  /** JWT 刷新令牌过期时间 */
  jwtRefreshExpiresIn: string;
  /** bcrypt 哈希轮数 */
  bcryptRounds: number;
}

/**
 * 应用基础配置
 */
export interface AppMetaConfig {
  /** 应用名称 */
  name: string;
  /** 运行环境 */
  env: 'development' | 'production' | 'test';
  /** 日志级别 */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * 缓存策略配置
 */
export interface CacheConfig {
  /** 是否启用缓存 */
  enabled: boolean;
  /** 默认缓存过期时间（秒） */
  defaultTtl: number;
  /** L1（内存）缓存最大条目数 */
  l1MaxSize: number;
  /** 布隆过滤器大小（位） */
  bloomFilterSize: number;
  /** 布隆过滤器哈希函数数量 */
  bloomFilterHashCount: number;
}

/**
 * 应用完整配置
 */
export interface AppConfig {
  /** 服务器配置 */
  server: ServerConfig;
  /** PostgreSQL 配置 */
  postgres: PostgresDbConfig;
  /** Redis 配置 */
  redis: RedisCacheConfig;
  /** 认证配置 */
  auth: AuthConfig;
  /** 应用基础配置 */
  app: AppMetaConfig;
  /** 缓存策略配置 */
  cache: CacheConfig;
}

// ============================================================================
// 默认配置
// ============================================================================

/**
 * 默认配置值
 */
const DEFAULT_CONFIG: AppConfig = {
  server: {
    port: 3000,
    host: '0.0.0.0',
    corsOrigin: '*',
    apiPrefix: '/api',
  },
  postgres: {
    host: 'localhost',
    port: 5432,
    database: 'yunshu',
    user: 'postgres',
    password: '',
    ssl: false,
    maxPoolSize: 10,
    minPoolSize: 2,
    idleTimeout: 30000,
    connectionTimeout: 5000,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
    db: 0,
    keyPrefix: 'yunshu:',
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
  },
  auth: {
    jwtSecret: 'change-me-in-production-please',
    jwtExpiresIn: '15m',
    jwtRefreshExpiresIn: '7d',
    bcryptRounds: 10,
  },
  app: {
    name: 'yunshu-server',
    env: 'development',
    logLevel: 'info',
  },
  cache: {
    enabled: true,
    defaultTtl: 300,
    l1MaxSize: 1000,
    bloomFilterSize: 1048576,
    bloomFilterHashCount: 4,
  },
};

/**
 * 必填字段路径列表（使用点号路径）
 */
const REQUIRED_FIELDS: string[] = [
  'auth.jwtSecret',
];

// ============================================================================
// 辅助函数：类型转换
// ============================================================================

/**
 * 将字符串解析为整数。
 * 若解析失败或结果为 NaN，则返回默认值。
 */
function parseIntValue(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 将字符串解析为布尔值。
 * 支持的值：'true'/'false'（大小写不敏感）、'1'/'0'、'yes'/'no'、'on'/'off'
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  return defaultValue;
}

/**
 * 将字符串按分隔符解析为字符串数组。
 * 默认分隔符为英文逗号。
 */
function parseList(value: string | undefined, separator: string = ','): string[] {
  if (value === undefined || value === '') {
    return [];
  }
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

// ============================================================================
// ConfigService 类
// ============================================================================

/**
 * 统一配置管理服务（单例模式）
 *
 * @example
 * ```typescript
 * // 使用默认方式（读取 process.env）
 * const config = ConfigService.getInstance();
 * const port = config.get('server').port;
 *
 * // 按路径访问
 * const host = config.getByPath('postgres.host');
 *
 * // 校验必填字段
 * const missing = config.validate();
 * if (missing.length > 0) {
 *   console.error('缺少配置字段：', missing);
 * }
 *
 * // 测试时注入自定义 env
 * const testConfig = new ConfigService({ PORT: '4000' });
 * ```
 */
export class ConfigService {
  private static instance: ConfigService | null = null;

  private readonly env: NodeJS.ProcessEnv;
  private config: AppConfig;
  private loaded: boolean = false;

  /**
   * 获取单例实例
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * 重置单例（仅用于测试）
   */
  public static resetInstance(): void {
    ConfigService.instance = null;
  }

  /**
   * 构造函数
   *
   * @param env 可选的环境变量对象，便于测试时注入。若不提供则使用 process.env
   */
  public constructor(env?: NodeJS.ProcessEnv) {
    this.env = env ?? process.env;
    this.config = { ...DEFAULT_CONFIG };
    void this.tryLoadDotenv();
    this.load();
  }

  /**
   * 尝试加载 dotenv（若项目中安装了 dotenv 包）
   *
   * @remarks 使用字符串式模块名绕过 tsc 严格检查，
   *          未安装时静默跳过，不影响运行。
   */
  private async tryLoadDotenv(): Promise<void> {
    try {
      const dotenvModuleName = 'dotenv';
      const dotenv = (await import(
        /* @vite-ignore */ dotenvModuleName as string
      )) as {
        config?: () => { parsed?: Record<string, string> | undefined } | undefined;
      };
      if (typeof dotenv.config === 'function') {
        dotenv.config();
      }
    } catch {
      // dotenv 未安装，静默跳过
    }
  }

  /**
   * 解析环境变量并填充默认值
   */
  public load(): AppConfig {
    const env = this.env;

    this.config = {
      server: {
        port: parseIntValue(env.PORT, DEFAULT_CONFIG.server.port),
        host: env.HOST ?? DEFAULT_CONFIG.server.host,
        corsOrigin: env.CORS_ORIGIN ?? DEFAULT_CONFIG.server.corsOrigin,
        apiPrefix: env.API_PREFIX ?? DEFAULT_CONFIG.server.apiPrefix,
      },
      postgres: {
        host: env.POSTGRES_HOST ?? DEFAULT_CONFIG.postgres.host,
        port: parseIntValue(env.POSTGRES_PORT, DEFAULT_CONFIG.postgres.port),
        database: env.POSTGRES_DB ?? DEFAULT_CONFIG.postgres.database,
        user: env.POSTGRES_USER ?? DEFAULT_CONFIG.postgres.user,
        password: env.POSTGRES_PASSWORD ?? DEFAULT_CONFIG.postgres.password,
        ssl: parseBoolean(env.POSTGRES_SSL, DEFAULT_CONFIG.postgres.ssl),
        maxPoolSize: parseIntValue(env.POSTGRES_MAX_POOL_SIZE, DEFAULT_CONFIG.postgres.maxPoolSize),
        minPoolSize: parseIntValue(env.POSTGRES_MIN_POOL_SIZE, DEFAULT_CONFIG.postgres.minPoolSize),
        idleTimeout: parseIntValue(env.POSTGRES_IDLE_TIMEOUT, DEFAULT_CONFIG.postgres.idleTimeout),
        connectionTimeout: parseIntValue(
          env.POSTGRES_CONNECTION_TIMEOUT,
          DEFAULT_CONFIG.postgres.connectionTimeout,
        ),
      },
      redis: {
        host: env.REDIS_HOST ?? DEFAULT_CONFIG.redis.host,
        port: parseIntValue(env.REDIS_PORT, DEFAULT_CONFIG.redis.port),
        password: env.REDIS_PASSWORD ?? DEFAULT_CONFIG.redis.password,
        db: parseIntValue(env.REDIS_DB, DEFAULT_CONFIG.redis.db),
        keyPrefix: env.REDIS_KEY_PREFIX ?? DEFAULT_CONFIG.redis.keyPrefix,
        maxRetriesPerRequest: parseIntValue(
          env.REDIS_MAX_RETRIES,
          DEFAULT_CONFIG.redis.maxRetriesPerRequest,
        ),
        enableOfflineQueue: parseBoolean(
          env.REDIS_ENABLE_OFFLINE_QUEUE,
          DEFAULT_CONFIG.redis.enableOfflineQueue,
        ),
      },
      auth: {
        jwtSecret: env.JWT_SECRET ?? DEFAULT_CONFIG.auth.jwtSecret,
        jwtExpiresIn: env.JWT_EXPIRES_IN ?? DEFAULT_CONFIG.auth.jwtExpiresIn,
        jwtRefreshExpiresIn:
          env.JWT_REFRESH_EXPIRES_IN ?? DEFAULT_CONFIG.auth.jwtRefreshExpiresIn,
        bcryptRounds: parseIntValue(env.BCRYPT_ROUNDS, DEFAULT_CONFIG.auth.bcryptRounds),
      },
      app: {
        name: env.APP_NAME ?? DEFAULT_CONFIG.app.name,
        env: this.parseEnv(env.NODE_ENV, DEFAULT_CONFIG.app.env),
        logLevel: this.parseLogLevel(env.LOG_LEVEL, DEFAULT_CONFIG.app.logLevel),
      },
      cache: {
        enabled: parseBoolean(env.CACHE_ENABLED, DEFAULT_CONFIG.cache.enabled),
        defaultTtl: parseIntValue(env.CACHE_DEFAULT_TTL, DEFAULT_CONFIG.cache.defaultTtl),
        l1MaxSize: parseIntValue(env.CACHE_L1_MAX_SIZE, DEFAULT_CONFIG.cache.l1MaxSize),
        bloomFilterSize: parseIntValue(
          env.CACHE_BLOOM_FILTER_SIZE,
          DEFAULT_CONFIG.cache.bloomFilterSize,
        ),
        bloomFilterHashCount: parseIntValue(
          env.CACHE_BLOOM_FILTER_HASH_COUNT,
          DEFAULT_CONFIG.cache.bloomFilterHashCount,
        ),
      },
    };

    this.loaded = true;
    return this.config;
  }

  /**
   * 解析运行环境，确保返回合法的枚举值
   */
  private parseEnv(
    value: string | undefined,
    defaultValue: AppMetaConfig['env'],
  ): AppMetaConfig['env'] {
    if (value === undefined || value === '') {
      return defaultValue;
    }
    const normalized = value.trim().toLowerCase();
    if (normalized === 'development' || normalized === 'production' || normalized === 'test') {
      return normalized;
    }
    return defaultValue;
  }

  /**
   * 解析日志级别，确保返回合法的枚举值
   */
  private parseLogLevel(
    value: string | undefined,
    defaultValue: AppMetaConfig['logLevel'],
  ): AppMetaConfig['logLevel'] {
    if (value === undefined || value === '') {
      return defaultValue;
    }
    const normalized = value.trim().toLowerCase();
    if (normalized === 'debug' || normalized === 'info' || normalized === 'warn' || normalized === 'error') {
      return normalized;
    }
    return defaultValue;
  }

  /**
   * 获取某块配置（一级字段）
   */
  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    if (!this.loaded) {
      this.load();
    }
    return this.config[key];
  }

  /**
   * 按路径获取配置值
   *
   * @param path 使用点号分隔的路径，如 'postgres.host'
   * @param defaultValue 未找到时返回的默认值
   * @template T 返回值类型
   */
  public getByPath<T>(path: string, defaultValue?: T): T {
    if (!this.loaded) {
      this.load();
    }

    const parts = path.split('.');
    let current: unknown = this.config;

    for (const part of parts) {
      if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
      ) {
        return (defaultValue ?? undefined) as T;
      }
      current = (current as Record<string, unknown>)[part];
    }

    if (current === undefined) {
      return (defaultValue ?? undefined) as T;
    }
    return current as T;
  }

  /**
   * 校验必填字段，返回缺失字段的路径列表
   */
  public validate(): string[] {
    if (!this.loaded) {
      this.load();
    }

    const missing: string[] = [];

    for (const fieldPath of REQUIRED_FIELDS) {
      const value = this.getByPath<unknown>(fieldPath);
      if (value === undefined || value === null || value === '') {
        missing.push(fieldPath);
      }
    }

    return missing;
  }

  /**
   * 当前是否为开发环境
   */
  public isDevelopment(): boolean {
    return this.get('app').env === 'development';
  }

  /**
   * 当前是否为生产环境
   */
  public isProduction(): boolean {
    return this.get('app').env === 'production';
  }

  /**
   * 当前是否为测试环境
   */
  public isTest(): boolean {
    return this.get('app').env === 'test';
  }

  /**
   * 获取完整配置的 JSON 可序列化副本
   */
  public toJSON(): AppConfig {
    if (!this.loaded) {
      this.load();
    }
    return JSON.parse(JSON.stringify(this.config)) as AppConfig;
  }
}

// ============================================================================
// 便捷导出
// ============================================================================

/**
 * 获取完整应用配置（便捷函数）
 */
export function getConfig(): AppConfig {
  return ConfigService.getInstance().toJSON();
}

/**
 * 校验配置必填字段（便捷函数）
 */
export function validateConfig(): string[] {
  return ConfigService.getInstance().validate();
}

// ============================================================================
// 默认导出
// ============================================================================

export default ConfigService;
