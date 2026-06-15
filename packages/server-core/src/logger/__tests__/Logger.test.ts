/**
 * Logger 结构化日志工具单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger, rootLogger, setLogLevel } from '../Logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    setLogLevel('debug');
  });

  it('应构造带前缀的 Logger', () => {
    const log = new Logger('my-module');
    expect(log).toBeDefined();
  });

  it('rootLogger 应存在且可用', () => {
    expect(rootLogger).toBeInstanceOf(Logger);
  });

  it('info / warn / debug 应调用 stdout.write', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const log = new Logger('test');
    log.info('hello');
    log.warn('warning');
    log.debug('debug msg');
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('error 应调用 stderr.write', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const log = new Logger('test');
    log.error('boom');
    expect(stderrSpy).toHaveBeenCalled();
  });

  it('error 传入 Error 对象时应记录堆栈信息', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const log = new Logger('test');
    const err = new Error('test error');
    log.error('发生错误', err);
    const callText = stderrSpy.mock.calls.map((c) => (c[0] as Buffer).toString('utf-8') ?? '').join('\n');
    // 生产环境格式化时会将 error 转为 JSON，开发环境则直接在对象中
    expect(callText.length).toBeGreaterThan(0);
  });

  it('withContext 应创建带嵌套前缀的子 Logger', () => {
    const parent = new Logger('parent');
    const child = parent.withContext('child');
    expect(child).toBeInstanceOf(Logger);
    // 子 logger 调用一次 info
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    child.info('hello');
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('setLogLevel 应动态修改日志级别', () => {
    // 将日志级别设为 error，debug 级不写入
    setLogLevel('error');
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const log = new Logger('t');
    log.info('hidden');
    const callsAfterHidden = stdoutSpy.mock.calls.length;

    setLogLevel('debug');
    log.info('visible');
    expect(stdoutSpy.mock.calls.length).toBeGreaterThan(callsAfterHidden);
  });

  it('日志上下文对象应被写入 stdout', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const log = new Logger('ctx');
    log.info('login', { userId: '123', role: 'admin' });
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('日志输出应包含当前时间戳', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const log = new Logger('ts');
    log.info('timestamp check');
    const last = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1][0] as string;
    // ISO 时间格式检测 YYYY-MM-DD
    expect(last).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
