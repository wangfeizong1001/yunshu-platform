/**
 * 知识库 API
 */
export interface KnowledgeQuery {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  status?: string;
  visible?: string;
}
export interface KnowledgeForm {
  knowledgeId?: number;
  title?: string;
  categoryId?: number;
  categoryName?: string;
  content?: string;
  summary?: string;
  coverUrl?: string;
  tags?: string;
  status?: string;
  visible?: string;
  sort?: number;
  remark?: string;
}
export interface KnowledgeInfo {
  knowledgeId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  content: string;
  summary: string;
  coverUrl: string;
  tags: string;
  status: string;
  visible: string;
  sort: number;
  viewCount: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
}
export interface KnowledgeCategory {
  categoryId: number;
  categoryName: string;
  parentId: number;
  sort: number;
  status: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
}
export declare const getKnowledgePage: (params?: KnowledgeQuery) => Promise<unknown>;
export declare const getKnowledgeList: (params?: KnowledgeQuery) => Promise<unknown>;
export declare const getKnowledge: (knowledgeId: number) => Promise<unknown>;
export declare const addKnowledge: (data: KnowledgeForm) => Promise<unknown>;
export declare const updateKnowledge: (data: KnowledgeForm) => Promise<unknown>;
export declare const deleteKnowledge: (knowledgeId: number) => Promise<unknown>;
export declare const batchDeleteKnowledge: (knowledgeIds: number[]) => Promise<unknown>;
export declare const publishKnowledge: (knowledgeId: number) => Promise<unknown>;
export declare const withdrawKnowledge: (knowledgeId: number) => Promise<unknown>;
export declare const getCategoryList: () => Promise<unknown>;
export declare const getCategoryTree: () => Promise<unknown>;
export declare const addCategory: (data: Partial<KnowledgeCategory>) => Promise<unknown>;
export declare const updateCategory: (data: Partial<KnowledgeCategory>) => Promise<unknown>;
export declare const deleteCategory: (categoryId: number) => Promise<unknown>;
//# sourceMappingURL=knowledge.api.d.ts.map
