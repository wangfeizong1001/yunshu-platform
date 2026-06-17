/**
 * 云枢中台 — Stylelint 配置
 * 禁止硬编码颜色值，所有颜色必须使用 CSS 变量或语义化 SCSS 变量
 */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // 禁止 hex 颜色值（核心规则）
    'color-no-hex': true,
    // 禁止颜色名称（如 red, blue 等）
    'color-named': 'never',
    // 允许自定义的 CSS 变量名
    'custom-property-pattern': null,
    // 允许任意类名
    'selector-class-pattern': null,
    // 允许 !important（用于主题覆盖）
    'no-descending-specificity': null,
    // SCSS 规则放宽
    'scss/dollar-variable-pattern': null,
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward', 'tailwind'] }],
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.git/**',
  ],
};
