/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { getMockProcessDefinitionPage } from '@/mock/workflow.mock';
import { useRouter } from 'vue-router';
const router = useRouter();
// 状态
const loading = ref(false);
const processList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const formDialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  id: '',
  name: '',
  key: '',
  category: '',
  description: '',
});
// 查询参数
const queryParams = reactive({
  name: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
});
// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入流程标识', trigger: 'blur' }],
};
// 获取流程定义列表
async function fetchProcessList() {
  loading.value = true;
  try {
    // 使用 Mock 数据
    const res = getMockProcessDefinitionPage(queryParams);
    processList.value = res.rows;
    total.value = res.total;
  } catch (error) {
    console.error('获取流程列表失败', error);
  } finally {
    loading.value = false;
  }
}
// 获取状态类型
function getStatusType(status) {
  const typeMap = {
    draft: 'info',
    active: 'success',
    suspended: 'warning',
  };
  return typeMap[status] || 'info';
}
// 获取状态标签
function getStatusLabel(status) {
  const labelMap = {
    draft: '草稿',
    active: '已发布',
    suspended: '已挂起',
  };
  return labelMap[status] || status;
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchProcessList();
}
// 重置查询
function resetQuery() {
  queryParams.name = '';
  queryParams.status = '';
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchProcessList();
}
// 新增
function handleAdd() {
  isEdit.value = false;
  Object.assign(formData, {
    id: '',
    name: '',
    key: '',
    category: '',
    description: '',
  });
  formDialogVisible.value = true;
}
// 编辑
function handleEdit(row) {
  isEdit.value = true;
  Object.assign(formData, row);
  formDialogVisible.value = true;
}
// 设计
function handleDesign(row) {
  router.push(`/workflow/process/design/${row.id}`);
}
// 发布
async function handleDeploy(row) {
  try {
    await ElMessageBox.confirm(`确认发布流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    });
    ElMessage.success('发布成功');
    refreshTable();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布失败', error);
    }
  }
}
// 挂起
async function handleSuspend(row) {
  try {
    await ElMessageBox.confirm(`确认挂起流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    });
    ElMessage.success('挂起成功');
    refreshTable();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('挂起失败', error);
    }
  }
}
// 激活
async function handleActivate(row) {
  try {
    await ElMessageBox.confirm(`确认激活流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    });
    ElMessage.success('激活成功');
    refreshTable();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('激活失败', error);
    }
  }
}
// 复制
function handleCopy(_row) {
  ElMessage.info('复制功能开发中');
}
// 导出
function handleExport(_row) {
  ElMessage.info('导出功能开发中');
}
// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除流程"${row.name}"吗？`, '提示', {
      type: 'warning',
    });
    ElMessage.success('删除成功');
    refreshTable();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 表单提交
async function handleFormSubmit() {
  await formRef.value?.validate();
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功');
  formDialogVisible.value = false;
  refreshTable();
}
// 选择变化
function handleSelectionChange(selection) {
  selectedRows.value = selection;
}
// 初始化
onMounted(() => {
  fetchProcessList();
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
  ...{ class: 'process-list' },
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
    label: '流程名称',
    prop: 'name',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '流程名称',
    prop: 'name',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    modelValue: __VLS_ctx.queryParams.name,
    placeholder: '请输入流程名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.name,
    placeholder: '请输入流程名称',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    label: '草稿',
    value: 'draft',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '草稿',
    value: 'draft',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '已发布',
    value: 'active',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '已发布',
    value: 'active',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '已挂起',
    value: 'suspended',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '已挂起',
    value: 'suspended',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
var __VLS_23;
var __VLS_19;
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
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_68 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  let __VLS_72;
  let __VLS_73;
  let __VLS_74;
  const __VLS_75 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_71;
}
const __VLS_76 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(
  __VLS_76,
  new __VLS_76({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.processList,
    stripe: true,
    border: true,
  }),
);
const __VLS_78 = __VLS_77(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.processList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_77),
);
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_79.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(
  __VLS_84,
  new __VLS_84({
    type: 'selection',
    width: '55',
    fixed: true,
  }),
);
const __VLS_86 = __VLS_85(
  {
    type: 'selection',
    width: '55',
    fixed: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_85),
);
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(
  __VLS_88,
  new __VLS_88({
    prop: 'name',
    label: '流程名称',
    minWidth: '150',
  }),
);
const __VLS_90 = __VLS_89(
  {
    prop: 'name',
    label: '流程名称',
    minWidth: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_89),
);
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(
  __VLS_92,
  new __VLS_92({
    prop: 'key',
    label: '流程标识',
    width: '180',
  }),
);
const __VLS_94 = __VLS_93(
  {
    prop: 'key',
    label: '流程标识',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_93),
);
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(
  __VLS_96,
  new __VLS_96({
    prop: 'version',
    label: '版本',
    width: '80',
    align: 'center',
  }),
);
const __VLS_98 = __VLS_97(
  {
    prop: 'version',
    label: '版本',
    width: '80',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    prop: 'category',
    label: '分类',
    width: '120',
  }),
);
const __VLS_102 = __VLS_101(
  {
    prop: 'category',
    label: '分类',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'description',
    label: '描述',
    minWidth: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'description',
    label: '描述',
    minWidth: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'status',
    label: '状态',
    width: '100',
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'status',
    label: '状态',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
__VLS_111.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_111.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_112 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_113 = __VLS_asFunctionalComponent(
    __VLS_112,
    new __VLS_112({
      type: __VLS_ctx.getStatusType(row.status),
    }),
  );
  const __VLS_114 = __VLS_113(
    {
      type: __VLS_ctx.getStatusType(row.status),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_113),
  );
  __VLS_115.slots.default;
  __VLS_ctx.getStatusLabel(row.status);
  var __VLS_115;
}
var __VLS_111;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  }),
);
const __VLS_118 = __VLS_117(
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    label: '操作',
    width: '300',
    fixed: 'right',
  }),
);
const __VLS_122 = __VLS_121(
  {
    label: '操作',
    width: '300',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
__VLS_123.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_123.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_124 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_125 = __VLS_asFunctionalComponent(
    __VLS_124,
    new __VLS_124({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_126 = __VLS_125(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_125),
  );
  let __VLS_128;
  let __VLS_129;
  let __VLS_130;
  const __VLS_131 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDesign(row);
    },
  };
  __VLS_127.slots.default;
  var __VLS_127;
  if (row.status === 'draft') {
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(
      __VLS_132,
      new __VLS_132({
        ...{ onClick: {} },
        link: true,
        type: 'success',
      }),
    );
    const __VLS_134 = __VLS_133(
      {
        ...{ onClick: {} },
        link: true,
        type: 'success',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_133),
    );
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
      onClick: (...[$event]) => {
        if (!(row.status === 'draft')) return;
        __VLS_ctx.handleDeploy(row);
      },
    };
    __VLS_135.slots.default;
    var __VLS_135;
  }
  if (row.status === 'active') {
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(
      __VLS_140,
      new __VLS_140({
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      }),
    );
    const __VLS_142 = __VLS_141(
      {
        ...{ onClick: {} },
        link: true,
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_141),
    );
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
      onClick: (...[$event]) => {
        if (!(row.status === 'active')) return;
        __VLS_ctx.handleSuspend(row);
      },
    };
    __VLS_143.slots.default;
    var __VLS_143;
  }
  if (row.status === 'suspended') {
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
        if (!(row.status === 'suspended')) return;
        __VLS_ctx.handleActivate(row);
      },
    };
    __VLS_151.slots.default;
    var __VLS_151;
  }
  const __VLS_156 = {}.ElDropdown;
  /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ // @ts-ignore
  const __VLS_157 = __VLS_asFunctionalComponent(
    __VLS_156,
    new __VLS_156({
      trigger: 'click',
    }),
  );
  const __VLS_158 = __VLS_157(
    {
      trigger: 'click',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_157),
  );
  __VLS_159.slots.default;
  const __VLS_160 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_161 = __VLS_asFunctionalComponent(
    __VLS_160,
    new __VLS_160({
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_162 = __VLS_161(
    {
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_161),
  );
  __VLS_163.slots.default;
  var __VLS_163;
  {
    const { dropdown: __VLS_thisSlot } = __VLS_159.slots;
    const __VLS_164 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
    const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    const __VLS_168 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(
      __VLS_168,
      new __VLS_168({
        ...{ onClick: {} },
      }),
    );
    const __VLS_170 = __VLS_169(
      {
        ...{ onClick: {} },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_169),
    );
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
      onClick: (...[$event]) => {
        __VLS_ctx.handleEdit(row);
      },
    };
    __VLS_171.slots.default;
    var __VLS_171;
    const __VLS_176 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(
      __VLS_176,
      new __VLS_176({
        ...{ onClick: {} },
      }),
    );
    const __VLS_178 = __VLS_177(
      {
        ...{ onClick: {} },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_177),
    );
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
      onClick: (...[$event]) => {
        __VLS_ctx.handleCopy(row);
      },
    };
    __VLS_179.slots.default;
    var __VLS_179;
    const __VLS_184 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(
      __VLS_184,
      new __VLS_184({
        ...{ onClick: {} },
      }),
    );
    const __VLS_186 = __VLS_185(
      {
        ...{ onClick: {} },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_185),
    );
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
      onClick: (...[$event]) => {
        __VLS_ctx.handleExport(row);
      },
    };
    __VLS_187.slots.default;
    var __VLS_187;
    const __VLS_192 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(
      __VLS_192,
      new __VLS_192({
        ...{ onClick: {} },
        divided: true,
        type: 'danger',
      }),
    );
    const __VLS_194 = __VLS_193(
      {
        ...{ onClick: {} },
        divided: true,
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_193),
    );
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
      onClick: (...[$event]) => {
        __VLS_ctx.handleDelete(row);
      },
    };
    __VLS_195.slots.default;
    var __VLS_195;
    var __VLS_167;
  }
  var __VLS_159;
}
var __VLS_123;
var __VLS_79;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_200 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(
  __VLS_200,
  new __VLS_200({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_202 = __VLS_201(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_201),
);
let __VLS_204;
let __VLS_205;
let __VLS_206;
const __VLS_207 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_208 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_203;
var __VLS_59;
const __VLS_209 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(
  __VLS_209,
  new __VLS_209({
    modelValue: __VLS_ctx.formDialogVisible,
    title: __VLS_ctx.isEdit ? '编辑流程' : '新建流程',
    width: '500px',
  }),
);
const __VLS_211 = __VLS_210(
  {
    modelValue: __VLS_ctx.formDialogVisible,
    title: __VLS_ctx.isEdit ? '编辑流程' : '新建流程',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_210),
);
__VLS_212.slots.default;
const __VLS_213 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(
  __VLS_213,
  new __VLS_213({
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    labelWidth: '100px',
  }),
);
const __VLS_215 = __VLS_214(
  {
    ref: 'formRef',
    model: __VLS_ctx.formData,
    rules: __VLS_ctx.formRules,
    labelWidth: '100px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_214),
);
/** @type {typeof __VLS_ctx.formRef} */ var __VLS_217 = {};
__VLS_216.slots.default;
const __VLS_219 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(
  __VLS_219,
  new __VLS_219({
    label: '流程名称',
    prop: 'name',
  }),
);
const __VLS_221 = __VLS_220(
  {
    label: '流程名称',
    prop: 'name',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_220),
);
__VLS_222.slots.default;
const __VLS_223 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(
  __VLS_223,
  new __VLS_223({
    modelValue: __VLS_ctx.formData.name,
    placeholder: '请输入流程名称',
  }),
);
const __VLS_225 = __VLS_224(
  {
    modelValue: __VLS_ctx.formData.name,
    placeholder: '请输入流程名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_224),
);
var __VLS_222;
const __VLS_227 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(
  __VLS_227,
  new __VLS_227({
    label: '流程标识',
    prop: 'key',
  }),
);
const __VLS_229 = __VLS_228(
  {
    label: '流程标识',
    prop: 'key',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_228),
);
__VLS_230.slots.default;
const __VLS_231 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(
  __VLS_231,
  new __VLS_231({
    modelValue: __VLS_ctx.formData.key,
    placeholder: '请输入流程标识',
    disabled: __VLS_ctx.isEdit,
  }),
);
const __VLS_233 = __VLS_232(
  {
    modelValue: __VLS_ctx.formData.key,
    placeholder: '请输入流程标识',
    disabled: __VLS_ctx.isEdit,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_232),
);
var __VLS_230;
const __VLS_235 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(
  __VLS_235,
  new __VLS_235({
    label: '分类',
    prop: 'category',
  }),
);
const __VLS_237 = __VLS_236(
  {
    label: '分类',
    prop: 'category',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_236),
);
__VLS_238.slots.default;
const __VLS_239 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(
  __VLS_239,
  new __VLS_239({
    modelValue: __VLS_ctx.formData.category,
    placeholder: '请选择分类',
    clearable: true,
  }),
);
const __VLS_241 = __VLS_240(
  {
    modelValue: __VLS_ctx.formData.category,
    placeholder: '请选择分类',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_240),
);
__VLS_242.slots.default;
const __VLS_243 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(
  __VLS_243,
  new __VLS_243({
    label: 'OA',
    value: 'OA',
  }),
);
const __VLS_245 = __VLS_244(
  {
    label: 'OA',
    value: 'OA',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_244),
);
const __VLS_247 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent(
  __VLS_247,
  new __VLS_247({
    label: '财务',
    value: '财务',
  }),
);
const __VLS_249 = __VLS_248(
  {
    label: '财务',
    value: '财务',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_248),
);
const __VLS_251 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(
  __VLS_251,
  new __VLS_251({
    label: '采购',
    value: '采购',
  }),
);
const __VLS_253 = __VLS_252(
  {
    label: '采购',
    value: '采购',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_252),
);
const __VLS_255 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(
  __VLS_255,
  new __VLS_255({
    label: '法务',
    value: '法务',
  }),
);
const __VLS_257 = __VLS_256(
  {
    label: '法务',
    value: '法务',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_256),
);
const __VLS_259 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(
  __VLS_259,
  new __VLS_259({
    label: 'HR',
    value: 'HR',
  }),
);
const __VLS_261 = __VLS_260(
  {
    label: 'HR',
    value: 'HR',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_260),
);
var __VLS_242;
var __VLS_238;
const __VLS_263 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(
  __VLS_263,
  new __VLS_263({
    label: '描述',
    prop: 'description',
  }),
);
const __VLS_265 = __VLS_264(
  {
    label: '描述',
    prop: 'description',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_264),
);
__VLS_266.slots.default;
const __VLS_267 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent(
  __VLS_267,
  new __VLS_267({
    modelValue: __VLS_ctx.formData.description,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入描述',
  }),
);
const __VLS_269 = __VLS_268(
  {
    modelValue: __VLS_ctx.formData.description,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入描述',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_268),
);
var __VLS_266;
var __VLS_216;
{
  const { footer: __VLS_thisSlot } = __VLS_212.slots;
  const __VLS_271 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_272 = __VLS_asFunctionalComponent(
    __VLS_271,
    new __VLS_271({
      ...{ onClick: {} },
    }),
  );
  const __VLS_273 = __VLS_272(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_272),
  );
  let __VLS_275;
  let __VLS_276;
  let __VLS_277;
  const __VLS_278 = {
    onClick: (...[$event]) => {
      __VLS_ctx.formDialogVisible = false;
    },
  };
  __VLS_274.slots.default;
  var __VLS_274;
  const __VLS_279 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_280 = __VLS_asFunctionalComponent(
    __VLS_279,
    new __VLS_279({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_281 = __VLS_280(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_280),
  );
  let __VLS_283;
  let __VLS_284;
  let __VLS_285;
  const __VLS_286 = {
    onClick: __VLS_ctx.handleFormSubmit,
  };
  __VLS_282.slots.default;
  var __VLS_282;
}
var __VLS_212;
/** @type {__VLS_StyleScopedClasses['process-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ // @ts-ignore
var __VLS_218 = __VLS_217;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Plus: Plus,
      loading: loading,
      processList: processList,
      total: total,
      formDialogVisible: formDialogVisible,
      isEdit: isEdit,
      formRef: formRef,
      formData: formData,
      queryParams: queryParams,
      formRules: formRules,
      getStatusType: getStatusType,
      getStatusLabel: getStatusLabel,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleAdd: handleAdd,
      handleEdit: handleEdit,
      handleDesign: handleDesign,
      handleDeploy: handleDeploy,
      handleSuspend: handleSuspend,
      handleActivate: handleActivate,
      handleCopy: handleCopy,
      handleExport: handleExport,
      handleDelete: handleDelete,
      handleFormSubmit: handleFormSubmit,
      handleSelectionChange: handleSelectionChange,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ProcessList.vue.js.map
