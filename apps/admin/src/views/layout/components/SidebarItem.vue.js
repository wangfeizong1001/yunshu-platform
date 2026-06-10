/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import path from 'path-browserify';
const props = defineProps();
const route = useRoute();
const router = useRouter();
const activeMenu = computed(() => {
    return route.path;
});
// 判断是否有且只有一个显示的子菜单
const hasOneShowingChild = (item) => {
    if (!item.children)
        return false;
    const showingChildren = item.children.filter((child) => {
        return !child.meta?.hidden;
    });
    return showingChildren.length === 1;
};
// 解析路由路径
const resolvePath = (routePath) => {
    return path.resolve(props.basePath, routePath);
};
// 路由跳转
const handleRoute = (item) => {
    router.push(resolvePath(item.path));
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.activeMenu),
    collapse: (false),
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409EFF",
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.activeMenu),
    collapse: (false),
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409EFF",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.item.children))) {
    (item.path);
    if (__VLS_ctx.hasOneShowingChild(item) && item.children) {
        const __VLS_5 = {}.ElSubMenu;
        /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
            index: (__VLS_ctx.resolvePath(item.path)),
        }));
        const __VLS_7 = __VLS_6({
            index: (__VLS_ctx.resolvePath(item.path)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        __VLS_8.slots.default;
        {
            const { title: __VLS_thisSlot } = __VLS_8.slots;
            if (item.meta?.icon) {
                const __VLS_9 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
                const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
                __VLS_12.slots.default;
                const __VLS_13 = ((item.meta.icon));
                // @ts-ignore
                const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
                const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
                var __VLS_12;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.meta?.title || item.menuName);
        }
        for (const [child] of __VLS_getVForSourceType((item.children))) {
            const __VLS_17 = {}.SidebarItem;
            /** @type {[typeof __VLS_components.SidebarItem, typeof __VLS_components.sidebarItem, ]} */ ;
            // @ts-ignore
            const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
                key: (child.path),
                item: (child),
                basePath: (__VLS_ctx.resolvePath(item.path)),
            }));
            const __VLS_19 = __VLS_18({
                key: (child.path),
                item: (child),
                basePath: (__VLS_ctx.resolvePath(item.path)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        }
        var __VLS_8;
    }
    else {
        const __VLS_21 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ 'onClick': {} },
            index: (__VLS_ctx.resolvePath(item.path)),
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onClick': {} },
            index: (__VLS_ctx.resolvePath(item.path)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_25;
        let __VLS_26;
        let __VLS_27;
        const __VLS_28 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.hasOneShowingChild(item) && item.children))
                    return;
                __VLS_ctx.handleRoute(item);
            }
        };
        __VLS_24.slots.default;
        if (item.meta?.icon) {
            const __VLS_29 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
            const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
            __VLS_32.slots.default;
            const __VLS_33 = ((item.meta.icon));
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
            const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
            var __VLS_32;
        }
        {
            const { title: __VLS_thisSlot } = __VLS_24.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.meta?.title || item.menuName);
        }
        var __VLS_24;
    }
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activeMenu: activeMenu,
            hasOneShowingChild: hasOneShowingChild,
            resolvePath: resolvePath,
            handleRoute: handleRoute,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SidebarItem.vue.js.map