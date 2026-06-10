<script setup lang="ts" generic="T extends Record<string, unknown>">
  /**
   * YunDataTable — 通用数据表格组件
   *
   * 沉淀自云枢 DataTableView 组件，提供：
   * - 自动分页加载
   * - 排序切换
   * - 多选支持
   * - 自定义列渲染
   * - 加载/空状态集成
   */
  import { ref, onMounted } from 'vue';
  import YunPagination from '../../styled/Pagination/Pagination.vue';
  import YunLoading from '../../styled/Loading/Loading.vue';
  import YunEmpty from '../../styled/Empty/Empty.vue';

  export interface TableColumn {
    key: string;
    title: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
  }

  export interface DataTableProps {
    columns: TableColumn[];
    /** 数据获取函数 */
    fetchFn: (params: {
      page: number;
      limit: number;
      sort: string;
      order: 'asc' | 'desc';
    }) => Promise<{ list: T[]; total: number }>;
    /** 每页默认数量 */
    pageSize?: number;
    /** 行键名 */
    rowKey?: string;
    /** 是否可选 */
    selectable?: boolean;
  }

  const props = withDefaults(defineProps<DataTableProps>(), {
    pageSize: 10,
    rowKey: 'id',
    selectable: false,
  });

  const emit = defineEmits<{
    selectionChange: [rows: T[]];
    rowClick: [row: T, index: number];
  }>();

  const data = ref<T[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const currentPage = ref(1);
  const sortField = ref('');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const selectedKeys = ref<Set<string>>(new Set());

  async function loadData() {
    loading.value = true;
    try {
      const result = await props.fetchFn({
        page: currentPage.value,
        limit: props.pageSize,
        sort: sortField.value || 'createdAt',
        order: sortOrder.value,
      });
      data.value = result.list;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function handleSort(col: TableColumn) {
    if (!col.sortable) return;
    if (sortField.value === col.key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = col.key;
      sortOrder.value = 'desc';
    }
    currentPage.value = 1;
    loadData();
  }

  function handlePageChange(page: number) {
    currentPage.value = page;
    loadData();
  }

  function handleSelect(row: T) {
    const key = String(row[props.rowKey]);
    if (selectedKeys.value.has(key)) {
      selectedKeys.value.delete(key);
    } else {
      selectedKeys.value.add(key);
    }
    const selected = data.value.filter((r) => selectedKeys.value.has(String(r[props.rowKey])));
    emit('selectionChange', selected);
  }

  function getSortIcon(col: TableColumn): string {
    if (sortField.value !== col.key) return '↕';
    return sortOrder.value === 'asc' ? '↑' : '↓';
  }

  onMounted(loadData);

  const totalPages = ref(0);
</script>

<template>
  <div class="yun-data-table">
    <div class="yun-data-table__wrapper">
      <table class="yun-data-table__table">
        <thead>
          <tr>
            <th v-if="selectable" class="yun-data-table__check-cell" style="width: 40px">
              <input
                type="checkbox"
                @change="
                  (e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    selectedKeys = new Set(checked ? data.map((r) => String(r[rowKey])) : []);
                    emit('selectionChange', checked ? [...data] : []);
                  }
                "
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
              :class="{ 'is-sortable': col.sortable }"
              @click="handleSort(col)"
            >
              {{ col.title }}
              <span v-if="col.sortable" class="yun-data-table__sort-icon">
                {{ getSortIcon(col) }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr>
              <td :colspan="columns.length + (selectable ? 1 : 0)"><YunLoading /></td>
            </tr>
          </template>
          <template v-else-if="data.length === 0">
            <tr>
              <td :colspan="columns.length + (selectable ? 1 : 0)"><YunEmpty /></td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(row, idx) in data"
              :key="String(row[rowKey])"
              :class="{ 'is-selected': selectedKeys.has(String(row[rowKey])) }"
              @click="emit('rowClick', row, idx)"
            >
              <td v-if="selectable" class="yun-data-table__check-cell">
                <input
                  type="checkbox"
                  :checked="selectedKeys.has(String(row[rowKey]))"
                  @click.stop
                  @change="handleSelect(row)"
                />
              </td>
              <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align || 'left' }">
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="total > pageSize" class="yun-data-table__pagination">
      <YunPagination
        :current="currentPage"
        :total="Math.ceil(total / pageSize)"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
  .yun-data-table {
    background: var(--surface-1);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
  }

  .yun-data-table__wrapper {
    overflow-x: auto;
  }

  .yun-data-table__table {
    width: 100%;
    border-collapse: collapse;
  }

  .yun-data-table__table th {
    padding: 12px 16px;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    user-select: none;
  }

  .yun-data-table__table th.is-sortable {
    cursor: pointer;
  }
  .yun-data-table__table th.is-sortable:hover {
    color: var(--primary);
  }

  .yun-data-table__sort-icon {
    margin-left: 4px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .yun-data-table__table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }

  .yun-data-table__table tbody tr:hover {
    background: var(--card-hover);
  }

  .yun-data-table__table tbody tr.is-selected {
    background: var(--primary-alpha-10);
  }

  .yun-data-table__check-cell {
    text-align: center;
  }

  .yun-data-table__pagination {
    padding: 16px;
    display: flex;
    justify-content: center;
    border-top: 1px solid var(--divider);
  }
</style>
