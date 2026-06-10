/**
 * E2E：文件上传安全
 *
 * 覆盖：
 *  1. 上传合法小 PNG → 成功
 *  2. 上传超大文件（超过大小限制）→ 失败提示
 *  3. 上传 .exe 恶意扩展名 → 被拒绝
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

test.describe('文件上传安全', () => {
  let smallPngPath: string;
  let hugePath: string;
  let exePath: string;

  test.beforeAll(async () => {
    // 构造合法小 PNG 8x8 像素（含 IHDR 最小格式）
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x08,
      0x08, 0x06, 0x00, 0x00, 0x00, 0xc4, 0x0f, 0xbe,
      0x8b, 0x00, 0x00, 0x00, 0x15, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9c, 0x62, 0xf8, 0xff, 0xff, 0x3f,
      0x00, 0x05, 0xfe, 0x02, 0xfe, 0xdc, 0xcc, 0x59,
      0xe7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
      0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
    smallPngPath = path.join(os.tmpdir(), `yunshu-e2e-${Date.now()}.png`);
    fs.writeFileSync(smallPngPath, png);

    // 20MB 伪造文件（超过 10MB 默认限制）
    hugePath = path.join(os.tmpdir(), `yunshu-e2e-huge-${Date.now()}.bin`);
    fs.writeFileSync(hugePath, Buffer.alloc(20 * 1024 * 1024, 0x61));

    // .exe 伪造文件（扩展名即可触发拒绝）
    exePath = path.join(os.tmpdir(), `yunshu-e2e-${Date.now()}.exe`);
    fs.writeFileSync(exePath, Buffer.alloc(1024, 0x61));
  });

  test.afterAll(async () => {
    for (const p of [smallPngPath, hugePath, exePath]) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  });

  async function tryUpload(
    page: import('@playwright/test').Page,
    file: string,
  ): Promise<import('@playwright/test').Locator> {
    // 假设系统存在「系统管理 > 文件上传」页，或首页有上传组件
    try {
      await page.goto('/system/file');
    } catch {
      // 兜底：首页
      await page.goto('/');
    }
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeVisible({ timeout: 10_000 });
    await fileInput.setInputFiles(file);
    // 触发提交
    const submit = page.getByRole('button', { name: /上传|upload|submit/i }).first();
    if (await submit.count() > 0) {
      await submit.click();
    }
    return page.getByText(/成功|fail|失败|过大|不支持|not allowed|拒绝|invalid/i).first();
  }

  test('合法 PNG 上传成功', async ({ page }) => {
    const msg = await tryUpload(page, smallPngPath);
    await expect(msg).toContainText(/成功|ok|success/i, { timeout: 10_000 });
  });

  test('超大文件被拒绝（前端或后端大小限制）', async ({ page }) => {
    const msg = await tryUpload(page, hugePath);
    await expect(msg).toContainText(/过大|too large|size|limit/i, { timeout: 10_000 });
  });

  test('.exe 扩展名被拒绝', async ({ page }) => {
    const msg = await tryUpload(page, exePath);
    await expect(msg).toContainText(/不支持|拒绝|forbidden|invalid|not allow|type/i, { timeout: 10_000 });
  });
});
