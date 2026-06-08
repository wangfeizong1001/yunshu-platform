<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑菜单' : '新增菜单'"
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="formData.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              :data="menuTree"
              :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
              placeholder="请选择上级菜单"
              check-strictly
              filterable
              clearable
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input-number v-model="formData.orderNum" :min="0" :max="999" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="路由路径" prop="path">
            <el-input v-model="formData.path" placeholder="请输入路由路径" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType === 'C'" :span="12">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="formData.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="formData.menuType !== 'F'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="formData.icon" placeholder="请输入菜单图标">
              <template #append>
                <el-button @click="showIconDialog = true">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由参数" prop="query">
            <el-input v-model="formData.query" placeholder="请输入路由参数" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="formData.menuType !== 'F'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否外链" prop="isFrame">
            <el-radio-group v-model="formData.isFrame">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否缓存" prop="isCache">
            <el-radio-group v-model="formData.isCache">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限标识" prop="perms">
            <el-input v-model="formData.perms" placeholder="请输入权限标识">
              <template #prepend>system:</template>
            </el-input>
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
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>

    <!-- 图标选择弹窗 -->
    <MenuIcon v-model="showIconDialog" @select="handleIconSelect" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { addMenu, updateMenu } from '@/api/system/menu.api'
import { getMenuTreeSelect } from '@/api/system/menu.api'
import type { SysMenu } from '@yunshu/shared'
import MenuIcon from './MenuIcon.vue'

interface Props {
  modelValue: boolean
  menuData?: SysMenu | null
  parentMenu?: SysMenu | null
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

const isEdit = computed(() => !!props.menuData?.menuId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)
const menuTree = ref<SysMenu[]>([])
const showIconDialog = ref(false)

// 表单数据
const formData = ref({
  parentId: 0,
  menuName: '',
  menuType: 'C' as 'M' | 'C' | 'F',
  orderNum: 0,
  path: '',
  component: '',
  icon: '',
  query: '',
  isFrame: false,
  isCache: false,
  perms: '',
  status: '0',
})

// 表单验证规则
const rules: FormRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
  ],
  menuType: [
    { required: true, message: '请选择菜单类型', trigger: 'change' },
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
  ],
}

// 加载菜单树
async function fetchMenuTree() {
  try {
    menuTree.value = await getMenuTreeSelect()
  } catch (error) {
    console.error('加载菜单树失败', error)
  }
}

// 填充表单数据
function fillFormData() {
  if (props.menuData) {
    formData.value = {
      parentId: props.menuData.parentId,
      menuName: props.menuData.menuName,
      menuType: props.menuData.menuType,
      orderNum: props.menuData.orderNum,
      path: props.menuData.path || '',
      component: props.menuData.component || '',
      icon: props.menuData.icon || '',
      query: props.menuData.query || '',
      isFrame: props.menuData.isFrame,
      isCache: props.menuData.isCache,
      perms: props.menuData.perms || '',
      status: props.menuData.status,
    }
  } else if (props.parentMenu) {
    // 新增子菜单
    formData.value = {
      parentId: props.parentMenu.menuId,
      menuName: '',
      menuType: props.parentMenu.menuType === 'F' ? 'F' : 'C',
      orderNum: 0,
      path: '',
      component: '',
      icon: '',
      query: '',
      isFrame: false,
      isCache: false,
      perms: '',
      status: '0',
    }
  } else {
    // 新增顶级菜单
    formData.value = {
      parentId: 0,
      menuName: '',
      menuType: 'M',
      orderNum: 0,
      path: '',
      component: '',
      icon: '',
      query: '',
      isFrame: false,
      isCache: false,
      perms: '',
      status: '0',
    }
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true

    if (isEdit.value) {
      await updateMenu(props.menuData!.menuId, formData.value as any)
      ElMessage.success('修改成功')
    } else {
      await addMenu(formData.value as any)
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

// 图标选择回调
function handleIconSelect(icon: string) {
  formData.value.icon = icon
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchMenuTree()
    fillFormData()
  }
})
</script>
