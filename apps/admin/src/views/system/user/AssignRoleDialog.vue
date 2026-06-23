<template>
  <el-dialog v-model="visible" title="分配角色" width="600px" append-to-body @close="handleClose">
    <el-alert title="勾选需要分配的角色后点击确定保存" type="info" :closable="false" class="mb-4" />

    <el-tree
      ref="treeRef"
      :data="roleTree"
      :props="{ label: 'roleName', children: 'children' }"
      node-key="roleId"
      show-checkbox
      check-strictly
      :default-checked-keys="selectedRoleIds"
      class="role-tree"
    />

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type ElTree } from 'element-plus'
import { getUserRoles, assignRoles } from '@/api/system/user.api'
import type { RoleInfo } from './types'

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

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const treeRef = ref<InstanceType<typeof ElTree>>()
const submitting = ref(false)
const roleTree = ref<RoleInfo[]>([])
const selectedRoleIds = ref<number[]>([])

async function fetchData() {
  if (!props.userId) return

  try {
    const res = await getUserRoles(props.userId)
    const data = res?.data as { roles: RoleInfo[]; userRoleIds: number[] } | undefined
    roleTree.value = data?.roles || []
    selectedRoleIds.value = data?.userRoleIds || []
  } catch (error) {
    console.error('加载角色数据失败', error)
  }
}

async function handleSubmit() {
  if (!props.userId) return

  const checkedNodes = treeRef.value?.getCheckedNodes() || []
  const roleIds = checkedNodes.map((node) => (node as RoleInfo).roleId)

  submitting.value = true
  try {
    await assignRoles(props.userId, roleIds)
    ElMessage.success('角色分配成功')
    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('分配角色失败', error)
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  visible.value = false
}

watch(visible, (val) => {
  if (val && props.userId) {
    fetchData()
  }
})
</script>

<style scoped lang="scss">
.mb-4 {
  margin-bottom: 16px;
}

.role-tree {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px;
}
</style>
