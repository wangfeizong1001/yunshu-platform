import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface AppState {
  sidebarCollapsed: boolean
  language: string
  size: string
}

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = useLocalStorage('sidebar-collapsed', false)
  const language = useLocalStorage('language', 'zh-CN')
  const size = useLocalStorage('size', 'default')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setLanguage = (lang: string) => {
    language.value = lang
  }

  const setSize = (newSize: string) => {
    size.value = newSize
  }

  return {
    sidebarCollapsed,
    language,
    size,
    toggleSidebar,
    setLanguage,
    setSize
  }
})
