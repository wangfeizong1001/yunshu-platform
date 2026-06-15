/**
 * jwt / password 工具单元测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signToken,
  verifyToken,
  decodeToken,
  decodeTokenUnsafe,
  generateSecureSecret,
  hashPassword,
  comparePassword,
  extractBearerToken,
} from '../jwt';

describe('JWT 工具', () => {
  const secret = 'test-secret-key';

  it('signToken 应生成三段式 token', () => {
    const token = signToken({ sub: 'user-1' }, secret, { expiresIn: '1h' });
    expect(typeof token).toBe('string');
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
    expect(parts[0].length).toBeGreaterThan(0);
  });

  it('verifyToken 对正确签名的 token 应返回 payload', () => {
    const token = signToken({ sub: 'user-1', role: 'admin' }, secret, {
      expiresIn: '1h',
    });
    const payload = verifyToken(token, secret);
    expect(payload).not.toBeNull();
    if (payload) {
      expect(payload.sub).toBe('user-1');
      expect(payload.role).toBe('admin');
    }
  });

  it('verifyToken 对错误密钥应返回 null', () => {
    const token = signToken({ sub: 'x' }, secret, { expiresIn: '1h' });
    const payload = verifyToken(token, 'wrong-secret');
    expect(payload).toBeNull();
  });

  it('verifyToken 对过期 token 应返回 null', async () => {
    const token = signToken({ sub: 'x' }, secret, { expiresIn: '1h' });
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 3 * 60 * 60 * 1000);
    const payload = verifyToken(token, secret);
    vi.useRealTimers();
    expect(payload).toBeNull();
  });

  it('verifyToken 对无效 token 字符串应返回 null', () => {
    expect(verifyToken('not.a.token', secret)).toBeNull();
    expect(verifyToken('', secret)).toBeNull();
    expect(verifyToken('a.b', secret)).toBeNull();
  });

  it('decodeToken 应返回 payload（不验证签名）', () => {
    const token = signToken({ sub: '123' }, secret);
    const payload = decodeToken(token);
    expect(payload).not.toBeNull();
  });

  it('decodeTokenUnsafe 应直接返回 JSON 内容', () => {
    const token = signToken({ id: 'abc' }, secret);
    const payload = decodeTokenUnsafe(token);
    expect(payload).not.toBeNull();
  });

  it('generateSecureSecret 应生成长度合理的随机字符串', () => {
    const s = generateSecureSecret(64);
    expect(typeof s).toBe('string');
    expect(s.length).toBeGreaterThanOrEqual(64);

    const s2 = generateSecureSecret(32, true);
    expect(s2.length).toBeGreaterThanOrEqual(32);
  });

  it('两个连续生成的 secret 不应相同', () => {
    const a = generateSecureSecret(32);
    const b = generateSecureSecret(32);
    expect(a).not.toBe(b);
  });

  it('hashPassword 应生成稳定可比较的密码哈希', async () => {
    const hash1 = await hashPassword('my-password');
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
    // 相同密码再次哈希应得到不同结果（含随机 salt）
    const hash2 = await hashPassword('my-password');
    expect(hash1).not.toBe(hash2);
  });

  it('comparePassword 对正确密码应返回 true，错误密码返回 false', async () => {
    const hash = await hashPassword('correct-password');
    const ok = await comparePassword('correct-password', hash);
    expect(ok).toBe(true);
    const fail = await comparePassword('wrong-password', hash);
    expect(fail).toBe(false);
  });

  it('comparePassword 使用不同算法 / 原始字符串不应抛异常', async () => {
    const result = await comparePassword('x', 'not-a-valid-hash');
    expect(result).toBe(false);
  });

  it('extractBearerToken 应提取 Bearer token 或 null', () => {
    expect(extractBearerToken('Bearer my-token')).toBe('my-token');
    expect(extractBearerToken('bearer my-token')).toBe('my-token');
    expect(extractBearerToken('Basic xyz')).toBeNull();
    expect(extractBearerToken('')).toBeNull();
    expect(extractBearerToken(null)).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
  });
});
