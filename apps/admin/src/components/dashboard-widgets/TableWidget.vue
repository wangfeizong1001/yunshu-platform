<template>
  <div class="table-widget">
    <div class="table-title" v-if="config?.title">{{ config.title }}</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="calc(100% - 30px)"
      :header-cell-style="headerStyle"
      :cell-style="cellStyle"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
/**
 * 数据表格组件
 * 用于大屏设计器中渲染数据表格
 */
import { ref, watch, onMounted, computed } from 'vue';
import { fetchDataFromSource } from './data-source-utils';

// 组件属性定义
interface IWidgetProps {
  config?: {
    title?: string;
    dataSource?: {
      type: 'mock' | 'api';
      url?: string;
      method?: 'GET' | 'POST';
    };
    columns?: Array<{ prop: string; label: string; width?: number }>;
  };
}

const props = withDefaults(defineProps<IWidgetProps>(), {
  config: () => ({
    title: '数据表格',
    dataSource: { type: 'mock' },
    columns: [
      { prop: 'name', label: '名称', width: 120 },
      { prop: 'value', label: '数值' },
      { prop: 'status', label: '状态', width: 100 },
    ],
  }),
});

// Mock 数据
const mockData = [
  { name: '项目A', value: 100, status: '正常' },
  { name: '项目B', value: 200, status: '正常' },
  { name: '项目C', value: 150, status: '异常' },
  { name: '项目D', value: 300, status: '正常' },
  { name: '项目E', value: 250, status: '正常' },
];

const tableData = ref<Array<Record<string, unknown>>>([]);

// 表格列配置
const columns = computed(() => {
  return props.config?.columns || [
    { prop: 'name', label: '名称', width: 120 },
    { prop: 'value', label: '数值' },
    { prop: 'status', label: '状态', width: 100 },
  ];
});

// 表头样式
const headerStyle = {
  background: 'rgba(0, 102, 255, 0.2)',
  color: '#00d4ff',
  borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
};

// 单元格样式
const cellStyle = {
  background: 'rgba(0, 102, 255, 0.05)',
  color: '#fff',
  borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
};

// 获取数据
const fetchTableData = async () => {
  const dataSource = props.config?.dataSource;
  if (dataSource?.type === 'api' && dataSource.url) {
    try {
      const result = await fetchDataFromSource(dataSource);
      if (result && result.tableData) {
        tableData.value = result.tableData;
      }
    } catch (error) {
      console.error('获取表格数据失败:', error);
      tableData.value = mockData;
    }
  } else {
    tableData.value = mockData;
  }
};

// 监听数据源变化
watch(
  () => props.config?.dataSource,
  () => {
    fetchTableData();
  },
  { deep: true }
);

onMounted(() => {
  fetchTableData();
});
</script>

<style scoped lang="scss">
.table-widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: rgba(0, 102, 255, 0.05);
  border-radius: 4px;
}

.table-title {
  font-size: 14px;
  color: #00d4ff;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

:deep(.el-table) {
  background: transparent;

  .el-table__body-wrapper {
    background: transparent;
  }

  .el-table__row {
    background: transparent;

    &:hover > td {
      background: rgba(0, 212, 255, 0.1);
    }
  }

  .el-table__empty-block {
    background: transparent;
  }
}
</style>