import { ref, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getMessage, markAsRead } from '@/api/system/message.api';
// ========== 状态常量（与后端约定字段值） ==========
const MSG_STATUS_UNREAD = '0';
/** 消息状态 tag 类型 */
const getMsgStatusTagType = (val) => val === MSG_STATUS_UNREAD ? 'warning' : 'info';
/** 消息状态文本 */
const getMsgStatusLabel = (val) => val === MSG_STATUS_UNREAD ? '未读' : '已读';
const props = defineProps();
const emit = defineEmits();
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
const loading = ref(false);
const messageInfo = ref(null);
async function fetchMessageDetail() {
    if (!props.messageId)
        return;
    loading.value = true;
    try {
        const res = await getMessage(props.messageId);
        messageInfo.value = res.data;
    }
    catch (error) {
        console.error('获取消息详情失败:', error);
    }
    finally {
        loading.value = false;
    }
}
function handleClose() {
    visible.value = false;
}
function handleClosed() {
    messageInfo.value = null;
}
async function handleMarkRead() {
    if (!props.messageId)
        return;
    try {
        await markAsRead(props.messageId);
        ElMessage.success('标记成功');
        emit('mark-read', props.messageId);
        await fetchMessageDetail();
    }
    catch (error) {
        console.error('标记失败:', error);
    }
}
watch(() => props.modelValue, (val) => {
    if (val && props.messageId) {
        fetchMessageDetail();
    }
});
function getTypeLabel(type) {
    const labels = {
        system: '系统消息',
        normal: '普通消息',
        reminder: '提醒消息'
    };
    return labels[type] || type;
}
function getTypeTagType(type) {
    const types = {
        system: 'danger',
        normal: 'info',
        reminder: 'warning'
    };
    return types[type] || '';
}
function getPriorityLabel(priority) {
    const labels = {
        high: '高',
        medium: '中',
        low: '低'
    };
    return labels[priority] || priority;
}
function getPriorityTagType(priority) {
    const types = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
    };
    return types[priority] || '';
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
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "消息详情",
    width: "600px",
    closeOnClickModal: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "消息详情",
    width: "600px",
    closeOnClickModal: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClosed: (__VLS_ctx.handleClosed)
};
var __VLS_8 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "message-detail" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.messageInfo) {
    const __VLS_9 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        column: (1),
        border: true,
    }));
    const __VLS_11 = __VLS_10({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    const __VLS_13 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        label: "标题",
    }));
    const __VLS_15 = __VLS_14({
        label: "标题",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-title" },
    });
    if (__VLS_ctx.messageInfo.status === __VLS_ctx.MSG_STATUS_UNREAD) {
        const __VLS_17 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            type: "warning",
            size: "small",
        }));
        const __VLS_19 = __VLS_18({
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_20.slots.default;
        var __VLS_20;
    }
    (__VLS_ctx.messageInfo.title);
    var __VLS_16;
    const __VLS_21 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        label: "类型",
    }));
    const __VLS_23 = __VLS_22({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        type: (__VLS_ctx.getTypeTagType(__VLS_ctx.messageInfo.type)),
    }));
    const __VLS_27 = __VLS_26({
        type: (__VLS_ctx.getTypeTagType(__VLS_ctx.messageInfo.type)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    (__VLS_ctx.getTypeLabel(__VLS_ctx.messageInfo.type));
    var __VLS_28;
    var __VLS_24;
    const __VLS_29 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        label: "优先级",
    }));
    const __VLS_31 = __VLS_30({
        label: "优先级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    const __VLS_33 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        type: (__VLS_ctx.getPriorityTagType(__VLS_ctx.messageInfo.priority)),
    }));
    const __VLS_35 = __VLS_34({
        type: (__VLS_ctx.getPriorityTagType(__VLS_ctx.messageInfo.priority)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    (__VLS_ctx.getPriorityLabel(__VLS_ctx.messageInfo.priority));
    var __VLS_36;
    var __VLS_32;
    const __VLS_37 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        label: "发送人",
    }));
    const __VLS_39 = __VLS_38({
        label: "发送人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    (__VLS_ctx.messageInfo.senderName);
    var __VLS_40;
    const __VLS_41 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        label: "发送时间",
    }));
    const __VLS_43 = __VLS_42({
        label: "发送时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_44.slots.default;
    (__VLS_ctx.messageInfo.sendTime);
    var __VLS_44;
    if (__VLS_ctx.messageInfo.readTime) {
        const __VLS_45 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            label: "阅读时间",
        }));
        const __VLS_47 = __VLS_46({
            label: "阅读时间",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        __VLS_48.slots.default;
        (__VLS_ctx.messageInfo.readTime);
        var __VLS_48;
    }
    const __VLS_49 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        label: "消息内容",
    }));
    const __VLS_51 = __VLS_50({
        label: "消息内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-content" },
    });
    (__VLS_ctx.messageInfo.content);
    var __VLS_52;
    var __VLS_12;
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_53 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_56.slots.default;
    var __VLS_56;
    if (__VLS_ctx.messageInfo && __VLS_ctx.messageInfo.status === __VLS_ctx.MSG_STATUS_UNREAD) {
        const __VLS_61 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_65;
        let __VLS_66;
        let __VLS_67;
        const __VLS_68 = {
            onClick: (__VLS_ctx.handleMarkRead)
        };
        __VLS_64.slots.default;
        var __VLS_64;
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['message-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-title']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MSG_STATUS_UNREAD: MSG_STATUS_UNREAD,
            visible: visible,
            loading: loading,
            messageInfo: messageInfo,
            handleClose: handleClose,
            handleClosed: handleClosed,
            handleMarkRead: handleMarkRead,
            getTypeLabel: getTypeLabel,
            getTypeTagType: getTypeTagType,
            getPriorityLabel: getPriorityLabel,
            getPriorityTagType: getPriorityTagType,
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
//# sourceMappingURL=MessageDetail.vue.js.map