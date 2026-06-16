/**
 * 云枢中台 — Stylelint 配置
 * 禁止硬编码颜色值，所有颜色必须使用 CSS 变量
 */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // 核心规则：禁止硬编码 hex 颜色
    'color-no-hex': true,
    'color-named': 'never',
    // SCSS 特定规则
    'scss/dollar-variable-pattern': null,
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward'] }],
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.git/**',
  ],
};
