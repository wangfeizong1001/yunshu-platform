/**
 * 工作流管理 API
 */

import request from '@/utils/request'

// 流程定义查询参数
export interface ProcessDefinitionQuery {
  pageNum?: number
  pageSize?: number
  name?: string
  key?: string
  category?: string
  status?: string
}

// 流程定义表单
export interface ProcessDefinitionForm {
  id?: string
  name?: string
  key?: string
  category?: string
  description?: string
  xml?: string
  svg?: string
}

// 流程定义信息
export interface ProcessDefinition {
  id: string
  name: string
  key: string
  version: number
  category: string
  description?: string
  status: string
  deploymentId?: string
  resourceName?: string
  diagramResourceName?: string
  createTime: string
  updateTime: string
}

// 流程实例查询参数
export interface ProcessInstanceQuery {
  pageNum?: number
  pageSize?: number
  processDefinitionKey?: string
  processDefinitionName?: string
  businessKey?: string
  status?: string
  startUserId?: string
}

// 流程实例信息
export interface ProcessInstance {
  id: string
  processDefinitionId: string
  processDefinitionKey: string
  processDefinitionName: string
  businessKey?: string
  startUserId: string
  startTime: string
  endTime?: string
  duration?: number
  status: string
  currentTaskNames?: string[]
}

// 任务查询参数
export interface TaskQuery {
  pageNum?: number
  pageSize?: number
  name?: string
  processDefinitionName?: string
  assignee?: string
  candidateUser?: string
  candidateGroup?: string
}

// 任务信息
export interface Task {
  id: string
  name: string
  description?: string
  processDefinitionId: string
  processInstanceId: string
  executionId: string
  assignee?: string
  owner?: string
  startTime: string
  endTime?: string
  dueDate?: string
  priority: number
  taskDefinitionKey?: string
  businessKey?: string
  processDefinitionName?: string
}

// 审批请求
export interface ApprovalRequest {
  taskId: string
  comment?: string
  variables?: Record<string, any>
}

// 转办请求
export interface DelegateRequest {
  taskId: string
  userId: string
  comment?: string
}

// 委托请求
export interface AssignRequest {
  taskId: string
  userId: string
  comment?: string
}

// 获取流程定义列表
export function getProcessDefinitionList(params?: ProcessDefinitionQuery) {
  return request({
    url: '/workflow/process-definition/list',
    method: 'get',
    params
  })
}

// 获取流程定义分页
export function getProcessDefinitionPage(params?: ProcessDefinitionQuery) {
  return request({
    url: '/workflow/process-definition/page',
    method: 'get',
    params
  })
}

// 获取流程定义详情
export function getProcessDefinition(id: string) {
  return request({
    url: `/workflow/process-definition/${id}`,
    method: 'get'
  })
}

// 新增流程定义
export function addProcessDefinition(data: ProcessDefinitionForm) {
  return request({
    url: '/workflow/process-definition',
    method: 'post',
    data
  })
}

// 更新流程定义
export function updateProcessDefinition(data: ProcessDefinitionForm) {
  return request({
    url: '/workflow/process-definition',
    method: 'put',
    data
  })
}

// 删除流程定义
export function deleteProcessDefinition(id: string) {
  return request({
    url: `/workflow/process-definition/${id}`,
    method: 'delete'
  })
}

// 批量删除流程定义
export function batchDeleteProcessDefinition(ids: string[]) {
  return request({
    url: '/workflow/process-definition/batch',
    method: 'delete',
    data: ids
  })
}

// 发布流程定义
export function deployProcessDefinition(id: string) {
  return request({
    url: `/workflow/process-definition/deploy/${id}`,
    method: 'post'
  })
}

// 挂起流程定义
export function suspendProcessDefinition(id: string) {
  return request({
    url: `/workflow/process-definition/suspend/${id}`,
    method: 'post'
  })
}

// 激活流程定义
export function activateProcessDefinition(id: string) {
  return request({
    url: `/workflow/process-definition/activate/${id}`,
    method: 'post'
  })
}

// 获取流程实例列表
export function getProcessInstanceList(params?: ProcessInstanceQuery) {
  return request({
    url: '/workflow/process-instance/list',
    method: 'get',
    params
  })
}

// 获取流程实例分页
export function getProcessInstancePage(params?: ProcessInstanceQuery) {
  return request({
    url: '/workflow/process-instance/page',
    method: 'get',
    params
  })
}

// 获取流程实例详情
export function getProcessInstance(id: string) {
  return request({
    url: `/workflow/process-instance/${id}`,
    method: 'get'
  })
}

// 启动流程实例
export function startProcessInstance(processDefinitionKey: string, businessKey?: string, variables?: Record<string, any>) {
  return request({
    url: '/workflow/process-instance/start',
    method: 'post',
    data: { processDefinitionKey, businessKey, variables }
  })
}

// 终止流程实例
export function terminateProcessInstance(id: string, reason?: string) {
  return request({
    url: `/workflow/process-instance/terminate/${id}`,
    method: 'post',
    data: { reason }
  })
}

// 获取待办任务列表
export function getTodoTaskList(params?: TaskQuery) {
  return request({
    url: '/workflow/task/todo/list',
    method: 'get',
    params
  })
}

// 获取待办任务分页
export function getTodoTaskPage(params?: TaskQuery) {
  return request({
    url: '/workflow/task/todo/page',
    method: 'get',
    params
  })
}

// 获取已办任务列表
export function getDoneTaskList(params?: TaskQuery) {
  return request({
    url: '/workflow/task/done/list',
    method: 'get',
    params
  })
}

// 获取已办任务分页
export function getDoneTaskPage(params?: TaskQuery) {
  return request({
    url: '/workflow/task/done/page',
    method: 'get',
    params
  })
}

// 获取任务详情
export function getTask(id: string) {
  return request({
    url: `/workflow/task/${id}`,
    method: 'get'
  })
}

// 审批通过
export function approveTask(data: ApprovalRequest) {
  return request({
    url: '/workflow/task/approve',
    method: 'post',
    data
  })
}

// 审批拒绝
export function rejectTask(data: ApprovalRequest) {
  return request({
    url: '/workflow/task/reject',
    method: 'post',
    data
  })
}

// 转办
export function delegateTask(data: DelegateRequest) {
  return request({
    url: '/workflow/task/delegate',
    method: 'post',
    data
  })
}

// 委托
export function assignTask(data: AssignRequest) {
  return request({
    url: '/workflow/task/assign',
    method: 'post',
    data
  })
}

// 获取流程历史记录
export function getProcessHistory(processInstanceId: string) {
  return request({
    url: `/workflow/process-instance/${processInstanceId}/history`,
    method: 'get'
  })
}
