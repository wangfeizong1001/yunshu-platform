<template>
  <el-dialog
    v-model="visible"
    title="租户套餐配置"
    width="600px"
    destroy-on-close
  >
    <el-alert
      v-if="currentTenant"
      :title="`当前套餐：${currentTenant.packageName}`"
      type="success"
      :closable="false"
      style="margin-bottom: 20px"
    />

    <el-form :model="formData" label-width="100px">
      <el-form-item label="选择套餐">
        <el-select v-model="formData.packageId" placeholder="请选择套餐" style="width: 100%">
          <el-option
            v-for="pkg in packageList"
            :key="pkg.packageId"
            :label="pkg.packageName"
            :value="pkg.packageId"
          >
            <div class="package-option">
              <span class="name">{{ pkg.packageName }}</span>
              <span class="desc">
                用户上限: {{ pkg.userLimit }} | 价格: {{ pkg.price === 0 ? '免费' : `¥${pkg.price}` }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="到期时间">
        <el-date-picker
          v-model="formData.expireTime"
          type="datetime"
          placeholder="请选择到期时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="用户上限">
        <el-input-number
          v-model="formData.userLimit"
          :min="1"
          :max="999999"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getTenantDetail,
  getPackageList,
  updateTenant,
} from '@/api/tenant/tenant.api'
import type { Tenant, TenantPackage } from '@yunshu/shared'

const props = defineProps<{
  modelValue: boolean
  tenantId?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 状态
const submitLoading = ref(false)
const currentTenant = ref<Tenant>()
const packageList = ref<TenantPackage[]>([])

// 表单数据
const formData = ref({
  packageId: 0,
  expireTime: '',
  userLimit: 100,
})

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 加载租户详情
async function fetchTenantDetail() {
  if (!props.tenantId) return

  try {
    currentTenant.value = await getTenantDetail(props.tenantId)
    formData.value = {
      packageId: currentTenant.value.packageId,
      expireTime: currentTenant.value.expireTime,
      userLimit: currentTenant.value.userLimit,
    }
  } catch (error) {
    console.error('加载租户详情失败', error)
  }
}

// 加载套餐列表
async function fetchPackageList() {
  try {
    packageList.value = await getPackageList()
  } catch (error) {
    console.error('加载套餐列表失败', error)
  }
}

// 提交表单
async function handleSubmit() {
  if (!props.tenantId) return

  try {
    submitLoading.value = true

    // 更新租户信息
    await updateTenant(props.tenantId, {
      packageId: formData.value.packageId,
      expireTime: formData.value.expireTime,
      userLimit: formData.value.userLimit,
    } as Record<string, unknown>)

    ElMessage.success('套餐配置成功')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('配置失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 监听弹窗显示
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fetchTenantDetail()
      fetchPackageList()
    }
  }
)
</script>

<style scoped lang="scss">
.package-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .name {
    font-weight: 500;
  }

  .desc {
    font-size: 12px;
    color: #999;
  }
}
</style>
