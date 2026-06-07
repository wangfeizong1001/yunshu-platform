/**
 * 云枢设计令牌 — Tailwind 配置生成器
 *
 * 将设计令牌转换为 Tailwind CSS v3/v4 的 theme.extend 配置。
 *
 * @module @yunshu/design-tokens/generators/tailwind
 */

import { spacing as spacingTokens, fontSize, fontWeight, borderRadius } from '../tokens/base';

/**
 * 生成 Tailwind CSS 主题扩展配置
 *
 * @returns Tailwind theme.extend 对象
 *
 * @example
 * ```js
 * // tailwind.config.js
 * const { tailwindPreset } = require('@yunshu/design-tokens/tailwind');
 * module.exports = {
 *   presets: [tailwindPreset],
 *   // ...你的自定义配置
 * };
 * ```
 */
export function generateTailwindConfig(): Record<string, unknown> {
  // 颜色映射
  const colors: Record<string, Record<string, string> | string> = {
    primary: {
      50: '#e8f4ff',
      100: '#d1e9ff',
      200: '#a3d3ff',
      300: '#75bdff',
      400: '#4a9eff', // 基准色
      500: '#2a7fde',
      600: '#1e6ac0',
      700: '#1555a0',
      800: '#0d4080',
      900: '#062b60',
    },
    accent: {
      400: '#9b4de6',
      500: '#8a2be2',
      600: '#7b1fd0',
    },
  };

  // 字体大小
  const tailwindFontSize: Record<string, [string, { lineHeight: string }]> = {};
  for (const [key, value] of Object.entries(fontSize)) {
    const pxValue = parseInt(value, 10);
    const remValue = (pxValue / 16).toFixed(3);
    tailwindFontSize[key] = [`${remValue}rem`, { lineHeight: '1.5' }];
  }

  // 圆角
  const tailwindBorderRadius: Record<string, string> = {};
  for (const [key, value] of Object.entries(borderRadius)) {
    tailwindBorderRadius[key] = value;
  }

  return {
    theme: {
      extend: {
        colors,
        spacing: Object.fromEntries(
          Object.entries(spacingTokens).map(([key, value]) => [key, `${value / 4}rem`]),
        ),
        fontSize: tailwindFontSize,
        fontWeight,
        borderRadius: tailwindBorderRadius,
      },
    },
  };
}

/** Tailwind 预设 — 可直接在 tailwind.config 中使用 */
export const tailwindPreset = generateTailwindConfig();
