import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addDictType, updateDictType } from '@/api/system/dict.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.dictTypeData?.dictId);
// 状态
const formRef = ref();
const submitting = ref(false);
// 表单数据
const formData = ref({
    dictName: '',
    dictType: '',
    status: '0',
    remark: '',
});
// 表单验证规则
const rules = {
    dictName: [
        { required: true, message: '请输入字典名称', trigger: 'blur' },
    ],
    dictType: [
        { required: true, message: '请输入字典类型', trigger: 'blur' },
        { pattern: /^[a-z][a-z0-9_]*$/, message: '字典类型必须为小写字母、数字和下划线组合', trigger: 'blur' },
    ],
};
// 填充表单数据
function fillFormData() {
    if (props.dictTypeData) {
        formData.value = {
            dictName: props.dictTypeData.dictName,
            dictType: props.dictTypeData.dictType,
            status: props.dictTypeData.status,
            remark: props.dictTypeData.remark || '',
        };
    }
    else {
        formData.value = {
            dictName: '',
            dictType: '',
            status: '0',
            remark: '',
        };
    }
}
// 提交表单
async function handleSubmit() {
    try {
        await formRef.value?.validate();
        submitting.value = true;
        if (isEdit.value) {
            await updateDictType({ dictId: props.dictTypeData.dictId, ...formData.value });
            ElMessage.success('修改成功');
        }
        else {
            await addDictType(formData.value);
            ElMessage.success('新增成功');
        }
        emit('refresh');
        handleClose();
    }
    catch (error) {
        console.error('提交失败', error);
    }
    finally {
        submitting.value = false;
    }
}
// 关闭弹窗
function handleClose() {
    formRef.value?.resetFields();
    visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
    if (val) {
        fillFormData();
    }
});
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
    title: (__VLS_ctx.isEdit ? '编辑字典类型' : '新增字典类型'),
    width: "500px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑字典类型' : '新增字典类型'),
    width: "500px",
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
const __VLS_15 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    label: "字典名称",
    prop: "dictName",
}));
const __VLS_17 = __VLS_16({
    label: "字典名称",
    prop: "dictName",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.formData.dictName),
    placeholder: "请输入字典名称",
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.formData.dictName),
    placeholder: "请输入字典名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "字典类型",
    prop: "dictType",
}));
const __VLS_25 = __VLS_24({
    label: "字典类型",
    prop: "dictType",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.formData.dictType),
    placeholder: "请输入字典类型",
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.formData.dictType),
    placeholder: "请输入字典类型",
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "状态",
    prop: "status",
}));
const __VLS_33 = __VLS_32({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "0",
}));
const __VLS_41 = __VLS_40({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
var __VLS_42;
const __VLS_43 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "1",
}));
const __VLS_45 = __VLS_44({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
var __VLS_46;
var __VLS_38;
var __VLS_34;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "备注",
    prop: "remark",
}));
const __VLS_49 = __VLS_48({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
var __VLS_50;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_55 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_59;
    let __VLS_60;
    let __VLS_61;
    const __VLS_62 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_58.slots.default;
    var __VLS_58;
    const __VLS_63 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_67;
    let __VLS_68;
    let __VLS_69;
    const __VLS_70 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_66.slots.default;
    var __VLS_66;
}
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            isEdit: isEdit,
            formRef: formRef,
            submitting: submitting,
            formData: formData,
            rules: rules,
            handleSubmit: handleSubmit,
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
//# sourceMappingURL=DictTypeForm.vue.js.map