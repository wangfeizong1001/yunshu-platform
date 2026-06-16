import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { getThirdConfigList, updateThirdConfig } from '@/api/system/third.api';
// 状态常量
const THIRD_CONFIG_ENABLED = '1';
const THIRD_CONFIG_DISABLED = '0';
const getThirdConfigStatusTagType = (val) => val === THIRD_CONFIG_ENABLED ? 'success' : 'danger';
const getThirdConfigStatusLabel = (val) => val === THIRD_CONFIG_ENABLED ? '启用' : '禁用';
// 状态
const loading = ref(false);
const formLoading = ref(false);
const configList = ref([]);
const queryParams = reactive({
    platform: undefined,
    status: undefined,
});
const formVisible = ref(false);
const formRef = ref();
const form = reactive({
    id: 0,
    platform: 'wechat',
    appId: '',
    appSecret: '',
    callbackUrl: '',
    scopes: [],
    status: THIRD_CONFIG_ENABLED,
    remark: '',
});
const rules = {
    platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
    appId: [{ required: true, message: '请输入 App ID', trigger: 'blur' }],
    appSecret: [{ required: true, message: '请输入 App Secret', trigger: 'blur' }],
    callbackUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }],
};
// 获取平台名称
function getPlatformName(platform) {
    const platformMap = {
        wechat: '微信',
        github: 'GitHub',
        wecom: '企业微信',
        dingtalk: '钉钉',
    };
    return platformMap[platform] || platform;
}
// 获取平台标签类型
function getPlatformTag(platform) {
    const tagMap = {
        wechat: 'success',
        github: 'info',
        wecom: 'warning',
        dingtalk: 'primary',
    };
    return tagMap[platform] || 'info';
}
// 加载配置列表
async function loadConfigList() {
    loading.value = true;
    try {
        const res = await getThirdConfigList();
        configList.value = res;
    }
    finally {
        loading.value = false;
    }
}
// 查询
function handleQuery() {
    loadConfigList();
}
// 重置查询
function resetQuery() {
    queryParams.platform = undefined;
    queryParams.status = undefined;
    loadConfigList();
}
// 新增
function handleAdd() {
    form.id = 0;
    form.platform = 'wechat';
    form.appId = '';
    form.appSecret = '';
    form.callbackUrl = '';
    form.scopes = [];
    form.status = '1';
    form.remark = '';
    formVisible.value = true;
}
// 编辑
function handleEdit(row) {
    Object.assign(form, row);
    formVisible.value = true;
}
// 保存
async function handleSave() {
    try {
        await formRef.value?.validate();
        formLoading.value = true;
        await updateThirdConfig(form);
        ElMessage.success('保存成功');
        formVisible.value = false;
        loadConfigList();
    }
    catch (error) {
        console.error('保存失败', error);
    }
    finally {
        formLoading.value = false;
    }
}
// 删除
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除"${getPlatformName(row.platform)}"配置？`, '提示', { type: 'warning' });
        ElMessage.success('删除成功');
        loadConfigList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败', error);
        }
    }
}
// 授权
async function handleAuthorize(_row) {
    try {
        ElMessage.info('授权功能开发中');
    }
    catch (error) {
        console.error('获取授权链接失败', error);
    }
}
// 测试连接
async function handleTestConnection(_row) {
    try {
        ElMessage.info('测试连接功能开发中');
    }
    catch (error) {
        console.error('测试连接失败', error);
    }
}
// 初始化
onMounted(() => {
    loadConfigList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "third-config" },
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
    label: "平台",
    prop: "platform",
}));
const __VLS_10 = __VLS_9({
    label: "平台",
    prop: "platform",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.queryParams.platform),
    placeholder: "请选择平台",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.queryParams.platform),
    placeholder: "请选择平台",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "微信",
    value: "wechat",
}));
const __VLS_18 = __VLS_17({
    label: "微信",
    value: "wechat",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "GitHub",
    value: "github",
}));
const __VLS_22 = __VLS_21({
    label: "GitHub",
    value: "github",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "企业微信",
    value: "wecom",
}));
const __VLS_26 = __VLS_25({
    label: "企业微信",
    value: "wecom",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "钉钉",
    value: "dingtalk",
}));
const __VLS_30 = __VLS_29({
    label: "钉钉",
    value: "dingtalk",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_15;
var __VLS_11;
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
    label: "启用",
    value: "1",
}));
const __VLS_42 = __VLS_41({
    label: "启用",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "禁用",
    value: "0",
}));
const __VLS_46 = __VLS_45({
    label: "禁用",
    value: "0",
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
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
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
    __VLS_75.slots.default;
    var __VLS_75;
}
const __VLS_80 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    data: (__VLS_ctx.configList),
    stripe: true,
    border: true,
}));
const __VLS_82 = __VLS_81({
    data: (__VLS_ctx.configList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_83.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "id",
    label: "配置ID",
    width: "100",
}));
const __VLS_86 = __VLS_85({
    prop: "id",
    label: "配置ID",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "platform",
    label: "平台",
    width: "120",
}));
const __VLS_90 = __VLS_89({
    prop: "platform",
    label: "平台",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        type: (__VLS_ctx.getPlatformTag(row.platform)),
    }));
    const __VLS_94 = __VLS_93({
        type: (__VLS_ctx.getPlatformTag(row.platform)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (__VLS_ctx.getPlatformName(row.platform));
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "appId",
    label: "App ID",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_98 = __VLS_97({
    prop: "appId",
    label: "App ID",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "callbackUrl",
    label: "回调地址",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_102 = __VLS_101({
    prop: "callbackUrl",
    label: "回调地址",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "scopes",
    label: "权限范围",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_106 = __VLS_105({
    prop: "scopes",
    label: "权限范围",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.scopes?.join(', ') || '-');
}
var __VLS_107;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_110 = __VLS_109({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        type: (__VLS_ctx.getThirdConfigStatusTagType(row.status)),
        size: "small",
    }));
    const __VLS_114 = __VLS_113({
        type: (__VLS_ctx.getThirdConfigStatusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    (__VLS_ctx.getThirdConfigStatusLabel(row.status));
    var __VLS_115;
}
var __VLS_111;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "remark",
    label: "备注",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_118 = __VLS_117({
    prop: "remark",
    label: "备注",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "操作",
    width: "250",
    fixed: "right",
}));
const __VLS_122 = __VLS_121({
    label: "操作",
    width: "250",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
    __VLS_127.slots.default;
    var __VLS_127;
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleAuthorize(row);
        }
    };
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleTestConnection(row);
        }
    };
    __VLS_143.slots.default;
    var __VLS_143;
    const __VLS_148 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_152;
    let __VLS_153;
    let __VLS_154;
    const __VLS_155 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_151.slots.default;
    var __VLS_151;
}
var __VLS_123;
var __VLS_83;
var __VLS_71;
const __VLS_156 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.form.id ? '编辑配置' : '新增配置'),
    width: "600px",
    appendToBody: true,
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.form.id ? '编辑配置' : '新增配置'),
    width: "600px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_162 = __VLS_161({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_164 = {};
__VLS_163.slots.default;
const __VLS_166 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    label: "平台",
    prop: "platform",
}));
const __VLS_168 = __VLS_167({
    label: "平台",
    prop: "platform",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
const __VLS_170 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    modelValue: (__VLS_ctx.form.platform),
    placeholder: "请选择平台",
    disabled: (!!__VLS_ctx.form.id),
}));
const __VLS_172 = __VLS_171({
    modelValue: (__VLS_ctx.form.platform),
    placeholder: "请选择平台",
    disabled: (!!__VLS_ctx.form.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
__VLS_173.slots.default;
const __VLS_174 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    label: "微信",
    value: "wechat",
}));
const __VLS_176 = __VLS_175({
    label: "微信",
    value: "wechat",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
const __VLS_178 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    label: "GitHub",
    value: "github",
}));
const __VLS_180 = __VLS_179({
    label: "GitHub",
    value: "github",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const __VLS_182 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    label: "企业微信",
    value: "wecom",
}));
const __VLS_184 = __VLS_183({
    label: "企业微信",
    value: "wecom",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const __VLS_186 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
    label: "钉钉",
    value: "dingtalk",
}));
const __VLS_188 = __VLS_187({
    label: "钉钉",
    value: "dingtalk",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
var __VLS_173;
var __VLS_169;
const __VLS_190 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    label: "App ID",
    prop: "appId",
}));
const __VLS_192 = __VLS_191({
    label: "App ID",
    prop: "appId",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
__VLS_193.slots.default;
const __VLS_194 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    modelValue: (__VLS_ctx.form.appId),
    placeholder: "请输入 App ID",
}));
const __VLS_196 = __VLS_195({
    modelValue: (__VLS_ctx.form.appId),
    placeholder: "请输入 App ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
var __VLS_193;
const __VLS_198 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    label: "App Secret",
    prop: "appSecret",
}));
const __VLS_200 = __VLS_199({
    label: "App Secret",
    prop: "appSecret",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
const __VLS_202 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    modelValue: (__VLS_ctx.form.appSecret),
    placeholder: "请输入 App Secret",
    showPassword: true,
}));
const __VLS_204 = __VLS_203({
    modelValue: (__VLS_ctx.form.appSecret),
    placeholder: "请输入 App Secret",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
var __VLS_201;
const __VLS_206 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    label: "回调地址",
    prop: "callbackUrl",
}));
const __VLS_208 = __VLS_207({
    label: "回调地址",
    prop: "callbackUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
const __VLS_210 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
    modelValue: (__VLS_ctx.form.callbackUrl),
    placeholder: "请输入回调地址",
}));
const __VLS_212 = __VLS_211({
    modelValue: (__VLS_ctx.form.callbackUrl),
    placeholder: "请输入回调地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
var __VLS_209;
const __VLS_214 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
    label: "权限范围",
    prop: "scopes",
}));
const __VLS_216 = __VLS_215({
    label: "权限范围",
    prop: "scopes",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
__VLS_217.slots.default;
const __VLS_218 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
    modelValue: (__VLS_ctx.form.scopes),
    multiple: true,
    placeholder: "请选择权限范围",
    ...{ style: {} },
}));
const __VLS_220 = __VLS_219({
    modelValue: (__VLS_ctx.form.scopes),
    multiple: true,
    placeholder: "请选择权限范围",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
__VLS_221.slots.default;
const __VLS_222 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    label: "snsapi_login",
    value: "snsapi_login",
}));
const __VLS_224 = __VLS_223({
    label: "snsapi_login",
    value: "snsapi_login",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
const __VLS_226 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
    label: "snsapi_base",
    value: "snsapi_base",
}));
const __VLS_228 = __VLS_227({
    label: "snsapi_base",
    value: "snsapi_base",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const __VLS_230 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
    label: "snsapi_privateinfo",
    value: "snsapi_privateinfo",
}));
const __VLS_232 = __VLS_231({
    label: "snsapi_privateinfo",
    value: "snsapi_privateinfo",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
const __VLS_234 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
    label: "user:email",
    value: "user:email",
}));
const __VLS_236 = __VLS_235({
    label: "user:email",
    value: "user:email",
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
var __VLS_221;
var __VLS_217;
const __VLS_238 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
    label: "状态",
    prop: "status",
}));
const __VLS_240 = __VLS_239({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
__VLS_241.slots.default;
const __VLS_242 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    modelValue: (__VLS_ctx.form.status),
}));
const __VLS_244 = __VLS_243({
    modelValue: (__VLS_ctx.form.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
__VLS_245.slots.default;
const __VLS_246 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
    label: "1",
}));
const __VLS_248 = __VLS_247({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
__VLS_249.slots.default;
var __VLS_249;
const __VLS_250 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
    label: "0",
}));
const __VLS_252 = __VLS_251({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
__VLS_253.slots.default;
var __VLS_253;
var __VLS_245;
var __VLS_241;
const __VLS_254 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    label: "备注",
    prop: "remark",
}));
const __VLS_256 = __VLS_255({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
const __VLS_258 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_260 = __VLS_259({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
var __VLS_257;
var __VLS_163;
{
    const { footer: __VLS_thisSlot } = __VLS_159.slots;
    const __VLS_262 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
        ...{ 'onClick': {} },
    }));
    const __VLS_264 = __VLS_263({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    let __VLS_266;
    let __VLS_267;
    let __VLS_268;
    const __VLS_269 = {
        onClick: (...[$event]) => {
            __VLS_ctx.formVisible = false;
        }
    };
    __VLS_265.slots.default;
    var __VLS_265;
    const __VLS_270 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.formLoading),
    }));
    const __VLS_272 = __VLS_271({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.formLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_271));
    let __VLS_274;
    let __VLS_275;
    let __VLS_276;
    const __VLS_277 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_273.slots.default;
    var __VLS_273;
}
var __VLS_159;
/** @type {__VLS_StyleScopedClasses['third-config']} */ ;
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
// @ts-ignore
var __VLS_165 = __VLS_164;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Refresh: Refresh,
            Plus: Plus,
            getThirdConfigStatusTagType: getThirdConfigStatusTagType,
            getThirdConfigStatusLabel: getThirdConfigStatusLabel,
            loading: loading,
            formLoading: formLoading,
            configList: configList,
            queryParams: queryParams,
            formVisible: formVisible,
            formRef: formRef,
            form: form,
            rules: rules,
            getPlatformName: getPlatformName,
            getPlatformTag: getPlatformTag,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleSave: handleSave,
            handleDelete: handleDelete,
            handleAuthorize: handleAuthorize,
            handleTestConnection: handleTestConnection,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ThirdConfig.vue.js.map