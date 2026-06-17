import { ref, reactive, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Download } from '@element-plus/icons-vue';
import { getDictDataPage, deleteDictData, exportDictData } from '@/api/system/dict.api';
import DictDataForm from './DictDataForm.vue';
const props = defineProps();
const emit = defineEmits();
// ========== 状态常量（与后端约定字段值） ==========
const IS_DEFAULT_YES = '1';
const DICT_STATUS_NORMAL = '0';
/** 是否默认 tag 类型 */
const getIsDefaultTagType = (val) => (val === IS_DEFAULT_YES ? 'success' : 'info');
/** 是否默认文本 */
const getIsDefaultLabel = (val) => (val === IS_DEFAULT_YES ? '是' : '否');
/** 字典数据状态 tag 类型 */
const getDictStatusTagType = (val) => val === DICT_STATUS_NORMAL ? 'success' : 'danger';
/** 字典数据状态文本 */
const getDictStatusLabel = (val) => val === DICT_STATUS_NORMAL ? '正常' : '停用';
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 字典类型
const dictType = computed(() => props.dictType || '');
// 状态
const loading = ref(false);
const dictDataList = ref([]);
const total = ref(0);
const formVisible = ref(false);
const currentDictData = ref(null);
// 查询参数
const queryParams = reactive({
    keyword: '',
    dictType: props.dictType || undefined,
    status: undefined,
    pageNum: 1,
    pageSize: 10,
});
// 获取显示样式类型
function getListClassType(listClass) {
    const typeMap = {
        primary: 'primary',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        info: 'info',
        default: 'info',
    };
    return typeMap[listClass] || 'info';
}
// 加载字典数据列表
async function fetchDictDataList() {
    if (!props.dictType)
        return;
    loading.value = true;
    try {
        queryParams.dictType = props.dictType;
        const res = await getDictDataPage(queryParams);
        dictDataList.value = res.rows;
        total.value = res.total;
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    queryParams.pageNum = 1;
    fetchDictDataList();
}
// 重置查询
function resetQuery() {
    queryParams.keyword = '';
    queryParams.status = undefined;
    queryParams.pageNum = 1;
    handleQuery();
}
// 刷新表格
function refreshTable() {
    fetchDictDataList();
}
// 新增
function handleAdd() {
    currentDictData.value = null;
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    currentDictData.value = { ...row };
    formVisible.value = true;
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除字典数据"${row.dictLabel}"？`, '提示', {
            type: 'warning',
        });
        await deleteDictData(row.dictCode);
        ElMessage.success('删除成功');
        fetchDictDataList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 导出
async function handleExport() {
    try {
        await exportDictData(props.dictType || '');
        ElMessage.success('导出成功');
    }
    catch (error) {
        console.error('导出失败', error);
    }
}
// 关闭弹窗
function handleClose() {
    visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
    if (val) {
        fetchDictDataList();
    }
});
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
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (`字典数据 - ${__VLS_ctx.dictType}`),
    width: "900px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (`字典数据 - ${__VLS_ctx.dictType}`),
    width: "900px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClose: (__VLS_ctx.handleClose)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    shadow: "never",
    ...{ class: "search-card" },
}));
const __VLS_11 = __VLS_10({
    shadow: "never",
    ...{ class: "search-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    model: (__VLS_ctx.queryParams),
    inline: true,
}));
const __VLS_15 = __VLS_14({
    model: (__VLS_ctx.queryParams),
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: "关键词",
    prop: "keyword",
}));
const __VLS_19 = __VLS_18({
    label: "关键词",
    prop: "keyword",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入字典标签/键值",
    clearable: true,
}));
const __VLS_23 = __VLS_22({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入字典标签/键值",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onKeyup: (__VLS_ctx.handleQuery)
};
var __VLS_24;
var __VLS_20;
const __VLS_29 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    label: "状态",
    prop: "status",
}));
const __VLS_31 = __VLS_30({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    label: "正常",
    value: "0",
}));
const __VLS_39 = __VLS_38({
    label: "正常",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "停用",
    value: "1",
}));
const __VLS_43 = __VLS_42({
    label: "停用",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
var __VLS_36;
var __VLS_32;
const __VLS_45 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_53;
let __VLS_54;
let __VLS_55;
const __VLS_56 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_52.slots.default;
var __VLS_52;
const __VLS_57 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_61;
let __VLS_62;
let __VLS_63;
const __VLS_64 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_60.slots.default;
var __VLS_60;
var __VLS_48;
var __VLS_16;
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
const __VLS_65 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_67 = __VLS_66({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onClick: (__VLS_ctx.handleAdd)
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dict:add']) }, null, null);
__VLS_68.slots.default;
var __VLS_68;
const __VLS_73 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}));
const __VLS_75 = __VLS_74({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_77;
let __VLS_78;
let __VLS_79;
const __VLS_80 = {
    onClick: (__VLS_ctx.handleExport)
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dict:export']) }, null, null);
__VLS_76.slots.default;
var __VLS_76;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
const __VLS_81 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}));
const __VLS_83 = __VLS_82({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_85;
let __VLS_86;
let __VLS_87;
const __VLS_88 = {
    onClick: (__VLS_ctx.refreshTable)
};
var __VLS_84;
const __VLS_89 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    data: (__VLS_ctx.dictDataList),
    stripe: true,
    border: true,
    ...{ class: "dict-data-table" },
}));
const __VLS_91 = __VLS_90({
    data: (__VLS_ctx.dictDataList),
    stripe: true,
    border: true,
    ...{ class: "dict-data-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_92.slots.default;
const __VLS_93 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    prop: "dictCode",
    label: "字典编码",
    width: "100",
}));
const __VLS_95 = __VLS_94({
    prop: "dictCode",
    label: "字典编码",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    prop: "dictSort",
    label: "字典排序",
    width: "100",
}));
const __VLS_99 = __VLS_98({
    prop: "dictSort",
    label: "字典排序",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const __VLS_101 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    prop: "dictLabel",
    label: "字典标签",
    width: "150",
}));
const __VLS_103 = __VLS_102({
    prop: "dictLabel",
    label: "字典标签",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const __VLS_105 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    prop: "dictValue",
    label: "字典键值",
    width: "150",
}));
const __VLS_107 = __VLS_106({
    prop: "dictValue",
    label: "字典键值",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const __VLS_109 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    prop: "listClass",
    label: "显示样式",
    width: "120",
}));
const __VLS_111 = __VLS_110({
    prop: "listClass",
    label: "显示样式",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_112.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_113 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        type: (__VLS_ctx.getListClassType(row.listClass)),
    }));
    const __VLS_115 = __VLS_114({
        type: (__VLS_ctx.getListClassType(row.listClass)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    (row.listClass || '默认');
    var __VLS_116;
}
var __VLS_112;
const __VLS_117 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    prop: "isDefault",
    label: "是否默认",
    width: "100",
}));
const __VLS_119 = __VLS_118({
    prop: "isDefault",
    label: "是否默认",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_120.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_121 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        type: (__VLS_ctx.getIsDefaultTagType(row.isDefault)),
    }));
    const __VLS_123 = __VLS_122({
        type: (__VLS_ctx.getIsDefaultTagType(row.isDefault)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    (__VLS_ctx.getIsDefaultLabel(row.isDefault));
    var __VLS_124;
}
var __VLS_120;
const __VLS_125 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_127 = __VLS_126({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_128.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_129 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
        type: (__VLS_ctx.getDictStatusTagType(row.status)),
    }));
    const __VLS_131 = __VLS_130({
        type: (__VLS_ctx.getDictStatusTagType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    __VLS_132.slots.default;
    (__VLS_ctx.getDictStatusLabel(row.status));
    var __VLS_132;
}
var __VLS_128;
const __VLS_133 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    prop: "remark",
    label: "备注",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_135 = __VLS_134({
    prop: "remark",
    label: "备注",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const __VLS_137 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_139 = __VLS_138({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_140.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_141 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_145;
    let __VLS_146;
    let __VLS_147;
    const __VLS_148 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dict:edit']) }, null, null);
    __VLS_144.slots.default;
    var __VLS_144;
    const __VLS_149 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_151 = __VLS_150({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    let __VLS_153;
    let __VLS_154;
    let __VLS_155;
    const __VLS_156 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dict:remove']) }, null, null);
    __VLS_152.slots.default;
    var __VLS_152;
}
var __VLS_140;
var __VLS_92;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_157 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_159 = __VLS_158({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
let __VLS_161;
let __VLS_162;
let __VLS_163;
const __VLS_164 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_165 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_160;
/** @type {[typeof DictDataForm, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(DictDataForm, new DictDataForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    dictData: (__VLS_ctx.currentDictData),
    dictType: (__VLS_ctx.dictType || ''),
}));
const __VLS_167 = __VLS_166({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    dictData: (__VLS_ctx.currentDictData),
    dictType: (__VLS_ctx.dictType || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
let __VLS_169;
let __VLS_170;
let __VLS_171;
const __VLS_172 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_168;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['dict-data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            Download: Download,
            DictDataForm: DictDataForm,
            getIsDefaultTagType: getIsDefaultTagType,
            getIsDefaultLabel: getIsDefaultLabel,
            getDictStatusTagType: getDictStatusTagType,
            getDictStatusLabel: getDictStatusLabel,
            visible: visible,
            dictType: dictType,
            loading: loading,
            dictDataList: dictDataList,
            total: total,
            formVisible: formVisible,
            currentDictData: currentDictData,
            queryParams: queryParams,
            getListClassType: getListClassType,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            handleExport: handleExport,
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
//# sourceMappingURL=DictDataList.vue.js.map