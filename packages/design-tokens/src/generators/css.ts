/**
 * 云枢设计令牌 — CSS 变量生成器
 *
 * 将颜色令牌和基础令牌转换为 CSS 自定义属性格式。
 * 生成的 CSS 可与任何框架配合使用。
 *
 * @module @yunshu/design-tokens/generators/css
 */

import { spacing, spacingSemantic, fontSize, fontWeight, lineHeight } from '../tokens/base';
import {
  borderRadius,
  boxShadow,
  transition,
  zIndex,
  breakpoint,
} from '../tokens/base';
import { lightColors, darkColors, type IColorTokens } from '../tokens/colors';

// ============================================================================
// 颜色令牌 → CSS 变量
// ============================================================================

/**
 * 将颜色令牌对象转换为 CSS 自定义属性字符串
 *
 * @param colors - 颜色令牌对象
 * @param prefix - 变量名前缀，默认空（直接 --primary）
 * @returns CSS 变量定义字符串
 */
function colorsToCSSVars(colors: IColorTokens, prefix = ''): string {
  const mapping: Record<string, string> = {
    primary: colors.primary,
    'primary-light': colors.primaryLight,
    'primary-dark': colors.primaryDark,
    'primary-alpha-10': colors.primaryAlpha10,
    'primary-alpha-20': colors.primaryAlpha20,
    'primary-alpha-50': colors.primaryAlpha50,
    secondary: colors.secondary,
    accent: colors.accent,
    'accent-light': colors.accentLight,
    background: colors.background,
    'surface-1': colors.surface1,
    'surface-2': colors.surface2,
    'surface-3': colors.surface3,
    'surface-4': colors.surface4,
    'text-primary': colors.textPrimary,
    'text-secondary': colors.textSecondary,
    'text-muted': colors.textMuted,
    'text-disabled': colors.textDisabled,
    success: colors.success,
    'success-light': colors.successLight,
    warning: colors.warning,
    'warning-light': colors.warningLight,
    danger: colors.danger,
    error: colors.error,
    'error-light': colors.errorLight,
    info: colors.info,
    border: colors.border,
    'border-light': colors.borderLight,
    'border-dark': colors.borderDark,
    'shadow-sm': colors.shadowSm,
    shadow: colors.shadow,
    'shadow-md': colors.shadowMd,
    'shadow-lg': colors.shadowLg,
    divider: colors.divider,
    overlay: colors.overlay,
    'card-hover': colors.cardHover,
  };

  return Object.entries(mapping)
    .map(([key, value]) => `  --${prefix}${key}: ${value};`)
    .join('\n');
}

// ============================================================================
// 基础令牌 → CSS 变量
// ============================================================================

/** 生成基础令牌的 CSS 变量 */
function baseTokensToCSSVars(): string {
  const vars: string[] = [];

  // 间距
  for (const [key, value] of Object.entries(spacing)) {
    vars.push(`  --spacing-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(spacingSemantic)) {
    vars.push(`  --spacing-${key}: ${value}px;`);
  }

  // 字体
  vars.push(`  --font-size-xs: ${fontSize.xs};`);
  vars.push(`  --font-size-sm: ${fontSize.sm};`);
  vars.push(`  --font-size-base: ${fontSize.base};`);
  vars.push(`  --font-size-lg: ${fontSize.lg};`);
  vars.push(`  --font-size-xl: ${fontSize.xl};`);
  vars.push(`  --font-size-2xl: ${fontSize['2xl']};`);
  vars.push(`  --font-size-3xl: ${fontSize['3xl']};`);
  vars.push(`  --font-size-4xl: ${fontSize['4xl']};`);

  vars.push(`  --font-weight-light: ${fontWeight.light};`);
  vars.push(`  --font-weight-normal: ${fontWeight.normal};`);
  vars.push(`  --font-weight-medium: ${fontWeight.medium};`);
  vars.push(`  --font-weight-semibold: ${fontWeight.semibold};`);
  vars.push(`  --font-weight-bold: ${fontWeight.bold};`);

  vars.push(`  --line-height-none: ${lineHeight.none};`);
  vars.push(`  --line-height-tight: ${lineHeight.tight};`);
  vars.push(`  --line-height-normal: ${lineHeight.normal};`);
  vars.push(`  --line-height-relaxed: ${lineHeight.relaxed};`);

  // 圆角
  for (const [key, value] of Object.entries(borderRadius)) {
    vars.push(`  --radius-${key}: ${value};`);
  }

  // 阴影
  for (const [key, value] of Object.entries(boxShadow)) {
    vars.push(`  --shadow-${key}: ${value};`);
  }

  // 过渡
  vars.push(`  --transition-fast: ${transition.fast};`);
  vars.push(`  --transition-normal: ${transition.normal};`);
  vars.push(`  --transition-slow: ${transition.slow};`);

  // Z-Index
  for (const [key, value] of Object.entries(zIndex)) {
    vars.push(`  --z-${key}: ${value};`);
  }

  // 断点
  for (const [key, value] of Object.entries(breakpoint)) {
    vars.push(`  --breakpoint-${key}: ${value}px;`);
  }

  return vars.join('\n');
}

// ============================================================================
// 完整 CSS 生成
// ============================================================================

/**
 * 生成完整的 CSS 令牌文件
 *
 * 包含：基础令牌 + 浅色主题 + 深色主题 + 系统偏好跟随
 *
 * @returns CSS 字符串
 */
export function generateCSS(): string {
  return `/**
 * 云枢中台 — 设计令牌 CSS
 *
 * 此文件由 @yunshu/design-tokens 自动生成，请勿手动编辑。
 * 包含浅色/深色双主题的完整 CSS 自定义属性。
 *
 * 使用方式：
 *   1. 导入 CSS：import '@yunshu/design-tokens/css'
 *   2. 使用变量：color: var(--text-primary)
 *   3. 切换主题：document.documentElement.className = 'theme-dark'
 */

/* ===== 基础令牌 ===== */
:root {
${baseTokensToCSSVars()}
}

/* ===== 浅色主题（默认） ===== */
:root,
.theme-light {
${colorsToCSSVars(lightColors)}
  color-scheme: light;
}

/* ===== 深色主题 ===== */
.theme-dark {
${colorsToCSSVars(darkColors)}
  color-scheme: dark;
}

/* ===== 跟随系统偏好 ===== */
@media (prefers-color-scheme: dark) {
  :root:not(.theme-light):not(.theme-dark) {
${colorsToCSSVars(darkColors)}
    color-scheme: dark;
  }
}
`;
}

/**
 * 生成浅色主题 CSS
 */
export function generateLightCSS(): string {
  return `.theme-light {
${colorsToCSSVars(lightColors)}
  color-scheme: light;
}`;
}

/**
 * 生成深色主题 CSS
 */
export function generateDarkCSS(): string {
  return `.theme-dark {
${colorsToCSSVars(darkColors)}
  color-scheme: dark;
}`;
}
