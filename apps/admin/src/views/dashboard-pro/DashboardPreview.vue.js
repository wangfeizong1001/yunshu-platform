/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 大屏预览组件
 * 用于在设计器中预览配置好的大屏效果
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { LineChartWidget, BarChartWidget, PieChartWidget, RingChartWidget, AreaChartWidget, GaugeWidget, TableWidget, TextWidget, ImageWidget, } from '@/components/dashboard-widgets';
const props = defineProps();
const currentTime = ref('');
let timeInterval = null;
// 获取组件样式
const getWidgetStyle = (widget) => {
    return {
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: `${widget.width}px`,
        height: `${widget.height}px`,
        backgroundColor: widget.backgroundColor || 'rgba(0, 102, 255, 0.1)',
        borderColor: widget.borderColor || '#00d4ff',
    };
};
// 获取组件渲染器
const getWidgetComponent = (type) => {
    const componentMap = {
        line: LineChartWidget,
        bar: BarChartWidget,
        pie: PieChartWidget,
        ring: RingChartWidget,
        area: AreaChartWidget,
        gauge: GaugeWidget,
        table: TableWidget,
        text: TextWidget,
        image: ImageWidget,
    };
    return componentMap[type] || 'div';
};
// 更新时间
const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
    });
};
onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
});
onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "preview-title" },
});
(__VLS_ctx.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "current-time" },
});
(__VLS_ctx.currentTime);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-body" },
});
for (const [widget] of __VLS_getVForSourceType((__VLS_ctx.widgets))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (widget.id),
        ...{ class: "preview-widget" },
        ...{ style: (__VLS_ctx.getWidgetStyle(widget)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "widget-title" },
    });
    (widget.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "widget-content" },
    });
    const __VLS_0 = ((__VLS_ctx.getWidgetComponent(widget.type)));
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        config: (widget.config),
    }));
    const __VLS_2 = __VLS_1({
        config: (widget.config),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
/** @type {__VLS_StyleScopedClasses['dashboard-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['current-time']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-body']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-title']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentTime: currentTime,
            getWidgetStyle: getWidgetStyle,
            getWidgetComponent: getWidgetComponent,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardPreview.vue.js.map