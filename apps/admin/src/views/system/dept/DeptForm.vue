<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑部门' : '新增部门'"
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
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="deptTree"
          :props="{ value: 'deptId', label: 'deptName', children: 'children' } as Record<string, string>"
          placeholder="请选择上级部门"
          check-strictly
          filterable
          clearable
          :render-after-expand="false"
        />
      </el-form-item>

      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="formData.deptName" placeholder="请输入部门名称" />
      </el-form-item>

      <el-form-item label="显示顺序" prop="orderNum">
        <el-input-number v-model="formData.orderNum" :min="0" :max="999" />
      </el-form-item>

      <el-form-item label="负责人" prop="leader">
        <el-input v-model="formData.leader" placeholder="请输入负责人" />
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
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
import { addDept, updateDept } from '@/api/system/dept.api'
import { getDeptTreeSelect } from '@/api/system/dept.api'
import type { SysDept } from '@yunshu/shared'

interface Props {
  modelValue: boolean
  deptData?: SysDept | null
  parentDept?: SysDept | null
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

const isEdit = computed(() => !!props.deptData?.deptId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)
const deptTree = ref<SysDept[]>([])

// 表单数据
const formData = ref({
  parentId: 0,
  deptName: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0',
})

// 表单验证规则
const rules: FormRules = {
  parentId: [
    { required: true, message: '请选择上级部门', trigger: 'change' },
  ],
  deptName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
  ],
}

// 加载部门树
async function fetchDeptTree() {
  try {
    const res = await getDeptTreeSelect() as SysDept[]
    deptTree.value = res
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// 填充表单数据
function fillFormData() {
  if (props.deptData) {
    formData.value = {
      parentId: props.deptData.parentId,
      deptName: props.deptData.deptName,
      orderNum: (props.deptData as Record<string, unknown>).orderNum || 0,
      leader: props.deptData.leader,
      phone: props.deptData.phone,
      email: props.deptData.email,
      status: props.deptData.status,
    }
  } else if (props.parentDept) {
    // 新增子部门
    formData.value = {
      parentId: props.parentDept.deptId,
      deptName: '',
      orderNum: 0,
      leader: '',
      phone: '',
      email: '',
      status: '0',
    }
  } else {
    // 新增顶级部门
    formData.value = {
      parentId: 0,
      deptName: '',
      orderNum: 0,
      leader: '',
      phone: '',
      email: '',
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
      await updateDept({ deptId: props.deptData!.deptId, ...formData.value } as Record<string, unknown>)
      ElMessage.success('修改成功')
    } else {
      await addDept(formData.value as Record<string, unknown>)
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
    fetchDeptTree()
    fillFormData()
  }
})
</script>
