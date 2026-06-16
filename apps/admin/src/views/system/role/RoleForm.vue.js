import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { addRole, updateRole } from '@/api/system/role.api';
import { getMenuTree } from '@/api/system/menu.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.roleData?.roleId);
// 状态
const formRef = ref();
const submitting = ref(false);
const menuTree = ref([]);
const menuTreeRef = ref();
const selectedMenuIds = ref([]);
// 表单数据
const formData = ref({
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0',
    dataScope: '1',
    menuCheckStrictly: true,
    remark: '',
});
// 表单验证规则
const rules = {
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ],
    roleKey: [
        { required: true, message: '请输入权限字符', trigger: 'blur' },
    ],
    roleSort: [
        { required: true, message: '请输入显示顺序', trigger: 'blur' },
    ],
};
// 加载菜单树
async function fetchMenuTree() {
    try {
        const res = await getMenuTree();
        menuTree.value = res;
    }
    catch (error) {
        console.error('加载菜单树失败', error);
    }
}
// 加载角色菜单权限
async function fetchRoleMenus() {
    if (!props.roleData?.roleId)
        return;
    try {
        const menuIds = [];
        selectedMenuIds.value = menuIds;
        // 设置选中的菜单
        nextTick(() => {
            menuIds.forEach((id) => {
                menuTreeRef.value?.getNode(id)?.setChecked(false, false);
            });
        });
    }
    catch (error) {
        console.error('加载角色菜单失败', error);
    }
}
// 填充表单数据
function fillFormData() {
    if (props.roleData) {
        formData.value = {
            roleName: props.roleData.roleName,
            roleKey: props.roleData.roleKey,
            roleSort: props.roleData.roleSort,
            status: props.roleData.status,
            dataScope: props.roleData.dataScope,
            menuCheckStrictly: props.roleData.menuCheckStrictly,
            remark: props.roleData.remark,
        };
    }
    else {
        formData.value = {
            roleName: '',
            roleKey: '',
            roleSort: 0,
            status: '0',
            dataScope: '1',
            menuCheckStrictly: true,
            remark: '',
        };
    }
}
// 提交表单
async function handleSubmit() {
    try {
        await formRef.value?.validate();
        submitting.value = true;
        // 获取选中的菜单ID
        const checkedKeys = menuTreeRef.value?.getCheckedKeys() || [];
        const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || [];
        const menuIds = [...checkedKeys, ...halfCheckedKeys];
        const submitData = {
            roleId: isEdit.value ? props.roleData.roleId : undefined,
            ...formData.value,
            permissions: menuIds,
        };
        if (isEdit.value) {
            await updateRole(submitData);
            ElMessage.success('修改成功');
        }
        else {
            await addRole(submitData);
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
    menuTreeRef.value?.setCheckedKeys([]);
    visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
    if (val) {
        fetchMenuTree();
        fillFormData();
        if (props.roleData?.roleId) {
            fetchRoleMenus();
        }
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
    title: (__VLS_ctx.isEdit ? '编辑角色' : '新增角色'),
    width: "600px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEdit ? '编辑角色' : '新增角色'),
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
    label: "角色名称",
    prop: "roleName",
}));
const __VLS_17 = __VLS_16({
    label: "角色名称",
    prop: "roleName",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.formData.roleName),
    placeholder: "请输入角色名称",
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.formData.roleName),
    placeholder: "请输入角色名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "权限字符",
    prop: "roleKey",
}));
const __VLS_25 = __VLS_24({
    label: "权限字符",
    prop: "roleKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.formData.roleKey),
    placeholder: "请输入权限字符",
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.formData.roleKey),
    placeholder: "请输入权限字符",
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
var __VLS_26;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "显示顺序",
    prop: "roleSort",
}));
const __VLS_33 = __VLS_32({
    label: "显示顺序",
    prop: "roleSort",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.formData.roleSort),
    min: (0),
    max: (999),
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.formData.roleSort),
    min: (0),
    max: (999),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_34;
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "状态",
    prop: "status",
}));
const __VLS_41 = __VLS_40({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.formData.status),
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.formData.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "0",
}));
const __VLS_49 = __VLS_48({
    label: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
var __VLS_50;
const __VLS_51 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "1",
}));
const __VLS_53 = __VLS_52({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
var __VLS_54;
var __VLS_46;
var __VLS_42;
const __VLS_55 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "数据权限",
    prop: "dataScope",
}));
const __VLS_57 = __VLS_56({
    label: "数据权限",
    prop: "dataScope",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
const __VLS_59 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.formData.dataScope),
    placeholder: "请选择数据权限",
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.formData.dataScope),
    placeholder: "请选择数据权限",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "全部数据权限",
    value: "1",
}));
const __VLS_65 = __VLS_64({
    label: "全部数据权限",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const __VLS_67 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "自定义数据权限",
    value: "2",
}));
const __VLS_69 = __VLS_68({
    label: "自定义数据权限",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const __VLS_71 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "本部门数据权限",
    value: "3",
}));
const __VLS_73 = __VLS_72({
    label: "本部门数据权限",
    value: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const __VLS_75 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "本部门及以下数据权限",
    value: "4",
}));
const __VLS_77 = __VLS_76({
    label: "本部门及以下数据权限",
    value: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "仅本人数据权限",
    value: "5",
}));
const __VLS_81 = __VLS_80({
    label: "仅本人数据权限",
    value: "5",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
var __VLS_62;
var __VLS_58;
const __VLS_83 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "菜单树权限",
    prop: "menuCheckStrictly",
}));
const __VLS_85 = __VLS_84({
    label: "菜单树权限",
    prop: "menuCheckStrictly",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "menu-tree-wrap" },
});
const __VLS_87 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuTree),
    props: ({ label: 'menuName', children: 'children' }),
    nodeKey: "menuId",
    checkStrictly: (!__VLS_ctx.formData.menuCheckStrictly),
    showCheckbox: true,
    defaultExpandAll: true,
}));
const __VLS_89 = __VLS_88({
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuTree),
    props: ({ label: 'menuName', children: 'children' }),
    nodeKey: "menuId",
    checkStrictly: (!__VLS_ctx.formData.menuCheckStrictly),
    showCheckbox: true,
    defaultExpandAll: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
/** @type {typeof __VLS_ctx.menuTreeRef} */ ;
var __VLS_91 = {};
var __VLS_90;
var __VLS_86;
const __VLS_93 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "备注",
    prop: "remark",
}));
const __VLS_95 = __VLS_94({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
const __VLS_97 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}));
const __VLS_99 = __VLS_98({
    modelValue: (__VLS_ctx.formData.remark),
    type: "textarea",
    placeholder: "请输入备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
var __VLS_96;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_101 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    let __VLS_107;
    const __VLS_108 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_104.slots.default;
    var __VLS_104;
    const __VLS_109 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    let __VLS_115;
    const __VLS_116 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_112.slots.default;
    var __VLS_112;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['menu-tree-wrap']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_92 = __VLS_91;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            isEdit: isEdit,
            formRef: formRef,
            submitting: submitting,
            menuTree: menuTree,
            menuTreeRef: menuTreeRef,
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
//# sourceMappingURL=RoleForm.vue.js.map