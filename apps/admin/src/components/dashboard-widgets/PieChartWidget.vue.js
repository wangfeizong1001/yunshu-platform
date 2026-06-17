/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 饼图组件
 * 用于大屏设计器中渲染真实的 ECharts 饼图
 */
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, } from 'echarts/components';
import { fetchDataFromSource } from './data-source-utils';
use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);
const props = withDefaults(defineProps(), {
    config: () => ({
        title: '饼图',
        dataSource: { type: 'mock' },
        chartConfig: {},
    }),
});
const chartRef = ref();
const chartData = ref([]);
// Mock 数据
const mockData = [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 },
];
// 获取数据
const fetchChartData = async () => {
    const dataSource = props.config?.dataSource;
    if (dataSource?.type === 'api' && dataSource.url) {
        try {
            const result = await fetchDataFromSource(dataSource);
            if (result && result.pieData) {
                chartData.value = result.pieData;
            }
        }
        catch (error) {
            console.error('获取饼图数据失败:', error);
            chartData.value = mockData;
        }
    }
    else {
        chartData.value = mockData;
    }
};
// 图表配置
const chartOption = computed(() => {
    const colors = ['#00d4ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7', '#6366f1'];
    const baseOption = {
        title: {
            text: props.config?.title || '饼图',
            textStyle: {
                color: '#00d4ff',
                fontSize: 14,
            },
            left: 'center',
            top: 5,
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { color: '#fff' },
            top: 30,
        },
        series: [
            {
                name: '数据',
                type: 'pie',
                radius: '60%',
                center: ['50%', '55%'],
                data: chartData.value.map((item, index) => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: {
                        color: colors[index % colors.length],
                    },
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
                label: {
                    show: true,
                    color: '#fff',
                },
            },
        ],
    };
    // 合合用户自定义配置
    return { ...baseOption, ...props.config?.chartConfig };
});
// 监听数据源变化
watch(() => props.config?.dataSource, () => {
    fetchChartData();
}, { deep: true });
onMounted(() => {
    fetchChartData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    config: () => ({
        title: '饼图',
        dataSource: { type: 'mock' },
        chartConfig: {},
    }),
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-widget pie-chart-widget" },
});
const __VLS_0 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ref: "chartRef",
    ...{ class: "chart" },
    option: (__VLS_ctx.chartOption),
    autoresize: true,
}));
const __VLS_2 = __VLS_1({
    ref: "chartRef",
    ...{ class: "chart" },
    option: (__VLS_ctx.chartOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {typeof __VLS_ctx.chartRef} */ ;
var __VLS_4 = {};
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['chart-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VChart: VChart,
            chartRef: chartRef,
            chartOption: chartOption,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PieChartWidget.vue.js.map