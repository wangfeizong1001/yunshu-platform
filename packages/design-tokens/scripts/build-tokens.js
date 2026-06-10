#!/usr/bin/env node
/**
 * 设计令牌构建脚本 (简化版)
 *
 * 生成 CSS、SCSS 和 Tailwind 配置文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// 确保 dist 目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 创建子目录
const cssDir = path.join(distDir, 'css');
const scssDir = path.join(distDir, 'scss');
const tailwindDir = path.join(distDir, 'tailwind');

[cssDir, scssDir, tailwindDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🔨 生成设计令牌文件...');

// 简单的设计令牌
const lightColors = {
  primary: '#4a9eff',
  primaryLight: '#6eb1ff',
  primaryDark: '#2a6fd0',
  primaryAlpha10: 'rgba(74, 158, 255, 0.1)',
  primaryAlpha20: 'rgba(74, 158, 255, 0.2)',
  primaryAlpha50: 'rgba(74, 158, 255, 0.5)',
  secondary: '#f5f5f5',
  accent: '#8a2be2',
  accentLight: '#9b4de6',
  background: '#ffffff',
  surface1: '#ffffff',
  surface2: '#f8f9fa',
  surface3: '#e9ecef',
  surface4: '#dee2e6',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textMuted: '#adb5bd',
  textDisabled: '#c0c0c0',
  success: '#27ae60',
  successLight: '#2ecc71',
  warning: '#d35400',
  warningLight: '#e67e22',
  danger: '#c0392b',
  error: '#c0392b',
  errorLight: '#e74c3c',
  info: '#3498db',
  border: '#dee2e6',
  borderLight: '#e9ecef',
  borderDark: '#ced4da',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  divider: '#e9ecef',
  overlay: 'rgba(0, 0, 0, 0.3)',
  cardHover: '#f8f9fa',
};

const darkColors = {
  primary: '#4a9eff',
  primaryLight: '#6eb1ff',
  primaryDark: '#2a6fd0',
  primaryAlpha10: 'rgba(74, 158, 255, 0.1)',
  primaryAlpha20: 'rgba(74, 158, 255, 0.2)',
  primaryAlpha50: 'rgba(74, 158, 255, 0.5)',
  secondary: '#1a1d23',
  accent: '#8a2be2',
  accentLight: '#9b4de6',
  background: '#0a0e27',
  surface1: '#1a1d2e',
  surface2: '#22273a',
  surface3: '#2a2f45',
  surface4: '#333852',
  textPrimary: '#e0e0e0',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  textDisabled: '#4a4a4a',
  success: '#27ae60',
  successLight: '#2ecc71',
  warning: '#d35400',
  warningLight: '#e67e22',
  danger: '#c0392b',
  error: '#c0392b',
  errorLight: '#e74c3c',
  info: '#3498db',
  border: '#2a2f45',
  borderLight: '#333852',
  borderDark: '#1a1d2e',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
  divider: '#2a2f45',
  overlay: 'rgba(0, 0, 0, 0.6)',
  cardHover: '#22273a',
};

const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
};

const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
};

const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
};

const transition = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

const breakpoint = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// 生成 CSS
function colorsToCSSVars(colors, prefix = '') {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return `  --${prefix}${cssKey}: ${value};`;
    })
    .join('\n');
}

function baseTokensToCSSVars() {
  const vars = [];

  // 间距
  for (const [key, value] of Object.entries(spacing)) {
    vars.push(`  --spacing-${key}: ${value}px;`);
  }
  vars.push(`  --spacing-xs: 4px;`);
  vars.push(`  --spacing-sm: 8px;`);
  vars.push(`  --spacing-md: 16px;`);
  vars.push(`  --spacing-lg: 24px;`);
  vars.push(`  --spacing-xl: 32px;`);
  vars.push(`  --spacing-2xl: 48px;`);

  // 字体
  for (const [key, value] of Object.entries(fontSize)) {
    vars.push(`  --font-size-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(fontWeight)) {
    vars.push(`  --font-weight-${key}: ${value};`);
  }

  // 圆角
  for (const [key, value] of Object.entries(borderRadius)) {
    vars.push(`  --radius-${key}: ${value};`);
  }

  // 过渡
  for (const [key, value] of Object.entries(transition)) {
    vars.push(`  --transition-${key}: ${value};`);
  }

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

const cssContent = `/**
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

fs.writeFileSync(path.join(cssDir, 'tokens.css'), cssContent, 'utf-8');
console.log('✅ CSS 令牌已生成');

// 生成 SCSS
const scssContent =
  `/**
 * 云枢中台 — 设计令牌 SCSS
 *
 * 此文件由 @yunshu/design-tokens 自动生成，请勿手动编辑。
 *
 * 使用方式：
 *   @use '@yunshu/design-tokens/scss' as yun;
 *   padding: yun.$spacing-md;
 */

/* ===== 间距系统 ===== */
$spacing-base: 4px;
` +
  Object.entries(spacing)
    .map(([key, value]) => `$spacing-${key}: ${value}px;`)
    .join('\n') +
  `

/* 语义化间距 */
$spacing-xs: $spacing-1;
$spacing-sm: $spacing-2;
$spacing-md: $spacing-4;
$spacing-lg: $spacing-6;
$spacing-xl: $spacing-8;
$spacing-2xl: $spacing-12;

/* ===== 字体系统 ===== */
` +
  Object.entries(fontSize)
    .map(([key, value]) => `$font-size-${key}: ${value};`)
    .join('\n') +
  `

` +
  Object.entries(fontWeight)
    .map(([key, value]) => `$font-${key}: ${value};`)
    .join('\n') +
  `

/* ===== 圆角系统 ===== */
` +
  Object.entries(borderRadius)
    .map(([key, value]) => `$radius-${key}: ${value};`)
    .join('\n') +
  `

/* ===== 过渡动画 ===== */
` +
  Object.entries(transition)
    .map(([key, value]) => `$transition-${key}: ${value};`)
    .join('\n') +
  `

/* ===== Z-Index 层级 ===== */
` +
  Object.entries(zIndex)
    .map(([key, value]) => `$z-${key}: ${value};`)
    .join('\n') +
  `

/* ===== 响应式断点 ===== */
` +
  Object.entries(breakpoint)
    .map(([key, value]) => `$breakpoint-${key}: ${value}px;`)
    .join('\n') +
  `

/* ===== 浅色主题颜色 ===== */
` +
  Object.entries(lightColors)
    .map(([key, value]) => {
      const scssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return `$${scssKey}: ${value};`;
    })
    .join('\n') +
  `

/* ===== 深色主题颜色 ===== */
` +
  Object.entries(darkColors)
    .map(([key, value]) => {
      const scssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return `$dark-${scssKey}: ${value};`;
    })
    .join('\n');

fs.writeFileSync(path.join(scssDir, '_tokens.scss'), scssContent, 'utf-8');
console.log('✅ SCSS 令牌已生成');

// 生成 Tailwind
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4ff',
          100: '#d1e9ff',
          200: '#a3d3ff',
          300: '#75bdff',
          400: '#4a9eff',
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
      },
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([key, value]) => [key, `${value / 4}rem`]),
      ),
      fontSize: Object.fromEntries(
        Object.entries(fontSize).map(([key, value]) => {
          const pxValue = parseInt(value, 10);
          const remValue = (pxValue / 16).toFixed(3);
          return [key, [`${remValue}rem`, { lineHeight: '1.5' }]];
        }),
      ),
      fontWeight,
      borderRadius,
    },
  },
};

const tailwindContent = `/**
 * 云枢中台 — Tailwind 预设
 * 此文件由 @yunshu/design-tokens 自动生成，请勿手动编辑。
 */

export const tailwindPreset = ${JSON.stringify(tailwindConfig, null, 2)};

export default tailwindPreset;
`;

fs.writeFileSync(path.join(tailwindDir, 'tokens.js'), tailwindContent, 'utf-8');
console.log('✅ Tailwind 配置已生成');

console.log('\n🎉 所有设计令牌生成完成！');
