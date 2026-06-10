import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = useLocalStorage('sidebar-collapsed', false);
  const language = useLocalStorage('language', 'zh-CN');
  const size = useLocalStorage('size', 'default');
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };
  const setLanguage = (lang) => {
    language.value = lang;
  };
  const setSize = (newSize) => {
    size.value = newSize;
  };
  return {
    sidebarCollapsed,
    language,
    size,
    toggleSidebar,
    setLanguage,
    setSize,
  };
});
//# sourceMappingURL=app.js.map
