/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 折线图组件
 * 用于大屏设计器中渲染真实的 ECharts 折线图
 */
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, } from 'echarts/components';
import { fetchDataFromSource } from './data-source-utils';
use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
]);
const props = withDefaults(defineProps(), {
    config: () => ({
        title: '折线图',
        dataSource: { type: 'mock' },
        chartConfig: {},
    }),
});
const chartRef = ref();
const chartData = ref({
    xData: [],
    yData: [],
});
// Mock 数据
const mockData = {
    xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    yData: [820, 932, 901, 934, 1290, 1330, 1320],
};
// 获取数据
const fetchChartData = async () => {
    const dataSource = props.config?.dataSource;
    if (dataSource?.type === 'api' && dataSource.url) {
        try {
            const result = await fetchDataFromSource(dataSource);
            if (result) {
                chartData.value = {
                    xData: result.xData || [],
                    yData: result.yData || [],
                    seriesData: result.seriesData,
                };
            }
        }
        catch (error) {
            console.error('获取折线图数据失败:', error);
            chartData.value = mockData;
        }
    }
    else {
        chartData.value = mockData;
    }
};
// 图表配置
const chartOption = computed(() => {
    const baseOption = {
        title: {
            text: props.config?.title || '折线图',
            textStyle: {
                color: '#00d4ff',
                fontSize: 14,
            },
            left: 'center',
            top: 5,
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: chartData.value.seriesData ? Object.keys(chartData.value.seriesData) : ['数值'],
            textStyle: { color: '#fff' },
            top: 30,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 60,
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.value.xData,
            axisLine: { lineStyle: { color: '#00d4ff' } },
            axisLabel: { color: '#fff' },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#00d4ff' } },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
        },
        series: [],
    };
    // 如果有多系列数据
    if (chartData.value.seriesData) {
        const colors = ['#00d4ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7'];
        Object.entries(chartData.value.seriesData).forEach(([name, data], index) => {
            baseOption.series.push({
                name,
                type: 'line',
                smooth: true,
                data,
                itemStyle: { color: colors[index % colors.length] },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: colors[index % colors.length].replace(')', ', 0.3)').replace('#', 'rgba(') },
                            { offset: 1, color: colors[index % colors.length].replace(')', ', 0)').replace('#', 'rgba(') },
                        ],
                    },
                },
            });
        });
    }
    else {
        // 单系列数据
        baseOption.series.push({
            name: '数值',
            type: 'line',
            smooth: true,
            data: chartData.value.yData,
            itemStyle: { color: '#00d4ff' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 212, 255, 0)' },
                    ],
                },
            },
        });
    }
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
        title: '折线图',
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
    ...{ class: "chart-widget line-chart-widget" },
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
/** @type {__VLS_StyleScopedClasses['line-chart-widget']} */ ;
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
//# sourceMappingURL=LineChartWidget.vue.js.map