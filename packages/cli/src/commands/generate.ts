/**
 * yunshu generate — 代码生成命令
 *
 * 快速生成页面、API 模块、组件、Service 等样板代码。
 *
 * @module @yunshu/cli/commands/generate
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

/** 代码生成器映射 */
const GENERATORS: Record<string, (name: string, options: Record<string, string>) => string> = {
  /** 生成 CRUD 页面 */
  page(name: string) {
    const ComponentName = toPascalCase(name);
    return `<script setup lang="ts">
/**
 * ${ComponentName} — ${name}管理页面
 */
import { ref } from 'vue';
import { useApiList } from '@yunshu/api-client/vue';
// import { ${name}Api } from '@/api/${name}.api';

// 如需对接真实 API，取消上面注释并实现对应 API 模块
const { data, loading, execute, setPage } = useApiList(
  async (params) => {
    // TODO: 替换为真实 API 调用
    return { data: { list: [], total: 0 } };
  }
);

const searchForm = ref({});
const dialogVisible = ref(false);
const editItem = ref(null);

function handleSearch(values: Record<string, unknown>) {
  searchForm.value = values;
  execute(values);
}

function handleCreate() {
  editItem.value = null;
  dialogVisible.value = true;
}

function handleEdit(row: Record<string, unknown>) {
  editItem.value = row;
  dialogVisible.value = true;
}

function handleDelete(id: string) {
  // TODO: 添加删除确认
}
</script>

<template>
  <div class="${name}-page">
    <!-- 搜索区域 -->
    <SearchForm :fields="[]" @search="handleSearch" />

    <!-- 操作栏 -->
    <div class="toolbar">
      <YunButton variant="primary" @click="handleCreate">新增</YunButton>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="[]"
      :fetch-fn="async (params) => ({ list: [], total: 0 })"
      @row-click="handleEdit"
    />

    <!-- 编辑弹窗 -->
    <YunDialog v-model:open="dialogVisible" title="编辑">
      <p>表单内容</p>
    </YunDialog>
  </div>
</template>

<style scoped>
.${name}-page {
  padding: var(--spacing-lg);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}
</style>
`;
  },

  /** 生成 API 模块 */
  api(name: string) {
    return `/**
 * ${name} API 模块
 *
 * 基于 @yunshu/api-client 的 BaseAPI 模式
 */
import { BaseAPI } from '@yunshu/api-client';
import { httpClient } from '@/api/http';

interface ${toPascalCase(name)}Item {
  id: string;
  // TODO: 定义字段
}

class ${toPascalCase(name)}API extends BaseAPI<${toPascalCase(name)}Item> {
  protected endpoint = '/${name}';

  // 自定义方法示例
  async getByStatus(status: string) {
    return this.getList({ status } as any);
  }
}

export const ${name}Api = new ${toPascalCase(name)}API(httpClient);
export default ${name}Api;
`;
  },

  /** 生成组件 */
  component(name: string) {
    const ComponentName = toPascalCase(name);
    return `<script setup lang="ts">
/**
 * ${ComponentName} 组件
 */
interface Props {
  // TODO: 定义属性
}

const props = defineProps<Props>();

const emit = defineEmits<{
  // TODO: 定义事件
}>();
</script>

<template>
  <div class="${name}">
    <slot />
  </div>
</template>

<style scoped>
.${name} {
  /* TODO: 样式 */
}
</style>
`;
  },
};

export function generateCommand(): Command {
  const cmd = new Command('generate')
    .alias('g')
    .description('代码生成')
    .argument('<type>', '生成类型: page | api | component')
    .argument('<name>', '名称 (kebab-case)')
    .option('-d, --dir <directory>', '输出目录', 'src')
    .action((type: string, name: string, options: Record<string, string>) => {
      const generator = GENERATORS[type];
      if (!generator) {
        console.error(chalk.red(`未知的生成类型: ${type}。支持: ${Object.keys(GENERATORS).join(', ')}`));
        process.exit(1);
      }

      // 生成代码
      const code = generator(name, options);

      // 确定输出路径
      const outputMap: Record<string, string> = {
        page: path.join(options.dir, 'views', name, 'index.vue'),
        api: path.join(options.dir, 'api', `${name}.api.ts`),
        component: path.join(options.dir, 'components', `${name}.vue`),
      };

      const outputPath = path.resolve(process.cwd(), outputMap[type]!);

      // 确保目录存在
      fs.ensureDirSync(path.dirname(outputPath));

      // 写入文件
      fs.writeFileSync(outputPath, code.trim() + '\n');

      console.log(chalk.green(`✅ ${type} ${chalk.bold(name)} 已生成`));
      console.log(chalk.gray(`   ${outputPath}`));
    });

  return cmd;
}

/** kebab-case → PascalCase */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/** kebab-case → camelCase */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/** any → kebab-case */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[-_]+/g, '-')
    .toLowerCase();
}

export const generators = {
  page: {
    generate: (name: string) => GENERATORS.page(name, {}),
    extension: 'vue',
    description: '生成页面组件',
  },
  api: {
    generate: (name: string) => GENERATORS.api(name, {}),
    extension: 'ts',
    description: '生成 API 模块',
  },
  component: {
    generate: (name: string) => GENERATORS.component(name, {}),
    extension: 'vue',
    description: '生成 Vue 组件',
  },
  store: {
    generate: (name: string) => {
      const pascalName = toPascalCase(name);
      const camelName = toCamelCase(name);
      return `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const use${pascalName}Store = defineStore('${camelName}', () => {
  const items = ref([]);
  
  const activeItems = computed(() => items.value);
  
  function fetchItems() {
    // TODO: 实现
  }
  
  function addItem(item: any) {
    items.value.push(item);
  }
  
  function removeItem(id: string) {
    items.value = items.value.filter((i: any) => i.id !== id);
  }
  
  return {
    items,
    activeItems,
    fetchItems,
    addItem,
    removeItem,
  };
});`;
    },
    extension: 'ts',
    description: '生成 Pinia Store',
  },
  composable: {
    generate: (name: string) => {
      const pascalName = toPascalCase(name);
      return `import { ref, onMounted, computed } from 'vue';

interface Use${pascalName}Options {
  autoLoad?: boolean;
}

export function use${pascalName}(options: Use${pascalName}Options = {}) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const hasData = computed(() => !!data.value);
  
  async function refresh() {
    loading.value = true;
    error.value = null;
    try {
      // TODO: 实现数据获取
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  
  function clear() {
    data.value = null;
    error.value = null;
  }
  
  if (options.autoLoad !== false) {
    onMounted(refresh);
  }
  
  return {
    data,
    loading,
    error,
    hasData,
    refresh,
    clear,
  };
}

export function use${pascalName}List() {
  return use${pascalName}();
}`;
    },
    extension: 'ts',
    description: '生成 Vue Composable',
  },
};
