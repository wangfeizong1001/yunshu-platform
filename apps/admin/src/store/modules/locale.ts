/**
 * 语言状态管理
 *
 * 使用 @vueuse/core 的 useLocalStorage 保证 currentLocale 是响应式 ref，
 * 与 app.ts 中 sidebarCollapsed / language 保持一致风格。
 * 切换语言后界面会自动响应（vue-i18n 的 locale 也会同步更新）。
 */
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// 暴露给模板用的可用语言列表（普通常量，组件渲染时不需要响应式）
const SUPPORTED_LOCALES = [
  { name: '简体中文', value: 'zh-CN' },
  { name: 'English', value: 'en' }
] as const

export const useLocaleStore = defineStore('locale', () => {
  // 响应式持久化 ref — 修改后界面自动响应
  const currentLocale = useLocalStorage<string>('locale', 'zh-CN')

  const setLocale = (locale: string): void => {
    currentLocale.value = locale
  }

  const getLocale = (): string => {
    return currentLocale.value
  }

  const initLocale = (): void => {
    // 从浏览器语言设置初始化
    const browserLang = navigator.language
    if (browserLang.startsWith('zh')) {
      currentLocale.value = 'zh-CN'
    } else {
      currentLocale.value = 'en'
    }
  }

  return {
    currentLocale,
    locales: SUPPORTED_LOCALES,
    setLocale,
    getLocale,
    initLocale
  }
})
