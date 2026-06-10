import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { sendMessage } from '@/api/system/message.api';
const props = defineProps();
const emit = defineEmits();
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const formRef = ref();
const submitLoading = ref(false);
const userLoading = ref(false);
const userOptions = ref([]);
const defaultFormData = {
  receiverIds: [],
  title: '',
  type: 'normal',
  priority: 'medium',
  content: '',
};
const formData = reactive({ ...defaultFormData });
const rules = {
  receiverIds: [{ required: true, message: '请选择接收人', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  content: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
};
async function handleRemoteSearch(query) {
  if (query) {
    userLoading.value = true;
    try {
      userOptions.value = [
        { userId: 1, username: 'admin', nickname: '管理员' },
        { userId: 2, username: 'test', nickname: '测试用户' },
        { userId: 3, username: 'user1', nickname: '用户1' },
      ].filter(
        (user) => user.username.includes(query) || (user.nickname && user.nickname.includes(query)),
      );
    } finally {
      userLoading.value = false;
    }
  } else {
    userOptions.value = [];
  }
}
function resetForm() {
  Object.assign(formData, { ...defaultFormData });
  formRef.value?.resetFields();
}
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitLoading.value = true;
    await sendMessage(formData);
    ElMessage.success('发送成功');
    visible.value = false;
    emit('refresh');
  } catch (error) {
    if (error !== false) {
      console.error('发送失败:', error);
    }
  } finally {
    submitLoading.value = false;
  }
}
function handleCancel() {
  visible.value = false;
}
function handleClosed() {
  resetForm();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onClosed: {} },
    modelValue: __VLS_ctx.visible,
    title: '发送消息',
    width: '700px',
    closeOnClickModal: false,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClosed: {} },
    modelValue: __VLS_ctx.visible,
    title: '发送消息',
    width: '700px',
    closeOnClickModal: false,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClosed: __VLS_ctx.handleClosed,
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(
  __VLS_9,
  new __VLS_9({
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '80px',
  }),
);
const __VLS_11 = __VLS_10(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_10),
);
/** @type {typeof __VLS_ctx.formRef} */ var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(
  __VLS_15,
  new __VLS_15({
    label: '接收人',
    prop: 'receiverIds',
  }),
);
const __VLS_17 = __VLS_16(
  {
    label: '接收人',
    prop: 'receiverIds',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_16),
);
__VLS_18.slots.default;
const __VLS_19 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(
  __VLS_19,
  new __VLS_19({
    modelValue: __VLS_ctx.formData.receiverIds,
    multiple: true,
    filterable: true,
    remote: true,
    reserveKeyword: true,
    placeholder: '请选择接收人',
    ...{ style: {} },
    remoteMethod: __VLS_ctx.handleRemoteSearch,
    loading: __VLS_ctx.userLoading,
  }),
);
const __VLS_21 = __VLS_20(
  {
    modelValue: __VLS_ctx.formData.receiverIds,
    multiple: true,
    filterable: true,
    remote: true,
    reserveKeyword: true,
    placeholder: '请选择接收人',
    ...{ style: {} },
    remoteMethod: __VLS_ctx.handleRemoteSearch,
    loading: __VLS_ctx.userLoading,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_20),
);
__VLS_22.slots.default;
for (const [user] of __VLS_getVForSourceType(__VLS_ctx.userOptions)) {
  const __VLS_23 = {}.ElOption;
  /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
  const __VLS_24 = __VLS_asFunctionalComponent(
    __VLS_23,
    new __VLS_23({
      key: user.userId,
      label: user.nickname || user.username,
      value: user.userId,
    }),
  );
  const __VLS_25 = __VLS_24(
    {
      key: user.userId,
      label: user.nickname || user.username,
      value: user.userId,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_24),
  );
}
var __VLS_22;
var __VLS_18;
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(
  __VLS_27,
  new __VLS_27({
    label: '标题',
    prop: 'title',
  }),
);
const __VLS_29 = __VLS_28(
  {
    label: '标题',
    prop: 'title',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_28),
);
__VLS_30.slots.default;
const __VLS_31 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(
  __VLS_31,
  new __VLS_31({
    modelValue: __VLS_ctx.formData.title,
    placeholder: '请输入标题',
    maxlength: '100',
    showWordLimit: true,
  }),
);
const __VLS_33 = __VLS_32(
  {
    modelValue: __VLS_ctx.formData.title,
    placeholder: '请输入标题',
    maxlength: '100',
    showWordLimit: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_32),
);
var __VLS_30;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(
  __VLS_35,
  new __VLS_35({
    label: '类型',
    prop: 'type',
  }),
);
const __VLS_37 = __VLS_36(
  {
    label: '类型',
    prop: 'type',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_36),
);
__VLS_38.slots.default;
const __VLS_39 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(
  __VLS_39,
  new __VLS_39({
    modelValue: __VLS_ctx.formData.type,
  }),
);
const __VLS_41 = __VLS_40(
  {
    modelValue: __VLS_ctx.formData.type,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_40),
);
__VLS_42.slots.default;
const __VLS_43 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(
  __VLS_43,
  new __VLS_43({
    label: 'normal',
  }),
);
const __VLS_45 = __VLS_44(
  {
    label: 'normal',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_44),
);
__VLS_46.slots.default;
var __VLS_46;
const __VLS_47 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(
  __VLS_47,
  new __VLS_47({
    label: 'system',
  }),
);
const __VLS_49 = __VLS_48(
  {
    label: 'system',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_48),
);
__VLS_50.slots.default;
var __VLS_50;
const __VLS_51 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(
  __VLS_51,
  new __VLS_51({
    label: 'reminder',
  }),
);
const __VLS_53 = __VLS_52(
  {
    label: 'reminder',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_52),
);
__VLS_54.slots.default;
var __VLS_54;
var __VLS_42;
var __VLS_38;
const __VLS_55 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(
  __VLS_55,
  new __VLS_55({
    label: '优先级',
    prop: 'priority',
  }),
);
const __VLS_57 = __VLS_56(
  {
    label: '优先级',
    prop: 'priority',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_56),
);
__VLS_58.slots.default;
const __VLS_59 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(
  __VLS_59,
  new __VLS_59({
    modelValue: __VLS_ctx.formData.priority,
  }),
);
const __VLS_61 = __VLS_60(
  {
    modelValue: __VLS_ctx.formData.priority,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_60),
);
__VLS_62.slots.default;
const __VLS_63 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(
  __VLS_63,
  new __VLS_63({
    label: 'low',
  }),
);
const __VLS_65 = __VLS_64(
  {
    label: 'low',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_64),
);
__VLS_66.slots.default;
var __VLS_66;
const __VLS_67 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(
  __VLS_67,
  new __VLS_67({
    label: 'medium',
  }),
);
const __VLS_69 = __VLS_68(
  {
    label: 'medium',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_68),
);
__VLS_70.slots.default;
var __VLS_70;
const __VLS_71 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(
  __VLS_71,
  new __VLS_71({
    label: 'high',
  }),
);
const __VLS_73 = __VLS_72(
  {
    label: 'high',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_72),
);
__VLS_74.slots.default;
var __VLS_74;
var __VLS_62;
var __VLS_58;
const __VLS_75 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(
  __VLS_75,
  new __VLS_75({
    label: '内容',
    prop: 'content',
  }),
);
const __VLS_77 = __VLS_76(
  {
    label: '内容',
    prop: 'content',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_76),
);
__VLS_78.slots.default;
const __VLS_79 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(
  __VLS_79,
  new __VLS_79({
    modelValue: __VLS_ctx.formData.content,
    type: 'textarea',
    rows: 6,
    placeholder: '请输入消息内容',
    maxlength: '1000',
    showWordLimit: true,
  }),
);
const __VLS_81 = __VLS_80(
  {
    modelValue: __VLS_ctx.formData.content,
    type: 'textarea',
    rows: 6,
    placeholder: '请输入消息内容',
    maxlength: '1000',
    showWordLimit: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_80),
);
var __VLS_78;
var __VLS_12;
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'dialog-footer' },
  });
  const __VLS_83 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_84 = __VLS_asFunctionalComponent(
    __VLS_83,
    new __VLS_83({
      ...{ onClick: {} },
    }),
  );
  const __VLS_85 = __VLS_84(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_84),
  );
  let __VLS_87;
  let __VLS_88;
  let __VLS_89;
  const __VLS_90 = {
    onClick: __VLS_ctx.handleCancel,
  };
  __VLS_86.slots.default;
  var __VLS_86;
  const __VLS_91 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_92 = __VLS_asFunctionalComponent(
    __VLS_91,
    new __VLS_91({
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitLoading,
    }),
  );
  const __VLS_93 = __VLS_92(
    {
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitLoading,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_92),
  );
  let __VLS_95;
  let __VLS_96;
  let __VLS_97;
  const __VLS_98 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_94.slots.default;
  var __VLS_94;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ // @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      visible: visible,
      formRef: formRef,
      submitLoading: submitLoading,
      userLoading: userLoading,
      userOptions: userOptions,
      formData: formData,
      rules: rules,
      handleRemoteSearch: handleRemoteSearch,
      handleSubmit: handleSubmit,
      handleCancel: handleCancel,
      handleClosed: handleClosed,
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
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MessageForm.vue.js.map
