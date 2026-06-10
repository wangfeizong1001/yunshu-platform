import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { getDeptTree, deleteDept } from '@/api/system/dept.api';
import DeptForm from './DeptForm.vue';
// 状态
const loading = ref(false);
const deptList = ref([]);
const formVisible = ref(false);
const currentDept = ref(null);
const parentDept = ref(null);
// 查询参数
const queryParams = reactive({
    deptName: '',
    status: '',
});
// 加载部门树
async function fetchDeptTree() {
    loading.value = true;
    try {
        const res = await getDeptTree(queryParams);
        deptList.value = res;
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    fetchDeptTree();
}
// 重置查询
function resetQuery() {
    queryParams.deptName = '';
    queryParams.status = '';
    handleQuery();
}
// 刷新表格
function refreshTable() {
    fetchDeptTree();
}
// 新增
function handleAdd(row) {
    if (row) {
        parentDept.value = row;
    }
    else {
        parentDept.value = null;
    }
    currentDept.value = null;
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    currentDept.value = { ...row };
    parentDept.value = null;
    formVisible.value = true;
}
// 删除
async function handleDelete(row) {
    if (row.children?.length) {
        ElMessage.warning('该部门存在下级部门，无法删除');
        return;
    }
    try {
        await ElMessageBox.confirm(`是否确认删除部门"${row.deptName}"？`, '提示', {
            type: 'warning',
        });
        await deleteDept(row.deptId);
        ElMessage.success('删除成功');
        fetchDeptTree();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 初始化
onMounted(() => {
    fetchDeptTree();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dept-tree" },
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
    label: "部门名称",
    prop: "deptName",
}));
const __VLS_10 = __VLS_9({
    label: "部门名称",
    prop: "deptName",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.deptName),
    placeholder: "请输入部门名称",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.deptName),
    placeholder: "请输入部门名称",
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
    label: "状态",
    prop: "status",
}));
const __VLS_22 = __VLS_21({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "正常",
    value: "0",
}));
const __VLS_30 = __VLS_29({
    label: "正常",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "停用",
    value: "1",
}));
const __VLS_34 = __VLS_33({
    label: "停用",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
var __VLS_23;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_43.slots.default;
var __VLS_43;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_51.slots.default;
var __VLS_51;
var __VLS_39;
var __VLS_7;
var __VLS_3;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_58 = __VLS_57({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (() => __VLS_ctx.handleAdd())
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dept:add']) }, null, null);
    __VLS_63.slots.default;
    var __VLS_63;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_68 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (__VLS_ctx.refreshTable)
    };
    var __VLS_71;
}
const __VLS_76 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    data: (__VLS_ctx.deptList),
    rowKey: "deptId",
    defaultExpandAll: true,
    stripe: true,
    border: true,
    treeProps: ({ children: 'children', hasChildren: 'hasChildren' }),
}));
const __VLS_78 = __VLS_77({
    data: (__VLS_ctx.deptList),
    rowKey: "deptId",
    defaultExpandAll: true,
    stripe: true,
    border: true,
    treeProps: ({ children: 'children', hasChildren: 'hasChildren' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_79.slots.default;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "deptName",
    label: "部门名称",
    width: "250",
}));
const __VLS_82 = __VLS_81({
    prop: "deptName",
    label: "部门名称",
    width: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "deptId",
    label: "部门编号",
    width: "100",
}));
const __VLS_86 = __VLS_85({
    prop: "deptId",
    label: "部门编号",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "leader",
    label: "负责人",
    width: "120",
}));
const __VLS_90 = __VLS_89({
    prop: "leader",
    label: "负责人",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "phone",
    label: "联系电话",
    width: "140",
}));
const __VLS_94 = __VLS_93({
    prop: "phone",
    label: "联系电话",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "email",
    label: "邮箱",
    width: "180",
}));
const __VLS_98 = __VLS_97({
    prop: "email",
    label: "邮箱",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_102 = __VLS_101({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        type: (row.status === '0' ? 'success' : 'danger'),
    }));
    const __VLS_106 = __VLS_105({
        type: (row.status === '0' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    (row.status === '0' ? '正常' : '停用');
    var __VLS_107;
}
var __VLS_103;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "orderNum",
    label: "排序",
    width: "80",
}));
const __VLS_110 = __VLS_109({
    prop: "orderNum",
    label: "排序",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_114 = __VLS_113({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleAdd(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dept:add']) }, null, null);
    __VLS_119.slots.default;
    var __VLS_119;
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dept:edit']) }, null, null);
    __VLS_127.slots.default;
    var __VLS_127;
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:dept:delete']) }, null, null);
    __VLS_135.slots.default;
    var __VLS_135;
}
var __VLS_115;
var __VLS_79;
var __VLS_59;
/** @type {[typeof DeptForm, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(DeptForm, new DeptForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    deptData: (__VLS_ctx.currentDept),
    parentDept: (__VLS_ctx.parentDept),
}));
const __VLS_141 = __VLS_140({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    deptData: (__VLS_ctx.currentDept),
    parentDept: (__VLS_ctx.parentDept),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
let __VLS_143;
let __VLS_144;
let __VLS_145;
const __VLS_146 = {
    onRefresh: (__VLS_ctx.fetchDeptTree)
};
var __VLS_142;
/** @type {__VLS_StyleScopedClasses['dept-tree']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            DeptForm: DeptForm,
            loading: loading,
            deptList: deptList,
            formVisible: formVisible,
            currentDept: currentDept,
            parentDept: parentDept,
            queryParams: queryParams,
            fetchDeptTree: fetchDeptTree,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DeptTree.vue.js.map