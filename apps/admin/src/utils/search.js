/**
 * 本地全文搜索工具
 *
 * 提供基于倒排索引的全文搜索功能
 */
/**
 * 本地搜索索引类
 */
class LocalSearchIndex {
    invertedIndex = new Map();
    documentStore = new Map();
    config;
    constructor(config) {
        this.config = {
            fields: config.fields,
            fieldWeights: config.fieldWeights || {},
            enableChinese: config.enableChinese ?? true,
            caseSensitive: config.caseSensitive ?? false
        };
    }
    /**
     * 分词函数
     */
    tokenize(text) {
        if (!text)
            return [];
        let processedText = text;
        if (!this.config.caseSensitive) {
            processedText = processedText.toLowerCase();
        }
        const tokens = [];
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
    addDocument(document) {
        this.documentStore.set(document.id, document);
        // 为每个字段建立索引
        this.config.fields.forEach((field) => {
            const value = document[field];
            if (value === null || value === undefined)
                return;
            const text = String(value);
            const tokens = this.tokenize(text);
            tokens.forEach((token, pos) => {
                if (!this.invertedIndex.has(token)) {
                    this.invertedIndex.set(token, []);
                }
                const entries = this.invertedIndex.get(token);
                const existingEntry = entries.find(e => e.docId === document.id && e.field === field);
                if (existingEntry) {
                    existingEntry.positions.push(pos);
                }
                else {
                    entries.push({
                        docId: document.id,
                        field,
                        positions: [pos]
                    });
                }
            });
        });
    }
    /**
     * 批量添加文档
     */
    addDocuments(documents) {
        documents.forEach((doc) => this.addDocument(doc));
    }
    /**
     * 更新文档
     */
    updateDocument(document) {
        this.removeDocument(document.id);
        this.addDocument(document);
    }
    /**
     * 移除文档
     */
    removeDocument(docId) {
        this.documentStore.delete(docId);
        // 从倒排索引中移除
        this.invertedIndex.forEach((entries, token) => {
            const filteredEntries = entries.filter(e => e.docId !== docId);
            if (filteredEntries.length === 0) {
                this.invertedIndex.delete(token);
            }
            else {
                this.invertedIndex.set(token, filteredEntries);
            }
        });
    }
    /**
     * 搜索文档
     */
    search(query, limit = 20) {
        if (!query.trim())
            return [];
        const queryTokens = this.tokenize(query);
        if (queryTokens.length === 0)
            return [];
        // 计算文档分数
        const docScores = new Map();
        queryTokens.forEach((token) => {
            const entries = this.invertedIndex.get(token);
            if (!entries)
                return;
            entries.forEach((entry) => {
                if (!docScores.has(entry.docId)) {
                    docScores.set(entry.docId, {
                        score: 0,
                        matchedFields: new Set(),
                        matchedTokens: new Map()
                    });
                }
                const docScore = docScores.get(entry.docId);
                const fieldWeight = this.config.fieldWeights[entry.field] || 1;
                docScore.score += fieldWeight * (1 + Math.log(1 + entry.positions.length));
                docScore.matchedFields.add(entry.field);
                if (!docScore.matchedTokens.has(entry.field)) {
                    docScore.matchedTokens.set(entry.field, new Set());
                }
                docScore.matchedTokens.get(entry.field).add(token);
            });
        });
        // 构建搜索结果
        const results = [];
        docScores.forEach((data, docId) => {
            const document = this.documentStore.get(docId);
            if (!document)
                return;
            const highlights = new Map();
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
                highlights
            });
        });
        // 按分数排序并限制数量
        return results.sort((a, b) => b.score - a.score).slice(0, limit);
    }
    /**
     * 转义正则表达式特殊字符
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * 获取文档数量
     */
    getDocumentCount() {
        return this.documentStore.size;
    }
    /**
     * 获取索引词数量
     */
    getTokenCount() {
        return this.invertedIndex.size;
    }
    /**
     * 清空索引
     */
    clear() {
        this.invertedIndex.clear();
        this.documentStore.clear();
    }
    /**
     * 获取所有文档
     */
    getAllDocuments() {
        return Array.from(this.documentStore.values());
    }
    /**
     * 根据ID获取文档
     */
    getDocument(docId) {
        return this.documentStore.get(docId);
    }
}
/**
 * 创建搜索索引
 */
export function createSearchIndex(config) {
    return new LocalSearchIndex(config);
}
/** 导出类 */
export { LocalSearchIndex };
//# sourceMappingURL=search.js.map