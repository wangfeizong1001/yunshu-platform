/**
 * 文件管理 Mock 数据
 */
import type { SysFile, SysFilePageResp, SysFileUploadResp } from '@yunshu/shared';
export declare const mockFileList: SysFile[];
export declare function getMockFilePage(params: any): SysFilePageResp;
export declare function getMockFileDetail(fileId: number): SysFile | undefined;
export declare function uploadMockFile(file: File): SysFileUploadResp;
export declare function deleteMockFile(fileId: number): boolean;
export declare function batchDeleteMockFile(fileIds: number[]): boolean;
//# sourceMappingURL=file.mock.d.ts.map