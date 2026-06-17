import { ref, computed, watch } from 'vue';
import SafeHtml from '@/components/SafeHtml/index.vue';
import { getNoticeDetail } from '@/api/system/notice.api';
// ========== 状态常量（与后端约定字段值） ==========
const NOTICE_TYPE_NOTIFY = '1';
const NOTICE_STATUS_PUBLISHED = '0';
/** 公告类型 tag 类型 */
const getNoticeTypeTagType = (val) => val === NOTICE_TYPE_NOTIFY ? 'primary' : 'info';
/** 公告类型文本 */
const getNoticeTypeLabel = (val) => val === NOTICE_TYPE_NOTIFY ? '通知' : '公告';
/** 公告状态 tag 类型 */
const getNoticeStatusTagType = (val) => val === NOTICE_STATUS_PUBLISHED ? 'success' : 'warning';
/** 公告状态文本 */
const getNoticeStatusLabel = (val) => val === NOTICE_STATUS_PUBLISHED ? '已发布' : '已撤回';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 状态
const loading = ref(false);
const noticeData = ref(null);
// 加载公告详情
async function fetchNoticeDetail() {
    if (!props.noticeId)
        return;
    loading.value = true;
    try {
        const res = await getNoticeDetail(props.noticeId);
        noticeData.value = res.data;
    }
    catch (error) {
        console.error('加载公告详情失败', error);
    }
    finally {
        loading.value = false;
    }
}
// 关闭弹窗
function handleClose() {
    noticeData.value = null;
    visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
    if (val) {
        fetchNoticeDetail();
    }
});
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
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "公告详情",
    width: "700px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "公告详情",
    width: "700px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClose: (__VLS_ctx.handleClose)
};
var __VLS_8 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notice-detail" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notice-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "notice-title" },
});
(__VLS_ctx.noticeData?.noticeTitle);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notice-meta" },
});
const __VLS_9 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    type: (__VLS_ctx.getNoticeTypeTagType(__VLS_ctx.noticeData?.noticeType)),
    size: "small",
}));
const __VLS_11 = __VLS_10({
    type: (__VLS_ctx.getNoticeTypeTagType(__VLS_ctx.noticeData?.noticeType)),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
(__VLS_ctx.getNoticeTypeLabel(__VLS_ctx.noticeData?.noticeType));
var __VLS_12;
const __VLS_13 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    type: (__VLS_ctx.getNoticeStatusTagType(__VLS_ctx.noticeData?.status)),
    size: "small",
}));
const __VLS_15 = __VLS_14({
    type: (__VLS_ctx.getNoticeStatusTagType(__VLS_ctx.noticeData?.status)),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
(__VLS_ctx.getNoticeStatusLabel(__VLS_ctx.noticeData?.status));
var __VLS_16;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "create-time" },
});
(__VLS_ctx.noticeData?.createTime);
const __VLS_17 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {[typeof SafeHtml, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(SafeHtml, new SafeHtml({
    html: (__VLS_ctx.noticeData?.noticeContent || ''),
    customClass: "notice-content",
}));
const __VLS_22 = __VLS_21({
    html: (__VLS_ctx.noticeData?.noticeContent || ''),
    customClass: "notice-content",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notice-footer" },
});
if (__VLS_ctx.noticeData?.remark) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.noticeData?.remark);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "create-by" },
});
(__VLS_ctx.noticeData?.createBy);
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_31.slots.default;
    var __VLS_31;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['notice-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-title']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['create-time']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['create-by']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SafeHtml: SafeHtml,
            getNoticeTypeTagType: getNoticeTypeTagType,
            getNoticeTypeLabel: getNoticeTypeLabel,
            getNoticeStatusTagType: getNoticeStatusTagType,
            getNoticeStatusLabel: getNoticeStatusLabel,
            visible: visible,
            loading: loading,
            noticeData: noticeData,
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
//# sourceMappingURL=NoticeDetail.vue.js.map