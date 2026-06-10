/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Download, Refresh, ArrowDown } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { getReport } from '@/api/report.api';
import { exportToExcel, exportToPDF } from '@/utils/export';
const router = useRouter();
const route = useRoute();
// 状态
const loading = ref(true);
const error = ref(false);
const reportId = ref();
const reportInfo = ref(null);
const reportType = ref('chart');
const chartRef = ref();
const reportRef = ref();
const showDataDetail = ref(true);
let chartInstance = null;
// 报表配置
const reportConfig = reactive({
    title: '',
    description: '',
    chartType: 'line',
    xAxis: '',
    yAxis: '',
    showLegend: true,
    showToolbox: true,
    columns: [],
    data: []
});
// 表格数据
const tableData = computed(() => reportConfig.data);
// 数据字段
const dataFields = computed(() => {
    if (reportConfig.data.length > 0) {
        return Object.keys(reportConfig.data[0]);
    }
    return [];
});
// 返回
function handleBack() {
    router.push('/report/list');
}
// 刷新
function handleRefresh() {
    loadReport();
}
// 格式化时间
function formatTime(time) {
    if (!time)
        return '-';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
// 渲染图表
function renderChart() {
    if (!chartRef.value)
        return;
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value);
    }
    let option = {};
    if (reportConfig.data.length === 0) {
        option = {
            title: {
                text: '暂无数据',
                left: 'center',
                top: 'center'
            }
        };
    }
    else {
        const xAxisData = reportConfig.data.map(item => item[reportConfig.xAxis]);
        const seriesData = reportConfig.data.map(item => item[reportConfig.yAxis]);
        option = {
            title: {
                text: reportConfig.title,
                left: 'center'
            },
            tooltip: {
                trigger: reportConfig.chartType === 'pie' ? 'item' : 'axis'
            },
            legend: {
                show: reportConfig.showLegend,
                data: [reportConfig.yAxis],
                bottom: 0
            },
            toolbox: {
                show: reportConfig.showToolbox,
                feature: {
                    saveAsImage: {}
                },
                right: 20
            },
            xAxis: reportConfig.chartType === 'pie'
                ? undefined
                : {
                    type: 'category',
                    data: xAxisData,
                    name: reportConfig.xAxis,
                    axisLabel: {
                        rotate: xAxisData.length > 8 ? 45 : 0
                    }
                },
            yAxis: reportConfig.chartType === 'pie'
                ? undefined
                : {
                    type: 'value',
                    name: reportConfig.yAxis
                },
            grid: {
                left: '3%',
                right: '4%',
                bottom: reportConfig.showLegend ? '15%' : '3%',
                top: '15%',
                containLabel: true
            },
            series: [
                {
                    name: reportConfig.yAxis,
                    type: reportConfig.chartType,
                    data: reportConfig.chartType === 'pie'
                        ? reportConfig.data.map(item => ({
                            name: item[reportConfig.xAxis],
                            value: item[reportConfig.yAxis]
                        }))
                        : seriesData,
                    areaStyle: reportConfig.chartType === 'area' ? {} : undefined,
                    smooth: reportConfig.chartType === 'line' || reportConfig.chartType === 'area'
                }
            ]
        };
    }
    chartInstance.setOption(option, true);
}
// 导出
async function handleExport(type) {
    try {
        if (type === 'excel') {
            if (reportConfig.data.length === 0) {
                ElMessage.warning('暂无数据可导出');
                return;
            }
            exportToExcel(reportConfig.data, reportConfig.title || 'report');
            ElMessage.success('导出成功');
        }
        else if (type === 'pdf') {
            if (!reportRef.value)
                return;
            await exportToPDF(reportRef.value, reportConfig.title || 'report');
            ElMessage.success('导出成功');
        }
    }
    catch (error) {
        ElMessage.error('导出失败');
        console.error('导出失败:', error);
    }
}
// 加载报表数据
async function loadReport() {
    const id = route.params.id;
    if (!id)
        return;
    reportId.value = parseInt(id);
    loading.value = true;
    error.value = false;
    try {
        // 获取报表信息
        const res = await getReport(reportId.value);
        reportInfo.value = res.data;
        reportType.value = res.data.reportType;
        // 解析配置
        if (res.data.config) {
            try {
                const config = JSON.parse(res.data.config);
                reportConfig.columns = config;
            }
            catch (e) {
                console.error('解析配置失败:', e);
            }
        }
        // 等待DOM更新后渲染
        await nextTick();
        if (reportType.value === 'chart') {
            renderChart();
        }
    }
    catch (err) {
        error.value = true;
        ElMessage.error('加载报表失败');
        console.error('加载报表失败:', err);
    }
    finally {
        loading.value = false;
    }
}
// 窗口大小变化时重绘图表
onMounted(() => {
    loadReport();
    window.addEventListener('resize', () => {
        chartInstance?.resize();
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-view" },
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
(__VLS_ctx.reportInfo?.reportName || '报表查看');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_8 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onCommand': {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onCommand': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onCommand: (__VLS_ctx.handleExport)
};
__VLS_11.slots.default;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    type: "primary",
    icon: (__VLS_ctx.Download),
}));
const __VLS_18 = __VLS_17({
    type: "primary",
    icon: (__VLS_ctx.Download),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "el-icon--right" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, typeof __VLS_components.arrowDown, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
var __VLS_19;
{
    const { dropdown: __VLS_thisSlot } = __VLS_11.slots;
    const __VLS_28 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        command: "excel",
    }));
    const __VLS_34 = __VLS_33({
        command: "excel",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_36 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        command: "pdf",
    }));
    const __VLS_38 = __VLS_37({
        command: "pdf",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    var __VLS_31;
}
var __VLS_11;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.handleRefresh)
};
__VLS_43.slots.default;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-content" },
    ref: "reportRef",
});
/** @type {typeof __VLS_ctx.reportRef} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-container" },
    });
    const __VLS_48 = {}.ElSkeleton;
    /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        rows: (10),
        animated: true,
    }));
    const __VLS_50 = __VLS_49({
        rows: (10),
        animated: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-container" },
    });
    const __VLS_52 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        description: "加载失败",
    }));
    const __VLS_54 = __VLS_53({
        description: "加载失败",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (__VLS_ctx.handleRefresh)
    };
    __VLS_59.slots.default;
    var __VLS_59;
    var __VLS_55;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "report-title" },
    });
    (__VLS_ctx.reportConfig.title || __VLS_ctx.reportInfo?.reportName);
    if (__VLS_ctx.reportConfig.description) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "report-description" },
        });
        (__VLS_ctx.reportConfig.description);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatTime(__VLS_ctx.reportInfo?.createTime));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatTime(__VLS_ctx.reportInfo?.updateTime));
    if (__VLS_ctx.reportType === 'chart') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "chart-wrapper" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ref: "chartRef",
            ...{ class: "chart-container" },
        });
        /** @type {typeof __VLS_ctx.chartRef} */ ;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "table-wrapper" },
        });
        const __VLS_64 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            data: (__VLS_ctx.tableData),
            stripe: true,
            border: true,
            ...{ style: {} },
        }));
        const __VLS_66 = __VLS_65({
            data: (__VLS_ctx.tableData),
            stripe: true,
            border: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        __VLS_67.slots.default;
        for (const [column] of __VLS_getVForSourceType((__VLS_ctx.reportConfig.columns))) {
            const __VLS_68 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                key: (column.field),
                prop: (column.field),
                label: (column.title),
                width: (column.width),
            }));
            const __VLS_70 = __VLS_69({
                key: (column.field),
                prop: (column.field),
                label: (column.title),
                width: (column.width),
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        }
        var __VLS_67;
    }
    if (__VLS_ctx.showDataDetail) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "data-detail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        const __VLS_72 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            data: (__VLS_ctx.reportConfig.data),
            stripe: true,
            border: true,
            ...{ style: {} },
            maxHeight: "400",
        }));
        const __VLS_74 = __VLS_73({
            data: (__VLS_ctx.reportConfig.data),
            stripe: true,
            border: true,
            ...{ style: {} },
            maxHeight: "400",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        for (const [field, index] of __VLS_getVForSourceType((__VLS_ctx.dataFields))) {
            const __VLS_76 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                key: (index),
                prop: (field),
                label: (field),
                showOverflowTooltip: true,
            }));
            const __VLS_78 = __VLS_77({
                key: (index),
                prop: (field),
                label: (field),
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        }
        var __VLS_75;
    }
}
/** @type {__VLS_StyleScopedClasses['report-view']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['report-content']} */ ;
/** @type {__VLS_StyleScopedClasses['report-header']} */ ;
/** @type {__VLS_StyleScopedClasses['report-title']} */ ;
/** @type {__VLS_StyleScopedClasses['report-description']} */ ;
/** @type {__VLS_StyleScopedClasses['report-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['data-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowLeft: ArrowLeft,
            Download: Download,
            Refresh: Refresh,
            ArrowDown: ArrowDown,
            loading: loading,
            error: error,
            reportInfo: reportInfo,
            reportType: reportType,
            chartRef: chartRef,
            reportRef: reportRef,
            showDataDetail: showDataDetail,
            reportConfig: reportConfig,
            tableData: tableData,
            dataFields: dataFields,
            handleBack: handleBack,
            handleRefresh: handleRefresh,
            formatTime: formatTime,
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
//# sourceMappingURL=ReportView.vue.js.map