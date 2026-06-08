import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeSetting } from './index'

export function useLocale() {
  const { locale, t, availableLocales } = useI18n()

  // 当前语言
  const currentLocale = computed(() => locale.value)

  // 可用语言列表
  const locales = computed(() => localeSetting.locales)

  // Element Plus 语言映射
  const elLocale = computed(() => {
    const current = locales.value.find(l => l.key === locale.value)
    return current?.elLocale || 'zh-cn'
  })

  // 切换语言
  const changeLocale = async (newLocale: string) => {
    if (!locales.value.some(l => l.key === newLocale)) {
      console.warn(`Locale ${newLocale} is not available`)
      return
    }

    locale.value = newLocale
    localStorage.setItem('locale', newLocale)

    // 更新 HTML lang 属性
    document.documentElement.setAttribute('lang', newLocale)

    // 更新 Element Plus 语言
    // 可以在 main.ts 中通过 watch elLocale 来处理
  }

  // 翻译函数
  const translate = (key: string, params?: Record<string, unknown>) => {
    return params ? t(key, params) : t(key)
  }

  // 判断是否是当前语言
  const isCurrentLocale = (localeKey: string) => {
    return currentLocale.value === localeKey
  }

  return {
    locale: currentLocale,
    locales,
    elLocale,
    changeLocale,
    t: translate,
    isCurrentLocale,
    availableLocales,
  }
}

export default useLocale
