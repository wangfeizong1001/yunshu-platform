import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Search, Menu, Promotion } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { usePermissionStore } from '@/store/modules/permission';
const props = defineProps({
    size: {
        type: Number,
        default: 20
    }
});
const router = useRouter();
const permissionStore = usePermissionStore();
const visible = ref(false);
const keyword = ref('');
const activeIndex = ref(0);
const searchInputRef = ref(null);
/**
 * 递归扁平化路由，提取可搜索的菜单项
 * @param routes 路由数组
 * @param result 结果数组
 */
function flattenRoutes(routes, result = []) {
    for (const route of routes) {
        if (route.meta?.title) {
            result.push({
                title: route.meta.title,
                path: route.path
            });
        }
        if (route.children) {
            flattenRoutes(route.children, result);
        }
    }
    return result;
}
const allSearchItems = computed(() => {
    return flattenRoutes(permissionStore.routes);
});
const filteredResults = computed(() => {
    if (!keyword.value) {
        return [];
    }
    const lowerKeyword = keyword.value.toLowerCase();
    return allSearchItems.value
        .filter((item) => item.title.toLowerCase().includes(lowerKeyword) ||
        item.path.toLowerCase().includes(lowerKeyword))
        .slice(0, 10);
});
const hotResults = computed(() => {
    return allSearchItems.value.slice(0, 6);
});
function openDialog() {
    visible.value = true;
    nextTick(() => {
        searchInputRef.value?.focus();
    });
}
function closeDialog() {
    visible.value = false;
}
function onDialogClosed() {
    keyword.value = '';
    activeIndex.value = 0;
}
function handleKeydown(event) {
    const results = keyword.value ? filteredResults.value : hotResults.value;
    const maxIndex = results.length - 1;
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (activeIndex.value < maxIndex) {
                activeIndex.value++;
            }
            else {
                activeIndex.value = 0;
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (activeIndex.value > 0) {
                activeIndex.value--;
            }
            else {
                activeIndex.value = maxIndex;
            }
            break;
        case 'Enter':
            event.preventDefault();
            if (results.length > 0) {
                handleSelect(results[activeIndex.value]);
            }
            break;
        case 'Escape':
            event.preventDefault();
            closeDialog();
            break;
    }
}
function handleSelect(item) {
    closeDialog();
    router.push(item.path);
}
function handleGlobalKeydown(event) {
    if (event.key === '/' && !visible.value) {
        const activeElement = document.activeElement;
        const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
        if (!isInput) {
            event.preventDefault();
            openDialog();
        }
    }
}
onMounted(() => {
    document.addEventListener('keydown', handleGlobalKeydown);
});
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['result-arrow']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.openDialog) },
    ...{ class: "search-trigger" },
});
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    size: (__VLS_ctx.size),
}));
const __VLS_2 = __VLS_1({
    size: (__VLS_ctx.size),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
var __VLS_3;
const __VLS_8 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "菜单搜索",
    width: "520px",
    closeOnClickModal: (true),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "菜单搜索",
    width: "520px",
    closeOnClickModal: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClosed: (__VLS_ctx.onDialogClosed)
};
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-content" },
});
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onKeydown': {} },
    ref: "searchInputRef",
    modelValue: (__VLS_ctx.keyword),
    placeholder: "输入菜单名称或路径搜索...",
    size: "large",
    clearable: true,
}));
const __VLS_18 = __VLS_17({
    ...{ 'onKeydown': {} },
    ref: "searchInputRef",
    modelValue: (__VLS_ctx.keyword),
    placeholder: "输入菜单名称或路径搜索...",
    size: "large",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onKeydown: (__VLS_ctx.handleKeydown)
};
/** @type {typeof __VLS_ctx.searchInputRef} */ ;
var __VLS_24 = {};
__VLS_19.slots.default;
{
    const { prefix: __VLS_thisSlot } = __VLS_19.slots;
    const __VLS_26 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
    const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_29.slots.default;
    const __VLS_30 = {}.Search;
    /** @type {[typeof __VLS_components.Search, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    var __VLS_29;
}
var __VLS_19;
if (__VLS_ctx.keyword) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "search-results" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.filteredResults))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.keyword))
                        return;
                    __VLS_ctx.handleSelect(item);
                } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.keyword))
                        return;
                    __VLS_ctx.activeIndex = index;
                } },
            key: (item.path),
            ...{ class: "search-result-item" },
            ...{ class: ({ 'is-active': index === __VLS_ctx.activeIndex }) },
        });
        const __VLS_34 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            ...{ class: "result-icon" },
        }));
        const __VLS_36 = __VLS_35({
            ...{ class: "result-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        __VLS_37.slots.default;
        const __VLS_38 = {}.Menu;
        /** @type {[typeof __VLS_components.Menu, ]} */ ;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        var __VLS_37;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "result-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "result-title" },
        });
        (item.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "result-path" },
        });
        (item.path);
        const __VLS_42 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
            ...{ class: "result-arrow" },
        }));
        const __VLS_44 = __VLS_43({
            ...{ class: "result-arrow" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        __VLS_45.slots.default;
        const __VLS_46 = {}.Promotion;
        /** @type {[typeof __VLS_components.Promotion, ]} */ ;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({}));
        const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
        var __VLS_45;
    }
    if (__VLS_ctx.filteredResults.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "search-empty" },
        });
        const __VLS_50 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            size: (40),
        }));
        const __VLS_52 = __VLS_51({
            size: (40),
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        __VLS_53.slots.default;
        const __VLS_54 = {}.Search;
        /** @type {[typeof __VLS_components.Search, ]} */ ;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
        const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
        var __VLS_53;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "search-tips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tips-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tips-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tips-hint" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hot-results" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.hotResults))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.keyword))
                        return;
                    __VLS_ctx.handleSelect(item);
                } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!!(__VLS_ctx.keyword))
                        return;
                    __VLS_ctx.activeIndex = index;
                } },
            key: (item.path),
            ...{ class: "search-result-item" },
            ...{ class: ({ 'is-active': index === __VLS_ctx.activeIndex }) },
        });
        const __VLS_58 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
            ...{ class: "result-icon" },
        }));
        const __VLS_60 = __VLS_59({
            ...{ class: "result-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        __VLS_61.slots.default;
        const __VLS_62 = {}.Menu;
        /** @type {[typeof __VLS_components.Menu, ]} */ ;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
        const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
        var __VLS_61;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "result-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "result-title" },
        });
        (item.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "result-path" },
        });
        (item.path);
        const __VLS_66 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
            ...{ class: "result-arrow" },
        }));
        const __VLS_68 = __VLS_67({
            ...{ class: "result-arrow" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        __VLS_69.slots.default;
        const __VLS_70 = {}.Promotion;
        /** @type {[typeof __VLS_components.Promotion, ]} */ ;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
        const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
        var __VLS_69;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "shortcut-keys" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "shortcut-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.kbd, __VLS_intrinsicElements.kbd)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.kbd, __VLS_intrinsicElements.kbd)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "shortcut-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.kbd, __VLS_intrinsicElements.kbd)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "shortcut-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.kbd, __VLS_intrinsicElements.kbd)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['search-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['search-content']} */ ;
/** @type {__VLS_StyleScopedClasses['search-results']} */ ;
/** @type {__VLS_StyleScopedClasses['search-result-item']} */ ;
/** @type {__VLS_StyleScopedClasses['result-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['result-info']} */ ;
/** @type {__VLS_StyleScopedClasses['result-title']} */ ;
/** @type {__VLS_StyleScopedClasses['result-path']} */ ;
/** @type {__VLS_StyleScopedClasses['result-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['search-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['search-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['tips-header']} */ ;
/** @type {__VLS_StyleScopedClasses['tips-title']} */ ;
/** @type {__VLS_StyleScopedClasses['tips-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['hot-results']} */ ;
/** @type {__VLS_StyleScopedClasses['search-result-item']} */ ;
/** @type {__VLS_StyleScopedClasses['result-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['result-info']} */ ;
/** @type {__VLS_StyleScopedClasses['result-title']} */ ;
/** @type {__VLS_StyleScopedClasses['result-path']} */ ;
/** @type {__VLS_StyleScopedClasses['result-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-keys']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
// @ts-ignore
var __VLS_25 = __VLS_24;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Menu: Menu,
            Promotion: Promotion,
            visible: visible,
            keyword: keyword,
            activeIndex: activeIndex,
            searchInputRef: searchInputRef,
            filteredResults: filteredResults,
            hotResults: hotResults,
            openDialog: openDialog,
            onDialogClosed: onDialogClosed,
            handleKeydown: handleKeydown,
            handleSelect: handleSelect,
        };
    },
    props: {
        size: {
            type: Number,
            default: 20
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        size: {
            type: Number,
            default: 20
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Search.vue.js.map