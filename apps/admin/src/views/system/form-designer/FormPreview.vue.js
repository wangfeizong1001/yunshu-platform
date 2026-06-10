/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Refresh, Check } from '@element-plus/icons-vue';
import { getForm, submitFormData } from '@/api/system/form.api';
const router = useRouter();
const route = useRoute();
// 表单信息
const formInfo = ref(null);
// 表单组件列表
const components = ref([]);
// 表单数据
const formData = reactive({});
// 表单引用
const formRef = ref();
// 表单验证规则
const formRules = computed(() => {
  const rules = {};
  components.value.forEach((component) => {
    if (component.required) {
      rules[component.field] = [
        { required: true, message: `请输入${component.label}`, trigger: 'blur' },
      ];
    }
  });
  return rules;
});
// 初始化表单数据
function initFormData() {
  components.value.forEach((component) => {
    if (component.type === 'checkbox') {
      formData[component.field] = component.defaultValue || [];
    } else if (component.type === 'switch') {
      formData[component.field] = component.defaultValue || false;
    } else if (component.type === 'upload') {
      formData[component.field] = [];
    } else {
      formData[component.field] = component.defaultValue || '';
    }
  });
}
// 返回
function handleBack() {
  router.push('/system/form');
}
// 重置
function handleReset() {
  initFormData();
  ElMessage.success('已重置');
}
// 提交
async function handleSubmit() {
  if (!formRef.value || !formInfo.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await submitFormData(formInfo.value.formId, formData);
        ElMessage.success('提交成功');
      } catch (error) {
        console.error('提交失败', error);
      }
    }
  });
}
// 获取表单信息
async function fetchFormInfo() {
  const formId = Number(route.params.id);
  try {
    const res = await getForm(formId);
    formInfo.value = res;
    components.value = res.components || [];
    initFormData();
  } catch (error) {
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
// CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'form-preview' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'toolbar' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'left' },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClick: {} },
    icon: __VLS_ctx.ArrowLeft,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.ArrowLeft,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClick: __VLS_ctx.handleBack,
};
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'form-title' },
});
__VLS_ctx.formInfo?.formName || '表单预览';
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'right' },
});
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_10 = __VLS_9(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
  onClick: __VLS_ctx.handleReset,
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Check,
  }),
);
const __VLS_18 = __VLS_17(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Check,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
  onClick: __VLS_ctx.handleSubmit,
};
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'preview-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'preview-card' },
});
if (__VLS_ctx.formInfo?.description) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'form-description' },
  });
  __VLS_ctx.formInfo.description;
}
const __VLS_24 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    labelWidth: '120px',
    ...{ class: 'preview-form' },
  }),
);
const __VLS_26 = __VLS_25(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    labelWidth: '120px',
    ...{ class: 'preview-form' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
/** @type {typeof __VLS_ctx.formRef} */ var __VLS_28 = {};
__VLS_27.slots.default;
for (const [component] of __VLS_getVForSourceType(__VLS_ctx.components)) {
  const __VLS_30 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_31 = __VLS_asFunctionalComponent(
    __VLS_30,
    new __VLS_30({
      key: component.id,
      label: component.label,
      prop: component.field,
      required: component.required,
    }),
  );
  const __VLS_32 = __VLS_31(
    {
      key: component.id,
      label: component.label,
      prop: component.field,
      required: component.required,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_31),
  );
  __VLS_33.slots.default;
  if (component.type === 'input') {
    const __VLS_34 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(
      __VLS_34,
      new __VLS_34({
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
      }),
    );
    const __VLS_36 = __VLS_35(
      {
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_35),
    );
  } else if (component.type === 'textarea') {
    const __VLS_38 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(
      __VLS_38,
      new __VLS_38({
        modelValue: __VLS_ctx.formData[component.field],
        type: 'textarea',
        rows: 4,
        placeholder: component.placeholder,
        disabled: component.disabled,
      }),
    );
    const __VLS_40 = __VLS_39(
      {
        modelValue: __VLS_ctx.formData[component.field],
        type: 'textarea',
        rows: 4,
        placeholder: component.placeholder,
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_39),
    );
  } else if (component.type === 'radio') {
    const __VLS_42 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(
      __VLS_42,
      new __VLS_42({
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      }),
    );
    const __VLS_44 = __VLS_43(
      {
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_43),
    );
    __VLS_45.slots.default;
    for (const [option] of __VLS_getVForSourceType(component.options)) {
      const __VLS_46 = {}.ElRadio;
      /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
      const __VLS_47 = __VLS_asFunctionalComponent(
        __VLS_46,
        new __VLS_46({
          key: String(option.value),
          value: option.value,
        }),
      );
      const __VLS_48 = __VLS_47(
        {
          key: String(option.value),
          value: option.value,
        },
        ...__VLS_functionalComponentArgsRest(__VLS_47),
      );
      __VLS_49.slots.default;
      option.label;
      var __VLS_49;
    }
    var __VLS_45;
  } else if (component.type === 'checkbox') {
    const __VLS_50 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(
      __VLS_50,
      new __VLS_50({
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      }),
    );
    const __VLS_52 = __VLS_51(
      {
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_51),
    );
    __VLS_53.slots.default;
    for (const [option] of __VLS_getVForSourceType(component.options)) {
      const __VLS_54 = {}.ElCheckbox;
      /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ // @ts-ignore
      const __VLS_55 = __VLS_asFunctionalComponent(
        __VLS_54,
        new __VLS_54({
          key: String(option.value),
          label: String(option.value),
        }),
      );
      const __VLS_56 = __VLS_55(
        {
          key: String(option.value),
          label: String(option.value),
        },
        ...__VLS_functionalComponentArgsRest(__VLS_55),
      );
      __VLS_57.slots.default;
      option.label;
      var __VLS_57;
    }
    var __VLS_53;
  } else if (component.type === 'select') {
    const __VLS_58 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(
      __VLS_58,
      new __VLS_58({
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
        clearable: true,
      }),
    );
    const __VLS_60 = __VLS_59(
      {
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
        clearable: true,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_59),
    );
    __VLS_61.slots.default;
    for (const [option] of __VLS_getVForSourceType(component.options)) {
      const __VLS_62 = {}.ElOption;
      /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
      const __VLS_63 = __VLS_asFunctionalComponent(
        __VLS_62,
        new __VLS_62({
          key: String(option.value),
          label: option.label,
          value: option.value,
        }),
      );
      const __VLS_64 = __VLS_63(
        {
          key: String(option.value),
          label: option.label,
          value: option.value,
        },
        ...__VLS_functionalComponentArgsRest(__VLS_63),
      );
    }
    var __VLS_61;
  } else if (component.type === 'date') {
    const __VLS_66 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(
      __VLS_66,
      new __VLS_66({
        modelValue: __VLS_ctx.formData[component.field],
        type: 'date',
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      }),
    );
    const __VLS_68 = __VLS_67(
      {
        modelValue: __VLS_ctx.formData[component.field],
        type: 'date',
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_67),
    );
  } else if (component.type === 'datetime') {
    const __VLS_70 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(
      __VLS_70,
      new __VLS_70({
        modelValue: __VLS_ctx.formData[component.field],
        type: 'datetime',
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      }),
    );
    const __VLS_72 = __VLS_71(
      {
        modelValue: __VLS_ctx.formData[component.field],
        type: 'datetime',
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_71),
    );
  } else if (component.type === 'time') {
    const __VLS_74 = {}.ElTimePicker;
    /** @type {[typeof __VLS_components.ElTimePicker, typeof __VLS_components.elTimePicker, ]} */ // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(
      __VLS_74,
      new __VLS_74({
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      }),
    );
    const __VLS_76 = __VLS_75(
      {
        modelValue: __VLS_ctx.formData[component.field],
        placeholder: component.placeholder,
        disabled: component.disabled,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_75),
    );
  } else if (component.type === 'number') {
    const __VLS_78 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(
      __VLS_78,
      new __VLS_78({
        modelValue: __VLS_ctx.formData[component.field],
        min: component.min,
        max: component.max,
        step: component.step,
        disabled: component.disabled,
      }),
    );
    const __VLS_80 = __VLS_79(
      {
        modelValue: __VLS_ctx.formData[component.field],
        min: component.min,
        max: component.max,
        step: component.step,
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_79),
    );
  } else if (component.type === 'switch') {
    const __VLS_82 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(
      __VLS_82,
      new __VLS_82({
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      }),
    );
    const __VLS_84 = __VLS_83(
      {
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_83),
    );
  } else if (component.type === 'rate') {
    const __VLS_86 = {}.ElRate;
    /** @type {[typeof __VLS_components.ElRate, typeof __VLS_components.elRate, ]} */ // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(
      __VLS_86,
      new __VLS_86({
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      }),
    );
    const __VLS_88 = __VLS_87(
      {
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_87),
    );
  } else if (component.type === 'slider') {
    const __VLS_90 = {}.ElSlider;
    /** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(
      __VLS_90,
      new __VLS_90({
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      }),
    );
    const __VLS_92 = __VLS_91(
      {
        modelValue: __VLS_ctx.formData[component.field],
        disabled: component.disabled,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_91),
    );
  } else if (component.type === 'upload') {
    const __VLS_94 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(
      __VLS_94,
      new __VLS_94({
        fileList: __VLS_ctx.formData[component.field],
        action: '#',
        multiple: component.multiple,
        limit: component.maxCount,
        accept: component.accept,
        disabled: component.disabled,
        autoUpload: false,
      }),
    );
    const __VLS_96 = __VLS_95(
      {
        fileList: __VLS_ctx.formData[component.field],
        action: '#',
        multiple: component.multiple,
        limit: component.maxCount,
        accept: component.accept,
        disabled: component.disabled,
        autoUpload: false,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_95),
    );
    __VLS_97.slots.default;
    const __VLS_98 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(
      __VLS_98,
      new __VLS_98({
        type: 'primary',
      }),
    );
    const __VLS_100 = __VLS_99(
      {
        type: 'primary',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_99),
    );
    __VLS_101.slots.default;
    var __VLS_101;
    {
      const { tip: __VLS_thisSlot } = __VLS_97.slots;
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'el-upload__tip' },
      });
      component.placeholder || '请上传文件';
    }
    var __VLS_97;
  }
  var __VLS_33;
}
var __VLS_27;
/** @type {__VLS_StyleScopedClasses['form-preview']} */ /** @type {__VLS_StyleScopedClasses['toolbar']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['form-title']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['preview-container']} */ /** @type {__VLS_StyleScopedClasses['preview-card']} */ /** @type {__VLS_StyleScopedClasses['form-description']} */ /** @type {__VLS_StyleScopedClasses['preview-form']} */ /** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ // @ts-ignore
var __VLS_29 = __VLS_28;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      ArrowLeft: ArrowLeft,
      Refresh: Refresh,
      Check: Check,
      formInfo: formInfo,
      components: components,
      formData: formData,
      formRef: formRef,
      formRules: formRules,
      handleBack: handleBack,
      handleReset: handleReset,
      handleSubmit: handleSubmit,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FormPreview.vue.js.map
