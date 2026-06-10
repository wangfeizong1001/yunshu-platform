/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from 'vue';
const props = withDefaults(defineProps(), {
  loading: false,
  data: () => [],
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  showSelection: true,
  showPagination: true,
});
const emit = defineEmits();
const currentPage = ref(props.page);
const pageSize = ref(props.limit);
watch(
  () => props.page,
  (val) => {
    currentPage.value = val;
  },
);
watch(
  () => props.limit,
  (val) => {
    pageSize.value = val;
  },
);
const handleSizeChange = (val) => {
  emit('query', { page: currentPage.value, limit: val });
};
const handleCurrentChange = (val) => {
  emit('query', { page: val, limit: pageSize.value });
};
const handleSelectionChange = (selection) => {
  emit('selection-change', selection);
};
const __VLS_exposed = {
  currentPage,
  pageSize,
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) {
  return t;
})({
  loading: false,
  data: () => [],
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  showSelection: true,
  showPagination: true,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'log-table' },
});
var __VLS_0 = {};
var __VLS_2 = {};
const __VLS_4 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.data,
  }),
);
const __VLS_6 = __VLS_5(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.data,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_7.slots.default;
if (__VLS_ctx.showSelection) {
  const __VLS_12 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_13 = __VLS_asFunctionalComponent(
    __VLS_12,
    new __VLS_12({
      type: 'selection',
      width: '50',
      align: 'center',
    }),
  );
  const __VLS_14 = __VLS_13(
    {
      type: 'selection',
      width: '50',
      align: 'center',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_13),
  );
}
var __VLS_16 = {};
var __VLS_7;
if (__VLS_ctx.showPagination) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'pagination-container' },
  });
  const __VLS_18 = {}.ElPagination;
  /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
  const __VLS_19 = __VLS_asFunctionalComponent(
    __VLS_18,
    new __VLS_18({
      ...{ onSizeChange: {} },
      ...{ onCurrentChange: {} },
      currentPage: __VLS_ctx.currentPage,
      pageSize: __VLS_ctx.pageSize,
      pageSizes: __VLS_ctx.pageSizes,
      total: __VLS_ctx.total,
      layout: __VLS_ctx.layout,
    }),
  );
  const __VLS_20 = __VLS_19(
    {
      ...{ onSizeChange: {} },
      ...{ onCurrentChange: {} },
      currentPage: __VLS_ctx.currentPage,
      pageSize: __VLS_ctx.pageSize,
      pageSizes: __VLS_ctx.pageSizes,
      total: __VLS_ctx.total,
      layout: __VLS_ctx.layout,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_19),
  );
  let __VLS_22;
  let __VLS_23;
  let __VLS_24;
  const __VLS_25 = {
    onSizeChange: __VLS_ctx.handleSizeChange,
  };
  const __VLS_26 = {
    onCurrentChange: __VLS_ctx.handleCurrentChange,
  };
  var __VLS_21;
}
/** @type {__VLS_StyleScopedClasses['log-table']} */ /** @type {__VLS_StyleScopedClasses['pagination-container']} */ // @ts-ignore
var __VLS_1 = __VLS_0,
  __VLS_3 = __VLS_2,
  __VLS_17 = __VLS_16;
[__VLS_dollars.$attrs];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      handleSizeChange: handleSizeChange,
      handleCurrentChange: handleCurrentChange,
      handleSelectionChange: handleSelectionChange,
    };
  },
  __typeEmits: {},
  __typeProps: {},
  props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
  setup() {
    return {
      ...__VLS_exposed,
    };
  },
  __typeEmits: {},
  __typeProps: {},
  props: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=LogTable.vue.js.map
