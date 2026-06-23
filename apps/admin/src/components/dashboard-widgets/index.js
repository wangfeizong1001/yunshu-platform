/**
 * 大屏设计器组件库索引
 * 导出所有图表和组件
 */
// 图表组件
export { default as LineChartWidget } from './LineChartWidget.vue';
export { default as BarChartWidget } from './BarChartWidget.vue';
export { default as PieChartWidget } from './PieChartWidget.vue';
export { default as RingChartWidget } from './RingChartWidget.vue';
export { default as AreaChartWidget } from './AreaChartWidget.vue';
export { default as GaugeWidget } from './GaugeWidget.vue';
// 其他组件
export { default as TableWidget } from './TableWidget.vue';
export { default as TextWidget } from './TextWidget.vue';
export { default as ImageWidget } from './ImageWidget.vue';
// 工具函数
export { fetchDataFromSource, generateMockData } from './data-source-utils';
// 组件类型映射
import LineChartWidget from './LineChartWidget.vue';
import BarChartWidget from './BarChartWidget.vue';
import PieChartWidget from './PieChartWidget.vue';
import RingChartWidget from './RingChartWidget.vue';
import AreaChartWidget from './AreaChartWidget.vue';
import GaugeWidget from './GaugeWidget.vue';
import TableWidget from './TableWidget.vue';
import TextWidget from './TextWidget.vue';
import ImageWidget from './ImageWidget.vue';
// 组件类型映射表
export const widgetComponentMap = {
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
// 组件类型列表
export const widgetTypesList = [
    { type: 'line', name: '折线图', icon: 'TrendCharts' },
    { type: 'bar', name: '柱状图', icon: 'DataLine' },
    { type: 'pie', name: '饼图', icon: 'PieChart' },
    { type: 'ring', name: '环形图', icon: 'PieChart' },
    { type: 'area', name: '面积图', icon: 'TrendCharts' },
    { type: 'gauge', name: '仪表盘', icon: 'Monitor' },
    { type: 'table', name: '数据表格', icon: 'Grid' },
    { type: 'text', name: '文本', icon: 'Document' },
    { type: 'image', name: '图片', icon: 'Picture' },
];
//# sourceMappingURL=index.js.map