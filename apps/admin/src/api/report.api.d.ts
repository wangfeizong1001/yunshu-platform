/**
 * 报表管理相关 API
 */
export interface ReportQuery {
  pageNum?: number;
  pageSize?: number;
  reportName?: string;
  reportCode?: string;
  reportType?: string;
  status?: string;
}
export interface ReportForm {
  reportId?: number;
  reportName?: string;
  reportCode?: string;
  reportType?: string;
  description?: string;
  config?: string;
  status?: string;
  remark?: string;
}
export interface ReportInfo {
  reportId: number;
  reportName: string;
  reportCode: string;
  reportType: string;
  description: string;
  config: string;
  status: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  remark: string;
}
export interface ReportDataQuery {
  reportId: number;
  params?: Record<string, any>;
}
export declare function getReportList(params: ReportQuery): Promise<unknown>;
export declare function getReportPage(params: ReportQuery): Promise<unknown>;
export declare function getReport(reportId: number): Promise<unknown>;
export declare function addReport(data: ReportForm): Promise<unknown>;
export declare function updateReport(data: ReportForm): Promise<unknown>;
export declare function deleteReport(reportId: number): Promise<unknown>;
export declare function batchDeleteReport(reportIds: number[]): Promise<unknown>;
export declare function getReportData(params: ReportDataQuery): Promise<unknown>;
export declare function exportReport(
  reportId: number,
  format: string,
  params?: Record<string, any>,
): Promise<unknown>;
//# sourceMappingURL=report.api.d.ts.map
