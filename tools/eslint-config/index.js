/**
 * 云枢中台 — 共享 ESLint 配置
 *
 * 提供前后端通用的 ESLint 规则，支持 Vue 3 + TypeScript。
 *
 * @module @yunshu/eslint-config
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // TypeScript —— 彻底禁止 any，允许单行 eslint-disable-next-line 做例外标注
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' }],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // 通用
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-debugger': 'error',

    // 禁止在 Vue template 中硬编码 hex 颜色值
    'vue/no-restricted-syntax': [
      'warn',
      {
        // 检测 VLiteral 中包含 hex 颜色值
        selector: 'VLiteral[value=/^#[0-9a-fA-F]{3,6}$/]',
        message: '禁止使用硬编码 hex 颜色值，请使用 CSS 变量（如 var(--el-color-primary)）',
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo', 'coverage'],
};
