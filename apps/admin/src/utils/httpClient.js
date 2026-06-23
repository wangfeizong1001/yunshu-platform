import axios from 'axios';
import { ref, shallowRef } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { buildAuthHeaders } from '@/utils/requestHeaders';
let globalLoading = null;
let globalLoadingCount = 0;
function beginLoading(text) {
    globalLoadingCount++;
    if (!globalLoading) {
        globalLoading = ElLoading.service({
            lock: true,
            text,
            background: 'rgba(255, 255, 255, 0.6)',
            fullscreen: false,
        });
    }
}
function endLoading() {
    globalLoadingCount = Math.max(0, globalLoadingCount - 1);
    if (globalLoadingCount === 0 && globalLoading) {
        globalLoading.close();
        globalLoading = null;
    }
}
const service = axios.create({
    baseURL: '/api',
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
    },
});
service.interceptors.request.use((config) => {
    // 统一由 buildAuthHeaders 处理：注入 Authorization + tenant-id 头
    return buildAuthHeaders(config);
}, (error) => {
    console.error('[httpClient] 请求失败:', error);
    return Promise.reject(error);
});
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
        window.location.hash = '#/403';
    }
    else if (status !== undefined && status >= 500) {
        ElMessage.error(`服务器异常 (${status})，请稍后重试`);
        window.location.hash = '#/500';
    }
    else {
        ElMessage.error(message);
    }
    return Promise.reject(error);
});
export async function request(config, options = {}) {
    const { showLoading = false, loadingText = '加载中...' } = options;
    if (showLoading)
        beginLoading(loadingText);
    try {
        const response = await service.request(config);
        return response.data;
    }
    finally {
        if (showLoading)
            endLoading();
    }
}
export function httpGet(url, params, config) {
    return request({ method: 'GET', url, params, ...config });
}
export function httpPost(url, data, config) {
    return request({ method: 'POST', url, data, ...config });
}
export function httpPut(url, data, config) {
    return request({ method: 'PUT', url, data, ...config });
}
export function httpDelete(url, params, config) {
    return request({ method: 'DELETE', url, params, ...config });
}
export function httpUpload(url, formData, onProgress) {
    return request({
        method: 'POST',
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                onProgress?.(Math.round((progressEvent.loaded / progressEvent.total) * 100));
            }
        },
    });
}
export async function httpDownload(url, filename) {
    const response = await service.get(url, { responseType: 'blob' });
    const urlObj = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = urlObj;
    link.download = filename ?? url.split('/').pop() ?? 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlObj);
}
export function useRequest(fetcher, options = { immediate: true }) {
    const data = shallowRef(null);
    const loading = ref(false);
    const error = shallowRef(null);
    const execute = async () => {
        loading.value = true;
        error.value = null;
        try {
            const result = await fetcher();
            data.value = result;
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            error.value = err;
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    if (options.immediate) {
        execute().catch(() => {
            // noop
        });
    }
    return { data, loading, error, execute };
}
export default service;
//# sourceMappingURL=httpClient.js.map