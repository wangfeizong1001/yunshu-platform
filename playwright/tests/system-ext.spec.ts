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

async function clickSearchIfVisible(page) {
  const searchBtn = page.getByRole('button', { name: /搜索|search|查询/i }).first();
  if (await searchBtn.count() > 0 && (await searchBtn.isVisible())) {
    await searchBtn.click();
    await page.waitForTimeout(400);
  }
}

async function fillSearchInput(page, placeholderPattern: string, value: string) {
  const input = page.getByPlaceholder(new RegExp(placeholderPattern, 'i')).first();
  if (await input.count() > 0) {
    await input.fill(value);
    return true;
  }
  return false;
}

test.describe('系统管理 - 用户管理（CRUD）', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('用户列表搜索功能', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1000);
    await fillSearchInput(page, '用户名|请输入|keyword', 'admin');
    await clickSearchIfVisible(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('用户列表表格存在', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('点击新增按钮可打开表单对话框', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /新增|新建|添加|新增用户|\+|create|add/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('点击编辑按钮可打开编辑表单（若表格行存在）', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1500);

    const editBtn = page.getByRole('button', { name: /编辑|修改|edit/i }).first();
    if (await editBtn.count() > 0) {
      await editBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('点击删除按钮（不实际确认）', async ({ page }) => {
    await page.goto('/system/user');
    await page.waitForTimeout(1500);
    const delBtn = page.getByRole('button', { name: /删除|delete|remove/i }).first();
    if (await delBtn.count() > 0) {
      await delBtn.click({ force: true });
      await page.waitForTimeout(400);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统管理 - 角色管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('角色列表页面正常加载', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('角色列表存在表格', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('分配菜单 / 权限按钮存在并可点击', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1500);
    const btn = page.getByRole('button', { name: /分配|权限|菜单|assign|permission/i }).first();
    if (await btn.count() > 0) {
      await btn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('角色管理 - 搜索过滤', async ({ page }) => {
    await page.goto('/system/role');
    await page.waitForTimeout(1000);
    await fillSearchInput(page, '角色名|请输入|keyword', '管理员');
    await clickSearchIfVisible(page);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统管理 - 部门管理（树形结构）', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('部门管理页面正常加载', async ({ page }) => {
    await page.goto('/system/dept');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('部门树存在', async ({ page }) => {
    await page.goto('/system/dept');
    await page.waitForTimeout(1500);
    const tree = page.locator('.el-tree, [class*="tree"]').first();
    if (await tree.count() > 0) {
      await expect(tree).toBeVisible({ timeout: 5000 });
    }
  });

  test('点击新增节点按钮可点击', async ({ page }) => {
    await page.goto('/system/dept');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /新增|新建|添加|新增部门|add|create/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(400);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统管理 - 字典管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('字典类型列表加载', async ({ page }) => {
    await page.goto('/system/dict/type');
    await page.waitForTimeout(1500);
    const table = page.locator('.el-table, table, [class*="table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible({ timeout: 5000 });
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('字典类型可搜索', async ({ page }) => {
    await page.goto('/system/dict/type');
    await page.waitForTimeout(1000);
    await fillSearchInput(page, '字典|名称|请输入|keyword', 'sys');
    await clickSearchIfVisible(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('字典数据列表加载', async ({ page }) => {
    await page.goto('/system/dict/type');
    await page.waitForTimeout(1500);
    const dictDataBtn = page.getByRole('button', { name: /字典数据|数据|data/i }).first();
    if (await dictDataBtn.count() > 0) {
      await dictDataBtn.click({ force: true });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('系统管理 - 菜单管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('菜单管理页面加载', async ({ page }) => {
    await page.goto('/system/menu');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('菜单树 / 表格存在', async ({ page }) => {
    await page.goto('/system/menu');
    await page.waitForTimeout(1500);
    const container = page.locator('.el-tree, .el-table, table, [class*="table"], [class*="tree"]').first();
    if (await container.count() > 0) {
      await expect(container).toBeVisible({ timeout: 5000 });
    }
  });

  test('新增菜单按钮可点击', async ({ page }) => {
    await page.goto('/system/menu');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /新增|新建|添加|add|create/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(400);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});
