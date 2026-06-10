/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
const size = 20;
const count = ref(3);
const openNotification = () => {
    // TODO: 打开通知面板
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElBadge;
/** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    value: (__VLS_ctx.count),
    hidden: (__VLS_ctx.count === 0),
    max: (99),
    ...{ class: "notification-badge" },
}));
const __VLS_2 = __VLS_1({
    value: (__VLS_ctx.count),
    hidden: (__VLS_ctx.count === 0),
    max: (99),
    ...{ class: "notification-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    size: (__VLS_ctx.size),
    ...{ class: "notification-icon" },
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    size: (__VLS_ctx.size),
    ...{ class: "notification-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onClick: (__VLS_ctx.openNotification)
};
__VLS_8.slots.default;
const __VLS_13 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['notification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            size: size,
            count: count,
            openNotification: openNotification,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Notification.vue.js.map