import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getUserRoles, assignUserRole } from '@/api/system/user.api';
import { getAllRoles } from '@/api/system/user.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 状态
const roleList = ref([]);
const selectedRoleIds = ref([]);
const submitting = ref(false);
// 加载角色列表
async function fetchRoleList() {
    try {
        const res = await getAllRoles();
        roleList.value = res;
    }
    catch (error) {
        console.error('加载角色列表失败', error);
    }
}
// 加载用户已有角色
async function fetchUserRoles() {
    if (!props.userId)
        return;
    try {
        const res = await getUserRoles(props.userId);
        selectedRoleIds.value = res;
    }
    catch (error) {
        console.error('加载用户角色失败', error);
    }
}
// 提交
async function handleSubmit() {
    if (!props.userId)
        return;
    try {
        submitting.value = true;
        await assignUserRole(props.userId, selectedRoleIds.value);
        ElMessage.success('分配成功');
        emit('refresh');
        handleClose();
    }
    catch (error) {
        console.error('分配失败', error);
    }
    finally {
        submitting.value = false;
    }
}
// 关闭
function handleClose() {
    selectedRoleIds.value = [];
    visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
    if (val) {
        fetchRoleList();
        fetchUserRoles();
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
    modelValue: (__VLS_ctx.visible),
    title: "分配角色",
    width: "500px",
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "分配角色",
    width: "500px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "role-assign" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "tips" },
});
const __VLS_5 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.selectedRoleIds),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.selectedRoleIds),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roleList))) {
    const __VLS_9 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        key: (role.roleId),
        value: (role.roleId),
        disabled: (role.status === '1'),
    }));
    const __VLS_11 = __VLS_10({
        key: (role.roleId),
        value: (role.roleId),
        disabled: (role.status === '1'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    (role.roleName);
    var __VLS_12;
}
var __VLS_8;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_13 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (__VLS_ctx.handleClose)
    };
    __VLS_16.slots.default;
    var __VLS_16;
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_24.slots.default;
    var __VLS_24;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['role-assign']} */ ;
/** @type {__VLS_StyleScopedClasses['tips']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            roleList: roleList,
            selectedRoleIds: selectedRoleIds,
            submitting: submitting,
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