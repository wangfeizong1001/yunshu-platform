/**
 * 大屏看板相关 API
 */
export interface DashboardInfo {
    dashboardId: number;
    dashboardName: string;
    dashboardCode: string;
    description: string;
    config: string;
    status: string;
    createTime: string;
    updateTime: string;
    createBy: string;
    remark: string;
}
export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalOrders: number;
    totalRevenue: number;
    userGrowthRate: number;
    orderGrowthRate: number;
    revenueGrowthRate: number;
    onlineUsers: number;
}
export interface RealTimeData {
    timestamp: string;
    data: Record<string, any>;
}
export interface SalesTrendData {
    date: string;
    sales: number;
    orders: number;
    visitors: number;
}
export interface RegionSalesData {
    name: string;
    value: number;
    longitude: number;
    latitude: number;
}
export interface CategoryData {
    name: string;
    value: number;
}
export declare function getDashboardList(params?: {
    pageNum?: number;
    pageSize?: number;
    dashboardName?: string;
    status?: string;
}): Promise<unknown>;
export declare function getDashboard(dashboardId: number): Promise<unknown>;
export declare function getDashboardStats(): Promise<unknown>;
export declare function getRealTimeData(): Promise<unknown>;
export declare function getSalesTrendData(): Promise<unknown>;
export declare function getRegionSalesData(): Promise<unknown>;
export declare function getCategoryData(): Promise<unknown>;
export declare function addDashboard(data: Partial<DashboardInfo>): Promise<unknown>;
export declare function updateDashboard(data: Partial<DashboardInfo>): Promise<unknown>;
export declare function deleteDashboard(dashboardId: number): Promise<unknown>;
//# sourceMappingURL=dashboard.api.d.ts.map