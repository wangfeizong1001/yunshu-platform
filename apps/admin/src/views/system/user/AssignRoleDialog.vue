<template>
  <el-dialog
    v-model="visible"
    title="分配角色"
    width="500px"
    append-to-body
  >
    <div class="role-assign">
      <p class="tips">请选择要分配给该用户的角色：</p>
      <el-checkbox-group v-model="selectedRoleIds">
        <el-checkbox
          v-for="role in roleList"
          :key="role.roleId"
          :value="role.roleId"
          :disabled="role.status === '1'"
        >
          {{ role.roleName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

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
import { getUserRoles, assignUserRoles } from '@/api/system/user.api'
import { getAllRoles } from '@/api/system/role.api'
import type { SysRole } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  userId?: number
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

// 状态
const roleList = ref<SysRole[]>([])
const selectedRoleIds = ref<number[]>([])
const submitting = ref(false)

// 加载角色列表
async function fetchRoleList() {
  try {
    roleList.value = await getAllRoles()
  } catch (error) {
    console.error('加载角色列表失败', error)
  }
}

// 加载用户已有角色
async function fetchUserRoles() {
  if (!props.userId) return
  try {
    selectedRoleIds.value = await getUserRoles(props.userId)
  } catch (error) {
    console.error('加载用户角色失败', error)
  }
}

// 提交
async function handleSubmit() {
  if (!props.userId) return
  try {
    submitting.value = true
    await assignUserRoles(props.userId, selectedRoleIds.value)
    ElMessage.success('分配成功')
    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('分配失败', error)
  } finally {
    submitting.value = false
  }
}

// 关闭
function handleClose() {
  selectedRoleIds.value = []
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchRoleList()
    fetchUserRoles()
  }
})
</script>

<style scoped lang="scss">
.role-assign {
  .tips {
    margin-bottom: 16px;
    color: #666;
  }

  .el-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
