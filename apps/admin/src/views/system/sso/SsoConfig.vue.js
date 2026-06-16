import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Plus } from '@element-plus/icons-vue';
import { getSsoConfig, saveSsoConfig } from '@/api/system/sso.api';
import { getMockSsoAppPage } from '@/mock/system/sso.mock';
// 应用状态常量
const SSO_APP_ENABLED = '1';
const SSO_APP_DISABLED = '0';
const getSsoAppStatusTagType = (val) => val === SSO_APP_ENABLED ? 'success' : 'danger';
const getSsoAppStatusLabel = (val) => val === SSO_APP_ENABLED ? '启用' : '禁用';
// 全局配置相关
const config = reactive({
    type: 'oauth2',
    enabled: false,
    title: '',
    defaultRedirectUrl: '',
    logoutUrl: '',
    sessionTimeout: 7200,
});
const configVisible = ref(false);
const configLoading = ref(false);
const configFormRef = ref();
const configForm = reactive({ ...config });
const configRules = {
    type: [{ required: true, message: '请选择 SSO 类型', trigger: 'change' }],
    title: [{ required: true, message: '请输入登录页面标题', trigger: 'blur' }],
};
// 应用相关
const appLoading = ref(false);
const appList = ref([]);
const appTotal = ref(0);
const appQueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
});
const appVisible = ref(false);
const appFormRef = ref();
const appForm = reactive({
    id: 0,
    appName: '',
    appCode: '',
    appType: 'oauth2',
    clientId: '',
    clientSecret: '',
    authorizationUrl: '',
    tokenUrl: '',
    userInfoUrl: '',
    scopes: [],
    logo: '',
    status: SSO_APP_ENABLED,
    remark: '',
});
const appRules = {
    appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
    appCode: [{ required: true, message: '请输入应用编码', trigger: 'blur' }],
    appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
};
// 获取 SSO 类型名称
function getSsoTypeName(type) {
    const typeMap = {
        oauth2: 'OAuth2.0',
        cas: 'CAS',
        ldap: 'LDAP',
    };
    return typeMap[type] || type;
}
// 获取应用类型名称
function getAppTypeName(type) {
    return getSsoTypeName(type);
}
// 加载全局配置
async function loadConfig() {
    try {
        const res = await getSsoConfig();
        Object.assign(config, res);
        Object.assign(configForm, res);
    }
    catch (error) {
        console.error('加载配置失败', error);
    }
}
// 加载应用列表
async function loadAppList() {
    appLoading.value = true;
    try {
        const res = getMockSsoAppPage(appQueryParams);
        appList.value = res.rows;
        appTotal.value = res.total;
    }
    finally {
        appLoading.value = false;
    }
}
// 修改全局配置
function handleEditConfig() {
    Object.assign(configForm, config);
    configVisible.value = true;
}
// 保存全局配置
async function handleSaveConfig() {
    try {
        await configFormRef.value?.validate();
        configLoading.value = true;
        await saveSsoConfig(configForm);
        ElMessage.success('保存成功');
        configVisible.value = false;
        loadConfig();
    }
    catch (error) {
        console.error('保存配置失败', error);
    }
    finally {
        configLoading.value = false;
    }
}
// 新增应用
function handleAddApp() {
    appForm.id = 0;
    appForm.appName = '';
    appForm.appCode = '';
    appForm.appType = 'oauth2';
    appForm.clientId = '';
    appForm.clientSecret = '';
    appForm.authorizationUrl = '';
    appForm.tokenUrl = '';
    appForm.userInfoUrl = '';
    appForm.scopes = [];
    appForm.logo = '';
    appForm.status = '1';
    appForm.remark = '';
    appVisible.value = true;
}
// 编辑应用
function handleEditApp(row) {
    Object.assign(appForm, row);
    appVisible.value = true;
}
// 保存应用
async function handleSaveApp() {
    try {
        await appFormRef.value?.validate();
        appLoading.value = true;
        ElMessage.success('保存成功');
        appVisible.value = false;
        loadAppList();
    }
    catch (error) {
        console.error('保存应用失败', error);
    }
    finally {
        appLoading.value = false;
    }
}
// 删除应用
async function handleDeleteApp(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除应用"${row.appName}"？`, '提示', { type: 'warning' });
        ElMessage.success('删除成功');
        loadAppList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除应用失败', error);
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
    loadConfig();
    loadAppList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sso-config" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "config-card" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "config-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Edit),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Edit),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.handleEditConfig)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
const __VLS_12 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    column: (2),
    border: true,
}));
const __VLS_14 = __VLS_13({
    column: (2),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "SSO 类型",
}));
const __VLS_18 = __VLS_17({
    label: "SSO 类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
(__VLS_ctx.getSsoTypeName(__VLS_ctx.config.type));
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "状态",
}));
const __VLS_26 = __VLS_25({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    type: (__VLS_ctx.config.enabled ? 'success' : 'danger'),
}));
const __VLS_30 = __VLS_29({
    type: (__VLS_ctx.config.enabled ? 'success' : 'danger'),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
(__VLS_ctx.config.enabled ? '已启用' : '已禁用');
var __VLS_31;
var __VLS_27;
const __VLS_32 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "登录页面标题",
    span: (2),
}));
const __VLS_34 = __VLS_33({
    label: "登录页面标题",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
(__VLS_ctx.config.title || '-');
var __VLS_35;
const __VLS_36 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "默认跳转URL",
    span: (2),
}));
const __VLS_38 = __VLS_37({
    label: "默认跳转URL",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
(__VLS_ctx.config.defaultRedirectUrl || '-');
var __VLS_39;
const __VLS_40 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "会话超时时间",
}));
const __VLS_42 = __VLS_41({
    label: "会话超时时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
(__VLS_ctx.config.sessionTimeout ? `${__VLS_ctx.config.sessionTimeout / 60} 分钟` : '-');
var __VLS_43;
const __VLS_44 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "登出地址",
}));
const __VLS_46 = __VLS_45({
    label: "登出地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
(__VLS_ctx.config.logoutUrl || '-');
var __VLS_47;
var __VLS_15;
var __VLS_3;
const __VLS_48 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    shadow: "never",
    ...{ class: "app-card" },
}));
const __VLS_50 = __VLS_49({
    shadow: "never",
    ...{ class: "app-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_51.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (__VLS_ctx.handleAddApp)
    };
    __VLS_55.slots.default;
    var __VLS_55;
}
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.appList),
    stripe: true,
    border: true,
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.appList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.appLoading) }, null, null);
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "id",
    label: "应用ID",
    width: "80",
}));
const __VLS_66 = __VLS_65({
    prop: "id",
    label: "应用ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "appName",
    label: "应用名称",
    width: "150",
}));
const __VLS_70 = __VLS_69({
    prop: "appName",
    label: "应用名称",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "appCode",
    label: "应用编码",
    width: "120",
}));
const __VLS_74 = __VLS_73({
    prop: "appCode",
    label: "应用编码",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "appType",
    label: "类型",
    width: "100",
}));
const __VLS_78 = __VLS_77({
    prop: "appType",
    label: "类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        size: "small",
    }));
    const __VLS_82 = __VLS_81({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (__VLS_ctx.getAppTypeName(row.appType));
    var __VLS_83;
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "clientId",
    label: "Client ID",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_86 = __VLS_85({
    prop: "clientId",
    label: "Client ID",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "scopes",
    label: "权限范围",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_90 = __VLS_89({
    prop: "scopes",
    label: "权限范围",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.scopes?.join(', ') || '-');
}
var __VLS_91;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_94 = __VLS_93({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (__VLS_ctx.getSsoAppStatusTagType(row.status)),
        size: "small",
    }));
    const __VLS_98 = __VLS_97({
        type: (__VLS_ctx.getSsoAppStatusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (__VLS_ctx.getSsoAppStatusLabel(row.status));
    var __VLS_99;
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "操作",
    width: "250",
    fixed: "right",
}));
const __VLS_102 = __VLS_101({
    label: "操作",
    width: "250",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEditApp(row);
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleAuthorize(row);
        }
    };
    __VLS_115.slots.default;
    var __VLS_115;
    const __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleTestConnection(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDeleteApp(row);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
var __VLS_103;
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination" },
});
const __VLS_136 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.appQueryParams.pageNum),
    pageSize: (__VLS_ctx.appQueryParams.pageSize),
    total: (__VLS_ctx.appTotal),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_138 = __VLS_137({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.appQueryParams.pageNum),
    pageSize: (__VLS_ctx.appQueryParams.pageSize),
    total: (__VLS_ctx.appTotal),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_140;
let __VLS_141;
let __VLS_142;
const __VLS_143 = {
    onSizeChange: (__VLS_ctx.loadAppList)
};
const __VLS_144 = {
    onCurrentChange: (__VLS_ctx.loadAppList)
};
var __VLS_139;
var __VLS_51;
const __VLS_145 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.configVisible),
    title: "修改 SSO 配置",
    width: "500px",
    appendToBody: true,
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.configVisible),
    title: "修改 SSO 配置",
    width: "500px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    ref: "configFormRef",
    model: (__VLS_ctx.configForm),
    rules: (__VLS_ctx.configRules),
    labelWidth: "120px",
}));
const __VLS_151 = __VLS_150({
    ref: "configFormRef",
    model: (__VLS_ctx.configForm),
    rules: (__VLS_ctx.configRules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
/** @type {typeof __VLS_ctx.configFormRef} */ ;
var __VLS_153 = {};
__VLS_152.slots.default;
const __VLS_155 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    label: "SSO 类型",
    prop: "type",
}));
const __VLS_157 = __VLS_156({
    label: "SSO 类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
const __VLS_159 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    modelValue: (__VLS_ctx.configForm.type),
    placeholder: "请选择 SSO 类型",
}));
const __VLS_161 = __VLS_160({
    modelValue: (__VLS_ctx.configForm.type),
    placeholder: "请选择 SSO 类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    label: "OAuth2.0",
    value: "oauth2",
}));
const __VLS_165 = __VLS_164({
    label: "OAuth2.0",
    value: "oauth2",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
const __VLS_167 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "CAS",
    value: "cas",
}));
const __VLS_169 = __VLS_168({
    label: "CAS",
    value: "cas",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
const __VLS_171 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    label: "LDAP",
    value: "ldap",
}));
const __VLS_173 = __VLS_172({
    label: "LDAP",
    value: "ldap",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
var __VLS_162;
var __VLS_158;
const __VLS_175 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    label: "启用SSO",
    prop: "enabled",
}));
const __VLS_177 = __VLS_176({
    label: "启用SSO",
    prop: "enabled",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
const __VLS_179 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    modelValue: (__VLS_ctx.configForm.enabled),
}));
const __VLS_181 = __VLS_180({
    modelValue: (__VLS_ctx.configForm.enabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
var __VLS_178;
const __VLS_183 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    label: "登录页面标题",
    prop: "title",
}));
const __VLS_185 = __VLS_184({
    label: "登录页面标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
__VLS_186.slots.default;
const __VLS_187 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    modelValue: (__VLS_ctx.configForm.title),
    placeholder: "请输入登录页面标题",
}));
const __VLS_189 = __VLS_188({
    modelValue: (__VLS_ctx.configForm.title),
    placeholder: "请输入登录页面标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
var __VLS_186;
const __VLS_191 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    label: "默认跳转URL",
    prop: "defaultRedirectUrl",
}));
const __VLS_193 = __VLS_192({
    label: "默认跳转URL",
    prop: "defaultRedirectUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
__VLS_194.slots.default;
const __VLS_195 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    modelValue: (__VLS_ctx.configForm.defaultRedirectUrl),
    placeholder: "请输入默认跳转URL",
}));
const __VLS_197 = __VLS_196({
    modelValue: (__VLS_ctx.configForm.defaultRedirectUrl),
    placeholder: "请输入默认跳转URL",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
var __VLS_194;
const __VLS_199 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
    label: "登出地址",
    prop: "logoutUrl",
}));
const __VLS_201 = __VLS_200({
    label: "登出地址",
    prop: "logoutUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
__VLS_202.slots.default;
const __VLS_203 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
    modelValue: (__VLS_ctx.configForm.logoutUrl),
    placeholder: "请输入登出地址",
}));
const __VLS_205 = __VLS_204({
    modelValue: (__VLS_ctx.configForm.logoutUrl),
    placeholder: "请输入登出地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
var __VLS_202;
const __VLS_207 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
    label: "会话超时(秒)",
    prop: "sessionTimeout",
}));
const __VLS_209 = __VLS_208({
    label: "会话超时(秒)",
    prop: "sessionTimeout",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
__VLS_210.slots.default;
const __VLS_211 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
    modelValue: (__VLS_ctx.configForm.sessionTimeout),
    min: (300),
    max: (86400),
}));
const __VLS_213 = __VLS_212({
    modelValue: (__VLS_ctx.configForm.sessionTimeout),
    min: (300),
    max: (86400),
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
var __VLS_210;
var __VLS_152;
{
    const { footer: __VLS_thisSlot } = __VLS_148.slots;
    const __VLS_215 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
        ...{ 'onClick': {} },
    }));
    const __VLS_217 = __VLS_216({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    let __VLS_219;
    let __VLS_220;
    let __VLS_221;
    const __VLS_222 = {
        onClick: (...[$event]) => {
            __VLS_ctx.configVisible = false;
        }
    };
    __VLS_218.slots.default;
    var __VLS_218;
    const __VLS_223 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.configLoading),
    }));
    const __VLS_225 = __VLS_224({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.configLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
    let __VLS_227;
    let __VLS_228;
    let __VLS_229;
    const __VLS_230 = {
        onClick: (__VLS_ctx.handleSaveConfig)
    };
    __VLS_226.slots.default;
    var __VLS_226;
}
var __VLS_148;
const __VLS_231 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    modelValue: (__VLS_ctx.appVisible),
    title: (__VLS_ctx.appForm.id ? '编辑应用' : '新增应用'),
    width: "700px",
    appendToBody: true,
}));
const __VLS_233 = __VLS_232({
    modelValue: (__VLS_ctx.appVisible),
    title: (__VLS_ctx.appForm.id ? '编辑应用' : '新增应用'),
    width: "700px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
__VLS_234.slots.default;
const __VLS_235 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
    ref: "appFormRef",
    model: (__VLS_ctx.appForm),
    rules: (__VLS_ctx.appRules),
    labelWidth: "120px",
}));
const __VLS_237 = __VLS_236({
    ref: "appFormRef",
    model: (__VLS_ctx.appForm),
    rules: (__VLS_ctx.appRules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
/** @type {typeof __VLS_ctx.appFormRef} */ ;
var __VLS_239 = {};
__VLS_238.slots.default;
const __VLS_241 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    gutter: (20),
}));
const __VLS_243 = __VLS_242({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
__VLS_244.slots.default;
const __VLS_245 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
    span: (12),
}));
const __VLS_247 = __VLS_246({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
__VLS_248.slots.default;
const __VLS_249 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
    label: "应用名称",
    prop: "appName",
}));
const __VLS_251 = __VLS_250({
    label: "应用名称",
    prop: "appName",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
__VLS_252.slots.default;
const __VLS_253 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
    modelValue: (__VLS_ctx.appForm.appName),
    placeholder: "请输入应用名称",
}));
const __VLS_255 = __VLS_254({
    modelValue: (__VLS_ctx.appForm.appName),
    placeholder: "请输入应用名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
var __VLS_252;
var __VLS_248;
const __VLS_257 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
    span: (12),
}));
const __VLS_259 = __VLS_258({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
__VLS_260.slots.default;
const __VLS_261 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
    label: "应用编码",
    prop: "appCode",
}));
const __VLS_263 = __VLS_262({
    label: "应用编码",
    prop: "appCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
__VLS_264.slots.default;
const __VLS_265 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
    modelValue: (__VLS_ctx.appForm.appCode),
    placeholder: "请输入应用编码",
    disabled: (!!__VLS_ctx.appForm.id),
}));
const __VLS_267 = __VLS_266({
    modelValue: (__VLS_ctx.appForm.appCode),
    placeholder: "请输入应用编码",
    disabled: (!!__VLS_ctx.appForm.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
var __VLS_264;
var __VLS_260;
var __VLS_244;
const __VLS_269 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
    gutter: (20),
}));
const __VLS_271 = __VLS_270({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_270));
__VLS_272.slots.default;
const __VLS_273 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
    span: (12),
}));
const __VLS_275 = __VLS_274({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_274));
__VLS_276.slots.default;
const __VLS_277 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
    label: "应用类型",
    prop: "appType",
}));
const __VLS_279 = __VLS_278({
    label: "应用类型",
    prop: "appType",
}, ...__VLS_functionalComponentArgsRest(__VLS_278));
__VLS_280.slots.default;
const __VLS_281 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
    modelValue: (__VLS_ctx.appForm.appType),
    placeholder: "请选择应用类型",
}));
const __VLS_283 = __VLS_282({
    modelValue: (__VLS_ctx.appForm.appType),
    placeholder: "请选择应用类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
__VLS_284.slots.default;
const __VLS_285 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
    label: "OAuth2.0",
    value: "oauth2",
}));
const __VLS_287 = __VLS_286({
    label: "OAuth2.0",
    value: "oauth2",
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
const __VLS_289 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
    label: "CAS",
    value: "cas",
}));
const __VLS_291 = __VLS_290({
    label: "CAS",
    value: "cas",
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
const __VLS_293 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
    label: "LDAP",
    value: "ldap",
}));
const __VLS_295 = __VLS_294({
    label: "LDAP",
    value: "ldap",
}, ...__VLS_functionalComponentArgsRest(__VLS_294));
var __VLS_284;
var __VLS_280;
var __VLS_276;
const __VLS_297 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
    span: (12),
}));
const __VLS_299 = __VLS_298({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_298));
__VLS_300.slots.default;
const __VLS_301 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
    label: "状态",
    prop: "status",
}));
const __VLS_303 = __VLS_302({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_302));
__VLS_304.slots.default;
const __VLS_305 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
    modelValue: (__VLS_ctx.appForm.status),
}));
const __VLS_307 = __VLS_306({
    modelValue: (__VLS_ctx.appForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_306));
__VLS_308.slots.default;
const __VLS_309 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
    label: (__VLS_ctx.SSO_APP_ENABLED),
}));
const __VLS_311 = __VLS_310({
    label: (__VLS_ctx.SSO_APP_ENABLED),
}, ...__VLS_functionalComponentArgsRest(__VLS_310));
__VLS_312.slots.default;
var __VLS_312;
const __VLS_313 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent(__VLS_313, new __VLS_313({
    label: (__VLS_ctx.SSO_APP_DISABLED),
}));
const __VLS_315 = __VLS_314({
    label: (__VLS_ctx.SSO_APP_DISABLED),
}, ...__VLS_functionalComponentArgsRest(__VLS_314));
__VLS_316.slots.default;
var __VLS_316;
var __VLS_308;
var __VLS_304;
var __VLS_300;
var __VLS_272;
const __VLS_317 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
    label: "Client ID",
    prop: "clientId",
}));
const __VLS_319 = __VLS_318({
    label: "Client ID",
    prop: "clientId",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
__VLS_320.slots.default;
const __VLS_321 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321({
    modelValue: (__VLS_ctx.appForm.clientId),
    placeholder: "请输入 Client ID",
}));
const __VLS_323 = __VLS_322({
    modelValue: (__VLS_ctx.appForm.clientId),
    placeholder: "请输入 Client ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
var __VLS_320;
const __VLS_325 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_326 = __VLS_asFunctionalComponent(__VLS_325, new __VLS_325({
    label: "Client Secret",
    prop: "clientSecret",
}));
const __VLS_327 = __VLS_326({
    label: "Client Secret",
    prop: "clientSecret",
}, ...__VLS_functionalComponentArgsRest(__VLS_326));
__VLS_328.slots.default;
const __VLS_329 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
    modelValue: (__VLS_ctx.appForm.clientSecret),
    placeholder: "请输入 Client Secret",
    showPassword: true,
}));
const __VLS_331 = __VLS_330({
    modelValue: (__VLS_ctx.appForm.clientSecret),
    placeholder: "请输入 Client Secret",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_330));
var __VLS_328;
const __VLS_333 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent(__VLS_333, new __VLS_333({
    label: "授权地址",
    prop: "authorizationUrl",
}));
const __VLS_335 = __VLS_334({
    label: "授权地址",
    prop: "authorizationUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
__VLS_336.slots.default;
const __VLS_337 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({
    modelValue: (__VLS_ctx.appForm.authorizationUrl),
    placeholder: "请输入授权地址",
}));
const __VLS_339 = __VLS_338({
    modelValue: (__VLS_ctx.appForm.authorizationUrl),
    placeholder: "请输入授权地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_338));
var __VLS_336;
const __VLS_341 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
    label: "Token地址",
    prop: "tokenUrl",
}));
const __VLS_343 = __VLS_342({
    label: "Token地址",
    prop: "tokenUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_342));
__VLS_344.slots.default;
const __VLS_345 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_346 = __VLS_asFunctionalComponent(__VLS_345, new __VLS_345({
    modelValue: (__VLS_ctx.appForm.tokenUrl),
    placeholder: "请输入 Token 地址",
}));
const __VLS_347 = __VLS_346({
    modelValue: (__VLS_ctx.appForm.tokenUrl),
    placeholder: "请输入 Token 地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_346));
var __VLS_344;
const __VLS_349 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
    label: "用户信息地址",
    prop: "userInfoUrl",
}));
const __VLS_351 = __VLS_350({
    label: "用户信息地址",
    prop: "userInfoUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
__VLS_352.slots.default;
const __VLS_353 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent(__VLS_353, new __VLS_353({
    modelValue: (__VLS_ctx.appForm.userInfoUrl),
    placeholder: "请输入用户信息地址",
}));
const __VLS_355 = __VLS_354({
    modelValue: (__VLS_ctx.appForm.userInfoUrl),
    placeholder: "请输入用户信息地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_354));
var __VLS_352;
const __VLS_357 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
    label: "权限范围",
    prop: "scopes",
}));
const __VLS_359 = __VLS_358({
    label: "权限范围",
    prop: "scopes",
}, ...__VLS_functionalComponentArgsRest(__VLS_358));
__VLS_360.slots.default;
const __VLS_361 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361({
    modelValue: (__VLS_ctx.appForm.scopes),
    multiple: true,
    placeholder: "请选择权限范围",
    ...{ style: {} },
}));
const __VLS_363 = __VLS_362({
    modelValue: (__VLS_ctx.appForm.scopes),
    multiple: true,
    placeholder: "请选择权限范围",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_362));
__VLS_364.slots.default;
const __VLS_365 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent(__VLS_365, new __VLS_365({
    label: "user:email",
    value: "user:email",
}));
const __VLS_367 = __VLS_366({
    label: "user:email",
    value: "user:email",
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
const __VLS_369 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
    label: "user:profile",
    value: "user:profile",
}));
const __VLS_371 = __VLS_370({
    label: "user:profile",
    value: "user:profile",
}, ...__VLS_functionalComponentArgsRest(__VLS_370));
const __VLS_373 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
    label: "snsapi_base",
    value: "snsapi_base",
}));
const __VLS_375 = __VLS_374({
    label: "snsapi_base",
    value: "snsapi_base",
}, ...__VLS_functionalComponentArgsRest(__VLS_374));
const __VLS_377 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
    label: "snsapi_privateinfo",
    value: "snsapi_privateinfo",
}));
const __VLS_379 = __VLS_378({
    label: "snsapi_privateinfo",
    value: "snsapi_privateinfo",
}, ...__VLS_functionalComponentArgsRest(__VLS_378));
var __VLS_364;
var __VLS_360;
const __VLS_381 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_382 = __VLS_asFunctionalComponent(__VLS_381, new __VLS_381({
    label: "备注",
    prop: "remark",
}));
const __VLS_383 = __VLS_382({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_382));
__VLS_384.slots.default;
const __VLS_385 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_386 = __VLS_asFunctionalComponent(__VLS_385, new __VLS_385({
    modelValue: (__VLS_ctx.appForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_387 = __VLS_386({
    modelValue: (__VLS_ctx.appForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_386));
var __VLS_384;
var __VLS_238;
{
    const { footer: __VLS_thisSlot } = __VLS_234.slots;
    const __VLS_389 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_390 = __VLS_asFunctionalComponent(__VLS_389, new __VLS_389({
        ...{ 'onClick': {} },
    }));
    const __VLS_391 = __VLS_390({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_390));
    let __VLS_393;
    let __VLS_394;
    let __VLS_395;
    const __VLS_396 = {
        onClick: (...[$event]) => {
            __VLS_ctx.appVisible = false;
        }
    };
    __VLS_392.slots.default;
    var __VLS_392;
    const __VLS_397 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_398 = __VLS_asFunctionalComponent(__VLS_397, new __VLS_397({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.appLoading),
    }));
    const __VLS_399 = __VLS_398({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.appLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_398));
    let __VLS_401;
    let __VLS_402;
    let __VLS_403;
    const __VLS_404 = {
        onClick: (__VLS_ctx.handleSaveApp)
    };
    __VLS_400.slots.default;
    var __VLS_400;
}
var __VLS_234;
/** @type {__VLS_StyleScopedClasses['sso-config']} */ ;
/** @type {__VLS_StyleScopedClasses['config-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['app-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
// @ts-ignore
var __VLS_154 = __VLS_153, __VLS_240 = __VLS_239;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Edit: Edit,
            Plus: Plus,
            SSO_APP_ENABLED: SSO_APP_ENABLED,
            SSO_APP_DISABLED: SSO_APP_DISABLED,
            getSsoAppStatusTagType: getSsoAppStatusTagType,
            getSsoAppStatusLabel: getSsoAppStatusLabel,
            config: config,
            configVisible: configVisible,
            configLoading: configLoading,
            configFormRef: configFormRef,
            configForm: configForm,
            configRules: configRules,
            appLoading: appLoading,
            appList: appList,
            appTotal: appTotal,
            appQueryParams: appQueryParams,
            appVisible: appVisible,
            appFormRef: appFormRef,
            appForm: appForm,
            appRules: appRules,
            getSsoTypeName: getSsoTypeName,
            getAppTypeName: getAppTypeName,
            loadAppList: loadAppList,
            handleEditConfig: handleEditConfig,
            handleSaveConfig: handleSaveConfig,
            handleAddApp: handleAddApp,
            handleEditApp: handleEditApp,
            handleSaveApp: handleSaveApp,
            handleDeleteApp: handleDeleteApp,
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
//# sourceMappingURL=SsoConfig.vue.js.map