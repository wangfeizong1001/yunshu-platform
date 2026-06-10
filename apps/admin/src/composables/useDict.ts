/**
 * 数据字典组合式函数
 *
 * 提供字典数据的获取、缓存和管理功能
 */

import { ref, computed } from 'vue';
import type { SysDictData } from '@yunshu/shared';
import { getDictDataByType } from '@/api/system/dict.api';

// 全局字典缓存
const dictCache = ref<Map<string, SysDictData[]>>(new Map());

// 加载状态
const loadingDict = ref<Set<string>>(new Set());

/**
 * 数据字典组合式函数
 */
export function useDict() {
  /**
   * 获取字典数据
   * @param dictType 字典类型
   * @param forceRefresh 是否强制刷新
   */
  async function getDictData(dictType: string, forceRefresh = false): Promise<SysDictData[]> {
    // 先从缓存获取
    if (!forceRefresh && dictCache.value.has(dictType)) {
      return dictCache.value.get(dictType)!;
    }

    // 检查是否正在加载
    if (loadingDict.value.has(dictType)) {
      // 等待加载完成
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!loadingDict.value.has(dictType)) {
            clearInterval(checkInterval);
            resolve(dictCache.value.get(dictType) || []);
          }
        }, 50);
      });
    }

    // 设置加载状态
    loadingDict.value.add(dictType);

    try {
      // 从API获取
      const data = await getDictDataByType(dictType);
      const dictData = (data || []) as unknown as SysDictData[];
      dictCache.value.set(dictType, dictData);
      return dictData;
    } catch (error) {
      console.error(`获取字典[${dictType}]失败:`, error);
      return [];
    } finally {
      loadingDict.value.delete(dictType);
    }
  }

  /**
   * 清除字典缓存
   * @param dictType 字典类型，不传则清除所有
   */
  function clearDictCache(dictType?: string) {
    if (dictType) {
      dictCache.value.delete(dictType);
    } else {
      dictCache.value.clear();
    }
  }

  /**
   * 批量获取字典
   * @param dictTypes 字典类型数组
   * @param forceRefresh 是否强制刷新
   */
  async function getDictDatas(
    dictTypes: string[],
    forceRefresh = false,
  ): Promise<Map<string, SysDictData[]>> {
    const result = new Map<string, SysDictData[]>();

    await Promise.all(
      dictTypes.map(async (type) => {
        const data = await getDictData(type, forceRefresh);
        result.set(type, data);
      }),
    );

    return result;
  }

  /**
   * 获取字典标签
   * @param dictType 字典类型
   * @param dictValue 字典值
   */
  async function getDictLabel(dictType: string, dictValue: string): Promise<string> {
    const data = await getDictData(dictType);
    const item = data.find((d) => d.dictValue === dictValue);
    return item?.dictLabel || dictValue;
  }

  /**
   * 获取字典选项（用于select）
   * @param dictType 字典类型
   * @param forceRefresh 是否强制刷新
   */
  async function getDictOptions(dictType: string, forceRefresh = false) {
    return getDictData(dictType, forceRefresh);
  }

  /**
   * 缓存是否包含指定字典
   */
  function hasDict(dictType: string): boolean {
    return dictCache.value.has(dictType);
  }

  /**
   * 获取缓存的字典数据
   */
  function getCachedDict(dictType: string): SysDictData[] | undefined {
    return dictCache.value.get(dictType);
  }

  return {
    /** 字典缓存 */
    dictCache: computed(() => dictCache.value),
    /** 获取字典数据 */
    getDictData,
    /** 清除字典缓存 */
    clearDictCache,
    /** 批量获取字典 */
    getDictDatas,
    /** 获取字典标签 */
    getDictLabel,
    /** 获取字典选项 */
    getDictOptions,
    /** 缓存是否包含指定字典 */
    hasDict,
    /** 获取缓存的字典数据 */
    getCachedDict,
  };
}

/**
 * 静态字典选项（不经过API）
 */
export const STATIC_DICT_OPTIONS = {
  // 状态
  status: [
    { label: '正常', value: '0' },
    { label: '停用', value: '1' },
  ],
  // 是/否
  yesNo: [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ],
  // 公告类型
  noticeType: [
    { label: '通知', value: '1' },
    { label: '公告', value: '2' },
  ],
  // 用户性别
  userSex: [
    { label: '男', value: '0' },
    { label: '女', value: '1' },
    { label: '未知', value: '2' },
  ],
  // 任务状态
  jobStatus: [
    { label: '正常', value: '0' },
    { label: '暂停', value: '1' },
  ],
  // 任务分组
  jobGroup: [
    { label: '默认', value: 'default' },
    { label: '系统', value: 'system' },
  ],
  // 显示样式
  listClass: [
    { label: '默认', value: 'default' },
    { label: '主要', value: 'primary' },
    { label: '成功', value: 'success' },
    { label: '警告', value: 'warning' },
    { label: '危险', value: 'danger' },
    { label: '信息', value: 'info' },
  ],
  // 存储类型
  storageType: [
    { label: '本地存储', value: 'local' },
    { label: 'OSS', value: 'oss' },
    { label: 'COS', value: 'cos' },
  ],
};
