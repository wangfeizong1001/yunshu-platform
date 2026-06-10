/**
 * 数据字典组合式函数
 *
 * 提供字典数据的获取、缓存和管理功能
 */
import type { SysDictData } from '@yunshu/shared';
/**
 * 数据字典组合式函数
 */
export declare function useDict(): {
    /** 字典缓存 */
    dictCache: import("vue").ComputedRef<Map<string, any> & Omit<Map<string, SysDictData[]>, keyof Map<any, any>>>;
    /** 获取字典数据 */
    getDictData: (dictType: string, forceRefresh?: boolean) => Promise<SysDictData[]>;
    /** 清除字典缓存 */
    clearDictCache: (dictType?: string) => void;
    /** 批量获取字典 */
    getDictDatas: (dictTypes: string[], forceRefresh?: boolean) => Promise<Map<string, SysDictData[]>>;
    /** 获取字典标签 */
    getDictLabel: (dictType: string, dictValue: string) => Promise<string>;
    /** 获取字典选项 */
    getDictOptions: (dictType: string, forceRefresh?: boolean) => Promise<SysDictData[]>;
    /** 缓存是否包含指定字典 */
    hasDict: (dictType: string) => boolean;
    /** 获取缓存的字典数据 */
    getCachedDict: (dictType: string) => SysDictData[] | undefined;
};
/**
 * 静态字典选项（不经过API）
 */
export declare const STATIC_DICT_OPTIONS: {
    status: {
        label: string;
        value: string;
    }[];
    yesNo: {
        label: string;
        value: string;
    }[];
    noticeType: {
        label: string;
        value: string;
    }[];
    userSex: {
        label: string;
        value: string;
    }[];
    jobStatus: {
        label: string;
        value: string;
    }[];
    jobGroup: {
        label: string;
        value: string;
    }[];
    listClass: {
        label: string;
        value: string;
    }[];
    storageType: {
        label: string;
        value: string;
    }[];
};
//# sourceMappingURL=useDict.d.ts.map