/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 文本组件
 * 用于大屏设计器中显示自定义文本内容
 */
import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    config: () => ({
        content: '文本内容',
        fontSize: 16,
        fontColor: '#00d4ff',
        fontWeight: 'normal',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
    }),
});
// 文本样式
const textStyle = computed(() => {
    return {
        fontSize: `${props.config?.fontSize || 16}px`,
        color: props.config?.fontColor || '#00d4ff',
        fontWeight: props.config?.fontWeight || 'normal',
        textAlign: props.config?.textAlign || 'center',
        backgroundColor: props.config?.backgroundColor || 'rgba(0, 102, 255, 0.1)',
    };
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    config: () => ({
        content: '文本内容',
        fontSize: 16,
        fontColor: '#00d4ff',
        fontWeight: 'normal',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
    }),
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-widget" },
    ...{ style: (__VLS_ctx.textStyle) },
});
if (__VLS_ctx.config?.content) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-content" },
    });
    (__VLS_ctx.config.content);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-placeholder" },
    });
}
/** @type {__VLS_StyleScopedClasses['text-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['text-content']} */ ;
/** @type {__VLS_StyleScopedClasses['text-placeholder']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            textStyle: textStyle,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TextWidget.vue.js.map