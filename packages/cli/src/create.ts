#!/usr/bin/env node

/**
 * create-yunshu — npm create 入口
 *
 * npm create yunshu my-app
 * → 等同于 yunshu create my-app
 *
 * @module @yunshu/cli/create
 */

// 此文件由 tsup 构建为 dist/create.js，作为 create-yunshu 命令的入口
// 实际逻辑复用 createCommand
import { createCommand } from './commands/create'

const cmd = createCommand()
cmd.parse(['create', ...process.argv.slice(2)])
