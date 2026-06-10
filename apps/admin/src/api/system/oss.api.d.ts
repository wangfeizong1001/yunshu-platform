/**
 * OSS文件存储 API
 */
export interface OssQuery {
  pageNum?: number;
  pageSize?: number;
  fileName?: string;
  bucketName?: string;
}
export interface OssForm {
  ossId?: number;
  fileName?: string;
  originalName?: string;
  fileSuffix?: string;
  url?: string;
  bucketName?: string;
  fileSize?: number;
}
export interface OssInfo {
  ossId: number;
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  bucketName: string;
  fileSize: number;
  createTime: string;
}
export interface OssConfig {
  ossType: string;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  domain: string;
  region: string;
}
export declare const getOssList: (params?: OssQuery) => Promise<unknown>;
export declare const getOssPage: (params?: OssQuery) => Promise<unknown>;
export declare const getOss: (ossId: number) => Promise<unknown>;
export declare const getOssConfig: () => Promise<unknown>;
export declare const uploadOss: (file: File) => Promise<unknown>;
export declare const deleteOss: (ossId: number) => Promise<unknown>;
export declare const batchDeleteOss: (ossIds: number[]) => Promise<unknown>;
export declare const downloadOss: (ossId: number) => Promise<unknown>;
//# sourceMappingURL=oss.api.d.ts.map
