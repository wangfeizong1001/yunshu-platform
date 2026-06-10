/**
 * 云枢中台权限管理后台入口
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import App from './App.vue';
import router from './router';
import { registerDirectives } from './directives';
import i18n, { localeSetting } from './locales';
import { initSentry } from './plugins/sentry';
// 创建应用实例
const app = createApp(App);
// 创建 Pinia 实例
const pinia = createPinia();
// 注册 Pinia
app.use(pinia);
// 注册路由
app.use(router);
// 初始化 Sentry（必须在 router 之后、mount 之前，以便 browserTracing 接入路由）
initSentry(app, router);
// 配置 Element Plus 语言
const getElementPlusLocale = () => {
  const stored = localStorage.getItem('locale');
  if (stored === 'en') {
    return en;
  }
  return zhCn;
};
// 注册 Element Plus
app.use(ElementPlus, {
  locale: getElementPlusLocale(),
});
// 注册 i18n
app.use(i18n);
// 配置 dayjs 语言
const getDayjsLocale = () => {
  const stored = localStorage.getItem('locale');
  if (stored === 'en') {
    dayjs.locale('en');
  } else {
    dayjs.locale('zh-cn');
  }
};
getDayjsLocale();
// 注册指令
registerDirectives(app);
// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 挂载应用
app.mount('#app');
// 监听语言变化，更新 Element Plus 语言
router.beforeEach((to, _from, next) => {
  // 从 URL 参数或路由中获取语言设置
  if (to.query.lang) {
    const newLang = to.query.lang;
    if (localeSetting.locales.some((l) => l.key === newLang)) {
      localStorage.setItem('locale', newLang);
      // 刷新应用以应用新语言
      window.location.reload();
    }
  }
  next();
});
//# sourceMappingURL=main.js.map
