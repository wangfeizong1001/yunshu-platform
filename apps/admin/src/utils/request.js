/**
 * HTTP 请求工具
 *
 * 基于 axios 的请求封装，提供统一的请求处理、错误处理和拦截器
 */
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import cache, { CACHE_KEYS } from '@/utils/cache';
// 获取环境变量
const env = import.meta.env;
const BASE_URL = env.VITE_API_BASE_URL || '/api';
/** 创建 axios 实例 */
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
/** 加载状态实例 */
let loadingInstance = null;
/** 请求计数器 */
let requestCount = 0;
/**
 * 显示加载状态
 */
const showLoading = () => {
  requestCount++;
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }
};
/**
 * 隐藏加载状态
 */
const hideLoading = () => {
  requestCount--;
  if (requestCount <= 0 && loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
    requestCount = 0;
  }
};
/** 请求拦截器 */
instance.interceptors.request.use(
  (config) => {
    // 显示加载状态（如果有配置）
    if (config.loading) {
      showLoading();
    }
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 添加租户ID
    const tenantId = localStorage.getItem('Tenant-Id');
    if (tenantId && tenantId !== '0') {
      config.headers['tenant-id'] = tenantId;
    }
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  },
);
/** 响应拦截器 */
instance.interceptors.response.use(
  (response) => {
    hideLoading();
    const { success, message } = response.data;
    // 成功响应
    if (success) {
      return response;
    }
    // 处理失败情况
    ElMessage.error(message || '请求失败');
    return Promise.reject(new Error(message || '请求失败'));
  },
  (error) => {
    hideLoading();
    const { response } = error;
    if (response) {
      const { status, data } = response;
      switch (status) {
        case 400:
          ElMessage.error(data?.msg || '请求参数错误');
          break;
        case 401:
          // 未授权，跳转登录
          ElMessage.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          ElMessage.error('没有权限访问该资源');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误');
          break;
        case 502:
          ElMessage.error('网关错误');
          break;
        case 503:
          ElMessage.error('服务不可用');
          break;
        case 504:
          ElMessage.error('网关超时');
          break;
        default:
          ElMessage.error(data?.msg || '请求失败');
      }
    } else {
      // 网络错误
      if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请稍后重试');
      } else if (error.message.includes('Network Error')) {
        ElMessage.error('网络错误，请检查网络连接');
      } else {
        ElMessage.error('网络错误，请检查网络连接');
      }
    }
    return Promise.reject(error);
  },
);
/**
 * 生成缓存键名
 */
function generateCacheKey(config) {
  const { method, url, params, data } = config;
  return `${CACHE_KEYS.REQUEST}:${method?.toUpperCase() || 'GET'}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
}
/**
 * 发送请求
 * @param config 请求配置
 */
export function request(config) {
  const { cache: enableCache = false, cacheTTL, forceRefresh = false } = config;
  if (enableCache && (config.method?.toUpperCase() === 'GET' || !config.method)) {
    const cacheKey = generateCacheKey(config);
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData !== undefined) {
        return Promise.resolve(cachedData);
      }
    }
  }
  return instance
    .request(config)
    .then((res) => {
      const responseData = res.data.data;
      if (enableCache && (config.method?.toUpperCase() === 'GET' || !config.method)) {
        const cacheKey = generateCacheKey(config);
        cache.set(cacheKey, responseData, { ttl: cacheTTL });
      }
      return responseData;
    })
    .catch((error) => {
      if (!config.ignoreError) {
        throw error;
      }
      return Promise.reject(error);
    });
}
/**
 * GET 请求
 */
export function get(url, params, config) {
  return request({ url, method: 'get', params, ...config });
}
/**
 * POST 请求
 */
export function post(url, data, config) {
  return request({ url, method: 'post', data, ...config });
}
/**
 * PUT 请求
 */
export function put(url, data, config) {
  return request({ url, method: 'put', data, ...config });
}
/**
 * DELETE 请求
 */
export function del(url, params, config) {
  return request({ url, method: 'delete', params, ...config });
}
/**
 * PATCH 请求
 */
export function patch(url, data, config) {
  return request({ url, method: 'patch', data, ...config });
}
/**
 * 下载文件
 */
export function download(url, params, filename) {
  return instance
    .get(url, {
      params,
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data]);
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = filename || '下载文件';
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    });
}
/**
 * 上传文件
 */
export function upload(url, file, config) {
  const formData = file instanceof File ? new FormData() : file;
  if (file instanceof File) {
    formData.append('file', file);
  }
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
}
/** 导出 axios 实例 */
export { instance as axiosInstance };
/** 默认导出 */
export default request;
//# sourceMappingURL=request.js.map
