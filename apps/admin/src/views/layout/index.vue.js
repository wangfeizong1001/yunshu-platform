/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import SidebarItem from './components/SidebarItem.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Hamburger from './components/Hamburger.vue';
import FullScreen from './components/FullScreen.vue';
import LanguageSwitch from '@/components/LanguageSwitch/index.vue';
import Search from './components/Search.vue';
import TagsView from './components/TagsView.vue';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const isCollapse = ref(false);
// 获取菜单路由
const menuRoutes = computed(() => {
  return permissionStore.routes.filter((item) => {
    return item.meta && !item.meta.hidden;
  });
});
// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route;
  return path;
});
// 缓存的视图
const cachedViews = computed(() => {
  return permissionStore.cachedViews || [];
});
// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};
// 用户菜单命令处理
const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile/index');
      break;
    case 'setting':
      router.push('/user/profile/index');
      break;
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await userStore.logout();
        router.push('/login');
      } catch {
        // 取消操作
      }
      break;
  }
};
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
  ...{ class: 'layout-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.aside,
  __VLS_intrinsicElements.aside,
)({
  ...{ class: 'sidebar' },
  ...{ class: { 'is-collapse': __VLS_ctx.isCollapse } },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'sidebar-header' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'logo' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.svg,
  __VLS_intrinsicElements.svg,
)({
  ...{ class: 'logo-img' },
  viewBox: '0 0 40 40',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-label': 'logo',
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
  width: '40',
  height: '40',
  rx: '8',
  fill: '#409eff',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.text,
  __VLS_intrinsicElements.text,
)({
  x: '50%',
  y: '55%',
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'font-size': '18',
  'font-weight': 'bold',
  fill: '#fff',
  'font-family': 'Arial, sans-serif',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'logo-text' },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(
  null,
  { ...__VLS_directiveBindingRestFields, value: !__VLS_ctx.isCollapse },
  null,
  null,
);
const __VLS_0 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ class: 'sidebar-scrollbar' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ class: 'sidebar-scrollbar' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
const __VLS_4 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    defaultActive: __VLS_ctx.activeMenu,
    collapse: __VLS_ctx.isCollapse,
    collapseTransition: false,
    uniqueOpened: true,
    backgroundColor: '#304156',
    textColor: '#bfcbd9',
    activeTextColor: '#409EFF',
    router: true,
  }),
);
const __VLS_6 = __VLS_5(
  {
    defaultActive: __VLS_ctx.activeMenu,
    collapse: __VLS_ctx.isCollapse,
    collapseTransition: false,
    uniqueOpened: true,
    backgroundColor: '#304156',
    textColor: '#bfcbd9',
    activeTextColor: '#409EFF',
    router: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_7.slots.default;
for (const [route] of __VLS_getVForSourceType(__VLS_ctx.menuRoutes)) {
  /** @type {[typeof SidebarItem, ]} */ // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(
    SidebarItem,
    new SidebarItem({
      key: route.path,
      item: route,
      basePath: route.path,
    }),
  );
  const __VLS_9 = __VLS_8(
    {
      key: route.path,
      item: route,
      basePath: route.path,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_8),
  );
}
var __VLS_7;
var __VLS_3;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'main-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.header,
  __VLS_intrinsicElements.header,
)({
  ...{ class: 'navbar' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'navbar-left' },
});
/** @type {[typeof Hamburger, ]} */ // @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(
  Hamburger,
  new Hamburger({
    ...{ onToggle: {} },
    isActive: __VLS_ctx.isCollapse,
  }),
);
const __VLS_12 = __VLS_11(
  {
    ...{ onToggle: {} },
    isActive: __VLS_ctx.isCollapse,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_11),
);
let __VLS_14;
let __VLS_15;
let __VLS_16;
const __VLS_17 = {
  onToggle: __VLS_ctx.toggleSidebar,
};
var __VLS_13;
/** @type {[typeof Breadcrumb, ]} */ // @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(Breadcrumb, new Breadcrumb({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'navbar-right' },
});
/** @type {[typeof Search, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  Search,
  new Search({
    ...{ class: 'navbar-item' },
  }),
);
const __VLS_22 = __VLS_21(
  {
    ...{ class: 'navbar-item' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
/** @type {[typeof FullScreen, ]} */ // @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(
  FullScreen,
  new FullScreen({
    ...{ class: 'navbar-item' },
  }),
);
const __VLS_25 = __VLS_24(
  {
    ...{ class: 'navbar-item' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_24),
);
/** @type {[typeof LanguageSwitch, ]} */ // @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(
  LanguageSwitch,
  new LanguageSwitch({
    ...{ class: 'navbar-item' },
  }),
);
const __VLS_28 = __VLS_27(
  {
    ...{ class: 'navbar-item' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_27),
);
const __VLS_30 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ // @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(
  __VLS_30,
  new __VLS_30({
    ...{ onCommand: {} },
    ...{ class: 'navbar-item user-dropdown' },
  }),
);
const __VLS_32 = __VLS_31(
  {
    ...{ onCommand: {} },
    ...{ class: 'navbar-item user-dropdown' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_31),
);
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
  onCommand: __VLS_ctx.handleUserCommand,
};
__VLS_33.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'user-info' },
});
const __VLS_38 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ // @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(
  __VLS_38,
  new __VLS_38({
    size: 32,
    icon: 'UserFilled',
  }),
);
const __VLS_40 = __VLS_39(
  {
    size: 32,
    icon: 'UserFilled',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_39),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'username' },
});
__VLS_ctx.userStore.nickname || __VLS_ctx.userStore.username;
const __VLS_42 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
const __VLS_46 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, ]} */ // @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
var __VLS_45;
{
  const { dropdown: __VLS_thisSlot } = __VLS_33.slots;
  const __VLS_50 = {}.ElDropdownMenu;
  /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ // @ts-ignore
  const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
  const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
  __VLS_53.slots.default;
  const __VLS_54 = {}.ElDropdownItem;
  /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
  const __VLS_55 = __VLS_asFunctionalComponent(
    __VLS_54,
    new __VLS_54({
      command: 'profile',
    }),
  );
  const __VLS_56 = __VLS_55(
    {
      command: 'profile',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_55),
  );
  __VLS_57.slots.default;
  const __VLS_58 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({}));
  const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
  __VLS_61.slots.default;
  const __VLS_62 = {}.User;
  /** @type {[typeof __VLS_components.User, ]} */ // @ts-ignore
  const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
  const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
  var __VLS_61;
  var __VLS_57;
  const __VLS_66 = {}.ElDropdownItem;
  /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
  const __VLS_67 = __VLS_asFunctionalComponent(
    __VLS_66,
    new __VLS_66({
      command: 'setting',
    }),
  );
  const __VLS_68 = __VLS_67(
    {
      command: 'setting',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_67),
  );
  __VLS_69.slots.default;
  const __VLS_70 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
  const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
  __VLS_73.slots.default;
  const __VLS_74 = {}.Setting;
  /** @type {[typeof __VLS_components.Setting, ]} */ // @ts-ignore
  const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
  const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
  var __VLS_73;
  var __VLS_69;
  const __VLS_78 = {}.ElDropdownItem;
  /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
  const __VLS_79 = __VLS_asFunctionalComponent(
    __VLS_78,
    new __VLS_78({
      divided: true,
      command: 'logout',
    }),
  );
  const __VLS_80 = __VLS_79(
    {
      divided: true,
      command: 'logout',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_79),
  );
  __VLS_81.slots.default;
  const __VLS_82 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({}));
  const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
  __VLS_85.slots.default;
  const __VLS_86 = {}.SwitchButton;
  /** @type {[typeof __VLS_components.SwitchButton, ]} */ // @ts-ignore
  const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
  const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
  var __VLS_85;
  var __VLS_81;
  var __VLS_53;
}
var __VLS_33;
/** @type {[typeof TagsView, ]} */ // @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(TagsView, new TagsView({}));
const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.main,
  __VLS_intrinsicElements.main,
)({
  ...{ class: 'main-content' },
});
const __VLS_93 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ // @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({}));
const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
{
  const { default: __VLS_thisSlot } = __VLS_96.slots;
  const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_97 = {}.transition;
  /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ // @ts-ignore
  const __VLS_98 = __VLS_asFunctionalComponent(
    __VLS_97,
    new __VLS_97({
      name: 'fade-transform',
      mode: 'out-in',
    }),
  );
  const __VLS_99 = __VLS_98(
    {
      name: 'fade-transform',
      mode: 'out-in',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_98),
  );
  __VLS_100.slots.default;
  const __VLS_101 = {}.KeepAlive;
  /** @type {[typeof __VLS_components.KeepAlive, typeof __VLS_components.keepAlive, typeof __VLS_components.KeepAlive, typeof __VLS_components.keepAlive, ]} */ // @ts-ignore
  const __VLS_102 = __VLS_asFunctionalComponent(
    __VLS_101,
    new __VLS_101({
      include: __VLS_ctx.cachedViews,
    }),
  );
  const __VLS_103 = __VLS_102(
    {
      include: __VLS_ctx.cachedViews,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_102),
  );
  __VLS_104.slots.default;
  const __VLS_105 = Component;
  // @ts-ignore
  const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({}));
  const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
  var __VLS_104;
  var __VLS_100;
  __VLS_96.slots['' /* empty slot name completion */];
}
var __VLS_96;
/** @type {__VLS_StyleScopedClasses['layout-container']} */ /** @type {__VLS_StyleScopedClasses['sidebar']} */ /** @type {__VLS_StyleScopedClasses['sidebar-header']} */ /** @type {__VLS_StyleScopedClasses['logo']} */ /** @type {__VLS_StyleScopedClasses['logo-img']} */ /** @type {__VLS_StyleScopedClasses['logo-text']} */ /** @type {__VLS_StyleScopedClasses['sidebar-scrollbar']} */ /** @type {__VLS_StyleScopedClasses['main-container']} */ /** @type {__VLS_StyleScopedClasses['navbar']} */ /** @type {__VLS_StyleScopedClasses['navbar-left']} */ /** @type {__VLS_StyleScopedClasses['navbar-right']} */ /** @type {__VLS_StyleScopedClasses['navbar-item']} */ /** @type {__VLS_StyleScopedClasses['navbar-item']} */ /** @type {__VLS_StyleScopedClasses['navbar-item']} */ /** @type {__VLS_StyleScopedClasses['navbar-item']} */ /** @type {__VLS_StyleScopedClasses['user-dropdown']} */ /** @type {__VLS_StyleScopedClasses['user-info']} */ /** @type {__VLS_StyleScopedClasses['username']} */ /** @type {__VLS_StyleScopedClasses['main-content']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      SidebarItem: SidebarItem,
      Breadcrumb: Breadcrumb,
      Hamburger: Hamburger,
      FullScreen: FullScreen,
      LanguageSwitch: LanguageSwitch,
      Search: Search,
      TagsView: TagsView,
      userStore: userStore,
      isCollapse: isCollapse,
      menuRoutes: menuRoutes,
      activeMenu: activeMenu,
      cachedViews: cachedViews,
      toggleSidebar: toggleSidebar,
      handleUserCommand: handleUserCommand,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
