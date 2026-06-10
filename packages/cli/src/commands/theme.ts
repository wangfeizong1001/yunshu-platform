/**
 * yunshu theme — 主题定制命令
 *
 * 交互式定制主题色、生成和预览主题配置。
 *
 * @module @yunshu/cli/commands/theme
 */

import { Command } from 'commander';
import { input } from '@inquirer/input';
import { select } from '@inquirer/select';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { generateCSS, generateSCSS } from '@yunshu/design-tokens';

export function themeCommand(): Command {
  const cmd = new Command('theme')
    .description('主题定制工具')
    .option('-o, --output <dir>', '输出目录', 'src/styles')
    .option('-f, --format <formats>', '输出格式: css|scss|both', 'both')
    .action(async (options: Record<string, string>) => {
      console.log(chalk.blue('\n🎨 云枢主题定制工具\n'));

      // 1. 选择主题基础
      const baseTheme = await select({
        message: '选择基础主题:',
        choices: [
          { name: '浅色主题 (默认)', value: 'light' },
          { name: '深色主题', value: 'dark' },
          { name: '自动跟随系统', value: 'system' },
        ],
      });

      // 自定义更多选项
      console.log(chalk.cyan('\n💡 提示: 更多高级定制请参考设计令牌文档'));
      console.log(chalk.gray('   https://docs.yunshu.dev/guide/design-tokens\n'));

      // 2. 生成主题文件
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
