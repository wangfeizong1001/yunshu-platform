/**
 * 操作日志 API
 */
export interface OperlogQuery {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  operName?: string;
  businessType?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}
export interface OperlogInfo {
  operId: number;
  title: string;
  businessType: string;
  method: string;
  requestMethod: string;
  operatorType: string;
  operName: string;
  deptName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  jsonResult: string;
  status: string;
  errorMsg: string;
  operTime: string;
  costTime: number;
}
export declare const getOperlogList: (params?: OperlogQuery) => Promise<unknown>;
export declare const getOperlogPage: (params?: OperlogQuery) => Promise<unknown>;
export declare const getOperlog: (operId: number) => Promise<unknown>;
export declare const deleteOperlog: (operId: number) => Promise<unknown>;
export declare const batchDeleteOperlog: (operIds: number[]) => Promise<unknown>;
export declare const cleanOperlog: () => Promise<unknown>;
//# sourceMappingURL=operlog.api.d.ts.map
