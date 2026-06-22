/**
 * yunshu theme — 主题定制命令
 *
 * 交互式定制主题色、生成和预览主题配置。
 *
 * @module @yunshu/cli/commands/theme
 */

import { Command } from 'commander';
import input from '@inquirer/input';
import select from '@inquirer/select';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { generateCSS, generateSCSS } from '@yunshu/design-tokens';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const length = cleaned.length;
  
  if (length === 3) {
    return {
      r: parseInt(cleaned[0] + cleaned[0], 16),
      g: parseInt(cleaned[1] + cleaned[1], 16),
      b: parseInt(cleaned[2] + cleaned[2], 16),
    };
  }
  
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const factor = percent / 100;
  
  const r = Math.min(255, rgb.r + (255 - rgb.r) * factor);
  const g = Math.min(255, rgb.g + (255 - rgb.g) * factor);
  const b = Math.min(255, rgb.b + (255 - rgb.b) * factor);
  
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const factor = percent / 100;
  
  const r = Math.max(0, rgb.r * (1 - factor));
  const g = Math.max(0, rgb.g * (1 - factor));
  const b = Math.max(0, rgb.b * (1 - factor));
  
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

export function generateCSSTheme(primary: string, darkScheme: Record<string, string>, mode: string): string {
  const lightVars = [
    `--color-primary: ${primary};`,
    `--color-primary-light: ${lighten(primary, 30)};`,
    `--color-primary-dark: ${darken(primary, 20)};`,
    '--color-success: #67C23A;',
    '--color-warning: #E6A23C;',
    '--color-danger: #F56C6C;',
    '--color-info: #909399;',
    '--color-bg: #ffffff;',
    '--color-surface: #f5f7fa;',
    '--color-text-primary: #303133;',
    '--color-text-secondary: #606266;',
    '--color-text-muted: #909399;',
    '--color-border: #dcdfe6;',
    '--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);',
    '--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);',
    '--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);',
    '--radius-sm: 4px;',
    '--radius-md: 8px;',
    '--radius-lg: 12px;',
    '--font-size-xs: 12px;',
    '--font-size-sm: 14px;',
    '--font-size-base: 16px;',
    '--font-size-lg: 18px;',
    '--font-size-xl: 20px;',
  ];

  const darkVars = [
    `--color-bg: ${darkScheme.bg || '#0f172a'};`,
    `--color-surface: ${darkScheme.surface || '#1e293b'};`,
    `--color-text-primary: ${darkScheme.text || '#e2e8f0'};`,
    '--color-text-secondary: #94a3b8;',
    '--color-text-muted: #64748b;',
    '--color-border: #334155;',
  ];

  let css = `/* Generated theme with primary: ${primary}, mode: ${mode} */\n`;

  if (mode === 'light' || mode === 'both' || mode === 'system') {
    css += `:root {\n  color-scheme: light;\n  ${lightVars.join('\n  ')}\n}\n`;
  }

  if (mode === 'dark') {
    css += `:root {\n  color-scheme: dark;\n  ${lightVars.join('\n  ')}\n  ${darkVars.join('\n  ')}\n}\n`;
  } else if (mode === 'both') {
    css += `[data-theme='dark'] {\n  color-scheme: dark;\n  ${darkVars.join('\n  ')}\n}\n`;
  } else if (mode === 'system') {
    css += `@media (prefers-color-scheme: dark) {\n  :root {\n    color-scheme: dark;\n    ${darkVars.join('\n    ')}\n  }\n}\n`;
  }

  return css;
}

export function generateSCSSTheme(primary: string, darkScheme: Record<string, string>, mode: string): string {
  const vars = [
    `$primary: ${primary};`,
    `$primary-light: ${lighten(primary, 30)};`,
    `$primary-dark: ${darken(primary, 20)};`,
    '$success: #67C23A;',
    '$warning: #E6A23C;',
    '$danger: #F56C6C;',
    '$info: #909399;',
    '$bg: #ffffff;',
    '$bg-page: #f5f7fa;',
    '$surface: #ffffff;',
    '$text-primary: #303133;',
    '$text-secondary: #606266;',
    '$text-muted: #909399;',
    '$border: #dcdfe6;',
    '$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);',
    '$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);',
    '$shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);',
    '$radius-sm: 4px;',
    '$radius-md: 8px;',
    '$radius-lg: 12px;',
    '$font-size-xs: 12px;',
    '$font-size-sm: 14px;',
    '$font-size-base: 16px;',
    '$font-size-lg: 18px;',
    '$font-size-xl: 20px;',
    '',
    `$dark-bg: ${darkScheme.bg || '#0f172a'};`,
    `$dark-surface: ${darkScheme.surface || '#1e293b'};`,
    `$dark-text: ${darkScheme.text || '#e2e8f0'};`,
    '$dark-text-secondary: #94a3b8;',
    '$dark-text-muted: #64748b;',
    '$dark-border: #334155;',
    '',
    `$primary-alpha-10: ${hexToRgba(primary, 0.1)};`,
    `$primary-alpha-20: ${hexToRgba(primary, 0.2)};`,
    `$primary-alpha-50: ${hexToRgba(primary, 0.5)};`,
    '',
    '@function theme-color($color) {',
    '  @return var(--color-#{$color}, $color);',
    '}',
    '',
    '@mixin dark-theme {',
    '  [data-theme="dark"] & {',
    '    @content;',
    '  }',
    '}',
  ];

  return vars.join('\n');
}

export function generateElementPlusVars(primary: string, darkScheme: Record<string, string>): string {
  const lightVars = [
    `--el-color-primary: ${primary};`,
    `--el-color-primary-light-3: ${lighten(primary, 30)};`,
    `--el-color-primary-light-5: ${lighten(primary, 50)};`,
    `--el-color-primary-light-7: ${lighten(primary, 70)};`,
    `--el-color-primary-light-8: ${lighten(primary, 80)};`,
    `--el-color-primary-light-9: ${lighten(primary, 90)};`,
    `--el-color-primary-dark-2: ${darken(primary, 20)};`,
    '--el-color-success: #67C23A;',
    '--el-color-warning: #E6A23C;',
    '--el-color-danger: #F56C6C;',
    '--el-color-info: #909399;',
    '--el-bg-color: #ffffff;',
    '--el-bg-color-page: #f5f7fa;',
    '--el-bg-color-overlay: #ffffff;',
    '--el-text-color-primary: #303133;',
    '--el-text-color-regular: #606266;',
    '--el-text-color-secondary: #909399;',
    '--el-text-color-placeholder: #c0c4cc;',
    '--el-border-color: #dcdfe6;',
    '--el-border-color-light: #e4e7ed;',
    '--el-border-color-lighter: #ebeef5;',
    '--el-border-radius-base: 8px;',
    '--el-border-radius-small: 4px;',
    '--el-border-radius-large: 12px;',
    '--el-font-size-extra-large: 24px;',
    '--el-font-size-large: 18px;',
    '--el-font-size-medium: 16px;',
    '--el-font-size-base: 14px;',
    '--el-font-size-small: 13px;',
    '--el-font-size-extra-small: 12px;',
  ];

  const darkVars = [
    `--el-bg-color: ${darkScheme.bg || '#0f172a'};`,
    `--el-bg-color-page: ${darkScheme.bg || '#0f172a'};`,
    `--el-bg-color-overlay: ${darkScheme.surface || '#1e293b'};`,
    `--el-text-color-primary: ${darkScheme.text || '#e2e8f0'};`,
    '--el-text-color-regular: #cbd5e1;',
    '--el-text-color-secondary: #94a3b8;',
    '--el-text-color-placeholder: #64748b;',
    `--el-border-color: ${darkScheme.surface || '#334155'};`,
    '--el-border-color-light: #475569;',
    '--el-border-color-lighter: #334155;',
    `--el-color-primary: ${lighten(primary, 15)};`,
  ];

  let css = ':root {\n  ' + lightVars.join('\n  ') + '\n}\n';
  css += `[data-theme='dark'] {\n  ` + darkVars.join('\n  ') + '\n}\n';

  return css;
}

export function themeCommand(): Command {
  const cmd = new Command('theme')
    .description('主题定制工具')
    .option('-o, --output <dir>', '输出目录', 'src/styles')
    .option('-f, --format <formats>', '输出格式: css|scss|both', 'both')
    .action(async (options: Record<string, string>) => {
      console.log(chalk.blue('\n🎨 云枢主题定制工具\n'));

      const baseTheme = await select({
        message: '选择基础主题:',
        choices: [
          { name: '浅色主题 (默认)', value: 'light' },
          { name: '深色主题', value: 'dark' },
          { name: '自动跟随系统', value: 'system' },
        ],
      });

      console.log(chalk.cyan('\n💡 提示: 更多高级定制请参考设计令牌文档'));
      console.log(chalk.gray('   https://docs.yunshu.dev/guide/design-tokens\n'));

      const outputDir = path.resolve(process.cwd(), options.output);
      fs.ensureDirSync(outputDir);

      const formats = options.format.split('|');

      if (formats.includes('css')) {
        const cssPath = path.join(outputDir, 'theme.css');
        fs.writeFileSync(cssPath, generateCSS());
        console.log(chalk.green(`✅ CSS 主题已生成: ${chalk.bold(cssPath)}`));
      }

      if (formats.includes('scss')) {
        const scssPath = path.join(outputDir, '_theme.scss');
        fs.writeFileSync(scssPath, generateSCSS());
        console.log(chalk.green(`✅ SCSS 主题已生成: ${chalk.bold(scssPath)}`));
      }

      console.log(chalk.cyan(`\n  在 main.ts 中导入:`));
      console.log(chalk.gray(`  import './styles/theme.css'\n`));
    });

  return cmd;
}
