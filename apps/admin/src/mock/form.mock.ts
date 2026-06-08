/**
 * 表单 Mock 数据
 */

import type { FormInfo, FormPageResp } from '@/api/system/form.api'

// 生成 Mock 表单数据
export const mockFormList: FormInfo[] = [
  {
    formId: 1,
    formName: '员工入职申请表',
    formCode: 'EMPLOYEE_ENTRY',
    description: '用于员工入职时填写基本信息',
    status: '1',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
    remark: '',
    components: [
      {
        id: '1',
        type: 'input',
        label: '姓名',
        field: 'name',
        placeholder: '请输入姓名',
        required: true,
        disabled: false,
        rules: []
      },
      {
        id: '2',
        type: 'select',
        label: '部门',
        field: 'dept',
        placeholder: '请选择部门',
        required: true,
        disabled: false,
        options: [
          { label: '技术部', value: 'tech' },
          { label: '产品部', value: 'product' },
          { label: '设计部', value: 'design' },
          { label: '市场部', value: 'market' }
        ]
      },
      {
        id: '3',
        type: 'date',
        label: '入职日期',
        field: 'entryDate',
        placeholder: '请选择入职日期',
        required: true,
        disabled: false
      },
      {
        id: '4',
        type: 'input',
        label: '联系电话',
        field: 'phone',
        placeholder: '请输入联系电话',
        required: true,
        disabled: false,
        rules: ['phone']
      },
      {
        id: '5',
        type: 'textarea',
        label: '备注',
        field: 'remark',
        placeholder: '请输入备注信息',
        required: false,
        disabled: false
      }
    ]
  },
  {
    formId: 2,
    formName: '请假申请表',
    formCode: 'LEAVE_APPLICATION',
    description: '用于员工请假申请',
    status: '1',
    createTime: '2024-01-20 14:00:00',
    updateTime: '2024-01-20 14:00:00',
    remark: '',
    components: [
      {
        id: '1',
        type: 'select',
        label: '请假类型',
        field: 'leaveType',
        placeholder: '请选择请假类型',
        required: true,
        disabled: false,
        options: [
          { label: '事假', value: 'personal' },
          { label: '病假', value: 'sick' },
          { label: '年假', value: 'annual' },
          { label: '婚假', value: 'marriage' }
        ]
      },
      {
        id: '2',
        type: 'datetime',
        label: '开始时间',
        field: 'startTime',
        placeholder: '请选择开始时间',
        required: true,
        disabled: false
      },
      {
        id: '3',
        type: 'datetime',
        label: '结束时间',
        field: 'endTime',
        placeholder: '请选择结束时间',
        required: true,
        disabled: false
      },
      {
        id: '4',
        type: 'textarea',
        label: '请假理由',
        field: 'reason',
        placeholder: '请输入请假理由',
        required: true,
        disabled: false
      }
    ]
  },
  {
    formId: 3,
    formName: '报销申请表',
    formCode: 'EXPENSE_APPLICATION',
    description: '用于员工费用报销申请',
    status: '0',
    createTime: '2024-01-25 09:00:00',
    updateTime: '2024-01-25 09:00:00',
    remark: '草稿状态',
    components: [
      {
        id: '1',
        type: 'input',
        label: '报销事由',
        field: 'reason',
        placeholder: '请输入报销事由',
        required: true,
        disabled: false
      },
      {
        id: '2',
        type: 'number',
        label: '报销金额',
        field: 'amount',
        placeholder: '请输入报销金额',
        required: true,
        disabled: false,
        min: 0.01,
        step: 0.01
      },
      {
        id: '3',
        type: 'date',
        label: '消费日期',
        field: 'expenseDate',
        placeholder: '请选择消费日期',
        required: true,
        disabled: false
      },
      {
        id: '4',
        type: 'upload',
        label: '上传凭证',
        field: 'voucher',
        placeholder: '',
        required: true,
        disabled: false,
        accept: 'image/*',
        maxCount: 5
      },
      {
        id: '5',
        type: 'textarea',
        label: '备注',
        field: 'remark',
        placeholder: '请输入备注信息',
        required: false,
        disabled: false
      }
    ]
  }
]

// 获取表单分页列表 Mock
export function getMockFormPage(params: any): FormPageResp {
  const { pageNum = 1, pageSize = 10, formName = '', status = '' } = params

  let filteredList = mockFormList

  // 表单名称过滤
  if (formName) {
    filteredList = filteredList.filter((form) =>
      form.formName.includes(formName)
    )
  }

  // 状态过滤
  if (status) {
    filteredList = filteredList.filter((form) => form.status === status)
  }

  // 分页
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows
  }
}

// 获取表单详情 Mock
export function getMockFormDetail(formId: number): FormInfo | undefined {
  return mockFormList.find((form) => form.formId === formId)
}

// 新增表单 Mock
export function addMockForm(form: Partial<FormInfo>): FormInfo {
  const newForm: FormInfo = {
    formId: Math.max(...mockFormList.map((f) => f.formId)) + 1,
    formName: form.formName || '',
    formCode: form.formCode || '',
    description: form.description || '',
    status: form.status || '0',
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    remark: form.remark || '',
    components: form.components || []
  }
  mockFormList.push(newForm)
  return newForm
}

// 更新表单 Mock
export function updateMockForm(
  formId: number,
  form: Partial<FormInfo>
): FormInfo | undefined {
  const index = mockFormList.findIndex((f) => f.formId === formId)
  if (index !== -1) {
    mockFormList[index] = {
      ...mockFormList[index],
      ...form,
      updateTime: new Date().toLocaleString()
    }
    return mockFormList[index]
  }
  return undefined
}

// 删除表单 Mock
export function deleteMockForm(formId: number): boolean {
  const index = mockFormList.findIndex((f) => f.formId === formId)
  if (index !== -1) {
    mockFormList.splice(index, 1)
    return true
  }
  return false
}

// 复制表单 Mock
export function copyMockForm(formId: number): FormInfo | undefined {
  const sourceForm = mockFormList.find((f) => f.formId === formId)
  if (sourceForm) {
    const newForm: FormInfo = {
      ...sourceForm,
      formId: Math.max(...mockFormList.map((f) => f.formId)) + 1,
      formName: sourceForm.formName + '_副本',
      formCode: sourceForm.formCode + '_COPY',
      status: '0',
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    }
    mockFormList.push(newForm)
    return newForm
  }
  return undefined
}
