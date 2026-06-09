#!/usr/bin/env node

/**
 * 云枢 CLI — 主入口
 *
 * 提供项目创建、代码生成、主题定制等命令。
 *
 * @module @yunshu/cli
 */
import { Command } from 'commander'
import chalk from 'chalk'
import { createCommand } from './commands/create'
import { generateCommand } from './commands/generate'
import { themeCommand } from './commands/theme'

const program = new Command()

program
  .name('yunshu')
  .description('云枢中台 CLI — 开箱即用的中台前端解决方案')
  .version('0.1.0')
  .addHelpText('after', `
${chalk.dim('示例:')}
  ${chalk.cyan('yunshu create my-app')}              创建新项目
  ${chalk.cyan('yunshu generate page UserList')}      生成 CRUD 页面
  ${chalk.cyan('yunshu generate api user')}           生成 API 模块
  ${chalk.cyan('yunshu theme')}                       启动主题定制工具

${chalk.dim('更多信息:')}
  ${chalk.underline('https://docs.yunshu.dev')}
  `)

// ============================================================================
// 注册命令
// ============================================================================

program.addCommand(createCommand())
program.addCommand(generateCommand())
program.addCommand(themeCommand())

// ============================================================================
// 启动
// ============================================================================

program.parse(process.argv)
