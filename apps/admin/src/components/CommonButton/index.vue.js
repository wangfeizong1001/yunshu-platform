/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const __VLS_props = withDefaults(defineProps(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
});
const emit = defineEmits(['click']);
const handleClick = (event) => {
  emit('click', event);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) {
  return t;
})({
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClick: {} },
    type: __VLS_ctx.type,
    size: __VLS_ctx.size,
    disabled: __VLS_ctx.disabled,
    loading: __VLS_ctx.loading,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClick: {} },
    type: __VLS_ctx.type,
    size: __VLS_ctx.size,
    disabled: __VLS_ctx.disabled,
    loading: __VLS_ctx.loading,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClick: __VLS_ctx.handleClick,
};
var __VLS_8 = {};
__VLS_3.slots.default;
var __VLS_9 = {};
var __VLS_3;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      handleClick: handleClick,
    };
  },
  emits: {},
  __typeProps: {},
  props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  emits: {},
  __typeProps: {},
  props: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
