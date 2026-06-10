/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue';
import { getKnowledgePage, getCategoryList, deleteKnowledge, batchDeleteKnowledge, publishKnowledge, withdrawKnowledge } from '@/api/system/knowledge.api';
import KnowledgeForm from './KnowledgeForm.vue';
import KnowledgeDetail from './KnowledgeDetail.vue';
// 状态
const loading = ref(false);
const knowledgeList = ref([]);
const categoryList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const formVisible = ref(false);
const detailVisible = ref(false);
const currentKnowledge = ref(null);
const currentKnowledgeId = ref();
// 查询参数
const queryParams = reactive({
    keyword: '',
    categoryId: undefined,
    status: '',
    visible: '',
    pageNum: 1,
    pageSize: 10
});
// 获取分类列表
async function fetchCategoryList() {
    try {
        const res = await getCategoryList();
        categoryList.value = res.data || [];
    }
    catch (error) {
        console.error('获取分类列表失败', error);
    }
}
// 获取知识库文档列表
async function fetchKnowledgeList() {
    loading.value = true;
    try {
        const res = await getKnowledgePage(queryParams);
        knowledgeList.value = res.data?.rows || [];
        total.value = res.data?.total || 0;
    }
    catch (error) {
        console.error('获取知识库文档列表失败', error);
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    queryParams.pageNum = 1;
    fetchKnowledgeList();
}
// 重置查询
function resetQuery() {
    queryParams.keyword = '';
    queryParams.categoryId = undefined;
    queryParams.status = '';
    queryParams.visible = '';
    queryParams.pageNum = 1;
    handleQuery();
}
// 新增
function handleAdd() {
    currentKnowledge.value = null;
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    currentKnowledge.value = { ...row };
    formVisible.value = true;
}
// 预览
function handleView(row) {
    currentKnowledgeId.value = row.knowledgeId;
    detailVisible.value = true;
}
// 发布
async function handlePublish(row) {
    try {
        await ElMessageBox.confirm(`是否确认发布文档"${row.title}"？`, '提示', {
            type: 'warning'
        });
        await publishKnowledge(row.knowledgeId);
        ElMessage.success('发布成功');
        fetchKnowledgeList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('发布失败', error);
        }
    }
}
// 撤回
async function handleWithdraw(row) {
    try {
        await ElMessageBox.confirm(`是否确认撤回文档"${row.title}"？`, '提示', {
            type: 'warning'
        });
        await withdrawKnowledge(row.knowledgeId);
        ElMessage.success('撤回成功');
        fetchKnowledgeList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('撤回失败', error);
        }
    }
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除文档"${row.title}"？`, '提示', {
            type: 'warning'
        });
        await deleteKnowledge(row.knowledgeId);
        ElMessage.success('删除成功');
        fetchKnowledgeList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 批量删除
async function handleBatchDelete() {
    try {
        await ElMessageBox.confirm(`是否确认删除选中的 ${selectedRows.value.length} 个文档？`, '提示', {
            type: 'warning'
        });
        await batchDeleteKnowledge(selectedRows.value.map(row => row.knowledgeId));
        ElMessage.success('批量删除成功');
        fetchKnowledgeList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('批量删除失败', error);
        }
    }
}
// 表格选择
function handleSelectionChange(selection) {
    selectedRows.value = selection;
}
// 初始化
onMounted(() => {
    fetchCategoryList();
    fetchKnowledgeList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "knowledge-list" },
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
    label: "关键词",
    prop: "keyword",
}));
const __VLS_10 = __VLS_9({
    label: "关键词",
    prop: "keyword",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入文档标题或内容",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入文档标题或内容",
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
    label: "文档分类",
    prop: "categoryId",
}));
const __VLS_22 = __VLS_21({
    label: "文档分类",
    prop: "categoryId",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.categoryId),
    placeholder: "请选择分类",
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.categoryId),
    placeholder: "请选择分类",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categoryList))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (category.categoryId),
        label: (category.categoryName),
        value: (category.categoryId),
    }));
    const __VLS_30 = __VLS_29({
        key: (category.categoryId),
        label: (category.categoryName),
        value: (category.categoryId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
var __VLS_23;
const __VLS_32 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "状态",
    prop: "status",
}));
const __VLS_34 = __VLS_33({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "发布",
    value: "0",
}));
const __VLS_42 = __VLS_41({
    label: "发布",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "草稿",
    value: "1",
}));
const __VLS_46 = __VLS_45({
    label: "草稿",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_39;
var __VLS_35;
const __VLS_48 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_55.slots.default;
var __VLS_55;
const __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_63.slots.default;
var __VLS_63;
var __VLS_51;
var __VLS_7;
var __VLS_3;
const __VLS_68 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_70 = __VLS_69({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_72 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        onClick: (__VLS_ctx.handleAdd)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:add']) }, null, null);
    __VLS_75.slots.default;
    var __VLS_75;
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (__VLS_ctx.selectedRows.length === 0),
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        disabled: (__VLS_ctx.selectedRows.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (__VLS_ctx.handleBatchDelete)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:remove']) }, null, null);
    __VLS_83.slots.default;
    var __VLS_83;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (__VLS_ctx.fetchKnowledgeList)
    };
    var __VLS_91;
}
const __VLS_96 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.knowledgeList),
    stripe: true,
    border: true,
}));
const __VLS_98 = __VLS_97({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.knowledgeList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_99.slots.default;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    type: "selection",
    width: "50",
    fixed: true,
}));
const __VLS_106 = __VLS_105({
    type: "selection",
    width: "50",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "knowledgeId",
    label: "文档编号",
    width: "100",
}));
const __VLS_110 = __VLS_109({
    prop: "knowledgeId",
    label: "文档编号",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_114 = __VLS_113({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "categoryName",
    label: "分类",
    width: "120",
}));
const __VLS_118 = __VLS_117({
    prop: "categoryName",
    label: "分类",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "tags",
    label: "标签",
    width: "180",
    showOverflowTooltip: true,
}));
const __VLS_122 = __VLS_121({
    prop: "tags",
    label: "标签",
    width: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [tag, index] of __VLS_getVForSourceType((row.tags?.split(',') || []))) {
        const __VLS_124 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            key: (index),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_126 = __VLS_125({
            key: (index),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        (tag);
        var __VLS_127;
    }
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_130 = __VLS_129({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_132 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        type: (row.status === '0' ? 'success' : 'info'),
    }));
    const __VLS_134 = __VLS_133({
        type: (row.status === '0' ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (row.status === '0' ? '发布' : '草稿');
    var __VLS_135;
}
var __VLS_131;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    prop: "viewCount",
    label: "浏览次数",
    width: "100",
    sortable: true,
}));
const __VLS_138 = __VLS_137({
    prop: "viewCount",
    label: "浏览次数",
    width: "100",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "createBy",
    label: "创建者",
    width: "120",
}));
const __VLS_142 = __VLS_141({
    prop: "createBy",
    label: "创建者",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
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
    width: "280",
    fixed: "right",
}));
const __VLS_150 = __VLS_149({
    label: "操作",
    width: "280",
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
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:edit']) }, null, null);
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleView(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:query']) }, null, null);
    __VLS_163.slots.default;
    var __VLS_163;
    if (row.status === '1') {
        const __VLS_168 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        let __VLS_174;
        const __VLS_175 = {
            onClick: (...[$event]) => {
                if (!(row.status === '1'))
                    return;
                __VLS_ctx.handlePublish(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:publish']) }, null, null);
        __VLS_171.slots.default;
        var __VLS_171;
    }
    if (row.status === '0') {
        const __VLS_176 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
        }));
        const __VLS_178 = __VLS_177({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        let __VLS_180;
        let __VLS_181;
        let __VLS_182;
        const __VLS_183 = {
            onClick: (...[$event]) => {
                if (!(row.status === '0'))
                    return;
                __VLS_ctx.handleWithdraw(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:publish']) }, null, null);
        __VLS_179.slots.default;
        var __VLS_179;
    }
    const __VLS_184 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:knowledge:remove']) }, null, null);
    __VLS_187.slots.default;
    var __VLS_187;
}
var __VLS_151;
var __VLS_99;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_192 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_194 = __VLS_193({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_196;
let __VLS_197;
let __VLS_198;
const __VLS_199 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_200 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_195;
var __VLS_71;
/** @type {[typeof KnowledgeForm, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(KnowledgeForm, new KnowledgeForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    knowledgeData: (__VLS_ctx.currentKnowledge),
}));
const __VLS_202 = __VLS_201({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    knowledgeData: (__VLS_ctx.currentKnowledge),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_204;
let __VLS_205;
let __VLS_206;
const __VLS_207 = {
    onRefresh: (__VLS_ctx.fetchKnowledgeList)
};
var __VLS_203;
/** @type {[typeof KnowledgeDetail, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(KnowledgeDetail, new KnowledgeDetail({
    modelValue: (__VLS_ctx.detailVisible),
    knowledgeId: (__VLS_ctx.currentKnowledgeId),
}));
const __VLS_209 = __VLS_208({
    modelValue: (__VLS_ctx.detailVisible),
    knowledgeId: (__VLS_ctx.currentKnowledgeId),
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
/** @type {__VLS_StyleScopedClasses['knowledge-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            Delete: Delete,
            KnowledgeForm: KnowledgeForm,
            KnowledgeDetail: KnowledgeDetail,
            loading: loading,
            knowledgeList: knowledgeList,
            categoryList: categoryList,
            total: total,
            selectedRows: selectedRows,
            formVisible: formVisible,
            detailVisible: detailVisible,
            currentKnowledge: currentKnowledge,
            currentKnowledgeId: currentKnowledgeId,
            queryParams: queryParams,
            fetchKnowledgeList: fetchKnowledgeList,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleView: handleView,
            handlePublish: handlePublish,
            handleWithdraw: handleWithdraw,
            handleDelete: handleDelete,
            handleBatchDelete: handleBatchDelete,
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
//# sourceMappingURL=KnowledgeList.vue.js.map