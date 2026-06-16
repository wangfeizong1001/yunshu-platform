/**
 * 工作流管理 API
 */
import { request } from '@/utils/httpClient';
// 获取流程定义列表
export function getProcessDefinitionList(params) {
    return request({
        url: '/workflow/process-definition/list',
        method: 'GET',
        params
    });
}
// 获取流程定义分页
export function getProcessDefinitionPage(params) {
    return request({
        url: '/workflow/process-definition/page',
        method: 'GET',
        params
    });
}
// 获取流程定义详情
export function getProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/${id}`,
        method: 'GET'
    });
}
// 新增流程定义
export function addProcessDefinition(data) {
    return request({
        url: '/workflow/process-definition',
        method: 'POST',
        data
    });
}
// 更新流程定义
export function updateProcessDefinition(data) {
    return request({
        url: '/workflow/process-definition',
        method: 'PUT',
        data
    });
}
// 删除流程定义
export function deleteProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/${id}`,
        method: 'DELETE'
    });
}
// 批量删除流程定义
export function batchDeleteProcessDefinition(ids) {
    return request({
        url: '/workflow/process-definition/batch',
        method: 'DELETE',
        data: ids
    });
}
// 发布流程定义
export function deployProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/deploy/${id}`,
        method: 'POST'
    });
}
// 挂起流程定义
export function suspendProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/suspend/${id}`,
        method: 'POST'
    });
}
// 激活流程定义
export function activateProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/activate/${id}`,
        method: 'POST'
    });
}
// 获取流程实例列表
export function getProcessInstanceList(params) {
    return request({
        url: '/workflow/process-instance/list',
        method: 'GET',
        params
    });
}
// 获取流程实例分页
export function getProcessInstancePage(params) {
    return request({
        url: '/workflow/process-instance/page',
        method: 'GET',
        params
    });
}
// 获取流程实例详情
export function getProcessInstance(id) {
    return request({
        url: `/workflow/process-instance/${id}`,
        method: 'GET'
    });
}
// 启动流程实例
export function startProcessInstance(processDefinitionKey, businessKey, variables) {
    return request({
        url: '/workflow/process-instance/start',
        method: 'POST',
        data: { processDefinitionKey, businessKey, variables }
    });
}
// 终止流程实例
export function terminateProcessInstance(id, reason) {
    return request({
        url: `/workflow/process-instance/terminate/${id}`,
        method: 'POST',
        data: { reason }
    });
}
// 获取待办任务列表
export function getTodoTaskList(params) {
    return request({
        url: '/workflow/task/todo/list',
        method: 'GET',
        params
    });
}
// 获取待办任务分页
export function getTodoTaskPage(params) {
    return request({
        url: '/workflow/task/todo/page',
        method: 'GET',
        params
    });
}
// 获取已办任务列表
export function getDoneTaskList(params) {
    return request({
        url: '/workflow/task/done/list',
        method: 'GET',
        params
    });
}
// 获取已办任务分页
export function getDoneTaskPage(params) {
    return request({
        url: '/workflow/task/done/page',
        method: 'GET',
        params
    });
}
// 获取任务详情
export function getTask(id) {
    return request({
        url: `/workflow/task/${id}`,
        method: 'GET'
    });
}
// 审批通过
export function approveTask(data) {
    return request({
        url: '/workflow/task/approve',
        method: 'POST',
        data
    });
}
// 审批拒绝
export function rejectTask(data) {
    return request({
        url: '/workflow/task/reject',
        method: 'POST',
        data
    });
}
// 转办
export function delegateTask(data) {
    return request({
        url: '/workflow/task/delegate',
        method: 'POST',
        data
    });
}
// 委托
export function assignTask(data) {
    return request({
        url: '/workflow/task/assign',
        method: 'POST',
        data
    });
}
// 获取流程历史记录
export function getProcessHistory(processInstanceId) {
    return request({
        url: `/workflow/process-instance/${processInstanceId}/history`,
        method: 'GET'
    });
}
//# sourceMappingURL=workflow.api.js.map