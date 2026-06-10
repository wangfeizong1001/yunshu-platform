/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import {
  getFormPage,
  getForm,
  addForm,
  updateForm,
  deleteForm,
  batchDeleteForm,
  copyForm,
  publishForm,
  stopForm,
} from '@/api/system/form.api';
const router = useRouter();
// 状态
const loading = ref(false);
const formList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const formDialogVisible = ref(false);
const currentForm = ref(null);
const formRef = ref();
const formData = reactive({
  formName: '',
  formCode: '',
  description: '',
  remark: '',
});
// 表单校验规则
const formRules = {
  formName: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
  formCode: [
    { required: true, message: '请输入表单编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '表单编码只能包含字母、数字和下划线', trigger: 'blur' },
  ],
};
// 查询参数
const queryParams = reactive({
  formName: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
});
// 获取表单列表
async function fetchFormList() {
  loading.value = true;
  try {
    const res = await getFormPage(queryParams);
    formList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchFormList();
}
// 重置查询
function resetQuery() {
  queryParams.formName = '';
  queryParams.status = '';
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchFormList();
}
// 新增
function handleAdd() {
  currentForm.value = null;
  resetForm();
  formDialogVisible.value = true;
}
// 编辑
async function handleEdit(row) {
  try {
    const res = await getForm(row.formId);
    currentForm.value = res;
    Object.assign(formData, {
      formName: res.formName,
      formCode: res.formCode,
      description: res.description,
      remark: res.remark,
    });
    formDialogVisible.value = true;
  } catch (error) {
    console.error('获取表单详情失败', error);
  }
}
// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除表单"${row.formName}"？`, '提示', {
      type: 'warning',
    });
    await deleteForm(row.formId);
    ElMessage.success('删除成功');
    fetchFormList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`是否确认删除选中的${selectedRows.value.length}个表单？`, '提示', {
      type: 'warning',
    });
    await batchDeleteForm(selectedRows.value.map((row) => row.formId));
    ElMessage.success('删除成功');
    fetchFormList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 复制
async function handleCopy(row) {
  try {
    await ElMessageBox.confirm(`是否确认复制表单"${row.formName}"？`, '提示', {
      type: 'warning',
    });
    await copyForm(row.formId);
    ElMessage.success('复制成功');
    fetchFormList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('复制失败', error);
    }
  }
}
// 发布
async function handlePublish(row) {
  try {
    await ElMessageBox.confirm(`是否确认发布表单"${row.formName}"？`, '提示', {
      type: 'warning',
    });
    await publishForm(row.formId);
    ElMessage.success('发布成功');
    fetchFormList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布失败', error);
    }
  }
}
// 停用
async function handleStop(row) {
  try {
    await ElMessageBox.confirm(`是否确认停用表单"${row.formName}"？`, '提示', {
      type: 'warning',
    });
    await stopForm(row.formId);
    ElMessage.success('停用成功');
    fetchFormList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('停用失败', error);
    }
  }
}
// 设计
function handleDesign(row) {
  router.push(`/system/form-design/${row.formId}`);
}
// 预览
function handlePreview(row) {
  router.push(`/system/form-preview/${row.formId}`);
}
// 提交
async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (currentForm.value) {
          await updateForm({
            formId: currentForm.value.formId,
            ...formData,
          });
        } else {
          await addForm(formData);
        }
        ElMessage.success('操作成功');
        formDialogVisible.value = false;
        fetchFormList();
      } catch (error) {
        console.error('操作失败', error);
      }
    }
  });
}
// 重置表单
function resetForm() {
  formData.formName = '';
  formData.formCode = '';
  formData.description = '';
  formData.remark = '';
  formRef.value?.resetFields();
}
// 批量选择
function handleSelectionChange(selection) {
  selectedRows.value = selection;
}
// 初始化
onMounted(() => {
  fetchFormList();
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
  ...{ class: 'form-list' },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    shadow: 'never',
    ...{ class: 'search-card' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    shadow: 'never',
    ...{ class: 'search-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    model: __VLS_ctx.queryParams,
    inline: true,
  }),
);
const __VLS_6 = __VLS_5(
  {
    model: __VLS_ctx.queryParams,
    inline: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    label: '表单名称',
    prop: 'formName',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '表单名称',
    prop: 'formName',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.formName,
    placeholder: '请输入表单名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.formName,
    placeholder: '请输入表单名称',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
  onKeyup: __VLS_ctx.handleQuery,
};
var __VLS_15;
var __VLS_11;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_26 = __VLS_25(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '草稿',
    value: '0',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '草稿',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '已发布',
    value: '1',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '已发布',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
var __VLS_27;
var __VLS_23;
const __VLS_36 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_42 = __VLS_41(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_43.slots.default;
var __VLS_43;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_50 = __VLS_49(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_51.slots.default;
var __VLS_51;
var __VLS_39;
var __VLS_7;
var __VLS_3;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_58 = __VLS_57(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
__VLS_59.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_59.slots;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'table-header' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'left' },
  });
  const __VLS_60 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_61 = __VLS_asFunctionalComponent(
    __VLS_60,
    new __VLS_60({
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    }),
  );
  const __VLS_62 = __VLS_61(
    {
      ...{ onClick: {} },
      type: 'primary',
      icon: __VLS_ctx.Plus,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_61),
  );
  let __VLS_64;
  let __VLS_65;
  let __VLS_66;
  const __VLS_67 = {
    onClick: __VLS_ctx.handleAdd,
  };
  __VLS_63.slots.default;
  var __VLS_63;
  if (__VLS_ctx.selectedRows.length > 0) {
    const __VLS_68 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(
      __VLS_68,
      new __VLS_68({
        ...{ onClick: {} },
        type: 'danger',
        icon: __VLS_ctx.Delete,
      }),
    );
    const __VLS_70 = __VLS_69(
      {
        ...{ onClick: {} },
        type: 'danger',
        icon: __VLS_ctx.Delete,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_69),
    );
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
      onClick: __VLS_ctx.handleBatchDelete,
    };
    __VLS_71.slots.default;
    var __VLS_71;
  }
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_76 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_77 = __VLS_asFunctionalComponent(
    __VLS_76,
    new __VLS_76({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_78 = __VLS_77(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_77),
  );
  let __VLS_80;
  let __VLS_81;
  let __VLS_82;
  const __VLS_83 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_79;
}
const __VLS_84 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(
  __VLS_84,
  new __VLS_84({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.formList,
    stripe: true,
    border: true,
  }),
);
const __VLS_86 = __VLS_85(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.formList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_85),
);
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_87.slots.default;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(
  __VLS_92,
  new __VLS_92({
    type: 'selection',
    width: '50',
    fixed: true,
  }),
);
const __VLS_94 = __VLS_93(
  {
    type: 'selection',
    width: '50',
    fixed: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_93),
);
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(
  __VLS_96,
  new __VLS_96({
    prop: 'formId',
    label: '表单ID',
    width: '80',
  }),
);
const __VLS_98 = __VLS_97(
  {
    prop: 'formId',
    label: '表单ID',
    width: '80',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    prop: 'formName',
    label: '表单名称',
    width: '200',
  }),
);
const __VLS_102 = __VLS_101(
  {
    prop: 'formName',
    label: '表单名称',
    width: '200',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'formCode',
    label: '表单编码',
    width: '200',
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'formCode',
    label: '表单编码',
    width: '200',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'description',
    label: '描述',
    showOverflowTooltip: true,
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'description',
    label: '描述',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    prop: 'status',
    label: '状态',
    width: '100',
  }),
);
const __VLS_114 = __VLS_113(
  {
    prop: 'status',
    label: '状态',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
__VLS_115.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_115.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_116 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_117 = __VLS_asFunctionalComponent(
    __VLS_116,
    new __VLS_116({
      type: row.status === '1' ? 'success' : 'info',
    }),
  );
  const __VLS_118 = __VLS_117(
    {
      type: row.status === '1' ? 'success' : 'info',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_117),
  );
  __VLS_119.slots.default;
  row.status === '1' ? '已发布' : '草稿';
  var __VLS_119;
}
var __VLS_115;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'updateTime',
    label: '更新时间',
    width: '180',
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'updateTime',
    label: '更新时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    label: '操作',
    width: '300',
    fixed: 'right',
  }),
);
const __VLS_130 = __VLS_129(
  {
    label: '操作',
    width: '300',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
__VLS_131.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_131.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_132 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_133 = __VLS_asFunctionalComponent(
    __VLS_132,
    new __VLS_132({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_134 = __VLS_133(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_133),
  );
  let __VLS_136;
  let __VLS_137;
  let __VLS_138;
  const __VLS_139 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDesign(row);
    },
  };
  __VLS_135.slots.default;
  var __VLS_135;
  const __VLS_140 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_141 = __VLS_asFunctionalComponent(
    __VLS_140,
    new __VLS_140({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_142 = __VLS_141(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_141),
  );
  let __VLS_144;
  let __VLS_145;
  let __VLS_146;
  const __VLS_147 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handlePreview(row);
    },
  };
  __VLS_143.slots.default;
  var __VLS_143;
  if (row.status === '0') {
    const __VLS_148 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(
      __VLS_148,
      new __VLS_148({
        ...{ onClick: {} },
        link: true,
        type: 'success',
      }),
    );
    const __VLS_150 = __VLS_149(
      {
        ...{ onClick: {} },
        link: true,
        type: 'success',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_149),
    );
    let __VLS_152;
    let __VLS_153;
    let __VLS_154;
    const __VLS_155 = {
      onClick: (...[$event]) => {
        if (!(row.status === '0')) return;
        __VLS_ctx.handlePublish(row);
      },
    };
    __VLS_151.slots.default;
    var __VLS_151;
  }
  if (row.status === '1') {
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(
      __VLS_156,
      new __VLS_156({
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      }),
    );
    const __VLS_158 = __VLS_157(
      {
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_157),
    );
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
      onClick: (...[$event]) => {
        if (!(row.status === '1')) return;
        __VLS_ctx.handleStop(row);
      },
    };
    __VLS_159.slots.default;
    var __VLS_159;
  }
  const __VLS_164 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_165 = __VLS_asFunctionalComponent(
    __VLS_164,
    new __VLS_164({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_166 = __VLS_165(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_165),
  );
  let __VLS_168;
  let __VLS_169;
  let __VLS_170;
  const __VLS_171 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleCopy(row);
    },
  };
  __VLS_167.slots.default;
  var __VLS_167;
  const __VLS_172 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_173 = __VLS_asFunctionalComponent(
    __VLS_172,
    new __VLS_172({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_174 = __VLS_173(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_173),
  );
  let __VLS_176;
  let __VLS_177;
  let __VLS_178;
  const __VLS_179 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleEdit(row);
    },
  };
  __VLS_175.slots.default;
  var __VLS_175;
  const __VLS_180 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_181 = __VLS_asFunctionalComponent(
    __VLS_180,
    new __VLS_180({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_182 = __VLS_181(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_181),
  );
  let __VLS_184;
  let __VLS_185;
  let __VLS_186;
  const __VLS_187 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_183.slots.default;
  var __VLS_183;
}
var __VLS_131;
var __VLS_87;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_188 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(
  __VLS_188,
  new __VLS_188({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_190 = __VLS_189(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_189),
);
let __VLS_192;
let __VLS_193;
let __VLS_194;
const __VLS_195 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_196 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_191;
var __VLS_59;
const __VLS_197 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(
  __VLS_197,
  new __VLS_197({
    ...{ onClose: {} },
    modelValue: __VLS_ctx.formDialogVisible,
    title: __VLS_ctx.currentForm ? '编辑表单' : '新增表单',
    width: '600px',
  }),
);
const __VLS_199 = __VLS_198(
  {
    ...{ onClose: {} },
    modelValue: __VLS_ctx.formDialogVisible,
    title: __VLS_ctx.currentForm ? '编辑表单' : '新增表单',
    width: '600px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_198),
);
let __VLS_201;
let __VLS_202;
let __VLS_203;
const __VLS_204 = {
  onClose: __VLS_ctx.resetForm,
};
__VLS_200.slots.default;
const __VLS_205 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(
  __VLS_205,
  new __VLS_205({
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    ref: 'formRef',
    labelWidth: '100px',
  }),
);
const __VLS_207 = __VLS_206(
  {
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    ref: 'formRef',
    labelWidth: '100px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_206),
);
/** @type {typeof __VLS_ctx.formRef} */ var __VLS_209 = {};
__VLS_208.slots.default;
const __VLS_211 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(
  __VLS_211,
  new __VLS_211({
    label: '表单名称',
    prop: 'formName',
  }),
);
const __VLS_213 = __VLS_212(
  {
    label: '表单名称',
    prop: 'formName',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_212),
);
__VLS_214.slots.default;
const __VLS_215 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(
  __VLS_215,
  new __VLS_215({
    modelValue: __VLS_ctx.formData.formName,
    placeholder: '请输入表单名称',
  }),
);
const __VLS_217 = __VLS_216(
  {
    modelValue: __VLS_ctx.formData.formName,
    placeholder: '请输入表单名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_216),
);
var __VLS_214;
const __VLS_219 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(
  __VLS_219,
  new __VLS_219({
    label: '表单编码',
    prop: 'formCode',
  }),
);
const __VLS_221 = __VLS_220(
  {
    label: '表单编码',
    prop: 'formCode',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_220),
);
__VLS_222.slots.default;
const __VLS_223 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(
  __VLS_223,
  new __VLS_223({
    modelValue: __VLS_ctx.formData.formCode,
    placeholder: '请输入表单编码',
    disabled: !!__VLS_ctx.currentForm,
  }),
);
const __VLS_225 = __VLS_224(
  {
    modelValue: __VLS_ctx.formData.formCode,
    placeholder: '请输入表单编码',
    disabled: !!__VLS_ctx.currentForm,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_224),
);
var __VLS_222;
const __VLS_227 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(
  __VLS_227,
  new __VLS_227({
    label: '描述',
    prop: 'description',
  }),
);
const __VLS_229 = __VLS_228(
  {
    label: '描述',
    prop: 'description',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_228),
);
__VLS_230.slots.default;
const __VLS_231 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(
  __VLS_231,
  new __VLS_231({
    modelValue: __VLS_ctx.formData.description,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入描述',
  }),
);
const __VLS_233 = __VLS_232(
  {
    modelValue: __VLS_ctx.formData.description,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入描述',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_232),
);
var __VLS_230;
const __VLS_235 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(
  __VLS_235,
  new __VLS_235({
    label: '备注',
    prop: 'remark',
  }),
);
const __VLS_237 = __VLS_236(
  {
    label: '备注',
    prop: 'remark',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_236),
);
__VLS_238.slots.default;
const __VLS_239 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(
  __VLS_239,
  new __VLS_239({
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  }),
);
const __VLS_241 = __VLS_240(
  {
    modelValue: __VLS_ctx.formData.remark,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_240),
);
var __VLS_238;
var __VLS_208;
{
  const { footer: __VLS_thisSlot } = __VLS_200.slots;
  const __VLS_243 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_244 = __VLS_asFunctionalComponent(
    __VLS_243,
    new __VLS_243({
      ...{ onClick: {} },
    }),
  );
  const __VLS_245 = __VLS_244(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_244),
  );
  let __VLS_247;
  let __VLS_248;
  let __VLS_249;
  const __VLS_250 = {
    onClick: (...[$event]) => {
      __VLS_ctx.formDialogVisible = false;
    },
  };
  __VLS_246.slots.default;
  var __VLS_246;
  const __VLS_251 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_252 = __VLS_asFunctionalComponent(
    __VLS_251,
    new __VLS_251({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_253 = __VLS_252(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_252),
  );
  let __VLS_255;
  let __VLS_256;
  let __VLS_257;
  const __VLS_258 = {
    onClick: __VLS_ctx.handleSubmit,
  };
  __VLS_254.slots.default;
  var __VLS_254;
}
var __VLS_200;
/** @type {__VLS_StyleScopedClasses['form-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ // @ts-ignore
var __VLS_210 = __VLS_209;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Plus: Plus,
      Delete: Delete,
      loading: loading,
      formList: formList,
      total: total,
      selectedRows: selectedRows,
      formDialogVisible: formDialogVisible,
      currentForm: currentForm,
      formRef: formRef,
      formData: formData,
      formRules: formRules,
      queryParams: queryParams,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleAdd: handleAdd,
      handleEdit: handleEdit,
      handleDelete: handleDelete,
      handleBatchDelete: handleBatchDelete,
      handleCopy: handleCopy,
      handlePublish: handlePublish,
      handleStop: handleStop,
      handleDesign: handleDesign,
      handlePreview: handlePreview,
      handleSubmit: handleSubmit,
      resetForm: resetForm,
      handleSelectionChange: handleSelectionChange,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FormList.vue.js.map
