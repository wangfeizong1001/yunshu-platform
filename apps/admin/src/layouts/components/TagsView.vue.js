import { onMounted, computed, ref, watch } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { usePermissionStore } from '@/store/modules/permission';
import { useRoute, useRouter } from 'vue-router';
const tagsViewStore = useTagsViewStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const router = useRouter();
const visible = ref(false);
const left = ref(0);
const top = ref(0);
const selectedTag = ref({ path: '', name: '' });
const visitedViews = computed(() => tagsViewStore.visitedViews.value);
const isActive = (tag) => {
    return tag.path === route.path;
};
const isAffix = (tag) => {
    return tag?.meta?.affix || false;
};
const filterAffixTags = (routes, basePath = '/') => {
    let tags = [];
    routes.forEach((r) => {
        const routeItem = r;
        if (routeItem.meta?.affix) {
            const tagPath = `${basePath}${routeItem.path || ''}`.replace(/\/+/g, '/');
            tags.push({
                path: tagPath,
                name: String(routeItem.name || ''),
                meta: { ...routeItem.meta }
            });
        }
        if (routeItem.children) {
            const childTags = filterAffixTags(routeItem.children, `${basePath}${routeItem.path || ''}/`);
            tags = [...tags, ...childTags];
        }
    });
    return tags;
};
const initTags = () => {
    const affixTagsArr = filterAffixTags(permissionStore.routes);
    affixTagsArr.forEach((tag) => {
        if (tag.name) {
            tagsViewStore.addVisitedView(tag);
        }
    });
};
const addTags = () => {
    const name = route.name;
    if (name && typeof name === 'string') {
        tagsViewStore.addVisitedView({
            path: route.path,
            name: name,
            query: route.query,
            meta: { ...route.meta }
        });
    }
};
const openMenu = (tag, event) => {
    visible.value = true;
    left.value = event.clientX;
    top.value = event.clientY + 4;
    selectedTag.value = tag;
};
const closeSelectedTag = (tag) => {
    tagsViewStore.delVisitedView(tag);
    if (isActive(tag)) {
        const latestView = visitedViews.value.slice(-1)[0];
        if (latestView) {
            router.push(latestView.path);
        }
        else {
            router.push('/');
        }
    }
};
const refreshSelectedTag = (tag) => {
    tagsViewStore.delCachedView(tag);
    router.replace({
        path: '/redirect' + tag.path
    });
};
const closeOtherTags = () => {
    if (selectedTag.value.path !== route.path) {
        router.push(selectedTag.value.path);
    }
    tagsViewStore.delOtherViews(selectedTag.value);
    visible.value = false;
};
const closeAllTags = () => {
    tagsViewStore.delAllViews();
    router.push('/');
};
watch(() => route.path, () => {
    addTags();
});
watch(visible, (value) => {
    if (value) {
        document.body.addEventListener('click', closeMenu);
    }
    else {
        document.body.removeEventListener('click', closeMenu);
    }
});
const closeMenu = () => {
    visible.value = false;
};
onMounted(() => {
    initTags();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tags-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tags-view-wrapper" },
});
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.visitedViews))) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onContextmenu': {} },
        key: (tag.path),
        to: ({ path: tag.path, query: tag.query }),
        ...{ class: "tags-view-item" },
        ...{ class: ({ 'is-active': __VLS_ctx.isActive(tag) }) },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onContextmenu': {} },
        key: (tag.path),
        to: ({ path: tag.path, query: tag.query }),
        ...{ class: "tags-view-item" },
        ...{ class: ({ 'is-active': __VLS_ctx.isActive(tag) }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onContextmenu: (...[$event]) => {
            __VLS_ctx.openMenu(tag, $event);
        }
    };
    __VLS_3.slots.default;
    (tag.title);
    if (!__VLS_ctx.isAffix(tag)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isAffix(tag)))
                        return;
                    __VLS_ctx.closeSelectedTag(tag);
                } },
            ...{ class: "el-icon-close" },
        });
        const __VLS_8 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            size: (12),
        }));
        const __VLS_10 = __VLS_9({
            size: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        const __VLS_12 = {}.Close;
        /** @type {[typeof __VLS_components.Close, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
        const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
        var __VLS_11;
    }
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "contextmenu" },
    ...{ style: ({ left: __VLS_ctx.left + 'px', top: __VLS_ctx.top + 'px' }) },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.visible) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.refreshSelectedTag(__VLS_ctx.selectedTag);
        } },
});
if (!__VLS_ctx.isAffix(__VLS_ctx.selectedTag)) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isAffix(__VLS_ctx.selectedTag)))
                    return;
                __VLS_ctx.closeSelectedTag(__VLS_ctx.selectedTag);
            } },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (__VLS_ctx.closeOtherTags) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (__VLS_ctx.closeAllTags) },
});
/** @type {__VLS_StyleScopedClasses['tags-view']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-view-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-view-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon-close']} */ ;
/** @type {__VLS_StyleScopedClasses['contextmenu']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Close: Close,
            visible: visible,
            left: left,
            top: top,
            selectedTag: selectedTag,
            visitedViews: visitedViews,
            isActive: isActive,
            isAffix: isAffix,
            openMenu: openMenu,
            closeSelectedTag: closeSelectedTag,
            refreshSelectedTag: refreshSelectedTag,
            closeOtherTags: closeOtherTags,
            closeAllTags: closeAllTags,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagsView.vue.js.map