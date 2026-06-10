<template>
  <el-dialog v-model="visible" :title="isEdit ? '编辑用户' : '新增用户'" width="600px" append-to-body @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名称" :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formData.sex" placeholder="请选择性别">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
              <el-option label="未知" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptTree"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
              placeholder="请选择部门"
              check-strictly
              filterable
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位" prop="postId">
            <el-select v-model="formData.postId" multiple placeholder="请选择岗位" clearable>
              <el-option v-for="post in postList" :key="post.postId" :label="post.postName" :value="post.postId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="formData.roleId" multiple placeholder="请选择角色" clearable>
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="!isEdit" label="登录密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入登录密码" show-password />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { addUser, updateUser, getAllRoles } from '@/api/system/user.api'
import { getDeptTreeSelect } from '@/api/system/dept.api'
import { getPostSelect } from '@/api/system/post.api'
import type { UserInfo, DeptInfo, PostInfo, RoleInfo } from './types'

interface Props {
  modelValue: boolean
  userData?: UserInfo | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.userData?.userId)

const formRef = ref<FormInstance>()
const submitting = ref(false)
const deptTree = ref<DeptInfo[]>([])
const postList = ref<PostInfo[]>([])
const roleList = ref<RoleInfo[]>([])

const formData = ref({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  sex: '2',
  status: '0',
  deptId: undefined as number | undefined,
  postId: [] as number[],
  roleId: [] as number[],
  password: '',
  remark: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

async function fetchDeptTree() {
  try {
    const res = await getDeptTreeSelect()
    deptTree.value = (res?.data as DeptInfo[]) || []
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

async function fetchPostList() {
  try {
    const res = await getPostSelect()
    postList.value = (res?.data as PostInfo[]) || []
  } catch (error) {
    console.error('加载岗位列表失败', error)
  }
}

async function fetchRoleList() {
  try {
    const res = await getAllRoles()
    roleList.value = (res?.data as RoleInfo[]) || []
  } catch (error) {
    console.error('加载角色列表失败', error)
  }
}

function fillFormData() {
  if (props.userData) {
    formData.value = {
      username: props.userData.username,
      nickname: props.userData.nickname,
      phone: props.userData.phone,
      email: props.userData.email,
      sex: props.userData.sex,
      status: props.userData.status,
      deptId: props.userData.deptId,
      postId: props.userData.postId || [],
      roleId: props.userData.roleId || [],
      password: '',
      remark: props.userData.remark,
    }
  } else {
    formData.value = {
      username: '',
      nickname: '',
      phone: '',
      email: '',
      sex: '2',
      status: '0',
      deptId: undefined,
      postId: [],
      roleId: [],
      password: '',
      remark: '',
    }
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true

    if (isEdit.value) {
      await updateUser({ userId: props.userData!.userId, ...formData.value } as Record<string, unknown>)
      ElMessage.success('修改成功')
    } else {
      await addUser(formData.value as Record<string, unknown>)
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

function handleClose() {
  formRef.value?.resetFields()
  visible.value = false
}

watch(visible, (val) => {
  if (val) {
    fetchDeptTree()
    fetchPostList()
    fetchRoleList()
    fillFormData()
  }
})
</script>
