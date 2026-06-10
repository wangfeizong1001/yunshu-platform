/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const handleSearch = () => {
  ElMessage.info('搜索功能开发中...');
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
  ...{ class: 'search-container' },
});
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClick: {} },
    size: 20,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClick: {} },
    size: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClick: __VLS_ctx.handleSearch,
};
__VLS_3.slots.default;
const __VLS_8 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['search-container']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      handleSearch: handleSearch,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Search.vue.js.map
