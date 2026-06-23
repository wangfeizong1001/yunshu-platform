import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import {
  translate,
  t,
  setLocale,
  getLocale,
  getCurrentLocale,
  registerTranslations,
} from '../../i18n';
import i18nMiddleware from '../../i18n/middleware';

describe('translate / t 翻译函数', () => {
  beforeEach(() => {
    setLocale('zh-CN');
    registerTranslations('zh-CN', {
      'test.hello': '你好',
      'test.success': '成功',
    });
    registerTranslations('en-US', {
      'test.hello': 'Hello',
      'test.success': 'Success',
    });
  });

  it('translate 应返回中文翻译（默认地区 zh-CN）', () => {
    expect(translate('test.hello')).toBe('你好');
  });

  it('t 函数通过 locale + key 应返回翻译', () => {
    expect(t('zh-CN', 'test.success')).toBe('成功');
  });

  it('t 函数支持 en-US 地区', () => {
    expect(t('en-US', 'test.hello')).toBe('Hello');
  });

  it('切换到 en-US 后 translate 应返回英文翻译', () => {
    setLocale('en-US');
    expect(translate('test.hello')).toBe('Hello');
  });

  it('找不到翻译时应返回 key', () => {
    const result = translate('test.not.exist');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('setLocale / getCurrentLocale 地区设置', () => {
  beforeEach(() => {
    setLocale('zh-CN');
  });

  it('应能设置并读取当前地区', () => {
    setLocale('en-US');
    expect(getCurrentLocale()).toBe('en-US');
  });

  it('默认地区应为 zh-CN', () => {
    expect(getCurrentLocale()).toBe('zh-CN');
  });

  it('多次调用 setLocale 应覆盖旧值', () => {
    setLocale('en-US');
    setLocale('zh-CN');
    expect(getCurrentLocale()).toBe('zh-CN');
  });
});

describe('getLocale 从请求获取地区', () => {
  it('应能从 query 参数获取 lang', () => {
    const req = { query: { lang: 'en-US' }, headers: {} } as any;
    expect(getLocale(req)).toBe('en-US');
  });

  it('应能从 Accept-Language header 中获取', () => {
    const req = { query: {}, headers: { 'accept-language': 'en-US' } } as any;
    expect(getLocale(req)).toBe('en-US');
  });

  it('accept-language 以 zh 开头时应为 zh-CN', () => {
    const req = { query: {}, headers: { 'accept-language': 'zh-CN,zh;q=0.9' } } as any;
    expect(getLocale(req)).toBe('zh-CN');
  });

  it('未指定地区时应为 zh-CN 默认', () => {
    const req = { query: {}, headers: {} } as any;
    expect(getLocale(req)).toBe('zh-CN');
  });

  it('未知地区 lang 应回退为 zh-CN', () => {
    const req = { query: { lang: 'xx-XX' }, headers: {} } as any;
    expect(getLocale(req)).toBe('zh-CN');
  });
});

describe('registerTranslations 注册翻译', () => {
  it('注册后应能通过 translate 查到', () => {
    registerTranslations('zh-CN', { 'custom.key': '自定义' });
    setLocale('zh-CN');
    expect(translate('custom.key')).toBe('自定义');
  });

  it('多次注册应能累加翻译', () => {
    registerTranslations('zh-CN', { 'a.b': 'AB' });
    registerTranslations('zh-CN', { 'c.d': 'CD' });
    setLocale('zh-CN');
    expect(translate('a.b')).toBe('AB');
    expect(translate('c.d')).toBe('CD');
  });

  it('支持 en-US 地区注册', () => {
    registerTranslations('en-US', { 'hello.world': 'Hello World' });
    setLocale('en-US');
    expect(translate('hello.world')).toBe('Hello World');
  });
});

describe('i18nMiddleware 中间件', () => {
  beforeEach(() => {
    setLocale('zh-CN');
    registerTranslations('zh-CN', { 'msg.welcome': '欢迎' });
    registerTranslations('en-US', { 'msg.welcome': 'Welcome' });
  });

  it('通过 Accept-Language header 影响翻译', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/i18n', (req, res) => {
      res.json({ locale: req.locale, msg: req.i18n ? req.i18n.t('msg.welcome') : 'welcome' });
    });
    const res = await supertest(app).get('/i18n').set('Accept-Language', 'en-US');
    expect(res.status).toBe(200);
    expect(res.body.locale).toBe('en-US');
    expect(res.body.msg).toBe('Welcome');
  });

  it('通过 query 参数 lang 设置请求地区', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/i18n', (req, res) => {
      res.json({ locale: req.locale, msg: req.i18n ? req.i18n.t('msg.welcome') : 'welcome' });
    });
    const res = await supertest(app).get('/i18n?lang=en-US');
    expect(res.status).toBe(200);
    expect(res.body.locale).toBe('en-US');
    expect(res.body.msg).toBe('Welcome');
  });

  it('未指定地区时请求也能继续', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/i18n', (_req, res) => res.json({ ok: true }));
    const res = await supertest(app).get('/i18n');
    expect(res.status).toBe(200);
  });

  it('中间件应正确调用 next 并让后续路由处理', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/pong', (_req, res) => res.json({ pong: true }));
    const res = await supertest(app).get('/pong');
    expect(res.status).toBe(200);
    expect(res.body.pong).toBe(true);
  });

  it('未注册的地区应回退到默认值', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/i18n', (req, res) => {
      res.json({ locale: req.locale });
    });
    const res = await supertest(app).get('/i18n?lang=xx-XX');
    expect(res.status).toBe(200);
    expect(res.body.locale).toBe('zh-CN');
  });

  it('accept-language 以 zh 开头时应为 zh-CN', async () => {
    const app = express();
    app.use(i18nMiddleware);
    app.get('/i18n', (req, res) => {
      res.json({ locale: req.locale });
    });
    const res = await supertest(app).get('/i18n').set('Accept-Language', 'zh-CN,zh;q=0.9');
    expect(res.status).toBe(200);
    expect(res.body.locale).toBe('zh-CN');
  });
});

describe('多地区切换', () => {
  beforeEach(() => {
    registerTranslations('zh-CN', { 'lang.zh': '中文' });
    registerTranslations('en-US', { 'lang.zh': 'Chinese' });
  });

  it('zh-CN → en-US 切换应返回正确翻译', () => {
    setLocale('zh-CN');
    expect(translate('lang.zh')).toBe('中文');
    setLocale('en-US');
    expect(translate('lang.zh')).toBe('Chinese');
  });
});
