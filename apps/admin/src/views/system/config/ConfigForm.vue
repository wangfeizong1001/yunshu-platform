<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑参数' : '新增参数'"
    width="500px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="参数名称" prop="configName">
        <el-input v-model="formData.configName" placeholder="请输入参数名称" />
      </el-form-item>

      <el-form-item label="参数键名" prop="configKey">
        <el-input v-model="formData.configKey" placeholder="请输入参数键名" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="参数键值" prop="configValue">
        <el-input v-model="formData.configValue" placeholder="请输入参数键值" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="系统内置" prop="configType">
        <el-radio-group v-model="formData.configType" :disabled="isEdit">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { addConfig, updateConfig } from '@/api/system/config.api'
import type { SysConfig } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  configData?: SysConfig | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.configData?.configId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'N',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  configName: [
    { required: true, message: '请输入参数名称', trigger: 'blur' },
  ],
  configKey: [
    { required: true, message: '请输入参数键名', trigger: 'blur' },
  ],
  configValue: [
    { required: true, message: '请输入参数键值', trigger: 'blur' },
  ],
}

// 填充表单数据
function fillFormData() {
  if (props.configData) {
    formData.value = {
      configName: props.configData.configName,
      configKey: props.configData.configKey,
      configValue: props.configData.configValue,
      configType: props.configData.configType,
      remark: props.configData.remark || '',
    }
  } else {
    formData.value = {
      configName: '',
      configKey: '',
      configValue: '',
      configType: 'N',
      remark: '',
    }
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true

    if (isEdit.value) {
      await updateConfig(props.configData!.configId, formData.value as any)
      ElMessage.success('修改成功')
    } else {
      await addConfig(formData.value as any)
      ElMessage.success('新增成功')
    }

    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('提交失败', error)
  } finally {
    submitting.value = false
  }
}

// 关闭弹窗
function handleClose() {
  formRef.value?.resetFields()
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fillFormData()
  }
})
</script>
