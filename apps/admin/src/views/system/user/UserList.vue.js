import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Download, More } from '@element-plus/icons-vue';
import { getUserPage, deleteUser, exportUser } from '@/api/system/user.api';
import { getDeptTreeSelect } from '@/api/system/dept.api';
import UserForm from './UserForm.vue';
import AssignRoleDialog from './AssignRoleDialog.vue';
// 状态
const loading = ref(false);
const userList = ref([]);
const total = ref(0);
const deptTree = ref([]);
const selectedRows = ref([]);
const formVisible = ref(false);
const assignRoleVisible = ref(false);
const currentUser = ref(null);
const currentUserId = ref();
// 查询参数
const queryParams = reactive({
    keyword: '',
    status: '',
    deptId: undefined,
    pageNum: 1,
    pageSize: 10,
});
// 加载用户列表
async function fetchUserList() {
    loading.value = true;
    try {
        const res = await getUserPage(queryParams);
        userList.value = res.rows;
        total.value = res.total;
    }
    finally {
        loading.value = false;
    }
}
// 加载部门树
async function fetchDeptTree() {
    try {
        deptTree.value = (await getDeptTreeSelect());
    }
    catch (error) {
        console.error('加载部门树失败', error);
    }
}
// 查询
function handleQuery() {
    queryParams.pageNum = 1;
    fetchUserList();
}
// 重置查询
function resetQuery() {
    queryParams.keyword = '';
    queryParams.status = '';
    queryParams.deptId = undefined;
    queryParams.pageNum = 1;
    handleQuery();
}
// 刷新表格
function refreshTable() {
    fetchUserList();
}
// 新增
function handleAdd() {
    currentUser.value = null;
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    currentUser.value = { ...row };
    formVisible.value = true;
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除用户"${row.username}"？`, '提示', {
            type: 'warning',
        });
        await deleteUser(row.userId);
        ElMessage.success('删除成功');
        fetchUserList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 重置密码
function handleResetPassword(row) {
    ElMessage.info(`重置密码功能开发中，用户ID: ${row.userId}`);
}
// 分配角色
function handleAssignRole(row) {
    currentUserId.value = row.userId;
    assignRoleVisible.value = true;
}
// 导出
async function handleExport() {
    try {
        await exportUser(queryParams);
        ElMessage.success('导出成功');
    }
    catch (error) {
        console.error('导出失败', error);
    }
}
// 批量选择
function handleSelectionChange(selection) {
    selectedRows.value = selection;
}
// 初始化
onMounted(() => {
    fetchUserList();
    fetchDeptTree();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-list" },
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
    placeholder: "请输入用户名称/昵称/手机号",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入用户名称/昵称/手机号",
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
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "部门",
    prop: "deptId",
}));
const __VLS_38 = __VLS_37({
    label: "部门",
    prop: "deptId",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTreeSelect;
/** @type {[typeof __VLS_components.ElTreeSelect, typeof __VLS_components.elTreeSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.queryParams.deptId),
    data: (__VLS_ctx.deptTree),
    props: ({ label: 'deptName', children: 'children' }),
    placeholder: "请选择部门",
    checkStrictly: true,
    filterable: true,
    clearable: true,
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.queryParams.deptId),
    data: (__VLS_ctx.deptTree),
    props: ({ label: 'deptName', children: 'children' }),
    placeholder: "请选择部门",
    checkStrictly: true,
    filterable: true,
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_39;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_51.slots.default;
var __VLS_51;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_59.slots.default;
var __VLS_59;
var __VLS_47;
var __VLS_7;
var __VLS_3;
const __VLS_64 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_66 = __VLS_65({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_67.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_68 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (__VLS_ctx.handleAdd)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:add']) }, null, null);
    __VLS_71.slots.default;
    var __VLS_71;
    const __VLS_76 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (__VLS_ctx.handleExport)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:export']) }, null, null);
    __VLS_79.slots.default;
    var __VLS_79;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (__VLS_ctx.refreshTable)
    };
    var __VLS_87;
}
const __VLS_92 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.userList),
    stripe: true,
    border: true,
}));
const __VLS_94 = __VLS_93({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.userList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_95.slots.default;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    type: "selection",
    width: "50",
    fixed: true,
}));
const __VLS_102 = __VLS_101({
    type: "selection",
    width: "50",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "userId",
    label: "用户编号",
    width: "100",
}));
const __VLS_106 = __VLS_105({
    prop: "userId",
    label: "用户编号",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "username",
    label: "用户名称",
    width: "120",
}));
const __VLS_110 = __VLS_109({
    prop: "username",
    label: "用户名称",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "nickname",
    label: "用户昵称",
    width: "120",
}));
const __VLS_114 = __VLS_113({
    prop: "nickname",
    label: "用户昵称",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "deptName",
    label: "部门",
    width: "150",
}));
const __VLS_118 = __VLS_117({
    prop: "deptName",
    label: "部门",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "phone",
    label: "手机号码",
    width: "120",
}));
const __VLS_122 = __VLS_121({
    prop: "phone",
    label: "手机号码",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_126 = __VLS_125({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "sex",
    label: "性别",
    width: "80",
}));
const __VLS_130 = __VLS_129({
    prop: "sex",
    label: "性别",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.sex === '0' ? '男' : row.sex === '1' ? '女' : '未知');
}
var __VLS_131;
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_134 = __VLS_133({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_136 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        type: (row.status === '0' ? 'success' : 'danger'),
    }));
    const __VLS_138 = __VLS_137({
        type: (row.status === '0' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (row.status === '0' ? '正常' : '停用');
    var __VLS_139;
}
var __VLS_135;
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "loginDate",
    label: "最后登录",
    width: "180",
}));
const __VLS_142 = __VLS_141({
    prop: "loginDate",
    label: "最后登录",
    width: "180",
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
    width: "200",
    fixed: "right",
}));
const __VLS_150 = __VLS_149({
    label: "操作",
    width: "200",
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
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:edit']) }, null, null);
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:delete']) }, null, null);
    __VLS_163.slots.default;
    var __VLS_163;
    const __VLS_168 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        trigger: "click",
    }));
    const __VLS_170 = __VLS_169({
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.More),
    }));
    const __VLS_174 = __VLS_173({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.More),
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    var __VLS_175;
    {
        const { dropdown: __VLS_thisSlot } = __VLS_171.slots;
        const __VLS_176 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
        const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        const __VLS_180 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            ...{ 'onClick': {} },
        }));
        const __VLS_182 = __VLS_181({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        let __VLS_184;
        let __VLS_185;
        let __VLS_186;
        const __VLS_187 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleResetPassword(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:resetPwd']) }, null, null);
        __VLS_183.slots.default;
        var __VLS_183;
        const __VLS_188 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            ...{ 'onClick': {} },
        }));
        const __VLS_190 = __VLS_189({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        let __VLS_192;
        let __VLS_193;
        let __VLS_194;
        const __VLS_195 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleAssignRole(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['system:user:assignRole']) }, null, null);
        __VLS_191.slots.default;
        var __VLS_191;
        var __VLS_179;
    }
    var __VLS_171;
}
var __VLS_151;
var __VLS_95;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_196 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_198 = __VLS_197({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_200;
let __VLS_201;
let __VLS_202;
const __VLS_203 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_204 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_199;
var __VLS_67;
/** @type {[typeof UserForm, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(UserForm, new UserForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    userData: (__VLS_ctx.currentUser),
}));
const __VLS_206 = __VLS_205({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    userData: (__VLS_ctx.currentUser),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
let __VLS_208;
let __VLS_209;
let __VLS_210;
const __VLS_211 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_207;
/** @type {[typeof AssignRoleDialog, ]} */ ;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(AssignRoleDialog, new AssignRoleDialog({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.assignRoleVisible),
    userId: (__VLS_ctx.currentUserId),
}));
const __VLS_213 = __VLS_212({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.assignRoleVisible),
    userId: (__VLS_ctx.currentUserId),
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
let __VLS_215;
let __VLS_216;
let __VLS_217;
const __VLS_218 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_214;
/** @type {__VLS_StyleScopedClasses['user-list']} */ ;
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
            Download: Download,
            More: More,
            UserForm: UserForm,
            AssignRoleDialog: AssignRoleDialog,
            loading: loading,
            userList: userList,
            total: total,
            deptTree: deptTree,
            formVisible: formVisible,
            assignRoleVisible: assignRoleVisible,
            currentUser: currentUser,
            currentUserId: currentUserId,
            queryParams: queryParams,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            handleResetPassword: handleResetPassword,
            handleAssignRole: handleAssignRole,
            handleExport: handleExport,
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
//# sourceMappingURL=UserList.vue.js.map