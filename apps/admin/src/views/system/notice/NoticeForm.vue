<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑公告' : '新增公告'"
    width="700px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="公告类型" prop="noticeType">
        <el-radio-group v-model="formData.noticeType">
          <el-radio label="1">通知</el-radio>
          <el-radio label="2">公告</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="formData.noticeTitle" placeholder="请输入公告标题" />
      </el-form-item>

      <el-form-item label="公告内容" prop="noticeContent">
        <el-input
          v-model="formData.noticeContent"
          type="textarea"
          placeholder="请输入公告内容"
          :rows="8"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">发布</el-radio>
          <el-radio label="1">撤回</el-radio>
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
import { addNotice, updateNotice } from '@/api/system/notice.api'
import type { SysNotice } from '@yunshu/shared/types/system'

interface Props {
  modelValue: boolean
  noticeData?: SysNotice | null
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

const isEdit = computed(() => !!props.noticeData?.noticeId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  noticeTitle: '',
  noticeType: '1',
  noticeContent: '',
  status: '0',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  noticeType: [
    { required: true, message: '请选择公告类型', trigger: 'change' },
  ],
  noticeTitle: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
  ],
  noticeContent: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
  ],
}

// 填充表单数据
function fillFormData() {
  if (props.noticeData) {
    formData.value = {
      noticeTitle: props.noticeData.noticeTitle,
      noticeType: props.noticeData.noticeType,
      noticeContent: props.noticeData.noticeContent,
      status: props.noticeData.status,
      remark: props.noticeData.remark || '',
    }
  } else {
    formData.value = {
      noticeTitle: '',
      noticeType: '1',
      noticeContent: '',
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
      await updateNotice(props.noticeData!.noticeId, formData.value as any)
      ElMessage.success('修改成功')
    } else {
      await addNotice(formData.value as any)
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
