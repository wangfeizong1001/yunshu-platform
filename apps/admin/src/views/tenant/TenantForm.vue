<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑租户' : '新增租户'"
    width="600px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="租户名称" prop="tenantName">
            <el-input v-model="formData.tenantName" placeholder="请输入租户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租户编码" prop="tenantCode">
            <el-input
              v-model="formData.tenantCode"
              placeholder="请输入租户编码"
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="formData.contact" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="域名" prop="domain">
            <el-input v-model="formData.domain" placeholder="请输入域名" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="套餐" prop="packageId">
            <el-select v-model="formData.packageId" placeholder="请选择套餐" style="width: 100%">
              <el-option
                v-for="pkg in packageList"
                :key="pkg.packageId"
                :label="pkg.packageName"
                :value="pkg.packageId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户上限" prop="userLimit">
            <el-input-number
              v-model="formData.userLimit"
              :min="1"
              :max="999999"
              placeholder="请输入用户上限"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="到期时间" prop="expireTime">
            <el-date-picker
              v-model="formData.expireTime"
              type="datetime"
              placeholder="请选择到期时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { addTenant, updateTenant, getPackageList } from '@/api/tenant/tenant.api'
import type { Tenant, TenantForm, TenantPackage } from '@yunshu/shared/types/tenant'

const props = defineProps<{
  modelValue: boolean
  tenantData?: Tenant | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  refresh: []
}>()

// 状态
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const packageList = ref<TenantPackage[]>([])

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.tenantData?.tenantId)

// 表单数据
const formData = ref<TenantForm>({
  tenantName: '',
  tenantCode: '',
  contact: '',
  contactPhone: '',
  email: '',
  domain: '',
  packageId: 0,
  expireTime: '',
  userLimit: 100,
  status: '0',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  tenantName: [
    { required: true, message: '请输入租户名称', trigger: 'blur' },
  ],
  tenantCode: [
    { required: true, message: '请输入租户编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '租户编码只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  packageId: [
    { required: true, message: '请选择套餐', trigger: 'change' },
  ],
  userLimit: [
    { required: true, message: '请输入用户上限', trigger: 'blur' },
  ],
}

// 加载套餐列表
async function fetchPackageList() {
  try {
    const res = await getPackageList()
    packageList.value = res
  } catch (error) {
    console.error('加载套餐列表失败', error)
  }
}

// 监听数据变化
watch(
  () => props.tenantData,
  (val) => {
    if (val) {
      formData.value = {
        tenantId: val.tenantId,
        tenantName: val.tenantName,
        tenantCode: val.tenantCode,
        contact: val.contact,
        contactPhone: val.contactPhone,
        email: val.email,
        domain: val.domain,
        packageId: val.packageId,
        expireTime: val.expireTime,
        userLimit: val.userLimit,
        status: val.status,
        remark: val.remark,
      }
    } else {
      formData.value = {
        tenantName: '',
        tenantCode: '',
        contact: '',
        contactPhone: '',
        email: '',
        domain: '',
        packageId: 0,
        expireTime: '',
        userLimit: 100,
        status: '0',
        remark: '',
      }
    }
  },
  { immediate: true }
)

// 关闭弹窗
function handleClose() {
  visible.value = false
  formRef.value?.resetFields()
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    if (isEdit.value) {
      await updateTenant(props.tenantData!.tenantId, formData.value)
      ElMessage.success('修改成功')
    } else {
      await addTenant(formData.value)
      ElMessage.success('新增成功')
    }

    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('提交失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 初始化
fetchPackageList()
</script>
