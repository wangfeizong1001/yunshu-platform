import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import en from './en'

// 语言设置
export const localeSetting = {
  enableLangCache: true,
  defaultLocale: 'zh-CN',
  locales: [
    { label: '简体中文', key: 'zh-CN', elLocale: 'zh-cn' },
    { label: 'English', key: 'en', elLocale: 'en' },
  ],
}

// 获取当前语言
const getLanguage = () => {
  const stored = localStorage.getItem('locale')
  if (stored && localeSetting.locales.some(l => l.key === stored)) {
    return stored
  }
  // 检测浏览器语言
  const browserLang = navigator.language
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  return localeSetting.defaultLocale
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getLanguage(),
  fallbackLocale: localeSetting.defaultLocale,
  messages: {
    'zh-CN': zhCN,
    'en': en,
  },
  availableLocales: localeSetting.locales.map(l => l.key),
  sync: true, // 同步根组件语言
  silentTranslationWarn: true, // 关闭翻译警告
  missingWarn: false, // 关闭缺失警告
})

export default i18n

export { localeSetting }
