#!/usr/bin/env tsx
/**
 * 设计令牌构建脚本
 *
 * 生成 CSS、SCSS 和 Tailwind 配置文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCSS, generateSCSS, generateTailwindConfig } from '../src/index.js';

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

// 1. 生成 CSS 变量文件
const cssContent = generateCSS();
fs.writeFileSync(path.join(cssDir, 'tokens.css'), cssContent, 'utf-8');
console.log('✅ CSS 令牌已生成:', path.join(cssDir, 'tokens.css'));

// 2. 生成 SCSS 变量文件
const scssContent = generateSCSS();
fs.writeFileSync(path.join(scssDir, '_tokens.scss'), scssContent, 'utf-8');
console.log('✅ SCSS 令牌已生成:', path.join(scssDir, '_tokens.scss'));

// 3. 生成 Tailwind 配置
const tailwindContent = `/**
 * 云枢中台 — Tailwind 预设
 * 此文件由 @yunshu/design-tokens 自动生成，请勿手动编辑。
 */

export const tailwindPreset = ${JSON.stringify(generateTailwindConfig(), null, 2)};

export default tailwindPreset;
`;
fs.writeFileSync(path.join(tailwindDir, 'tokens.js'), tailwindContent, 'utf-8');
console.log('✅ Tailwind 配置已生成:', path.join(tailwindDir, 'tokens.js'));

console.log('\n🎉 所有设计令牌生成完成！');
