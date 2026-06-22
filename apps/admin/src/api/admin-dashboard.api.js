/**
 * 管理后台仪表盘 API
 */
import { request } from '@/utils/httpClient';
/**
 * 统一的响应数据提取：确保 success === true 且 data 存在
 * 失败时直接抛出错误（或返回 undefined），避免消费方层层 if (res.data) 判断
 */
function extractData(resp, fallback) {
    if (resp?.success && resp.data !== undefined && resp.data !== null) {
        return resp.data;
    }
    return fallback;
}
// 获取仪表盘概览
export async function getDashboardOverview() {
    return request({
        url: '/admin-dashboard/overview',
        method: 'GET'
    });
}
// 获取用户增长趋势
export async function getUserGrowthTrend() {
    return request({
        url: '/admin-dashboard/user-growth',
        method: 'GET'
    });
}
// 获取操作类型分布
export async function getOperationTypeDistribution() {
    return request({
        url: '/admin-dashboard/operation-types',
        method: 'GET'
    });
}
// 获取系统资源趋势
export async function getSystemResourceTrend() {
    return request({
        url: '/admin-dashboard/resource-trend',
        method: 'GET'
    });
}
// 获取登录时间分布
export async function getLoginDistribution() {
    return request({
        url: '/admin-dashboard/login-distribution',
        method: 'GET'
    });
}
// 获取今日任务统计
export async function getTaskStats() {
    return request({
        url: '/admin-dashboard/task-stats',
        method: 'GET'
    });
}
export { extractData };
//# sourceMappingURL=admin-dashboard.api.js.map