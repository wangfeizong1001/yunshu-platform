import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getTenantDetail, getPackageList, updateTenant, } from '@/api/tenant/tenant.api';
const props = defineProps();
const emit = defineEmits();
// 状态
const submitLoading = ref(false);
const currentTenant = ref();
const packageList = ref([]);
// 表单数据
const formData = ref({
    packageId: 0,
    expireTime: '',
    userLimit: 100,
});
// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
// 加载租户详情
async function fetchTenantDetail() {
    if (!props.tenantId)
        return;
    try {
        currentTenant.value = await getTenantDetail(props.tenantId);
        formData.value = {
            packageId: currentTenant.value.packageId,
            expireTime: currentTenant.value.expireTime,
            userLimit: currentTenant.value.userLimit,
        };
    }
    catch (error) {
        console.error('加载租户详情失败', error);
    }
}
// 加载套餐列表
async function fetchPackageList() {
    try {
        packageList.value = await getPackageList();
    }
    catch (error) {
        console.error('加载套餐列表失败', error);
    }
}
// 提交表单
async function handleSubmit() {
    if (!props.tenantId)
        return;
    try {
        submitLoading.value = true;
        // 更新租户信息
        await updateTenant(props.tenantId, {
            packageId: formData.value.packageId,
            expireTime: formData.value.expireTime,
            userLimit: formData.value.userLimit,
        });
        ElMessage.success('套餐配置成功');
        emit('update:modelValue', false);
    }
    catch (error) {
        console.error('配置失败', error);
    }
    finally {
        submitLoading.value = false;
    }
}
// 监听弹窗显示
watch(() => props.modelValue, (val) => {
    if (val) {
        fetchTenantDetail();
        fetchPackageList();
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
    title: "租户套餐配置",
    width: "600px",
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "租户套餐配置",
    width: "600px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (__VLS_ctx.currentTenant) {
    const __VLS_5 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        title: (`当前套餐：${__VLS_ctx.currentTenant.packageName}`),
        type: "success",
        closable: (false),
        ...{ style: {} },
    }));
    const __VLS_7 = __VLS_6({
        title: (`当前套餐：${__VLS_ctx.currentTenant.packageName}`),
        type: "success",
        closable: (false),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    model: (__VLS_ctx.formData),
    labelWidth: "100px",
}));
const __VLS_11 = __VLS_10({
    model: (__VLS_ctx.formData),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "选择套餐",
}));
const __VLS_15 = __VLS_14({
    label: "选择套餐",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    modelValue: (__VLS_ctx.formData.packageId),
    placeholder: "请选择套餐",
    ...{ style: {} },
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.formData.packageId),
    placeholder: "请选择套餐",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
for (const [pkg] of __VLS_getVForSourceType((__VLS_ctx.packageList))) {
    const __VLS_21 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }));
    const __VLS_23 = __VLS_22({
        key: (pkg.packageId),
        label: (pkg.packageName),
        value: (pkg.packageId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "package-option" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "name" },
    });
    (pkg.packageName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    (pkg.userLimit);
    (pkg.price === 0 ? '免费' : `¥${pkg.price}`);
    var __VLS_24;
}
var __VLS_20;
var __VLS_16;
const __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    label: "到期时间",
}));
const __VLS_27 = __VLS_26({
    label: "到期时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.formData.expireTime),
    type: "datetime",
    placeholder: "请选择到期时间",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.formData.expireTime),
    type: "datetime",
    placeholder: "请选择到期时间",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_28;
const __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "用户上限",
}));
const __VLS_35 = __VLS_34({
    label: "用户上限",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    ...{ style: {} },
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.formData.userLimit),
    min: (1),
    max: (999999),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
var __VLS_36;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_41 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_44.slots.default;
    var __VLS_44;
    const __VLS_49 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_53;
    let __VLS_54;
    let __VLS_55;
    const __VLS_56 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_52.slots.default;
    var __VLS_52;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['package-option']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['desc']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            submitLoading: submitLoading,
            currentTenant: currentTenant,
            packageList: packageList,
            formData: formData,
            visible: visible,
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
//# sourceMappingURL=TenantPackage.vue.js.map