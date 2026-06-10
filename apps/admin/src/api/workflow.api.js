/**
 * 工作流管理 API
 */
import request from '@/utils/request';
// 获取流程定义列表
export function getProcessDefinitionList(params) {
    return request({
        url: '/workflow/process-definition/list',
        method: 'get',
        params
    });
}
// 获取流程定义分页
export function getProcessDefinitionPage(params) {
    return request({
        url: '/workflow/process-definition/page',
        method: 'get',
        params
    });
}
// 获取流程定义详情
export function getProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/${id}`,
        method: 'get'
    });
}
// 新增流程定义
export function addProcessDefinition(data) {
    return request({
        url: '/workflow/process-definition',
        method: 'post',
        data
    });
}
// 更新流程定义
export function updateProcessDefinition(data) {
    return request({
        url: '/workflow/process-definition',
        method: 'put',
        data
    });
}
// 删除流程定义
export function deleteProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/${id}`,
        method: 'delete'
    });
}
// 批量删除流程定义
export function batchDeleteProcessDefinition(ids) {
    return request({
        url: '/workflow/process-definition/batch',
        method: 'delete',
        data: ids
    });
}
// 发布流程定义
export function deployProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/deploy/${id}`,
        method: 'post'
    });
}
// 挂起流程定义
export function suspendProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/suspend/${id}`,
        method: 'post'
    });
}
// 激活流程定义
export function activateProcessDefinition(id) {
    return request({
        url: `/workflow/process-definition/activate/${id}`,
        method: 'post'
    });
}
// 获取流程实例列表
export function getProcessInstanceList(params) {
    return request({
        url: '/workflow/process-instance/list',
        method: 'get',
        params
    });
}
// 获取流程实例分页
export function getProcessInstancePage(params) {
    return request({
        url: '/workflow/process-instance/page',
        method: 'get',
        params
    });
}
// 获取流程实例详情
export function getProcessInstance(id) {
    return request({
        url: `/workflow/process-instance/${id}`,
        method: 'get'
    });
}
// 启动流程实例
export function startProcessInstance(processDefinitionKey, businessKey, variables) {
    return request({
        url: '/workflow/process-instance/start',
        method: 'post',
        data: { processDefinitionKey, businessKey, variables }
    });
}
// 终止流程实例
export function terminateProcessInstance(id, reason) {
    return request({
        url: `/workflow/process-instance/terminate/${id}`,
        method: 'post',
        data: { reason }
    });
}
// 获取待办任务列表
export function getTodoTaskList(params) {
    return request({
        url: '/workflow/task/todo/list',
        method: 'get',
        params
    });
}
// 获取待办任务分页
export function getTodoTaskPage(params) {
    return request({
        url: '/workflow/task/todo/page',
        method: 'get',
        params
    });
}
// 获取已办任务列表
export function getDoneTaskList(params) {
    return request({
        url: '/workflow/task/done/list',
        method: 'get',
        params
    });
}
// 获取已办任务分页
export function getDoneTaskPage(params) {
    return request({
        url: '/workflow/task/done/page',
        method: 'get',
        params
    });
}
// 获取任务详情
export function getTask(id) {
    return request({
        url: `/workflow/task/${id}`,
        method: 'get'
    });
}
// 审批通过
export function approveTask(data) {
    return request({
        url: '/workflow/task/approve',
        method: 'post',
        data
    });
}
// 审批拒绝
export function rejectTask(data) {
    return request({
        url: '/workflow/task/reject',
        method: 'post',
        data
    });
}
// 转办
export function delegateTask(data) {
    return request({
        url: '/workflow/task/delegate',
        method: 'post',
        data
    });
}
// 委托
export function assignTask(data) {
    return request({
        url: '/workflow/task/assign',
        method: 'post',
        data
    });
}
// 获取流程历史记录
export function getProcessHistory(processInstanceId) {
    return request({
        url: `/workflow/process-instance/${processInstanceId}/history`,
        method: 'get'
    });
}
//# sourceMappingURL=workflow.api.js.map