/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete, DocumentChecked, Bell } from '@element-plus/icons-vue';
import { getMessagePage, getUnreadMessageCount, deleteMessage, batchDeleteMessage, markAsRead, markAllAsRead } from '@/api/system/message.api';
import MessageForm from './MessageForm.vue';
import MessageDetail from './MessageDetail.vue';
const loading = ref(false);
const messageList = ref([]);
const total = ref(0);
const unreadCount = ref(0);
const selectedRows = ref([]);
const formVisible = ref(false);
const detailVisible = ref(false);
const currentMessageId = ref(undefined);
const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    title: '',
    type: '',
    status: ''
});
async function fetchMessageList() {
    loading.value = true;
    try {
        const res = await getMessagePage(queryParams);
        messageList.value = res.rows || [];
        total.value = res.total || 0;
    }
    finally {
        loading.value = false;
    }
}
async function fetchUnreadCount() {
    try {
        const count = await getUnreadMessageCount();
        unreadCount.value = count;
    }
    catch (error) {
        console.error('获取未读数量失败:', error);
    }
}
function handleQuery() {
    queryParams.pageNum = 1;
    fetchMessageList();
    fetchUnreadCount();
}
function resetQuery() {
    queryParams.title = '';
    queryParams.type = '';
    queryParams.status = '';
    queryParams.pageNum = 1;
    handleQuery();
}
function refreshTable() {
    fetchMessageList();
    fetchUnreadCount();
}
function handleSend() {
    formVisible.value = true;
}
function handleView(row) {
    currentMessageId.value = row.messageId;
    detailVisible.value = true;
}
async function handleMarkRead(row) {
    try {
        await markAsRead(row.messageId);
        ElMessage.success('标记成功');
        fetchMessageList();
        fetchUnreadCount();
    }
    catch (error) {
        console.error('标记失败:', error);
    }
}
async function handleMarkReadById(messageId) {
    await handleMarkRead({ messageId });
}
async function handleMarkAllRead() {
    try {
        await ElMessageBox.confirm('确定将所有消息标记为已读吗？', '提示', { type: 'warning' });
        await markAllAsRead();
        ElMessage.success('全部标记成功');
        fetchMessageList();
        fetchUnreadCount();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('全部标记失败:', error);
        }
    }
}
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm('确定删除这条消息吗？', '提示', { type: 'warning' });
        await deleteMessage(row.messageId);
        ElMessage.success('删除成功');
        fetchMessageList();
        fetchUnreadCount();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
        }
    }
}
async function handleBatchDelete() {
    try {
        await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 条消息吗？`, '提示', { type: 'warning' });
        await batchDeleteMessage(selectedRows.value.map(row => row.messageId));
        ElMessage.success('批量删除成功');
        fetchMessageList();
        fetchUnreadCount();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error);
        }
    }
}
function handleSelectionChange(selection) {
    selectedRows.value = selection;
}
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
onMounted(() => {
    fetchMessageList();
    fetchUnreadCount();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "message-list" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "search-card" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "search-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    model: (__VLS_ctx.queryParams),
    inline: true,
}));
const __VLS_6 = __VLS_5({
    model: (__VLS_ctx.queryParams),
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "标题",
    prop: "title",
}));
const __VLS_10 = __VLS_9({
    label: "标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.title),
    placeholder: "请输入标题",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.title),
    placeholder: "请输入标题",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onKeyup: (__VLS_ctx.handleQuery)
};
var __VLS_15;
var __VLS_11;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "类型",
    prop: "type",
}));
const __VLS_22 = __VLS_21({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.type),
    placeholder: "请选择类型",
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.type),
    placeholder: "请选择类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "系统消息",
    value: "system",
}));
const __VLS_30 = __VLS_29({
    label: "系统消息",
    value: "system",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "普通消息",
    value: "normal",
}));
const __VLS_34 = __VLS_33({
    label: "普通消息",
    value: "normal",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "提醒消息",
    value: "reminder",
}));
const __VLS_38 = __VLS_37({
    label: "提醒消息",
    value: "reminder",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
var __VLS_23;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "状态",
    prop: "status",
}));
const __VLS_42 = __VLS_41({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "未读",
    value: "0",
}));
const __VLS_50 = __VLS_49({
    label: "未读",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "已读",
    value: "1",
}));
const __VLS_54 = __VLS_53({
    label: "已读",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_47;
var __VLS_43;
const __VLS_56 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_63.slots.default;
var __VLS_63;
const __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_71.slots.default;
var __VLS_71;
var __VLS_59;
var __VLS_7;
var __VLS_3;
const __VLS_76 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_78 = __VLS_77({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_79.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (__VLS_ctx.handleSend)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:message:add']) }, null, null);
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        type: "warning",
        icon: (__VLS_ctx.DocumentChecked),
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        type: "warning",
        icon: (__VLS_ctx.DocumentChecked),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (__VLS_ctx.handleMarkAllRead)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:message:edit']) }, null, null);
    __VLS_91.slots.default;
    var __VLS_91;
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (!__VLS_ctx.selectedRows.length),
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (!__VLS_ctx.selectedRows.length),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (__VLS_ctx.handleBatchDelete)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:message:remove']) }, null, null);
    __VLS_99.slots.default;
    var __VLS_99;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_104 = {}.ElBadge;
    /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        value: (__VLS_ctx.unreadCount),
        ...{ class: "unread-badge" },
    }));
    const __VLS_106 = __VLS_105({
        value: (__VLS_ctx.unreadCount),
        ...{ class: "unread-badge" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Bell),
        circle: true,
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Bell),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (__VLS_ctx.refreshTable)
    };
    var __VLS_111;
    var __VLS_107;
}
const __VLS_116 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.messageList),
    stripe: true,
    border: true,
}));
const __VLS_118 = __VLS_117({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.messageList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_120;
let __VLS_121;
let __VLS_122;
const __VLS_123 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_119.slots.default;
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    type: "selection",
    width: "55",
    fixed: true,
}));
const __VLS_126 = __VLS_125({
    type: "selection",
    width: "55",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "messageId",
    label: "ID",
    width: "80",
}));
const __VLS_130 = __VLS_129({
    prop: "messageId",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "title",
    label: "标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_134 = __VLS_133({
    prop: "title",
    label: "标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "message-title" },
        ...{ class: ({ 'unread': row.status === '0' }) },
    });
    if (row.status === '0') {
        const __VLS_136 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
        const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_139.slots.default;
        const __VLS_140 = {}.CircleCheckFilled;
        /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
        const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
        var __VLS_139;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleView(row);
            } },
    });
    (row.title);
}
var __VLS_135;
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    prop: "type",
    label: "类型",
    width: "100",
}));
const __VLS_146 = __VLS_145({
    prop: "type",
    label: "类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_147.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_148 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        type: (__VLS_ctx.getTypeTagType(row.type)),
    }));
    const __VLS_150 = __VLS_149({
        type: (__VLS_ctx.getTypeTagType(row.type)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    (__VLS_ctx.getTypeLabel(row.type));
    var __VLS_151;
}
var __VLS_147;
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    prop: "priority",
    label: "优先级",
    width: "100",
}));
const __VLS_154 = __VLS_153({
    prop: "priority",
    label: "优先级",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_155.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_156 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        type: (__VLS_ctx.getPriorityTagType(row.priority)),
    }));
    const __VLS_158 = __VLS_157({
        type: (__VLS_ctx.getPriorityTagType(row.priority)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    (__VLS_ctx.getPriorityLabel(row.priority));
    var __VLS_159;
}
var __VLS_155;
const __VLS_160 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    prop: "senderName",
    label: "发送人",
    width: "120",
}));
const __VLS_162 = __VLS_161({
    prop: "senderName",
    label: "发送人",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const __VLS_164 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    prop: "sendTime",
    label: "发送时间",
    width: "180",
}));
const __VLS_166 = __VLS_165({
    prop: "sendTime",
    label: "发送时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "状态",
    width: "80",
}));
const __VLS_170 = __VLS_169({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_171.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_172 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        type: (row.status === '0' ? 'warning' : 'success'),
    }));
    const __VLS_174 = __VLS_173({
        type: (row.status === '0' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    (row.status === '0' ? '未读' : '已读');
    var __VLS_175;
}
var __VLS_171;
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_178 = __VLS_177({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_179.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_180 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_182 = __VLS_181({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    let __VLS_184;
    let __VLS_185;
    let __VLS_186;
    const __VLS_187 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleView(row);
        }
    };
    __VLS_183.slots.default;
    var __VLS_183;
    if (row.status === '0') {
        const __VLS_188 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_190 = __VLS_189({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        let __VLS_192;
        let __VLS_193;
        let __VLS_194;
        const __VLS_195 = {
            onClick: (...[$event]) => {
                if (!(row.status === '0'))
                    return;
                __VLS_ctx.handleMarkRead(row);
            }
        };
        __VLS_191.slots.default;
        var __VLS_191;
    }
    const __VLS_196 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_200;
    let __VLS_201;
    let __VLS_202;
    const __VLS_203 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_199.slots.default;
    var __VLS_199;
}
var __VLS_179;
var __VLS_119;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_204 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_206 = __VLS_205({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
let __VLS_208;
let __VLS_209;
let __VLS_210;
const __VLS_211 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_212 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_207;
var __VLS_79;
/** @type {[typeof MessageForm, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(MessageForm, new MessageForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
}));
const __VLS_214 = __VLS_213({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
let __VLS_216;
let __VLS_217;
let __VLS_218;
const __VLS_219 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_215;
/** @type {[typeof MessageDetail, ]} */ ;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(MessageDetail, new MessageDetail({
    ...{ 'onMarkRead': {} },
    modelValue: (__VLS_ctx.detailVisible),
    messageId: (__VLS_ctx.currentMessageId),
}));
const __VLS_221 = __VLS_220({
    ...{ 'onMarkRead': {} },
    modelValue: (__VLS_ctx.detailVisible),
    messageId: (__VLS_ctx.currentMessageId),
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
let __VLS_223;
let __VLS_224;
let __VLS_225;
const __VLS_226 = {
    onMarkRead: (__VLS_ctx.handleMarkReadById)
};
var __VLS_222;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['unread-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['message-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            Delete: Delete,
            DocumentChecked: DocumentChecked,
            Bell: Bell,
            MessageForm: MessageForm,
            MessageDetail: MessageDetail,
            loading: loading,
            messageList: messageList,
            total: total,
            unreadCount: unreadCount,
            selectedRows: selectedRows,
            formVisible: formVisible,
            detailVisible: detailVisible,
            currentMessageId: currentMessageId,
            queryParams: queryParams,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleSend: handleSend,
            handleView: handleView,
            handleMarkRead: handleMarkRead,
            handleMarkReadById: handleMarkReadById,
            handleMarkAllRead: handleMarkAllRead,
            handleDelete: handleDelete,
            handleBatchDelete: handleBatchDelete,
            handleSelectionChange: handleSelectionChange,
            getTypeLabel: getTypeLabel,
            getTypeTagType: getTypeTagType,
            getPriorityLabel: getPriorityLabel,
            getPriorityTagType: getPriorityTagType,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MessageList.vue.js.map