/**
 * 工作流 Mock 数据
 */

import type { ProcessDefinition, ProcessInstance, Task } from '../api/workflow.api'

// 流程定义 Mock 数据
export const mockProcessDefinitions: ProcessDefinition[] = [
  {
    id: '1',
    name: '请假审批',
    key: 'leave_approval',
    version: 1,
    category: 'OA',
    description: '员工请假审批流程',
    status: 'active',
    createTime: '2024-01-15 08:00:00',
    updateTime: '2024-01-15 08:00:00',
  },
  {
    id: '2',
    name: '报销审批',
    key: 'expense_approval',
    version: 1,
    category: '财务',
    description: '费用报销审批流程',
    status: 'active',
    createTime: '2024-01-20 09:30:00',
    updateTime: '2024-01-20 09:30:00',
  },
  {
    id: '3',
    name: '采购申请',
    key: 'purchase_request',
    version: 2,
    category: '采购',
    description: '物资采购申请流程',
    status: 'suspended',
    createTime: '2024-02-01 10:00:00',
    updateTime: '2024-02-15 14:00:00',
  },
  {
    id: '4',
    name: '合同审批',
    key: 'contract_approval',
    version: 1,
    category: '法务',
    description: '合同审批流程',
    status: 'draft',
    createTime: '2024-03-01 11:00:00',
    updateTime: '2024-03-01 11:00:00',
  },
  {
    id: '5',
    name: '入职审批',
    key: 'onboarding_approval',
    version: 1,
    category: 'HR',
    description: '新员工入职审批流程',
    status: 'active',
    createTime: '2024-03-10 09:00:00',
    updateTime: '2024-03-10 09:00:00',
  },
]

// 流程实例 Mock 数据
export const mockProcessInstances: ProcessInstance[] = [
  {
    id: 'pi_001',
    processDefinitionId: '1',
    processDefinitionKey: 'leave_approval',
    processDefinitionName: '请假审批',
    businessKey: 'LEAVE_20240601001',
    startUserId: '2',
    startTime: '2024-06-01 09:00:00',
    status: 'running',
    currentTaskNames: ['部门经理审批'],
  },
  {
    id: 'pi_002',
    processDefinitionId: '1',
    processDefinitionKey: 'leave_approval',
    processDefinitionName: '请假审批',
    businessKey: 'LEAVE_20240528001',
    startUserId: '3',
    startTime: '2024-05-28 14:30:00',
    endTime: '2024-05-29 10:00:00',
    status: 'completed',
  },
  {
    id: 'pi_003',
    processDefinitionId: '2',
    processDefinitionKey: 'expense_approval',
    processDefinitionName: '报销审批',
    businessKey: 'EXPENSE_20240602001',
    startUserId: '4',
    startTime: '2024-06-02 11:00:00',
    status: 'running',
    currentTaskNames: ['财务审核'],
  },
  {
    id: 'pi_004',
    processDefinitionId: '2',
    processDefinitionKey: 'expense_approval',
    processDefinitionName: '报销审批',
    businessKey: 'EXPENSE_20240525001',
    startUserId: '2',
    startTime: '2024-05-25 16:00:00',
    status: 'terminated',
  },
]

// 待办任务 Mock 数据
export const mockTodoTasks: Task[] = [
  {
    id: 'task_001',
    name: '部门经理审批',
    description: '请审批张三的请假申请',
    processDefinitionId: '1',
    processInstanceId: 'pi_001',
    executionId: 'exec_001',
    assignee: '1',
    startTime: '2024-06-01 09:00:00',
    priority: 50,
    taskDefinitionKey: 'manager_approval',
    businessKey: 'LEAVE_20240601001',
    processDefinitionName: '请假审批',
  },
  {
    id: 'task_002',
    name: '财务审核',
    description: '请审核王五的报销申请',
    processDefinitionId: '2',
    processInstanceId: 'pi_003',
    executionId: 'exec_003',
    assignee: '1',
    startTime: '2024-06-02 11:00:00',
    priority: 60,
    taskDefinitionKey: 'finance_audit',
    businessKey: 'EXPENSE_20240602001',
    processDefinitionName: '报销审批',
  },
]

// 已办任务 Mock 数据
export const mockDoneTasks: Task[] = [
  {
    id: 'done_001',
    name: '部门经理审批',
    description: '审批李四的请假申请',
    processDefinitionId: '1',
    processInstanceId: 'pi_002',
    executionId: 'exec_002',
    assignee: '1',
    startTime: '2024-05-28 14:30:00',
    endTime: '2024-05-28 16:00:00',
    priority: 50,
    taskDefinitionKey: 'manager_approval',
    businessKey: 'LEAVE_20240528001',
    processDefinitionName: '请假审批',
  },
  {
    id: 'done_002',
    name: '财务审核',
    description: '审核张三的报销申请',
    processDefinitionId: '2',
    processInstanceId: 'pi_004',
    executionId: 'exec_004',
    assignee: '1',
    startTime: '2024-05-25 16:00:00',
    endTime: '2024-05-25 17:30:00',
    priority: 60,
    taskDefinitionKey: 'finance_audit',
    businessKey: 'EXPENSE_20240525001',
    processDefinitionName: '报销审批',
  },
]

// 流程历史记录 Mock
export const mockProcessHistory = [
  {
    id: 'hist_001',
    taskName: '发起申请',
    assignee: '张三',
    startTime: '2024-06-01 09:00:00',
    endTime: '2024-06-01 09:00:00',
    comment: '申请年假3天',
    outcome: 'completed',
  },
  {
    id: 'hist_002',
    taskName: '部门经理审批',
    assignee: '管理员',
    startTime: '2024-06-01 09:00:00',
    comment: '',
    outcome: 'pending',
  },
]

// 获取流程定义分页 Mock
export function getMockProcessDefinitionPage(params: any) {
  const { pageNum = 1, pageSize = 10, name = '', status = '' } = params

  let filteredList = [...mockProcessDefinitions]

  if (name) {
    filteredList = filteredList.filter((item) => item.name.includes(name))
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取流程实例分页 Mock
export function getMockProcessInstancePage(params: any) {
  const { pageNum = 1, pageSize = 10, processDefinitionName = '', status = '' } = params

  let filteredList = [...mockProcessInstances]

  if (processDefinitionName) {
    filteredList = filteredList.filter((item) =>
      item.processDefinitionName.includes(processDefinitionName)
    )
  }

  if (status) {
    filteredList = filteredList.filter((item) => item.status === status)
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取待办任务分页 Mock
export function getMockTodoTaskPage(params: any) {
  const { pageNum = 1, pageSize = 10, name = '' } = params

  let filteredList = [...mockTodoTasks]

  if (name) {
    filteredList = filteredList.filter((item) => item.name.includes(name))
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取已办任务分页 Mock
export function getMockDoneTaskPage(params: any) {
  const { pageNum = 1, pageSize = 10, name = '' } = params

  let filteredList = [...mockDoneTasks]

  if (name) {
    filteredList = filteredList.filter((item) => item.name.includes(name))
  }

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredList.slice(start, end)

  return {
    total: filteredList.length,
    rows,
  }
}

// 获取流程历史记录 Mock
export function getMockProcessHistory(_processInstanceId: string) {
  return mockProcessHistory
}
