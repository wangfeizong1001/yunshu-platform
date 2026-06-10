/**
 * 判断是否为外部链接
 */
export declare const isExternal: (path: string) => boolean;
/**
 * 判断路径是否绝对路径
 */
export declare const isAbsolutePath: (path: string) => boolean;
/**
 * 规范化路径
 */
export declare const normalizePath: (...paths: string[]) => string;
/**
 * 解析 URL 参数
 */
export declare const parseQuery: (search: string) => Record<string, string>;
/**
 * 序列化参数为 URL 查询字符串
 */
export declare const stringifyQuery: (query: Record<string, any>) => string;
/**
 * 获取路径名
 */
export declare const getPathName: (path: string) => string;
//# sourceMappingURL=path.d.ts.map
