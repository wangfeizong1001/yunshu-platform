/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
const size = 20;
const isFullscreen = ref(false);
const toggle = () => {
    if (isFullscreen.value) {
        document.exitFullscreen();
    }
    else {
        document.documentElement.requestFullscreen();
    }
};
const handleChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
};
onMounted(() => {
    document.addEventListener('fullscreenchange', handleChange);
});
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleChange);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: (__VLS_ctx.size),
    ...{ class: "fullscreen-icon" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: (__VLS_ctx.size),
    ...{ class: "fullscreen-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.toggle)
};
var __VLS_8 = {};
__VLS_3.slots.default;
if (!__VLS_ctx.isFullscreen) {
    const __VLS_9 = {}.FullScreen;
    /** @type {[typeof __VLS_components.FullScreen, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
else {
    const __VLS_13 = {}.Rank;
    /** @type {[typeof __VLS_components.Rank, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fullscreen-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            size: size,
            isFullscreen: isFullscreen,
            toggle: toggle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FullScreen.vue.js.map