import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createProject, getAvailableTemplates } from '../projectCreator';

describe('projectCreator', () => {
  describe('getAvailableTemplates', () => {
    it('should return at least basic, admin, and full-stack templates', () => {
      const templates = getAvailableTemplates();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThanOrEqual(3);
      expect(templates).toContain('basic');
      expect(templates).toContain('admin');
      expect(templates).toContain('full-stack');
    });
  });

  describe('createProject', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yunshu-cli-test-'));
    });

    afterEach(() => {
      fs.removeSync(testDir);
    });

    it('should create project with basic template', async () => {
      const projectName = 'test-basic';
      await createProject(
        {
          name: projectName,
          template: 'basic',
          packageManager: 'pnpm',
        },
        testDir,
      );

      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(projectPath)).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'README.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '.env.local'))).toBe(true);

      // 验证模板变量被正确替换
      const pkgContent = fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8');
      expect(pkgContent).not.toContain('{{name}}');
      expect(pkgContent).not.toContain('{{packageManager}}');

      const readmeContent = fs.readFileSync(path.join(projectPath, 'README.md'), 'utf-8');
      expect(readmeContent).toContain(projectName);
      expect(readmeContent).toContain('pnpm');
    });

    it('should create project with admin template', async () => {
      const projectName = 'test-admin';
      await createProject(
        {
          name: projectName,
          template: 'admin',
          packageManager: 'npm',
        },
        testDir,
      );

      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(projectPath)).toBe(true);

      // admin 模板应该包含管理后台特有的文件
      expect(fs.existsSync(path.join(projectPath, 'src/router'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'src/layouts'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'src/views'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'src/App.vue'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'src/main.ts'))).toBe(true);

      // 验证 README 内容
      const readmeContent = fs.readFileSync(path.join(projectPath, 'README.md'), 'utf-8');
      expect(readmeContent).toContain('管理后台');
    });

    it('should create project with full-stack template', async () => {
      const projectName = 'test-fullstack';
      await createProject(
        {
          name: projectName,
          template: 'full-stack',
          packageManager: 'yarn',
        },
        testDir,
      );

      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(projectPath)).toBe(true);

      // full-stack 模板应该包含服务端和前端文件
      expect(fs.existsSync(path.join(projectPath, 'server'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'web'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'web/App.vue'))).toBe(true);

      // 验证 README 内容
      const readmeContent = fs.readFileSync(path.join(projectPath, 'README.md'), 'utf-8');
      expect(readmeContent).toContain('全栈');
    });

    it('should throw error when directory already exists', async () => {
      const projectName = 'existing-dir';
      await fs.ensureDir(path.join(testDir, projectName));

      await expect(
        createProject(
          {
            name: projectName,
            template: 'basic',
            packageManager: 'pnpm',
          },
          testDir,
        ),
      ).rejects.toThrow();
    });

    it('should throw error when template does not exist', async () => {
      await expect(
        createProject(
          {
            name: 'test-invalid',
            template: 'non-existent-template' as 'basic',
            packageManager: 'pnpm',
          },
          testDir,
        ),
      ).rejects.toThrow();
    });

    it('should render template variables in files', async () => {
      const projectName = 'test-render';
      await createProject(
        {
          name: projectName,
          template: 'basic',
          packageManager: 'pnpm',
        },
        testDir,
      );

      const projectPath = path.join(testDir, projectName);

      // 验证 .template 文件被处理且不保留 .template 后缀
      const templateFiles = fs.readdirSync(projectPath);
      for (const file of templateFiles) {
        expect(file).not.toMatch(/\.template$/);
      }

      // 验证文件内容中没有未替换的模板变量占位符
      // (注意: Vue 模板中的 {{ title }} 等不是模板变量)
      const checkNoTemplatePlaceholders = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            checkNoTemplatePlaceholders(fullPath);
          } else if (entry.isFile() && /\.(ts|js|vue|json|html|scss|css|md)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            // 检查我们已知的模板变量是否已被替换
            expect(content).not.toContain('{{name}}');
            expect(content).not.toContain('{{template}}');
            expect(content).not.toContain('{{packageManager}}');
          }
        }
      };
      checkNoTemplatePlaceholders(projectPath);
    });
  });
});
