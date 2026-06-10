import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addPackage, updatePackage } from '@/api/tenant/tenant.api';
const props = defineProps();
const emit = defineEmits();
// 状态
const formRef = ref();
const submitLoading = ref(false);
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.packageData?.packageId);
// 表单数据
const formData = ref({
    packageName: '',
    packageType: '0',
    menuIds: [],
    expireType: '0',
    expireTime: '',
    userLimit: 100,
    storageLimit: 1024,
    flowLimit: 10,
    price: 0,
    status: '0',
    remark: '',
});
// 表单验证规则
const rules = {
    packageName: [
        { required: true, message: '请输入套餐名称', trigger: 'blur' },
    ],
    packageType: [
        { required: true, message: '请选择套餐类型', trigger: 'change' },
    ],
    userLimit: [
        { required: true, message: '请输入用户限制', trigger: 'blur' },
    ],
    expireType: [
        { required: true, message: '请选择过期类型', trigger: 'change' },
    ],
    price: [
        { required: true, message: '请输入价格', trigger: 'blur' },
    ],
};
// 监听数据变化
watch(() => props.packageData, (val) => {
    if (val) {
        formData.value = {
            packageId: val.packageId,
            packageName: val.packageName,
            packageType: val.packageType,
            menuIds: val.menuIds,
            expireType: val.expireType,
            expireTime: val.expireTime,
            userLimit: val.userLimit,
            storageLimit: val.storageLimit,
            flowLimit: val.flowLimit,
            price: val.price,
            status: val.status,
            remark: val.remark,
        };
    }
    else {
        formData.value = {
            packageName: '',
            packageType: '0',
            menuIds: [],
            expireType: '0',
            expireTime: '',
            userLimit: 100,
            storageLimit: 1024,
            flowLimit: 10,
            price: 0,
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
            await updatePackage(props.packageData.packageId, formData.value);
            ElMessage.success('修改成功');
        }
        else {
            await addPackage(formData.value);
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
    title: (__VLS_ctx.isEdit ? '编辑套餐' : '新增套餐'),
    width: "700px",
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑套餐' : '新增套餐'),
    width: "700px",
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
    labelWidth: "110px",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "110px",
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
    label: "套餐名称",
    prop: "packageName",
}));
const __VLS_25 = __VLS_24({
    label: "套餐名称",
    prop: "packageName",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.formData.packageName),
    placeholder: "请输入套餐名称",
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.formData.packageName),
    placeholder: "请输入套餐名称",
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
    label: "套餐类型",
    prop: "packageType",
}));
const __VLS_37 = __VLS_36({
    label: "套餐类型",
    prop: "packageType",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.formData.packageType),
    placeholder: "请选择套餐类型",
    ...{ style: {} },
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.formData.packageType),
    placeholder: "请选择套餐类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "免费版",
    value: "0",
}));
const __VLS_45 = __VLS_44({
    label: "免费版",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const __VLS_47 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "基础版",
    value: "1",
}));
const __VLS_49 = __VLS_48({
    label: "基础版",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const __VLS_51 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "高级版",
    value: "2",
}));
const __VLS_53 = __VLS_52({
    label: "高级版",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
var __VLS_42;
var __VLS_38;
var __VLS_34;
var __VLS_18;
const __VLS_55 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    gutter: (20),
}));
const __VLS_57 = __VLS_56({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
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
    label: "用户限制",
    prop: "userLimit",
}));
const __VLS_65 = __VLS_64({
    label: "用户限制",
    prop: "userLimit",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    placeholder: "请输入用户限制",
    ...{ style: {} },
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    placeholder: "请输入用户限制",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
var __VLS_66;
var __VLS_62;
const __VLS_71 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    span: (12),
}));
const __VLS_73 = __VLS_72({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
const __VLS_75 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "存储限制(MB)",
    prop: "storageLimit",
}));
const __VLS_77 = __VLS_76({
    label: "存储限制(MB)",
    prop: "storageLimit",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.formData.storageLimit),
    min: (0),
    max: (99999999),
    placeholder: "请输入存储限制",
    ...{ style: {} },
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.formData.storageLimit),
    min: (0),
    max: (99999999),
    placeholder: "请输入存储限制",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
var __VLS_78;
var __VLS_74;
var __VLS_58;
const __VLS_83 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    gutter: (20),
}));
const __VLS_85 = __VLS_84({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
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
    label: "月流量限制(GB)",
    prop: "flowLimit",
}));
const __VLS_93 = __VLS_92({
    label: "月流量限制(GB)",
    prop: "flowLimit",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
const __VLS_95 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.formData.flowLimit),
    min: (0),
    max: (999999),
    placeholder: "请输入月流量限制",
    ...{ style: {} },
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.formData.flowLimit),
    min: (0),
    max: (999999),
    placeholder: "请输入月流量限制",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
var __VLS_94;
var __VLS_90;
const __VLS_99 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    span: (12),
}));
const __VLS_101 = __VLS_100({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "价格(元)",
    prop: "price",
}));
const __VLS_105 = __VLS_104({
    label: "价格(元)",
    prop: "price",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    modelValue: (__VLS_ctx.formData.price),
    min: (0),
    precision: (2),
    placeholder: "请输入价格",
    ...{ style: {} },
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.formData.price),
    min: (0),
    precision: (2),
    placeholder: "请输入价格",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
var __VLS_106;
var __VLS_102;
var __VLS_86;
const __VLS_111 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    gutter: (20),
}));
const __VLS_113 = __VLS_112({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    span: (12),
}));
const __VLS_117 = __VLS_116({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "过期类型",
    prop: "expireType",
}));
const __VLS_121 = __VLS_120({
    label: "过期类型",
    prop: "expireType",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.formData.expireType),
    placeholder: "请选择过期类型",
    ...{ style: {} },
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.formData.expireType),
    placeholder: "请选择过期类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    label: "永久",
    value: "0",
}));
const __VLS_129 = __VLS_128({
    label: "永久",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const __VLS_131 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    label: "年费",
    value: "1",
}));
const __VLS_133 = __VLS_132({
    label: "年费",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const __VLS_135 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "月费",
    value: "2",
}));
const __VLS_137 = __VLS_136({
    label: "月费",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
var __VLS_126;
var __VLS_122;
var __VLS_118;
const __VLS_139 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    span: (12),
}));
const __VLS_141 = __VLS_140({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
if (__VLS_ctx.formData.expireType !== '0') {
    const __VLS_143 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        label: "过期时间",
        prop: "expireTime",
    }));
    const __VLS_145 = __VLS_144({
        label: "过期时间",
        prop: "expireTime",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    __VLS_146.slots.default;
    const __VLS_147 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        modelValue: (__VLS_ctx.formData.expireTime),
        type: "datetime",
        placeholder: "请选择过期时间",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
    }));
    const __VLS_149 = __VLS_148({
        modelValue: (__VLS_ctx.formData.expireTime),
        type: "datetime",
        placeholder: "请选择过期时间",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    var __VLS_146;
}
var __VLS_142;
var __VLS_114;
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
//# sourceMappingURL=PackageForm.vue.js.map