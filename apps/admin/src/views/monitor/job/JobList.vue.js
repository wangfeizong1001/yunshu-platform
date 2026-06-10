import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete, Plus } from '@element-plus/icons-vue';
import * as jobApi from '@/api/monitor/job.api';
import JobForm from './JobForm.vue';
import JobLogDrawer from './JobLogDrawer.vue';
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const selectedIds = ref([]);
const formVisible = ref(false);
const logDrawerVisible = ref(false);
const currentJob = ref(null);
const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
});
const getGroupName = (group) => {
    const map = {
        default: '默认',
        system: '系统',
        custom: '自定义',
    };
    return map[group] || group;
};
const getMisfirePolicyName = (policy) => {
    const map = {
        '0': '默认策略',
        '1': '立即执行',
        '2': '执行一次',
    };
    return map[policy] || policy;
};
const getMisfirePolicyType = (policy) => {
    const map = {
        '0': 'info',
        '1': 'success',
        '2': 'warning',
    };
    return map[policy];
};
const formatDate = (date) => {
    if (!date)
        return '-';
    return new Date(date).toLocaleString('zh-CN');
};
const handleQuery = async () => {
    loading.value = true;
    try {
        const res = await jobApi.getJobPage(queryParams);
        const responseData = res;
        if (responseData.success) {
            tableData.value = responseData.data;
            const pagination = responseData.pagination;
            total.value = Number(pagination.total) || 0;
        }
    }
    catch {
        ElMessage.error('获取定时任务失败');
    }
    finally {
        loading.value = false;
    }
};
const handleReset = () => {
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    queryParams.jobName = undefined;
    queryParams.jobGroup = undefined;
    queryParams.status = undefined;
    handleQuery();
};
const handleRefresh = () => {
    handleQuery();
};
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map((item) => item.jobId);
};
const handleAdd = () => {
    currentJob.value = null;
    formVisible.value = true;
};
const handleEdit = (row) => {
    currentJob.value = row;
    formVisible.value = true;
};
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除该任务吗？', '提示', { type: 'warning' });
        await jobApi.deleteJob(row.jobId);
        ElMessage.success('删除成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个任务吗？`, '提示', { type: 'warning' });
        for (const id of selectedIds.value) {
            await jobApi.deleteJob(Number(id));
        }
        ElMessage.success('删除成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleStatusChange = async (row) => {
    try {
        await jobApi.changeJobStatus(Number(row.jobId), row.status);
        ElMessage.success(row.status === '0' ? '任务已启用' : '任务已暂停');
    }
    catch {
        ElMessage.error('状态修改失败');
    }
};
const handleExecute = async (row) => {
    try {
        await ElMessageBox.confirm(`确认立即执行任务"${row.jobName}"吗？`, '提示', { type: 'warning' });
        await jobApi.runJob(row.jobId);
        ElMessage.success('任务执行成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleViewLog = (row) => {
    currentJob.value = row;
    logDrawerVisible.value = true;
};
onMounted(() => {
    handleQuery();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "search-card" },
}));
const __VLS_2 = __VLS_1({
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
    label: "任务名称",
}));
const __VLS_10 = __VLS_9({
    label: "任务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.queryParams.jobName),
    placeholder: "请输入任务名称",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.queryParams.jobName),
    placeholder: "请输入任务名称",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "任务分组",
}));
const __VLS_18 = __VLS_17({
    label: "任务分组",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.queryParams.jobGroup),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.queryParams.jobGroup),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "默认",
    value: "default",
}));
const __VLS_26 = __VLS_25({
    label: "默认",
    value: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "系统",
    value: "system",
}));
const __VLS_30 = __VLS_29({
    label: "系统",
    value: "system",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "自定义",
    value: "custom",
}));
const __VLS_34 = __VLS_33({
    label: "自定义",
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_23;
var __VLS_19;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "任务状态",
}));
const __VLS_38 = __VLS_37({
    label: "任务状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "正常",
    value: "0",
}));
const __VLS_46 = __VLS_45({
    label: "正常",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "暂停",
    value: "1",
}));
const __VLS_50 = __VLS_49({
    label: "暂停",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "删除",
    value: "2",
}));
const __VLS_54 = __VLS_53({
    label: "删除",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_43;
var __VLS_39;
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
    onClick: (__VLS_ctx.handleReset)
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
    ...{ class: "toolbar-card" },
}));
const __VLS_78 = __VLS_77({
    ...{ class: "toolbar-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
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
    onClick: (__VLS_ctx.handleAdd)
};
__VLS_83.slots.default;
var __VLS_83;
const __VLS_88 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Delete),
    disabled: (__VLS_ctx.selectedIds.length === 0),
}));
const __VLS_90 = __VLS_89({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Delete),
    disabled: (__VLS_ctx.selectedIds.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
    onClick: (__VLS_ctx.handleBatchDelete)
};
__VLS_91.slots.default;
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_96 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}));
const __VLS_98 = __VLS_97({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onClick: (__VLS_ctx.handleRefresh)
};
var __VLS_99;
var __VLS_79;
const __VLS_104 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "table-card" },
}));
const __VLS_106 = __VLS_105({
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
}));
const __VLS_110 = __VLS_109({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_112;
let __VLS_113;
let __VLS_114;
const __VLS_115 = {
    onSelectionChange: ((selection) => __VLS_ctx.handleSelectionChange(selection))
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_111.slots.default;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    type: "selection",
    width: "50",
    align: "center",
}));
const __VLS_118 = __VLS_117({
    type: "selection",
    width: "50",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "任务ID",
    prop: "jobId",
    width: "80",
    align: "center",
}));
const __VLS_122 = __VLS_121({
    label: "任务ID",
    prop: "jobId",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "任务名称",
    prop: "jobName",
    width: "140",
    align: "center",
}));
const __VLS_126 = __VLS_125({
    label: "任务名称",
    prop: "jobName",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "任务分组",
    prop: "jobGroup",
    width: "100",
    align: "center",
}));
const __VLS_130 = __VLS_129({
    label: "任务分组",
    prop: "jobGroup",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_132 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.getGroupName(row.jobGroup));
    var __VLS_135;
}
var __VLS_131;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "调用目标",
    prop: "invokeTarget",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_138 = __VLS_137({
    label: "调用目标",
    prop: "invokeTarget",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "cron表达式",
    prop: "cronExpression",
    width: "140",
    align: "center",
}));
const __VLS_142 = __VLS_141({
    label: "cron表达式",
    prop: "cronExpression",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "执行策略",
    prop: "misfirePolicy",
    width: "100",
    align: "center",
}));
const __VLS_146 = __VLS_145({
    label: "执行策略",
    prop: "misfirePolicy",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_147.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_148 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        type: (__VLS_ctx.getMisfirePolicyType(row.misfirePolicy)),
    }));
    const __VLS_150 = __VLS_149({
        type: (__VLS_ctx.getMisfirePolicyType(row.misfirePolicy)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    (__VLS_ctx.getMisfirePolicyName(row.misfirePolicy));
    var __VLS_151;
}
var __VLS_147;
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "并发执行",
    prop: "concurrent",
    width: "100",
    align: "center",
}));
const __VLS_154 = __VLS_153({
    label: "并发执行",
    prop: "concurrent",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_155.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_156 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        type: (row.concurrent === '0' ? 'success' : 'warning'),
    }));
    const __VLS_158 = __VLS_157({
        type: (row.concurrent === '0' ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    (row.concurrent === '0' ? '允许' : '禁止');
    var __VLS_159;
}
var __VLS_155;
const __VLS_160 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "状态",
    prop: "status",
    width: "80",
    align: "center",
}));
const __VLS_162 = __VLS_161({
    label: "状态",
    prop: "status",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_163.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_164 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: "0",
        inactiveValue: "1",
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onChange': {} },
        modelValue: (row.status),
        activeValue: "0",
        inactiveValue: "1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onChange: (...[$event]) => {
            __VLS_ctx.handleStatusChange(row);
        }
    };
    var __VLS_167;
}
var __VLS_163;
const __VLS_172 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "下次执行",
    prop: "nextValidTime",
    width: "160",
    align: "center",
}));
const __VLS_174 = __VLS_173({
    label: "下次执行",
    prop: "nextValidTime",
    width: "160",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_175.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.nextValidTime));
}
var __VLS_175;
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "最后执行",
    prop: "lastRunTime",
    width: "160",
    align: "center",
}));
const __VLS_178 = __VLS_177({
    label: "最后执行",
    prop: "lastRunTime",
    width: "160",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_179.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.lastRunTime));
}
var __VLS_179;
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "执行次数",
    prop: "runCount",
    width: "100",
    align: "center",
}));
const __VLS_182 = __VLS_181({
    label: "执行次数",
    prop: "runCount",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "操作",
    width: "200",
    align: "center",
    fixed: "right",
}));
const __VLS_186 = __VLS_185({
    label: "操作",
    width: "200",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_187.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_188 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_190 = __VLS_189({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    let __VLS_192;
    let __VLS_193;
    let __VLS_194;
    const __VLS_195 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleExecute(row);
        }
    };
    __VLS_191.slots.default;
    var __VLS_191;
    const __VLS_196 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_200;
    let __VLS_201;
    let __VLS_202;
    const __VLS_203 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleViewLog(row);
        }
    };
    __VLS_199.slots.default;
    var __VLS_199;
    const __VLS_204 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_206 = __VLS_205({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    let __VLS_208;
    let __VLS_209;
    let __VLS_210;
    const __VLS_211 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_207.slots.default;
    var __VLS_207;
    const __VLS_212 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_214 = __VLS_213({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    let __VLS_216;
    let __VLS_217;
    let __VLS_218;
    const __VLS_219 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_215.slots.default;
    var __VLS_215;
}
var __VLS_187;
var __VLS_111;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_220 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_222 = __VLS_221({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
let __VLS_224;
let __VLS_225;
let __VLS_226;
const __VLS_227 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_228 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_223;
var __VLS_107;
/** @type {[typeof JobForm, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(JobForm, new JobForm({
    ...{ 'onSuccess': {} },
    modelValue: (__VLS_ctx.formVisible),
    jobData: __VLS_ctx.currentJob,
}));
const __VLS_230 = __VLS_229({
    ...{ 'onSuccess': {} },
    modelValue: (__VLS_ctx.formVisible),
    jobData: __VLS_ctx.currentJob,
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
let __VLS_232;
let __VLS_233;
let __VLS_234;
const __VLS_235 = {
    onSuccess: (__VLS_ctx.handleQuery)
};
var __VLS_231;
/** @type {[typeof JobLogDrawer, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(JobLogDrawer, new JobLogDrawer({
    modelValue: (__VLS_ctx.logDrawerVisible),
    jobData: (__VLS_ctx.currentJob),
}));
const __VLS_237 = __VLS_236({
    modelValue: (__VLS_ctx.logDrawerVisible),
    jobData: (__VLS_ctx.currentJob),
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-card']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Delete: Delete,
            Plus: Plus,
            JobForm: JobForm,
            JobLogDrawer: JobLogDrawer,
            loading: loading,
            tableData: tableData,
            total: total,
            selectedIds: selectedIds,
            formVisible: formVisible,
            logDrawerVisible: logDrawerVisible,
            currentJob: currentJob,
            queryParams: queryParams,
            getGroupName: getGroupName,
            getMisfirePolicyName: getMisfirePolicyName,
            getMisfirePolicyType: getMisfirePolicyType,
            formatDate: formatDate,
            handleQuery: handleQuery,
            handleReset: handleReset,
            handleRefresh: handleRefresh,
            handleSelectionChange: handleSelectionChange,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            handleBatchDelete: handleBatchDelete,
            handleStatusChange: handleStatusChange,
            handleExecute: handleExecute,
            handleViewLog: handleViewLog,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=JobList.vue.js.map