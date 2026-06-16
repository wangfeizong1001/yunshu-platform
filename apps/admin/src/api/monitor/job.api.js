/**
 * 定时任务 API
 */
import { request } from '@/utils/httpClient';
export const getJobList = (params) => {
    return request({
        url: '/monitor/job/list',
        method: 'GET',
        params
    });
};
export const getJobPage = (params) => {
    return request({
        url: '/monitor/job/page',
        method: 'GET',
        params
    });
};
export const getJob = (jobId) => {
    return request({
        url: `/monitor/job/${jobId}`,
        method: 'GET'
    });
};
export const addJob = (data) => {
    return request({
        url: '/monitor/job',
        method: 'POST',
        data
    });
};
export const updateJob = (data) => {
    return request({
        url: '/monitor/job',
        method: 'PUT',
        data
    });
};
export const deleteJob = (jobId) => {
    return request({
        url: `/monitor/job/${jobId}`,
        method: 'DELETE'
    });
};
export const batchDeleteJob = (jobIds) => {
    return request({
        url: '/monitor/job/batch',
        method: 'DELETE',
        data: jobIds
    });
};
export const runJob = (jobId) => {
    return request({
        url: '/monitor/job/run',
        method: 'POST',
        params: { jobId }
    });
};
export const changeJobStatus = (jobId, status) => {
    return request({
        url: '/monitor/job/changeStatus',
        method: 'PUT',
        params: { jobId, status }
    });
};
export const getJobLogList = (params) => {
    return request({
        url: '/monitor/job/log/list',
        method: 'GET',
        params
    });
};
export const getJobLogPage = (params) => {
    return request({
        url: '/monitor/job/log/page',
        method: 'GET',
        params
    });
};
export const getJobLog = (jobLogId) => {
    return request({
        url: `/monitor/job/log/${jobLogId}`,
        method: 'GET'
    });
};
export const deleteJobLog = (jobLogId) => {
    return request({
        url: `/monitor/job/log/${jobLogId}`,
        method: 'DELETE'
    });
};
export const cleanJobLog = () => {
    return request({
        url: '/monitor/job/log/clean',
        method: 'DELETE'
    });
};
//# sourceMappingURL=job.api.js.map