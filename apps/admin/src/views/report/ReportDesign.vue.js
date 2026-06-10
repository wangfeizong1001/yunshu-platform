/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, View, Check, Plus, Delete, Upload } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { getReport, updateReport } from '@/api/report.api';
import { exportToPDF } from '@/utils/export';
const router = useRouter();
const route = useRoute();
// 状态
const loading = ref(false);
const saving = ref(false);
const reportId = ref();
const reportInfo = ref(null);
const activeTab = ref('basic');
const previewDialogVisible = ref(false);
const chartRef = ref();
const previewRef = ref();
const previewDialogRef = ref();
let chartInstance = null;
// 报表类型
const reportType = ref('chart');
// 报表配置
const reportConfig = reactive({
    title: '',
    description: ''
});
// 图表配置
const chartConfig = reactive({
    type: 'line',
    xAxis: '',
    yAxis: '',
    showLegend: true,
    showToolbox: true
});
// 表格配置
const tableConfig = reactive({
    columns: [
        { title: '名称', field: 'name', width: 150 },
        { title: '数值', field: 'value', width: 150 }
    ]
});
// 数据
const rawData = ref([]);
const dataJson = ref('');
const previewData = ref([]);
// 可用字段
const availableFields = ref([]);
// 返回
function handleBack() {
    router.push('/report/list');
}
// 解析数据
function parseData() {
    try {
        if (!dataJson.value.trim()) {
            ElMessage.warning('请输入数据');
            return;
        }
        const parsed = JSON.parse(dataJson.value);
        if (!Array.isArray(parsed)) {
            ElMessage.error('数据必须是数组格式');
            return;
        }
        rawData.value = parsed;
        previewData.value = parsed;
        // 提取字段
        if (parsed.length > 0) {
            availableFields.value = Object.keys(parsed[0]);
            if (!chartConfig.xAxis && availableFields.value.length > 0) {
                chartConfig.xAxis = availableFields.value[0];
            }
            if (!chartConfig.yAxis && availableFields.value.length > 1) {
                chartConfig.yAxis = availableFields.value[1];
            }
        }
        ElMessage.success('数据解析成功');
        updateChart();
    }
    catch (error) {
        ElMessage.error('数据格式错误，请检查JSON格式');
        console.error('解析数据失败:', error);
    }
}
// 添加表格列
function addTableColumn() {
    tableConfig.columns.push({
        title: `列${tableConfig.columns.length + 1}`,
        field: `field${tableConfig.columns.length + 1}`,
        width: 150
    });
}
// 删除表格列
function removeTableColumn(index) {
    tableConfig.columns.splice(index, 1);
}
// 更新图表
function updateChart() {
    if (!chartRef.value)
        return;
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value);
    }
    let option = {};
    if (rawData.value.length === 0) {
        option = {
            title: { text: reportConfig.title || '暂无数据' },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value' },
            series: []
        };
    }
    else {
        const xAxisData = rawData.value.map(item => item[chartConfig.xAxis]);
        const seriesData = rawData.value.map(item => item[chartConfig.yAxis]);
        option = {
            title: {
                text: reportConfig.title
            },
            tooltip: {
                trigger: chartConfig.type === 'pie' ? 'item' : 'axis'
            },
            legend: {
                show: chartConfig.showLegend,
                data: [chartConfig.yAxis]
            },
            toolbox: {
                show: chartConfig.showToolbox,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: chartConfig.type === 'pie'
                ? undefined
                : {
                    type: 'category',
                    data: xAxisData,
                    name: chartConfig.xAxis
                },
            yAxis: chartConfig.type === 'pie'
                ? undefined
                : {
                    type: 'value',
                    name: chartConfig.yAxis
                },
            series: [
                {
                    name: chartConfig.yAxis,
                    type: chartConfig.type,
                    data: chartConfig.type === 'pie'
                        ? rawData.value.map(item => ({
                            name: item[chartConfig.xAxis],
                            value: item[chartConfig.yAxis]
                        }))
                        : seriesData,
                    areaStyle: chartConfig.type === 'area' ? {} : undefined
                }
            ]
        };
    }
    chartInstance.setOption(option, true);
}
// 预览
function handlePreview() {
    previewDialogVisible.value = true;
    nextTick(() => {
        if (reportType.value === 'chart' && previewDialogRef.value) {
            const previewChart = echarts.init(previewDialogRef.value);
            previewChart.setOption(chartInstance?.getOption() || {});
            // 窗口大小变化时重绘
            const resizeObserver = new ResizeObserver(() => {
                previewChart.resize();
            });
            resizeObserver.observe(previewDialogRef.value);
        }
    });
}
// 导出预览
async function handleExportPreview() {
    if (!previewRef.value)
        return;
    try {
        await exportToPDF(previewRef.value, reportConfig.title || 'report');
        ElMessage.success('导出成功');
    }
    catch (error) {
        ElMessage.error('导出失败');
        console.error('导出失败:', error);
    }
}
// 保存
async function handleSave() {
    if (!reportId.value)
        return;
    saving.value = true;
    try {
        const config = {
            title: reportConfig.title,
            description: reportConfig.description,
            chartType: chartConfig.type,
            xAxis: chartConfig.xAxis,
            yAxis: chartConfig.yAxis,
            showLegend: chartConfig.showLegend,
            showToolbox: chartConfig.showToolbox,
            columns: tableConfig.columns,
            data: rawData.value
        };
        const updateData = {
            reportId: reportId.value,
            reportName: reportConfig.title || reportInfo.value?.reportName,
            reportType: reportType.value,
            description: reportConfig.description,
            config: JSON.stringify(config),
            status: reportInfo.value?.status
        };
        await updateReport(updateData);
        ElMessage.success('保存成功');
    }
    catch (error) {
        ElMessage.error('保存失败');
        console.error('保存失败:', error);
    }
    finally {
        saving.value = false;
    }
}
// 加载报表数据
async function loadReport() {
    const id = route.params.id;
    if (!id)
        return;
    reportId.value = parseInt(id);
    loading.value = true;
    try {
        const res = await getReport(reportId.value);
        reportInfo.value = res.data;
        // 设置基础信息
        reportConfig.title = res.data.reportName;
        reportConfig.description = res.data.description;
        reportType.value = res.data.reportType;
        // 解析配置
        if (res.data.config) {
            try {
                const config = JSON.parse(res.data.config);
                if (config.title)
                    reportConfig.title = config.title;
                if (config.description)
                    reportConfig.description = config.description;
                if (config.chartType)
                    chartConfig.type = config.chartType;
                if (config.xAxis)
                    chartConfig.xAxis = config.xAxis;
                if (config.yAxis)
                    chartConfig.yAxis = config.yAxis;
                if (config.showLegend !== undefined)
                    chartConfig.showLegend = config.showLegend;
                if (config.showToolbox !== undefined)
                    chartConfig.showToolbox = config.showToolbox;
                if (config.columns)
                    tableConfig.columns = config.columns;
                if (config.data) {
                    rawData.value = config.data;
                    previewData.value = config.data;
                    dataJson.value = JSON.stringify(config.data, null, 2);
                    if (config.data.length > 0) {
                        availableFields.value = Object.keys(config.data[0]);
                    }
                }
            }
            catch (e) {
                console.error('解析配置失败:', e);
            }
        }
        // 等待DOM更新后渲染图表
        nextTick(() => {
            updateChart();
        });
    }
    catch (error) {
        ElMessage.error('加载报表失败');
        console.error('加载报表失败:', error);
    }
    finally {
        loading.value = false;
    }
}
// 监听配置变化
watch([reportType, () => chartConfig.type, () => chartConfig.xAxis, () => chartConfig.yAxis], () => {
    if (reportType.value === 'chart') {
        updateChart();
    }
});
// 窗口大小变化时重绘图表
function handleResize() {
    chartInstance?.resize();
}
onMounted(() => {
    loadReport();
    window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-design" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleBack)
};
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
(__VLS_ctx.reportInfo?.reportName || '报表设计');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.View),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.View),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handlePreview)
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.handleSave)
};
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-panel" },
});
const __VLS_24 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "基础配置",
    name: "basic",
}));
const __VLS_30 = __VLS_29({
    label: "基础配置",
    name: "basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    labelWidth: "100px",
}));
const __VLS_34 = __VLS_33({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "报表标题",
}));
const __VLS_38 = __VLS_37({
    label: "报表标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.reportConfig.title),
    placeholder: "请输入报表标题",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.reportConfig.title),
    placeholder: "请输入报表标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_39;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "报表类型",
}));
const __VLS_46 = __VLS_45({
    label: "报表类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.reportType),
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.reportType),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    value: "chart",
}));
const __VLS_54 = __VLS_53({
    value: "chart",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    value: "table",
}));
const __VLS_58 = __VLS_57({
    value: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
var __VLS_51;
var __VLS_47;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "描述",
}));
const __VLS_62 = __VLS_61({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.reportConfig.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入描述",
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.reportConfig.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_63;
var __VLS_35;
var __VLS_31;
if (__VLS_ctx.reportType === 'chart') {
    const __VLS_68 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "图表配置",
        name: "chart",
    }));
    const __VLS_70 = __VLS_69({
        label: "图表配置",
        name: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        labelWidth: "100px",
    }));
    const __VLS_74 = __VLS_73({
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "图表类型",
    }));
    const __VLS_78 = __VLS_77({
        label: "图表类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.chartConfig.type),
        placeholder: "请选择图表类型",
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.chartConfig.type),
        placeholder: "请选择图表类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "折线图",
        value: "line",
    }));
    const __VLS_86 = __VLS_85({
        label: "折线图",
        value: "line",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_88 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "柱状图",
        value: "bar",
    }));
    const __VLS_90 = __VLS_89({
        label: "柱状图",
        value: "bar",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const __VLS_92 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "饼图",
        value: "pie",
    }));
    const __VLS_94 = __VLS_93({
        label: "饼图",
        value: "pie",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const __VLS_96 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        label: "环形图",
        value: "doughnut",
    }));
    const __VLS_98 = __VLS_97({
        label: "环形图",
        value: "doughnut",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const __VLS_100 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "面积图",
        value: "area",
    }));
    const __VLS_102 = __VLS_101({
        label: "面积图",
        value: "area",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_83;
    var __VLS_79;
    const __VLS_104 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "X轴字段",
    }));
    const __VLS_106 = __VLS_105({
        label: "X轴字段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.chartConfig.xAxis),
        placeholder: "请选择X轴字段",
        clearable: true,
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.chartConfig.xAxis),
        placeholder: "请选择X轴字段",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    for (const [field] of __VLS_getVForSourceType((__VLS_ctx.availableFields))) {
        const __VLS_112 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            key: (field),
            label: (field),
            value: (field),
        }));
        const __VLS_114 = __VLS_113({
            key: (field),
            label: (field),
            value: (field),
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    }
    var __VLS_111;
    var __VLS_107;
    const __VLS_116 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "Y轴字段",
    }));
    const __VLS_118 = __VLS_117({
        label: "Y轴字段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        modelValue: (__VLS_ctx.chartConfig.yAxis),
        placeholder: "请选择Y轴字段",
        clearable: true,
    }));
    const __VLS_122 = __VLS_121({
        modelValue: (__VLS_ctx.chartConfig.yAxis),
        placeholder: "请选择Y轴字段",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    for (const [field] of __VLS_getVForSourceType((__VLS_ctx.availableFields))) {
        const __VLS_124 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            key: (field),
            label: (field),
            value: (field),
        }));
        const __VLS_126 = __VLS_125({
            key: (field),
            label: (field),
            value: (field),
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    }
    var __VLS_123;
    var __VLS_119;
    const __VLS_128 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        label: "显示图例",
    }));
    const __VLS_130 = __VLS_129({
        label: "显示图例",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        modelValue: (__VLS_ctx.chartConfig.showLegend),
    }));
    const __VLS_134 = __VLS_133({
        modelValue: (__VLS_ctx.chartConfig.showLegend),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    var __VLS_131;
    const __VLS_136 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "显示工具栏",
    }));
    const __VLS_138 = __VLS_137({
        label: "显示工具栏",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    const __VLS_140 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        modelValue: (__VLS_ctx.chartConfig.showToolbox),
    }));
    const __VLS_142 = __VLS_141({
        modelValue: (__VLS_ctx.chartConfig.showToolbox),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    var __VLS_139;
    var __VLS_75;
    var __VLS_71;
}
if (__VLS_ctx.reportType === 'table') {
    const __VLS_144 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "表格配置",
        name: "table",
    }));
    const __VLS_146 = __VLS_145({
        label: "表格配置",
        name: "table",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        labelWidth: "100px",
    }));
    const __VLS_150 = __VLS_149({
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "表格列配置",
    }));
    const __VLS_154 = __VLS_153({
        label: "表格列配置",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_158 = __VLS_157({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
        onClick: (__VLS_ctx.addTableColumn)
    };
    __VLS_159.slots.default;
    var __VLS_159;
    var __VLS_155;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "column-list" },
    });
    for (const [column, index] of __VLS_getVForSourceType((__VLS_ctx.tableConfig.columns))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "column-item" },
        });
        const __VLS_164 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            modelValue: (column.title),
            placeholder: "列标题",
            ...{ style: {} },
        }));
        const __VLS_166 = __VLS_165({
            modelValue: (column.title),
            placeholder: "列标题",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        const __VLS_168 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            modelValue: (column.field),
            placeholder: "字段名",
            ...{ style: {} },
        }));
        const __VLS_170 = __VLS_169({
            modelValue: (column.field),
            placeholder: "字段名",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        const __VLS_172 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            modelValue: (column.width),
            min: (50),
            max: (500),
            size: "small",
            ...{ style: {} },
            placeholder: "宽度",
        }));
        const __VLS_174 = __VLS_173({
            modelValue: (column.width),
            min: (50),
            max: (500),
            size: "small",
            ...{ style: {} },
            placeholder: "宽度",
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        const __VLS_176 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            icon: (__VLS_ctx.Delete),
            circle: true,
        }));
        const __VLS_178 = __VLS_177({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            icon: (__VLS_ctx.Delete),
            circle: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        let __VLS_180;
        let __VLS_181;
        let __VLS_182;
        const __VLS_183 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.reportType === 'table'))
                    return;
                __VLS_ctx.removeTableColumn(index);
            }
        };
        var __VLS_179;
    }
    var __VLS_151;
    var __VLS_147;
}
const __VLS_184 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "数据配置",
    name: "data",
}));
const __VLS_186 = __VLS_185({
    label: "数据配置",
    name: "data",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-config" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_188 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.Upload),
}));
const __VLS_190 = __VLS_189({
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.Upload),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
var __VLS_191;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-editor" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.dataJson),
    placeholder: "请输入JSON格式的数据",
});
const __VLS_192 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}));
const __VLS_194 = __VLS_193({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_196;
let __VLS_197;
let __VLS_198;
const __VLS_199 = {
    onClick: (__VLS_ctx.parseData)
};
__VLS_195.slots.default;
var __VLS_195;
var __VLS_187;
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-content" },
    ref: "previewRef",
});
/** @type {typeof __VLS_ctx.previewRef} */ ;
if (__VLS_ctx.reportType === 'chart') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-container" },
        ref: "chartRef",
    });
    /** @type {typeof __VLS_ctx.chartRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-container" },
    });
    const __VLS_200 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        data: (__VLS_ctx.previewData),
        stripe: true,
        border: true,
        ...{ style: {} },
    }));
    const __VLS_202 = __VLS_201({
        data: (__VLS_ctx.previewData),
        stripe: true,
        border: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    for (const [column] of __VLS_getVForSourceType((__VLS_ctx.tableConfig.columns))) {
        const __VLS_204 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            key: (column.field),
            prop: (column.field),
            label: (column.title),
            width: (column.width),
        }));
        const __VLS_206 = __VLS_205({
            key: (column.field),
            prop: (column.field),
            label: (column.title),
            width: (column.width),
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    }
    var __VLS_203;
}
const __VLS_208 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.previewDialogVisible),
    title: "报表预览",
    width: "80%",
    top: "5vh",
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.previewDialogVisible),
    title: "报表预览",
    width: "80%",
    top: "5vh",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-dialog" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "previewDialogRef",
});
/** @type {typeof __VLS_ctx.previewDialogRef} */ ;
{
    const { footer: __VLS_thisSlot } = __VLS_211.slots;
    const __VLS_212 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        ...{ 'onClick': {} },
    }));
    const __VLS_214 = __VLS_213({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    let __VLS_216;
    let __VLS_217;
    let __VLS_218;
    const __VLS_219 = {
        onClick: (...[$event]) => {
            __VLS_ctx.previewDialogVisible = false;
        }
    };
    __VLS_215.slots.default;
    var __VLS_215;
    const __VLS_220 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_222 = __VLS_221({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    let __VLS_224;
    let __VLS_225;
    let __VLS_226;
    const __VLS_227 = {
        onClick: (__VLS_ctx.handleExportPreview)
    };
    __VLS_223.slots.default;
    var __VLS_223;
}
var __VLS_211;
/** @type {__VLS_StyleScopedClasses['report-design']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['left-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['column-list']} */ ;
/** @type {__VLS_StyleScopedClasses['column-item']} */ ;
/** @type {__VLS_StyleScopedClasses['data-config']} */ ;
/** @type {__VLS_StyleScopedClasses['data-header']} */ ;
/** @type {__VLS_StyleScopedClasses['data-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['right-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-dialog']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowLeft: ArrowLeft,
            View: View,
            Check: Check,
            Plus: Plus,
            Delete: Delete,
            Upload: Upload,
            reportInfo: reportInfo,
            activeTab: activeTab,
            previewDialogVisible: previewDialogVisible,
            chartRef: chartRef,
            previewRef: previewRef,
            previewDialogRef: previewDialogRef,
            reportType: reportType,
            reportConfig: reportConfig,
            chartConfig: chartConfig,
            tableConfig: tableConfig,
            dataJson: dataJson,
            previewData: previewData,
            availableFields: availableFields,
            handleBack: handleBack,
            parseData: parseData,
            addTableColumn: addTableColumn,
            removeTableColumn: removeTableColumn,
            handlePreview: handlePreview,
            handleExportPreview: handleExportPreview,
            handleSave: handleSave,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ReportDesign.vue.js.map