/**
 * Vite 配置文件示例
 * 复制此文件为 vite.config.ts 并修改相应配置
 */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { wrapperEnv } from './build/utils';

// ================================
// 1. 基础配置
// ================================

export default defineConfig(({ mode }) => {
  // 从环境变量中获取配置
  const env = wrapperEnv(process.env);

  return {
    // 项目根目录
    root: '.',
    
    // 构建输出目录
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_BUILD_SOURCEMAP,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    // ================================
    // 2. 插件配置
    // ================================
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 组件名称匹配（用于递归组件）
            isCustomElement: (tag) => tag.startsWith('Yun'),
          },
        },
      }),
    ],

    // ================================
    // 3. 路径配置
    // ================================
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@@': resolve(__dirname, 'packages'),
        '@yunshu/ui': resolve(__dirname, 'packages/ui/src'),
        '@yunshu/shared': resolve(__dirname, 'packages/shared/src'),
        '@yunshu/design-tokens': resolve(__dirname, 'packages/design-tokens/src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },

    // ================================
    // 4. CSS 配置
    // ================================
    css: {
      preprocessorOptions: {
        scss: {
          // 注入设计令牌
          additionalData: `@use "@/styles/variables" as *;`,
          api: 'modern-compiler',
        },
      },
      devSourcemap: true,
    },

    // ================================
    // 5. 开发服务器配置
    // ================================
    server: {
      port: env.VITE_DEV_PORT || 3000,
      host: true,
      open: env.VITE_DEV_OPEN,
      https: env.VITE_DEV_HTTPS,
      proxy: {
        // API 代理
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // WebSocket 代理
        '/ws': {
          target: env.VITE_WS_URL,
          ws: true,
        },
      },
    },

    // ================================
    // 6. 优化配置
    // ================================
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
      ],
    },

    // ================================
    // 7. 构建配置
    // ================================
    build: {
      target: env.VITE_BUILD_TARGET || 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_BUILD_SOURCEMAP ? 'inline' : false,
      rollupOptions: {
        output: {
          // 手动分包
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
          },
          // 资源命名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || '';
            if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
              return 'fonts/[name][extname]';
            }
            if (/\.css$/i.test(info)) {
              return 'css/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
    },

    // ================================
    // 8. 缓存配置
    // ================================
    cache: {
      cacheDir: 'node_modules/.vite',
    },

    // ================================
    // 9. 预览配置
    // ================================
    preview: {
      port: 3000,
      host: true,
    },
  };
});
