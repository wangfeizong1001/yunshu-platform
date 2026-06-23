import { describe, it, expect } from 'vitest';
import * as index from '../index';

describe('index.ts 导出完整性', () => {
  it('导出所有 primitives composables', () => {
    expect(index.useButton).toBeDefined();
    expect(index.useInput).toBeDefined();
    expect(index.useDialog).toBeDefined();
    expect(index.usePagination).toBeDefined();
  });

  it('导出所有 composables 通用组合式函数', () => {
    expect(index.useTheme).toBeDefined();
    expect(index.useForm).toBeDefined();
    expect(index.useTable).toBeDefined();
  });

  it('导出所有 styled 组件', () => {
    expect(index.YunButton).toBeDefined();
    expect(index.YunInput).toBeDefined();
    expect(index.YunDialog).toBeDefined();
    expect(index.YunPagination).toBeDefined();
    expect(index.YunEmpty).toBeDefined();
    expect(index.YunLoading).toBeDefined();
  });

  it('导出所有 business 组件', () => {
    expect(index.YunErrorPage).toBeDefined();
    expect(index.YunDataTable).toBeDefined();
    expect(index.YunSearchForm).toBeDefined();
    expect(index.YunFileUpload).toBeDefined();
  });
});
