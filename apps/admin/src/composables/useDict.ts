import { ref, computed } from 'vue'
import { getDictDataByType } from '@/api/system/dict.api'

interface DictData {
  dictCode: number
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort: number
  isDefault: string
  status: string
  remark: string
  createTime: string
}

const dictCache = ref<Map<string, DictData[]>>(new Map())
const loadingDict = ref<Set<string>>(new Set())

export function useDict() {
  async function getDictData(dictType: string, forceRefresh = false): Promise<DictData[]> {
    if (!forceRefresh && dictCache.value.has(dictType)) {
      return dictCache.value.get(dictType) || []
    }

    if (loadingDict.value.has(dictType)) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!loadingDict.value.has(dictType)) {
            clearInterval(checkInterval)
            resolve(dictCache.value.get(dictType) || [])
          }
        }, 50)
      })
    }

    loadingDict.value.add(dictType)

    try {
      const res = await getDictDataByType(dictType)
      const dictData = (res?.data || []) as DictData[]
      dictCache.value.set(dictType, dictData)
      return dictData
    } catch (error) {
      console.error(`获取字典[${dictType}]失败:`, error)
      return []
    } finally {
      loadingDict.value.delete(dictType)
    }
  }

  function clearDictCache(dictType?: string) {
    if (dictType) {
      dictCache.value.delete(dictType)
    } else {
      dictCache.value.clear()
    }
  }

  async function getDictDatas(
    dictTypes: string[],
    forceRefresh = false
  ): Promise<Map<string, DictData[]>> {
    const result = new Map<string, DictData[]>()

    await Promise.all(
      dictTypes.map(async (type) => {
        const data = await getDictData(type, forceRefresh)
        result.set(type, data)
      })
    )

    return result
  }

  async function getDictLabel(dictType: string, dictValue: string): Promise<string> {
    const data = await getDictData(dictType)
    const item = data.find((d) => d.dictValue === dictValue)
    return item?.dictLabel || dictValue
  }

  async function getDictOptions(dictType: string, forceRefresh = false) {
    return getDictData(dictType, forceRefresh)
  }

  function hasDict(dictType: string): boolean {
    return dictCache.value.has(dictType)
  }

  function getCachedDict(dictType: string): DictData[] | undefined {
    return dictCache.value.get(dictType)
  }

  return {
    dictCache: computed(() => dictCache.value),
    getDictData,
    clearDictCache,
    getDictDatas,
    getDictLabel,
    getDictOptions,
    hasDict,
    getCachedDict,
  }
}

export const STATIC_DICT_OPTIONS = {
  status: [
    { label: '正常', value: '0' },
    { label: '停用', value: '1' },
  ],
  yesNo: [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ],
  noticeType: [
    { label: '通知', value: '1' },
    { label: '公告', value: '2' },
  ],
  userSex: [
    { label: '男', value: '0' },
    { label: '女', value: '1' },
    { label: '未知', value: '2' },
  ],
  jobStatus: [
    { label: '正常', value: '0' },
    { label: '暂停', value: '1' },
  ],
  jobGroup: [
    { label: '默认', value: 'default' },
    { label: '系统', value: 'system' },
  ],
  listClass: [
    { label: '默认', value: 'default' },
    { label: '主要', value: 'primary' },
    { label: '成功', value: 'success' },
    { label: '警告', value: 'warning' },
    { label: '危险', value: 'danger' },
    { label: '信息', value: 'info' },
  ],
  storageType: [
    { label: '本地存储', value: 'local' },
    { label: 'OSS', value: 'oss' },
    { label: 'COS', value: 'cos' },
  ],
}
