/**
 * ConfigService 配置管理单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import ConfigService from '../ConfigService';

describe('ConfigService', () => {
  beforeEach(() => {
    ConfigService.resetInstance();
  });

  it('getInstance 应返回单例', () => {
    const a = ConfigService.getInstance();
    const b = ConfigService.getInstance();
    expect(a).toBe(b);
  });

  it('应支持从传入环境变量初始化', () => {
    const svc = new ConfigService({
      NODE_ENV: 'test',
      PORT: '8080',
      HOST: '0.0.0.0',
    });
    const cfg = svc.load();
    expect(cfg.server.port).toBe(8080);
    expect(cfg.server.host).toBe('0.0.0.0');
  });

  it('get 应返回指定根节点配置', () => {
    const svc = new ConfigService({ NODE_ENV: 'development' });
    const server = svc.get('server');
    expect(typeof server).toBe('object');
    expect(server).toHaveProperty('port');
    expect(server).toHaveProperty('host');
  });

  it('getByPath 应按点号路径获取嵌套值', () => {
    const svc = new ConfigService({ NODE_ENV: 'test' });
    const port = svc.getByPath<number>('server.port');
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
  });

  it('getByPath 在路径不存在时应返回默认值', () => {
    const svc = new ConfigService({});
    const val = svc.getByPath<string>('non.existent.path', 'default-value');
    expect(val).toBe('default-value');
  });

  it('validate 应返回验证问题列表（空数组表示通过）', () => {
    const svc = new ConfigService({ NODE_ENV: 'test' });
    const issues = svc.validate();
    expect(Array.isArray(issues)).toBe(true);
  });

  it('isDevelopment / isProduction / isTest 应与 NODE_ENV 匹配', () => {
    const dev = new ConfigService({ NODE_ENV: 'development' });
    const prod = new ConfigService({ NODE_ENV: 'production' });
    const test = new ConfigService({ NODE_ENV: 'test' });
    expect(dev.isDevelopment()).toBe(true);
    expect(dev.isProduction()).toBe(false);
    expect(dev.isTest()).toBe(false);

    expect(prod.isProduction()).toBe(true);
    expect(prod.isDevelopment()).toBe(false);

    expect(test.isTest()).toBe(true);
  });

  it('toJSON 应返回可序列化的配置对象', () => {
    const svc = new ConfigService({ NODE_ENV: 'test' });
    const json = svc.toJSON();
    expect(typeof json).toBe('object');
    expect(json).not.toBeNull();
    expect(() => JSON.stringify(json)).not.toThrow();
  });

  it('load 多次调用应返回相同对象', () => {
    const svc = new ConfigService({});
    const a = svc.load();
    const b = svc.load();
    expect(a).toEqual(b);
  });

  it('assertValid 不应在正常配置下抛出异常', () => {
    const svc = new ConfigService({ NODE_ENV: 'test' });
    expect(() => svc.assertValid(false)).not.toThrow();
  });
});
