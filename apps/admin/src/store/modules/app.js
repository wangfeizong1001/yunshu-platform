import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
export const useAppStore = defineStore('app', () => {
    const sidebarCollapsed = useLocalStorage('sidebar-collapsed', false);
    const language = useLocalStorage('language', 'zh-CN');
    const size = useLocalStorage('size', 'default');
    const theme = useLocalStorage('app-theme', 'light');
    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    };
    const setLanguage = (lang) => {
        language.value = lang;
    };
    const setSize = (newSize) => {
        size.value = newSize;
    };
    const setTheme = (newTheme) => {
        theme.value = newTheme;
    };
    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    };
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
    };
});
//# sourceMappingURL=app.js.map