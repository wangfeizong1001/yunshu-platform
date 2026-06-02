/**
 * UI — usePagination 无头组件
 *
 * 封装分页逻辑：页码计算、省略号生成、边界处理。
 *
 * @module @yunshu/ui/primitives/usePagination
 */

import { computed } from 'vue';
import type { ComputedRef } from 'vue';

export interface UsePaginationProps {
  /** 当前页码 */
  current: number;
  /** 总页数 */
  total: number;
  /** 可见页码数（不含省略号） */
  visiblePages?: number;
}

interface PaginationItem {
  type: 'page' | 'ellipsis';
  page?: number;
  active?: boolean;
}

export function usePagination(props: UsePaginationProps) {
  const { current, total, visiblePages = 7 } = props;

  /** 是否有上一页 */
  const hasPrev = computed(() => current > 1);

  /** 是否有下一页 */
  const hasNext = computed(() => current < total);

  /** 生成页码列表 */
  const pages: ComputedRef<PaginationItem[]> = computed(() => {
    if (total <= visiblePages) {
      return Array.from({ length: total }, (_, i) => ({
        type: 'page' as const,
        page: i + 1,
        active: i + 1 === current,
      }));
    }

    const items: PaginationItem[] = [];
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    if (current <= half) {
      end = visiblePages;
    }
    if (current > total - half) {
      start = total - visiblePages + 1;
    }

    // 首页省略号
    if (start > 1) {
      items.push({ type: 'page', page: 1 });
      if (start > 2) items.push({ type: 'ellipsis' });
    }

    // 连续页码
    for (let i = start; i <= end; i++) {
      items.push({ type: 'page', page: i, active: i === current });
    }

    // 末页省略号
    if (end < total) {
      if (end < total - 1) items.push({ type: 'ellipsis' });
      items.push({ type: 'page', page: total });
    }

    return items;
  });

  return { hasPrev, hasNext, pages };
}
