/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from 'vue';
const props = withDefaults(defineProps(), {
    data: () => [],
    columns: () => [],
    loading: false,
    stripe: true,
    border: true,
    showSelection: false,
    showPagination: true,
    total: 0,
    pageSize: 10
});
const emit = defineEmits(['selectionChange', 'pageChange']);
const currentPage = ref(1);
const handleSelectionChange = (selection) => {
    emit('selectionChange', selection);
};
const handleSizeChange = (val) => {
    emit('pageChange', { page: currentPage.value, pageSize: val });
};
const handleCurrentChange = (val) => {
    emit('pageChange', { page: val, pageSize: props.pageSize });
};
watch(() => props.pageSize, (val) => {
    pageSize.value = val;
});
const pageSize = ref(props.pageSize);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    data: () => [],
    columns: () => [],
    loading: false,
    stripe: true,
    border: true,
    showSelection: false,
    showPagination: true,
    total: 0,
    pageSize: 10
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "common-table" },
});
const __VLS_0 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.data),
    stripe: (__VLS_ctx.stripe),
    border: (__VLS_ctx.border),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.data),
    stripe: (__VLS_ctx.stripe),
    border: (__VLS_ctx.border),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_3.slots.default;
if (__VLS_ctx.showSelection) {
    const __VLS_8 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        type: "selection",
        width: "55",
    }));
    const __VLS_10 = __VLS_9({
        type: "selection",
        width: "55",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    const __VLS_12 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        key: (column.prop),
        prop: (column.prop),
        label: (column.label),
        width: (column.width),
        minWidth: (column.minWidth),
        align: (column.align || 'left'),
        fixed: (column.fixed),
        sortable: (column.sortable),
        formatter: (column.formatter),
    }));
    const __VLS_14 = __VLS_13({
        key: (column.prop),
        prop: (column.prop),
        label: (column.label),
        width: (column.width),
        minWidth: (column.minWidth),
        align: (column.align || 'left'),
        fixed: (column.fixed),
        sortable: (column.sortable),
        formatter: (column.formatter),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    if (column.slot) {
        {
            const { default: __VLS_thisSlot } = __VLS_15.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            var __VLS_16 = {
                row: (scope.row),
            };
            var __VLS_17 = __VLS_tryAsConstant(column.slot);
        }
    }
    var __VLS_15;
}
var __VLS_3;
if (__VLS_ctx.showPagination) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pagination" },
    });
    const __VLS_20 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        pageSizes: ([10, 20, 50, 100]),
        background: (true),
        layout: "total, sizes, prev, pager, next, jumper",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        pageSizes: ([10, 20, 50, 100]),
        background: (true),
        layout: "total, sizes, prev, pager, next, jumper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onSizeChange: (__VLS_ctx.handleSizeChange)
    };
    const __VLS_28 = {
        onCurrentChange: (__VLS_ctx.handleCurrentChange)
    };
    var __VLS_23;
}
/** @type {__VLS_StyleScopedClasses['common-table']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_19 = __VLS_16;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentPage: currentPage,
            handleSelectionChange: handleSelectionChange,
            handleSizeChange: handleSizeChange,
            handleCurrentChange: handleCurrentChange,
            pageSize: pageSize,
        };
    },
    emits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map