<script setup lang="ts">
/**
 * YunPagination — 分页组件
 */

import { usePagination } from '../../primitives/usePagination';
import type { UsePaginationProps } from '../../primitives/usePagination';

const props = defineProps<UsePaginationProps>();

const emit = defineEmits<{
  change: [page: number];
}>();

const { hasPrev, hasNext, pages } = usePagination(props);

function goTo(page: number) {
  if (page !== props.current) {
    emit('change', page);
  }
}
</script>

<template>
  <nav class="yun-pagination" aria-label="分页导航">
    <button
      class="yun-pagination__btn"
      :disabled="!hasPrev"
      @click="goTo(current - 1)"
    >
      ‹ 上一页
    </button>

    <template v-for="(item, idx) in pages" :key="idx">
      <span v-if="item.type === 'ellipsis'" class="yun-pagination__ellipsis">…</span>
      <button
        v-else
        class="yun-pagination__btn"
        :class="{ 'is-active': item.active }"
        @click="goTo(item.page!)"
      >
        {{ item.page }}
      </button>
    </template>

    <button
      class="yun-pagination__btn"
      :disabled="!hasNext"
      @click="goTo(current + 1)"
    >
      下一页 ›
    </button>
  </nav>
</template>

<style scoped>
.yun-pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.yun-pagination__btn {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-base);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0 8px;
}
.yun-pagination__btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}
.yun-pagination__btn.is-active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
.yun-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.yun-pagination__ellipsis {
  width: 36px;
  text-align: center;
  color: var(--text-muted);
}
</style>
