/**
 * 云枢中台 — JWT 与密码哈希工具
 *
 * 为避免第三方依赖，本模块使用 Node.js 内置 crypto 模块实现：
 *   1. 简化版 JWT 签名/验证（HS256 / HMAC-SHA256）
 *   2. 加密安全的随机字符串生成
 *   3. 基于 crypto.scrypt 的密码哈希与比对
 *
 * 若后续升级到完整 jwt 库，只需保留对外 API 签名即可平滑替换。
 *
 * @module @yunshu/server-core/utils/jwt
 */

import crypto from 'node:crypto';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * JWT 头部（固定为 HS256）
 */
interface JWTHeader {
  /** 签名算法 */
  alg: 'HS256';
  /** 令牌类型 */
  typ: 'JWT';
}

/**
 * JWT 标准声明集（私有声明以 Record 形式扩展）
 */
interface JWTPayloadBase {
  /** 签发时间（秒） */
  iat?: number;
  /** 过期时间（秒） */
  exp?: number;
  /** 生效时间（秒） */
  nbf?: number;
  /** 签发者 */
  iss?: string;
  /** 主题 */
  sub?: string;
  /** 受众（单值或数组） */
  aud?: string | string[];
  /** 令牌唯一 ID */
  jti?: string;
}

/** JWT Payload 类型 — 合并标准声明与用户自定义声明 */
export type JWTPayload = JWTPayloadBase & Record<string, unknown>;

/**
 * signToken 选项
 */
export interface SignOptions {
  /** 过期时间（秒）或 zeit/ms 风格字符串如 "7d" */
  expiresIn?: number | string;
  /** 签发者 */
  issuer?: string;
  /** 主题 */
  subject?: string;
  /** 受众 */
  audience?: string | string[];
  /** 是否自动添加 iat，默认 true */
  noTimestamp?: boolean;
}

/**
 * verifyToken 校验选项
 */
export interface VerifyOptions {
  /** 期望的签发者（iss claim），如 'yunshu-api' */
  issuer?: string | string[];
  /** 期望的受众（aud claim） */
  audience?: string | string[];
  /** 必填 subject */
  subject?: string;
  /** 允许的时钟偏移（秒），默认 0 */
  clockTolerance?: number;
  /** 是否忽略过期时间，测试用 */
  ignoreExpiration?: boolean;
  /** 是否强制要求 exp 声明，默认 true */
  requireExpiration?: boolean;
}

// ============================================================================
// 内部工具：Base64URL（RFC 4648 §5）
// ============================================================================

/**
 * 将 Buffer 编码为 Base64URL 字符串
 */
function base64UrlEncode(input: Buffer): string {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * 将 Base64URL 字符串解码为 Buffer；失败返回空 Buffer 由调用方处理。
 */
function base64UrlDecode(input: string): Buffer {
  if (!input) return Buffer.alloc(0);
  let padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  if (pad) padded += '='.repeat(4 - pad);
  return Buffer.from(padded, 'base64');
}

// ============================================================================
// 内部工具：时间解析
// ============================================================================

/**
 * 将 expiresIn 值解析为秒数。
 * 支持：number（秒）、"120" 字符串数字、"2d" / "3h" / "30m" / "60s"。
 */
function parseExpiresIn(value: number | string | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Math.floor(value);

  const num = Number(value);
  if (!Number.isNaN(num)) return Math.floor(num);

  const match = /^(\d+)\s*(ms|s|m|h|d|w|y)?$/.exec(String(value).trim());
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2] ?? 's';
  const multipliers: Record<string, number> = {
    ms: 0.001,
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31536000,
  };
  return Math.floor(amount * (multipliers[unit] ?? 1));
}

// ============================================================================
// signToken：签发 JWT
// ============================================================================

/**
 * 签发 JWT（HS256）。
 *
 * @param payload  载荷对象（会被序列化为 JSON）
 * @param secret   签名密钥（建议通过 generateSecureSecret 生成 64 位以上）
 * @param options  签发选项
 * @returns        JWT 字符串（header.payload.signature）
 *
 * @example
 * ```ts
 * const token = signToken({ userId: '1001', role: 'admin' }, JWT_SECRET, {
 *   expiresIn: '7d',
 * });
 * ```
 */
export function signToken(
  payload: object,
  secret: string,
  options: SignOptions = {},
): string {
  const header: JWTHeader = { alg: 'HS256', typ: 'JWT' };

  // 构建 payload
  const now = Math.floor(Date.now() / 1000);
  const claims: JWTPayload = { ...(payload as JWTPayload) };

  if (!options.noTimestamp) claims.iat = now;
  if (options.issuer) claims.iss = options.issuer;
  if (options.subject) claims.sub = options.subject;
  if (options.audience) claims.aud = options.audience;

  const expireSeconds = parseExpiresIn(options.expiresIn);
  if (expireSeconds !== null && expireSeconds > 0) {
    claims.exp = now + expireSeconds;
  }

  // 编码
  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header), 'utf8'));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(claims), 'utf8'));
  const signingInput = `${headerB64}.${payloadB64}`;

  // HMAC-SHA256 签名
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingInput, 'utf8')
    .digest();
  const signatureB64 = base64UrlEncode(signature);

  return `${signingInput}.${signatureB64}`;
}

// ============================================================================
// verifyToken：验证 JWT
// ============================================================================

/**
 * 从 token 中安全地提取三段字符串；失败返回 null。
 */
function safeJwtParts(token: string): [string, string, string] | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [a, b, c] = parts;
  if (!a || !b || !c) return null;
  return [a, b, c];
}

/**
 * 验证 JWT 签名、过期时间并返回 payload。
 *
 * @param token    JWT 字符串
 * @param secret   签名密钥
 * @param options  校验选项（issuer/audience/subject/clockTolerance 等）
 * @returns        解析后的 payload 对象；失败返回 null
 *
 * @example
 * ```ts
 * const payload = verifyToken<{ userId: string }>(token, JWT_SECRET, {
 *   issuer: 'yunshu-api',
 *   audience: 'web-client',
 * });
 * if (!payload) { /* 拒绝访问 *\/ }
 * ```
 */
export function verifyToken<T = JWTPayload>(
  token: string,
  secret: string,
  options: VerifyOptions = {},
): T | null {
  if (typeof token !== 'string' || !token) return null;

  const {
    issuer,
    audience,
    subject,
    clockTolerance = 0,
    ignoreExpiration = false,
    requireExpiration = true,
  } = options;

  const parts = safeJwtParts(token);
  if (!parts) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  try {
    // 1) 校验签名
    const signingInput = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(signingInput, 'utf8')
      .digest();
    const actualSig = base64UrlDecode(signatureB64);

    if (expectedSig.length !== actualSig.length) return null;
    if (!crypto.timingSafeEqual(expectedSig, actualSig)) return null;

    // 2) 解析 header
    const header = JSON.parse(
      base64UrlDecode(headerB64).toString('utf8'),
    ) as JWTHeader;
    if (header.alg !== 'HS256') return null;

    // 3) 解析 payload
    const payload = JSON.parse(
      base64UrlDecode(payloadB64).toString('utf8'),
    ) as JWTPayload;

    // 4) 过期时间 / iat 校验
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number') {
      if (requireExpiration) return null;
    } else if (!ignoreExpiration && payload.exp <= now - clockTolerance) {
      return null;
    }
    if (typeof payload.iat === 'number' && payload.iat > now + clockTolerance) {
      return null;
    }
    if (typeof payload.nbf === 'number' && payload.nbf > now + clockTolerance) return null;

    // 5) iss / aud / sub 声明校验
    if (issuer !== undefined) {
      const expectedIssuers = Array.isArray(issuer) ? issuer : [issuer];
      if (typeof payload.iss !== 'string' || !expectedIssuers.includes(payload.iss)) {
        return null;
      }
    }
    if (audience !== undefined) {
      const expectedAudiences = Array.isArray(audience) ? audience : [audience];
      const payloadAudiences = Array.isArray(payload.aud)
        ? payload.aud
        : typeof payload.aud === 'string'
          ? [payload.aud]
          : [];
      const hasMatch = expectedAudiences.some((a) => payloadAudiences.includes(a));
      if (!hasMatch) return null;
    }
    if (subject !== undefined && payload.sub !== subject) {
      return null;
    }

    return payload as T;
  } catch {
    // 任何解析 / 加密错误均视为无效
    return null;
  }
}

// ============================================================================
// decodeToken：仅解析 payload（不验证签名）
// ============================================================================

/**
 * 仅解码 JWT payload，不做签名和过期校验。
 * 适用于在未验证前需要读取部分声明的场景。
 *
 * @deprecated 使用 decodeTokenUnsafe 明确声明风险——此方法不验证签名，结果可能被篡改。
 */
export function decodeToken<T = JWTPayload>(token: string): T | null {
  return decodeTokenUnsafe<T>(token);
}

/**
 * 仅解码 JWT payload，不做签名和过期校验。明确命名以提示调用方注意安全风险。
 */
export function decodeTokenUnsafe<T = JWTPayload>(token: string): T | null {
  if (typeof token !== 'string') return null;
  const parts = safeJwtParts(token);
  if (!parts) return null;
  try {
    const [, payloadB64] = parts;
    return JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as T;
  } catch {
    return null;
  }
}

// ============================================================================
// generateSecureSecret：生成加密安全随机字符串
// ============================================================================

/**
 * 生成加密安全的随机字符串（字母数字 + 符号）。
 * 可作为 JWT_SECRET、会话密钥、一次性 token 等使用。
 *
 * @param length  输出字符串长度，默认 64
 * @param urlSafe 是否生成 URL 友好的字符集（A-Za-z0-9_-），默认 false
 */
export function generateSecureSecret(length = 64, urlSafe = false): string {
  const chars = urlSafe
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  const maxByte = 256 - (256 % chars.length); // 均匀分布上限
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    let b: number | undefined = bytes[i];
    // 拒绝采样：避免偏置
    while (b === undefined || b >= maxByte) {
      b = crypto.randomBytes(1)[0];
    }
    result += chars[b % chars.length];
  }
  return result;
}

// ============================================================================
// hashPassword / comparePassword：密码哈希（基于 crypto.scrypt）
// ============================================================================

/**
 * 默认 scrypt 参数 — 参考 OWASP 建议的 2024 算力水平
 */
const SCRYPT_PARAMS = {
  /** 内存 cost，必须为 2 的幂 */
  N: 16384,
  /** 块大小 */
  r: 8,
  /** 并行度 */
  p: 1,
  /** 派生 key 长度 */
  keyLen: 32,
  /** 每 salt 字节数 */
  saltLen: 16,
} as const;

/**
 * 序列化哈希结果为单一字符串：`$scrypt$N$r$p$salt_b64$key_b64`。
 * 便于未来升级参数时向后兼容。
 */
function serializeHash(salt: Buffer, key: Buffer): string {
  const { N, r, p } = SCRYPT_PARAMS;
  const saltB64 = base64UrlEncode(salt);
  const keyB64 = base64UrlEncode(key);
  return `$scrypt$${N}$${r}$${p}$${saltB64}$${keyB64}`;
}

interface ParsedHash {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  key: Buffer;
}

/**
 * 从字符串反序列化出参数、salt、key；失败返回 null。
 */
function deserializeHash(hash: string): ParsedHash | null {
  const parts = hash.split('$');
  // ["", "scrypt", N, r, p, salt, key] 期望 7 段
  if (parts.length !== 7 || parts[1] !== 'scrypt') return null;
  try {
    const N = Number(parts[2]);
    const r = Number(parts[3]);
    const p = Number(parts[4]);
    if (!N || !r || !p) return null;
    const salt = base64UrlDecode(parts[5] ?? '');
    const key = base64UrlDecode(parts[6] ?? '');
    if (!salt.length || !key.length) return null;
    return { N, r, p, salt, key };
  } catch {
    return null;
  }
}

/**
 * 生成密码哈希（异步，使用 scrypt + 随机 salt）。
 *
 * @param password   原始密码
 * @param _saltRounds 保留参数，与 bcrypt API 兼容；scrypt 下不使用
 * @returns          可持久化的 hash 字符串
 */
export function hashPassword(
  password: string,
  _saltRounds = 10,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SCRYPT_PARAMS.saltLen);
    crypto.scrypt(
      password,
      salt,
      SCRYPT_PARAMS.keyLen,
      { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p },
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(serializeHash(salt, derivedKey));
      },
    );
  });
}

/**
 * 比对明文密码与已保存的哈希。
 * 使用恒定时间比较 + 原 hash 中记录的参数，以便未来修改 SCRYPT_PARAMS
 * 后仍可向后兼容旧密码。
 */
export function comparePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const params = deserializeHash(hash);
    if (!params) {
      resolve(false);
      return;
    }
    crypto.scrypt(
      password,
      params.salt,
      params.key.length,
      { N: params.N, r: params.r, p: params.p },
      (err, derivedKey) => {
        if (err) {
          resolve(false);
          return;
        }
        if (derivedKey.length !== params.key.length) {
          resolve(false);
          return;
        }
        resolve(crypto.timingSafeEqual(derivedKey, params.key));
      },
    );
  });
}

// ============================================================================
// 便捷函数：从 Bearer 头中提取 token
// ============================================================================

/**
 * 从 Authorization 请求头中解析 Bearer Token。
 *
 * @param header  "Authorization" 头值，如 "Bearer xxx.yyy.zzz"
 * @returns       token 字符串；未提供或格式错误返回 null
 */
export function extractBearerToken(header: string | undefined | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match ? (match[1] ?? null) : null;
}
