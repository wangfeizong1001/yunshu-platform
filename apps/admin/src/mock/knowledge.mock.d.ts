/**
 * 知识库 Mock 数据
 */
import type { KnowledgeInfo, KnowledgeCategory } from '@/api/system/knowledge.api';
export declare const mockCategoryList: KnowledgeCategory[];
export declare const mockKnowledgeList: KnowledgeInfo[];
export declare function getMockKnowledgePage(params: any): {
  total: number;
  rows: KnowledgeInfo[];
};
export declare function getMockKnowledgeList(_params: any): KnowledgeInfo[];
export declare function getMockKnowledgeDetail(knowledgeId: number): KnowledgeInfo | undefined;
export declare function addMockKnowledge(data: Partial<KnowledgeInfo>): KnowledgeInfo;
export declare function updateMockKnowledge(
  knowledgeId: number,
  data: Partial<KnowledgeInfo>,
): KnowledgeInfo | undefined;
export declare function deleteMockKnowledge(knowledgeId: number): boolean;
export declare function publishMockKnowledge(knowledgeId: number): boolean;
export declare function withdrawMockKnowledge(knowledgeId: number): boolean;
export declare function getMockCategoryList(): KnowledgeCategory[];
export declare function getMockCategoryTree(): KnowledgeCategory[];
export declare function addMockCategory(data: Partial<KnowledgeCategory>): KnowledgeCategory;
export declare function updateMockCategory(
  categoryId: number,
  data: Partial<KnowledgeCategory>,
): KnowledgeCategory | undefined;
export declare function deleteMockCategory(categoryId: number): boolean;
//# sourceMappingURL=knowledge.mock.d.ts.map
