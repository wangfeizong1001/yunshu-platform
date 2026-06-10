/**
 * 代码生成器 API
 */
import type { IGenTable, IGenQuery, IGenConfig, IGenColumn, IGenPreview, IGenResult } from '@yunshu/shared';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}
/**
 * 获取表列表（分页）
 */
export declare const getGenTablePage: (params: IGenQuery) => Promise<ApiResponse<IGenTable[]>>;
/**
 * 获取数据库表列表（未导入）
 */
export declare const getGenDbList: (params?: IGenQuery) => Promise<ApiResponse<IGenTable[]>>;
/**
 * 获取表详细配置
 */
export declare const getGenConfig: (tableName: string) => Promise<ApiResponse<{
    config: IGenConfig;
    columns: IGenColumn[];
}>>;
/**
 * 保存表配置
 */
export declare const saveGenConfig: (data: IGenConfig & {
    columns: IGenColumn[];
}) => Promise<ApiResponse>;
/**
 * 导入表
 */
export declare const importGenTable: (tableNames: string[]) => Promise<ApiResponse>;
/**
 * 同步表结构
 */
export declare const syncTable: (tableName: string) => Promise<ApiResponse<IGenColumn[]>>;
/**
 * 预览代码
 */
export declare const previewCode: (config: IGenConfig) => Promise<ApiResponse<IGenPreview>>;
/**
 * 下载代码
 */
export declare const downloadCode: (tableName: string, config?: IGenConfig) => Promise<Blob>;
/**
 * 删除表配置
 */
export declare const deleteGenTable: (tableNames: string[]) => Promise<ApiResponse>;
/**
 * 批量生成代码
 */
export declare const batchGenerate: (tableNames: string[]) => Promise<ApiResponse<IGenResult[]>>;
/**
 * 获取模板列表
 */
export declare const getTemplateList: () => Promise<ApiResponse<{
    templateName: string;
    templatePath: string;
    description: string;
}[]>>;
/**
 * 保存自定义模板
 */
export declare const saveTemplate: (templateName: string, content: string) => Promise<ApiResponse>;
/**
 * 重置模板为默认
 */
export declare const resetTemplate: (templateName: string) => Promise<ApiResponse>;
//# sourceMappingURL=gen.api.d.ts.map