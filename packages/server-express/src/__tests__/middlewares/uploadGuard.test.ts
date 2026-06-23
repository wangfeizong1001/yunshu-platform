import { describe, it, expect } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import multer from 'multer';
import {
  createUploadMiddleware,
  createImageUploadMiddleware,
  createDocumentUploadMiddleware,
  validateUploadMagic,
} from '../../middlewares/uploadGuard';

describe('createUploadMiddleware 创建上传中间件', () => {
  it('应返回一个 multer 实例（具有 single 方法）', () => {
    const upload = createUploadMiddleware({ maxSize: 1024 });
    expect(typeof upload.single).toBe('function');
    expect(typeof upload.array).toBe('function');
  });

  it('应能够处理单个文件上传', async () => {
    const app = express();
    const upload = createUploadMiddleware({
      allowedMimeTypes: ['image/png'],
      maxSize: 1024 * 1024,
    });
    app.post('/upload', upload.single('file'), validateUploadMagic(), (req, res) => {
      res.json({ ok: true, fileName: (req as any).file?.originalname });
    });
    const res = await supertest(app)
      .post('/upload')
      .attach('file', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'test.png');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  }, 10000);

  it('未上传文件时请求也能继续（multer 行为）', async () => {
    const app = express();
    const upload = createUploadMiddleware({ maxSize: 1024 });
    app.post('/upload', upload.single('file'), (_req, res) => {
      res.json({ ok: true });
    });
    const res = await supertest(app).post('/upload');
    expect(res.status).toBe(200);
  }, 10000);
});

describe('createImageUploadMiddleware 图片上传中间件', () => {
  it('应能被创建并具有 single 方法', () => {
    const upload = createImageUploadMiddleware();
    expect(typeof upload.single).toBe('function');
  });

  it('允许 PNG 图片上传', async () => {
    const app = express();
    const upload = createImageUploadMiddleware({ maxSize: 1024 * 1024 });
    app.post('/upload', upload.single('file'), validateUploadMagic(), (req, res) => {
      res.json({ ok: true });
    });
    const res = await supertest(app)
      .post('/upload')
      .attach('file', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'test.png');
    expect(res.status).toBe(200);
  }, 10000);
});

describe('createDocumentUploadMiddleware 文档上传中间件', () => {
  it('应能被创建并具有 single 方法', () => {
    const upload = createDocumentUploadMiddleware();
    expect(typeof upload.single).toBe('function');
  });
});

describe('validateUploadMagic 魔数校验中间件', () => {
  it('不存在 req.file 时也应继续处理', async () => {
    const app = express();
    app.post('/nomagic', validateUploadMagic(), (_req, res) => {
      res.json({ ok: true });
    });
    const res = await supertest(app).post('/nomagic');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  }, 10000);
});

describe('multer 集成', () => {
  it('multer 应作为内部依赖可用', () => {
    expect(typeof multer).toBe('function');
  });
});
