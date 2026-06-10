/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted } from 'vue';
import { getTenantList } from '@/api/tenant/tenant.api';
const props = withDefaults(defineProps(), {
    modelValue: null,
    placeholder: '请选择租户',
    clearable: true,
    disabled: false,
});
const emit = defineEmits();
// 状态
const tenantList = ref([]);
// 加载租户列表
async function fetchTenantList() {
    try {
        tenantList.value = await getTenantList({ status: '0' });
    }
    catch (error) {
        console.error('加载租户列表失败', error);
    }
}
// 处理变更
function handleChange(value) {
    emit('update:modelValue', value);
    emit('change', value);
}
// 监听值变化，确保外部 v-model 绑定正确
watch(() => props.modelValue, (val) => {
    if (val === undefined || val === null) {
        // do nothing
    }
});
// 初始化
onMounted(() => {
    fetchTenantList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    modelValue: null,
    placeholder: '请选择租户',
    clearable: true,
    disabled: false,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.modelValue),
    placeholder: (__VLS_ctx.placeholder),
    clearable: (__VLS_ctx.clearable),
    disabled: (__VLS_ctx.disabled),
    filterable: true,
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.modelValue),
    placeholder: (__VLS_ctx.placeholder),
    clearable: (__VLS_ctx.clearable),
    disabled: (__VLS_ctx.disabled),
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.handleChange)
};
var __VLS_8 = {};
__VLS_3.slots.default;
for (const [tenant] of __VLS_getVForSourceType((__VLS_ctx.tenantList))) {
    const __VLS_9 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        key: (tenant.tenantId),
        label: (tenant.tenantName),
        value: (tenant.tenantId),
    }));
    const __VLS_11 = __VLS_10({
        key: (tenant.tenantId),
        label: (tenant.tenantName),
        value: (tenant.tenantId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tenant-option" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "name" },
    });
    (tenant.tenantName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "code" },
    });
    (tenant.tenantCode);
    var __VLS_12;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['tenant-option']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['code']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            tenantList: tenantList,
            handleChange: handleChange,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map