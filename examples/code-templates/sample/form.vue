<template>
  <el-dialog
    v-model="visible"
    :title="userId ? '编辑用户' : '新增用户'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="formData.avatar" placeholder="请上传头像" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { User } from './types'
import * as api from './api'

interface Props {
  visible: boolean
  userId?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const formData = reactive<User>({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: 1,
  avatar: '',
  status: 1
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const loadData = async () => {
  if (!props.userId) return
  try {
    const res = await api.getUser(props.userId)
    if (res.success) {
      Object.assign(formData, res.data)
    }
  } catch {
    ElMessage.error('获取用户信息失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (props.userId) {
      await api.updateUser(formData)
      ElMessage.success('更新成功')
    } else {
      await api.createUser(formData)
      ElMessage.success('创建成功')
    }
    emit('success')
    handleClose()
  } catch {
    // 验证失败或请求失败
  } finally {
    submitLoading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
  Object.assign(formData, {
    username: '',
    nickname: '',
    email: '',
    phone: '',
    gender: 1,
    avatar: '',
    status: 1
  })
}

watch(() => props.visible, (val) => {
  if (val && props.userId) {
    loadData()
  }
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
