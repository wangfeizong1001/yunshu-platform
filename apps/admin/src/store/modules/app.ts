import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface AppState {
  sidebarCollapsed: boolean
  language: string
  size: string
  theme: 'light' | 'dark'
}

export type { AppState }

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = useLocalStorage('sidebar-collapsed', false)
  const language = useLocalStorage('language', 'zh-CN')
  const size = useLocalStorage('size', 'default')
  const theme = useLocalStorage<'light' | 'dark'>('app-theme', 'light')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setLanguage = (lang: string) => {
    language.value = lang
  }

  const setSize = (newSize: string) => {
    size.value = newSize
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    sidebarCollapsed,
    language,
    size,
    theme,
    toggleSidebar,
    setLanguage,
    setSize,
    setTheme,
    toggleTheme
  }
})
