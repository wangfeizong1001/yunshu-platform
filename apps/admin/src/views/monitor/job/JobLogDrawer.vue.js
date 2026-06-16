import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete } from '@element-plus/icons-vue';
import * as jobApi from '@/api/monitor/job.api';
// 状态常量
const JOB_LOG_STATUS_SUCCESS = '0';
const JOB_LOG_STATUS_FAIL = '1';
const getJobLogStatusTagType = (val) => val === JOB_LOG_STATUS_SUCCESS ? 'success' : 'danger';
const getJobLogStatusLabel = (val) => val === JOB_LOG_STATUS_SUCCESS ? '成功' : '失败';
const props = defineProps();
const emit = defineEmits();
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const dateRange = ref(null);
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    jobName: '',
    jobGroup: '',
    status: '',
    startTime: '',
    endTime: '',
});
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const formatDate = (date) => {
    if (!date)
        return '-';
    return new Date(date).toLocaleString('zh-CN');
};
const handleQuery = async () => {
    if (!props.jobData)
        return;
    loading.value = true;
    try {
        queryParams.value.jobName = props.jobData.jobName;
        queryParams.value.jobGroup = props.jobData.jobGroup;
        if (dateRange.value) {
            queryParams.value.startTime = dateRange.value[0];
            queryParams.value.endTime = dateRange.value[1];
        }
        else {
            queryParams.value.startTime = '';
            queryParams.value.endTime = '';
        }
        const res = await jobApi.getJobLogPage(queryParams.value);
        const responseData = res;
        if (responseData.success) {
            tableData.value = responseData.data;
            const pagination = responseData.pagination;
            total.value = Number(pagination.total) || 0;
        }
    }
    catch (err) {
        console.error('[JobLogDrawer] handleQuery failed:', err);
        ElMessage.error('获取任务日志失败');
    }
    finally {
        loading.value = false;
    }
};
const handleReset = () => {
    queryParams.value.pageNum = 1;
    queryParams.value.pageSize = 10;
    queryParams.value.status = undefined;
    delete queryParams.value.startTime;
    delete queryParams.value.endTime;
    dateRange.value = null;
    handleQuery();
};
const handleClean = async () => {
    try {
        await ElMessageBox.confirm('确认清空该任务的所有日志吗？此操作不可恢复！', '警告', { type: 'warning' });
        await jobApi.cleanJobLog();
        ElMessage.success('清空成功');
        handleQuery();
    }
    catch (err) {
        if (!String(err?.message)?.includes('cancel')) {
            console.error('[JobLogDrawer] handleClean failed:', err);
            ElMessage.error('清空失败，请重试');
        }
    }
};
const handleClose = () => {
    visible.value = false;
};
watch(visible, (val) => {
    if (val) {
        handleQuery();
    }
});
watch(() => props.jobData, () => {
    if (visible.value && props.jobData) {
        handleQuery();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "任务执行日志",
    size: "800px",
    beforeClose: (__VLS_ctx.handleClose),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "任务执行日志",
    size: "800px",
    beforeClose: (__VLS_ctx.handleClose),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    model: (__VLS_ctx.queryParams),
    inline: true,
    ...{ class: "search-form" },
}));
const __VLS_7 = __VLS_6({
    model: (__VLS_ctx.queryParams),
    inline: true,
    ...{ class: "search-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    label: "执行状态",
}));
const __VLS_11 = __VLS_10({
    label: "执行状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: "成功",
    value: "0",
}));
const __VLS_19 = __VLS_18({
    label: "成功",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const __VLS_21 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    label: "失败",
    value: "1",
}));
const __VLS_23 = __VLS_22({
    label: "失败",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
var __VLS_16;
var __VLS_12;
const __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    label: "执行时间",
}));
const __VLS_27 = __VLS_26({
    label: "执行时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_28;
const __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_39 = __VLS_38({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_40.slots.default;
var __VLS_40;
const __VLS_45 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_47 = __VLS_46({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_49;
let __VLS_50;
let __VLS_51;
const __VLS_52 = {
    onClick: (__VLS_ctx.handleReset)
};
__VLS_48.slots.default;
var __VLS_48;
var __VLS_36;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_53 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ 'onClick': {} },
    type: "warning",
    icon: (__VLS_ctx.Delete),
}));
const __VLS_55 = __VLS_54({
    ...{ 'onClick': {} },
    type: "warning",
    icon: (__VLS_ctx.Delete),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_57;
let __VLS_58;
let __VLS_59;
const __VLS_60 = {
    onClick: (__VLS_ctx.handleClean)
};
__VLS_56.slots.default;
var __VLS_56;
const __VLS_61 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    data: (__VLS_ctx.tableData),
    ...{ class: "log-table" },
}));
const __VLS_63 = __VLS_62({
    data: (__VLS_ctx.tableData),
    ...{ class: "log-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_64.slots.default;
const __VLS_65 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "日志ID",
    prop: "logId",
    width: "80",
    align: "center",
}));
const __VLS_67 = __VLS_66({
    label: "日志ID",
    prop: "logId",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const __VLS_69 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "任务名称",
    prop: "jobName",
    width: "140",
    align: "center",
}));
const __VLS_71 = __VLS_70({
    label: "任务名称",
    prop: "jobName",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const __VLS_73 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    label: "调用目标",
    prop: "invokeTarget",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_75 = __VLS_74({
    label: "调用目标",
    prop: "invokeTarget",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const __VLS_77 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "执行状态",
    prop: "status",
    width: "80",
    align: "center",
}));
const __VLS_79 = __VLS_78({
    label: "执行状态",
    prop: "status",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_80.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_81 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        type: (__VLS_ctx.getJobLogStatusTagType(row.status)),
    }));
    const __VLS_83 = __VLS_82({
        type: (__VLS_ctx.getJobLogStatusTagType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    (__VLS_ctx.getJobLogStatusLabel(row.status));
    var __VLS_84;
}
var __VLS_80;
const __VLS_85 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    label: "执行时间",
    prop: "executeTime",
    width: "160",
    align: "center",
}));
const __VLS_87 = __VLS_86({
    label: "执行时间",
    prop: "executeTime",
    width: "160",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_88.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.executeTime));
}
var __VLS_88;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "耗时",
    prop: "costTime",
    width: "100",
    align: "center",
}));
const __VLS_91 = __VLS_90({
    label: "耗时",
    prop: "costTime",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_92.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.costTime);
}
var __VLS_92;
const __VLS_93 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "执行信息",
    prop: "message",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_95 = __VLS_94({
    label: "执行信息",
    prop: "message",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "异常信息",
    prop: "error",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_99 = __VLS_98({
    label: "异常信息",
    prop: "error",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_100.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "error-text" },
        });
        (row.error);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
var __VLS_100;
var __VLS_64;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_101 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_103 = __VLS_102({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_105;
let __VLS_106;
let __VLS_107;
const __VLS_108 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_109 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_104;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['log-table']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Delete: Delete,
            getJobLogStatusTagType: getJobLogStatusTagType,
            getJobLogStatusLabel: getJobLogStatusLabel,
            loading: loading,
            tableData: tableData,
            total: total,
            dateRange: dateRange,
            queryParams: queryParams,
            visible: visible,
            formatDate: formatDate,
            handleQuery: handleQuery,
            handleReset: handleReset,
            handleClean: handleClean,
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
//# sourceMappingURL=JobLogDrawer.vue.js.map