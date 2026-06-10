import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Mock 开发中间件
 * - 启动时用 esbuild 子进程编译所有 mock TS 文件为 JS
 * - 每次请求 require 加载编译后的 JS
 */
function mockPlugin(): Plugin {
  const mockDir = fileURLToPath(new URL('./mock', import.meta.url));
  const routeFiles: string[] = [
    `${mockDir}/routes/auth/login.ts`,
    `${mockDir}/routes/dashboard/dashboard.ts`,
    `${mockDir}/routes/monitor/job.ts`,
    `${mockDir}/routes/monitor/logininfor.ts`,
    `${mockDir}/routes/monitor/online.ts`,
    `${mockDir}/routes/monitor/operlog.ts`,
    `${mockDir}/routes/monitor/server.ts`,
    `${mockDir}/routes/report/report.ts`,
    `${mockDir}/routes/system/dept.ts`,
    `${mockDir}/routes/system/form.ts`,
    `${mockDir}/routes/system/knowledge.ts`,
    `${mockDir}/routes/system/menu.ts`,
    `${mockDir}/routes/system/message.ts`,
    `${mockDir}/routes/system/notification.ts`,
    `${mockDir}/routes/system/post.ts`,
    `${mockDir}/routes/system/role.ts`,
    `${mockDir}/routes/system/user.ts`,
    `${mockDir}/routes/tool/gen.ts`,
    `${mockDir}/routes/workflow/index.ts`,
  ];

  // 每个请求编译太费，改为首次请求编译一次并缓存
  let compiledRoutes: Array<{ url: string; method: string; response: any }> | null = null;

  function loadRoutes(): Array<{ url: string; method: string; response: any }> {
    if (compiledRoutes) return compiledRoutes;

    const tmpDir = `${mockDir}/.compiled`;
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // 查找 esbuild 可执行文件
    let esbuildCmd = 'esbuild';
    const tryPaths = [
      `${__dirname}/node_modules/.bin/esbuild`,
      `${__dirname}/../../node_modules/.bin/esbuild`,
      '/workspace/node_modules/.bin/esbuild',
    ];
    for (const p of tryPaths) {
      if (fs.existsSync(p)) { esbuildCmd = p; break; }
    }

    const routes: Array<{ url: string; method: string; response: any }> = [];
    for (const tsFile of routeFiles) {
      const jsFile = `${tmpDir}/${tsFile.split('/').slice(-2).join('_').replace(/\.ts$/, '.js')}`;
      // 用 esbuild CLI 编译
      const { execFileSync } = require('node:child_process');
      execFileSync(esbuildCmd, [
        tsFile,
        '--bundle',
        '--outfile=' + jsFile,
        '--platform=node',
        '--format=cjs',
        '--target=node18',
        '--log-level=silent',
      ], { stdio: 'pipe' });
      delete require.cache[require.resolve(jsFile)];
      const mod = require(jsFile);
      const arr: any[] = mod.default || mod;
      routes.push(...(Array.isArray(arr) ? arr : [arr]));
    }

    compiledRoutes = routes;
    return routes;
  }

  return {
    name: 'yunshu-mock-server',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const url = req.url || '';
        const method = (req.method || 'get').toLowerCase();

        // 读取请求体
        let body: any = {};
        if (method !== 'get') {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString();
          if (raw) {
            try { body = JSON.parse(raw); } catch { body = raw; }
          }
        }

        // 加载路由（首次编译+缓存）
        let routes: Array<{ url: string; method: string; response: any }> = [];
        try {
          routes = loadRoutes();
        } catch (err) {
          console.error('[mock] 加载路由失败:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ code: 500, msg: 'Mock 路由加载失败' }));
          return;
        }

        // 匹配路由
        const matched = routes.find(
          (r) => r.url === url && (r.method || 'get') === method,
        );
        if (matched) {
          try {
            const result = await matched.response({
              body,
              query: {},
              headers: Object.fromEntries(Object.entries(req.headers)),
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
            return;
          } catch (err) {
            console.error('[mock] 处理响应失败:', url, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ code: 500, msg: 'Mock 响应处理失败' }));
            return;
          }
        }

        // 未匹配
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ code: 404, msg: `未找到 Mock 路由: ${method.toUpperCase()} ${url}` }));
      });
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    mockPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@yunshu/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: '@use \'@/assets/styles/variables.scss\' as *;',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    open: false,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.toString().split('node_modules/')[1].split('/')[0].includes('element-plus')) return 'element-plus';
            if (id.toString().split('node_modules/')[1].split('/')[0].includes('echarts')) return 'echarts';
            if (id.toString().split('node_modules/')[1].split('/')[0].includes('vue') || id.toString().split('node_modules/')[1].split('/')[0].includes('pinia')) return 'vue-vendor';
            if (id.toString().split('node_modules/')[1].split('/')[0].includes('sentry')) return 'sentry';
          }
        },
      },
    },
  },
});
