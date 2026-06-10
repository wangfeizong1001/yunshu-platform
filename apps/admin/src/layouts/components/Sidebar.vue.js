/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import SidebarItem from './SidebarItem.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const appStore = useAppStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const isCollapsed = computed(() => appStore.sidebarCollapsed);
const permissionRoutes = computed(() => permissionStore.routes);
const activeMenu = computed(() => {
  const { path } = route;
  return path;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'sidebar' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'logo-container' },
});
if (!__VLS_ctx.isCollapsed) {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: '@/assets/logo.svg',
    alt: 'logo',
    ...{ class: 'logo' },
  });
} else {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: '@/assets/logo-mini.svg',
    alt: 'logo',
    ...{ class: 'logo-mini' },
  });
}
if (!__VLS_ctx.isCollapsed) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'title' },
  });
}
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    defaultActive: __VLS_ctx.activeMenu,
    collapse: __VLS_ctx.isCollapsed,
    collapseTransition: false,
    uniqueOpened: true,
    backgroundColor: '#304156',
    textColor: '#bfcbd9',
    activeTextColor: '#409eff',
    router: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    defaultActive: __VLS_ctx.activeMenu,
    collapse: __VLS_ctx.isCollapsed,
    collapseTransition: false,
    uniqueOpened: true,
    backgroundColor: '#304156',
    textColor: '#bfcbd9',
    activeTextColor: '#409eff',
    router: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
for (const [route] of __VLS_getVForSourceType(__VLS_ctx.permissionRoutes)) {
  /** @type {[typeof SidebarItem, ]} */ // @ts-ignore
  const __VLS_4 = __VLS_asFunctionalComponent(
    SidebarItem,
    new SidebarItem({
      key: route.path,
      item: route,
      basePath: route.path,
    }),
  );
  const __VLS_5 = __VLS_4(
    {
      key: route.path,
      item: route,
      basePath: route.path,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_4),
  );
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ /** @type {__VLS_StyleScopedClasses['logo-container']} */ /** @type {__VLS_StyleScopedClasses['logo']} */ /** @type {__VLS_StyleScopedClasses['logo-mini']} */ /** @type {__VLS_StyleScopedClasses['title']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      SidebarItem: SidebarItem,
      isCollapsed: isCollapsed,
      permissionRoutes: permissionRoutes,
      activeMenu: activeMenu,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Sidebar.vue.js.map
