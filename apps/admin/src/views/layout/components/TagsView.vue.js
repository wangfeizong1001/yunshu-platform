/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Close } from '@element-plus/icons-vue';
const route = useRoute();
const visitedViews = computed(() => {
  return [
    {
      path: '/',
      meta: { title: '首页', affix: true },
    },
  ];
});
const isActive = (tag) => {
  return tag.path === route.path;
};
const closeTag = () => {
  // 关闭标签
};
const closeSelectedTag = () => {
  // 中键关闭
};
const openMenu = () => {
  // 右键菜单
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
  ...{ class: 'tags-view-container' },
});
const __VLS_0 = {}.ScrollPane;
/** @type {[typeof __VLS_components.ScrollPane, typeof __VLS_components.scrollPane, typeof __VLS_components.ScrollPane, typeof __VLS_components.scrollPane, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ class: 'tags-view-wrapper' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ class: 'tags-view-wrapper' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
for (const [tag] of __VLS_getVForSourceType(__VLS_ctx.visitedViews)) {
  const __VLS_4 = {}.RouterLink;
  /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ // @ts-ignore
  const __VLS_5 = __VLS_asFunctionalComponent(
    __VLS_4,
    new __VLS_4({
      ...{ onClick: {} },
      ...{ onContextmenu: {} },
      key: tag.path,
      to: { path: tag.path },
      tag: 'span',
      ...{ class: 'tags-view-item' },
      ...{ class: { 'is-active': __VLS_ctx.isActive(tag) } },
    }),
  );
  const __VLS_6 = __VLS_5(
    {
      ...{ onClick: {} },
      ...{ onContextmenu: {} },
      key: tag.path,
      to: { path: tag.path },
      tag: 'span',
      ...{ class: 'tags-view-item' },
      ...{ class: { 'is-active': __VLS_ctx.isActive(tag) } },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_5),
  );
  let __VLS_8;
  let __VLS_9;
  let __VLS_10;
  const __VLS_11 = {
    onClick: __VLS_ctx.closeSelectedTag,
  };
  const __VLS_12 = {
    onContextmenu: __VLS_ctx.openMenu,
  };
  __VLS_7.slots.default;
  tag.meta?.title;
  if (!tag.meta?.affix) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ onClick: __VLS_ctx.closeTag },
      ...{ class: 'el-icon-close' },
    });
    const __VLS_13 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(
      __VLS_13,
      new __VLS_13({
        size: 12,
      }),
    );
    const __VLS_15 = __VLS_14(
      {
        size: 12,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_14),
    );
    __VLS_16.slots.default;
    const __VLS_17 = {}.Close;
    /** @type {[typeof __VLS_components.Close, ]} */ // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_16;
  }
  var __VLS_7;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['tags-view-container']} */ /** @type {__VLS_StyleScopedClasses['tags-view-wrapper']} */ /** @type {__VLS_StyleScopedClasses['tags-view-item']} */ /** @type {__VLS_StyleScopedClasses['el-icon-close']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Close: Close,
      visitedViews: visitedViews,
      isActive: isActive,
      closeTag: closeTag,
      closeSelectedTag: closeSelectedTag,
      openMenu: openMenu,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagsView.vue.js.map
