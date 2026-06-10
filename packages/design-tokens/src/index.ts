/**
 * 云枢中台 — 设计令牌
 *
 * 平台无关的设计决策数据，通过生成器输出为多种格式。
 *
 * @module @yunshu/design-tokens
 *
 * @example
 * ```typescript
 * // 运行时使用颜色令牌
 * import { lightColors, darkColors } from '@yunshu/design-tokens';
 * const bgColor = isDark ? darkColors.background : lightColors.background;
 *
 * // 导入 CSS 变量
 * import '@yunshu/design-tokens/css';
 *
 * // 在 SCSS 中引用
 * // @use '@yunshu/design-tokens/scss' as yun;
 * // .card { background: yun.$surface-1; }
 *```
 */

// ============================================================================
// 基础令牌
// ============================================================================

export {
  spacingBase,
  spacing,
  spacingSemantic,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  boxShadow,
  transition,
  zIndex,
  breakpoint,
} from './tokens/base';

// ============================================================================
// 颜色令牌
// ============================================================================

export { lightColors, darkColors, themeColors, getColors } from './tokens/colors';

export type { IColorTokens, TTheme } from './tokens/colors';

// ============================================================================
// 生成器
// ============================================================================

export { generateCSS, generateLightCSS, generateDarkCSS } from './generators/css';
export { generateSCSS } from './generators/scss';
export { generateTailwindConfig, tailwindPreset } from './generators/tailwind';
