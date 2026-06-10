/**
 * sanitize 单元测试
 *
 * 由于 happy-dom 与 DOMPurify 的 DOM 子节点处理不完全兼容，
 * 此处采用 mock DOMPurify.sanitize，重点测试我们自己封装的逻辑：
 *  1. 空值 / undefined / null 处理
 *  2. 自定义配置的正确传递
 *  3. target=_blank 自动注入 rel="noopener noreferrer"
 *  4. 异常回退为空字符串
 *  5. stripHtml / truncateHtml 的字符串级语义
 */
export {};
//# sourceMappingURL=sanitize.test.d.ts.map