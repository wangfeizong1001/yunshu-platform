/**
 * 云枢中台 — 文件上传安全守卫中间件
 *
 * 基于 multer 构建：
 *  1. MIME 类型白名单校验（防止恶意扩展名伪造）
 *  2. 文件大小限制（默认 10 MB）
 *  3. 扩展名与 MIME 二次校验
 *  4. 对非法文件抛出 BusinessError
 *
 * 使用方式：
 *   import { createUploadMiddleware } from '@yunshu/server-express/middlewares';
 *   const upload = createUploadMiddleware({ maxSize: 5 * 1024 * 1024 });
 *   app.post('/upload', upload.single('file'), handler);
 *
 * @module @yunshu/server-express/middlewares/uploadGuard
 */

import multer, { type Multer, type Options as MulterOptions } from 'multer';
import type { Request } from 'express';
import { BusinessError, ErrorCode } from '@yunshu/server-core';

// --------------------------------------------------------------------------
// 安全配置
// --------------------------------------------------------------------------

/** 默认文件大小限制：10 MB */
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

/** 允许的 MIME 类型白名单 */
const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
  // 图片
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
  // 文档
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  // 纯文本
  'text/plain',
  'text/csv',
  // 压缩包
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/gzip',
]);

/** MIME → 允许扩展名映射 */
const MIME_TO_EXT: Readonly<Record<string, readonly string[]>> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/msword': ['.doc'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/gzip': ['.gz', '.gzip'],
};

export interface UploadMiddlewareOptions {
  /** 文件大小限制（字节），默认 10MB */
  maxSize?: number;
  /** 额外允许的 MIME 类型，会与默认白名单合并 */
  extraMimeTypes?: string[];
  /** 存储策略（默认 memoryStorage） */
  storage?: MulterOptions['storage'];
  /** 同时上传文件数上限（默认 5） */
  maxFiles?: number;
}

// --------------------------------------------------------------------------
// 工具
// --------------------------------------------------------------------------

function matchesAllowedExt(filename: string, allowedExts: readonly string[]): boolean {
  const lower = filename.toLowerCase();
  return allowedExts.some((ext) => lower.endsWith(ext));
}

// --------------------------------------------------------------------------
// 工厂
// --------------------------------------------------------------------------

/** 创建上传守卫实例，返回 multer 对象（可 .single/.array/.fields/.none/.any） */
export function createUploadMiddleware(options: UploadMiddlewareOptions = {}): Multer {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    extraMimeTypes = [],
    storage = multer.memoryStorage(),
    maxFiles = 5,
  } = options;

  const allowedMimes = new Set<string>([...ALLOWED_MIME_TYPES, ...extraMimeTypes]);

  return multer({
    storage,
    limits: { fileSize: maxSize, files: maxFiles },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const mimeType = file.mimetype;
      const filename = file.originalname;

      // 1) MIME 白名单
      if (!allowedMimes.has(mimeType)) {
        return cb(
          new BusinessError(ErrorCode.FILE_TYPE_NOT_SUPPORTED, '不支持的文件类型', {
            mimeType,
            filename,
          }),
        );
      }

      // 2) 扩展名 → MIME 二次校验
      const allowedExts = MIME_TO_EXT[mimeType];
      if (allowedExts && !matchesAllowedExt(filename, allowedExts)) {
        return cb(
          new BusinessError(ErrorCode.FILE_EXTENSION_MISMATCH, '文件扩展名与内容类型不匹配', {
            mimeType,
            filename,
            expectedExtensions: allowedExts,
          }),
        );
      }

      return cb(null, true);
    },
  });
}

/** 便捷默认实例 */
export const defaultUpload: Multer = createUploadMiddleware();
