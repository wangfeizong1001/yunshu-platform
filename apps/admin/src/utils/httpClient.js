/**
 * 云枢中台 — HTTP 请求客户端
 *
 * 统一 axios 实例封装，特性：
 *  1. 自动注入 Authorization: Bearer <token>
 *  2. 401 时派发 yunshu:auth-expired 自定义事件（便于全局做登出动作）
 *  3. 对 success: false 的统一响应进行 ElMessage 警告
 *  4. 提供泛型 request/httpGet/httpPost/httpPut/httpDelete 便捷方法
 *
 * @module @yunshu/admin/utils/httpClient
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getToken } from './security/authStorage';
// --------------------------------------------------------------------------
// axios 实例
// --------------------------------------------------------------------------
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
    },
});
// 请求拦截器：注入 token
service.interceptors.request.use((config) => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// 响应拦截器：处理 401 / success=false
service.interceptors.response.use((response) => {
    const resp = response.data;
    if (resp && typeof resp === 'object' && 'success' in resp && resp.success === false) {
        if (resp.message) {
            ElMessage.warning(resp.message);
        }
    }
    return response;
}, (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message ?? '请求失败';
    if (status === 401) {
        ElMessage.warning('登录已过期，请重新登录');
        window.dispatchEvent(new CustomEvent('yunshu:auth-expired'));
    }
    else if (status === 403) {
        ElMessage.error('无访问权限');
    }
    else if (status !== undefined && status >= 500) {
        ElMessage.error(`服务器异常 (${status})，请稍后重试`);
    }
    else {
        ElMessage.error(message);
    }
    return Promise.reject(error);
});
// --------------------------------------------------------------------------
// 便捷方法
// --------------------------------------------------------------------------
export function request(config) {
    return service.request(config).then((resp) => resp.data);
}
export function httpGet(url, config) {
    return request({ ...config, url, method: 'GET' });
}
export function httpPost(url, data, config) {
    return request({ ...config, url, method: 'POST', data });
}
export function httpPut(url, data, config) {
    return request({ ...config, url, method: 'PUT', data });
}
export function httpDelete(url, config) {
    return request({ ...config, url, method: 'DELETE' });
}
export default service;
//# sourceMappingURL=httpClient.js.map