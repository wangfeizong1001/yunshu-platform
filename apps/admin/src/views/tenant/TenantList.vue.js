import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Download, More } from '@element-plus/icons-vue';
import { getTenantPage, deleteTenant, changeTenantStatus, } from '@/api/tenant/tenant.api';
import TenantForm from './TenantForm.vue';
import TenantDetail from './TenantDetail.vue';
import TenantPackage from './TenantPackage.vue';
// ========== 状态常量（与后端约定字段值） ==========
const TENANT_STATUS_NORMAL = '0';
const TENANT_STATUS_DISABLED = '1';
/** 租户状态 tag 类型 */
const getTenantStatusTagType = (val) => val === TENANT_STATUS_NORMAL ? 'success' : 'danger';
/** 租户状态文本 */
const getTenantStatusLabel = (val) => val === TENANT_STATUS_NORMAL ? '正常' : '停用';
/** 租户状态切换操作文本 */
const getTenantStatusToggleLabel = (val) => val === TENANT_STATUS_NORMAL ? '停用' : '启用';
// 状态
const loading = ref(false);
const tenantList = ref([]);
const total = ref(0);
const packageList = ref([]);
const formVisible = ref(false);
const detailVisible = ref(false);
const packageVisible = ref(false);
const currentTenant = ref(null);
const currentTenantId = ref();
// 查询参数
const queryParams = reactive({
    keyword: '',
    status: undefined,
    packageId: undefined,
    pageNum: 1,
    pageSize: 10,
});
// 获取状态标签
function getStatusLabel(status) {
    return TenantStatusEnum[status]?.label || status;
}
// 获取状态类型
function getStatusType(status) {
    const typeMap = {
        '0': 'success',
        '1': 'danger',
        '2': 'warning',
    };
    return typeMap[status] || 'info';
}
// 加载租户列表
async function fetchTenantList() {
    loading.value = true;
    try {
        const res = await getTenantPage(queryParams);
        tenantList.value = res.rows;
        total.value = res.total;
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    queryParams.pageNum = 1;
    fetchTenantList();
}
// 重置查询
function resetQuery() {
    queryParams.keyword = '';
    queryParams.status = undefined;
    queryParams.packageId = undefined;
    queryParams.pageNum = 1;
    handleQuery();
}
// 刷新表格
function refreshTable() {
    fetchTenantList();
}
// 新增
function handleAdd() {
    currentTenant.value = null;
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    currentTenant.value = { ...row };
    formVisible.value = true;
}
// 详情
function handleDetail(row) {
    currentTenantId.value = row.tenantId;
    detailVisible.value = true;
}
// 套餐配置
function handlePackage(row) {
    currentTenantId.value = row.tenantId;
    packageVisible.value = true;
}
// 修改状态
async function handleChangeStatus(row) {
    const newStatus = row.status === TENANT_STATUS_NORMAL ? TENANT_STATUS_DISABLED : TENANT_STATUS_NORMAL;
    const actionLabel = getTenantStatusToggleLabel(row.status);
    try {
        await ElMessageBox.confirm(`是否确认${actionLabel}租户"${row.tenantName}"？`, '提示', {
            type: 'warning',
        });
        await changeTenantStatus(row.tenantId, newStatus);
        ElMessage.success(`${actionLabel}成功`);
        fetchTenantList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error(`[TenantList] handleChangeStatus failed:`, error);
            ElMessage.error(`${actionLabel}失败，请重试`);
        }
    }
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除租户"${row.tenantName}"？`, '提示', {
            type: 'warning',
        });
        await deleteTenant(row.tenantId);
        ElMessage.success('删除成功');
        fetchTenantList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 导出
async function handleExport() {
    ElMessage.info('导出功能开发中');
}
// 初始化
onMounted(() => {
    fetchTenantList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tenant-list" },
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
    placeholder: "请输入租户名称/编码/联系人",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.queryParams.keyword),
    placeholder: "请输入租户名称/编码/联系人",
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
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "到期",
    value: "2",
}));
const __VLS_38 = __VLS_37({
    label: "到期",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
var __VLS_23;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "套餐",
    prop: "packageId",
}));
const __VLS_42 = __VLS_41({
    label: "套餐",
    prop: "packageId",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.queryParams.packageId),
    placeholder: "请选择套餐",
    clearable: true,
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.queryParams.packageId),
    placeholder: "请选择套餐",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
for (const [pkg] of __VLS_getVForSourceType((__VLS_ctx.packageList))) {
    const __VLS_48 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }));
    const __VLS_50 = __VLS_49({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
}
var __VLS_47;
var __VLS_43;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_67.slots.default;
var __VLS_67;
var __VLS_55;
var __VLS_7;
var __VLS_3;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    shadow: "never",
    ...{ class: "table-card" },
}));
const __VLS_74 = __VLS_73({
    shadow: "never",
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_75.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "table-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "left" },
    });
    const __VLS_76 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (__VLS_ctx.handleAdd)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:add']) }, null, null);
    __VLS_79.slots.default;
    var __VLS_79;
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (__VLS_ctx.handleExport)
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:export']) }, null, null);
    __VLS_87.slots.default;
    var __VLS_87;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right" },
    });
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Refresh),
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (__VLS_ctx.refreshTable)
    };
    var __VLS_95;
}
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    data: (__VLS_ctx.tenantList),
    stripe: true,
    border: true,
}));
const __VLS_102 = __VLS_101({
    data: (__VLS_ctx.tenantList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_103.slots.default;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "tenantId",
    label: "租户ID",
    width: "80",
}));
const __VLS_106 = __VLS_105({
    prop: "tenantId",
    label: "租户ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "tenantName",
    label: "租户名称",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_110 = __VLS_109({
    prop: "tenantName",
    label: "租户名称",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "tenantCode",
    label: "租户编码",
    width: "120",
}));
const __VLS_114 = __VLS_113({
    prop: "tenantCode",
    label: "租户编码",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "contact",
    label: "联系人",
    width: "100",
}));
const __VLS_118 = __VLS_117({
    prop: "contact",
    label: "联系人",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "contactPhone",
    label: "联系电话",
    width: "120",
}));
const __VLS_122 = __VLS_121({
    prop: "contactPhone",
    label: "联系电话",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "packageName",
    label: "套餐",
    width: "100",
}));
const __VLS_126 = __VLS_125({
    prop: "packageName",
    label: "套餐",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_127.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_128 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        type: "info",
    }));
    const __VLS_130 = __VLS_129({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (row.packageName);
    var __VLS_131;
}
var __VLS_127;
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "userLimit",
    label: "用户数/上限",
    width: "100",
}));
const __VLS_134 = __VLS_133({
    prop: "userLimit",
    label: "用户数/上限",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.userCount);
    (row.userLimit);
}
var __VLS_135;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    prop: "expireTime",
    label: "到期时间",
    width: "170",
}));
const __VLS_138 = __VLS_137({
    prop: "expireTime",
    label: "到期时间",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_142 = __VLS_141({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_143.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_144 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        type: (__VLS_ctx.getStatusType(row.status)),
    }));
    const __VLS_146 = __VLS_145({
        type: (__VLS_ctx.getStatusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    (__VLS_ctx.getStatusLabel(row.status));
    var __VLS_147;
}
var __VLS_143;
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    prop: "domain",
    label: "域名",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_150 = __VLS_149({
    prop: "domain",
    label: "域名",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    prop: "createTime",
    label: "创建时间",
    width: "170",
}));
const __VLS_154 = __VLS_153({
    prop: "createTime",
    label: "创建时间",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const __VLS_156 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "操作",
    width: "280",
    fixed: "right",
}));
const __VLS_158 = __VLS_157({
    label: "操作",
    width: "280",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_159.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDetail(row);
        }
    };
    __VLS_163.slots.default;
    var __VLS_163;
    const __VLS_168 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:edit']) }, null, null);
    __VLS_171.slots.default;
    var __VLS_171;
    const __VLS_176 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handlePackage(row);
        }
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:package']) }, null, null);
    __VLS_179.slots.default;
    var __VLS_179;
    const __VLS_184 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        trigger: "click",
    }));
    const __VLS_186 = __VLS_185({
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    const __VLS_188 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.More),
    }));
    const __VLS_190 = __VLS_189({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.More),
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    var __VLS_191;
    {
        const { dropdown: __VLS_thisSlot } = __VLS_187.slots;
        const __VLS_192 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
        const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
        __VLS_195.slots.default;
        const __VLS_196 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            ...{ 'onClick': {} },
        }));
        const __VLS_198 = __VLS_197({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        let __VLS_200;
        let __VLS_201;
        let __VLS_202;
        const __VLS_203 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleChangeStatus(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:status']) }, null, null);
        __VLS_199.slots.default;
        (__VLS_ctx.getTenantStatusToggleLabel(row.status));
        var __VLS_199;
        const __VLS_204 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            ...{ 'onClick': {} },
        }));
        const __VLS_206 = __VLS_205({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        let __VLS_208;
        let __VLS_209;
        let __VLS_210;
        const __VLS_211 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleDelete(row);
            }
        };
        __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(null, { ...__VLS_directiveBindingRestFields, value: (['tenant:tenant:delete']) }, null, null);
        __VLS_207.slots.default;
        var __VLS_207;
        var __VLS_195;
    }
    var __VLS_187;
}
var __VLS_159;
var __VLS_103;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_212 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_214 = __VLS_213({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.queryParams.pageNum),
    pageSize: (__VLS_ctx.queryParams.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
let __VLS_216;
let __VLS_217;
let __VLS_218;
const __VLS_219 = {
    onSizeChange: (__VLS_ctx.handleQuery)
};
const __VLS_220 = {
    onCurrentChange: (__VLS_ctx.handleQuery)
};
var __VLS_215;
var __VLS_75;
/** @type {[typeof TenantForm, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(TenantForm, new TenantForm({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    tenantData: (__VLS_ctx.currentTenant),
}));
const __VLS_222 = __VLS_221({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.formVisible),
    tenantData: (__VLS_ctx.currentTenant),
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
let __VLS_224;
let __VLS_225;
let __VLS_226;
const __VLS_227 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_223;
/** @type {[typeof TenantDetail, ]} */ ;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(TenantDetail, new TenantDetail({
    modelValue: (__VLS_ctx.detailVisible),
    tenantId: (__VLS_ctx.currentTenantId),
}));
const __VLS_229 = __VLS_228({
    modelValue: (__VLS_ctx.detailVisible),
    tenantId: (__VLS_ctx.currentTenantId),
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
/** @type {[typeof TenantPackage, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(TenantPackage, new TenantPackage({
    modelValue: (__VLS_ctx.packageVisible),
    tenantId: (__VLS_ctx.currentTenantId),
}));
const __VLS_232 = __VLS_231({
    modelValue: (__VLS_ctx.packageVisible),
    tenantId: (__VLS_ctx.currentTenantId),
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
/** @type {__VLS_StyleScopedClasses['tenant-list']} */ ;
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
            TenantForm: TenantForm,
            TenantDetail: TenantDetail,
            TenantPackage: TenantPackage,
            getTenantStatusToggleLabel: getTenantStatusToggleLabel,
            loading: loading,
            tenantList: tenantList,
            total: total,
            packageList: packageList,
            formVisible: formVisible,
            detailVisible: detailVisible,
            packageVisible: packageVisible,
            currentTenant: currentTenant,
            currentTenantId: currentTenantId,
            queryParams: queryParams,
            getStatusLabel: getStatusLabel,
            getStatusType: getStatusType,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            refreshTable: refreshTable,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDetail: handleDetail,
            handlePackage: handlePackage,
            handleChangeStatus: handleChangeStatus,
            handleDelete: handleDelete,
            handleExport: handleExport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TenantList.vue.js.map