/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getReportPage, addReport, updateReport, deleteReport, batchDeleteReport, exportReport, getReportData } from '@/api/report.api';
import { exportToExcel } from '@/utils/export';
const router = useRouter();
// 状态
const loading = ref(false);
const submitLoading = ref(false);
const exportLoading = ref(false);
const reportList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const dialogVisible = ref(false);
const exportDialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const currentReport = ref(null);
const exportFormat = ref('excel');
// 查询参数
const queryParams = reactive({
    reportName: '',
    reportType: '',
    status: '',
    pageNum: 1,
    pageSize: 10
});
// 表单数据
const formData = reactive({
    reportName: '',
    reportCode: '',
    reportType: 'chart',
    description: '',
    status: '0',
    remark: ''
});
// 表单验证规则
const formRules = {
    reportName: [{ required: true, message: '请输入报表名称', trigger: 'blur' }],
    reportCode: [
        { required: true, message: '请输入报表编码', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '报表编码只能包含字母、数字和下划线', trigger: 'blur' }
    ],
    reportType: [{ required: true, message: '请选择报表类型', trigger: 'change' }]
};
// 加载报表列表
async function fetchReportList() {
    loading.value = true;
    try {
        const res = await getReportPage(queryParams);
        reportList.value = res.rows;
        total.value = res.total;
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    queryParams.pageNum = 1;
    fetchReportList();
}
// 重置查询
function resetQuery() {
    queryParams.reportName = '';
    queryParams.reportType = '';
    queryParams.status = '';
    queryParams.pageNum = 1;
    handleQuery();
}
// 刷新表格
function refreshTable() {
    fetchReportList();
}
// 新增
function handleAdd() {
    isEdit.value = false;
    Object.assign(formData, {
        reportName: '',
        reportCode: '',
        reportType: 'chart',
        description: '',
        status: '0',
        remark: ''
    });
    dialogVisible.value = true;
}
// 编辑
function handleEdit(row) {
    router.push(`/report/design/${row.reportId}`);
}
// 查看
function handleView(row) {
    router.push(`/report/view/${row.reportId}`);
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除报表"${row.reportName}"？`, '提示', {
            type: 'warning'
        });
        await deleteReport(row.reportId);
        ElMessage.success('删除成功');
        fetchReportList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
        }
    }
}
// 批量删除
async function handleBatchDelete() {
    try {
        await ElMessageBox.confirm(`是否确认删除选中的 ${selectedRows.value.length} 个报表？`, '提示', {
            type: 'warning'
        });
        const ids = selectedRows.value.map(item => item.reportId);
        await batchDeleteReport(ids);
        ElMessage.success('删除成功');
        fetchReportList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
        }
    }
}
// 导出
function handleExport(row) {
    currentReport.value = row;
    exportFormat.value = 'excel';
    exportDialogVisible.value = true;
}
// 确认导出
async function handleConfirmExport() {
    if (!currentReport.value)
        return;
    exportLoading.value = true;
    try {
        // 获取报表数据
        const dataRes = await getReportData({ reportId: currentReport.value.reportId });
        const reportData = dataRes.data;
        if (reportData && reportData.data) {
            if (exportFormat.value === 'excel') {
                exportToExcel(reportData.data, currentReport.value.reportName);
            }
            else if (exportFormat.value === 'pdf') {
                // 使用 API 导出
                await exportReport(currentReport.value.reportId, 'pdf');
            }
            ElMessage.success('导出成功');
        }
        else {
            ElMessage.warning('报表数据为空');
        }
        exportDialogVisible.value = false;
    }
    catch (error) {
        console.error('导出失败:', error);
        ElMessage.error('导出失败');
    }
    finally {
        exportLoading.value = false;
    }
}
// 提交
async function handleSubmit() {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitLoading.value = true;
            try {
                if (isEdit.value && formData.reportId) {
                    await updateReport(formData);
                    ElMessage.success('修改成功');
                }
                else {
                    await addReport(formData);
                    ElMessage.success('新增成功');
                }
                dialogVisible.value = false;
                fetchReportList();
            }
            catch (error) {
                console.error('操作失败:', error);
            }
            finally {
                submitLoading.value = false;
            }
        }
    });
}
// 选择变化
function handleSelectionChange(selection) {
    selectedRows.value = selection;
}
// 初始化
onMounted(() => {
    fetchReportList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-list" },
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
    label: "报表名称",
    prop: "reportName",
}));
const __VLS_10 = __VLS_9({
    label: "报表名称",
    prop: "reportName",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.reportName),
    placeholder: "请输入报表名称",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.reportName),
    placeholder: "请输入报表名称",
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
    label: "报表类型",
    prop: "reportType",
}));
const __VLS_22 = __VLS_21({
    label: "报表类型",
    prop: "reportType",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.reportType),
    placeholder: "请选择报表类型",
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.reportType),
    placeholder: "请选择报表类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "图表",
    value: "chart",
}));
const __VLS_30 = __VLS_29({
    label: "图表",
    value: "chart",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "表格",
    value: "table",
}));
const __VLS_34 = __VLS_33({
    label: "表格",
    value: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
var __VLS_23;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "状态",
    prop: "status",
}));
const __VLS_38 = __VLS_37({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
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
    label: "停用",
    value: "1",
}));
const __VLS_50 = __VLS_49({
    label: "停用",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_43;
var __VLS_39;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_67.slots.default;
var __VLS_67;
var __VLS_55;
var __VLS_7;
var __VLS_3;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_74 = __VLS_73({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_75.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_76 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (__VLS_ctx.handleAdd)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:add']) }, null, null);
    __VLS_79.slots.default;
    var __VLS_79;
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (__VLS_ctx.selectedRows.length === 0),
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (__VLS_ctx.selectedRows.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (__VLS_ctx.handleBatchDelete)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:delete']) }, null, null);
    __VLS_87.slots.default;
    var __VLS_87;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (__VLS_ctx.refreshTable)
    };
    var __VLS_95;
}
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.reportList),
    stripe: true,
    border: true,
}));
const __VLS_102 = __VLS_101({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.reportList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_103.slots.default;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    type: "selection",
    width: "50",
    fixed: true,
}));
const __VLS_110 = __VLS_109({
    type: "selection",
    width: "50",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "reportId",
    label: "报表ID",
    width: "100",
}));
const __VLS_114 = __VLS_113({
    prop: "reportId",
    label: "报表ID",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "reportName",
    label: "报表名称",
    width: "200",
}));
const __VLS_118 = __VLS_117({
    prop: "reportName",
    label: "报表名称",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "reportCode",
    label: "报表编码",
    width: "150",
}));
const __VLS_122 = __VLS_121({
    prop: "reportCode",
    label: "报表编码",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "reportType",
    label: "报表类型",
    width: "100",
}));
const __VLS_126 = __VLS_125({
    prop: "reportType",
    label: "报表类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_127.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_128 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        type: (row.reportType === 'chart' ? 'primary' : 'success'),
    }));
    const __VLS_130 = __VLS_129({
        type: (row.reportType === 'chart' ? 'primary' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (row.reportType === 'chart' ? '图表' : '表格');
    var __VLS_131;
}
var __VLS_127;
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "description",
    label: "描述",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_134 = __VLS_133({
    prop: "description",
    label: "描述",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_138 = __VLS_137({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_139.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_140 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        type: (row.status === '0' ? 'success' : 'danger'),
    }));
    const __VLS_142 = __VLS_141({
        type: (row.status === '0' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (row.status === '0' ? '正常' : '停用');
    var __VLS_143;
}
var __VLS_139;
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    prop: "createTime",
    label: "创建时间",
    width: "180",
}));
const __VLS_146 = __VLS_145({
    prop: "createTime",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "操作",
    width: "300",
    fixed: "right",
}));
const __VLS_150 = __VLS_149({
    label: "操作",
    width: "300",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_151.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_156;
    let __VLS_157;
    let __VLS_158;
    const __VLS_159 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleView(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:view']) }, null, null);
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:edit']) }, null, null);
    __VLS_163.slots.default;
    var __VLS_163;
    const __VLS_168 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleExport(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:export']) }, null, null);
    __VLS_171.slots.default;
    var __VLS_171;
    const __VLS_176 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['report:delete']) }, null, null);
    __VLS_179.slots.default;
    var __VLS_179;
}
var __VLS_151;
var __VLS_103;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_184 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_186 = __VLS_185({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_188;
let __VLS_189;
let __VLS_190;
const __VLS_191 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_192 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_187;
var __VLS_75;
const __VLS_193 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑报表' : '新增报表'),
    width: "600px",
    destroyOnClose: true,
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑报表' : '新增报表'),
    width: "600px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
const __VLS_197 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_199 = __VLS_198({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_201 = {};
__VLS_200.slots.default;
const __VLS_203 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
    label: "报表名称",
    prop: "reportName",
}));
const __VLS_205 = __VLS_204({
    label: "报表名称",
    prop: "reportName",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
__VLS_206.slots.default;
const __VLS_207 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
    modelValue: (__VLS_ctx.formData.reportName),
    placeholder: "请输入报表名称",
}));
const __VLS_209 = __VLS_208({
    modelValue: (__VLS_ctx.formData.reportName),
    placeholder: "请输入报表名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
var __VLS_206;
const __VLS_211 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
    label: "报表编码",
    prop: "reportCode",
}));
const __VLS_213 = __VLS_212({
    label: "报表编码",
    prop: "reportCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
__VLS_214.slots.default;
const __VLS_215 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
    modelValue: (__VLS_ctx.formData.reportCode),
    placeholder: "请输入报表编码",
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_217 = __VLS_216({
    modelValue: (__VLS_ctx.formData.reportCode),
    placeholder: "请输入报表编码",
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
var __VLS_214;
const __VLS_219 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
    label: "报表类型",
    prop: "reportType",
}));
const __VLS_221 = __VLS_220({
    label: "报表类型",
    prop: "reportType",
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
__VLS_222.slots.default;
const __VLS_223 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
    modelValue: (__VLS_ctx.formData.reportType),
    placeholder: "请选择报表类型",
}));
const __VLS_225 = __VLS_224({
    modelValue: (__VLS_ctx.formData.reportType),
    placeholder: "请选择报表类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_224));
__VLS_226.slots.default;
const __VLS_227 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
    label: "图表",
    value: "chart",
}));
const __VLS_229 = __VLS_228({
    label: "图表",
    value: "chart",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
const __VLS_231 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    label: "表格",
    value: "table",
}));
const __VLS_233 = __VLS_232({
    label: "表格",
    value: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
var __VLS_226;
var __VLS_222;
const __VLS_235 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
    label: "描述",
    prop: "description",
}));
const __VLS_237 = __VLS_236({
    label: "描述",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
__VLS_238.slots.default;
const __VLS_239 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
    modelValue: (__VLS_ctx.formData.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入描述",
}));
const __VLS_241 = __VLS_240({
    modelValue: (__VLS_ctx.formData.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
var __VLS_238;
const __VLS_243 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
    label: "状态",
    prop: "status",
}));
const __VLS_245 = __VLS_244({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
__VLS_246.slots.default;
const __VLS_247 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_249 = __VLS_248({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
__VLS_250.slots.default;
const __VLS_251 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
    value: "0",
}));
const __VLS_253 = __VLS_252({
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
__VLS_254.slots.default;
var __VLS_254;
const __VLS_255 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
    value: "1",
}));
const __VLS_257 = __VLS_256({
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
__VLS_258.slots.default;
var __VLS_258;
var __VLS_250;
var __VLS_246;
const __VLS_259 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    label: "备注",
    prop: "remark",
}));
const __VLS_261 = __VLS_260({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
__VLS_262.slots.default;
const __VLS_263 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入备注",
}));
const __VLS_265 = __VLS_264({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
var __VLS_262;
var __VLS_200;
{
    const { footer: __VLS_thisSlot } = __VLS_196.slots;
    const __VLS_267 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
        ...{ 'onClick': {} },
    }));
    const __VLS_269 = __VLS_268({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    let __VLS_271;
    let __VLS_272;
    let __VLS_273;
    const __VLS_274 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_270.slots.default;
    var __VLS_270;
    const __VLS_275 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_277 = __VLS_276({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_276));
    let __VLS_279;
    let __VLS_280;
    let __VLS_281;
    const __VLS_282 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_278.slots.default;
    var __VLS_278;
}
var __VLS_196;
const __VLS_283 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
    modelValue: (__VLS_ctx.exportDialogVisible),
    title: "导出报表",
    width: "400px",
    destroyOnClose: true,
}));
const __VLS_285 = __VLS_284({
    modelValue: (__VLS_ctx.exportDialogVisible),
    title: "导出报表",
    width: "400px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
__VLS_286.slots.default;
const __VLS_287 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
    labelWidth: "100px",
}));
const __VLS_289 = __VLS_288({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_288));
__VLS_290.slots.default;
const __VLS_291 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
    label: "导出格式",
}));
const __VLS_293 = __VLS_292({
    label: "导出格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_292));
__VLS_294.slots.default;
const __VLS_295 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_296 = __VLS_asFunctionalComponent(__VLS_295, new __VLS_295({
    modelValue: (__VLS_ctx.exportFormat),
}));
const __VLS_297 = __VLS_296({
    modelValue: (__VLS_ctx.exportFormat),
}, ...__VLS_functionalComponentArgsRest(__VLS_296));
__VLS_298.slots.default;
const __VLS_299 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
    value: "excel",
}));
const __VLS_301 = __VLS_300({
    value: "excel",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
__VLS_302.slots.default;
var __VLS_302;
const __VLS_303 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
    value: "pdf",
}));
const __VLS_305 = __VLS_304({
    value: "pdf",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
__VLS_306.slots.default;
var __VLS_306;
var __VLS_298;
var __VLS_294;
var __VLS_290;
{
    const { footer: __VLS_thisSlot } = __VLS_286.slots;
    const __VLS_307 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
        ...{ 'onClick': {} },
    }));
    const __VLS_309 = __VLS_308({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_308));
    let __VLS_311;
    let __VLS_312;
    let __VLS_313;
    const __VLS_314 = {
        onClick: (...[$event]) => {
            __VLS_ctx.exportDialogVisible = false;
        }
    };
    __VLS_310.slots.default;
    var __VLS_310;
    const __VLS_315 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.exportLoading),
    }));
    const __VLS_317 = __VLS_316({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.exportLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_316));
    let __VLS_319;
    let __VLS_320;
    let __VLS_321;
    const __VLS_322 = {
        onClick: (__VLS_ctx.handleConfirmExport)
    };
    __VLS_318.slots.default;
    var __VLS_318;
}
var __VLS_286;
/** @type {__VLS_StyleScopedClasses['report-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
// @ts-ignore
var __VLS_202 = __VLS_201;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            Delete: Delete,
            loading: loading,
            submitLoading: submitLoading,
            exportLoading: exportLoading,
            reportList: reportList,
            total: total,
            selectedRows: selectedRows,
            dialogVisible: dialogVisible,
            exportDialogVisible: exportDialogVisible,
            isEdit: isEdit,
            formRef: formRef,
            exportFormat: exportFormat,
            queryParams: queryParams,
            formData: formData,
            formRules: formRules,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleView: handleView,
            handleDelete: handleDelete,
            handleBatchDelete: handleBatchDelete,
            handleExport: handleExport,
            handleConfirmExport: handleConfirmExport,
            handleSubmit: handleSubmit,
            handleSelectionChange: handleSelectionChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ReportList.vue.js.map