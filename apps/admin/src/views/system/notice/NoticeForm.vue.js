import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addNotice, updateNotice } from '@/api/system/notice.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.noticeData?.noticeId);
// 状态
const formRef = ref();
const submitting = ref(false);
// 表单数据
const formData = ref({
    noticeTitle: '',
    noticeType: '1',
    noticeContent: '',
    status: '0',
    remark: '',
});
// 表单验证规则
const rules = {
    noticeType: [
        { required: true, message: '请选择公告类型', trigger: 'change' },
    ],
    noticeTitle: [
        { required: true, message: '请输入公告标题', trigger: 'blur' },
    ],
    noticeContent: [
        { required: true, message: '请输入公告内容', trigger: 'blur' },
    ],
};
// 填充表单数据
function fillFormData() {
    if (props.noticeData) {
        formData.value = {
            noticeTitle: props.noticeData.noticeTitle,
            noticeType: props.noticeData.noticeType,
            noticeContent: props.noticeData.noticeContent,
            status: props.noticeData.status,
            remark: props.noticeData.remark || '',
        };
    }
    else {
        formData.value = {
            noticeTitle: '',
            noticeType: '1',
            noticeContent: '',
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
            await updateNotice({ noticeId: props.noticeData.noticeId, ...formData.value });
            ElMessage.success('修改成功');
        }
        else {
            await addNotice(formData.value);
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
    title: (__VLS_ctx.isEdit ? '编辑公告' : '新增公告'),
    width: "700px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑公告' : '新增公告'),
    width: "700px",
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
    label: "公告类型",
    prop: "noticeType",
}));
const __VLS_17 = __VLS_16({
    label: "公告类型",
    prop: "noticeType",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.formData.noticeType),
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.formData.noticeType),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "1",
}));
const __VLS_25 = __VLS_24({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
var __VLS_26;
const __VLS_27 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "2",
}));
const __VLS_29 = __VLS_28({
    label: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
var __VLS_30;
var __VLS_22;
var __VLS_18;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "公告标题",
    prop: "noticeTitle",
}));
const __VLS_33 = __VLS_32({
    label: "公告标题",
    prop: "noticeTitle",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.formData.noticeTitle),
    placeholder: "请输入公告标题",
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.formData.noticeTitle),
    placeholder: "请输入公告标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "公告内容",
    prop: "noticeContent",
}));
const __VLS_41 = __VLS_40({
    label: "公告内容",
    prop: "noticeContent",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.formData.noticeContent),
    type: "textarea",
    placeholder: "请输入公告内容",
    rows: (8),
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.formData.noticeContent),
    type: "textarea",
    placeholder: "请输入公告内容",
    rows: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "状态",
    prop: "status",
}));
const __VLS_49 = __VLS_48({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "0",
}));
const __VLS_57 = __VLS_56({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
var __VLS_58;
const __VLS_59 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    label: "1",
}));
const __VLS_61 = __VLS_60({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
var __VLS_62;
var __VLS_54;
var __VLS_50;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "备注",
    prop: "remark",
}));
const __VLS_65 = __VLS_64({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
var __VLS_66;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_71 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        ...{ 'onClick': {} },
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_75;
    let __VLS_76;
    let __VLS_77;
    const __VLS_78 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_74.slots.default;
    var __VLS_74;
    const __VLS_79 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_81 = __VLS_80({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    let __VLS_83;
    let __VLS_84;
    let __VLS_85;
    const __VLS_86 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_82.slots.default;
    var __VLS_82;
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
//# sourceMappingURL=NoticeForm.vue.js.map