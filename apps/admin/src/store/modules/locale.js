import { defineStore } from 'pinia';
export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = useLocalStorage('locale', 'zh-CN');
  const locales = [
    { name: '简体中文', value: 'zh-CN' },
    { name: 'English', value: 'en' },
  ];
  const setLocale = (locale) => {
    currentLocale.value = locale;
  };
  const getLocale = () => {
    return currentLocale.value;
  };
  const initLocale = () => {
    // 从浏览器语言设置初始化
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) {
      currentLocale.value = 'zh-CN';
    } else {
      currentLocale.value = 'en';
    }
  };
  return {
    currentLocale,
    locales,
    setLocale,
    getLocale,
    initLocale,
  };
});
function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  const value = storedValue || defaultValue;
  return {
    get value() {
      return value;
    },
    set value(newValue) {
      localStorage.setItem(key, newValue);
    },
  };
}
//# sourceMappingURL=locale.js.map
