/**
 * 数据字典 Mock 数据
 */
import type {
  SysDictType,
  SysDictTypePageResp,
  SysDictData,
  SysDictDataPageResp,
} from '@yunshu/shared';
export declare const mockDictTypeList: SysDictType[];
export declare function getMockDictTypePage(params: any): SysDictTypePageResp;
export declare function getMockDictTypeDetail(dictId: number): SysDictType | undefined;
export declare function addMockDictType(data: Partial<SysDictType>): SysDictType;
export declare function updateMockDictType(
  dictId: number,
  data: Partial<SysDictType>,
): SysDictType | undefined;
export declare function deleteMockDictType(dictId: number): boolean;
export declare const mockDictDataList: SysDictData[];
export declare function getMockDictDataPage(params: any): SysDictDataPageResp;
export declare function getMockDictDataByType(dictType: string): SysDictData[];
export declare function getMockDictDataDetail(dictCode: number): SysDictData | undefined;
export declare function addMockDictData(data: Partial<SysDictData>): SysDictData;
export declare function updateMockDictData(
  dictCode: number,
  data: Partial<SysDictData>,
): SysDictData | undefined;
export declare function deleteMockDictData(dictCode: number): boolean;
//# sourceMappingURL=dict.mock.d.ts.map
