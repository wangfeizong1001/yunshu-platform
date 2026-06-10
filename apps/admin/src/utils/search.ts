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

/** 索引条目 */
interface IndexEntry {
  docId: string | number;
  field: string;
  positions: number[];
}

/** 倒排索引 */
type InvertedIndex = Map<string, IndexEntry[]>;

/** 文档存储 */
type DocumentStore<T extends SearchDocument> = Map<string | number, T>;

/**
 * 本地搜索索引类
 */
class LocalSearchIndex<T extends SearchDocument = SearchDocument> {
  private invertedIndex: InvertedIndex = new Map();
  private documentStore: DocumentStore<T> = new Map();
  private config: Required<SearchIndexConfig>;

  constructor(config: SearchIndexConfig) {
    this.config = {
      fields: config.fields,
      fieldWeights: config.fieldWeights || {},
      enableChinese: config.enableChinese ?? true,
      caseSensitive: config.caseSensitive ?? false,
    };
  }

  /**
   * 分词函数
   */
  private tokenize(text: string): string[] {
    if (!text) {return [];}

    let processedText = text;
    if (!this.config.caseSensitive) {
      processedText = processedText.toLowerCase();
    }

    const tokens: string[] = [];

    // 英文分词
    const englishWords = processedText.match(/[a-zA-Z]+/g) || [];
    tokens.push(...englishWords);

    // 数字
    const numbers = processedText.match(/\d+/g) || [];
    tokens.push(...numbers);

    // 中文分词（简单的n-gram）
    if (this.config.enableChinese) {
      const chineseChars = processedText.match(/[\u4e00-\u9fa5]+/g) || [];
      chineseChars.forEach((word) => {
        // 2-gram 分词
        for (let i = 0; i < word.length; i++) {
          tokens.push(word[i]);
          if (i + 1 < word.length) {
            tokens.push(word.substring(i, i + 2));
          }
        }
      });
    }

    return [...new Set(tokens)];
  }

  /**
   * 添加文档到索引
   */
  addDocument(document: T): void {
    this.documentStore.set(document.id, document);

    // 为每个字段建立索引
    this.config.fields.forEach((field) => {
      const value = document[field];
      if (value === null || value === undefined) {return;}

      const text = String(value);
      const tokens = this.tokenize(text);

      tokens.forEach((token, pos) => {
        if (!this.invertedIndex.has(token)) {
          this.invertedIndex.set(token, []);
        }

        const entries = this.invertedIndex.get(token)!;
        const existingEntry = entries.find((e) => e.docId === document.id && e.field === field);

        if (existingEntry) {
          existingEntry.positions.push(pos);
        } else {
          entries.push({
            docId: document.id,
            field,
            positions: [pos],
          });
        }
      });
    });
  }

  /**
   * 批量添加文档
   */
  addDocuments(documents: T[]): void {
    documents.forEach((doc) => this.addDocument(doc));
  }

  /**
   * 更新文档
   */
  updateDocument(document: T): void {
    this.removeDocument(document.id);
    this.addDocument(document);
  }

  /**
   * 移除文档
   */
  removeDocument(docId: string | number): void {
    this.documentStore.delete(docId);

    // 从倒排索引中移除
    this.invertedIndex.forEach((entries, token) => {
      const filteredEntries = entries.filter((e) => e.docId !== docId);
      if (filteredEntries.length === 0) {
        this.invertedIndex.delete(token);
      } else {
        this.invertedIndex.set(token, filteredEntries);
      }
    });
  }

  /**
   * 搜索文档
   */
  search(query: string, limit = 20): SearchResult<T>[] {
    if (!query.trim()) {return [];}

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {return [];}

    // 计算文档分数
    const docScores = new Map<
      string | number,
      {
        score: number;
        matchedFields: Set<string>;
        matchedTokens: Map<string, Set<string>>;
      }
    >();

    queryTokens.forEach((token) => {
      const entries = this.invertedIndex.get(token);
      if (!entries) {return;}

      entries.forEach((entry) => {
        if (!docScores.has(entry.docId)) {
          docScores.set(entry.docId, {
            score: 0,
            matchedFields: new Set(),
            matchedTokens: new Map(),
          });
        }

        const docScore = docScores.get(entry.docId)!;
        const fieldWeight = this.config.fieldWeights[entry.field] || 1;

        docScore.score += fieldWeight * (1 + Math.log(1 + entry.positions.length));
        docScore.matchedFields.add(entry.field);

        if (!docScore.matchedTokens.has(entry.field)) {
          docScore.matchedTokens.set(entry.field, new Set());
        }
        docScore.matchedTokens.get(entry.field)!.add(token);
      });
    });

    // 构建搜索结果
    const results: SearchResult<T>[] = [];

    docScores.forEach((data, docId) => {
      const document = this.documentStore.get(docId);
      if (!document) {return;}

      const highlights = new Map<string, string>();
      data.matchedTokens.forEach((tokens, field) => {
        const value = String(document[field] || '');
        let highlighted = value;
        tokens.forEach((token) => {
          const regex = new RegExp(`(${this.escapeRegex(token)})`, 'gi');
          highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        highlights.set(field, highlighted);
      });

      results.push({
        document,
        score: data.score,
        matchedFields: Array.from(data.matchedFields),
        highlights,
      });
    });

    // 按分数排序并限制数量
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 获取文档数量
   */
  getDocumentCount(): number {
    return this.documentStore.size;
  }

  /**
   * 获取索引词数量
   */
  getTokenCount(): number {
    return this.invertedIndex.size;
  }

  /**
   * 清空索引
   */
  clear(): void {
    this.invertedIndex.clear();
    this.documentStore.clear();
  }

  /**
   * 获取所有文档
   */
  getAllDocuments(): T[] {
    return Array.from(this.documentStore.values());
  }

  /**
   * 根据ID获取文档
   */
  getDocument(docId: string | number): T | undefined {
    return this.documentStore.get(docId);
  }
}

/**
 * 创建搜索索引
 */
export function createSearchIndex<T extends SearchDocument = SearchDocument>(
  config: SearchIndexConfig,
): LocalSearchIndex<T> {
  return new LocalSearchIndex<T>(config);
}

/** 导出类 */
export { LocalSearchIndex };
