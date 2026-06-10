<template>
  <el-select
    v-model="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    filterable
    style="width: 100%"
    @change="handleChange"
  >
    <el-option
      v-for="tenant in tenantList"
      :key="tenant.tenantId"
      :label="tenant.tenantName"
      :value="tenant.tenantId"
    >
      <div class="tenant-option">
        <span class="name">{{ tenant.tenantName }}</span>
        <span class="code">{{ tenant.tenantCode }}</span>
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTenantList } from '@/api/tenant/tenant.api'

interface TenantInfo {
  tenantId: number
  tenantName: string
  tenantCode: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '请选择租户',
    clearable: true,
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const tenantList = ref<TenantInfo[]>([])

async function fetchTenantList() {
  try {
    const res = await getTenantList({ status: '0' })
    tenantList.value = (res?.data || []) as TenantInfo[]
  } catch (error) {
    console.error('加载租户列表失败', error)
  }
}

function handleChange(value: number | null) {
  emit('update:modelValue', value)
  emit('change', value)
}

onMounted(() => {
  fetchTenantList()
})
</script>

<style scoped lang="scss">
.tenant-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .name {
    font-weight: 500;
  }

  .code {
    font-size: 12px;
    color: #999;
  }
}
</style>
