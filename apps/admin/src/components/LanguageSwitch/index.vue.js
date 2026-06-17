/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import useLocale from '@/locales/useLocale';
const { locale, locales, changeLocale } = useLocale();
const currentLabel = computed(() => {
    const current = locales.value.find(l => l.key === locale.value);
    return current?.label || '中文';
});
const currentIcon = computed(() => {
    // 根据当前语言返回不同图标
    return 'Connection';
});
const handleCommand = async (key) => {
    await changeLocale(key);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onCommand': {} },
    hideOnClick: (false),
    trigger: "click",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onCommand': {} },
    hideOnClick: (false),
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onCommand: (__VLS_ctx.handleCommand)
};
var __VLS_8 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "language-switch" },
});
const __VLS_9 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "language-icon" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "language-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = ((__VLS_ctx.currentIcon));
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "language-label" },
});
(__VLS_ctx.currentLabel);
const __VLS_17 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "arrow-icon" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "arrow-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
var __VLS_20;
{
    const { dropdown: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_25 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.locales))) {
        const __VLS_29 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            key: (item.key),
            command: (item.key),
            disabled: (item.key === __VLS_ctx.locale),
        }));
        const __VLS_31 = __VLS_30({
            key: (item.key),
            command: (item.key),
            disabled: (item.key === __VLS_ctx.locale),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        __VLS_32.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({ 'is-active': item.key === __VLS_ctx.locale }) },
        });
        (item.label);
        var __VLS_32;
    }
    var __VLS_28;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['language-switch']} */ ;
/** @type {__VLS_StyleScopedClasses['language-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['language-label']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowDown: ArrowDown,
            locale: locale,
            locales: locales,
            currentLabel: currentLabel,
            currentIcon: currentIcon,
            handleCommand: handleCommand,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map