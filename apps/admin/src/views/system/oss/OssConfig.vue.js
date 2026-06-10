import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getOssConfig } from '@/api/system/oss.api';
const props = defineProps();
const emit = defineEmits();
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const activeTab = ref('aliyun');
const aliyunLoading = ref(false);
const qcloudLoading = ref(false);
const qiniuLoading = ref(false);
const localLoading = ref(false);
const aliyunFormRef = ref();
const qcloudFormRef = ref();
const qiniuFormRef = ref();
const localFormRef = ref();
// 表单数据
const aliyunForm = reactive({
    id: 0,
    type: 'aliyun',
    typeName: '阿里云 OSS',
    accessKey: '',
    secretKey: '',
    bucket: '',
    endpoint: '',
    domain: '',
    prefix: 'uploads/',
    status: '1',
    remark: '',
});
const qcloudForm = reactive({
    id: 0,
    type: 'qcloud',
    typeName: '腾讯云 COS',
    accessKey: '',
    secretKey: '',
    bucket: '',
    endpoint: '',
    domain: '',
    prefix: 'uploads/',
    status: '0',
    remark: '',
});
const qiniuForm = reactive({
    id: 0,
    type: 'qiniu',
    typeName: '七牛云存储',
    accessKey: '',
    secretKey: '',
    bucket: '',
    endpoint: '',
    domain: '',
    prefix: 'uploads/',
    status: '0',
    remark: '',
});
const localForm = reactive({
    id: 0,
    type: 'local',
    typeName: '本地存储',
    accessKey: '',
    secretKey: '',
    bucket: '',
    endpoint: '',
    domain: '',
    prefix: 'uploads/',
    status: '1',
    remark: '',
});
// 验证规则
const aliyunRules = {
    accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
    bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
    endpoint: [{ required: true, message: '请输入 Endpoint', trigger: 'blur' }],
};
const qcloudRules = {
    accessKey: [{ required: true, message: '请输入 SecretId', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
    bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
    endpoint: [{ required: true, message: '请输入 Endpoint', trigger: 'blur' }],
};
const qiniuRules = {
    accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
    bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
    endpoint: [{ required: true, message: '请输入上传地址', trigger: 'blur' }],
};
// 加载配置数据
async function loadConfig() {
    try {
        const res = await getOssConfig();
        const configs = res?.configs || [];
        // 更新各平台表单数据
        configs.forEach((config) => {
            const formData = {
                id: config.id,
                accessKey: config.accessKey,
                secretKey: config.secretKey,
                bucket: config.bucket,
                endpoint: config.endpoint,
                domain: config.domain,
                prefix: config.prefix,
                status: config.status,
                remark: config.remark,
            };
            switch (config.type) {
                case 'aliyun':
                    Object.assign(aliyunForm, formData);
                    break;
                case 'qcloud':
                    Object.assign(qcloudForm, formData);
                    break;
                case 'qiniu':
                    Object.assign(qiniuForm, formData);
                    break;
                case 'local':
                    Object.assign(localForm, formData);
                    break;
            }
        });
        // 设置当前使用的标签页
        if (res?.current) {
            activeTab.value = res.current.type;
        }
    }
    catch (error) {
        console.error('加载配置失败', error);
    }
}
// 测试连接
async function handleTestConnection(type) {
    let formRef;
    switch (type) {
        case 'aliyun':
            formRef = aliyunFormRef;
            aliyunLoading.value = true;
            break;
        case 'qcloud':
            formRef = qcloudFormRef;
            qcloudLoading.value = true;
            break;
        case 'qiniu':
            formRef = qiniuFormRef;
            qiniuLoading.value = true;
            break;
        default:
            return;
    }
    try {
        await formRef.value?.validate();
        ElMessage.info('测试连接功能开发中');
    }
    catch (error) {
        console.error('测试连接失败', error);
    }
    finally {
        aliyunLoading.value = false;
        qcloudLoading.value = false;
        qiniuLoading.value = false;
    }
}
// 保存配置
async function handleSaveConfig(type) {
    let formRef;
    let loadingRef;
    switch (type) {
        case 'aliyun':
            formRef = aliyunFormRef;
            loadingRef = 'aliyunLoading';
            break;
        case 'qcloud':
            formRef = qcloudFormRef;
            loadingRef = 'qcloudLoading';
            break;
        case 'qiniu':
            formRef = qiniuFormRef;
            loadingRef = 'qiniuLoading';
            break;
        case 'local':
            formRef = localFormRef;
            loadingRef = 'localLoading';
            break;
        default:
            return;
    }
    try {
        await formRef.value?.validate();
        window[loadingRef] = true;
        ElMessage.info('保存配置功能开发中');
        emit('refresh');
        handleClose();
    }
    catch (error) {
        console.error('保存配置失败', error);
    }
    finally {
        ;
        window[loadingRef] = false;
    }
}
// 关闭弹窗
function handleClose() {
    visible.value = false;
}
// 监听弹窗打开
watch(() => props.modelValue, (val) => {
    if (val) {
        loadConfig();
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
    title: "OSS 配置",
    width: "900px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "OSS 配置",
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
const __VLS_9 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "阿里云 OSS",
    name: "aliyun",
}));
const __VLS_15 = __VLS_14({
    label: "阿里云 OSS",
    name: "aliyun",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ref: "aliyunFormRef",
    model: (__VLS_ctx.aliyunForm),
    rules: (__VLS_ctx.aliyunRules),
    labelWidth: "140px",
}));
const __VLS_19 = __VLS_18({
    ref: "aliyunFormRef",
    model: (__VLS_ctx.aliyunForm),
    rules: (__VLS_ctx.aliyunRules),
    labelWidth: "140px",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {typeof __VLS_ctx.aliyunFormRef} */ ;
var __VLS_21 = {};
__VLS_20.slots.default;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "存储类型",
}));
const __VLS_25 = __VLS_24({
    label: "存储类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.aliyunForm.typeName),
    disabled: true,
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.aliyunForm.typeName),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "AccessKey",
    prop: "accessKey",
}));
const __VLS_33 = __VLS_32({
    label: "AccessKey",
    prop: "accessKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.aliyunForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.aliyunForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "SecretKey",
    prop: "secretKey",
}));
const __VLS_41 = __VLS_40({
    label: "SecretKey",
    prop: "secretKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.aliyunForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.aliyunForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "Bucket",
    prop: "bucket",
}));
const __VLS_49 = __VLS_48({
    label: "Bucket",
    prop: "bucket",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.aliyunForm.bucket),
    placeholder: "请输入 Bucket 名称",
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.aliyunForm.bucket),
    placeholder: "请输入 Bucket 名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
var __VLS_50;
const __VLS_55 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "Endpoint",
    prop: "endpoint",
}));
const __VLS_57 = __VLS_56({
    label: "Endpoint",
    prop: "endpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
const __VLS_59 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.aliyunForm.endpoint),
    placeholder: "请输入 Endpoint",
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.aliyunForm.endpoint),
    placeholder: "请输入 Endpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
var __VLS_58;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "自定义域名",
    prop: "domain",
}));
const __VLS_65 = __VLS_64({
    label: "自定义域名",
    prop: "domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.aliyunForm.domain),
    placeholder: "请输入自定义域名",
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.aliyunForm.domain),
    placeholder: "请输入自定义域名",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
var __VLS_66;
const __VLS_71 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "文件前缀",
    prop: "prefix",
}));
const __VLS_73 = __VLS_72({
    label: "文件前缀",
    prop: "prefix",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
const __VLS_75 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    modelValue: (__VLS_ctx.aliyunForm.prefix),
    placeholder: "请输入文件前缀",
}));
const __VLS_77 = __VLS_76({
    modelValue: (__VLS_ctx.aliyunForm.prefix),
    placeholder: "请输入文件前缀",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
var __VLS_74;
const __VLS_79 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "状态",
    prop: "status",
}));
const __VLS_81 = __VLS_80({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
const __VLS_83 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    modelValue: (__VLS_ctx.aliyunForm.status),
}));
const __VLS_85 = __VLS_84({
    modelValue: (__VLS_ctx.aliyunForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "1",
}));
const __VLS_89 = __VLS_88({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
var __VLS_90;
const __VLS_91 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "0",
}));
const __VLS_93 = __VLS_92({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
var __VLS_94;
var __VLS_86;
var __VLS_82;
const __VLS_95 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "备注",
    prop: "remark",
}));
const __VLS_97 = __VLS_96({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.aliyunForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.aliyunForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_98;
var __VLS_20;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dialog-footer" },
});
const __VLS_103 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.aliyunLoading),
}));
const __VLS_105 = __VLS_104({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.aliyunLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_107;
let __VLS_108;
let __VLS_109;
const __VLS_110 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleTestConnection('aliyun');
    }
};
__VLS_106.slots.default;
var __VLS_106;
const __VLS_111 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.aliyunLoading),
}));
const __VLS_113 = __VLS_112({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.aliyunLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_115;
let __VLS_116;
let __VLS_117;
const __VLS_118 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleSaveConfig('aliyun');
    }
};
__VLS_114.slots.default;
var __VLS_114;
var __VLS_16;
const __VLS_119 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "腾讯云 COS",
    name: "qcloud",
}));
const __VLS_121 = __VLS_120({
    label: "腾讯云 COS",
    name: "qcloud",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    ref: "qcloudFormRef",
    model: (__VLS_ctx.qcloudForm),
    rules: (__VLS_ctx.qcloudRules),
    labelWidth: "140px",
}));
const __VLS_125 = __VLS_124({
    ref: "qcloudFormRef",
    model: (__VLS_ctx.qcloudForm),
    rules: (__VLS_ctx.qcloudRules),
    labelWidth: "140px",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
/** @type {typeof __VLS_ctx.qcloudFormRef} */ ;
var __VLS_127 = {};
__VLS_126.slots.default;
const __VLS_129 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    label: "存储类型",
}));
const __VLS_131 = __VLS_130({
    label: "存储类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    modelValue: (__VLS_ctx.qcloudForm.typeName),
    disabled: true,
}));
const __VLS_135 = __VLS_134({
    modelValue: (__VLS_ctx.qcloudForm.typeName),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
var __VLS_132;
const __VLS_137 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: "SecretId",
    prop: "accessKey",
}));
const __VLS_139 = __VLS_138({
    label: "SecretId",
    prop: "accessKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    modelValue: (__VLS_ctx.qcloudForm.accessKey),
    placeholder: "请输入 SecretId",
    showPassword: true,
}));
const __VLS_143 = __VLS_142({
    modelValue: (__VLS_ctx.qcloudForm.accessKey),
    placeholder: "请输入 SecretId",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
var __VLS_140;
const __VLS_145 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    label: "SecretKey",
    prop: "secretKey",
}));
const __VLS_147 = __VLS_146({
    label: "SecretKey",
    prop: "secretKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    modelValue: (__VLS_ctx.qcloudForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}));
const __VLS_151 = __VLS_150({
    modelValue: (__VLS_ctx.qcloudForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
var __VLS_148;
const __VLS_153 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    label: "Bucket",
    prop: "bucket",
}));
const __VLS_155 = __VLS_154({
    label: "Bucket",
    prop: "bucket",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
const __VLS_157 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.qcloudForm.bucket),
    placeholder: "请输入 Bucket 名称",
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.qcloudForm.bucket),
    placeholder: "请输入 Bucket 名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
var __VLS_156;
const __VLS_161 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "Endpoint",
    prop: "endpoint",
}));
const __VLS_163 = __VLS_162({
    label: "Endpoint",
    prop: "endpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
const __VLS_165 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.qcloudForm.endpoint),
    placeholder: "请输入 Endpoint",
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.qcloudForm.endpoint),
    placeholder: "请输入 Endpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
var __VLS_164;
const __VLS_169 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    label: "自定义域名",
    prop: "domain",
}));
const __VLS_171 = __VLS_170({
    label: "自定义域名",
    prop: "domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
__VLS_172.slots.default;
const __VLS_173 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    modelValue: (__VLS_ctx.qcloudForm.domain),
    placeholder: "请输入自定义域名",
}));
const __VLS_175 = __VLS_174({
    modelValue: (__VLS_ctx.qcloudForm.domain),
    placeholder: "请输入自定义域名",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
var __VLS_172;
const __VLS_177 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
    label: "文件前缀",
    prop: "prefix",
}));
const __VLS_179 = __VLS_178({
    label: "文件前缀",
    prop: "prefix",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
__VLS_180.slots.default;
const __VLS_181 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    modelValue: (__VLS_ctx.qcloudForm.prefix),
    placeholder: "请输入文件前缀",
}));
const __VLS_183 = __VLS_182({
    modelValue: (__VLS_ctx.qcloudForm.prefix),
    placeholder: "请输入文件前缀",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
var __VLS_180;
const __VLS_185 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    label: "状态",
    prop: "status",
}));
const __VLS_187 = __VLS_186({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
__VLS_188.slots.default;
const __VLS_189 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    modelValue: (__VLS_ctx.qcloudForm.status),
}));
const __VLS_191 = __VLS_190({
    modelValue: (__VLS_ctx.qcloudForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
const __VLS_193 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    label: "1",
}));
const __VLS_195 = __VLS_194({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
var __VLS_196;
const __VLS_197 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "0",
}));
const __VLS_199 = __VLS_198({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
var __VLS_200;
var __VLS_192;
var __VLS_188;
const __VLS_201 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    label: "备注",
    prop: "remark",
}));
const __VLS_203 = __VLS_202({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
__VLS_204.slots.default;
const __VLS_205 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    modelValue: (__VLS_ctx.qcloudForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_207 = __VLS_206({
    modelValue: (__VLS_ctx.qcloudForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
var __VLS_204;
var __VLS_126;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dialog-footer" },
});
const __VLS_209 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qcloudLoading),
}));
const __VLS_211 = __VLS_210({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qcloudLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
let __VLS_213;
let __VLS_214;
let __VLS_215;
const __VLS_216 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleTestConnection('qcloud');
    }
};
__VLS_212.slots.default;
var __VLS_212;
const __VLS_217 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qcloudLoading),
}));
const __VLS_219 = __VLS_218({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qcloudLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
let __VLS_221;
let __VLS_222;
let __VLS_223;
const __VLS_224 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleSaveConfig('qcloud');
    }
};
__VLS_220.slots.default;
var __VLS_220;
var __VLS_122;
const __VLS_225 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    label: "七牛云存储",
    name: "qiniu",
}));
const __VLS_227 = __VLS_226({
    label: "七牛云存储",
    name: "qiniu",
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
const __VLS_229 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
    ref: "qiniuFormRef",
    model: (__VLS_ctx.qiniuForm),
    rules: (__VLS_ctx.qiniuRules),
    labelWidth: "140px",
}));
const __VLS_231 = __VLS_230({
    ref: "qiniuFormRef",
    model: (__VLS_ctx.qiniuForm),
    rules: (__VLS_ctx.qiniuRules),
    labelWidth: "140px",
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
/** @type {typeof __VLS_ctx.qiniuFormRef} */ ;
var __VLS_233 = {};
__VLS_232.slots.default;
const __VLS_235 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
    label: "存储类型",
}));
const __VLS_237 = __VLS_236({
    label: "存储类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
__VLS_238.slots.default;
const __VLS_239 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
    modelValue: (__VLS_ctx.qiniuForm.typeName),
    disabled: true,
}));
const __VLS_241 = __VLS_240({
    modelValue: (__VLS_ctx.qiniuForm.typeName),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
var __VLS_238;
const __VLS_243 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
    label: "AccessKey",
    prop: "accessKey",
}));
const __VLS_245 = __VLS_244({
    label: "AccessKey",
    prop: "accessKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
__VLS_246.slots.default;
const __VLS_247 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    modelValue: (__VLS_ctx.qiniuForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}));
const __VLS_249 = __VLS_248({
    modelValue: (__VLS_ctx.qiniuForm.accessKey),
    placeholder: "请输入 AccessKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
var __VLS_246;
const __VLS_251 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
    label: "SecretKey",
    prop: "secretKey",
}));
const __VLS_253 = __VLS_252({
    label: "SecretKey",
    prop: "secretKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
__VLS_254.slots.default;
const __VLS_255 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
    modelValue: (__VLS_ctx.qiniuForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}));
const __VLS_257 = __VLS_256({
    modelValue: (__VLS_ctx.qiniuForm.secretKey),
    placeholder: "请输入 SecretKey",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
var __VLS_254;
const __VLS_259 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    label: "Bucket",
    prop: "bucket",
}));
const __VLS_261 = __VLS_260({
    label: "Bucket",
    prop: "bucket",
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
__VLS_262.slots.default;
const __VLS_263 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
    modelValue: (__VLS_ctx.qiniuForm.bucket),
    placeholder: "请输入 Bucket 名称",
}));
const __VLS_265 = __VLS_264({
    modelValue: (__VLS_ctx.qiniuForm.bucket),
    placeholder: "请输入 Bucket 名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
var __VLS_262;
const __VLS_267 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
    label: "上传地址",
    prop: "endpoint",
}));
const __VLS_269 = __VLS_268({
    label: "上传地址",
    prop: "endpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
__VLS_270.slots.default;
const __VLS_271 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
    modelValue: (__VLS_ctx.qiniuForm.endpoint),
    placeholder: "请输入上传地址",
}));
const __VLS_273 = __VLS_272({
    modelValue: (__VLS_ctx.qiniuForm.endpoint),
    placeholder: "请输入上传地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
var __VLS_270;
const __VLS_275 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
    label: "自定义域名",
    prop: "domain",
}));
const __VLS_277 = __VLS_276({
    label: "自定义域名",
    prop: "domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
__VLS_278.slots.default;
const __VLS_279 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
    modelValue: (__VLS_ctx.qiniuForm.domain),
    placeholder: "请输入自定义域名",
}));
const __VLS_281 = __VLS_280({
    modelValue: (__VLS_ctx.qiniuForm.domain),
    placeholder: "请输入自定义域名",
}, ...__VLS_functionalComponentArgsRest(__VLS_280));
var __VLS_278;
const __VLS_283 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
    label: "文件前缀",
    prop: "prefix",
}));
const __VLS_285 = __VLS_284({
    label: "文件前缀",
    prop: "prefix",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
__VLS_286.slots.default;
const __VLS_287 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
    modelValue: (__VLS_ctx.qiniuForm.prefix),
    placeholder: "请输入文件前缀",
}));
const __VLS_289 = __VLS_288({
    modelValue: (__VLS_ctx.qiniuForm.prefix),
    placeholder: "请输入文件前缀",
}, ...__VLS_functionalComponentArgsRest(__VLS_288));
var __VLS_286;
const __VLS_291 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
    label: "状态",
    prop: "status",
}));
const __VLS_293 = __VLS_292({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_292));
__VLS_294.slots.default;
const __VLS_295 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_296 = __VLS_asFunctionalComponent(__VLS_295, new __VLS_295({
    modelValue: (__VLS_ctx.qiniuForm.status),
}));
const __VLS_297 = __VLS_296({
    modelValue: (__VLS_ctx.qiniuForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_296));
__VLS_298.slots.default;
const __VLS_299 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
    label: "1",
}));
const __VLS_301 = __VLS_300({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
__VLS_302.slots.default;
var __VLS_302;
const __VLS_303 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
    label: "0",
}));
const __VLS_305 = __VLS_304({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
__VLS_306.slots.default;
var __VLS_306;
var __VLS_298;
var __VLS_294;
const __VLS_307 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
    label: "备注",
    prop: "remark",
}));
const __VLS_309 = __VLS_308({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_308));
__VLS_310.slots.default;
const __VLS_311 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
    modelValue: (__VLS_ctx.qiniuForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_313 = __VLS_312({
    modelValue: (__VLS_ctx.qiniuForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
var __VLS_310;
var __VLS_232;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dialog-footer" },
});
const __VLS_315 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qiniuLoading),
}));
const __VLS_317 = __VLS_316({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qiniuLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
let __VLS_319;
let __VLS_320;
let __VLS_321;
const __VLS_322 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleTestConnection('qiniu');
    }
};
__VLS_318.slots.default;
var __VLS_318;
const __VLS_323 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qiniuLoading),
}));
const __VLS_325 = __VLS_324({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.qiniuLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_324));
let __VLS_327;
let __VLS_328;
let __VLS_329;
const __VLS_330 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleSaveConfig('qiniu');
    }
};
__VLS_326.slots.default;
var __VLS_326;
var __VLS_228;
const __VLS_331 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({
    label: "本地存储",
    name: "local",
}));
const __VLS_333 = __VLS_332({
    label: "本地存储",
    name: "local",
}, ...__VLS_functionalComponentArgsRest(__VLS_332));
__VLS_334.slots.default;
const __VLS_335 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({
    ref: "localFormRef",
    model: (__VLS_ctx.localForm),
    labelWidth: "140px",
}));
const __VLS_337 = __VLS_336({
    ref: "localFormRef",
    model: (__VLS_ctx.localForm),
    labelWidth: "140px",
}, ...__VLS_functionalComponentArgsRest(__VLS_336));
/** @type {typeof __VLS_ctx.localFormRef} */ ;
var __VLS_339 = {};
__VLS_338.slots.default;
const __VLS_341 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
    label: "存储类型",
}));
const __VLS_343 = __VLS_342({
    label: "存储类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_342));
__VLS_344.slots.default;
const __VLS_345 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_346 = __VLS_asFunctionalComponent(__VLS_345, new __VLS_345({
    modelValue: (__VLS_ctx.localForm.typeName),
    disabled: true,
}));
const __VLS_347 = __VLS_346({
    modelValue: (__VLS_ctx.localForm.typeName),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_346));
var __VLS_344;
const __VLS_349 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
    label: "文件前缀",
    prop: "prefix",
}));
const __VLS_351 = __VLS_350({
    label: "文件前缀",
    prop: "prefix",
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
__VLS_352.slots.default;
const __VLS_353 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent(__VLS_353, new __VLS_353({
    modelValue: (__VLS_ctx.localForm.prefix),
    placeholder: "请输入文件前缀",
}));
const __VLS_355 = __VLS_354({
    modelValue: (__VLS_ctx.localForm.prefix),
    placeholder: "请输入文件前缀",
}, ...__VLS_functionalComponentArgsRest(__VLS_354));
var __VLS_352;
const __VLS_357 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
    label: "状态",
    prop: "status",
}));
const __VLS_359 = __VLS_358({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_358));
__VLS_360.slots.default;
const __VLS_361 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361({
    modelValue: (__VLS_ctx.localForm.status),
}));
const __VLS_363 = __VLS_362({
    modelValue: (__VLS_ctx.localForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_362));
__VLS_364.slots.default;
const __VLS_365 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent(__VLS_365, new __VLS_365({
    label: "1",
}));
const __VLS_367 = __VLS_366({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
__VLS_368.slots.default;
var __VLS_368;
const __VLS_369 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
    label: "0",
}));
const __VLS_371 = __VLS_370({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_370));
__VLS_372.slots.default;
var __VLS_372;
var __VLS_364;
var __VLS_360;
const __VLS_373 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
    label: "备注",
    prop: "remark",
}));
const __VLS_375 = __VLS_374({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_374));
__VLS_376.slots.default;
const __VLS_377 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
    modelValue: (__VLS_ctx.localForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}));
const __VLS_379 = __VLS_378({
    modelValue: (__VLS_ctx.localForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_378));
var __VLS_376;
var __VLS_338;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dialog-footer" },
});
const __VLS_381 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_382 = __VLS_asFunctionalComponent(__VLS_381, new __VLS_381({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.localLoading),
}));
const __VLS_383 = __VLS_382({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.localLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_382));
let __VLS_385;
let __VLS_386;
let __VLS_387;
const __VLS_388 = {
    onClick: (...[$event]) => {
        __VLS_ctx.handleSaveConfig('local');
    }
};
__VLS_384.slots.default;
var __VLS_384;
var __VLS_334;
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_22 = __VLS_21, __VLS_128 = __VLS_127, __VLS_234 = __VLS_233, __VLS_340 = __VLS_339;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            activeTab: activeTab,
            aliyunLoading: aliyunLoading,
            qcloudLoading: qcloudLoading,
            qiniuLoading: qiniuLoading,
            localLoading: localLoading,
            aliyunFormRef: aliyunFormRef,
            qcloudFormRef: qcloudFormRef,
            qiniuFormRef: qiniuFormRef,
            localFormRef: localFormRef,
            aliyunForm: aliyunForm,
            qcloudForm: qcloudForm,
            qiniuForm: qiniuForm,
            localForm: localForm,
            aliyunRules: aliyunRules,
            qcloudRules: qcloudRules,
            qiniuRules: qiniuRules,
            handleTestConnection: handleTestConnection,
            handleSaveConfig: handleSaveConfig,
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
//# sourceMappingURL=OssConfig.vue.js.map