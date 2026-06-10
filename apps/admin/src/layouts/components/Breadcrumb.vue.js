/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const matches = computed(() => {
  return route.matched.filter((item) => item.meta?.title);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ class: 'breadcrumb' },
    separator: '/',
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ class: 'breadcrumb' },
    separator: '/',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ // @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(
  __VLS_5,
  new __VLS_5({
    name: 'breadcrumb',
  }),
);
const __VLS_7 = __VLS_6(
  {
    name: 'breadcrumb',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_6),
);
__VLS_8.slots.default;
for (const [match, index] of __VLS_getVForSourceType(__VLS_ctx.matches)) {
  const __VLS_9 = {}.ElBreadcrumbItem;
  /** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ // @ts-ignore
  const __VLS_10 = __VLS_asFunctionalComponent(
    __VLS_9,
    new __VLS_9({
      key: match.path,
    }),
  );
  const __VLS_11 = __VLS_10(
    {
      key: match.path,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_10),
  );
  __VLS_12.slots.default;
  if (index === __VLS_ctx.matches.length - 1) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'breadcrumb-current' },
    });
    match.meta?.title || '未命名';
  } else {
    const __VLS_13 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(
      __VLS_13,
      new __VLS_13({
        to: match.path,
      }),
    );
    const __VLS_15 = __VLS_14(
      {
        to: match.path,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_14),
    );
    __VLS_16.slots.default;
    match.meta?.title || '未命名';
    var __VLS_16;
  }
  var __VLS_12;
}
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ /** @type {__VLS_StyleScopedClasses['breadcrumb-current']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      matches: matches,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Breadcrumb.vue.js.map
