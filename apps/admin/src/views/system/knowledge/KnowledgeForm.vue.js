import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';
import { addKnowledge, updateKnowledge, getCategoryList } from '@/api/system/knowledge.api';
const props = defineProps();
const emit = defineEmits();
// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const isEdit = computed(() => !!props.knowledgeData?.knowledgeId);
// 状态
const formRef = ref();
const submitting = ref(false);
const editorRef = ref(null);
const categoryList = ref([]);
// 工具栏配置
const toolbarConfig = {
  excludeKeys: [],
};
// 编辑器配置
const editorConfig = {
  placeholder: '请输入文档内容...',
  MENU_CONF: {},
};
// 表单数据
const formData = ref({
  title: '',
  categoryId: undefined,
  categoryName: '',
  content: '',
  summary: '',
  coverUrl: '',
  tags: '',
  status: '0',
  visible: '0',
  sort: 0,
  remark: '',
});
// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入文档标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择文档分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文档内容', trigger: 'blur' }],
};
// 获取分类列表
async function fetchCategoryList() {
  try {
    const res = await getCategoryList();
    categoryList.value = res.data || [];
  } catch (error) {
    console.error('获取分类列表失败', error);
  }
}
// 填充表单数据
function fillFormData() {
  if (props.knowledgeData) {
    formData.value = {
      knowledgeId: props.knowledgeData.knowledgeId,
      title: props.knowledgeData.title,
      categoryId: props.knowledgeData.categoryId,
      categoryName: props.knowledgeData.categoryName,
      content: props.knowledgeData.content,
      summary: props.knowledgeData.summary,
      coverUrl: props.knowledgeData.coverUrl,
      tags: props.knowledgeData.tags,
      status: props.knowledgeData.status,
      visible: props.knowledgeData.visible,
      sort: props.knowledgeData.sort,
      remark: props.knowledgeData.remark,
    };
  } else {
    formData.value = {
      title: '',
      categoryId: undefined,
      categoryName: '',
      content: '',
      summary: '',
      coverUrl: '',
      tags: '',
      status: '0',
      visible: '0',
      sort: 0,
      remark: '',
    };
  }
}
// 编辑器创建
function handleCreated(editor) {
  editorRef.value = editor;
}
// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (isEdit.value) {
      await updateKnowledge(formData.value);
      ElMessage.success('修改成功');
    } else {
      await addKnowledge(formData.value);
      ElMessage.success('新增成功');
    }
    emit('refresh');
    handleClose();
  } catch (error) {
    console.error('提交失败', error);
  } finally {
    submitting.value = false;
  }
}
// 关闭弹窗
function handleClose() {
  formRef.value?.resetFields();
  // 销毁编辑器，防止内存泄漏
  if (editorRef.value) {
    editorRef.value.destroy();
    editorRef.value = null;
  }
  visible.value = false;
}
// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fillFormData();
  }
});
// 初始化
onMounted(() => {
  fetchCategoryList();
});
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
    ...{ onClose: {} },
    modelValue: __VLS_ctx.visible,
    title: __VLS_ctx.isEdit ? '编辑文档' : '新增文档',
    width: '900px',
    appendToBody: true,
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onClose: {} },
    modelValue: __VLS_ctx.visible,
    title: __VLS_ctx.isEdit ? '编辑文档' : '新增文档',
    width: '900px',
    appendToBody: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onClose: __VLS_ctx.handleClose,
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
    labelWidth: '100px',
  }),
);
const __VLS_11 = __VLS_10(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.rules,
    labelWidth: '100px',
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
    label: '文档标题',
    prop: 'title',
  }),
);
const __VLS_17 = __VLS_16(
  {
    label: '文档标题',
    prop: 'title',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_16),
);
__VLS_18.slots.default;
const __VLS_19 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(
  __VLS_19,
  new __VLS_19({
    modelValue: __VLS_ctx.formData.title,
    placeholder: '请输入文档标题',
  }),
);
const __VLS_21 = __VLS_20(
  {
    modelValue: __VLS_ctx.formData.title,
    placeholder: '请输入文档标题',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_20),
);
var __VLS_18;
const __VLS_23 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(
  __VLS_23,
  new __VLS_23({
    gutter: 20,
  }),
);
const __VLS_25 = __VLS_24(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_24),
);
__VLS_26.slots.default;
const __VLS_27 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(
  __VLS_27,
  new __VLS_27({
    span: 12,
  }),
);
const __VLS_29 = __VLS_28(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_28),
);
__VLS_30.slots.default;
const __VLS_31 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(
  __VLS_31,
  new __VLS_31({
    label: '文档分类',
    prop: 'categoryId',
  }),
);
const __VLS_33 = __VLS_32(
  {
    label: '文档分类',
    prop: 'categoryId',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_32),
);
__VLS_34.slots.default;
const __VLS_35 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(
  __VLS_35,
  new __VLS_35({
    modelValue: __VLS_ctx.formData.categoryId,
    placeholder: '请选择分类',
    ...{ style: {} },
  }),
);
const __VLS_37 = __VLS_36(
  {
    modelValue: __VLS_ctx.formData.categoryId,
    placeholder: '请选择分类',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_36),
);
__VLS_38.slots.default;
for (const [category] of __VLS_getVForSourceType(__VLS_ctx.categoryList)) {
  const __VLS_39 = {}.ElOption;
  /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
  const __VLS_40 = __VLS_asFunctionalComponent(
    __VLS_39,
    new __VLS_39({
      key: category.categoryId,
      label: category.categoryName,
      value: category.categoryId,
    }),
  );
  const __VLS_41 = __VLS_40(
    {
      key: category.categoryId,
      label: category.categoryName,
      value: category.categoryId,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_40),
  );
}
var __VLS_38;
var __VLS_34;
var __VLS_30;
const __VLS_43 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(
  __VLS_43,
  new __VLS_43({
    span: 12,
  }),
);
const __VLS_45 = __VLS_44(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_44),
);
__VLS_46.slots.default;
const __VLS_47 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(
  __VLS_47,
  new __VLS_47({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_49 = __VLS_48(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_48),
);
__VLS_50.slots.default;
const __VLS_51 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(
  __VLS_51,
  new __VLS_51({
    modelValue: __VLS_ctx.formData.status,
  }),
);
const __VLS_53 = __VLS_52(
  {
    modelValue: __VLS_ctx.formData.status,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_52),
);
__VLS_54.slots.default;
const __VLS_55 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(
  __VLS_55,
  new __VLS_55({
    value: '0',
  }),
);
const __VLS_57 = __VLS_56(
  {
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_56),
);
__VLS_58.slots.default;
var __VLS_58;
const __VLS_59 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(
  __VLS_59,
  new __VLS_59({
    value: '1',
  }),
);
const __VLS_61 = __VLS_60(
  {
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_60),
);
__VLS_62.slots.default;
var __VLS_62;
var __VLS_54;
var __VLS_50;
var __VLS_46;
var __VLS_26;
const __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(
  __VLS_63,
  new __VLS_63({
    label: '标签',
    prop: 'tags',
  }),
);
const __VLS_65 = __VLS_64(
  {
    label: '标签',
    prop: 'tags',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_64),
);
__VLS_66.slots.default;
const __VLS_67 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(
  __VLS_67,
  new __VLS_67({
    modelValue: __VLS_ctx.formData.tags,
    placeholder: '请输入标签，多个标签用逗号分隔',
  }),
);
const __VLS_69 = __VLS_68(
  {
    modelValue: __VLS_ctx.formData.tags,
    placeholder: '请输入标签，多个标签用逗号分隔',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_68),
);
var __VLS_66;
const __VLS_71 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(
  __VLS_71,
  new __VLS_71({
    label: '摘要',
    prop: 'summary',
  }),
);
const __VLS_73 = __VLS_72(
  {
    label: '摘要',
    prop: 'summary',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_72),
);
__VLS_74.slots.default;
const __VLS_75 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(
  __VLS_75,
  new __VLS_75({
    modelValue: __VLS_ctx.formData.summary,
    type: 'textarea',
    placeholder: '请输入文档摘要',
    rows: 2,
  }),
);
const __VLS_77 = __VLS_76(
  {
    modelValue: __VLS_ctx.formData.summary,
    type: 'textarea',
    placeholder: '请输入文档摘要',
    rows: 2,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_76),
);
var __VLS_74;
const __VLS_79 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(
  __VLS_79,
  new __VLS_79({
    label: '文档内容',
    prop: 'content',
  }),
);
const __VLS_81 = __VLS_80(
  {
    label: '文档内容',
    prop: 'content',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_80),
);
__VLS_82.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'editor-wrapper' },
});
const __VLS_83 = {}.Toolbar;
/** @type {[typeof __VLS_components.Toolbar, ]} */ // @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(
  __VLS_83,
  new __VLS_83({
    editor: __VLS_ctx.editorRef,
    defaultConfig: __VLS_ctx.toolbarConfig,
    mode: 'default',
    ...{ style: {} },
  }),
);
const __VLS_85 = __VLS_84(
  {
    editor: __VLS_ctx.editorRef,
    defaultConfig: __VLS_ctx.toolbarConfig,
    mode: 'default',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_84),
);
const __VLS_87 = {}.Editor;
/** @type {[typeof __VLS_components.Editor, ]} */ // @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(
  __VLS_87,
  new __VLS_87({
    ...{ onOnCreated: {} },
    modelValue: __VLS_ctx.formData.content,
    defaultConfig: __VLS_ctx.editorConfig,
    mode: 'default',
    ...{ style: {} },
  }),
);
const __VLS_89 = __VLS_88(
  {
    ...{ onOnCreated: {} },
    modelValue: __VLS_ctx.formData.content,
    defaultConfig: __VLS_ctx.editorConfig,
    mode: 'default',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_88),
);
let __VLS_91;
let __VLS_92;
let __VLS_93;
const __VLS_94 = {
  onOnCreated: __VLS_ctx.handleCreated,
};
var __VLS_90;
var __VLS_82;
const __VLS_95 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ // @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(
  __VLS_95,
  new __VLS_95({
    gutter: 20,
  }),
);
const __VLS_97 = __VLS_96(
  {
    gutter: 20,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_96),
);
__VLS_98.slots.default;
const __VLS_99 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(
  __VLS_99,
  new __VLS_99({
    span: 12,
  }),
);
const __VLS_101 = __VLS_100(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_100),
);
__VLS_102.slots.default;
const __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(
  __VLS_103,
  new __VLS_103({
    label: '可见性',
    prop: 'visible',
  }),
);
const __VLS_105 = __VLS_104(
  {
    label: '可见性',
    prop: 'visible',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_104),
);
__VLS_106.slots.default;
const __VLS_107 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(
  __VLS_107,
  new __VLS_107({
    modelValue: __VLS_ctx.formData.visible,
  }),
);
const __VLS_109 = __VLS_108(
  {
    modelValue: __VLS_ctx.formData.visible,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_108),
);
__VLS_110.slots.default;
const __VLS_111 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(
  __VLS_111,
  new __VLS_111({
    value: '0',
  }),
);
const __VLS_113 = __VLS_112(
  {
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_112),
);
__VLS_114.slots.default;
var __VLS_114;
const __VLS_115 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(
  __VLS_115,
  new __VLS_115({
    value: '1',
  }),
);
const __VLS_117 = __VLS_116(
  {
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_116),
);
__VLS_118.slots.default;
var __VLS_118;
var __VLS_110;
var __VLS_106;
var __VLS_102;
const __VLS_119 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ // @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(
  __VLS_119,
  new __VLS_119({
    span: 12,
  }),
);
const __VLS_121 = __VLS_120(
  {
    span: 12,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_120),
);
__VLS_122.slots.default;
const __VLS_123 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(
  __VLS_123,
  new __VLS_123({
    label: '排序',
    prop: 'sort',
  }),
);
const __VLS_125 = __VLS_124(
  {
    label: '排序',
    prop: 'sort',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_124),
);
__VLS_126.slots.default;
const __VLS_127 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ // @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(
  __VLS_127,
  new __VLS_127({
    modelValue: __VLS_ctx.formData.sort,
    min: 0,
    ...{ style: {} },
  }),
);
const __VLS_129 = __VLS_128(
  {
    modelValue: __VLS_ctx.formData.sort,
    min: 0,
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_128),
);
var __VLS_126;
var __VLS_122;
var __VLS_98;
const __VLS_131 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(
  __VLS_131,
  new __VLS_131({
    label: '备注',
    prop: 'remark',
  }),
);
const __VLS_133 = __VLS_132(
  {
    label: '备注',
    prop: 'remark',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_132),
);
__VLS_134.slots.default;
const __VLS_135 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(
  __VLS_135,
  new __VLS_135({
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    placeholder: '请输入备注',
  }),
);
const __VLS_137 = __VLS_136(
  {
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    placeholder: '请输入备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_136),
);
var __VLS_134;
var __VLS_12;
{
  const { footer: __VLS_thisSlot } = __VLS_3.slots;
  const __VLS_139 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_140 = __VLS_asFunctionalComponent(
    __VLS_139,
    new __VLS_139({
      ...{ onClick: {} },
    }),
  );
  const __VLS_141 = __VLS_140(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_140),
  );
  let __VLS_143;
  let __VLS_144;
  let __VLS_145;
  const __VLS_146 = {
    onClick: __VLS_ctx.handleClose,
  };
  __VLS_142.slots.default;
  var __VLS_142;
  const __VLS_147 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_148 = __VLS_asFunctionalComponent(
    __VLS_147,
    new __VLS_147({
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    }),
  );
  const __VLS_149 = __VLS_148(
    {
      ...{ onClick: {} },
      type: 'primary',
      loading: __VLS_ctx.submitting,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_148),
  );
  let __VLS_151;
  let __VLS_152;
  let __VLS_153;
  const __VLS_154 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_150.slots.default;
  var __VLS_150;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['editor-wrapper']} */ // @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Editor: Editor,
      Toolbar: Toolbar,
      visible: visible,
      isEdit: isEdit,
      formRef: formRef,
      submitting: submitting,
      editorRef: editorRef,
      categoryList: categoryList,
      toolbarConfig: toolbarConfig,
      editorConfig: editorConfig,
      formData: formData,
      rules: rules,
      handleCreated: handleCreated,
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
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=KnowledgeForm.vue.js.map
