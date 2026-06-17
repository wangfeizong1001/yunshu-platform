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

    // ===== 设计系统合规：禁止硬编码 hex 颜色（品牌色 #4a9eff 请使用 CSS 变量或 SCSS 变量） =====
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
        message: '禁止在 JavaScript/TypeScript 中使用硬编码 hex 颜色。请使用 CSS 变量 (var(--primary)) 或语义化颜色常量。',
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo', 'coverage'],
};

/**
 * Vue 组件配置（在 apps/admin/.eslintrc.js 中单独继承）
 * Vue 模板中的 hex 颜色检测请参考 .stylelintrc.js 的 color-no-hex 规则
 */
