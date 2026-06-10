/**
 * 工作流 Mock 数据
 */

export interface MockQueryParams {
  name?: string
  status?: string
  pageNum?: number
  pageSize?: number
  [key: string]: unknown
}

export interface MockPageResult<T> {
  rows: T[]
  total: number
}

const mockProcessDefinitionData: Record<string, unknown>[] = [
  {
    id: '1',
    name: '请假审批流程',
    key: 'leave_approval',
    version: '1.0',
    category: 'OA',
    description: '员工请假审批流程',
    status: 'active',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    name: '报销审批流程',
    key: 'expense_approval',
    version: '1.0',
    category: '财务',
    description: '员工费用报销审批流程',
    status: 'active',
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: '3',
    name: '采购申请流程',
    key: 'purchase_request',
    version: '1.0',
    category: '采购',
    description: '采购申请审批流程',
    status: 'draft',
    createTime: '2024-01-03 10:00:00',
  },
  {
    id: '4',
    name: '合同审批流程',
    key: 'contract_approval',
    version: '1.0',
    category: '法务',
    description: '合同审批流程',
    status: 'suspended',
    createTime: '2024-01-04 10:00:00',
  },
]

const mockProcessInstanceData: Record<string, unknown>[] = [
  {
    id: 'ins_1',
    name: '张三的请假申请',
    processKey: 'leave_approval',
    status: 'running',
    startTime: '2024-01-10 09:00:00',
    initiator: '张三',
  },
  {
    id: 'ins_2',
    name: '李四的报销申请',
    processKey: 'expense_approval',
    status: 'completed',
    startTime: '2024-01-11 09:00:00',
    initiator: '李四',
  },
]

const mockTaskData: Record<string, unknown>[] = [
  {
    id: 'task_1',
    name: '部门经理审批',
    instanceName: '张三的请假申请',
    assignee: '王经理',
    createTime: '2024-01-10 10:00:00',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'task_2',
    name: '人事审批',
    instanceName: '张三的请假申请',
    assignee: 'HR',
    createTime: '2024-01-10 11:00:00',
    priority: 'normal',
    status: 'pending',
  },
]

export function getMockProcessDefinitionPage(params: MockQueryParams): MockPageResult<Record<string, unknown>> {
  let filtered = mockProcessDefinitionData
  if (params.name) {
    filtered = filtered.filter((item) => (item.name as string)?.includes(params.name || ''))
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }
  return {
    rows: filtered,
    total: filtered.length,
  }
}

export function getMockProcessInstancePage(params: MockQueryParams): MockPageResult<Record<string, unknown>> {
  let filtered = mockProcessInstanceData
  if (params.name) {
    filtered = filtered.filter((item) => (item.name as string)?.includes(params.name || ''))
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }
  return {
    rows: filtered,
    total: filtered.length,
  }
}

export function getMockTodoTaskPage(params: MockQueryParams): MockPageResult<Record<string, unknown>> {
  let filtered = mockTaskData.filter((item) => item.status === 'pending')
  if (params.name) {
    filtered = filtered.filter((item) => (item.name as string)?.includes(params.name || ''))
  }
  return {
    rows: filtered,
    total: filtered.length,
  }
}

export function getMockDoneTaskPage(params: MockQueryParams): MockPageResult<Record<string, unknown>> {
  let filtered = mockTaskData.filter((item) => item.status !== 'pending')
  if (params.name) {
    filtered = filtered.filter((item) => (item.name as string)?.includes(params.name || ''))
  }
  return {
    rows: filtered,
    total: filtered.length,
  }
}

export const workflowProcessMock: Record<string, unknown>[] = mockProcessDefinitionData
export const workflowInstanceMock: Record<string, unknown>[] = mockProcessInstanceData
export const workflowTaskMock: Record<string, unknown>[] = mockTaskData
