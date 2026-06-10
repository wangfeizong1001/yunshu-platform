/**
 * yunshu CLI — 项目创建器
 *
 * 根据模板和选项生成项目文件。
 *
 * @module @yunshu/cli/utils/projectCreator
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface CreateProjectOptions {
  name: string;
  template: 'basic' | 'admin' | 'full-stack';
  features: string[];
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

/**
 * 创建项目目录和文件
 */
export async function createProject(options: CreateProjectOptions): Promise<void> {
  const { name, template, features } = options;
  const targetDir = path.resolve(process.cwd(), name);

  // 检查目标目录是否已存在
  if (await fs.pathExists(targetDir)) {
    throw new Error(`目录 ${name} 已存在`);
  }

  // 创建目录结构
  await fs.ensureDir(targetDir);
  await fs.ensureDir(path.join(targetDir, 'src'));
  await fs.ensureDir(path.join(targetDir, 'src/components'));
  await fs.ensureDir(path.join(targetDir, 'src/views'));
  await fs.ensureDir(path.join(targetDir, 'src/api'));
  await fs.ensureDir(path.join(targetDir, 'src/styles'));
  await fs.ensureDir(path.join(targetDir, 'src/composables'));
  await fs.ensureDir(path.join(targetDir, 'public'));

  // 生成 package.json
  const pkg = generatePackageJson(options);
  await fs.writeJson(path.join(targetDir, 'package.json'), pkg, { spaces: 2 });

  // 生成 tsconfig.json
  await fs.writeJson(path.join(targetDir, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      jsx: 'preserve',
      jsxImportSource: 'vue',
      baseUrl: '.',
      paths: { '@/*': ['./src/*'] },
      types: ['vite/client'],
    },
    include: ['src/**/*.ts', 'src/**/*.vue'],
  }, { spaces: 2 });

  // 生成 vite.config.ts
  await fs.writeFile(path.join(targetDir, 'vite.config.ts'), `
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
});
`.trim());

  // 生成 index.html
  await fs.writeFile(path.join(targetDir, 'index.html'), `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`);

  // 生成 src/main.ts
  await fs.writeFile(path.join(targetDir, 'src/main.ts'), `
import { createApp } from 'vue';
import App from './App.vue';

// 导入云枢设计令牌
import '@yunshu/design-tokens/css';

const app = createApp(App);
app.mount('#app');
`.trim());

  // 生成 src/App.vue
  await fs.writeFile(path.join(targetDir, 'src/App.vue'), `<script setup lang="ts">
/**
 * ${name} — 应用根组件
 *
 * 基于云枢中台 ${template === 'basic' ? '基础' : template === 'admin' ? '后台管理' : '全栈'}模板
 */
</script>

<template>
  <div class="app">
    <h1>☁️ ${name}</h1>
    <p>欢迎使用云枢中台!</p>
    <p class="hint">编辑 <code>src/App.vue</code> 开始开发</p>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--background);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

h1 {
  font-size: var(--font-size-3xl);
  color: var(--primary);
}

.hint {
  margin-top: 24px;
  color: var(--text-muted);
}

.hint code {
  background: var(--surface-3);
  padding: 2px 8px;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
}
</style>`);

  // 如果选择了认证功能
  if (features.includes('auth')) {
    await fs.ensureDir(path.join(targetDir, 'src/composables'));
    await fs.writeFile(path.join(targetDir, 'src/composables/useAuth.ts'), `
import { ref } from 'vue';

export function useAuth() {
  const user = ref(null);
  const isLoggedIn = ref(false);

  async function login(credentials: { username: string; password: string }) {
    // TODO: 对接认证 API
    isLoggedIn.value = true;
  }

  function logout() {
    user.value = null;
    isLoggedIn.value = false;
  }

  return { user, isLoggedIn, login, logout };
}
`.trim());
  }

  // 如果选择了权限功能
  if (features.includes('permission')) {
    await fs.ensureDir(path.join(targetDir, 'src/composables'));
    await fs.writeFile(path.join(targetDir, 'src/composables/usePermission.ts'), `
import { ref } from 'vue';

const permissions = ref<string[]>([]);

export function usePermission() {
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission) || permissions.value.includes('*');
  }

  function hasAnyPermission(perms: string[]): boolean {
    return perms.some((p) => hasPermission(p));
  }

  function hasAllPermissions(perms: string[]): boolean {
    return perms.every((p) => hasPermission(p));
  }

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions };
}
`.trim());
  }

  // 生成 .gitignore
  await fs.writeFile(path.join(targetDir, '.gitignore'), `node_modules
dist
.vite
*.local
.DS_Store
`);

  // 生成 README
  await fs.writeFile(path.join(targetDir, 'README.md'), `# ${name}

> 基于[云枢中台](https://github.com/your-org/yunshu-platform)创建

## 快速开始

\`\`\`bash
${options.packageManager} install
${options.packageManager} run dev
\`\`\`

## 包含的功能

${features.map((f) => `- ${f}`).join('\n') || '- 无额外功能'}
`);
}

/**
 * 生成 package.json
 */
function generatePackageJson(options: CreateProjectOptions): Record<string, unknown> {
  const { name, template } = options;

  const baseDeps: Record<string, string> = {
    vue: '^3.4.0',
    '@yunshu/design-tokens': '^0.1.0',
    '@yunshu/ui': '^0.1.0',
  };

  const baseDevDeps: Record<string, string> = {
    '@vitejs/plugin-vue': '^5.0.0',
    typescript: '^5.4.0',
    vite: '^5.0.0',
    'vue-tsc': '^2.0.0',
  };

  if (template === 'admin') {
    Object.assign(baseDeps, {
      'vue-router': '^4.2.0',
      pinia: '^2.1.0',
      'element-plus': '^2.10.0',
      '@yunshu/api-client': '^0.1.0',
    });
    Object.assign(baseDevDeps, {
      sass: '^1.70.0',
    });
  }

  if (template === 'full-stack') {
    Object.assign(baseDeps, {
      '@yunshu/api-client': '^0.1.0',
      '@yunshu/server-express': '^0.1.0',
      express: '^4.18.0',
    });
    Object.assign(baseDevDeps, {
      '@types/express': '^4.17.0',
      'ts-node-dev': '^2.0.0',
    });
  }

  return {
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc && vite build',
      preview: 'vite preview',
      'type-check': 'vue-tsc --noEmit',
    },
    dependencies: baseDeps,
    devDependencies: baseDevDeps,
  };
}
