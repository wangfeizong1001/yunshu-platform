<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑字典类型' : '新增字典类型'"
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
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
      </el-form-item>

      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" placeholder="请输入字典类型" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
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
import { addDictType, updateDictType } from '@/api/system/dict.api'
import type { SysDictType } from '@yunshu/shared/types/system'

interface Props {
  modelValue: boolean
  dictTypeData?: SysDictType | null
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

const isEdit = computed(() => !!props.dictTypeData?.dictId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  dictName: '',
  dictType: '',
  status: '0',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  dictName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
  ],
  dictType: [
    { required: true, message: '请输入字典类型', trigger: 'blur' },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '字典类型必须为小写字母、数字和下划线组合', trigger: 'blur' },
  ],
}

// 填充表单数据
function fillFormData() {
  if (props.dictTypeData) {
    formData.value = {
      dictName: props.dictTypeData.dictName,
      dictType: props.dictTypeData.dictType,
      status: props.dictTypeData.status,
      remark: props.dictTypeData.remark || '',
    }
  } else {
    formData.value = {
      dictName: '',
      dictType: '',
      status: '0',
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
      await updateDictType(props.dictTypeData!.dictId, formData.value as any)
      ElMessage.success('修改成功')
    } else {
      await addDictType(formData.value as any)
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
