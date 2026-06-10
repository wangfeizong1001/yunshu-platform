import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 常用图标列表
const iconList = [
    // 基础图标
    'Plus',
    'Minus',
    'Search',
    'Refresh',
    'Edit',
    'Delete',
    'View',
    'Hide',
    'Upload',
    'Download',
    'UploadFilled',
    'DownloadFilled',
    // 导航图标
    'HomeFilled',
    'Menu',
    'Guide',
    'Location',
    'LocationInformation',
    // 用户图标
    'User',
    'UserFilled',
    'Avatar',
    'People',
    'UserPlus',
    'Coordinate',
    // 文档图标
    'Document',
    'DocumentChecked',
    'DocumentCopy',
    'Tickets',
    'Memo',
    'Collection',
    'Notebook',
    'Reading',
    // 业务图标
    'Setting',
    'Tools',
    'Gear',
    'Coin',
    'Money',
    'PriceTag',
    'ShoppingCart',
    'ShoppingCartFull',
    'Goods',
    'Shop',
    'Sell',
    'Promotion',
    // 状态图标
    'SuccessFilled',
    'WarningFilled',
    'ErrorFilled',
    'InfoFilled',
    'Check',
    'Close',
    'CircleCheck',
    'CircleClose',
    'WarnTriangle',
    // 通讯图标
    'Message',
    'MessageBox',
    'ChatDotRound',
    'ChatLineRound',
    'Phone',
    'PhoneFilled',
    'Email',
    'Bell',
    'ChatSquare',
    // 文件图标
    'Folder',
    'FolderOpened',
    'FolderAdd',
    'FolderDelete',
    'DocumentAdd',
    'DocumentDelete',
    // 编辑图标
    'EditPen',
    'DeleteFilled',
    'Brush',
    'Pen',
    'Edit',
    // 时间图标
    'Clock',
    'Timer',
    'Calendar',
    'AlarmClock',
    // 其他图标
    'More',
    'MoreFilled',
    'Star',
    'StarFilled',
    'Heart',
    'HeartFilled',
    'Lock',
    'Unlock',
    'Key',
    'Link',
    'Connection',
    'Route',
    'Grid',
    'Grid',
    'Operation',
    'Sort',
    'Filter',
    'List',
    'Management',
    'ZoomIn',
    'ZoomOut',
    'FullScreen',
    'Aim',
];
const selectedIcon = ref('');
function handleSelect(icon) {
    selectedIcon.value = icon;
}
function handleConfirm() {
    if (selectedIcon.value) {
        emit('select', selectedIcon.value);
        handleClose();
    }
}
function handleClose() {
    selectedIcon.value = '';
    visible.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "选择图标",
    width: "800px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "选择图标",
    width: "800px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon-list" },
});
for (const [icon] of __VLS_getVForSourceType((__VLS_ctx.iconList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleSelect(icon);
            } },
        key: (icon),
        ...{ class: "icon-item" },
        ...{ class: ({ active: __VLS_ctx.selectedIcon === icon }) },
    });
    const __VLS_5 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        size: (24),
    }));
    const __VLS_7 = __VLS_6({
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = ((icon));
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "icon-name" },
    });
    (icon);
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_13 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_16.slots.default;
    var __VLS_16;
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (__VLS_ctx.handleConfirm)
    };
    __VLS_24.slots.default;
    var __VLS_24;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['icon-list']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-name']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            iconList: iconList,
            selectedIcon: selectedIcon,
            handleSelect: handleSelect,
            handleConfirm: handleConfirm,
            handleClose: handleClose,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MenuIcon.vue.js.map