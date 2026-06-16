import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addDept, updateDept } from '@/api/system/dept.api';
import { getDeptTreeSelect } from '@/api/system/dept.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.deptData?.deptId);
// 状态
const formRef = ref();
const submitting = ref(false);
const deptTree = ref([]);
// 表单数据
const formData = ref({
    parentId: 0,
    deptName: '',
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: '0',
});
// 表单验证规则
const rules = {
    parentId: [
        { required: true, message: '请选择上级部门', trigger: 'change' },
    ],
    deptName: [
        { required: true, message: '请输入部门名称', trigger: 'blur' },
    ],
};
// 加载部门树
async function fetchDeptTree() {
    try {
        const res = await getDeptTreeSelect();
        deptTree.value = res;
    }
    catch (error) {
        console.error('加载部门树失败', error);
    }
}
// 填充表单数据
function fillFormData() {
    if (props.deptData) {
        formData.value = {
            parentId: props.deptData.parentId,
            deptName: props.deptData.deptName,
            orderNum: props.deptData.orderNum || 0,
            leader: props.deptData.leader,
            phone: props.deptData.phone,
            email: props.deptData.email,
            status: props.deptData.status,
        };
    }
    else if (props.parentDept) {
        // 新增子部门
        formData.value = {
            parentId: props.parentDept.deptId,
            deptName: '',
            orderNum: 0,
            leader: '',
            phone: '',
            email: '',
            status: '0',
        };
    }
    else {
        // 新增顶级部门
        formData.value = {
            parentId: 0,
            deptName: '',
            orderNum: 0,
            leader: '',
            phone: '',
            email: '',
            status: '0',
        };
    }
}
// 提交表单
async function handleSubmit() {
    try {
        await formRef.value?.validate();
        submitting.value = true;
        if (isEdit.value) {
            await updateDept({ deptId: props.deptData.deptId, ...formData.value });
            ElMessage.success('修改成功');
        }
        else {
            await addDept(formData.value);
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
        fetchDeptTree();
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
    title: (__VLS_ctx.isEdit ? '编辑部门' : '新增部门'),
    width: "600px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑部门' : '新增部门'),
    width: "600px",
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
    label: "上级部门",
    prop: "parentId",
}));
const __VLS_17 = __VLS_16({
    label: "上级部门",
    prop: "parentId",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElTreeSelect;
/** @type {[typeof __VLS_components.ElTreeSelect, typeof __VLS_components.elTreeSelect, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.formData.parentId),
    data: (__VLS_ctx.deptTree),
    props: { value: 'deptId', label: 'deptName', children: 'children' },
    placeholder: "请选择上级部门",
    checkStrictly: true,
    filterable: true,
    clearable: true,
    renderAfterExpand: (false),
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.formData.parentId),
    data: (__VLS_ctx.deptTree),
    props: { value: 'deptId', label: 'deptName', children: 'children' },
    placeholder: "请选择上级部门",
    checkStrictly: true,
    filterable: true,
    clearable: true,
    renderAfterExpand: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "部门名称",
    prop: "deptName",
}));
const __VLS_25 = __VLS_24({
    label: "部门名称",
    prop: "deptName",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.formData.deptName),
    placeholder: "请输入部门名称",
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.formData.deptName),
    placeholder: "请输入部门名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "显示顺序",
    prop: "orderNum",
}));
const __VLS_33 = __VLS_32({
    label: "显示顺序",
    prop: "orderNum",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.formData.orderNum),
    min: (0),
    max: (999),
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.formData.orderNum),
    min: (0),
    max: (999),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "负责人",
    prop: "leader",
}));
const __VLS_41 = __VLS_40({
    label: "负责人",
    prop: "leader",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.formData.leader),
    placeholder: "请输入负责人",
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.formData.leader),
    placeholder: "请输入负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "联系电话",
    prop: "phone",
}));
const __VLS_49 = __VLS_48({
    label: "联系电话",
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "请输入联系电话",
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "请输入联系电话",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
var __VLS_50;
const __VLS_55 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "邮箱",
    prop: "email",
}));
const __VLS_57 = __VLS_56({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
const __VLS_59 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
var __VLS_58;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "状态",
    prop: "status",
}));
const __VLS_65 = __VLS_64({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "0",
}));
const __VLS_73 = __VLS_72({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
var __VLS_74;
const __VLS_75 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "1",
}));
const __VLS_77 = __VLS_76({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
var __VLS_78;
var __VLS_70;
var __VLS_66;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_79 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        ...{ 'onClick': {} },
    }));
    const __VLS_81 = __VLS_80({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    let __VLS_83;
    let __VLS_84;
    let __VLS_85;
    const __VLS_86 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_82.slots.default;
    var __VLS_82;
    const __VLS_87 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_91;
    let __VLS_92;
    let __VLS_93;
    const __VLS_94 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_90.slots.default;
    var __VLS_90;
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
            deptTree: deptTree,
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
//# sourceMappingURL=DeptForm.vue.js.map