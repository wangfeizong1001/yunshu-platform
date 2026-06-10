/**
 * 树形数据处理工具
 */
export interface TreeNode {
    id: any;
    children?: TreeNode[];
    [key: string]: any;
}
export declare const arrayToTree: (array: any[], idKey?: string, parentKey?: string, childrenKey?: string) => any[];
export declare const treeToArray: (tree: any[], childrenKey?: string) => any[];
export declare const findNodeById: <T extends Record<string, any>>(tree: T[], id: any, idKey?: string, childrenKey?: string) => T | null;
export declare const findParentIds: (tree: any[], id: any, idKey?: string, _parentKey?: string, childrenKey?: string) => any[];
//# sourceMappingURL=tree.d.ts.map