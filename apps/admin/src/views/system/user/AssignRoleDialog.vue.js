import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getUserRoles, assignRoles } from '@/api/system/user.api';
const props = defineProps();
const emit = defineEmits();
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
const treeRef = ref();
const submitting = ref(false);
const roleTree = ref([]);
const selectedRoleIds = ref([]);
async function fetchData() {
    if (!props.userId)
        return;
    try {
        const res = await getUserRoles(props.userId);
        const data = res?.data;
        roleTree.value = data?.roles || [];
        selectedRoleIds.value = data?.userRoleIds || [];
    }
    catch (error) {
        console.error('加载角色数据失败', error);
    }
}
async function handleSubmit() {
    if (!props.userId)
        return;
    const checkedNodes = treeRef.value?.getCheckedNodes() || [];
    const roleIds = checkedNodes.map((node) => node.roleId);
    submitting.value = true;
    try {
        await assignRoles(props.userId, roleIds);
        ElMessage.success('角色分配成功');
        emit('refresh');
        handleClose();
    }
    catch (error) {
        console.error('分配角色失败', error);
    }
    finally {
        submitting.value = false;
    }
}
function handleClose() {
    visible.value = false;
}
watch(visible, (val) => {
    if (val && props.userId) {
        fetchData();
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
    title: "分配角色",
    width: "600px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    title: "分配角色",
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
const __VLS_9 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    title: "勾选需要分配的角色后点击确定保存",
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}));
const __VLS_11 = __VLS_10({
    title: "勾选需要分配的角色后点击确定保存",
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ref: "treeRef",
    data: (__VLS_ctx.roleTree),
    props: ({ label: 'roleName', children: 'children' }),
    nodeKey: "roleId",
    showCheckbox: true,
    checkStrictly: true,
    defaultCheckedKeys: (__VLS_ctx.selectedRoleIds),
    ...{ class: "role-tree" },
}));
const __VLS_15 = __VLS_14({
    ref: "treeRef",
    data: (__VLS_ctx.roleTree),
    props: ({ label: 'roleName', children: 'children' }),
    nodeKey: "roleId",
    showCheckbox: true,
    checkStrictly: true,
    defaultCheckedKeys: (__VLS_ctx.selectedRoleIds),
    ...{ class: "role-tree" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {typeof __VLS_ctx.treeRef} */ ;
var __VLS_17 = {};
var __VLS_16;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_19 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_22.slots.default;
    var __VLS_22;
    const __VLS_27 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_31;
    let __VLS_32;
    let __VLS_33;
    const __VLS_34 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_30.slots.default;
    var __VLS_30;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tree']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            treeRef: treeRef,
            submitting: submitting,
            roleTree: roleTree,
            selectedRoleIds: selectedRoleIds,
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
//# sourceMappingURL=AssignRoleDialog.vue.js.map