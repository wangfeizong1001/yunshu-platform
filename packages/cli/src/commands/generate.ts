/**
 * yunshu generate — 代码生成命令
 *
 * 快速生成页面、组件、API 模块等样板代码。
 *
 * @module @yunshu/cli/commands/generate
 */

import { Command } from 'commander'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

type GeneratorType = 'page' | 'component' | 'api' | 'store' | 'composable'

interface GeneratorDef {
  description: string
  generate: (name: string) => string
  extension: string
}

// ============================================================================
// 代码生成器定义
// ============================================================================

export const generators: Record<GeneratorType, GeneratorDef> = {
  // ------------------------------------------------------------------------
  // 1. Page — 管理后台页面
  // ------------------------------------------------------------------------
  page: {
    description: '生成一个管理后台页面（列表 + 搜索 + 弹窗）',
    extension: 'vue',
    generate: (name: string) => {
      const pascalName = toPascalCase(name)
      const camelName = toCamelCase(name)
      const kebabName = toKebabCase(name)

      return `<script setup lang="ts">
/**
 * ${pascalName}Page — ${name}管理页面
 *
 * 功能: 列表展示 + 搜索 + 新增/编辑/删除
 */

import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ============================================================
// 类型定义
// ============================================================
interface ${pascalName}Item {
  id: number
  name: string
  status: 'enabled' | 'disabled'
  createdAt: string
  description?: string
}

interface ${pascalName}Query {
  keyword: string
  status: string
  page: number
  pageSize: number
}

interface ${pascalName}Form {
  id?: number
  name: string
  description?: string
  status: string
}

// ============================================================
// 状态
// ============================================================
const loading = ref(false)
const tableData = ref<${pascalName}Item[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const formTitle = ref('新增')

const queryParams = reactive<${pascalName}Query>({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 10,
})

const formData = ref<${pascalName}Form>({
  name: '',
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

// ============================================================
// 数据操作
// ============================================================
async function fetchData(): Promise<void> {
  loading.value = true
  try {
    // TODO: 替换为真实 API 调用
    // const { data } = await get${pascalName}List(queryParams)
    // tableData.value = data.list
    // total.value = data.total
    await new Promise((resolve) => setTimeout(resolve, 300))
    tableData.value = [
      { id: 1, name: '示例数据 1', status: 'enabled', createdAt: '2026-06-01' },
      { id: 2, name: '示例数据 2', status: 'disabled', createdAt: '2026-06-02' },
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

function handleSearch(): void {
  queryParams.page = 1
  fetchData()
}

function handleReset(): void {
  queryParams.keyword = ''
  queryParams.status = ''
  handleSearch()
}

function handlePageChange(page: number): void {
  queryParams.page = page
  fetchData()
}

function handleSizeChange(size: number): void {
  queryParams.pageSize = size
  queryParams.page = 1
  fetchData()
}

// ============================================================
// CRUD 操作
// ============================================================
function handleCreate(): void {
  formTitle.value = '新增'
  formData.value = { name: '', description: '', status: 'enabled' }
  dialogVisible.value = true
}

function handleEdit(row: ${pascalName}Item): void {
  formTitle.value = '编辑'
  formData.value = { ...row }
  dialogVisible.value = true
}

function handleDelete(row: ${pascalName}Item): void {
  ElMessageBox.confirm(\`确认删除 "\${row.name}"?\`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // TODO: 调用删除 API
      // await delete${pascalName}(row.id)
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

async function handleSubmit(): Promise<void> {
  try {
    // TODO: 调用新增/编辑 API
    // if (formData.value.id) {
    //   await update${pascalName}(formData.value)
    // } else {
    //   await create${pascalName}(formData.value)
    // }
    ElMessage.success(formTitle.value + '成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="${kebabName}-page">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline @submit.prevent="handleSearch">
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 160px">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 + 表格 -->
    <el-card class="table-card" shadow="never">
      <div class="card-header">
        <el-button type="primary" @click="handleCreate">+ 新增${pascalName}</el-button>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        class="pagination"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="${camelName}FormRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" placeholder="请选择" style="width: 100%">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.${kebabName}-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
`
    },
  },

  // ------------------------------------------------------------------------
  // 2. Component — Vue 组件
  // ------------------------------------------------------------------------
  component: {
    description: '生成一个可复用的 Vue 组件',
    extension: 'vue',
    generate: (name: string) => {
      const pascalName = toPascalCase(name)
      const kebabName = toKebabCase(name)

      return `<script setup lang="ts">
/**
 * ${pascalName} — ${name}组件
 *
 * @example
 * <${pascalName} :title="'Hello'" @update="handleUpdate" />
 */

import { computed, ref } from 'vue'

// ============================================================
// Props
// ============================================================
interface Props {
  title?: string
  disabled?: boolean
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '${pascalName}',
  disabled: false,
  count: 0,
})

// ============================================================
// Emits
// ============================================================
interface Emits {
  (e: 'update', value: number): void
  (e: 'click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()

// ============================================================
// 内部状态
// ============================================================
const localCount = ref(props.count)

const doubleCount = computed(() => localCount.value * 2)

// ============================================================
// 方法
// ============================================================
function handleClick(event: MouseEvent): void {
  if (props.disabled) return
  localCount.value++
  emit('click', event)
  emit('update', localCount.value)
}

defineExpose({ count: localCount, reset: () => (localCount.value = 0) })
</script>

<template>
  <div class="${kebabName}" :class="{ 'is-disabled': disabled }">
    <div class="header">{{ title }}</div>
    <div class="content">
      <span>当前计数: {{ localCount }}</span>
      <span>双倍: {{ doubleCount }}</span>
    </div>
    <button class="btn" :disabled="disabled" @click="handleClick">
      点击 +1
    </button>
  </div>
</template>

<style scoped lang="scss">
.${kebabName} {
  padding: 16px;
  border: 1px solid var(--color-border, #dcdfe6);
  border-radius: 8px;
  background: var(--color-surface, #fff);

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .header {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-text-primary, #303133);
  }

  .content {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    color: var(--color-text-regular, #606266);
  }

  .btn {
    padding: 6px 16px;
    background: var(--color-primary, #409eff);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      background: var(--color-text-placeholder, #a8abb2);
    }
  }
}
</style>
`
    },
  },

  // ------------------------------------------------------------------------
  // 3. API — API 模块
  // ------------------------------------------------------------------------
  api: {
    description: '生成一个 API 模块（基于 axios 的请求封装）',
    extension: 'ts',
    generate: (name: string) => {
      const pascalName = toPascalCase(name)
      const camelName = toCamelCase(name)

      return `/**
 * ${pascalName} API 模块
 *
 * 基于 axios 的请求封装。
 *
 * @module api/${camelName}
 */

import request from '@/utils/request'

// ============================================================
// 类型定义
// ============================================================
export interface ${pascalName}Item {
  id: number
  name: string
  status: string
  createdAt: string
  description?: string
}

export interface ${pascalName}Create {
  name: string
  description?: string
  status: string
}

export type ${pascalName}Update = Partial<${pascalName}Create>

export interface ${pascalName}Query {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface ${pascalName}ListResponse {
  list: ${pascalName}Item[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}

// ============================================================
// API 方法
// ============================================================

/**
 * 获取${pascalName}列表
 */
export function get${pascalName}List(
  params: ${pascalName}Query,
): Promise<ApiResponse<${pascalName}ListResponse>> {
  return request({
    url: '/api/${camelName}',
    method: 'get',
    params,
  })
}

/**
 * 获取${pascalName}详情
 */
export function get${pascalName}Detail(id: number): Promise<ApiResponse<${pascalName}Item>> {
  return request({
    url: \`/api/${camelName}/\${id}\`,
    method: 'get',
  })
}

/**
 * 创建${pascalName}
 */
export function create${pascalName}(
  data: ${pascalName}Create,
): Promise<ApiResponse<${pascalName}Item>> {
  return request({
    url: '/api/${camelName}',
    method: 'post',
    data,
  })
}

/**
 * 更新${pascalName}
 */
export function update${pascalName}(
  id: number,
  data: ${pascalName}Update,
): Promise<ApiResponse<${pascalName}Item>> {
  return request({
    url: \`/api/${camelName}/\${id}\`,
    method: 'put',
    data,
  })
}

/**
 * 删除${pascalName}
 */
export function delete${pascalName}(id: number): Promise<ApiResponse<null>> {
  return request({
    url: \`/api/${camelName}/\${id}\`,
    method: 'delete',
  })
}

/**
 * 批量删除${pascalName}
 */
export function batchDelete${pascalName}(ids: number[]): Promise<ApiResponse<null>> {
  return request({
    url: '/api/${camelName}/batch',
    method: 'delete',
    data: { ids },
  })
}

/**
 * 导出${pascalName}
 */
export function export${pascalName}(params: ${pascalName}Query): Promise<Blob> {
  return request({
    url: '/api/${camelName}/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
`
    },
  },

  // ------------------------------------------------------------------------
  // 4. Store — Pinia 状态管理
  // ------------------------------------------------------------------------
  store: {
    description: '生成一个 Pinia Store 模块',
    extension: 'ts',
    generate: (name: string) => {
      const pascalName = toPascalCase(name)
      const camelName = toCamelCase(name)

      return `/**
 * ${pascalName} Store — ${name}状态管理
 *
 * 使用 Pinia Composition API 风格。
 *
 * @module stores/${camelName}
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ============================================================
// 类型定义
// ============================================================
export interface ${pascalName}State {
  items: Array<{ id: number; name: string; status: string }>
  currentItem: { id: number; name: string } | null
  loading: boolean
  error: string | null
}

// ============================================================
// Store 定义
// ============================================================
export const use${pascalName}Store = defineStore('${camelName}', () => {
  // ---------- State ----------
  const items = ref<${pascalName}State['items']>([])
  const currentItem = ref<${pascalName}State['currentItem']>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---------- Getters ----------
  const activeItems = computed(() =>
    items.value.filter((item) => item.status === 'enabled'),
  )

  const itemCount = computed(() => items.value.length)

  const hasItems = computed(() => items.value.length > 0)

  const getItemById = (id: number) => items.value.find((item) => item.id === id)

  // ---------- Actions ----------
  async function fetchItems(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // TODO: 替换为真实 API 调用
      // const { data } = await get${pascalName}List()
      // items.value = data.list
      await new Promise((resolve) => setTimeout(resolve, 300))
      items.value = [
        { id: 1, name: '示例 1', status: 'enabled' },
        { id: 2, name: '示例 2', status: 'disabled' },
      ]
    } catch (err) {
      error.value = (err as Error).message
      console.error('Failed to fetch ${camelName} items:', err)
    } finally {
      loading.value = false
    }
  }

  async function addItem(name: string): Promise<void> {
    // TODO: 替换为真实 API 调用
    // await create${pascalName}({ name, status: 'enabled' })
    const newItem = { id: Date.now(), name, status: 'enabled' }
    items.value.push(newItem)
  }

  async function removeItem(id: number): Promise<void> {
    // TODO: 替换为真实 API 调用
    // await delete${pascalName}(id)
    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function setCurrent(item: { id: number; name: string } | null): void {
    currentItem.value = item
  }

  function clearError(): void {
    error.value = null
  }

  function reset(): void {
    items.value = []
    currentItem.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    items,
    currentItem,
    loading,
    error,
    // Getters
    activeItems,
    itemCount,
    hasItems,
    getItemById,
    // Actions
    fetchItems,
    addItem,
    removeItem,
    setCurrent,
    clearError,
    reset,
  }
})
`
    },
  },

  // ------------------------------------------------------------------------
  // 5. Composable — Vue 组合式函数
  // ------------------------------------------------------------------------
  composable: {
    description: '生成一个 Vue 组合式函数（Composable）',
    extension: 'ts',
    generate: (name: string) => {
      const pascalName = toPascalCase(name)
      const camelName = toCamelCase(name)

      return `/**
 * use${pascalName} — ${name}组合式函数
 *
 * 使用 Vue 3 Composition API 封装的可复用逻辑。
 *
 * @example
 * const { data, loading, error, refresh } = use${pascalName}()
 *
 * @module composables/use${pascalName}
 */

import { onMounted, ref, watch, computed } from 'vue'

// ============================================================
// 类型定义
// ============================================================
export interface Use${pascalName}Options {
  immediate?: boolean
  params?: Record<string, unknown>
}

export interface Use${pascalName}Return<T> {
  data: ReturnType<typeof ref<T | null>>
  loading: ReturnType<typeof ref<boolean>>
  error: ReturnType<typeof ref<string | null>>
  refresh: () => Promise<void>
  clear: () => void
}

// ============================================================
// 组合式函数
// ============================================================
export function use${pascalName}<T = unknown>(
  options: Use${pascalName}Options = {},
): Use${pascalName}Return<T> {
  const { immediate = true, params } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---------- Derived state ----------
  const hasData = computed(() => data.value !== null && data.value !== undefined)

  // ---------- Methods ----------
  async function fetchData(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // TODO: 替换为真实的请求逻辑
      // const response = await fetch('/api/${camelName}', { params })
      // data.value = response.data as T
      await new Promise((resolve) => setTimeout(resolve, 200))
      data.value = { id: 1, name: '${pascalName}' } as unknown as T
    } catch (err) {
      error.value = (err as Error).message
      console.error('[use${pascalName}] fetch failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function refresh(): Promise<void> {
    await fetchData()
  }

  function clear(): void {
    data.value = null
    error.value = null
  }

  // ---------- Lifecycle ----------
  if (immediate) {
    onMounted(fetchData)
  }

  // 监听 params 变化，自动刷新
  if (params) {
    watch(
      () => params,
      () => {
        if (immediate) {
          fetchData()
        }
      },
      { deep: true },
    )
  }

  return {
    data,
    loading,
    error,
    refresh,
    clear,
    // 额外暴露 derived 状态
    ...({ hasData } as object),
  } as unknown as Use${pascalName}Return<T>
}

/**
 * 便捷函数：使用带分页的数据列表
 */
export function use${pascalName}List<T = unknown>(options: Use${pascalName}Options = {}) {
  return use${pascalName}<{ list: T[]; total: number }>(options)
}

export default use${pascalName}
`
    },
  },
}

// ============================================================================
// 命令定义
// ============================================================================

export function generateCommand(): Command {
  const cmd = new Command('generate')
    .alias('g')
    .description('代码生成：页面 / 组件 / API / Store / Composable')
    .argument('<type>', `生成类型: ${Object.keys(generators).join(' | ')}`)
    .argument('<name>', '名称 (kebab-case)')
    .option('-d, --dir <directory>', '输出目录', 'src')
    .option('-f, --force', '覆盖已存在的文件', false)
    .action((type: string, name: string, options: Record<string, unknown>) => {
      // 验证类型
      const validTypes = Object.keys(generators)
      if (!validTypes.includes(type)) {
        console.error(chalk.red(`未知的生成类型: ${type}`))
        console.error(chalk.gray(`支持的类型: ${validTypes.join(', ')}`))
        process.exit(1)
      }

      // 验证名称
      if (!/^[a-z][a-z0-9-]*$/i.test(name)) {
        console.error(chalk.red(`无效的名称: ${name}`))
        console.error(chalk.gray('名称应使用字母、数字和短横线，如 user-list'))
        process.exit(1)
      }

      const generator = generators[type as GeneratorType]
      const outputDir = options.dir as string
      const force = options.force as boolean

      // 确定输出路径
      const subDirMap: Record<GeneratorType, string> = {
        page: 'views',
        component: 'components',
        api: 'api',
        store: 'stores',
        composable: 'composables',
      }

      const targetDir = path.resolve(process.cwd(), outputDir, subDirMap[type as GeneratorType])
      const fileName = `${toKebabCase(name)}.${generator.extension}`
      const outputPath = path.join(targetDir, fileName)

      // 检查文件是否已存在
      if (fs.existsSync(outputPath) && !force) {
        console.error(chalk.red(`文件已存在: ${outputPath}`))
        console.error(chalk.gray('使用 -f / --force 选项覆盖'))
        process.exit(1)
      }

      // 确保目录存在
      fs.ensureDirSync(targetDir)

      // 生成代码
      const code = generator.generate(name)

      // 写入文件
      fs.writeFileSync(outputPath, code)

      // 打印成功信息
      console.log(chalk.green(`✅ ${generator.description}`))
      console.log(chalk.green(`   已生成: ${chalk.bold(name)}`))
      console.log(chalk.gray(`   输出路径: ${outputPath}`))
      console.log('')

      // 打印提示
      console.log(chalk.cyan('💡 提示:'))
      if (type === 'page') {
        console.log(
          chalk.gray(
            `   别忘了在路由中注册: { path: '/${toKebabCase(name)}', name: '${toPascalCase(name)}', component: () => import('@/views/${toKebabCase(name)}.vue') }`,
          ),
        )
      } else if (type === 'api') {
        console.log(
          chalk.gray(
            `   在页面中导入: import { get${toPascalCase(name)}List } from '@/api/${toCamelCase(name)}'`,
          ),
        )
      } else if (type === 'store') {
        console.log(
          chalk.gray(
            `   在组件中使用: const { items, fetchItems } = use${toPascalCase(name)}Store()`,
          ),
        )
      } else if (type === 'composable') {
        console.log(
          chalk.gray(
            `   在组件中使用: const { data, loading } = use${toPascalCase(name)}()`,
          ),
        )
      }
      console.log('')
    })

  return cmd
}

// ============================================================================
// 工具函数
// ============================================================================

export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_]+/g, '-')
    .toLowerCase()
}

export type { GeneratorType, GeneratorDef }
