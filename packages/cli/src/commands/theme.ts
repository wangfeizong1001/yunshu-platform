/**
 * yunshu theme — 主题定制工具
 *
 * 交互式定制主题色、生成和预览主题配置。
 *
 * @module @yunshu/cli/commands/theme
 */

import { Command } from 'commander'
import { select, input, confirm } from '@inquirer/prompts'
import { ExitPromptError, CancelPromptError } from '@inquirer/core'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

const PRIMARY_COLORS: Record<string, string> = {
  blue: '#409EFF',
  green: '#67C23A',
  red: '#F56C6C',
  purple: '#8a2be2',
  orange: '#E6A23C',
  cyan: '#17a2b8',
  indigo: '#6366f1',
  custom: '',
}

const DARK_COLORS: Record<string, { primary: string; bg: string; surface: string; text: string }> = {
  dark: {
    primary: '#409EFF',
    bg: '#0f172a',
    surface: '#1e293b',
    text: '#e2e8f0',
  },
  slate: {
    primary: '#818cf8',
    bg: '#1e293b',
    surface: '#334155',
    text: '#f1f5f9',
  },
  midnight: {
    primary: '#06b6d4',
    bg: '#0f172a',
    surface: '#1e3a5f',
    text: '#f1f5f9',
  },
}

export function themeCommand(): Command {
  const cmd = new Command('theme')
    .description('主题定制工具')
    .option('-o, --output <dir>', '输出目录', 'src/styles')
    .option('-f, --format <formats>', '输出格式: css|scss|both', 'both')
    .action(async (options: Record<string, string>) => {
      console.log(chalk.blue('\n🎨 云枢主题定制工具\n'))

      try {
        // 1. 选择主题模式
        const mode = (await select({
          message: '选择主题模式:',
          choices: [
            { name: '浅色主题 (默认)', value: 'light' },
            { name: '深色主题', value: 'dark' },
            { name: '双主题 (浅色 + 深色)', value: 'both' },
            { name: '跟随系统', value: 'system' },
          ],
        })) as string

        // 2. 选择主色
        const colorKey = (await select({
          message: '选择主色调:',
          choices: [
            { name: '🔵 蓝色 (Element Plus 默认)', value: 'blue' },
            { name: '🟢 绿色', value: 'green' },
            { name: '🔴 红色', value: 'red' },
            { name: '🟣 紫色', value: 'purple' },
            { name: '🟠 橙色', value: 'orange' },
            { name: '🩵 青色', value: 'cyan' },
            { name: '💜 靛青', value: 'indigo' },
            { name: '🎨 自定义颜色', value: 'custom' },
          ],
        })) as string

        let primaryColor = PRIMARY_COLORS[colorKey]

        if (colorKey === 'custom') {
          primaryColor = (await input({
            message: '请输入十六进制颜色值 (例如: #409EFF):',
            default: '#409EFF',
            validate: (val: string) =>
              /^#[0-9A-Fa-f]{6}$/.test(val) || '请输入有效的十六进制颜色 (如 #409EFF)',
          })) as string
        }

        // 3. 选择深色配色
        let darkScheme = DARK_COLORS['dark']
        if (mode === 'dark' || mode === 'both' || mode === 'system') {
          const darkKey = (await select({
            message: '选择深色主题配色:',
            choices: [
              { name: '经典深色', value: 'dark' },
              { name: '石板灰', value: 'slate' },
              { name: '午夜蓝', value: 'midnight' },
            ],
          })) as string
          darkScheme = DARK_COLORS[darkKey]
        }

        // 4. 生成配置
        console.log(chalk.cyan('\n📋 配置摘要:'))
        console.log(`   模式: ${chalk.bold(mode)}`)
        console.log(`   主色: ${chalk.bold(primaryColor)}`)
        console.log(`   输出: ${chalk.bold(options.output)}`)
        console.log(`   格式: ${chalk.bold(options.format)}\n`)

        const confirmed = (await confirm({
          message: '确认生成主题文件?',
          default: true,
        })) as boolean

        if (!confirmed) {
          console.log(chalk.yellow('已取消\n'))
          return
        }

        // 5. 生成主题文件
        const outputDir = path.resolve(process.cwd(), options.output)
        fs.ensureDirSync(outputDir)

        const formats = options.format.split('|')

        if (formats.includes('css')) {
          const cssPath = path.join(outputDir, 'theme.css')
          const cssContent = generateCSSTheme(primaryColor, darkScheme, mode)
          fs.writeFileSync(cssPath, cssContent)
          console.log(chalk.green(`✅ CSS 主题已生成: ${chalk.bold(cssPath)}`))
        }

        if (formats.includes('scss')) {
          const scssPath = path.join(outputDir, '_theme.scss')
          const scssContent = generateSCSSTheme(primaryColor, darkScheme, mode)
          fs.writeFileSync(scssPath, scssContent)
          console.log(chalk.green(`✅ SCSS 主题已生成: ${chalk.bold(scssPath)}`))
        }

        // 6. 生成 Element Plus 主题变量
        const epVarsPath = path.join(outputDir, 'element-plus.scss')
        const epVars = generateElementPlusVars(primaryColor, darkScheme)
        fs.writeFileSync(epVarsPath, epVars)
        console.log(chalk.green(`✅ Element Plus 变量已生成: ${chalk.bold(epVarsPath)}`))

        // 7. 生成使用说明
        console.log(chalk.cyan('\n📖 使用说明:'))
        console.log(chalk.white('  1. 在 main.ts 中导入主题:'))
        console.log(chalk.gray(`     import './styles/theme.css'`))
        console.log(chalk.white('  2. 切换主题:'))
        console.log(chalk.gray(`     document.documentElement.setAttribute('data-theme', 'dark')`))
        console.log('')

        console.log(chalk.green('🎉 主题生成完成!\n'))
      } catch (error) {
        // 用户中断或错误
        if (error instanceof ExitPromptError || error instanceof CancelPromptError) {
          console.log(chalk.yellow('\n已取消\n'))
        } else {
          console.error(chalk.red('\n生成主题时出错:'), error)
          process.exit(1)
        }
      }
    })

  return cmd
}

/**
 * 生成 CSS 主题
 */
export function generateCSSTheme(
  primary: string,
  darkScheme: { bg: string; surface: string; text: string },
  mode: string
): string {
  const lightVars = `/* ===== 浅色主题变量 ===== */
:root,
[data-theme='light'] {
  --color-primary: ${primary};
  --color-primary-light: ${lighten(primary, 30)};
  --color-primary-dark: ${darken(primary, 20)};
  --color-success: #67C23A;
  --color-warning: #E6A23C;
  --color-danger: #F56C6C;
  --color-info: #909399;

  --color-bg: #ffffff;
  --color-bg-page: #f5f7fa;
  --color-surface: #ffffff;
  --color-surface-2: #f8f9fa;

  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #a8abb2;

  --color-border: #dcdfe6;
  --color-border-light: #e4e7ed;
  --color-border-lighter: #ebeef5;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  --radius-sm: 2px;
  --radius: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-round: 20px;
  --radius-circle: 50%;

  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 22px;
  --font-size-3xl: 28px;

  color-scheme: light;
}
`

  const darkVars = `/* ===== 深色主题变量 ===== */
[data-theme='dark'] {
  --color-primary: ${lighten(primary, 15)};
  --color-primary-light: ${lighten(primary, 35)};
  --color-primary-dark: ${darken(primary, 10)};
  --color-success: #67C23A;
  --color-warning: #E6A23C;
  --color-danger: #F56C6C;
  --color-info: #909399;

  --color-bg: ${darkScheme.bg};
  --color-bg-page: ${darkScheme.bg};
  --color-surface: ${darkScheme.surface};
  --color-surface-2: ${lighten(darkScheme.surface, 5)};

  --color-text-primary: ${darkScheme.text};
  --color-text-regular: ${lighten(darkScheme.text, 10)};
  --color-text-secondary: ${lighten(darkScheme.text, 30)};
  --color-text-placeholder: ${lighten(darkScheme.text, 40)};

  --color-border: #334155;
  --color-border-light: #475569;
  --color-border-lighter: #64748b;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);

  color-scheme: dark;
}
`

  const systemVars = `/* ===== 跟随系统 ===== */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-bg: ${darkScheme.bg};
    --color-surface: ${darkScheme.surface};
    --color-text-primary: ${darkScheme.text};
    color-scheme: dark;
  }
}
`

  let content = `/**
 * 云枢中台 — 自动生成的主题文件
 *
 * 主色: ${primary}
 * 模式: ${mode}
 * 生成时间: ${new Date().toISOString()}
 *
 * 使用方式:
 *   import './styles/theme.css'
 *   // 切换主题: document.documentElement.setAttribute('data-theme', 'dark')
 */

${lightVars}
`

  if (mode === 'dark' || mode === 'both') {
    content += darkVars
  }
  if (mode === 'system' || mode === 'both') {
    content += systemVars
  }

  return content
}

/**
 * 生成 SCSS 主题变量
 */
export function generateSCSSTheme(
  primary: string,
  darkScheme: { bg: string; surface: string; text: string },
  _mode: string
): string {
  return `// ============================================================
// 云枢中台 — 自动生成的 SCSS 主题变量
// 主色: ${primary}
// 生成时间: ${new Date().toISOString()}
// ============================================================

// ===== 主色调 =====
$primary: ${primary};
$primary-light: ${lighten(primary, 30)};
$primary-dark: ${darken(primary, 20)};
$primary-alpha-10: ${hexToRgba(primary, 0.1)};
$primary-alpha-20: ${hexToRgba(primary, 0.2)};
$primary-alpha-50: ${hexToRgba(primary, 0.5)};

// ===== 语义化颜色 =====
$success: #67C23A;
$warning: #E6A23C;
$danger: #F56C6C;
$info: #909399;

// ===== 背景色 =====
$bg: #ffffff;
$bg-page: #f5f7fa;
$surface: #ffffff;

// ===== 文本色 =====
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;

// ===== 边框色 =====
$border: #dcdfe6;
$border-light: #e4e7ed;

// ===== 阴影 =====
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

// ===== 圆角 =====
$radius-sm: 2px;
$radius: 4px;
$radius-md: 6px;
$radius-lg: 8px;
$radius-xl: 12px;

// ===== 字号 =====
$font-size-xs: 12px;
$font-size-sm: 13px;
$font-size-base: 14px;
$font-size-lg: 16px;
$font-size-xl: 18px;
$font-size-2xl: 22px;
$font-size-3xl: 28px;

// ===== 间距 =====
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// ===== 深色主题 =====
$dark-bg: ${darkScheme.bg};
$dark-surface: ${darkScheme.surface};
$dark-text: ${darkScheme.text};

// ===== 工具函数 =====
@function theme-color($level) {
  @return var(--color-primary);
}

@mixin dark-theme {
  [data-theme='dark'] & {
    @content;
  }
}
`
}

/**
 * 生成 Element Plus 主题变量
 */
export function generateElementPlusVars(
  primary: string,
  darkScheme: { bg: string; surface: string; text: string }
): string {
  return `// ============================================================
// 云枢中台 — Element Plus 主题变量覆盖
// 此文件应在 element-plus/dist/index.css 之后导入
// ============================================================

:root {
  // 主色
  --el-color-primary: ${primary};
  --el-color-primary-light-3: ${lighten(primary, 15)};
  --el-color-primary-light-5: ${lighten(primary, 25)};
  --el-color-primary-light-7: ${lighten(primary, 35)};
  --el-color-primary-light-8: ${lighten(primary, 40)};
  --el-color-primary-light-9: ${lighten(primary, 45)};
  --el-color-primary-dark-2: ${darken(primary, 20)};

  // 圆角
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-large: 8px;

  // 字号
  --el-font-size-extra-large: 20px;
  --el-font-size-large: 18px;
  --el-font-size-medium: 16px;
  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-extra-small: 12px;
}

// 深色主题
[data-theme='dark'] {
  --el-color-primary: ${lighten(primary, 15)};
  --el-bg-color: ${darkScheme.bg};
  --el-bg-color-page: ${darkScheme.bg};
  --el-bg-color-overlay: ${darkScheme.surface};
  --el-text-color-primary: ${darkScheme.text};
  --el-text-color-regular: ${lighten(darkScheme.text, 15)};
  --el-border-color: #334155;
  --el-border-color-light: #475569;
}
`
}

// ===== 颜色工具函数 =====

export function lighten(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const amount = percent / 100
  const newR = Math.round(r + (255 - r) * amount)
  const newG = Math.round(g + (255 - g) * amount)
  const newB = Math.round(b + (255 - b) * amount)
  return rgbToHex(newR, newG, newB)
}

export function darken(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const amount = percent / 100
  const newR = Math.round(r * (1 - amount))
  const newG = Math.round(g * (1 - amount))
  const newB = Math.round(b * (1 - amount))
  return rgbToHex(newR, newG, newB)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  return { r, g, b }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
