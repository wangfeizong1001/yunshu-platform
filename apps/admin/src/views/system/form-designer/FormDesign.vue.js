/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, View, Check, Delete, DocumentCopy, Rank, Edit, Tickets, List, Select, Calendar, Clock, Upload, Operation, SwitchButton, Star, More, } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { getForm, updateForm } from '@/api/system/form.api';
const router = useRouter();
const route = useRoute();
// 表单信息
const formInfo = ref(null);
// 表单组件列表
const components = ref([]);
// 当前选中的组件
const selectedComponent = ref(null);
// 组件库
const componentLibrary = [
    { type: 'input', label: '输入框', icon: Edit },
    { type: 'textarea', label: '文本域', icon: Edit },
    { type: 'radio', label: '单选框', icon: Tickets },
    { type: 'checkbox', label: '复选框', icon: List },
    { type: 'select', label: '下拉框', icon: Select },
    { type: 'date', label: '日期选择', icon: Calendar },
    { type: 'datetime', label: '日期时间', icon: Calendar },
    { type: 'time', label: '时间选择', icon: Clock },
    { type: 'number', label: '数字输入', icon: Operation },
    { type: 'switch', label: '开关', icon: SwitchButton },
    { type: 'rate', label: '评分', icon: Star },
    { type: 'slider', label: '滑块', icon: More },
    { type: 'upload', label: '上传', icon: Upload }
];
// 生成唯一ID
function generateId() {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
// 创建组件默认配置
function createComponent(type) {
    const baseConfig = {
        id: generateId(),
        label: '新组件',
        field: 'field_' + Date.now(),
        placeholder: '请输入',
        required: false,
        disabled: false,
        defaultValue: ''
    };
    switch (type) {
        case 'radio':
        case 'select':
            return {
                ...baseConfig,
                type,
                options: [
                    { label: '选项1', value: 'option1' },
                    { label: '选项2', value: 'option2' },
                    { label: '选项3', value: 'option3' }
                ]
            };
        case 'checkbox':
            return {
                ...baseConfig,
                type,
                options: [
                    { label: '选项1', value: 'option1' },
                    { label: '选项2', value: 'option2' },
                    { label: '选项3', value: 'option3' }
                ],
                defaultValue: []
            };
        case 'number':
            return {
                ...baseConfig,
                type,
                min: undefined,
                max: undefined,
                step: 1
            };
        case 'upload':
            return {
                ...baseConfig,
                type,
                accept: '',
                maxCount: 1,
                multiple: false
            };
        default:
            return { ...baseConfig, type };
    }
}
// 渲染组件预览
function renderComponentPreview(component) {
    const props = {
        modelValue: component.defaultValue,
        placeholder: component.placeholder,
        disabled: component.disabled
    };
    switch (component.type) {
        case 'input':
            return { name: 'el-input', props };
        case 'textarea':
            return { name: 'el-input', props: { ...props, type: 'textarea', rows: 3 } };
        case 'radio':
            return {
                name: 'el-radio-group',
                props,
                children: component.options?.map(opt => h('el-radio', { key: String(opt.value), value: opt.value, label: opt.label }))
            };
        case 'checkbox':
            return {
                name: 'el-checkbox-group',
                props,
                children: component.options?.map(opt => h('el-checkbox', { key: String(opt.value), value: opt.value, label: opt.label }))
            };
        case 'select':
            return {
                name: 'el-select',
                props,
                children: component.options?.map(opt => h('el-option', { key: String(opt.value), value: opt.value, label: opt.label }))
            };
        case 'date':
            return { name: 'el-date-picker', props: { ...props, type: 'date' } };
        case 'datetime':
            return { name: 'el-date-picker', props: { ...props, type: 'datetime' } };
        case 'time':
            return { name: 'el-time-picker', props };
        case 'number':
            return {
                name: 'el-input-number',
                props: { ...props, min: component.min, max: component.max, step: component.step }
            };
        case 'switch':
            return { name: 'el-switch', props };
        case 'rate':
            return { name: 'el-rate', props };
        case 'slider':
            return { name: 'el-slider', props };
        case 'upload':
            return {
                name: 'el-upload',
                props: { action: '#' },
                children: [h('el-button', { type: 'primary' }, '点击上传')]
            };
        default:
            return { name: 'el-input', props };
    }
}
// 添加组件
function handleAddComponent(component) {
    const newComponent = createComponent(component.type);
    newComponent.label = component.label;
    components.value.push(newComponent);
    selectedComponent.value = newComponent;
}
// 选择组件
function handleSelectComponent(component) {
    selectedComponent.value = component;
}
// 复制组件
function handleCopyComponent(component) {
    const copied = JSON.parse(JSON.stringify(component));
    copied.id = generateId();
    copied.field = component.field + '_copy';
    const index = components.value.findIndex(c => c.id === component.id);
    components.value.splice(index + 1, 0, copied);
    selectedComponent.value = copied;
}
// 删除组件
function handleDeleteComponent(id) {
    const index = components.value.findIndex(c => c.id === id);
    if (index !== -1) {
        components.value.splice(index, 1);
        if (selectedComponent.value?.id === id) {
            selectedComponent.value = null;
        }
    }
}
// 添加选项
function handleAddOption() {
    if (selectedComponent.value && selectedComponent.value.options) {
        const newOption = {
            label: `选项${selectedComponent.value.options.length + 1}`,
            value: `option${selectedComponent.value.options.length + 1}`
        };
        selectedComponent.value.options.push(newOption);
    }
}
// 删除选项
function handleDeleteOption(index) {
    if (selectedComponent.value && selectedComponent.value.options) {
        selectedComponent.value.options.splice(index, 1);
    }
}
// 返回
function handleBack() {
    router.push('/system/form');
}
// 预览
function handlePreview() {
    if (formInfo.value) {
        router.push(`/system/form-preview/${formInfo.value.formId}`);
    }
}
// 保存
async function handleSave() {
    if (!formInfo.value)
        return;
    try {
        await updateForm({
            formId: formInfo.value.formId,
            components: components.value
        });
        ElMessage.success('保存成功');
    }
    catch (error) {
        console.error('保存失败', error);
        ElMessage.error('保存失败');
    }
}
// 获取表单信息
async function fetchFormInfo() {
    const formId = Number(route.params.id);
    try {
        const res = await getForm(formId);
        formInfo.value = res;
        components.value = res.components || [];
    }
    catch (error) {
        console.error('获取表单信息失败', error);
    }
}
// 初始化
onMounted(() => {
    fetchFormInfo();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['component-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['design-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['props-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-tip']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-design" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleBack)
};
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "form-title" },
});
(__VLS_ctx.formInfo?.formName || '表单设计');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.View),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.View),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handlePreview)
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.handleSave)
};
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-list" },
});
for (const [component] of __VLS_getVForSourceType((__VLS_ctx.componentLibrary))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleAddComponent(component);
            } },
        key: (component.type),
        ...{ class: "component-item" },
    });
    const __VLS_24 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: "component-icon" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "component-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = ((component.icon));
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "component-name" },
    });
    (component.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-area" },
});
const __VLS_32 = {}.draggable;
/** @type {[typeof __VLS_components.Draggable, typeof __VLS_components.draggable, typeof __VLS_components.Draggable, typeof __VLS_components.draggable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.components),
    itemKey: "id",
    animation: "300",
    handle: ".drag-handle",
    ...{ class: "components-container" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.components),
    itemKey: "id",
    animation: "300",
    handle: ".drag-handle",
    ...{ class: "components-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { item: __VLS_thisSlot } = __VLS_35.slots;
    const [{ element }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-component" },
        ...{ class: ({ active: __VLS_ctx.selectedComponent?.id === element.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-header" },
    });
    const __VLS_36 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ class: "drag-handle" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ class: "drag-handle" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.Rank;
    /** @type {[typeof __VLS_components.Rank, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "component-label" },
    });
    (element.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-actions" },
    });
    const __VLS_44 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        ...{ class: "action-icon" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        ...{ class: "action-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleCopyComponent(element);
        }
    };
    __VLS_47.slots.default;
    const __VLS_52 = {}.DocumentCopy;
    /** @type {[typeof __VLS_components.DocumentCopy, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_47;
    const __VLS_56 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        ...{ class: "action-icon delete" },
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        ...{ class: "action-icon delete" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDeleteComponent(element.id);
        }
    };
    __VLS_59.slots.default;
    const __VLS_64 = {}.Delete;
    /** @type {[typeof __VLS_components.Delete, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_59;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleSelectComponent(element);
            } },
        ...{ class: "component-preview" },
    });
    const __VLS_68 = ((__VLS_ctx.renderComponentPreview(element)));
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...(element),
    }));
    const __VLS_70 = __VLS_69({
        ...(element),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
}
{
    const { footer: __VLS_thisSlot } = __VLS_35.slots;
    if (__VLS_ctx.components.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty-tip" },
        });
    }
}
var __VLS_35;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "props-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
if (__VLS_ctx.selectedComponent) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "props-content" },
    });
    const __VLS_72 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        model: (__VLS_ctx.selectedComponent),
        labelWidth: "100px",
    }));
    const __VLS_74 = __VLS_73({
        model: (__VLS_ctx.selectedComponent),
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "标签",
    }));
    const __VLS_78 = __VLS_77({
        label: "标签",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.selectedComponent.label),
        placeholder: "请输入标签",
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.selectedComponent.label),
        placeholder: "请输入标签",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    const __VLS_84 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "字段名",
    }));
    const __VLS_86 = __VLS_85({
        label: "字段名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.selectedComponent.field),
        placeholder: "请输入字段名",
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.selectedComponent.field),
        placeholder: "请输入字段名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    var __VLS_87;
    const __VLS_92 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "占位符",
    }));
    const __VLS_94 = __VLS_93({
        label: "占位符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        modelValue: (__VLS_ctx.selectedComponent.placeholder),
        placeholder: "请输入占位符",
    }));
    const __VLS_98 = __VLS_97({
        modelValue: (__VLS_ctx.selectedComponent.placeholder),
        placeholder: "请输入占位符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    var __VLS_95;
    const __VLS_100 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "必填",
    }));
    const __VLS_102 = __VLS_101({
        label: "必填",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        modelValue: (__VLS_ctx.selectedComponent.required),
    }));
    const __VLS_106 = __VLS_105({
        modelValue: (__VLS_ctx.selectedComponent.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    var __VLS_103;
    const __VLS_108 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        label: "禁用",
    }));
    const __VLS_110 = __VLS_109({
        label: "禁用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.selectedComponent.disabled),
    }));
    const __VLS_114 = __VLS_113({
        modelValue: (__VLS_ctx.selectedComponent.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    var __VLS_111;
    const __VLS_116 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "默认值",
    }));
    const __VLS_118 = __VLS_117({
        label: "默认值",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    if (__VLS_ctx.selectedComponent.type !== 'checkbox') {
        const __VLS_120 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            modelValue: (__VLS_ctx.selectedComponent.defaultValue),
            placeholder: "请输入默认值",
        }));
        const __VLS_122 = __VLS_121({
            modelValue: (__VLS_ctx.selectedComponent.defaultValue),
            placeholder: "请输入默认值",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    }
    else {
        const __VLS_124 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            modelValue: (__VLS_ctx.selectedComponent.defaultValue),
            multiple: true,
            placeholder: "请选择",
        }));
        const __VLS_126 = __VLS_125({
            modelValue: (__VLS_ctx.selectedComponent.defaultValue),
            multiple: true,
            placeholder: "请选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        for (const [option] of __VLS_getVForSourceType((__VLS_ctx.selectedComponent.options))) {
            const __VLS_128 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
                key: (String(option.value)),
                label: (option.label),
                value: (option.value),
            }));
            const __VLS_130 = __VLS_129({
                key: (String(option.value)),
                label: (option.label),
                value: (option.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        }
        var __VLS_127;
    }
    var __VLS_119;
    if (['radio', 'checkbox', 'select'].includes(__VLS_ctx.selectedComponent.type)) {
        const __VLS_132 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            contentPosition: "left",
        }));
        const __VLS_134 = __VLS_133({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        var __VLS_135;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "options-list" },
        });
        for (const [option, index] of __VLS_getVForSourceType((__VLS_ctx.selectedComponent.options))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (index),
                ...{ class: "option-item" },
            });
            const __VLS_136 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                modelValue: (option.label),
                placeholder: "标签",
                ...{ style: {} },
            }));
            const __VLS_138 = __VLS_137({
                modelValue: (option.label),
                placeholder: "标签",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            const __VLS_140 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
                modelValue: option.value,
                placeholder: "值",
                ...{ style: {} },
            }));
            const __VLS_142 = __VLS_141({
                modelValue: option.value,
                placeholder: "值",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            const __VLS_144 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                ...{ 'onClick': {} },
                ...{ class: "option-delete" },
            }));
            const __VLS_146 = __VLS_145({
                ...{ 'onClick': {} },
                ...{ class: "option-delete" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            let __VLS_148;
            let __VLS_149;
            let __VLS_150;
            const __VLS_151 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(['radio', 'checkbox', 'select'].includes(__VLS_ctx.selectedComponent.type)))
                        return;
                    __VLS_ctx.handleDeleteOption(index);
                }
            };
            __VLS_147.slots.default;
            const __VLS_152 = {}.Delete;
            /** @type {[typeof __VLS_components.Delete, ]} */ ;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
            const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
            var __VLS_147;
        }
        const __VLS_156 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_158 = __VLS_157({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        let __VLS_160;
        let __VLS_161;
        let __VLS_162;
        const __VLS_163 = {
            onClick: (__VLS_ctx.handleAddOption)
        };
        __VLS_159.slots.default;
        var __VLS_159;
    }
    if (__VLS_ctx.selectedComponent.type === 'number') {
        const __VLS_164 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            contentPosition: "left",
        }));
        const __VLS_166 = __VLS_165({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        var __VLS_167;
        const __VLS_168 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            label: "最小值",
        }));
        const __VLS_170 = __VLS_169({
            label: "最小值",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_171.slots.default;
        const __VLS_172 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            modelValue: (__VLS_ctx.selectedComponent.min),
            step: (1),
        }));
        const __VLS_174 = __VLS_173({
            modelValue: (__VLS_ctx.selectedComponent.min),
            step: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        var __VLS_171;
        const __VLS_176 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            label: "最大值",
        }));
        const __VLS_178 = __VLS_177({
            label: "最大值",
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        const __VLS_180 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            modelValue: (__VLS_ctx.selectedComponent.max),
            step: (1),
        }));
        const __VLS_182 = __VLS_181({
            modelValue: (__VLS_ctx.selectedComponent.max),
            step: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        var __VLS_179;
        const __VLS_184 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            label: "步长",
        }));
        const __VLS_186 = __VLS_185({
            label: "步长",
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        __VLS_187.slots.default;
        const __VLS_188 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            modelValue: (__VLS_ctx.selectedComponent.step),
            min: (0.01),
            step: (0.01),
        }));
        const __VLS_190 = __VLS_189({
            modelValue: (__VLS_ctx.selectedComponent.step),
            min: (0.01),
            step: (0.01),
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        var __VLS_187;
    }
    if (__VLS_ctx.selectedComponent.type === 'upload') {
        const __VLS_192 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            contentPosition: "left",
        }));
        const __VLS_194 = __VLS_193({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        __VLS_195.slots.default;
        var __VLS_195;
        const __VLS_196 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            label: "文件类型",
        }));
        const __VLS_198 = __VLS_197({
            label: "文件类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        __VLS_199.slots.default;
        const __VLS_200 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            modelValue: (__VLS_ctx.selectedComponent.accept),
            placeholder: "如: image/*",
        }));
        const __VLS_202 = __VLS_201({
            modelValue: (__VLS_ctx.selectedComponent.accept),
            placeholder: "如: image/*",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        var __VLS_199;
        const __VLS_204 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            label: "最大数量",
        }));
        const __VLS_206 = __VLS_205({
            label: "最大数量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        const __VLS_208 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            modelValue: (__VLS_ctx.selectedComponent.maxCount),
            min: (1),
        }));
        const __VLS_210 = __VLS_209({
            modelValue: (__VLS_ctx.selectedComponent.maxCount),
            min: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        var __VLS_207;
        const __VLS_212 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            label: "多选",
        }));
        const __VLS_214 = __VLS_213({
            label: "多选",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        __VLS_215.slots.default;
        const __VLS_216 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            modelValue: (__VLS_ctx.selectedComponent.multiple),
        }));
        const __VLS_218 = __VLS_217({
            modelValue: (__VLS_ctx.selectedComponent.multiple),
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        var __VLS_215;
    }
    var __VLS_75;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-tip" },
    });
}
/** @type {__VLS_StyleScopedClasses['form-design']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['form-title']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['design-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-list']} */ ;
/** @type {__VLS_StyleScopedClasses['component-item']} */ ;
/** @type {__VLS_StyleScopedClasses['component-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['component-name']} */ ;
/** @type {__VLS_StyleScopedClasses['design-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['design-area']} */ ;
/** @type {__VLS_StyleScopedClasses['components-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-component']} */ ;
/** @type {__VLS_StyleScopedClasses['component-header']} */ ;
/** @type {__VLS_StyleScopedClasses['drag-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['component-label']} */ ;
/** @type {__VLS_StyleScopedClasses['component-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['delete']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['props-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['props-content']} */ ;
/** @type {__VLS_StyleScopedClasses['options-list']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-tip']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowLeft: ArrowLeft,
            View: View,
            Check: Check,
            Delete: Delete,
            DocumentCopy: DocumentCopy,
            Rank: Rank,
            draggable: draggable,
            formInfo: formInfo,
            components: components,
            selectedComponent: selectedComponent,
            componentLibrary: componentLibrary,
            renderComponentPreview: renderComponentPreview,
            handleAddComponent: handleAddComponent,
            handleSelectComponent: handleSelectComponent,
            handleCopyComponent: handleCopyComponent,
            handleDeleteComponent: handleDeleteComponent,
            handleAddOption: handleAddOption,
            handleDeleteOption: handleDeleteOption,
            handleBack: handleBack,
            handlePreview: handlePreview,
            handleSave: handleSave,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FormDesign.vue.js.map