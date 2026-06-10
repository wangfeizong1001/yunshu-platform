import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Tickets } from '@element-plus/icons-vue';
import { getGenDbList, importGenTable } from '@/api/tool/gen.api';
const props = defineProps();
const emit = defineEmits();
const visible = ref(false);
const loading = ref(false);
const importing = ref(false);
const tableData = ref([]);
const selectedTables = ref([]);
const total = ref(0);
const queryParams = reactive({
    page: 1,
    limit: 20,
    sort: 'createTime',
    order: 'desc'
});
watch(() => props.modelValue, (val) => {
    visible.value = val;
    if (val) {
        loadTableList();
    }
});
watch(visible, (val) => {
    emit('update:modelValue', val);
});
const formatDate = (date) => {
    if (!date)
        return '-';
    return new Date(date).toLocaleString('zh-CN');
};
const loadTableList = async () => {
    loading.value = true;
    try {
        const res = await getGenDbList(queryParams);
        if (res.success) {
            tableData.value = res.data || [];
            total.value = res.pagination?.total || 0;
        }
    }
    catch {
        ElMessage.error('获取表列表失败');
    }
    finally {
        loading.value = false;
    }
};
const handleQuery = () => {
    queryParams.page = 1;
    loadTableList();
};
const handleReset = () => {
    queryParams.page = 1;
    queryParams.limit = 20;
    queryParams.tableName = undefined;
    queryParams.tableComment = undefined;
    loadTableList();
};
const handleSelectionChange = (selection) => {
    selectedTables.value = selection;
};
const doImport = async (tables) => {
    if (tables.length === 0) {
        ElMessage.warning('请选择要导入的表');
        return;
    }
    try {
        await ElMessageBox.confirm(`确定要导入 ${tables.length} 个表吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        importing.value = true;
        const tableNames = tables.map(t => t.tableName);
        const res = await importGenTable(tableNames);
        if (res.success) {
            ElMessage.success(`成功导入 ${tables.length} 个表`);
            emit('success');
            handleClose();
        }
    }
    catch (error) {
        if (error !== 'cancel') {
            ElMessage.error(error.message || '导入失败');
        }
    }
    finally {
        importing.value = false;
    }
};
const handleImport = () => {
    doImport(selectedTables.value);
};
const handleSingleImport = (table) => {
    doImport([table]);
};
const handleClose = () => {
    visible.value = false;
    selectedTables.value = [];
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "导入表",
    width: "900px",
    closeOnClickModal: (false),
    ...{ class: "import-dialog" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "导入表",
    width: "900px",
    closeOnClickModal: (false),
    ...{ class: "import-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "search-card" },
    shadow: "never",
}));
const __VLS_7 = __VLS_6({
    ...{ class: "search-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    model: (__VLS_ctx.queryParams),
    inline: true,
}));
const __VLS_11 = __VLS_10({
    model: (__VLS_ctx.queryParams),
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "表名称",
}));
const __VLS_15 = __VLS_14({
    label: "表名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.tableName),
    placeholder: "请输入表名称",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_19 = __VLS_18({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.tableName),
    placeholder: "请输入表名称",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onKeyup: (__VLS_ctx.handleQuery)
};
var __VLS_20;
var __VLS_16;
const __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    label: "表描述",
}));
const __VLS_27 = __VLS_26({
    label: "表描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.tableComment),
    placeholder: "请输入表描述",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_31 = __VLS_30({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.tableComment),
    placeholder: "请输入表描述",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onKeyup: (__VLS_ctx.handleQuery)
};
var __VLS_32;
var __VLS_28;
const __VLS_37 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
    loading: (__VLS_ctx.loading),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_44.slots.default;
var __VLS_44;
const __VLS_49 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_53;
let __VLS_54;
let __VLS_55;
const __VLS_56 = {
    onClick: (__VLS_ctx.handleReset)
};
__VLS_52.slots.default;
var __VLS_52;
var __VLS_40;
var __VLS_12;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "selected-info" },
});
const __VLS_57 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    size: "small",
    type: "primary",
}));
const __VLS_59 = __VLS_58({
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
(__VLS_ctx.selectedTables.length);
var __VLS_60;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_61 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    loading: (__VLS_ctx.importing),
    disabled: (__VLS_ctx.selectedTables.length === 0),
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    loading: (__VLS_ctx.importing),
    disabled: (__VLS_ctx.selectedTables.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClick: (__VLS_ctx.handleImport)
};
__VLS_64.slots.default;
var __VLS_64;
const __VLS_69 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    height: "400",
    border: true,
    stripe: true,
}));
const __VLS_71 = __VLS_70({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    height: "400",
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_72.slots.default;
const __VLS_77 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    type: "selection",
    width: "55",
    align: "center",
}));
const __VLS_79 = __VLS_78({
    type: "selection",
    width: "55",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const __VLS_81 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "表名称",
    prop: "tableName",
    width: "200",
    align: "center",
}));
const __VLS_83 = __VLS_82({
    label: "表名称",
    prop: "tableName",
    width: "200",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_84.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-name-cell" },
    });
    const __VLS_85 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
    const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    const __VLS_89 = {}.Tickets;
    /** @type {[typeof __VLS_components.Tickets, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
    const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
    var __VLS_88;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.tableName);
}
var __VLS_84;
const __VLS_93 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "表描述",
    prop: "tableComment",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_95 = __VLS_94({
    label: "表描述",
    prop: "tableComment",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "表空间",
    prop: "tableSchema",
    width: "120",
    align: "center",
}));
const __VLS_99 = __VLS_98({
    label: "表空间",
    prop: "tableSchema",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_100.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.tableSchema) {
        const __VLS_101 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            size: "small",
            type: "info",
        }));
        const __VLS_103 = __VLS_102({
            size: "small",
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        __VLS_104.slots.default;
        (row.tableSchema);
        var __VLS_104;
    }
}
var __VLS_100;
const __VLS_105 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    label: "引擎",
    prop: "engine",
    width: "100",
    align: "center",
}));
const __VLS_107 = __VLS_106({
    label: "引擎",
    prop: "engine",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_108.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.engine) {
        const __VLS_109 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            size: "small",
            type: "success",
        }));
        const __VLS_111 = __VLS_110({
            size: "small",
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        __VLS_112.slots.default;
        (row.engine);
        var __VLS_112;
    }
}
var __VLS_108;
const __VLS_113 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: "创建时间",
    prop: "createTime",
    width: "180",
    align: "center",
}));
const __VLS_115 = __VLS_114({
    label: "创建时间",
    prop: "createTime",
    width: "180",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_116.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createTime));
}
var __VLS_116;
const __VLS_117 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    label: "操作",
    width: "100",
    align: "center",
    fixed: "right",
}));
const __VLS_119 = __VLS_118({
    label: "操作",
    width: "100",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_120.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_121 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_123 = __VLS_122({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    let __VLS_125;
    let __VLS_126;
    let __VLS_127;
    const __VLS_128 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSingleImport(row);
        }
    };
    __VLS_124.slots.default;
    var __VLS_124;
}
var __VLS_120;
var __VLS_72;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_129 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.page),
    pageSize: (__VLS_ctx.queryParams.limit),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_131 = __VLS_130({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.page),
    pageSize: (__VLS_ctx.queryParams.limit),
    pageSizes: ([10, 20, 50, 100]),
    total: (__VLS_ctx.total),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
let __VLS_133;
let __VLS_134;
let __VLS_135;
const __VLS_136 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_137 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_132;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_138 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        ...{ 'onClick': {} },
    }));
    const __VLS_140 = __VLS_139({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    let __VLS_142;
    let __VLS_143;
    let __VLS_144;
    const __VLS_145 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_141.slots.default;
    var __VLS_141;
    const __VLS_146 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.importing),
        disabled: (__VLS_ctx.selectedTables.length === 0),
    }));
    const __VLS_148 = __VLS_147({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.importing),
        disabled: (__VLS_ctx.selectedTables.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    let __VLS_150;
    let __VLS_151;
    let __VLS_152;
    const __VLS_153 = {
        onClick: (__VLS_ctx.handleImport)
    };
    __VLS_149.slots.default;
    var __VLS_149;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['import-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-info']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['table-name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Tickets: Tickets,
            visible: visible,
            loading: loading,
            importing: importing,
            tableData: tableData,
            selectedTables: selectedTables,
            total: total,
            queryParams: queryParams,
            formatDate: formatDate,
            handleQuery: handleQuery,
            handleReset: handleReset,
            handleSelectionChange: handleSelectionChange,
            handleImport: handleImport,
            handleSingleImport: handleSingleImport,
            handleClose: handleClose,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=GenImport.vue.js.map