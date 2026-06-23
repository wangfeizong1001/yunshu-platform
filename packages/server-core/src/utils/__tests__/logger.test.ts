/**
 * 轻量级 logger 工具单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import logger from '../logger';

describe('轻量 logger', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logger.setLevel('debug');
  });

  it('info/warn/debug 应写入 stdout', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('info msg');
    logger.warn('warn msg');
    logger.debug('debug msg');
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('error/fatal 应写入 stderr', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logger.error('error msg');
    logger.fatal('fatal msg');
    expect(stderrSpy).toHaveBeenCalled();
  });

  it('setLevel 应过滤低级别的日志', () => {
    logger.setLevel('error');
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('hidden');
    const callsAfterHidden = stdoutSpy.mock.calls.length;
    logger.setLevel('debug');
    logger.info('visible');
    expect(stdoutSpy.mock.calls.length).toBeGreaterThan(callsAfterHidden);
  });

  it('应脱敏敏感字段（password / secret 等）', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('login', { password: 'top-secret', token: 'bearer-abc' });
    const last = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1][0] as string;
    expect(last).not.toContain('top-secret');
    expect(last).not.toContain('bearer-abc');
    expect(last).toContain('[REDACTED]');
  });

  it('应正确记录 Error 对象信息', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const err = new Error('boom');
    logger.error('server error', err);
    const last = stderrSpy.mock.calls[stderrSpy.mock.calls.length - 1][0] as string;
    expect(last).toContain('boom');
    expect(last).toContain('stack');
  });

  it('日志输出应包含 ISO 时间戳与 level 字段', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('with ts');
    const last = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1][0] as string;
    expect(last).toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(last).toContain('"level":"info"');
  });

  it('日志输出应包含 pid', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('with pid');
    const last = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1][0] as string;
    expect(last).toContain(String(process.pid));
  });

  it('嵌套对象中的敏感字段也应被脱敏', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('nested', { user: { password: 'secret', name: 'alice' } });
    const last = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1][0] as string;
    expect(last).not.toContain('secret');
    expect(last).toContain('alice');
  });

  it('传入非对象 context 应安全记录', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('raw', 42);
    logger.info('raw2', 'string-value');
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('数组 context 应正常记录', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('items', ['apple', 'banana']);
    expect(stdoutSpy).toHaveBeenCalled();
  });
});
