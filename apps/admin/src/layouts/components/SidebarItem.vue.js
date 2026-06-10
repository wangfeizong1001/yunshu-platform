/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { isExternal } from '@/utils';
const props = defineProps();
const resolvePath = (childPath) => {
  if (isExternal(childPath)) {
    return childPath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  const path = `${props.basePath}/${childPath}`.replace(/\/+/g, '/');
  return path;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
for (const [item] of __VLS_getVForSourceType(__VLS_ctx.item.children)) {
  item.path;
  if (item.children && item.children.length > 0) {
    const __VLS_0 = {}.ElSubMenu;
    /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(
      __VLS_0,
      new __VLS_0({
        index: __VLS_ctx.resolvePath(item.path),
      }),
    );
    const __VLS_2 = __VLS_1(
      {
        index: __VLS_ctx.resolvePath(item.path),
      },
      ...__VLS_functionalComponentArgsRest(__VLS_1),
    );
    __VLS_3.slots.default;
    {
      const { title: __VLS_thisSlot } = __VLS_3.slots;
      if (item.meta?.icon) {
        const __VLS_4 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
        const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_7.slots.default;
        const __VLS_8 = item.meta.icon;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
        const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
        var __VLS_7;
      }
      __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
      item.meta?.title;
    }
    const __VLS_12 = {}.SidebarItem;
    /** @type {[typeof __VLS_components.SidebarItem, ]} */ // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(
      __VLS_12,
      new __VLS_12({
        item: item,
        basePath: __VLS_ctx.resolvePath(item.path),
      }),
    );
    const __VLS_14 = __VLS_13(
      {
        item: item,
        basePath: __VLS_ctx.resolvePath(item.path),
      },
      ...__VLS_functionalComponentArgsRest(__VLS_13),
    );
    var __VLS_3;
  } else {
    const __VLS_16 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(
      __VLS_16,
      new __VLS_16({
        index: __VLS_ctx.resolvePath(item.path),
      }),
    );
    const __VLS_18 = __VLS_17(
      {
        index: __VLS_ctx.resolvePath(item.path),
      },
      ...__VLS_functionalComponentArgsRest(__VLS_17),
    );
    __VLS_19.slots.default;
    if (item.meta?.icon) {
      const __VLS_20 = {}.ElIcon;
      /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
      const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
      const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
      __VLS_23.slots.default;
      const __VLS_24 = item.meta.icon;
      // @ts-ignore
      const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
      const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
      var __VLS_23;
    }
    {
      const { title: __VLS_thisSlot } = __VLS_19.slots;
      __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
      item.meta?.title;
    }
    var __VLS_19;
  }
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      resolvePath: resolvePath,
    };
  },
  __typeProps: {},
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SidebarItem.vue.js.map
