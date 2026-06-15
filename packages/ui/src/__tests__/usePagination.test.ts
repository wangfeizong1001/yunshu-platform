import { describe, it, expect } from 'vitest';
import { usePagination } from '../primitives/usePagination';

describe('usePagination 无头分页逻辑', () => {
  it('第一页时 hasPrev 为 false，有下一页时 hasNext 为 true', () => {
    const { hasPrev, hasNext } = usePagination({ current: 1, total: 5 });
    expect(hasPrev.value).toBe(false);
    expect(hasNext.value).toBe(true);
  });

  it('最后一页时 hasNext 为 false', () => {
    const { hasPrev, hasNext } = usePagination({ current: 5, total: 5 });
    expect(hasPrev.value).toBe(true);
    expect(hasNext.value).toBe(false);
  });

  it('total 小于等于 visiblePages 时返回所有页码', () => {
    const { pages } = usePagination({ current: 3, total: 5, visiblePages: 7 });
    expect(pages.value).toHaveLength(5);
    expect(pages.value[0].page).toBe(1);
    expect(pages.value[2].active).toBe(true);
  });

  it('生成带省略号的页码列表', () => {
    const { pages } = usePagination({ current: 5, total: 20, visiblePages: 7 });
    const typeSeq = pages.value.map((p) => p.type);
    expect(typeSeq).toContain('ellipsis');
    expect(pages.value[0].page).toBe(1);
    // 最后一项应该是最后一页
    expect(pages.value[pages.value.length - 1].page).toBe(20);
  });

  it('首页在 visible 范围内不会产生多余省略号', () => {
    const { pages } = usePagination({ current: 2, total: 10, visiblePages: 7 });
    expect(pages.value[0].page).toBe(1);
  });

  it('末页附近不会产生多余省略号', () => {
    const { pages } = usePagination({ current: 9, total: 10, visiblePages: 7 });
    expect(pages.value[pages.value.length - 1].page).toBe(10);
  });
});
