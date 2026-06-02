/**
 * 云枢设计令牌 — SCSS 变量生成器
 *
 * 将设计令牌转换为 SCSS 变量格式，保持与云枢原项目兼容。
 *
 * @module @yunshu/design-tokens/generators/scss
 */

import { spacing, fontSize, fontWeight, lineHeight } from '../tokens/base';
import { borderRadius, boxShadow, transition, zIndex, breakpoint } from '../tokens/base';
import { lightColors, darkColors, type IColorTokens } from '../tokens/colors';

/**
 * 将颜色令牌转换为 SCSS 变量
 */
function colorsToSCSS(colors: IColorTokens, prefix = ''): string {
  const mapping: Record<string, string> = {
    primary: colors.primary,
    'primary-light': colors.primaryLight,
    'primary-dark': colors.primaryDark,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background,
    'surface-1': colors.surface1,
    'surface-2': colors.surface2,
    'surface-3': colors.surface3,
    'surface-4': colors.surface4,
    'text-primary': colors.textPrimary,
    'text-secondary': colors.textSecondary,
    'text-muted': colors.textMuted,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    error: colors.error,
    info: colors.info,
    border: colors.border,
    'border-light': colors.borderLight,
  };

  return Object.entries(mapping)
    .map(([key, value]) => `$${prefix}${key}: ${value};`)
    .join('\n');
}

/**
 * 生成完整 SCSS 令牌文件
 */
export function generateSCSS(): string {
  const lines: string[] = [
    '/**',
    ' * 云枢中台 — 设计令牌 SCSS',
    ' *',
    ' * 此文件由 @yunshu/design-tokens 自动生成，请勿手动编辑。',
    ' *',
    ' * 使用方式：',
    ' *   @use \'@yunshu/design-tokens/scss\' as yun;',
    ' *   padding: yun.$spacing-md;',
    ' */',
    '',
    '// ===== 间距系统 =====',
    `$spacing-base: ${spacing[1]}px;`,
  ];

  // 间距
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`$spacing-${key}: ${value}px;`);
  }
  lines.push('');
  lines.push('// 语义化间距');
  lines.push('$spacing-xs: $spacing-1;');
  lines.push('$spacing-sm: $spacing-2;');
  lines.push('$spacing-md: $spacing-4;');
  lines.push('$spacing-lg: $spacing-6;');
  lines.push('$spacing-xl: $spacing-8;');
  lines.push('');

  // 字体
  lines.push('// ===== 字体系统 =====');
  lines.push(`$font-size-xs: ${fontSize.xs};`);
  lines.push(`$font-size-sm: ${fontSize.sm};`);
  lines.push(`$font-size-base: ${fontSize.base};`);
  lines.push(`$font-size-lg: ${fontSize.lg};`);
  lines.push(`$font-size-xl: ${fontSize.xl};`);
  lines.push(`$font-size-2xl: ${fontSize['2xl']};`);
  lines.push(`$font-size-3xl: ${fontSize['3xl']};`);
  lines.push(`$font-size-4xl: ${fontSize['4xl']};`);
  lines.push('');
  lines.push(`$font-light: ${fontWeight.light};`);
  lines.push(`$font-normal: ${fontWeight.normal};`);
  lines.push(`$font-medium: ${fontWeight.medium};`);
  lines.push(`$font-semibold: ${fontWeight.semibold};`);
  lines.push(`$font-bold: ${fontWeight.bold};`);
  lines.push('');
  lines.push(`$leading-none: ${lineHeight.none};`);
  lines.push(`$leading-tight: ${lineHeight.tight};`);
  lines.push(`$leading-normal: ${lineHeight.normal};`);
  lines.push(`$leading-relaxed: ${lineHeight.relaxed};`);
  lines.push('');

  // 圆角
  lines.push('// ===== 圆角系统 =====');
  for (const [key, value] of Object.entries(borderRadius)) {
    lines.push(`$radius-${key}: ${value};`);
  }
  lines.push('');

  // 阴影
  lines.push('// ===== 阴影系统 =====');
  for (const [key, value] of Object.entries(boxShadow)) {
    lines.push(`$shadow-${key}: ${value};`);
  }
  lines.push('');

  // 过渡
  lines.push('// ===== 过渡动画 =====');
  lines.push(`$transition-fast: ${transition.fast};`);
  lines.push(`$transition-normal: ${transition.normal};`);
  lines.push(`$transition-slow: ${transition.slow};`);
  lines.push('');

  // Z-Index
  lines.push('// ===== Z-Index 层级 =====');
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`$z-${key}: ${value};`);
  }
  lines.push('');

  // 断点
  lines.push('// ===== 响应式断点 =====');
  for (const [key, value] of Object.entries(breakpoint)) {
    lines.push(`$breakpoint-${key}: ${value}px;`);
  }
  lines.push('');

  // 浅色主题颜色
  lines.push('// ===== 浅色主题颜色 =====');
  lines.push(colorsToSCSS(lightColors));
  lines.push('');

  // 深色主题颜色
  lines.push('// ===== 深色主题颜色 =====');
  lines.push(colorsToSCSS(darkColors, 'dark-'));

  return lines.join('\n');
}
