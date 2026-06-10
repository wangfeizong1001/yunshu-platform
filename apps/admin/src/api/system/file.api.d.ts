/**
 * 文件管理 API
 */
export interface FileQuery {
  pageNum?: number;
  pageSize?: number;
  fileName?: string;
  fileType?: string;
}
export interface FileForm {
  fileId?: number;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  uploadUser?: string;
  uploadTime?: string;
}
export interface FileInfo {
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadUser: string;
  uploadTime: string;
}
export declare const getFileList: (params?: FileQuery) => Promise<unknown>;
export declare const getFilePage: (params?: FileQuery) => Promise<unknown>;
export declare const getFile: (fileId: number) => Promise<unknown>;
export declare const uploadFile: (file: File) => Promise<unknown>;
export declare const deleteFile: (fileId: number) => Promise<unknown>;
export declare const batchDeleteFile: (fileIds: number[]) => Promise<unknown>;
export declare const downloadFile: (fileId: number) => Promise<unknown>;
export declare const previewFile: (fileId: number) => Promise<unknown>;
//# sourceMappingURL=file.api.d.ts.map
