/**
 * 字典管理 API
 */
export interface DictTypeQuery {
    pageNum?: number;
    pageSize?: number;
    dictName?: string;
    dictType?: string;
    status?: string;
}
export interface DictTypeForm {
    dictId?: number;
    dictName?: string;
    dictType?: string;
    status?: string;
    remark?: string;
}
export interface DictTypeInfo {
    dictId: number;
    dictName: string;
    dictType: string;
    status: string;
    remark: string;
    createTime: string;
}
export interface DictDataQuery {
    pageNum?: number;
    pageSize?: number;
    dictType?: string;
    dictLabel?: string;
    status?: string;
}
export interface DictDataForm {
    dictCode?: number;
    dictType?: string;
    dictLabel?: string;
    dictValue?: string;
    dictSort?: number;
    isDefault?: string;
    status?: string;
    remark?: string;
}
export interface DictDataInfo {
    dictCode: number;
    dictType: string;
    dictLabel: string;
    dictValue: string;
    dictSort: number;
    isDefault: string;
    status: string;
    remark: string;
    createTime: string;
}
export declare const getDictTypeList: (params?: DictTypeQuery) => Promise<unknown>;
export declare const getDictTypePage: (params?: DictTypeQuery) => Promise<unknown>;
export declare const getDictType: (dictId: number) => Promise<unknown>;
export declare const getDictTypeAll: () => Promise<unknown>;
export declare const getDictTypeOptions: (dictType: string) => Promise<unknown>;
export declare const addDictType: (data: DictTypeForm) => Promise<unknown>;
export declare const updateDictType: (data: DictTypeForm) => Promise<unknown>;
export declare const deleteDictType: (dictId: number) => Promise<unknown>;
export declare const batchDeleteDictType: (dictIds: number[]) => Promise<unknown>;
export declare const refreshDictCache: () => Promise<unknown>;
export declare const getDictDataList: (params?: DictDataQuery) => Promise<unknown>;
export declare const getDictDataPage: (params?: DictDataQuery) => Promise<unknown>;
export declare const getDictData: (dictCode: number) => Promise<unknown>;
export declare const addDictData: (data: DictDataForm) => Promise<unknown>;
export declare const updateDictData: (data: DictDataForm) => Promise<unknown>;
export declare const deleteDictData: (dictCode: number) => Promise<unknown>;
export declare const getDictDataByType: (dictType: string) => Promise<unknown>;
export declare const exportDictType: (params?: DictTypeQuery) => Promise<unknown>;
export declare const exportDictData: (dictType: string) => Promise<unknown>;
//# sourceMappingURL=dict.api.d.ts.map