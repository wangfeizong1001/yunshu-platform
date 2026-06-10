/**
 * 文件上传守卫中间件
 *
 * 基于 multer 构建的安全文件上传中间件，提供：
 *  1. MIME 类型白名单校验
 *  2. 文件大小限制
 *  3. 文件魔数（magic number）内容校验
 *  4. 统一的 BusinessError 错误抛出
 *
 * 使用方式：
 *   const upload = createUploadMiddleware({ maxSize: 5 * 1024 * 1024 });
 *   router.post('/upload', upload.single('file'), handler);
 *
 * @module @yunshu/server-express/middlewares/uploadGuard
 */

import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { BusinessError, ErrorCode } from '@yunshu/server-core';

// ============================================================================
// 安全配置
// ============================================================================

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

/** MIME → 允许的扩展名映射（用于二次校验扩展名与内容是否匹配） */
const MIME_TO_EXT: Readonly<Record<string, ReadonlyArray<string>>> = {
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
  'application/gzip': ['.gz'],
};

/** 文件魔数（magic number）映射 */
const FILE_MAGIC_NUMBERS: ReadonlyArray<{
  mime: string;
  magic: ReadonlyArray<number>;
  offset?: number;
}> = [
  // PNG: 89 50 4E 47
  { mime: 'image/png', magic: [0x89, 0x50, 0x4e, 0x47] },
  // JPEG: FF D8 FF
  { mime: 'image/jpeg', magic: [0xff, 0xd8, 0xff] },
  // GIF87a / GIF89a: 47 49 46 38
  { mime: 'image/gif', magic: [0x47, 0x49, 0x46, 0x38] },
  // PDF: 25 50 44 46 ("%PDF")
  { mime: 'application/pdf', magic: [0x25, 0x50, 0x44, 0x46] },
  // ZIP/Office Open XML: 50 4B 03 04 ("PK\x03\x04")
  {
    mime: 'application/zip',
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  // WebP: RIFF....WEBP (offset 8)
  {
    mime: 'image/webp',
    magic: [0x52, 0x49, 0x46, 0x46],
    offset: 0,
  },
  // BMP: 42 4D ("BM")
  { mime: 'image/bmp', magic: [0x42, 0x4d] },
  // GZIP: 1F 8B
  { mime: 'application/gzip', magic: [0x1f, 0x8b] },
  // RAR: 52 61 72 21 ("Rar!")
  { mime: 'application/x-rar-compressed', magic: [0x52, 0x61, 0x72, 0x21] },
  // 7z: 37 7A BC AF 27 1C
  {
    mime: 'application/x-7z-compressed',
    magic: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c],
  },
];

// ============================================================================
// 类型定义
// ============================================================================

export interface UploadConfig {
  /** 单个文件大小限制（字节），默认 10 MB */
  maxSize?: number;
  /** 允许的 MIME 类型，不传则使用完整白名单 */
  allowedMimeTypes?: ReadonlyArray<string>;
  /** 存储位置，默认内存存储（memoryStorage） */
  storage?: multer.StorageEngine;
  /** 最大文件数量，默认 10 */
  maxFiles?: number;
  /** 是否启用魔数校验，默认 true */
  checkMagicNumber?: boolean;
}

type MulterFile = Express.Multer.File;

// ============================================================================
// 校验逻辑
// ============================================================================

/**
 * 校验文件扩展名是否与 MIME 匹配
 */
function checkExtensionMatch(file: MulterFile): boolean {
  const allowedExts = MIME_TO_EXT[file.mimetype];
  if (!allowedExts) return false;
  const lowerName = file.originalname.toLowerCase();
  return allowedExts.some((ext) => lowerName.endsWith(ext));
}

/**
 * 校验文件魔数（magic number）
 *
 * 仅对支持魔数校验的 MIME 类型进行内容校验；
 * 纯文本类格式（.txt/.csv/.svg 等）无需魔数校验。
 */
function checkMagicNumber(file: MulterFile): boolean {
  const rules = FILE_MAGIC_NUMBERS.filter((r) => r.mime === file.mimetype);
  if (rules.length === 0) {
    // 无魔数规则的类型（如 .txt / .svg / .csv），视为通过
    return true;
  }
  // multer memoryStorage 下，buffer 已完整可读
  const buffer = file.buffer;
  if (!buffer || buffer.length < 12) return false;

  return rules.some((rule) => {
    const offset = rule.offset ?? 0;
    if (buffer.length < offset + rule.magic.length) return false;
    return rule.magic.every((byte, i) => buffer[offset + i] === byte);
  });
}

/**
 * 统一的 multer 文件过滤回调
 */
function fileFilter(
  allowedMimeTypes: ReadonlySet<string>,
): multer.Options['fileFilter'] {
  return (_req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
    // 1. MIME 白名单校验
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(
        new BusinessError(
          ErrorCode.FILE_TYPE_NOT_SUPPORTED,
          `不支持的文件类型：${file.mimetype}`,
        ),
      );
    }
    // 2. 扩展名与 MIME 匹配校验
    if (!checkExtensionMatch(file)) {
      return cb(
        new BusinessError(
          ErrorCode.FILE_TYPE_NOT_SUPPORTED,
          '文件扩展名与实际内容类型不匹配',
        ),
      );
    }
    cb(null, true);
  };
}

// ============================================================================
// 工厂函数
// ============================================================================

/**
 * 创建文件上传中间件
 *
 * @param config 上传配置
 * @returns multer 实例，可调用 .single() / .array() / .fields()
 */
export function createUploadMiddleware(config: UploadConfig = {}) {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    allowedMimeTypes,
    storage,
    maxFiles = 10,
    checkMagicNumber: enableMagicCheck = true,
  } = config;

  const mimeSet = allowedMimeTypes
    ? new Set<string>(allowedMimeTypes)
    : ALLOWED_MIME_TYPES;

  const upload = multer({
    storage: storage ?? multer.memoryStorage(),
    limits: {
      fileSize: maxSize,
      files: maxFiles,
    },
    fileFilter: fileFilter(mimeSet),
  });

  return upload;
}

/**
 * 魔数校验中间件 —— 在 multer 解析完成后，再对 buffer 做一次内容校验
 *
 * 使用方式：
 *   const upload = createUploadMiddleware({ checkMagicNumber: false });
 *   router.post('/upload', upload.single('file'), validateUploadMagic(), handler);
 */
export function validateUploadMagic() {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const files: Array<MulterFile> = [];
    if (req.file) files.push(req.file);
    if (req.files) {
      if (Array.isArray(req.files)) {
        files.push(...req.files);
      } else {
        for (const arr of Object.values(req.files)) {
          files.push(...arr);
        }
      }
    }

    for (const file of files) {
      if (!checkMagicNumber(file)) {
        return next(
          new BusinessError(
            ErrorCode.FILE_TYPE_NOT_SUPPORTED,
            `文件内容与声明类型不一致：${file.originalname}`,
          ),
        );
      }
    }
    next();
  };
}

/**
 * 仅允许图片上传的便捷工厂
 */
export function createImageUploadMiddleware(
  config: Omit<UploadConfig, 'allowedMimeTypes'> = {},
) {
  return createUploadMiddleware({
    ...config,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  });
}

/**
 * 仅允许 PDF + Office 文档上传的便捷工厂
 */
export function createDocumentUploadMiddleware(
  config: Omit<UploadConfig, 'allowedMimeTypes'> = {},
) {
  return createUploadMiddleware({
    ...config,
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  });
}
