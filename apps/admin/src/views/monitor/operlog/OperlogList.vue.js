import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
import * as operlogApi from '@/api/monitor/operlog.api';
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const selectedIds = ref([]);
const dateRange = ref(null);
const detailVisible = ref(false);
const currentRow = ref(null);
const queryParams = reactive({
    page: 1,
    limit: 10,
    sort: 'operTime',
    order: 'desc',
});
const getOperTypeTagType = (type) => {
    const map = {
        查询: 'info',
        新增: 'success',
        修改: 'warning',
        删除: 'danger',
        导出: 'primary',
        导入: 'success',
    };
    return map[type] || 'info';
};
const formatDate = (date) => {
    if (!date)
        return '-';
    return new Date(date).toLocaleString('zh-CN');
};
const formatJson = (str) => {
    if (!str)
        return '-';
    try {
        return JSON.stringify(JSON.parse(str), null, 2);
    }
    catch {
        return str;
    }
};
const handleQuery = async () => {
    loading.value = true;
    try {
        if (dateRange.value) {
            queryParams.beginTime = dateRange.value[0];
            queryParams.endTime = dateRange.value[1];
        }
        else {
            delete queryParams.beginTime;
            delete queryParams.endTime;
        }
        const res = await operlogApi.getOperlogPage(queryParams);
        if (res.success) {
            tableData.value = res.data || [];
            total.value = res.pagination?.total || 0;
        }
    }
    catch {
        ElMessage.error('获取操作日志失败');
    }
    finally {
        loading.value = false;
    }
};
const handleReset = () => {
    queryParams.page = 1;
    queryParams.limit = 10;
    queryParams.operName = undefined;
    queryParams.operType = undefined;
    queryParams.operModule = undefined;
    queryParams.status = undefined;
    delete queryParams.beginTime;
    delete queryParams.endTime;
    dateRange.value = null;
    handleQuery();
};
const handleRefresh = () => {
    handleQuery();
};
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map((item) => item.operId);
};
const handleSortChange = ({ prop, order }) => {
    queryParams.sort = prop || 'operTime';
    queryParams.order = order === 'ascending' ? 'asc' : 'desc';
    handleQuery();
};
const handleViewDetail = (row) => {
    currentRow.value = row;
    detailVisible.value = true;
};
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除该操作日志吗？', '提示', { type: 'warning' });
        await operlogApi.deleteOperlog(Number(row.operId));
        ElMessage.success('删除成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条操作日志吗？`, '提示', { type: 'warning' });
        await operlogApi.batchDeleteOperlog(selectedIds.value.map(id => Number(id)));
        ElMessage.success('删除成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleClean = async () => {
    try {
        await ElMessageBox.confirm('确认清空所有操作日志吗？此操作不可恢复！', '警告', { type: 'warning' });
        await operlogApi.cleanOperlog();
        ElMessage.success('清空成功');
        handleQuery();
    }
    catch {
        // 用户取消
    }
};
const handleExport = () => {
    // 导出功能暂时注释
    // operlogApi.exportOperlog(queryParams)
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
    label: "操作人",
}));
const __VLS_10 = __VLS_9({
    label: "操作人",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.queryParams.operName),
    placeholder: "请输入操作人",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.queryParams.operName),
    placeholder: "请输入操作人",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "操作类型",
}));
const __VLS_18 = __VLS_17({
    label: "操作类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.queryParams.operType),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.queryParams.operType),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "查询",
    value: "查询",
}));
const __VLS_26 = __VLS_25({
    label: "查询",
    value: "查询",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "新增",
    value: "新增",
}));
const __VLS_30 = __VLS_29({
    label: "新增",
    value: "新增",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "修改",
    value: "修改",
}));
const __VLS_34 = __VLS_33({
    label: "修改",
    value: "修改",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "删除",
    value: "删除",
}));
const __VLS_38 = __VLS_37({
    label: "删除",
    value: "删除",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "导出",
    value: "导出",
}));
const __VLS_42 = __VLS_41({
    label: "导出",
    value: "导出",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "导入",
    value: "导入",
}));
const __VLS_46 = __VLS_45({
    label: "导入",
    value: "导入",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_23;
var __VLS_19;
const __VLS_48 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "操作模块",
}));
const __VLS_50 = __VLS_49({
    label: "操作模块",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.queryParams.operModule),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.queryParams.operModule),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "用户管理",
    value: "用户管理",
}));
const __VLS_58 = __VLS_57({
    label: "用户管理",
    value: "用户管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "角色管理",
    value: "角色管理",
}));
const __VLS_62 = __VLS_61({
    label: "角色管理",
    value: "角色管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "菜单管理",
    value: "菜单管理",
}));
const __VLS_66 = __VLS_65({
    label: "菜单管理",
    value: "菜单管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "部门管理",
    value: "部门管理",
}));
const __VLS_70 = __VLS_69({
    label: "部门管理",
    value: "部门管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "岗位管理",
    value: "岗位管理",
}));
const __VLS_74 = __VLS_73({
    label: "岗位管理",
    value: "岗位管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
var __VLS_55;
var __VLS_51;
const __VLS_76 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "操作状态",
}));
const __VLS_78 = __VLS_77({
    label: "操作状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "成功",
    value: "0",
}));
const __VLS_86 = __VLS_85({
    label: "成功",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "失败",
    value: "1",
}));
const __VLS_90 = __VLS_89({
    label: "失败",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_83;
var __VLS_79;
const __VLS_92 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "操作时间",
}));
const __VLS_94 = __VLS_93({
    label: "操作时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}));
const __VLS_98 = __VLS_97({
    modelValue: (__VLS_ctx.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_95;
const __VLS_100 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_106 = __VLS_105({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_107.slots.default;
var __VLS_107;
const __VLS_112 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_116;
let __VLS_117;
let __VLS_118;
const __VLS_119 = {
    onClick: (__VLS_ctx.handleReset)
};
__VLS_115.slots.default;
var __VLS_115;
var __VLS_103;
var __VLS_7;
var __VLS_3;
const __VLS_120 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ class: "toolbar-card" },
}));
const __VLS_122 = __VLS_121({
    ...{ class: "toolbar-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
});
const __VLS_124 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Delete),
    disabled: (__VLS_ctx.selectedIds.length === 0),
}));
const __VLS_126 = __VLS_125({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Delete),
    disabled: (__VLS_ctx.selectedIds.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_128;
let __VLS_129;
let __VLS_130;
const __VLS_131 = {
    onClick: (__VLS_ctx.handleBatchDelete)
};
__VLS_127.slots.default;
var __VLS_127;
const __VLS_132 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ 'onClick': {} },
    type: "warning",
    icon: (__VLS_ctx.Delete),
}));
const __VLS_134 = __VLS_133({
    ...{ 'onClick': {} },
    type: "warning",
    icon: (__VLS_ctx.Delete),
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onClick: (__VLS_ctx.handleClean)
};
__VLS_135.slots.default;
var __VLS_135;
const __VLS_140 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}));
const __VLS_142 = __VLS_141({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_144;
let __VLS_145;
let __VLS_146;
const __VLS_147 = {
    onClick: (__VLS_ctx.handleExport)
};
__VLS_143.slots.default;
var __VLS_143;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_148 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}));
const __VLS_150 = __VLS_149({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
let __VLS_152;
let __VLS_153;
let __VLS_154;
const __VLS_155 = {
    onClick: (__VLS_ctx.handleRefresh)
};
var __VLS_151;
var __VLS_123;
const __VLS_156 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    ...{ class: "table-card" },
}));
const __VLS_158 = __VLS_157({
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.tableData),
}));
const __VLS_162 = __VLS_161({
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.tableData),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
const __VLS_168 = {
    onSortChange: (__VLS_ctx.handleSortChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_163.slots.default;
const __VLS_169 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    type: "selection",
    width: "50",
    align: "center",
}));
const __VLS_171 = __VLS_170({
    type: "selection",
    width: "50",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const __VLS_173 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    label: "日志编号",
    prop: "operId",
    width: "80",
    align: "center",
}));
const __VLS_175 = __VLS_174({
    label: "日志编号",
    prop: "operId",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
const __VLS_177 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
    label: "操作人",
    prop: "operName",
    width: "100",
    align: "center",
}));
const __VLS_179 = __VLS_178({
    label: "操作人",
    prop: "operName",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
const __VLS_181 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    label: "操作时间",
    prop: "operTime",
    width: "180",
    align: "center",
    sortable: "custom",
}));
const __VLS_183 = __VLS_182({
    label: "操作时间",
    prop: "operTime",
    width: "180",
    align: "center",
    sortable: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_184.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.operTime));
}
var __VLS_184;
const __VLS_185 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    label: "操作类型",
    prop: "operType",
    width: "100",
    align: "center",
}));
const __VLS_187 = __VLS_186({
    label: "操作类型",
    prop: "operType",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
__VLS_188.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_188.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_189 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
    }));
    const __VLS_191 = __VLS_190({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    __VLS_192.slots.default;
    (row.operType);
    var __VLS_192;
}
var __VLS_188;
const __VLS_193 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    label: "操作模块",
    prop: "operModule",
    width: "120",
    align: "center",
}));
const __VLS_195 = __VLS_194({
    label: "操作模块",
    prop: "operModule",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
const __VLS_197 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "操作状态",
    prop: "status",
    width: "80",
    align: "center",
}));
const __VLS_199 = __VLS_198({
    label: "操作状态",
    prop: "status",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_200.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_201 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
        type: (row.status === '0' ? 'success' : 'danger'),
    }));
    const __VLS_203 = __VLS_202({
        type: (row.status === '0' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    __VLS_204.slots.default;
    (row.status === '0' ? '成功' : '失败');
    var __VLS_204;
}
var __VLS_200;
const __VLS_205 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    label: "请求方法",
    prop: "requestMethod",
    width: "100",
    align: "center",
}));
const __VLS_207 = __VLS_206({
    label: "请求方法",
    prop: "requestMethod",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_208.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_209 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({}));
    const __VLS_211 = __VLS_210({}, ...__VLS_functionalComponentArgsRest(__VLS_210));
    __VLS_212.slots.default;
    (row.requestMethod);
    var __VLS_212;
}
var __VLS_208;
const __VLS_213 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    label: "操作地址",
    prop: "operUrl",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_215 = __VLS_214({
    label: "操作地址",
    prop: "operUrl",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const __VLS_217 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    label: "操作IP",
    prop: "operIp",
    width: "140",
    align: "center",
}));
const __VLS_219 = __VLS_218({
    label: "操作IP",
    prop: "operIp",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
const __VLS_221 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    label: "耗时",
    prop: "costTime",
    width: "100",
    align: "center",
}));
const __VLS_223 = __VLS_222({
    label: "耗时",
    prop: "costTime",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
__VLS_224.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_224.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.costTime);
}
var __VLS_224;
const __VLS_225 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
}));
const __VLS_227 = __VLS_226({
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_228.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_229 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_231 = __VLS_230({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    let __VLS_233;
    let __VLS_234;
    let __VLS_235;
    const __VLS_236 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleViewDetail(row);
        }
    };
    __VLS_232.slots.default;
    var __VLS_232;
    const __VLS_237 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_239 = __VLS_238({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    let __VLS_241;
    let __VLS_242;
    let __VLS_243;
    const __VLS_244 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_240.slots.default;
    var __VLS_240;
}
var __VLS_228;
var __VLS_163;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_245 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.page),
    pageSize: (__VLS_ctx.queryParams.limit),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_247 = __VLS_246({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.page),
    pageSize: (__VLS_ctx.queryParams.limit),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
let __VLS_249;
let __VLS_250;
let __VLS_251;
const __VLS_252 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_253 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_248;
var __VLS_159;
const __VLS_254 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    modelValue: (__VLS_ctx.detailVisible),
    title: "操作日志详情",
    width: "700px",
    destroyOnClose: true,
}));
const __VLS_256 = __VLS_255({
    modelValue: (__VLS_ctx.detailVisible),
    title: "操作日志详情",
    width: "700px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
const __VLS_258 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    column: (2),
    border: true,
}));
const __VLS_260 = __VLS_259({
    column: (2),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
__VLS_261.slots.default;
const __VLS_262 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
    label: "日志编号",
}));
const __VLS_264 = __VLS_263({
    label: "日志编号",
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
__VLS_265.slots.default;
(__VLS_ctx.currentRow?.operId);
var __VLS_265;
const __VLS_266 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
    label: "操作人",
}));
const __VLS_268 = __VLS_267({
    label: "操作人",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
__VLS_269.slots.default;
(__VLS_ctx.currentRow?.operName);
var __VLS_269;
const __VLS_270 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
    label: "操作时间",
}));
const __VLS_272 = __VLS_271({
    label: "操作时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_273.slots.default;
(__VLS_ctx.formatDate(__VLS_ctx.currentRow?.operTime));
var __VLS_273;
const __VLS_274 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
    label: "操作类型",
}));
const __VLS_276 = __VLS_275({
    label: "操作类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
__VLS_277.slots.default;
const __VLS_278 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
    type: (__VLS_ctx.getOperTypeTagType(__VLS_ctx.currentRow?.operType || '')),
}));
const __VLS_280 = __VLS_279({
    type: (__VLS_ctx.getOperTypeTagType(__VLS_ctx.currentRow?.operType || '')),
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
__VLS_281.slots.default;
(__VLS_ctx.currentRow?.operType);
var __VLS_281;
var __VLS_277;
const __VLS_282 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
    label: "操作模块",
}));
const __VLS_284 = __VLS_283({
    label: "操作模块",
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
__VLS_285.slots.default;
(__VLS_ctx.currentRow?.operModule);
var __VLS_285;
const __VLS_286 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
    label: "操作状态",
}));
const __VLS_288 = __VLS_287({
    label: "操作状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
__VLS_289.slots.default;
const __VLS_290 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    type: (__VLS_ctx.currentRow?.status === '0' ? 'success' : 'danger'),
}));
const __VLS_292 = __VLS_291({
    type: (__VLS_ctx.currentRow?.status === '0' ? 'success' : 'danger'),
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
__VLS_293.slots.default;
(__VLS_ctx.currentRow?.status === '0' ? '成功' : '失败');
var __VLS_293;
var __VLS_289;
const __VLS_294 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    label: "请求方法",
}));
const __VLS_296 = __VLS_295({
    label: "请求方法",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
__VLS_297.slots.default;
(__VLS_ctx.currentRow?.requestMethod);
var __VLS_297;
const __VLS_298 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
    label: "操作地址",
    span: (2),
}));
const __VLS_300 = __VLS_299({
    label: "操作地址",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
__VLS_301.slots.default;
(__VLS_ctx.currentRow?.operUrl);
var __VLS_301;
const __VLS_302 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
    label: "操作IP",
}));
const __VLS_304 = __VLS_303({
    label: "操作IP",
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
__VLS_305.slots.default;
(__VLS_ctx.currentRow?.operIp);
var __VLS_305;
const __VLS_306 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
    label: "操作系统",
}));
const __VLS_308 = __VLS_307({
    label: "操作系统",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_309.slots.default;
(__VLS_ctx.currentRow?.operSystem);
var __VLS_309;
const __VLS_310 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    label: "浏览器",
}));
const __VLS_312 = __VLS_311({
    label: "浏览器",
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
__VLS_313.slots.default;
(__VLS_ctx.currentRow?.browser);
var __VLS_313;
const __VLS_314 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    label: "操作地点",
}));
const __VLS_316 = __VLS_315({
    label: "操作地点",
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
__VLS_317.slots.default;
(__VLS_ctx.currentRow?.operLocation);
var __VLS_317;
const __VLS_318 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    label: "耗时",
}));
const __VLS_320 = __VLS_319({
    label: "耗时",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
(__VLS_ctx.currentRow?.costTime);
var __VLS_321;
const __VLS_322 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    label: "操作参数",
    span: (2),
}));
const __VLS_324 = __VLS_323({
    label: "操作参数",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
__VLS_325.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ style: {} },
});
(__VLS_ctx.formatJson(__VLS_ctx.currentRow?.operParam));
var __VLS_325;
const __VLS_326 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    label: "返回结果",
    span: (2),
}));
const __VLS_328 = __VLS_327({
    label: "返回结果",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_329.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ style: {} },
});
(__VLS_ctx.formatJson(__VLS_ctx.currentRow?.jsonResult));
var __VLS_329;
var __VLS_261;
var __VLS_257;
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
            Download: Download,
            loading: loading,
            tableData: tableData,
            total: total,
            selectedIds: selectedIds,
            dateRange: dateRange,
            detailVisible: detailVisible,
            currentRow: currentRow,
            queryParams: queryParams,
            getOperTypeTagType: getOperTypeTagType,
            formatDate: formatDate,
            formatJson: formatJson,
            handleQuery: handleQuery,
            handleReset: handleReset,
            handleRefresh: handleRefresh,
            handleSelectionChange: handleSelectionChange,
            handleSortChange: handleSortChange,
            handleViewDetail: handleViewDetail,
            handleDelete: handleDelete,
            handleBatchDelete: handleBatchDelete,
            handleClean: handleClean,
            handleExport: handleExport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=OperlogList.vue.js.map