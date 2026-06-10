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
  import { ref, watch, onMounted } from 'vue';
  import { getTenantList } from '@/api/tenant/tenant.api';
  import type { Tenant } from '@yunshu/shared';

  const props = withDefaults(
    defineProps<{
      modelValue?: number | null;
      placeholder?: string;
      clearable?: boolean;
      disabled?: boolean;
    }>(),
    {
      modelValue: null,
      placeholder: '请选择租户',
      clearable: true,
      disabled: false,
    },
  );

  const emit = defineEmits<{
    'update:modelValue': [value: number | null];
    change: [value: number | null];
  }>();

  // 状态
  const tenantList = ref<Tenant[]>([]);

  // 加载租户列表
  async function fetchTenantList() {
    try {
      tenantList.value = await getTenantList({ status: '0' });
    } catch (error) {
      console.error('加载租户列表失败', error);
    }
  }

  // 处理变更
  function handleChange(value: number | null) {
    emit('update:modelValue', value);
    emit('change', value);
  }

  // 监听值变化，确保外部 v-model 绑定正确
  watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined || val === null) {
        // do nothing
      }
    },
  );

  // 初始化
  onMounted(() => {
    fetchTenantList();
  });
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
