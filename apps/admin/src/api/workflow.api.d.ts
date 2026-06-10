/**
 * 工作流管理 API
 */
export interface ProcessDefinitionQuery {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  key?: string;
  category?: string;
  status?: string;
}
export interface ProcessDefinitionForm {
  id?: string;
  name?: string;
  key?: string;
  category?: string;
  description?: string;
  xml?: string;
  svg?: string;
}
export interface ProcessDefinition {
  id: string;
  name: string;
  key: string;
  version: number;
  category: string;
  description?: string;
  status: string;
  deploymentId?: string;
  resourceName?: string;
  diagramResourceName?: string;
  createTime: string;
  updateTime: string;
}
export interface ProcessInstanceQuery {
  pageNum?: number;
  pageSize?: number;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  businessKey?: string;
  status?: string;
  startUserId?: string;
}
export interface ProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  businessKey?: string;
  startUserId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: string;
  currentTaskNames?: string[];
}
export interface TaskQuery {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  processDefinitionName?: string;
  assignee?: string;
  candidateUser?: string;
  candidateGroup?: string;
}
export interface Task {
  id: string;
  name: string;
  description?: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  assignee?: string;
  owner?: string;
  startTime: string;
  endTime?: string;
  dueDate?: string;
  priority: number;
  taskDefinitionKey?: string;
  businessKey?: string;
  processDefinitionName?: string;
}
export interface ApprovalRequest {
  taskId: string;
  comment?: string;
  variables?: Record<string, any>;
}
export interface DelegateRequest {
  taskId: string;
  userId: string;
  comment?: string;
}
export interface AssignRequest {
  taskId: string;
  userId: string;
  comment?: string;
}
export declare function getProcessDefinitionList(params?: ProcessDefinitionQuery): Promise<unknown>;
export declare function getProcessDefinitionPage(params?: ProcessDefinitionQuery): Promise<unknown>;
export declare function getProcessDefinition(id: string): Promise<unknown>;
export declare function addProcessDefinition(data: ProcessDefinitionForm): Promise<unknown>;
export declare function updateProcessDefinition(data: ProcessDefinitionForm): Promise<unknown>;
export declare function deleteProcessDefinition(id: string): Promise<unknown>;
export declare function batchDeleteProcessDefinition(ids: string[]): Promise<unknown>;
export declare function deployProcessDefinition(id: string): Promise<unknown>;
export declare function suspendProcessDefinition(id: string): Promise<unknown>;
export declare function activateProcessDefinition(id: string): Promise<unknown>;
export declare function getProcessInstanceList(params?: ProcessInstanceQuery): Promise<unknown>;
export declare function getProcessInstancePage(params?: ProcessInstanceQuery): Promise<unknown>;
export declare function getProcessInstance(id: string): Promise<unknown>;
export declare function startProcessInstance(
  processDefinitionKey: string,
  businessKey?: string,
  variables?: Record<string, any>,
): Promise<unknown>;
export declare function terminateProcessInstance(id: string, reason?: string): Promise<unknown>;
export declare function getTodoTaskList(params?: TaskQuery): Promise<unknown>;
export declare function getTodoTaskPage(params?: TaskQuery): Promise<unknown>;
export declare function getDoneTaskList(params?: TaskQuery): Promise<unknown>;
export declare function getDoneTaskPage(params?: TaskQuery): Promise<unknown>;
export declare function getTask(id: string): Promise<unknown>;
export declare function approveTask(data: ApprovalRequest): Promise<unknown>;
export declare function rejectTask(data: ApprovalRequest): Promise<unknown>;
export declare function delegateTask(data: DelegateRequest): Promise<unknown>;
export declare function assignTask(data: AssignRequest): Promise<unknown>;
export declare function getProcessHistory(processInstanceId: string): Promise<unknown>;
//# sourceMappingURL=workflow.api.d.ts.map
