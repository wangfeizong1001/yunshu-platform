/**
 * 云枢中台 — Vue 3 ESLint 配置
 *
 * 针对 Vue 3 + TypeScript 项目的扩展规则。
 *
 * @module @yunshu/eslint-config/vue
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['./index.js', 'plugin:vue/vue3-recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Vue 3
    'vue/multi-word-component-names': 'warn',
    // 禁止裸用 v-html —— 强制使用 sanitizeHtml 封装组件
    'vue/no-v-html': 'error',
    'vue/require-default-prop': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/script-setup-uses-vars': 'error',

    // 与 TypeScript 规则避免冲突
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
