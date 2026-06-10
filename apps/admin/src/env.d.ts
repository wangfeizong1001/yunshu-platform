/**
 * 环境配置工具
 * 提供环境变量的类型安全和默认值
 */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_ENABLE_PROXY: string;
  readonly VITE_PROXY_TARGET: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ROUTE_MODE: string;
  readonly VITE_ENABLE_TYPE_CHECK: string;
  readonly VITE_ENABLE_COMPRESSION: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 环境变量类型声明
declare global {
  interface Window {
    __APP_INFO__: {
      pkg: { name: string; version: string };
      lastBuildTime: string;
    };
  }
}

export {};
