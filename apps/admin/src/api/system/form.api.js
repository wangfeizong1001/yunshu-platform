/**
 * 表单管理相关 API
 */
import request from '@/utils/request';
// 获取表单列表
export function getFormList(params) {
  return request({
    url: '/system/form/list',
    method: 'get',
    params,
  });
}
// 获取表单分页列表
export function getFormPage(params) {
  return request({
    url: '/system/form/page',
    method: 'get',
    params,
  });
}
// 获取表单详情
export function getForm(formId) {
  return request({
    url: `/system/form/${formId}`,
    method: 'get',
  });
}
// 新增表单
export function addForm(data) {
  return request({
    url: '/system/form',
    method: 'post',
    data,
  });
}
// 修改表单
export function updateForm(data) {
  return request({
    url: '/system/form',
    method: 'put',
    data,
  });
}
// 删除表单
export function deleteForm(formId) {
  return request({
    url: `/system/form/${formId}`,
    method: 'delete',
  });
}
// 批量删除表单
export function batchDeleteForm(formIds) {
  return request({
    url: '/system/form/batch',
    method: 'delete',
    data: formIds,
  });
}
// 复制表单
export function copyForm(formId) {
  return request({
    url: `/system/form/copy/${formId}`,
    method: 'post',
  });
}
// 发布表单
export function publishForm(formId) {
  return request({
    url: `/system/form/publish/${formId}`,
    method: 'put',
  });
}
// 停用表单
export function stopForm(formId) {
  return request({
    url: `/system/form/stop/${formId}`,
    method: 'put',
  });
}
// 表单数据提交
export function submitFormData(formId, data) {
  return request({
    url: `/system/form/data/${formId}`,
    method: 'post',
    data,
  });
}
// 获取表单数据列表
export function getFormDataList(formId, params) {
  return request({
    url: `/system/form/data/${formId}/list`,
    method: 'get',
    params,
  });
}
//# sourceMappingURL=form.api.js.map
