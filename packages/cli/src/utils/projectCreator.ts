/**
 * yunshu CLI — 项目创建器
 *
 * 根据模板和选项生成项目文件。
 *
 * @module @yunshu/cli/utils/projectCreator
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates')

export type TemplateType = 'basic' | 'admin' | 'full-stack'

export interface CreateProjectOptions {
  name: string
  template: TemplateType
  packageManager: 'pnpm' | 'npm' | 'yarn'
  features?: string[]
}

/**
 * 读取模板文件内容并替换占位符
 */
function renderTemplate(filePath: string, vars: Record<string, string>): string {
  let content = fs.readFileSync(filePath, 'utf-8')
  for (const [key, value] of Object.entries(vars)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }
  return content
}

/**
 * 递归复制模板目录
 */
function copyTemplateDir(
  templateDir: string,
  targetDir: string,
  vars: Record<string, string>
): void {
  const entries = fs.readdirSync(templateDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(templateDir, entry.name)
    const targetName = entry.name.endsWith('.template')
      ? entry.name.slice(0, -9) // 移除 .template 后缀
      : entry.name
    const targetPath = path.join(targetDir, targetName)

    if (entry.isDirectory()) {
      fs.ensureDirSync(targetPath)
      copyTemplateDir(sourcePath, targetPath, vars)
    } else {
      const rendered = renderTemplate(sourcePath, vars)
      fs.writeFileSync(targetPath, rendered)
    }
  }
}

/**
 * 创建项目
 */
export async function createProject(
  options: CreateProjectOptions,
  cwd: string = process.cwd(),
): Promise<void> {
  const { name, template, packageManager } = options
  const targetDir = path.resolve(cwd, name)

  if (await fs.pathExists(targetDir)) {
    throw new Error(`目录 ${name} 已存在`)
  }

  const templateDir = path.join(TEMPLATES_DIR, template)
  if (!fs.existsSync(templateDir)) {
    throw new Error(`模板 ${template} 不存在`)
  }

  await fs.ensureDir(targetDir)

  // 模板变量
  const vars: Record<string, string> = {
    name,
    template,
    packageManager,
  }

  // 复制并渲染模板文件
  copyTemplateDir(templateDir, targetDir, vars)

  // 根据模板类型添加额外文件
  if (template === 'admin') {
    // admin 模板已包含所有文件
  } else if (template === 'full-stack') {
    // full-stack 模板已包含所有文件
  }

  // 生成 README
  await fs.writeFile(
    path.join(targetDir, 'README.md'),
    `# ${name}

> 基于云枢中台创建的${template === 'basic' ? '基础' : template === 'admin' ? '管理后台' : '全栈'}项目

## 快速开始

\`\`\`bash
${packageManager} install
${packageManager} run dev
\`\`\`

## 功能

- Vue 3 + TypeScript
- Vite 构建工具
${template === 'admin' ? '- Element Plus UI 组件库\n- Vue Router 路由\n- Pinia 状态管理' : ''}
${template === 'full-stack' ? '- Express 后端服务\n- Axios HTTP 客户端' : ''}
`
  )

  // 创建 .env.local
  await fs.writeFile(
    path.join(targetDir, '.env.local'),
    `# 本地环境变量
# 请勿提交此文件到版本控制
`
  )
}

/**
 * 获取可用模板列表
 */
export function getAvailableTemplates(): string[] {
  if (!fs.existsSync(TEMPLATES_DIR)) return []
  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}
