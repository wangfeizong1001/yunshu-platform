/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 数据表格组件
 * 用于大屏设计器中渲染数据表格
 */
import { ref, watch, onMounted, computed } from 'vue';
import { fetchDataFromSource } from './data-source-utils';
const props = withDefaults(defineProps(), {
    config: () => ({
        title: '数据表格',
        dataSource: { type: 'mock' },
        columns: [
            { prop: 'name', label: '名称', width: 120 },
            { prop: 'value', label: '数值' },
            { prop: 'status', label: '状态', width: 100 },
        ],
    }),
});
// Mock 数据
const mockData = [
    { name: '项目A', value: 100, status: '正常' },
    { name: '项目B', value: 200, status: '正常' },
    { name: '项目C', value: 150, status: '异常' },
    { name: '项目D', value: 300, status: '正常' },
    { name: '项目E', value: 250, status: '正常' },
];
const tableData = ref([]);
// 表格列配置
const columns = computed(() => {
    return props.config?.columns || [
        { prop: 'name', label: '名称', width: 120 },
        { prop: 'value', label: '数值' },
        { prop: 'status', label: '状态', width: 100 },
    ];
});
// 表头样式
const headerStyle = {
    background: 'rgba(0, 102, 255, 0.2)',
    color: '#00d4ff',
    borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
};
// 单元格样式
const cellStyle = {
    background: 'rgba(0, 102, 255, 0.05)',
    color: '#fff',
    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
};
// 获取数据
const fetchTableData = async () => {
    const dataSource = props.config?.dataSource;
    if (dataSource?.type === 'api' && dataSource.url) {
        try {
            const result = await fetchDataFromSource(dataSource);
            if (result && result.tableData) {
                tableData.value = result.tableData;
            }
        }
        catch (error) {
            console.error('获取表格数据失败:', error);
            tableData.value = mockData;
        }
    }
    else {
        tableData.value = mockData;
    }
};
// 监听数据源变化
watch(() => props.config?.dataSource, () => {
    fetchTableData();
}, { deep: true });
onMounted(() => {
    fetchTableData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    config: () => ({
        title: '数据表格',
        dataSource: { type: 'mock' },
        columns: [
            { prop: 'name', label: '名称', width: 120 },
            { prop: 'value', label: '数值' },
            { prop: 'status', label: '状态', width: 100 },
        ],
    }),
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-widget" },
});
if (__VLS_ctx.config?.title) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-title" },
    });
    (__VLS_ctx.config.title);
}
const __VLS_0 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    data: (__VLS_ctx.tableData),
    ...{ style: {} },
    height: "calc(100% - 30px)",
    headerCellStyle: (__VLS_ctx.headerStyle),
    cellStyle: (__VLS_ctx.cellStyle),
}));
const __VLS_2 = __VLS_1({
    data: (__VLS_ctx.tableData),
    ...{ style: {} },
    height: "calc(100% - 30px)",
    headerCellStyle: (__VLS_ctx.headerStyle),
    cellStyle: (__VLS_ctx.cellStyle),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    const __VLS_4 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (col.prop),
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
    }));
    const __VLS_6 = __VLS_5({
        key: (col.prop),
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['table-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['table-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            tableData: tableData,
            columns: columns,
            headerStyle: headerStyle,
            cellStyle: cellStyle,
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
//# sourceMappingURL=TableWidget.vue.js.map