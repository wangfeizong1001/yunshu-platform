/**
 * 报表 Mock 数据
 */
import type { ReportInfo } from '@/api/report.api';
export declare const mockReportList: ReportInfo[];
export declare function getMockReportPage(params: any): {
    total: number;
    rows: ReportInfo[];
};
export declare function getMockReportDetail(reportId: number): ReportInfo | undefined;
export declare function addMockReport(report: Partial<ReportInfo>): ReportInfo;
export declare function updateMockReport(reportId: number, report: Partial<ReportInfo>): ReportInfo | undefined;
export declare function deleteMockReport(reportId: number): boolean;
export declare function getMockReportData(reportId: number): any;
//# sourceMappingURL=report.mock.d.ts.map