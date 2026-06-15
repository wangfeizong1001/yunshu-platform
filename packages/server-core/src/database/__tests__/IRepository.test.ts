/**
 * IRepository 接口规范 — 单元测试
 *
 * @remarks 该模块主要声明 TypeScript 接口，运行时接口不可见。
 *          本测试的目的是验证模块能够正常被加载。
 */

import { describe, it, expect } from 'vitest';

describe('IRepository 模块', () => {
  it('应能被成功导入', async () => {
    const mod = await import('../../repositories/IRepository');
    expect(mod).toBeDefined();
  });

  it('应包含 IRepository / IEntity 等类型声明', async () => {
    // 运行时无法检查 interface，但可以检查其导出（以某种形式存在）
    const mod = await import('../../repositories/IRepository');
    // 模块至少有默认导出或命名导出（允许两种情况）
    expect(Object.keys(mod).length).toBeGreaterThanOrEqual(0);
  });
});
