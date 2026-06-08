<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑字典数据' : '新增字典数据'"
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
      <el-form-item label="字典类型">
        <el-input v-model="dictType" disabled />
      </el-form-item>

      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="formData.dictLabel" placeholder="请输入字典标签" />
      </el-form-item>

      <el-form-item label="字典键值" prop="dictValue">
        <el-input v-model="formData.dictValue" placeholder="请输入字典键值" />
      </el-form-item>

      <el-form-item label="显示顺序" prop="dictSort">
        <el-input-number v-model="formData.dictSort" :min="0" :max="999" />
      </el-form-item>

      <el-form-item label="显示样式" prop="listClass">
        <el-select v-model="formData.listClass" placeholder="请选择显示样式" clearable>
          <el-option label="默认" value="default" />
          <el-option label="主要" value="primary" />
          <el-option label="成功" value="success" />
          <el-option label="警告" value="warning" />
          <el-option label="危险" value="danger" />
          <el-option label="信息" value="info" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否默认" prop="isDefault">
        <el-radio-group v-model="formData.isDefault">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
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
import { addDictData, updateDictData } from '@/api/system/dict.api'
import type { SysDictData } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  dictData?: SysDictData | null
  dictType: string
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

const isEdit = computed(() => !!props.dictData?.dictCode)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  listClass: 'default',
  isDefault: '0',
  status: '0',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  dictLabel: [
    { required: true, message: '请输入字典标签', trigger: 'blur' },
  ],
  dictValue: [
    { required: true, message: '请输入字典键值', trigger: 'blur' },
  ],
  dictSort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' },
  ],
}

// 填充表单数据
function fillFormData() {
  if (props.dictData) {
    formData.value = {
      dictLabel: props.dictData.dictLabel,
      dictValue: props.dictData.dictValue,
      dictSort: props.dictData.dictSort,
      listClass: props.dictData.listClass || 'default',
      isDefault: props.dictData.isDefault,
      status: props.dictData.status,
      remark: props.dictData.remark || '',
    }
  } else {
    formData.value = {
      dictLabel: '',
      dictValue: '',
      dictSort: 0,
      listClass: 'default',
      isDefault: '0',
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

    const submitData = {
      ...formData.value,
      dictType: props.dictType,
    }

    if (isEdit.value) {
      await updateDictData(props.dictData!.dictCode, submitData as any)
      ElMessage.success('修改成功')
    } else {
      await addDictData(submitData as any)
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
