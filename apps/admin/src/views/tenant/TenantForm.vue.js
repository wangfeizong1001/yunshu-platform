import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addTenant, updateTenant, getPackageList } from '@/api/tenant/tenant.api';
const props = defineProps();
const emit = defineEmits();
// 状态
const formRef = ref();
const submitLoading = ref(false);
const packageList = ref([]);
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.tenantData?.tenantId);
// 表单数据
const formData = ref({
    tenantName: '',
    tenantCode: '',
    contact: '',
    contactPhone: '',
    email: '',
    domain: '',
    packageId: 0,
    expireTime: '',
    userLimit: 100,
    status: '0',
    remark: '',
});
// 表单验证规则
const rules = {
    tenantName: [
        { required: true, message: '请输入租户名称', trigger: 'blur' },
    ],
    tenantCode: [
        { required: true, message: '请输入租户编码', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '租户编码只能包含字母、数字和下划线', trigger: 'blur' },
    ],
    contact: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    contactPhone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    packageId: [
        { required: true, message: '请选择套餐', trigger: 'change' },
    ],
    userLimit: [
        { required: true, message: '请输入用户上限', trigger: 'blur' },
    ],
};
// 加载套餐列表
async function fetchPackageList() {
    try {
        const res = await getPackageList();
        packageList.value = res;
    }
    catch (error) {
        console.error('加载套餐列表失败', error);
    }
}
// 监听数据变化
watch(() => props.tenantData, (val) => {
    if (val) {
        formData.value = {
            tenantId: val.tenantId,
            tenantName: val.tenantName,
            tenantCode: val.tenantCode,
            contact: val.contact,
            contactPhone: val.contactPhone,
            email: val.email,
            domain: val.domain,
            packageId: val.packageId,
            expireTime: val.expireTime,
            userLimit: val.userLimit,
            status: val.status,
            remark: val.remark,
        };
    }
    else {
        formData.value = {
            tenantName: '',
            tenantCode: '',
            contact: '',
            contactPhone: '',
            email: '',
            domain: '',
            packageId: 0,
            expireTime: '',
            userLimit: 100,
            status: '0',
            remark: '',
        };
    }
}, { immediate: true });
// 关闭弹窗
function handleClose() {
    visible.value = false;
    formRef.value?.resetFields();
}
// 提交表单
async function handleSubmit() {
    try {
        await formRef.value?.validate();
        submitLoading.value = true;
        if (isEdit.value) {
            await updateTenant(props.tenantData.tenantId, formData.value);
            ElMessage.success('修改成功');
        }
        else {
            await addTenant(formData.value);
            ElMessage.success('新增成功');
        }
        emit('refresh');
        handleClose();
    }
    catch (error) {
        console.error('提交失败', error);
    }
    finally {
        submitLoading.value = false;
    }
}
// 初始化
fetchPackageList();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑租户' : '新增租户'),
    width: "600px",
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑租户' : '新增租户'),
    width: "600px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClose: (__VLS_ctx.handleClose)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    gutter: (20),
}));
const __VLS_17 = __VLS_16({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    span: (12),
}));
const __VLS_21 = __VLS_20({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "租户名称",
    prop: "tenantName",
}));
const __VLS_25 = __VLS_24({
    label: "租户名称",
    prop: "tenantName",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.formData.tenantName),
    placeholder: "请输入租户名称",
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.formData.tenantName),
    placeholder: "请输入租户名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
var __VLS_22;
const __VLS_31 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    span: (12),
}));
const __VLS_33 = __VLS_32({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "租户编码",
    prop: "tenantCode",
}));
const __VLS_37 = __VLS_36({
    label: "租户编码",
    prop: "tenantCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.formData.tenantCode),
    placeholder: "请输入租户编码",
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.formData.tenantCode),
    placeholder: "请输入租户编码",
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
var __VLS_38;
var __VLS_34;
var __VLS_18;
const __VLS_43 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    gutter: (20),
}));
const __VLS_45 = __VLS_44({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    span: (12),
}));
const __VLS_49 = __VLS_48({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "联系人",
    prop: "contact",
}));
const __VLS_53 = __VLS_52({
    label: "联系人",
    prop: "contact",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.formData.contact),
    placeholder: "请输入联系人",
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.formData.contact),
    placeholder: "请输入联系人",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
var __VLS_54;
var __VLS_50;
const __VLS_59 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    span: (12),
}));
const __VLS_61 = __VLS_60({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "联系电话",
    prop: "contactPhone",
}));
const __VLS_65 = __VLS_64({
    label: "联系电话",
    prop: "contactPhone",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.formData.contactPhone),
    placeholder: "请输入联系电话",
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.formData.contactPhone),
    placeholder: "请输入联系电话",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
var __VLS_66;
var __VLS_62;
var __VLS_46;
const __VLS_71 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    gutter: (20),
}));
const __VLS_73 = __VLS_72({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
const __VLS_75 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    span: (12),
}));
const __VLS_77 = __VLS_76({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "邮箱",
    prop: "email",
}));
const __VLS_81 = __VLS_80({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
const __VLS_83 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}));
const __VLS_85 = __VLS_84({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
var __VLS_82;
var __VLS_78;
const __VLS_87 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    span: (12),
}));
const __VLS_89 = __VLS_88({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
const __VLS_91 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "域名",
    prop: "domain",
}));
const __VLS_93 = __VLS_92({
    label: "域名",
    prop: "domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
const __VLS_95 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.formData.domain),
    placeholder: "请输入域名",
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.formData.domain),
    placeholder: "请输入域名",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
var __VLS_94;
var __VLS_90;
var __VLS_74;
const __VLS_99 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    gutter: (20),
}));
const __VLS_101 = __VLS_100({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    span: (12),
}));
const __VLS_105 = __VLS_104({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "套餐",
    prop: "packageId",
}));
const __VLS_109 = __VLS_108({
    label: "套餐",
    prop: "packageId",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
const __VLS_111 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.formData.packageId),
    placeholder: "请选择套餐",
    ...{ style: {} },
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.formData.packageId),
    placeholder: "请选择套餐",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
for (const [pkg] of __VLS_getVForSourceType((__VLS_ctx.packageList))) {
    const __VLS_115 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }));
    const __VLS_117 = __VLS_116({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
}
var __VLS_114;
var __VLS_110;
var __VLS_106;
const __VLS_119 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    span: (12),
}));
const __VLS_121 = __VLS_120({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    label: "用户上限",
    prop: "userLimit",
}));
const __VLS_125 = __VLS_124({
    label: "用户上限",
    prop: "userLimit",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    placeholder: "请输入用户上限",
    ...{ style: {} },
}));
const __VLS_129 = __VLS_128({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    placeholder: "请输入用户上限",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
var __VLS_126;
var __VLS_122;
var __VLS_102;
const __VLS_131 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    gutter: (20),
}));
const __VLS_133 = __VLS_132({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
const __VLS_135 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    span: (12),
}));
const __VLS_137 = __VLS_136({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    label: "到期时间",
    prop: "expireTime",
}));
const __VLS_141 = __VLS_140({
    label: "到期时间",
    prop: "expireTime",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
const __VLS_143 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    modelValue: (__VLS_ctx.formData.expireTime),
    type: "datetime",
    placeholder: "请选择到期时间",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}));
const __VLS_145 = __VLS_144({
    modelValue: (__VLS_ctx.formData.expireTime),
    type: "datetime",
    placeholder: "请选择到期时间",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
var __VLS_142;
var __VLS_138;
const __VLS_147 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    span: (12),
}));
const __VLS_149 = __VLS_148({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
__VLS_150.slots.default;
const __VLS_151 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    label: "状态",
    prop: "status",
}));
const __VLS_153 = __VLS_152({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
const __VLS_159 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    value: "0",
}));
const __VLS_161 = __VLS_160({
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
var __VLS_162;
const __VLS_163 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    value: "1",
}));
const __VLS_165 = __VLS_164({
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_166.slots.default;
var __VLS_166;
var __VLS_158;
var __VLS_154;
var __VLS_150;
var __VLS_134;
const __VLS_167 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "备注",
    prop: "remark",
}));
const __VLS_169 = __VLS_168({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
__VLS_170.slots.default;
const __VLS_171 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入备注",
}));
const __VLS_173 = __VLS_172({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
var __VLS_170;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_175 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        ...{ 'onClick': {} },
    }));
    const __VLS_177 = __VLS_176({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    let __VLS_179;
    let __VLS_180;
    let __VLS_181;
    const __VLS_182 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_178.slots.default;
    var __VLS_178;
    const __VLS_183 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_185 = __VLS_184({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    let __VLS_187;
    let __VLS_188;
    let __VLS_189;
    const __VLS_190 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_186.slots.default;
    var __VLS_186;
}
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formRef: formRef,
            submitLoading: submitLoading,
            packageList: packageList,
            visible: visible,
            isEdit: isEdit,
            formData: formData,
            rules: rules,
            handleClose: handleClose,
            handleSubmit: handleSubmit,
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
//# sourceMappingURL=TenantForm.vue.js.map