<template>
  <el-dialog
    v-model="visible"
    title="权限分配"
    width="600px"
    append-to-body
  >
    <div class="permission-assign">
      <el-alert
        title="注意：勾选菜单即为授权"
        type="info"
        :closable="false"
        style="margin-bottom: 16px"
      />

      <el-form :model="formData" label-width="100px">
        <el-form-item label="数据权限">
          <el-select v-model="formData.dataScope" placeholder="请选择数据权限">
            <el-option label="全部数据权限" value="1" />
            <el-option label="自定义数据权限" value="2" />
            <el-option label="本部门数据权限" value="3" />
            <el-option label="本部门及以下数据权限" value="4" />
            <el-option label="仅本人数据权限" value="5" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.dataScope === '2'" label="自定义部门">
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            :props="{ label: 'deptName', children: 'children' }"
            node-key="deptId"
            show-checkbox
            default-expand-all
          />
        </el-form-item>

        <el-form-item label="菜单权限">
          <div class="menu-tree-wrap">
            <el-tree
              ref="menuTreeRef"
              :data="menuTree"
              :props="{ label: 'menuName', children: 'children' }"
              node-key="menuId"
              :check-strictly="checkStrictly"
              show-checkbox
              default-expand-all
            />
          </div>
        </el-form-item>
      </el-form>
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
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { authRoleAll, dataScope } from '@/api/system/role.api'
import { getMenuTree } from '@/api/system/menu.api'
import type { MenuInfo } from '@/api/system/menu.api'
import { getDeptTree } from '@/api/system/dept.api'
import type { DeptInfo } from '@/api/system/dept.api'
import type { SysMenu, SysDept } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  roleId?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const checkStrictly = computed(() => {
  return formData.value.dataScope !== '2'
})

// 状态
const submitting = ref(false)
const menuTree = ref<SysMenu[]>([])
const deptTree = ref<SysDept[]>([])
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const deptTreeRef = ref<InstanceType<typeof ElTree>>()

// 表单数据
const formData = ref({
  dataScope: '1',
})

// 加载菜单树
async function fetchMenuTree() {
  try {
    const res = await getMenuTree()
    menuTree.value = (res.data as MenuInfo[]) as unknown as SysMenu[]
  } catch (error) {
    console.error('加载菜单树失败', error)
  }
}

// 加载部门树
async function fetchDeptTree() {
  try {
    const res = await getDeptTree()
    deptTree.value = (res.data as DeptInfo[]) as unknown as SysDept[]
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// 加载角色菜单权限
async function fetchRoleMenus() {
  if (!props.roleId) return
  try {
    const menuIds = [] as number[]
    nextTick(() => {
      menuTreeRef.value?.setCheckedKeys(menuIds)
    })
  } catch (error) {
    console.error('加载角色菜单失败', error)
  }
}

// 加载角色数据权限
async function fetchRoleDataScope() {
  if (!props.roleId) return
  try {
    formData.value.dataScope = '1'
    nextTick(() => {
      deptTreeRef.value?.setCheckedKeys([])
    })
  } catch (error) {
    console.error('加载角色数据权限失败', error)
  }
}

// 提交
async function handleSubmit() {
  if (!props.roleId) return
  try {
    submitting.value = true

    // 获取选中的菜单ID
    const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
    const menuIds = [...checkedKeys, ...halfCheckedKeys] as number[]

    // 分配菜单权限
    await authRoleAll(props.roleId, menuIds)

    // 分配数据权限
    let deptIds: number[] | undefined
    if (formData.value.dataScope === '2') {
      deptIds = [
        ...(deptTreeRef.value?.getCheckedKeys() || []),
        ...(deptTreeRef.value?.getHalfCheckedKeys() || []),
      ] as number[]
    }
    await dataScope({ roleId: props.roleId, dataScope: formData.value.dataScope, menuIds: deptIds })

    ElMessage.success('分配成功')
    handleClose()
  } catch (error) {
    console.error('分配失败', error)
  } finally {
    submitting.value = false
  }
}

// 关闭
function handleClose() {
  menuTreeRef.value?.setCheckedKeys([])
  deptTreeRef.value?.setCheckedKeys([])
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchMenuTree()
    fetchDeptTree()
    fetchRoleMenus()
    fetchRoleDataScope()
  }
})
</script>

<style scoped lang="scss">
.permission-assign {
  .menu-tree-wrap {
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px;
  }
}
</style>
