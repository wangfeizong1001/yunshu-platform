<template>
  <el-dialog
    v-model="visible"
    title="租户详情"
    width="700px"
    destroy-on-close
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="租户ID">
        {{ tenantData?.tenantId }}
      </el-descriptions-item>
      <el-descriptions-item label="租户编码">
        {{ tenantData?.tenantCode }}
      </el-descriptions-item>
      <el-descriptions-item label="租户名称">
        {{ tenantData?.tenantName }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusType(tenantData?.status)">
          {{ getStatusLabel(tenantData?.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系人">
        {{ tenantData?.contact }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ tenantData?.contactPhone }}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        {{ tenantData?.email }}
      </el-descriptions-item>
      <el-descriptions-item label="域名">
        {{ tenantData?.domain }}
      </el-descriptions-item>
      <el-descriptions-item label="套餐">
        <el-tag type="success">{{ tenantData?.packageName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="用户数/上限">
        {{ tenantData?.userCount }} / {{ tenantData?.userLimit }}
      </el-descriptions-item>
      <el-descriptions-item label="到期时间">
        {{ tenantData?.expireTime }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ tenantData?.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ tenantData?.remark || '-' }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTenantDetail } from '@/api/tenant/tenant.api'
import type { Tenant } from '@yunshu/shared'
const props = defineProps<{
  modelValue: boolean
  tenantId?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 状态
const tenantData = ref<Tenant>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 获取状态标签
function getStatusLabel(status?: string) {
  if (!status) return '-'
  return TenantStatusEnum[status as keyof typeof TenantStatusEnum]?.label || status
}

// 获取状态类型
function getStatusType(status?: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '0': 'success',
    '1': 'danger',
    '2': 'warning',
  }
  return typeMap[status || '']
}

// 加载租户详情
async function fetchTenantDetail() {
  if (!props.tenantId) return

  try {
    tenantData.value = await getTenantDetail(props.tenantId)
  } catch (error) {
    console.error('加载租户详情失败', error)
  }
}

// 监听弹窗显示
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fetchTenantDetail()
    }
  }
)
</script>
