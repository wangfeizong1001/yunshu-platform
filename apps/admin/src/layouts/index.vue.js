/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import TagsView from './components/TagsView.vue';
const appStore = useAppStore();
const isCollapsed = computed(() => appStore.sidebarCollapsed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sidebar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['main-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-view-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-wrapper" },
    ...{ class: ({ 'sidebar-collapsed': __VLS_ctx.isCollapsed }) },
});
/** @type {[typeof Sidebar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Sidebar, new Sidebar({
    ...{ class: "sidebar-container" },
}));
const __VLS_1 = __VLS_0({
    ...{ class: "sidebar-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-container" },
});
/** @type {[typeof Header, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Header, new Header({
    ...{ class: "header-container" },
}));
const __VLS_4 = __VLS_3({
    ...{ class: "header-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof TagsView, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(TagsView, new TagsView({
    ...{ class: "tags-view-container" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "tags-view-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main" },
});
const __VLS_9 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
{
    const { default: __VLS_thisSlot } = __VLS_12.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_13 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        name: "page",
        mode: "out-in",
    }));
    const __VLS_15 = __VLS_14({
        name: "page",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = ((Component));
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_16;
    __VLS_12.slots['' /* empty slot name completion */];
}
var __VLS_12;
/** @type {__VLS_StyleScopedClasses['app-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['main-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-view-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Sidebar: Sidebar,
            Header: Header,
            TagsView: TagsView,
            isCollapsed: isCollapsed,
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