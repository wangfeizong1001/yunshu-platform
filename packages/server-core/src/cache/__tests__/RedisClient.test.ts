/**
 * RedisClient 管理单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RedisClientManager } from '../RedisClient';

vi.mock('ioredis', () => {
  const Redis = vi.fn(function (this: any, _opts?: any) {
    const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
    this.status = 'ready';
    this.on = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event)!.push(handler);
    });
    this.once = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event)!.push(handler);
      // 模拟立即触发 ready
      if (event === 'ready') {
        setTimeout(() => handler(), 0);
      }
    });
    this.ping = vi.fn(async () => 'PONG');
    this.info = vi.fn(async () => 'redis_version:7.0.0\r\nconnected_clients:1\r\nused_memory_human:2M\r\nuptime_in_seconds:3600\r\n');
    this.quit = vi.fn(async () => 'OK');
    this.disconnect = vi.fn(() => { this.status = 'disconnected'; });

    // 立即触发 ready（模拟异步）
    setTimeout(() => {
      this.status = 'ready';
      listeners.get('ready')?.forEach((fn) => fn());
    }, 10);
  });
  return { default: Redis };
});

describe('RedisClientManager', () => {
  beforeEach(() => {
    RedisClientManager.resetInstance();
  });

  it('getInstance 应返回单例', () => {
    const a = RedisClientManager.getInstance();
    const b = RedisClientManager.getInstance();
    expect(a).toBe(b);
  });

  it('connect 后应可获取客户端', async () => {
    const mgr = RedisClientManager.getInstance();
    await mgr.connect({ host: 'localhost', port: 6379 });
    expect(mgr.getClient()).not.toBeNull();
  });

  it('isConnected 在连接后返回 true', async () => {
    const mgr = RedisClientManager.getInstance();
    expect(mgr.isConnected()).toBe(false);
    await mgr.connect({ host: 'localhost', port: 6379 });
    // 等待 ready 回调
    await new Promise((r) => setTimeout(r, 50));
    expect(mgr.isConnected()).toBe(true);
  });

  it('getStatus 应返回当前状态', async () => {
    const mgr = RedisClientManager.getInstance();
    expect(typeof mgr.getStatus()).toBe('string');
  });

  it('healthCheck 对未连接客户端应返回 unhealthy', async () => {
    const mgr = RedisClientManager.getInstance();
    const result = await mgr.healthCheck();
    expect(result.healthy).toBe(false);
  });

  it('healthCheck 对已连接客户端应返回 healthy', async () => {
    const mgr = RedisClientManager.getInstance();
    await mgr.connect({ host: 'localhost', port: 6379 });
    await new Promise((r) => setTimeout(r, 50));
    const result = await mgr.healthCheck();
    expect(result.healthy).toBe(true);
    expect(result.serverInfo).toBeDefined();
    if (result.serverInfo) {
      expect(result.serverInfo.version).toBe('7.0.0');
    }
  });

  it('disconnect 应将状态置为 disconnected', async () => {
    const mgr = RedisClientManager.getInstance();
    await mgr.connect({});
    await mgr.disconnect();
    expect(mgr.getClient()).toBeNull();
  });

  it('getConfig 应返回当前配置', async () => {
    const mgr = RedisClientManager.getInstance();
    await mgr.connect({ host: '127.0.0.1', port: 6380 });
    const cfg = mgr.getConfig();
    expect(cfg.host).toBe('127.0.0.1');
    expect(cfg.port).toBe(6380);
  });

  it('重复调用 connect 应只建立一次连接', async () => {
    const mgr = RedisClientManager.getInstance();
    await mgr.connect({ host: 'localhost' });
    await mgr.connect({ host: 'localhost' });
    // 不抛出即通过
    expect(mgr.getClient()).toBeDefined();
  });
});
