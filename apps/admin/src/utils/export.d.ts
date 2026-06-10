/**
 * 导出工具类
 * 支持 Excel、Word、PDF 导出
 */
/**
 * 导出 Excel
 * @param data 数据数组
 * @param fileName 文件名（不含扩展名）
 * @param sheetName 工作表名称
 */
export declare function exportToExcel(data: any[], fileName?: string, sheetName?: string): boolean;
/**
 * 导出 Excel（带表头）
 * @param data 数据数组
 * @param headers 表头配置 { key: 列名 }
 * @param fileName 文件名（不含扩展名）
 * @param sheetName 工作表名称
 */
export declare function exportToExcelWithHeaders(data: any[], headers: Record<string, string>, fileName?: string, sheetName?: string): boolean;
/**
 * 导出 Word（简单文本格式）
 * @param content 文本内容
 * @param fileName 文件名（不含扩展名）
 */
export declare function exportToWord(content: string, fileName?: string): boolean;
/**
 * 导出 PDF（从 HTML 元素）
 * @param element HTML 元素
 * @param fileName 文件名（不含扩展名）
 * @param options 配置选项
 */
export declare function exportToPDF(element: HTMLElement, fileName?: string, options?: {
    scale?: number;
    margin?: number;
    orientation?: 'portrait' | 'landscape';
}): Promise<boolean>;
/**
 * 导出 PDF（从文本内容）
 * @param content 文本内容
 * @param fileName 文件名（不含扩展名）
 */
export declare function exportToPDFFromText(content: string, fileName?: string): boolean;
/**
 * 导出报表数据
 * @param data 报表数据
 * @param type 导出类型 'excel' | 'word' | 'pdf'
 * @param fileName 文件名
 */
export declare function exportReport(data: any, type: 'excel' | 'word' | 'pdf', fileName?: string): boolean;
//# sourceMappingURL=export.d.ts.map