/**
 * yunshu create — 项目创建命令
 *
 * 交互式创建新项目，支持选择框架、模板和配置选项。
 *
 * @module @yunshu/cli/commands/create
 */

import { Command } from 'commander';
import input from '@inquirer/input';
import select from '@inquirer/select';
import confirm from '@inquirer/confirm';
import chalk from 'chalk';
import ora from 'ora';
import { createProject } from '../utils/projectCreator';

/** 可用模板 */
const TEMPLATES = {
  basic: { name: '基础模板', desc: 'Vue 3 + TypeScript + 设计令牌', packages: ['@yunshu/ui', '@yunshu/api-client'] },
  admin: { name: '后台管理', desc: '完整后台管理方案 + CRUD 模板', packages: ['@yunshu/ui', '@yunshu/api-client', 'element-plus', 'pinia'] },
  'full-stack': { name: '全栈项目', desc: 'Express + Vue 3 + 数据库集成', packages: ['@yunshu/ui', '@yunshu/api-client', '@yunshu/server-express'] },
};

/** 可用功能选项 */
const FEATURES = [
  { name: '认证系统', value: 'auth', desc: 'JWT 登录/注册/Token 刷新' },
  { name: '权限管理', value: 'permission', desc: 'RBAC 角色权限控制' },
  { name: '主题切换', value: 'theme', desc: '浅色/深色主题 + 系统偏好跟随' },
  { name: '文件上传', value: 'upload', desc: '拖拽上传 + 进度 + 预览' },
  { name: '国际化', value: 'i18n', desc: 'Vue I18n 多语言支持' },
  { name: 'PWA', value: 'pwa', desc: '渐进式 Web 应用支持' },
];

export function createCommand(): Command {
  const cmd = new Command('create')
    .description('创建新项目')
    .argument('[name]', '项目名称')
    .option('-t, --template <type>', '模板类型: basic | admin | full-stack')
    .option('-p, --package-manager <pm>', '包管理器: pnpm | npm | yarn', 'pnpm')
    .option('-y, --yes', '跳过交互，使用默认值')
    .action(async (name?: string, options?: Record<string, string>) => {
      try {
        console.log(chalk.blue('\n☁️  云枢中台 — 项目创建向导\n'));

        // 1. 项目名称
        const projectName = name || await input({
          message: '项目名称:',
          default: 'yunshu-app',
          validate: (v: string) => /^[a-z0-9-_]+$/.test(v) || '名称只能包含小写字母、数字、短横线和下划线',
        });

        // 2. 选择模板
        const template = options?.template || await select({
          message: '选择模板:',
          choices: Object.entries(TEMPLATES).map(([key, t]) => ({
            name: `${t.name} — ${t.desc}`,
            value: key,
          })),
        }) as string;

        // 3. 选择功能
        let features: string[] = [];
        if (options?.yes) {
          features = ['auth', 'permission', 'theme'];
        } else {
          const featureChoices = await select({
            message: '需要哪些功能？（空格选择，回车确认）',
            choices: FEATURES.map((f) => ({
              name: `${f.name} — ${f.desc}`,
              value: f.value,
            })),
          }) as unknown as string[];
          features = Array.isArray(featureChoices) ? featureChoices : [featureChoices];
        }

        // 4. 包管理器
        const pm = options?.packageManager || await select({
          message: '选择包管理器:',
          choices: [
            { name: 'pnpm (推荐)', value: 'pnpm' },
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
          ],
        }) as string;

        // 5. 确认
        console.log(chalk.cyan('\n📋 项目配置摘要:'));
        console.log(`   名称:     ${chalk.bold(projectName)}`);
        console.log(`   模板:     ${chalk.bold(TEMPLATES[template as keyof typeof TEMPLATES]?.name)}`);
        console.log(`   功能:     ${chalk.bold(features.map((f) => FEATURES.find((x) => x.value === f)?.name).join(', ') || '无')}`);
        console.log(`   包管理器: ${chalk.bold(pm)}`);

        if (options?.yes) {
          console.log(chalk.gray('\n   --yes 模式，跳过确认...\n'));
        } else {
          const confirmed = await confirm({ message: '确认创建?' });
          if (!confirmed) {
            console.log(chalk.yellow('\n已取消\n'));
            return;
          }
        }

        // 6. 创建项目
        const spinner = ora('正在创建项目...').start();

        try {
          await createProject({
            name: projectName,
            template: template as keyof typeof TEMPLATES,
            features,
            packageManager: pm as 'pnpm' | 'npm' | 'yarn',
          });
          spinner.succeed('项目创建成功!');
        } catch (err) {
          spinner.fail('项目创建失败');
          throw err;
        }

        // 7. 完成提示
        console.log(chalk.green(`\n✅ 项目 ${chalk.bold(projectName)} 创建完成!\n`));
        console.log(chalk.white('  下一步:'));
        console.log(chalk.cyan(`    cd ${projectName}`));
        console.log(chalk.cyan(`    ${pm} install`));
        console.log(chalk.cyan(`    ${pm} run dev`));
        console.log('');

      } catch (error) {
        console.error(chalk.red('\n创建项目时发生错误:'), error);
        process.exit(1);
      }
    });

  return cmd;
}
