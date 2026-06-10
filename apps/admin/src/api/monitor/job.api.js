/**
 * 定时任务 API
 */
import request from '@/utils/request';
export const getJobList = (params) => {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params,
  });
};
export const getJobPage = (params) => {
  return request({
    url: '/monitor/job/page',
    method: 'get',
    params,
  });
};
export const getJob = (jobId) => {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'get',
  });
};
export const addJob = (data) => {
  return request({
    url: '/monitor/job',
    method: 'post',
    data,
  });
};
export const updateJob = (data) => {
  return request({
    url: '/monitor/job',
    method: 'put',
    data,
  });
};
export const deleteJob = (jobId) => {
  return request({
    url: `/monitor/job/${jobId}`,
    method: 'delete',
  });
};
export const batchDeleteJob = (jobIds) => {
  return request({
    url: '/monitor/job/batch',
    method: 'delete',
    data: jobIds,
  });
};
export const runJob = (jobId) => {
  return request({
    url: `/monitor/job/run`,
    method: 'post',
    params: { jobId },
  });
};
export const changeJobStatus = (jobId, status) => {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    params: { jobId, status },
  });
};
export const getJobLogList = (params) => {
  return request({
    url: '/monitor/job/log/list',
    method: 'get',
    params,
  });
};
export const getJobLogPage = (params) => {
  return request({
    url: '/monitor/job/log/page',
    method: 'get',
    params,
  });
};
export const getJobLog = (jobLogId) => {
  return request({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'get',
  });
};
export const deleteJobLog = (jobLogId) => {
  return request({
    url: `/monitor/job/log/${jobLogId}`,
    method: 'delete',
  });
};
export const cleanJobLog = () => {
  return request({
    url: '/monitor/job/log/clean',
    method: 'delete',
  });
};
//# sourceMappingURL=job.api.js.map
