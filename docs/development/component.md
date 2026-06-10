# 组件开发规范

本文档描述云枢中台 Vue 组件的开发规范与最佳实践。

---

## 一、组件命名规范

### 1.1 文件命名

| 类型 | 规则 | 示例 |
|------|------|------|
| **页面组件** | `kebab-case`，以目录 + index.vue 组织 | `views/system/user/index.vue` |
| **业务组件** | `PascalCase`，组件名与文件名一致 | `components/UserForm.vue` |
| **通用组件** | `Common` 前缀 + 功能 | `components/CommonTable.vue` |
| **布局组件** | 放置在 `layouts/` 目录 | `layouts/index.vue` |

**推荐结构**

```
apps/admin/src/
├── views/                    # 页面组件（路由级）
│   ├── system/
│   │   ├── user/
│   │   │   ├── index.vue     # 用户列表页
│   │   │   └── UserForm.vue  # 用户表单（内部用）
│   │   └── role/
│   │       └── index.vue
│   └── dashboard/
│       └── index.vue
│
├── components/                # 可复用组件
│   ├── CommonTable.vue       # 通用表格
│   ├── CommonButton.vue      # 通用按钮
│   ├── ImageUpload.vue       # 图片上传
│   └── OssUpload.vue         # OSS 文件上传
│
└── layouts/                   # 布局组件
    ├── index.vue
    └── components/
        ├── Sidebar.vue
        └── Header.vue
```

### 1.2 组件名

```vue
<!-- ✅ 使用 PascalCase 定义组件名 -->
<script setup lang="ts">
defineOptions({
  name: 'UserForm'
})
</script>

<!-- ✅ 单文件组件命名与文件名一致 -->
<!-- UserForm.vue -->
```

---

## 二、组件结构

### 2.1 `<script setup>` 写法（推荐）

```vue
<script setup lang="ts">
/**
 * 用户表单组件
 * @description 用于新增/编辑用户的表单
 * @example
 *   <UserForm v-model:visible="show" :user="currentUser" @success="fetchList" />
 */

// ========== 1. 类型定义 ==========
interface Props {
  /** 弹窗是否可见 */
  visible: boolean
  /** 当前编辑的用户 */
  user?: IUser | null
  /** 表单模式 */
  mode?: 'create' | 'edit'
}

interface Emits {
  /** 更新 visible */
  (e: 'update:visible', value: boolean): void
  /** 提交成功 */
  (e: 'success'): void
}

// ========== 2. Props & Emits 定义 ==========
const props = withDefaults(defineProps<Props>(), {
  user: null,
  mode: 'create'
})

const emit = defineEmits<Emits>()

// ========== 3. 响应式数据 ==========
import { ref, computed, watch } from 'vue'
const formRef = ref()
const formData = ref<Partial<IUser>>({})
const loading = ref(false)

// ========== 4. 计算属性 ==========
const isEdit = computed(() => props.mode === 'edit')
const title = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

// ========== 5. 监听器 ==========
watch(
  () => props.visible,
  (val) => {
    if (val && props.user) {
      formData.value = { ...props.user }
    }
  },
  { immediate: true }
)

// ========== 6. 方法 ==========
/** 关闭弹窗 */
const handleClose = () => {
  emit('update:visible', false)
}

/** 提交表单 */
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    if (isEdit.value) {
      await updateUser(formData.value)
    } else {
      await createUser(formData.value)
    }
    emit('success')
    handleClose()
  } finally {
    loading.value = false
  }
}
</script>

<!-- ========== 7. 模板 ========== -->
<template>
  <el-dialog v-model="visible" :title="title" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName" />
      </el-form-item>

      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="formData.phonenumber" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<!-- ========== 8. 样式（scoped）========== -->
<style scoped lang="scss">
.form-item {
  margin-bottom: 16px;
}
</style>
```

### 2.2 推荐的 script 顺序

```
1. 类型定义 (interface / type)
2. Props & Emits 定义
3. 响应式数据 (ref / reactive)
4. 计算属性 (computed)
5. 监听器 (watch)
6. 生命周期钩子 (onMounted 等)
7. 方法 (函数)
8. 暴露 (defineExpose)
```

---

## 三、Props 规范

### 3.1 类型安全

```vue
<script setup lang="ts">
// ✅ 推荐：使用泛型定义，类型安全
interface Props {
  title: string
  count: number
  visible?: boolean
  data?: IUserData[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => []
})

// ❌ 避免：使用 any
const props = defineProps<any>()
</script>
```

### 3.2 布尔值

```vue
<script setup lang="ts">
// ✅ 推荐：默认值为 false，语义明确
interface Props {
  disabled?: boolean
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})
</script>
```

### 3.3 函数 Props（事件优先）

```vue
<!-- ✅ 推荐：使用 emit 而非函数 prop -->
<script setup lang="ts">
interface Emits {
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const handleClick = () => emit('submit', formData.value)
</script>

<template>
  <CommonButton @click="handleClick">提交</CommonButton>
</template>

<!-- ❌ 避免：传递函数 prop -->
<!-- <CommonButton :onSubmit="handleSubmit">提交</CommonButton> -->
```

---

## 四、事件 (Emits) 规范

### 4.1 类型声明

```vue
<script setup lang="ts">
// ✅ 推荐：明确的 emit 类型
interface Emits {
  (e: 'update:modelValue', val: string): void
  (e: 'success', data: IResponse): void
  (e: 'error', err: Error): void
}

const emit = defineEmits<Emits>()

// 触发事件
emit('update:modelValue', inputValue.value)
emit('success', response.data)
</script>
```

### 4.2 v-model 支持

```vue
<script setup lang="ts">
interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', val: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用计算属性简化
const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <el-input v-model="value" />
</template>
```

---

## 五、可复用组件设计

### 5.1 封装 Element Plus 表格

```vue
<!-- components/CommonTable.vue -->
<script setup lang="ts">
interface Props {
  columns: IColumn[]
  data: any[]
  loading?: boolean
  border?: boolean
  stripe?: boolean
}
interface Emits {
  (e: 'selection-change', rows: any[]): void
  (e: 'row-click', row: any): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  border: true,
  stripe: true
})
const emit = defineEmits<Emits>()
</script>

<template>
  <el-table
    :data="data"
    :loading="loading"
    :border="border"
    :stripe="stripe"
    @selection-change="emit('selection-change', $event)"
    @row-click="emit('row-click', $event)"
  >
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      v-bind="col"
    />
    <slot />
  </el-table>
</template>
```

### 5.2 使用插槽

```vue
<!-- components/PageHeader.vue -->
<template>
  <div class="page-header">
    <!-- 具名插槽 -->
    <slot name="title">
      <h2>{{ title }}</h2>
    </slot>

    <!-- 默认插槽 -->
    <slot />

    <!-- 作用域插槽 -->
    <slot name="actions" :data="pageData">
      <el-button>默认按钮</el-button>
    </slot>
  </div>
</template>

<!-- 使用 -->
<PageHeader title="用户管理">
  <template #actions="{ data }">
    <el-button type="primary" @click="handleAdd(data)">新增</el-button>
  </template>
</PageHeader>
```

---

## 六、CSS 样式规范

### 6.1 Scoped 样式

```vue
<!-- ✅ 必须使用 scoped，避免样式污染 -->
<style scoped lang="scss">
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>

<!-- ⚠️ 如需穿透，使用 :deep() -->
<style scoped lang="scss">
/* 覆盖子组件样式 */
.custom-table :deep(.el-table__header) {
  background: #f5f7fa;
}
</style>
```

### 6.2 设计令牌（Design Tokens）

```vue
<!-- ✅ 使用 CSS 变量（设计令牌） -->
<style scoped lang="scss">
.card {
  background: var(--color-bg-container);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--color-text-primary);
  transition: var(--transition-base);
}
</style>
```

### 6.3 响应式设计

```vue
<style scoped lang="scss">
/* 使用断点 */
.container {
  display: flex;
  gap: var(--spacing-md);

  /* 移动端布局 */
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
</style>
```

---

## 七、性能优化

### 7.1 避免不必要的响应式

```vue
<script setup lang="ts">
// ✅ 静态数据使用普通变量
const columns = [
  { prop: 'userName', label: '用户名' },
  { prop: 'status', label: '状态' }
]

// ❌ 避免：静态数据使用 ref
// const columns = ref([...])
</script>
```

### 7.2 v-for 使用 key

```vue
<template>
  <!-- ✅ 必须使用唯一 key -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>

  <!-- ❌ 避免：使用 index -->
  <!-- <div v-for="(item, index) in items" :key="index"> -->
</template>
```

### 7.3 合理使用 computed

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const list = ref<IUser[]>([])

// ✅ 使用 computed 缓存计算结果
const filteredList = computed(() => {
  return list.value.filter((item) => item.status === 0)
})

// ❌ 避免：模板中直接调用方法（每次渲染都执行）
// const getFilteredList = () => list.value.filter(...)
</script>

<template>
  <div v-for="item in filteredList" :key="item.id">
    {{ item.userName }}
  </div>
</template>
```

### 7.4 事件防抖

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'

const searchQuery = ref('')

// ✅ 防抖搜索
const handleSearch = debounce((val) => {
  fetchData(val)
}, 300)

watch(searchQuery, handleSearch)
</script>
```

---

## 八、可访问性 (A11y)

### 8.1 语义化标签

```vue
<template>
  <!-- ✅ 使用语义化标签 -->
  <nav aria-label="主导航">
    <ul>
      <li><RouterLink to="/">首页</RouterLink></li>
      <li><RouterLink to="/system/user">用户管理</RouterLink></li>
    </ul>
  </nav>

  <main role="main">
    <h1>页面标题</h1>
    <article>
      <h2>章节标题</h2>
      <p>内容...</p>
    </article>
  </main>

  <!-- ✅ 按钮需有语义 -->
  <button aria-label="关闭弹窗" @click="closeDialog">
    <el-icon><Close /></el-icon>
  </button>
</template>
```

### 8.2 表单无障碍

```vue
<template>
  <el-form>
    <!-- ✅ 明确的 label -->
    <el-form-item label="用户名">
      <el-input
        v-model="username"
        placeholder="请输入用户名"
        aria-label="用户名"
        required
      />
    </el-form-item>

    <!-- ✅ 错误信息需可访问 -->
    <div v-if="errorMsg" role="alert" class="error">
      {{ errorMsg }}
    </div>
  </el-form>
</template>
```

---

## 九、组件文档化

### 9.1 JSDoc 注释

```vue
<script setup lang="ts">
/**
 * 文件上传组件
 *
 * @description 支持拖拽、多文件、进度显示的上传组件
 *
 * @example 基础用法
 * ```vue
 * <FileUploader
 *   v-model="files"
 *   :max-size="10 * 1024 * 1024"
 *   accept="image/*"
 *   @success="handleSuccess"
 * />
 * ```
 *
 * @example 上传配置
 * ```vue
 * <FileUploader
 *   v-model="files"
 *   :config="{ bucket: 'oss', directory: 'avatar/' }"
 * />
 * ```
 */

interface Props {
  /** 上传文件列表（v-model） */
  modelValue: IFile[]
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 允许的文件类型 */
  accept?: string
}
</script>
```

### 9.2 文档化输出示例

在组件目录下创建 `README.md` 说明用法：

```markdown
# CommonTable 通用表格

用于快速构建标准表格页面。

## 基础用法

```vue
<CommonTable :columns="columns" :data="data" :loading="loading" />

<script setup lang="ts">
const columns = [
  { prop: 'userName', label: '用户名', width: 120 },
  { prop: 'status', label: '状态', width: 80 }
]
const data = ref([])
const loading = ref(false)
</script>
```
```

---

## 十、单元测试规范

### 10.1 测试组件

```typescript
// components/__tests__/CommonTable.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CommonTable from '../CommonTable.vue'

describe('CommonTable', () => {
  it('应该正确渲染数据', () => {
    const columns = [{ prop: 'name', label: '名称' }]
    const data = [{ name: '测试' }]

    const wrapper = mount(CommonTable, {
      props: { columns, data }
    })

    expect(wrapper.text()).toContain('测试')
  })

  it('应该触发 selection-change 事件', async () => {
    const columns = [{ type: 'selection' }]
    const data = [{ id: 1 }, { id: 2 }]

    const wrapper = mount(CommonTable, { columns, data })
    // 触发选择
    await wrapper.find('.el-checkbox').trigger('click')
    expect(wrapper.emitted('selection-change')).toBeTruthy()
  })
})
```

---

## 十一、组件复用策略

### 11.1 何时抽离组件

| 场景 | 是否抽离 | 说明 |
|------|---------|------|
| 重复 3 次以上的 UI | ✅ 抽离 | DRY 原则 |
| 复杂的逻辑块 | ✅ 抽离 | 关注点分离 |
| 与业务强耦合的 UI | ⚠️ 谨慎 | 可能过度抽象 |
| 仅使用一次的简单 UI | ❌ 不抽离 | 避免过早抽象 |

### 11.2 组件分层

```
components/
├── base/                  # 基础组件（与业务无关）
│   ├── CommonButton.vue   # 通用按钮
│   ├── CommonTable.vue    # 通用表格
│   └── CommonModal.vue    # 通用弹窗
│
├── form/                  # 表单组件
│   ├── ImageUpload.vue    # 图片上传
│   └── RichTextEditor.vue # 富文本
│
├── layout/                # 布局组件
│   └── PageSection.vue    # 页面分区
│
└── business/              # 业务组件（跨页面复用）
    ├── UserSelector.vue   # 用户选择器
    └── DeptTree.vue       # 部门树
```

---

## 十二、代码质量检查清单

- [ ] 组件命名遵循 PascalCase
- [ ] 使用 `<script setup lang="ts">`
- [ ] Props 和 Emits 有明确类型定义
- [ ] 样式使用 `scoped`
- [ ] `v-for` 使用唯一 `:key`
- [ ] 事件名使用 kebab-case（模板中）
- [ ] 复杂逻辑有注释说明
- [ ] 敏感数据有安全处理
- [ ] 检查不必要的响应式包装
- [ ] 检查不必要的重新渲染

---

**相关文档**:
- [开发规范](../../DEVELOP.md)
- [API 开发规范](api.md)
- [国际化规范](i18n.md)
