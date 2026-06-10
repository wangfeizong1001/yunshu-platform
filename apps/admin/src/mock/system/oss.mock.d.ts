/**
 * OSS 文件存储 Mock 数据
 */
import type { OssConfig, OssFile, OssFilePageResp, OssConfigResp, OssUploadResp } from '@yunshu/shared';
export declare const mockOssConfig: OssConfig;
export declare const mockOssConfigList: OssConfig[];
export declare const mockOssFileList: OssFile[];
export declare function getMockOssConfig(): OssConfigResp;
export declare function getMockOssFilePage(params: any): OssFilePageResp;
export declare function getMockOssFileList(params?: any): OssFile[];
export declare function getMockOssFileDetail(fileId: number): OssFile | undefined;
export declare function uploadMockOssFile(file: File, configId?: number): OssUploadResp;
export declare function deleteMockOssFile(fileId: number): boolean;
export declare function batchDeleteMockOssFile(fileIds: number[]): boolean;
//# sourceMappingURL=oss.mock.d.ts.map