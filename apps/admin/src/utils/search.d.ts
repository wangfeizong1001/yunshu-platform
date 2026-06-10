/**
 * 本地全文搜索工具
 *
 * 提供基于倒排索引的全文搜索功能
 */
/** 搜索文档接口 */
export interface SearchDocument {
  id: string | number;
  [key: string]: unknown;
}
/** 搜索结果 */
export interface SearchResult<T extends SearchDocument = SearchDocument> {
  /** 原始文档 */
  document: T;
  /** 匹配分数 */
  score: number;
  /** 匹配字段 */
  matchedFields: string[];
  /** 匹配高亮 */
  highlights: Map<string, string>;
}
/** 搜索索引配置 */
export interface SearchIndexConfig {
  /** 需要索引的字段 */
  fields: string[];
  /** 字段权重 */
  fieldWeights?: Record<string, number>;
  /** 是否启用中文分词 */
  enableChinese?: boolean;
  /** 是否区分大小写 */
  caseSensitive?: boolean;
}
/**
 * 本地搜索索引类
 */
declare class LocalSearchIndex<T extends SearchDocument = SearchDocument> {
  private invertedIndex;
  private documentStore;
  private config;
  constructor(config: SearchIndexConfig);
  /**
   * 分词函数
   */
  private tokenize;
  /**
   * 添加文档到索引
   */
  addDocument(document: T): void;
  /**
   * 批量添加文档
   */
  addDocuments(documents: T[]): void;
  /**
   * 更新文档
   */
  updateDocument(document: T): void;
  /**
   * 移除文档
   */
  removeDocument(docId: string | number): void;
  /**
   * 搜索文档
   */
  search(query: string, limit?: number): SearchResult<T>[];
  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex;
  /**
   * 获取文档数量
   */
  getDocumentCount(): number;
  /**
   * 获取索引词数量
   */
  getTokenCount(): number;
  /**
   * 清空索引
   */
  clear(): void;
  /**
   * 获取所有文档
   */
  getAllDocuments(): T[];
  /**
   * 根据ID获取文档
   */
  getDocument(docId: string | number): T | undefined;
}
/**
 * 创建搜索索引
 */
export declare function createSearchIndex<T extends SearchDocument = SearchDocument>(
  config: SearchIndexConfig,
): LocalSearchIndex<T>;
/** 导出类 */
export { LocalSearchIndex };
//# sourceMappingURL=search.d.ts.map
