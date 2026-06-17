/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 图片组件
 * 用于大屏设计器中显示图片
 */
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';
const props = withDefaults(defineProps(), {
    config: () => ({
        imageUrl: '',
        alt: '图片',
        fit: 'contain',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
    }),
});
// 图片样式
const imageStyle = computed(() => {
    return {
        objectFit: props.config?.fit || 'contain',
    };
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    config: () => ({
        imageUrl: '',
        alt: '图片',
        fit: 'contain',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
    }),
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "image-widget" },
});
if (__VLS_ctx.config?.imageUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "image-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.config.imageUrl),
        alt: (__VLS_ctx.config.alt || '图片'),
        ...{ class: "image-content" },
        ...{ style: (__VLS_ctx.imageStyle) },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "image-placeholder" },
    });
    const __VLS_0 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: (48),
    }));
    const __VLS_2 = __VLS_1({
        size: (48),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.Picture;
    /** @type {[typeof __VLS_components.Picture, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
/** @type {__VLS_StyleScopedClasses['image-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['image-content']} */ ;
/** @type {__VLS_StyleScopedClasses['image-placeholder']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Picture: Picture,
            imageStyle: imageStyle,
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
//# sourceMappingURL=ImageWidget.vue.js.map