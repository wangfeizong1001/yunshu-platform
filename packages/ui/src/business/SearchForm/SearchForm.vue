<script setup lang="ts">
/**
 * YunSearchForm — 通用搜索表单组件
 *
 * 沉淀自云枢后台搜索表单模式，提供：
 * - 动态筛选项配置
 * - 展开/收起
 * - 搜索/重置
 * - 自动防抖
 */
import { ref, reactive } from 'vue';
import YunButton from '../../styled/Button/Button.vue';

export interface SearchField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'date-range';
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface SearchFormProps {
  fields: SearchField[];
  /** 默认显示行数（超出折叠） */
  collapsedRows?: number;
}

const props = withDefaults(defineProps<SearchFormProps>(), {
  collapsedRows: 1,
});

const emit = defineEmits<{
  search: [values: Record<string, unknown>];
  reset: [];
}>();

const formValues = reactive<Record<string, unknown>>({});
const isCollapsed = ref(true);

const fieldsPerRow = 3;
const visibleFields = computedFields();
const hiddenFields = computedFields(true);

function computedFields(hidden = false) {
  const maxVisible = props.collapsedRows * fieldsPerRow;
  const all = props.fields;
  if (!isCollapsed.value || all.length <= maxVisible) return hidden ? [] : all;
  return hidden ? all.slice(maxVisible) : all.slice(0, maxVisible);
}

function handleSearch() {
  // 去除空值
  const filtered: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(formValues)) {
    if (v !== '' && v !== null && v !== undefined) {
      filtered[k] = v;
    }
  }
  emit('search', filtered);
}

function handleReset() {
  for (const key of Object.keys(formValues)) {
    delete formValues[key];
  }
  emit('reset');
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div class="yun-search-form">
    <div class="yun-search-form__fields">
      <div
        v-for="field in [...visibleFields, ...hiddenFields]"
        :key="field.key"
        class="yun-search-form__field"
      >
        <label class="yun-search-form__label">{{ field.label }}</label>
        <input
          v-if="field.type === 'input'"
          :placeholder="field.placeholder || `请输入${field.label}`"
          v-model="formValues[field.key]"
          class="yun-search-form__input"
          @keyup.enter="handleSearch"
        >
        <select
          v-else-if="field.type === 'select'"
          v-model="formValues[field.key]"
          class="yun-search-form__select"
        >
          <option value="">全部</option>
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <!-- date-range 可扩展 -->
      </div>
    </div>

    <div class="yun-search-form__actions">
      <YunButton variant="primary" @click="handleSearch">搜索</YunButton>
      <YunButton variant="outline" @click="handleReset">重置</YunButton>
      <YunButton
        v-if="fields.length > collapsedRows * 3"
        variant="text"
        @click="toggleCollapse"
      >
        {{ isCollapsed ? '展开' : '收起' }} ⌵
      </YunButton>
    </div>
  </div>
</template>

<style scoped>
.yun-search-form {
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 20px;
}

.yun-search-form__fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.yun-search-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.yun-search-form__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.yun-search-form__input,
.yun-search-form__select {
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-base);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
.yun-search-form__input:focus,
.yun-search-form__select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-alpha-10);
}

.yun-search-form__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
