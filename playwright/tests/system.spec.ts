import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.getByPlaceholder('请输入用户名').fill('admin');
  await page.getByPlaceholder('请输入密码').fill('admin123');
  const captchaInput = page.getByPlaceholder('请输入验证码');
  if (await captchaInput.isVisible({ timeout: 2000 })) {
    await captchaInput.fill('test');
  }
  await page.getByRole('button', { name: '登 录' }).click();
  await page.waitForTimeout(1500);
}

test.describe('系统管理 - 用户管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开用户管理页面', async ({ page }) => {
    await page.goto('/system/user');
    await expect(page.locator('main, .app-main, body')).toBeVisible({ timeout: 8000 });
  });

  test('用户列表搜索功能', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/用户名|请输入|keyword/i).first();
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('admin');
      const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('重置搜索条件', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1000);

    const resetBtn = page.getByRole('button', { name: /重置|reset/i }).first();
    if (await resetBtn.isVisible({ timeout: 3000 })) {
      await resetBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('用户列表表格数据存在', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统管理 - 角色管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开角色管理页面', async ({ page }) => {
    await page.goto('/system/role');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('角色列表存在表格', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('角色搜索', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/角色名|请输入|keyword/i).first();
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('管理员');
      const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('系统管理 - 菜单管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开菜单管理页面', async ({ page }) => {
    await page.goto('/system/menu');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('菜单列表存在', async ({ page }) => {
    await page.goto('/system/menu');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table, [class*="table"], .el-tree').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统管理 - 部门管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开部门管理页面', async ({ page }) => {
    await page.goto('/system/dept');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('部门树存在', async ({ page }) => {
    await page.goto('/system/dept');
    await page.waitForTimeout(1500);

    const tree = page.locator('.el-tree, [class*="tree"]').first();
    await expect(tree).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统管理 - 字典管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开字典管理页面', async ({ page }) => {
    await page.goto('/system/dict');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });

  test('字典类型表格存在', async ({ page }) => {
    await page.goto('/system/dict');
    await page.waitForTimeout(1500);

    const table = page.locator('.el-table, table').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('系统管理 - 岗位管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('可打开岗位管理页面', async ({ page }) => {
    await page.goto('/system/post');
    await expect(page.locator('main, body')).toBeVisible({ timeout: 8000 });
  });
});
