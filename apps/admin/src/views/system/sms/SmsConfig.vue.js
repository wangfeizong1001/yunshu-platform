/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Plus } from '@element-plus/icons-vue';
import { getSmsConfig, saveSmsConfig, sendSms } from '@/api/system/sms.api';
// 配置相关
const config = reactive({
    id: 0,
    platform: 'aliyun',
    accessKey: '',
    secretKey: '',
    signName: '',
    templateCode: '',
    status: '0',
});
const configVisible = ref(false);
const configLoading = ref(false);
const configFormRef = ref();
const configForm = reactive({
    platform: 'aliyun',
    accessKey: '',
    secretKey: '',
    signName: '',
    templateCode: '',
    status: '1',
});
const configRules = {
    platform: [{ required: true, message: '请选择短信平台', trigger: 'change' }],
    accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
    signName: [{ required: true, message: '请输入签名', trigger: 'blur' }],
    templateCode: [{ required: true, message: '请输入模板CODE', trigger: 'blur' }],
};
// 模板相关
const templateLoading = ref(false);
const templateList = ref([]);
const templateVisible = ref(false);
const templateFormRef = ref();
const templateForm = reactive({
    id: 0,
    templateCode: '',
    templateName: '',
    content: '',
    platform: 'aliyun',
    status: '1',
    remark: '',
});
const templateRules = {
    templateCode: [{ required: true, message: '请输入模板CODE', trigger: 'blur' }],
    templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }],
};
// 发送相关
const sendVisible = ref(false);
const sendLoading = ref(false);
const sendFormRef = ref();
const sendForm = reactive({
    mobile: '',
    templateCode: '',
});
const sendParams = ref('');
const sendRules = {
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    templateCode: [{ required: true, message: '请选择模板', trigger: 'change' }],
};
// 加载配置
async function loadConfig() {
    try {
        const res = await getSmsConfig();
        Object.assign(config, res);
        Object.assign(configForm, res);
    }
    catch (error) {
        console.error('加载配置失败', error);
    }
}
// 加载模板列表
async function loadTemplateList() {
    templateLoading.value = true;
    try {
        templateList.value = [];
    }
    finally {
        templateLoading.value = false;
    }
}
// 修改配置
function handleEdit() {
    Object.assign(configForm, config);
    configVisible.value = true;
}
// 保存配置
async function handleSaveConfig() {
    try {
        await configFormRef.value?.validate();
        configLoading.value = true;
        await saveSmsConfig(configForm);
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
// 新增模板
function handleAddTemplate() {
    templateForm.id = 0;
    templateForm.templateCode = '';
    templateForm.templateName = '';
    templateForm.content = '';
    templateForm.platform = 'aliyun';
    templateForm.status = '1';
    templateForm.remark = '';
    templateVisible.value = true;
}
// 编辑模板
function handleEditTemplate(row) {
    Object.assign(templateForm, row);
    templateVisible.value = true;
}
// 保存模板
async function handleSaveTemplate() {
    try {
        await templateFormRef.value?.validate();
        templateLoading.value = true;
        ElMessage.success('保存成功');
        templateVisible.value = false;
        loadTemplateList();
    }
    catch (error) {
        console.error('保存模板失败', error);
    }
    finally {
        templateLoading.value = false;
    }
}
// 删除模板
async function handleDeleteTemplate(row) {
    try {
        await ElMessageBox.confirm(`是否确认删除模板"${row.templateName}"？`, '提示', { type: 'warning' });
        ElMessage.success('删除成功');
        loadTemplateList();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('删除模板失败', error);
        }
    }
}
// 发送短信
function handleTestSend() {
    sendVisible.value = true;
}
// 确认发送
async function handleSend() {
    try {
        await sendFormRef.value?.validate();
        sendLoading.value = true;
        await sendSms(sendForm.mobile, sendParams.value || '');
        ElMessage.success('发送成功');
        sendVisible.value = false;
    }
    catch (error) {
        console.error('发送失败', error);
    }
    finally {
        sendLoading.value = false;
    }
}
// 初始化
onMounted(() => {
    loadConfig();
    loadTemplateList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sms-config" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
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
        onClick: (__VLS_ctx.handleEdit)
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
    label: "短信平台",
}));
const __VLS_18 = __VLS_17({
    label: "短信平台",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    type: (__VLS_ctx.config.platform === 'aliyun' ? 'success' : 'warning'),
}));
const __VLS_22 = __VLS_21({
    type: (__VLS_ctx.config.platform === 'aliyun' ? 'success' : 'warning'),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
(__VLS_ctx.config.platform === 'aliyun' ? '阿里云短信' : '腾讯云短信');
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "签名",
}));
const __VLS_26 = __VLS_25({
    label: "签名",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
(__VLS_ctx.config.signName || '-');
var __VLS_27;
const __VLS_28 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "模板CODE",
}));
const __VLS_30 = __VLS_29({
    label: "模板CODE",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
(__VLS_ctx.config.templateCode || '-');
var __VLS_31;
const __VLS_32 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "状态",
}));
const __VLS_34 = __VLS_33({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    type: (__VLS_ctx.config.status === '1' ? 'success' : 'danger'),
}));
const __VLS_38 = __VLS_37({
    type: (__VLS_ctx.config.status === '1' ? 'success' : 'danger'),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
(__VLS_ctx.config.status === '1' ? '启用' : '禁用');
var __VLS_39;
var __VLS_35;
var __VLS_15;
var __VLS_3;
const __VLS_40 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    shadow: "never",
    ...{ class: "template-card" },
}));
const __VLS_42 = __VLS_41({
    shadow: "never",
    ...{ class: "template-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_43.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_44 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (__VLS_ctx.handleAddTemplate)
    };
    __VLS_47.slots.default;
    var __VLS_47;
}
const __VLS_52 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    data: (__VLS_ctx.templateList),
    stripe: true,
    border: true,
}));
const __VLS_54 = __VLS_53({
    data: (__VLS_ctx.templateList),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.templateLoading) }, null, null);
__VLS_55.slots.default;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "id",
    label: "模板ID",
    width: "80",
}));
const __VLS_58 = __VLS_57({
    prop: "id",
    label: "模板ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "templateCode",
    label: "模板CODE",
    width: "150",
}));
const __VLS_62 = __VLS_61({
    prop: "templateCode",
    label: "模板CODE",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "templateName",
    label: "模板名称",
    width: "150",
}));
const __VLS_66 = __VLS_65({
    prop: "templateName",
    label: "模板名称",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "content",
    label: "模板内容",
    minWidth: "300",
    showOverflowTooltip: true,
}));
const __VLS_70 = __VLS_69({
    prop: "content",
    label: "模板内容",
    minWidth: "300",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "platform",
    label: "平台",
    width: "100",
}));
const __VLS_74 = __VLS_73({
    prop: "platform",
    label: "平台",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        size: "small",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.platform === 'aliyun' ? '阿里云' : '腾讯云');
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "status",
    label: "状态",
    width: "80",
}));
const __VLS_82 = __VLS_81({
    prop: "status",
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        type: (row.status === '1' ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_86 = __VLS_85({
        type: (row.status === '1' ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (row.status === '1' ? '启用' : '禁用');
    var __VLS_87;
}
var __VLS_83;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_90 = __VLS_89({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEditTemplate(row);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDeleteTemplate(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_91;
var __VLS_55;
var __VLS_43;
const __VLS_108 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.configVisible),
    title: "修改短信配置",
    width: "500px",
    appendToBody: true,
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.configVisible),
    title: "修改短信配置",
    width: "500px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ref: "configFormRef",
    model: (__VLS_ctx.configForm),
    rules: (__VLS_ctx.configRules),
    labelWidth: "100px",
}));
const __VLS_114 = __VLS_113({
    ref: "configFormRef",
    model: (__VLS_ctx.configForm),
    rules: (__VLS_ctx.configRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
/** @type {typeof __VLS_ctx.configFormRef} */ ;
var __VLS_116 = {};
__VLS_115.slots.default;
const __VLS_118 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "短信平台",
    prop: "platform",
}));
const __VLS_120 = __VLS_119({
    label: "短信平台",
    prop: "platform",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.configForm.platform),
    placeholder: "请选择短信平台",
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.configForm.platform),
    placeholder: "请选择短信平台",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "阿里云短信",
    value: "aliyun",
}));
const __VLS_128 = __VLS_127({
    label: "阿里云短信",
    value: "aliyun",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const __VLS_130 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    label: "腾讯云短信",
    value: "qcloud",
}));
const __VLS_132 = __VLS_131({
    label: "腾讯云短信",
    value: "qcloud",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
var __VLS_125;
var __VLS_121;
const __VLS_134 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    label: "AccessKey",
    prop: "accessKey",
}));
const __VLS_136 = __VLS_135({
    label: "AccessKey",
    prop: "accessKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    modelValue: (__VLS_ctx.configForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}));
const __VLS_140 = __VLS_139({
    modelValue: (__VLS_ctx.configForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_137;
const __VLS_142 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    label: "SecretKey",
    prop: "secretKey",
}));
const __VLS_144 = __VLS_143({
    label: "SecretKey",
    prop: "secretKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
const __VLS_146 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.configForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.configForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
var __VLS_145;
const __VLS_150 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    label: "签名",
    prop: "signName",
}));
const __VLS_152 = __VLS_151({
    label: "签名",
    prop: "signName",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    modelValue: (__VLS_ctx.configForm.signName),
    placeholder: "请输入短信签名",
}));
const __VLS_156 = __VLS_155({
    modelValue: (__VLS_ctx.configForm.signName),
    placeholder: "请输入短信签名",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
var __VLS_153;
const __VLS_158 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    label: "模板CODE",
    prop: "templateCode",
}));
const __VLS_160 = __VLS_159({
    label: "模板CODE",
    prop: "templateCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_161.slots.default;
const __VLS_162 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
    modelValue: (__VLS_ctx.configForm.templateCode),
    placeholder: "请输入模板CODE",
}));
const __VLS_164 = __VLS_163({
    modelValue: (__VLS_ctx.configForm.templateCode),
    placeholder: "请输入模板CODE",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
var __VLS_161;
const __VLS_166 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    label: "状态",
    prop: "status",
}));
const __VLS_168 = __VLS_167({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
const __VLS_170 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    modelValue: (__VLS_ctx.configForm.status),
}));
const __VLS_172 = __VLS_171({
    modelValue: (__VLS_ctx.configForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
__VLS_173.slots.default;
const __VLS_174 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    label: "1",
}));
const __VLS_176 = __VLS_175({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
__VLS_177.slots.default;
var __VLS_177;
const __VLS_178 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    label: "0",
}));
const __VLS_180 = __VLS_179({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
__VLS_181.slots.default;
var __VLS_181;
var __VLS_173;
var __VLS_169;
var __VLS_115;
{
    const { footer: __VLS_thisSlot } = __VLS_111.slots;
    const __VLS_182 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
        ...{ 'onClick': {} },
    }));
    const __VLS_184 = __VLS_183({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    let __VLS_186;
    let __VLS_187;
    let __VLS_188;
    const __VLS_189 = {
        onClick: (...[$event]) => {
            __VLS_ctx.configVisible = false;
        }
    };
    __VLS_185.slots.default;
    var __VLS_185;
    const __VLS_190 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.configLoading),
    }));
    const __VLS_192 = __VLS_191({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.configLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    let __VLS_194;
    let __VLS_195;
    let __VLS_196;
    const __VLS_197 = {
        onClick: (__VLS_ctx.handleSaveConfig)
    };
    __VLS_193.slots.default;
    var __VLS_193;
}
var __VLS_111;
const __VLS_198 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    modelValue: (__VLS_ctx.templateVisible),
    title: (__VLS_ctx.templateForm.id ? '编辑模板' : '新增模板'),
    width: "600px",
    appendToBody: true,
}));
const __VLS_200 = __VLS_199({
    modelValue: (__VLS_ctx.templateVisible),
    title: (__VLS_ctx.templateForm.id ? '编辑模板' : '新增模板'),
    width: "600px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
const __VLS_202 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    ref: "templateFormRef",
    model: (__VLS_ctx.templateForm),
    rules: (__VLS_ctx.templateRules),
    labelWidth: "100px",
}));
const __VLS_204 = __VLS_203({
    ref: "templateFormRef",
    model: (__VLS_ctx.templateForm),
    rules: (__VLS_ctx.templateRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
/** @type {typeof __VLS_ctx.templateFormRef} */ ;
var __VLS_206 = {};
__VLS_205.slots.default;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "模板CODE",
    prop: "templateCode",
}));
const __VLS_210 = __VLS_209({
    label: "模板CODE",
    prop: "templateCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.templateForm.templateCode),
    placeholder: "请输入模板CODE",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.templateForm.templateCode),
    placeholder: "请输入模板CODE",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
const __VLS_216 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "模板名称",
    prop: "templateName",
}));
const __VLS_218 = __VLS_217({
    label: "模板名称",
    prop: "templateName",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.templateForm.templateName),
    placeholder: "请输入模板名称",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.templateForm.templateName),
    placeholder: "请输入模板名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
var __VLS_219;
const __VLS_224 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "平台",
    prop: "platform",
}));
const __VLS_226 = __VLS_225({
    label: "平台",
    prop: "platform",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.templateForm.platform),
    placeholder: "请选择平台",
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.templateForm.platform),
    placeholder: "请选择平台",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "阿里云短信",
    value: "aliyun",
}));
const __VLS_234 = __VLS_233({
    label: "阿里云短信",
    value: "aliyun",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "腾讯云短信",
    value: "qcloud",
}));
const __VLS_238 = __VLS_237({
    label: "腾讯云短信",
    value: "qcloud",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_231;
var __VLS_227;
const __VLS_240 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "模板内容",
    prop: "content",
}));
const __VLS_242 = __VLS_241({
    label: "模板内容",
    prop: "content",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
const __VLS_244 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.templateForm.content),
    type: "textarea",
    rows: (4),
    placeholder: "请输入模板内容，使用 ${param} 作为变量占位符",
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.templateForm.content),
    type: "textarea",
    rows: (4),
    placeholder: "请输入模板内容，使用 ${param} 作为变量占位符",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
var __VLS_243;
const __VLS_248 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "状态",
    prop: "status",
}));
const __VLS_250 = __VLS_249({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    modelValue: (__VLS_ctx.templateForm.status),
}));
const __VLS_254 = __VLS_253({
    modelValue: (__VLS_ctx.templateForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
const __VLS_256 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "1",
}));
const __VLS_258 = __VLS_257({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
var __VLS_259;
const __VLS_260 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    label: "0",
}));
const __VLS_262 = __VLS_261({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
var __VLS_263;
var __VLS_255;
var __VLS_251;
const __VLS_264 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    label: "备注",
    prop: "remark",
}));
const __VLS_266 = __VLS_265({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    modelValue: (__VLS_ctx.templateForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_270 = __VLS_269({
    modelValue: (__VLS_ctx.templateForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
var __VLS_267;
var __VLS_205;
{
    const { footer: __VLS_thisSlot } = __VLS_201.slots;
    const __VLS_272 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        ...{ 'onClick': {} },
    }));
    const __VLS_274 = __VLS_273({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    let __VLS_276;
    let __VLS_277;
    let __VLS_278;
    const __VLS_279 = {
        onClick: (...[$event]) => {
            __VLS_ctx.templateVisible = false;
        }
    };
    __VLS_275.slots.default;
    var __VLS_275;
    const __VLS_280 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.templateLoading),
    }));
    const __VLS_282 = __VLS_281({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.templateLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    let __VLS_284;
    let __VLS_285;
    let __VLS_286;
    const __VLS_287 = {
        onClick: (__VLS_ctx.handleSaveTemplate)
    };
    __VLS_283.slots.default;
    var __VLS_283;
}
var __VLS_201;
const __VLS_288 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    modelValue: (__VLS_ctx.sendVisible),
    title: "发送短信",
    width: "500px",
    appendToBody: true,
}));
const __VLS_290 = __VLS_289({
    modelValue: (__VLS_ctx.sendVisible),
    title: "发送短信",
    width: "500px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    ref: "sendFormRef",
    model: (__VLS_ctx.sendForm),
    rules: (__VLS_ctx.sendRules),
    labelWidth: "100px",
}));
const __VLS_294 = __VLS_293({
    ref: "sendFormRef",
    model: (__VLS_ctx.sendForm),
    rules: (__VLS_ctx.sendRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
/** @type {typeof __VLS_ctx.sendFormRef} */ ;
var __VLS_296 = {};
__VLS_295.slots.default;
const __VLS_298 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
    label: "手机号",
    prop: "mobile",
}));
const __VLS_300 = __VLS_299({
    label: "手机号",
    prop: "mobile",
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
__VLS_301.slots.default;
const __VLS_302 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
    modelValue: (__VLS_ctx.sendForm.mobile),
    placeholder: "请输入手机号",
}));
const __VLS_304 = __VLS_303({
    modelValue: (__VLS_ctx.sendForm.mobile),
    placeholder: "请输入手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
var __VLS_301;
const __VLS_306 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
    label: "模板",
    prop: "templateCode",
}));
const __VLS_308 = __VLS_307({
    label: "模板",
    prop: "templateCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_309.slots.default;
const __VLS_310 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    modelValue: (__VLS_ctx.sendForm.templateCode),
    placeholder: "请选择模板",
}));
const __VLS_312 = __VLS_311({
    modelValue: (__VLS_ctx.sendForm.templateCode),
    placeholder: "请选择模板",
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
__VLS_313.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.templateList.filter(t => t.status === '1')))) {
    const __VLS_314 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
        key: (item.templateCode),
        label: (item.templateName),
        value: (item.templateCode),
    }));
    const __VLS_316 = __VLS_315({
        key: (item.templateCode),
        label: (item.templateName),
        value: (item.templateCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_315));
}
var __VLS_313;
var __VLS_309;
const __VLS_318 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    label: "参数",
}));
const __VLS_320 = __VLS_319({
    label: "参数",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
const __VLS_322 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    modelValue: (__VLS_ctx.sendParams),
    type: "textarea",
    rows: (3),
    placeholder: "请输入参数，JSON格式，如: {&quot;code&quot;:&quot;123456&quot;}",
}));
const __VLS_324 = __VLS_323({
    modelValue: (__VLS_ctx.sendParams),
    type: "textarea",
    rows: (3),
    placeholder: "请输入参数，JSON格式，如: {&quot;code&quot;:&quot;123456&quot;}",
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
var __VLS_321;
var __VLS_295;
{
    const { footer: __VLS_thisSlot } = __VLS_291.slots;
    const __VLS_326 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
        ...{ 'onClick': {} },
    }));
    const __VLS_328 = __VLS_327({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_327));
    let __VLS_330;
    let __VLS_331;
    let __VLS_332;
    const __VLS_333 = {
        onClick: (...[$event]) => {
            __VLS_ctx.sendVisible = false;
        }
    };
    __VLS_329.slots.default;
    var __VLS_329;
    const __VLS_334 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_336 = __VLS_335({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_335));
    let __VLS_338;
    let __VLS_339;
    let __VLS_340;
    const __VLS_341 = {
        onClick: (__VLS_ctx.handleTestSend)
    };
    __VLS_337.slots.default;
    var __VLS_337;
    const __VLS_342 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.sendLoading),
    }));
    const __VLS_344 = __VLS_343({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.sendLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_343));
    let __VLS_346;
    let __VLS_347;
    let __VLS_348;
    const __VLS_349 = {
        onClick: (__VLS_ctx.handleSend)
    };
    __VLS_345.slots.default;
    var __VLS_345;
}
var __VLS_291;
/** @type {__VLS_StyleScopedClasses['sms-config']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
// @ts-ignore
var __VLS_117 = __VLS_116, __VLS_207 = __VLS_206, __VLS_297 = __VLS_296;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Edit: Edit,
            Plus: Plus,
            config: config,
            configVisible: configVisible,
            configLoading: configLoading,
            configFormRef: configFormRef,
            configForm: configForm,
            configRules: configRules,
            templateLoading: templateLoading,
            templateList: templateList,
            templateVisible: templateVisible,
            templateFormRef: templateFormRef,
            templateForm: templateForm,
            templateRules: templateRules,
            sendVisible: sendVisible,
            sendLoading: sendLoading,
            sendFormRef: sendFormRef,
            sendForm: sendForm,
            sendParams: sendParams,
            sendRules: sendRules,
            handleEdit: handleEdit,
            handleSaveConfig: handleSaveConfig,
            handleAddTemplate: handleAddTemplate,
            handleEditTemplate: handleEditTemplate,
            handleSaveTemplate: handleSaveTemplate,
            handleDeleteTemplate: handleDeleteTemplate,
            handleTestSend: handleTestSend,
            handleSend: handleSend,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SmsConfig.vue.js.map