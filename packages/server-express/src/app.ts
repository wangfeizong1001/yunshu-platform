/**
 * 云枢中台 — Express 应用主入口
 *
 * 组装所有中间件与路由，导出 createApp() 供生产环境和测试复用。
 *
 * @module @yunshu/server-express/app
 */

import crypto from 'node:crypto';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/errorHandler';
import { createRouter } from './routes';

// ============================================================================
// 应用工厂
// ============================================================================

/**
 * 创建 Express 应用实例
 *
 * @param options 应用配置
 */
export function createApp(options: {
  corsOrigin?: string | string[] | boolean;
  trustProxy?: boolean;
  apiPrefix?: string;
} = {}): Express {
  const {
    corsOrigin = '*',
    trustProxy = true,
    apiPrefix = '/api',
  } = options;

  const app: Express = express();

  // --------------------------------------------------------------------------
  // 基础中间件
  // --------------------------------------------------------------------------
  app.set('trust proxy', trustProxy);
  app.use(cors({ origin: corsOrigin, credentials: true }));

  // 请求 ID：为每个请求分配唯一 requestId，用于日志追踪与问题定位
  app.use((req: Request, _res: Response, next) => {
    (req as any).requestId = crypto.randomUUID();
    next();
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --------------------------------------------------------------------------
  // 请求日志
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'test') {
    app.use((req: Request, _res: Response, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  // --------------------------------------------------------------------------
  // 健康检查
  // --------------------------------------------------------------------------
  app.get(`${apiPrefix}/health`, (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      requestId: (req as any).requestId,
    });
  });

  // --------------------------------------------------------------------------
  // 根路由信息
  // --------------------------------------------------------------------------
  app.get(apiPrefix, (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: '云枢中台 API 服务已就绪',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      endpoints: {
        health: `${apiPrefix}/health`,
      },
    });
  });

  // --------------------------------------------------------------------------
  // 路由注册
  // --------------------------------------------------------------------------
  const router = createRouter();
  app.use(apiPrefix, router);

  // --------------------------------------------------------------------------
  // 404 处理
  // --------------------------------------------------------------------------
  app.use(notFoundHandler());

  // --------------------------------------------------------------------------
  // 全局错误处理（必须是最后一个中间件）
  // --------------------------------------------------------------------------
  app.use(globalErrorHandler());

  return app;
}

/**
 * 创建并启动 HTTP 服务器
 *
 * @param port 端口号，默认 3000
 * @param host 绑定主机，默认 '0.0.0.0'
 */
export function startServer(port: number | string = 3000, host = '0.0.0.0'): void {
  const app = createApp();
  const normalizedPort = typeof port === 'string' ? parseInt(port, 10) : port;

  const server = app.listen(normalizedPort, host, () => {
    console.log('');
    console.log('==========================================');
    console.log('  云枢中台 API 服务已就绪');
    console.log(`  Local:    http://${host}:${normalizedPort}/api`);
    console.log(`  Health:   http://${host}:${normalizedPort}/api/health`);
    console.log(`  Env:      ${process.env.NODE_ENV ?? 'development'}`);
    console.log('==========================================');
    console.log('');
  });

  // --------------------------------------------------------------------------
  // 优雅关闭
  // --------------------------------------------------------------------------
  const gracefulShutdown = (signal: string) => {
    console.log(`\n[${signal}] 收到关闭信号，开始优雅关闭...`);
    server.close(() => {
      console.log('[OK] HTTP 服务器已关闭');
      process.exit(0);
    });

    setTimeout(() => {
      console.log('[WARN] 强制退出（10 秒超时）');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('uncaughtException', (error) => {
    console.error('[UNCAUGHT] 未捕获的异常:', error);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('[UNHANDLED] Promise 未处理的拒绝:', reason);
  });
}

export default createApp;
