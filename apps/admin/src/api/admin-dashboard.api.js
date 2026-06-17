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
/**
 * 获取大屏模板列表
 * @returns 模板列表
 */
export async function getDashboardTemplates() {
    try {
        const response = await request({
            url: '/dashboard/templates',
            method: 'GET',
        });
        // 处理响应数据
        const responseData = response;
        if (responseData && responseData.success && responseData.data) {
            return responseData.data;
        }
        // 如果没有数据，返回默认模板
        return [
            { id: 'enterprise', name: '企业运营监控', config: '', description: '企业运营数据监控大屏模板' },
            { id: 'sales', name: '销售数据分析', config: '', description: '销售数据可视化分析模板' },
            { id: 'realtime', name: '实时数据监控', config: '', description: '实时数据监控大屏模板' },
        ];
    }
    catch (error) {
        console.error('获取模板列表失败:', error);
        // 返回默认模板
        return [
            { id: 'enterprise', name: '企业运营监控', config: '', description: '企业运营数据监控大屏模板' },
            { id: 'sales', name: '销售数据分析', config: '', description: '销售数据可视化分析模板' },
            { id: 'realtime', name: '实时数据监控', config: '', description: '实时数据监控大屏模板' },
        ];
    }
}
/**
 * 获取大屏详情
 * @param dashboardId 大屏ID
 * @returns 大屏配置信息
 */
export async function getDashboard(dashboardId) {
    try {
        const response = await request({
            url: `/dashboard/${dashboardId}`,
            method: 'GET',
        });
        const responseData = response;
        if (responseData && responseData.success && responseData.data) {
            return responseData.data;
        }
        return null;
    }
    catch (error) {
        console.error('获取大屏详情失败:', error);
        return null;
    }
}
/**
 * 保存大屏配置
 * @param dashboard 大屏配置数据
 * @returns 保存结果（包含新创建的ID）
 */
export async function saveDashboard(dashboard) {
    try {
        const response = await request({
            url: '/dashboard',
            method: 'POST',
            data: dashboard,
        });
        const responseData = response;
        if (responseData && responseData.success) {
            return { dashboardId: responseData.data.dashboardId || Date.now() };
        }
        return null;
    }
    catch (error) {
        console.error('保存大屏失败:', error);
        return null;
    }
}
/**
 * 更新大屏配置
 * @param dashboardId 大屏ID
 * @param dashboard 大屏配置数据
 * @returns 更新结果
 */
export async function updateDashboard(dashboardId, dashboard) {
    try {
        const response = await request({
            url: `/dashboard/${dashboardId}`,
            method: 'PUT',
            data: dashboard,
        });
        const responseData = response;
        return responseData && responseData.success === true;
    }
    catch (error) {
        console.error('更新大屏失败:', error);
        return false;
    }
}
/**
 * 删除大屏
 * @param dashboardId 大屏ID
 * @returns 删除结果
 */
export async function deleteDashboard(dashboardId) {
    try {
        const response = await request({
            url: `/dashboard/${dashboardId}`,
            method: 'DELETE',
        });
        const responseData = response;
        return responseData && responseData.success === true;
    }
    catch (error) {
        console.error('删除大屏失败:', error);
        return false;
    }
}
/**
 * 获取大屏列表
 * @param params 查询参数
 * @returns 大屏列表
 */
export async function getDashboardList(params) {
    try {
        const response = await request({
            url: '/dashboard/list',
            method: 'GET',
            params,
        });
        const responseData = response;
        if (responseData && responseData.success && responseData.data) {
            return responseData.data;
        }
        return { rows: [], total: 0 };
    }
    catch (error) {
        console.error('获取大屏列表失败:', error);
        return { rows: [], total: 0 };
    }
}
//# sourceMappingURL=admin-dashboard.api.js.map