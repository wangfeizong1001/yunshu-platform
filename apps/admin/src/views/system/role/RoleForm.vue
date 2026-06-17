<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑角色' : '新增角色'"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
      </el-form-item>

      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="formData.roleKey" placeholder="请输入权限字符" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="显示顺序" prop="roleSort">
        <el-input-number v-model="formData.roleSort" :min="0" :max="999" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="数据权限" prop="dataScope">
        <el-select v-model="formData.dataScope" placeholder="请选择数据权限">
          <el-option label="全部数据权限" value="1" />
          <el-option label="自定义数据权限" value="2" />
          <el-option label="本部门数据权限" value="3" />
          <el-option label="本部门及以下数据权限" value="4" />
          <el-option label="仅本人数据权限" value="5" />
        </el-select>
      </el-form-item>

      <el-form-item label="菜单树权限" prop="menuCheckStrictly">
        <div class="menu-tree-wrap">
          <el-tree
            ref="menuTreeRef"
            :data="menuTree"
            :props="{ label: 'menuName', children: 'children' }"
            node-key="menuId"
            :check-strictly="!formData.menuCheckStrictly"
            show-checkbox
            default-expand-all
          />
        </div>
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
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { addRole, updateRole } from '@/api/system/role.api'
import { getMenuTree } from '@/api/system/menu.api'
import type { SysRole, SysMenu } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  roleData?: SysRole | null
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

const isEdit = computed(() => !!props.roleData?.roleId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)
const menuTree = ref<SysMenu[]>([])
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const selectedMenuIds = ref<number[]>([])

// 表单数据
const formData = ref({
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  dataScope: '1',
  menuCheckStrictly: true,
  remark: '',
})

// 表单验证规则
const rules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  roleKey: [
    { required: true, message: '请输入权限字符', trigger: 'blur' },
  ],
  roleSort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' },
  ],
}

// 加载菜单树
async function fetchMenuTree() {
  try {
    const res = await getMenuTree() as SysMenu[]
    menuTree.value = res
  } catch (error) {
    console.error('加载菜单树失败', error)
  }
}

// 加载角色菜单权限
async function fetchRoleMenus() {
  if (!props.roleData?.roleId) return
  try {
    const menuIds = [] as number[]
    selectedMenuIds.value = menuIds
    // 设置选中的菜单
    nextTick(() => {
      menuIds.forEach((id: number) => {
        menuTreeRef.value?.getNode(id)?.setChecked(false, false)
      })
    })
  } catch (error) {
    console.error('加载角色菜单失败', error)
  }
}

// 填充表单数据
function fillFormData() {
  if (props.roleData) {
    formData.value = {
      roleName: props.roleData.roleName,
      roleKey: props.roleData.roleKey,
      roleSort: props.roleData.roleSort,
      status: props.roleData.status,
      dataScope: props.roleData.dataScope,
      menuCheckStrictly: props.roleData.menuCheckStrictly,
      remark: props.roleData.remark,
    }
  } else {
    formData.value = {
      roleName: '',
      roleKey: '',
      roleSort: 0,
      status: '0',
      dataScope: '1',
      menuCheckStrictly: true,
      remark: '',
    }
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true

    // 获取选中的菜单ID
    const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
    const menuIds = [...checkedKeys, ...halfCheckedKeys] as number[]

    const submitData = {
      roleId: isEdit.value ? props.roleData!.roleId : undefined,
      ...formData.value,
      permissions: menuIds,
    }

    if (isEdit.value) {
      await updateRole(submitData as Record<string, unknown>)
      ElMessage.success('修改成功')
    } else {
      await addRole(submitData as Record<string, unknown>)
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
  menuTreeRef.value?.setCheckedKeys([])
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchMenuTree()
    fillFormData()
    if (props.roleData?.roleId) {
      fetchRoleMenus()
    }
  }
})
</script>

<style scoped lang="scss">
.menu-tree-wrap {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px;
}
</style>
