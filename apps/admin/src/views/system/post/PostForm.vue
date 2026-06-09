<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑岗位' : '新增岗位'"
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
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入岗位编码" />
      </el-form-item>

      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="formData.postName" placeholder="请输入岗位名称" />
      </el-form-item>

      <el-form-item label="显示顺序" prop="postSort">
        <el-input-number v-model="formData.postSort" :min="0" :max="999" />
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
import { addPost, updatePost } from '@/api/system/post.api'
import type { SysPost } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  postData?: SysPost | null
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

const isEdit = computed(() => !!props.postData?.postId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  postCode: '',
  postName: '',
  postSort: 0,
  status: '0',
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  postCode: [
    { required: true, message: '请输入岗位编码', trigger: 'blur' },
  ],
  postName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
  ],
  postSort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' },
  ],
}

// 填充表单数据
function fillFormData() {
  if (props.postData) {
    formData.value = {
      postCode: props.postData.postCode,
      postName: props.postData.postName,
      postSort: props.postData.postSort,
      status: props.postData.status,
      remark: props.postData.remark || '',
    }
  } else {
    formData.value = {
      postCode: '',
      postName: '',
      postSort: 0,
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
      await updatePost({ postId: props.postData!.postId, ...formData.value } as any)
      ElMessage.success('修改成功')
    } else {
      await addPost(formData.value as any)
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
