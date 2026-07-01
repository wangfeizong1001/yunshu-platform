import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'

export default defineConfig({
  base: '/admin/',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    }),
    viteMockServe({
      mockPath: './mock',
      enable: process.env.NODE_ENV !== 'production',
      watchFiles: process.env.NODE_ENV !== 'production'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@yunshu/shared': resolve(__dirname, '../../packages/shared/src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  // ==================== 构建优化配置 ====================
  build: {
    // 目标浏览器
    target: 'es2015',
    // 生成 sourcemap，便于调试
    sourcemap: false,
    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包配置
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus 组件库
          'element-plus': ['element-plus'],
          // UI 工具库
          'ui-vendor': ['@vueuse/core', '@element-plus/icons-vue'],
          // ECharts 图表库
          'echarts': ['echarts', 'vue-echarts'],
          // 工具函数库
          'utils-vendor': ['axios', 'dayjs', 'nprogress']
        },
        // 资源文件名格式
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    },
    // 打包文件大小限制
    chunkSizeWarningLimit: 1000,
    // 禁用 gzip 压缩，由服务器处理
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  },
  // ==================== 性能优化配置 ====================
  optimizeDeps: {
    // 预构建依赖
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      'axios',
      'dayjs',
      '@vueuse/core'
    ],
    // 排除不需要预构建的依赖
    exclude: []
  },
  // ==================== CSS 配置 ====================
  css: {
    devSourcemap: false
  },
  // ==================== 缓存配置 ====================
  // 启用文件系统缓存
  cacheDir: 'node_modules/.vite',
  // ==================== 预览配置 ====================
  preview: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
