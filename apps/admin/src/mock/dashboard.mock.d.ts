/**
 * 大屏看板 Mock 数据
 */
import type {
  DashboardInfo,
  DashboardStats,
  SalesTrendData,
  RegionSalesData,
  CategoryData,
} from '@/api/dashboard.api';
export declare const mockDashboardList: DashboardInfo[];
export declare function getMockDashboardStats(): DashboardStats;
export declare function getMockSalesTrendData(): SalesTrendData[];
export declare function getMockRegionSalesData(): RegionSalesData[];
export declare function getMockCategoryData(): CategoryData[];
export declare function getMockRealTimeData(): {
  timestamp: string;
  data: {
    currentOrders: number;
    currentUsers: number;
    currentRevenue: number;
  };
};
export declare function getMockDashboardList(params: any): {
  total: number;
  rows: DashboardInfo[];
};
//# sourceMappingURL=dashboard.mock.d.ts.map
