/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Download } from '@element-plus/icons-vue';
import { getMockTodoTaskPage } from '@/mock/workflow.mock';
const loading = ref(false);
const taskList = ref([]);
const total = ref(0);
const selectedTasks = ref([]);
const queryParams = reactive({
  name: '',
  processName: '',
  pageNum: 1,
  pageSize: 10,
});
const approveDialogVisible = ref(false);
const delegateDialogVisible = ref(false);
const assignDialogVisible = ref(false);
const addSignDialogVisible = ref(false);
const batchTransferDialogVisible = ref(false);
const viewDrawerVisible = ref(false);
const currentTask = ref(null);
const approveForm = reactive({
  comment: '',
});
const delegateForm = reactive({
  userId: '',
  comment: '',
});
const assignForm = reactive({
  userId: '',
  comment: '',
});
const addSignForm = reactive({
  type: 'after',
  userId: '',
  comment: '',
});
const batchTransferForm = reactive({
  userId: '',
  reason: '',
});
const taskHistory = ref([
  {
    user: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    time: '2024-06-01 09:00:00',
  },
]);
async function fetchTaskList() {
  loading.value = true;
  try {
    const res = getMockTodoTaskPage(queryParams);
    taskList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
function handleQuery() {
  queryParams.pageNum = 1;
  fetchTaskList();
}
function resetQuery() {
  queryParams.name = '';
  queryParams.processName = '';
  queryParams.pageNum = 1;
  handleQuery();
}
function refreshTable() {
  fetchTaskList();
}
function handleApprove(row) {
  currentTask.value = row;
  approveForm.comment = '';
  approveDialogVisible.value = true;
}
function handleDelegate(row) {
  currentTask.value = row;
  delegateForm.userId = '';
  delegateForm.comment = '';
  delegateDialogVisible.value = true;
}
function handleAssign(row) {
  currentTask.value = row;
  assignForm.userId = '';
  assignForm.comment = '';
  assignDialogVisible.value = true;
}
function handleView(row) {
  currentTask.value = row;
  viewDrawerVisible.value = true;
}
function handleApproveSubmit() {
  ElMessage.success('审批通过');
  approveDialogVisible.value = false;
  refreshTable();
}
function handleRejectSubmit() {
  ElMessage.success('已驳回');
  approveDialogVisible.value = false;
  refreshTable();
}
function handleDelegateSubmit() {
  if (!delegateForm.userId) {
    ElMessage.warning('请选择转办对象');
    return;
  }
  ElMessage.success('转办成功');
  delegateDialogVisible.value = false;
  refreshTable();
}
function handleAssignSubmit() {
  if (!assignForm.userId) {
    ElMessage.warning('请选择委托对象');
    return;
  }
  ElMessage.success('委托成功');
  assignDialogVisible.value = false;
  refreshTable();
}
function handleAddSign(row) {
  currentTask.value = row;
  addSignForm.type = 'after';
  addSignForm.userId = '';
  addSignForm.comment = '';
  addSignDialogVisible.value = true;
}
function handleAddSignSubmit() {
  if (!addSignForm.userId) {
    ElMessage.warning('请选择加签人');
    return;
  }
  const typeText = addSignForm.type === 'before' ? '前加签' : '后加签';
  ElMessage.success(`${typeText}成功`);
  addSignDialogVisible.value = false;
  refreshTable();
}
function handleSelectionChange(selection) {
  selectedTasks.value = selection;
}
function handleBatchApprove() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务');
    return;
  }
  ElMessage.success(`已批量通过 ${selectedTasks.value.length} 项任务`);
  selectedTasks.value = [];
  refreshTable();
}
function handleBatchReject() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务');
    return;
  }
  ElMessage.success(`已批量驳回 ${selectedTasks.value.length} 项任务`);
  selectedTasks.value = [];
  refreshTable();
}
function handleBatchTransfer() {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择任务');
    return;
  }
  batchTransferForm.userId = '';
  batchTransferForm.reason = '';
  batchTransferDialogVisible.value = true;
}
function handleBatchTransferSubmit() {
  if (!batchTransferForm.userId) {
    ElMessage.warning('请选择转办对象');
    return;
  }
  ElMessage.success(`已批量转办 ${selectedTasks.value.length} 项任务`);
  batchTransferDialogVisible.value = false;
  selectedTasks.value = [];
  refreshTable();
}
function handleExport() {
  ElMessage.info('正在导出任务数据...');
}
onMounted(() => {
  fetchTaskList();
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
  ...{ class: 'todo-list' },
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
    label: '任务名称',
    prop: 'name',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '任务名称',
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
    placeholder: '请输入任务名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.name,
    placeholder: '请输入任务名称',
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
    label: '流程名称',
    prop: 'processName',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '流程名称',
    prop: 'processName',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    modelValue: __VLS_ctx.queryParams.processName,
    placeholder: '请输入流程名称',
    clearable: true,
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.queryParams.processName,
    placeholder: '请输入流程名称',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
var __VLS_19;
const __VLS_24 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_30 = __VLS_29(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_38 = __VLS_37(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_39.slots.default;
var __VLS_39;
var __VLS_27;
var __VLS_7;
var __VLS_3;
const __VLS_44 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_46 = __VLS_45(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
__VLS_47.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_47.slots;
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
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'title' },
  });
  const __VLS_48 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_49 = __VLS_asFunctionalComponent(
    __VLS_48,
    new __VLS_48({
      type: 'danger',
      ...{ class: 'count-tag' },
    }),
  );
  const __VLS_50 = __VLS_49(
    {
      type: 'danger',
      ...{ class: 'count-tag' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_49),
  );
  __VLS_51.slots.default;
  __VLS_ctx.total;
  var __VLS_51;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_52 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_53 = __VLS_asFunctionalComponent(
    __VLS_52,
    new __VLS_52({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_54 = __VLS_53(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_53),
  );
  let __VLS_56;
  let __VLS_57;
  let __VLS_58;
  const __VLS_59 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_55;
  const __VLS_60 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_61 = __VLS_asFunctionalComponent(
    __VLS_60,
    new __VLS_60({
      ...{ onClick: {} },
      icon: __VLS_ctx.Download,
    }),
  );
  const __VLS_62 = __VLS_61(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Download,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_61),
  );
  let __VLS_64;
  let __VLS_65;
  let __VLS_66;
  const __VLS_67 = {
    onClick: __VLS_ctx.handleExport,
  };
  __VLS_63.slots.default;
  var __VLS_63;
}
if (__VLS_ctx.selectedTasks.length > 0) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'batch-actions' },
  });
  const __VLS_68 = {}.ElAlert;
  /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      type: 'info',
      closable: false,
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      type: 'info',
      closable: false,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  __VLS_71.slots.default;
  __VLS_ctx.selectedTasks.length;
  const __VLS_72 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_73 = __VLS_asFunctionalComponent(
    __VLS_72,
    new __VLS_72({
      ...{ onClick: {} },
      type: 'primary',
      link: true,
    }),
  );
  const __VLS_74 = __VLS_73(
    {
      ...{ onClick: {} },
      type: 'primary',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_73),
  );
  let __VLS_76;
  let __VLS_77;
  let __VLS_78;
  const __VLS_79 = {
    onClick: __VLS_ctx.handleBatchApprove,
  };
  __VLS_75.slots.default;
  var __VLS_75;
  const __VLS_80 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_81 = __VLS_asFunctionalComponent(
    __VLS_80,
    new __VLS_80({
      ...{ onClick: {} },
      type: 'danger',
      link: true,
    }),
  );
  const __VLS_82 = __VLS_81(
    {
      ...{ onClick: {} },
      type: 'danger',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_81),
  );
  let __VLS_84;
  let __VLS_85;
  let __VLS_86;
  const __VLS_87 = {
    onClick: __VLS_ctx.handleBatchReject,
  };
  __VLS_83.slots.default;
  var __VLS_83;
  const __VLS_88 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_89 = __VLS_asFunctionalComponent(
    __VLS_88,
    new __VLS_88({
      ...{ onClick: {} },
      type: 'warning',
      link: true,
    }),
  );
  const __VLS_90 = __VLS_89(
    {
      ...{ onClick: {} },
      type: 'warning',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_89),
  );
  let __VLS_92;
  let __VLS_93;
  let __VLS_94;
  const __VLS_95 = {
    onClick: __VLS_ctx.handleBatchTransfer,
  };
  __VLS_91.slots.default;
  var __VLS_91;
  const __VLS_96 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_97 = __VLS_asFunctionalComponent(
    __VLS_96,
    new __VLS_96({
      ...{ onClick: {} },
      link: true,
    }),
  );
  const __VLS_98 = __VLS_97(
    {
      ...{ onClick: {} },
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_97),
  );
  let __VLS_100;
  let __VLS_101;
  let __VLS_102;
  const __VLS_103 = {
    onClick: (...[$event]) => {
      if (!(__VLS_ctx.selectedTasks.length > 0)) return;
      __VLS_ctx.selectedTasks = [];
    },
  };
  __VLS_99.slots.default;
  var __VLS_99;
  var __VLS_71;
}
const __VLS_104 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.taskList,
    stripe: true,
    border: true,
  }),
);
const __VLS_106 = __VLS_105(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.taskList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
  onSelectionChange: __VLS_ctx.handleSelectionChange,
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_107.slots.default;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    type: 'selection',
    width: '55',
  }),
);
const __VLS_114 = __VLS_113(
  {
    type: 'selection',
    width: '55',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    prop: 'name',
    label: '任务名称',
    minWidth: '150',
  }),
);
const __VLS_118 = __VLS_117(
  {
    prop: 'name',
    label: '任务名称',
    minWidth: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'startTime',
    label: '接收时间',
    width: '180',
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'startTime',
    label: '接收时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    prop: 'assignee',
    label: '处理人',
    width: '120',
  }),
);
const __VLS_134 = __VLS_133(
  {
    prop: 'assignee',
    label: '处理人',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
__VLS_135.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_135.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  row.assignee || '-';
}
var __VLS_135;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(
  __VLS_136,
  new __VLS_136({
    prop: 'priority',
    label: '优先级',
    width: '100',
  }),
);
const __VLS_138 = __VLS_137(
  {
    prop: 'priority',
    label: '优先级',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_137),
);
__VLS_139.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_139.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.priority >= 80) {
    const __VLS_140 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(
      __VLS_140,
      new __VLS_140({
        type: 'danger',
      }),
    );
    const __VLS_142 = __VLS_141(
      {
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_141),
    );
    __VLS_143.slots.default;
    var __VLS_143;
  } else if (row.priority >= 50) {
    const __VLS_144 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(
      __VLS_144,
      new __VLS_144({
        type: 'warning',
      }),
    );
    const __VLS_146 = __VLS_145(
      {
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_145),
    );
    __VLS_147.slots.default;
    var __VLS_147;
  } else {
    const __VLS_148 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(
      __VLS_148,
      new __VLS_148({
        type: 'info',
      }),
    );
    const __VLS_150 = __VLS_149(
      {
        type: 'info',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_149),
    );
    __VLS_151.slots.default;
    var __VLS_151;
  }
}
var __VLS_139;
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    label: '操作',
    width: '360',
    fixed: 'right',
  }),
);
const __VLS_154 = __VLS_153(
  {
    label: '操作',
    width: '360',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_153),
);
__VLS_155.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_155.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_156 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_157 = __VLS_asFunctionalComponent(
    __VLS_156,
    new __VLS_156({
      ...{ onClick: {} },
      type: 'primary',
      link: true,
    }),
  );
  const __VLS_158 = __VLS_157(
    {
      ...{ onClick: {} },
      type: 'primary',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_157),
  );
  let __VLS_160;
  let __VLS_161;
  let __VLS_162;
  const __VLS_163 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleApprove(row);
    },
  };
  __VLS_159.slots.default;
  var __VLS_159;
  const __VLS_164 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_165 = __VLS_asFunctionalComponent(
    __VLS_164,
    new __VLS_164({
      ...{ onClick: {} },
      type: 'success',
      link: true,
    }),
  );
  const __VLS_166 = __VLS_165(
    {
      ...{ onClick: {} },
      type: 'success',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_165),
  );
  let __VLS_168;
  let __VLS_169;
  let __VLS_170;
  const __VLS_171 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleAddSign(row);
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
      type: 'warning',
      link: true,
    }),
  );
  const __VLS_174 = __VLS_173(
    {
      ...{ onClick: {} },
      type: 'warning',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_173),
  );
  let __VLS_176;
  let __VLS_177;
  let __VLS_178;
  const __VLS_179 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelegate(row);
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
      type: 'info',
      link: true,
    }),
  );
  const __VLS_182 = __VLS_181(
    {
      ...{ onClick: {} },
      type: 'info',
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_181),
  );
  let __VLS_184;
  let __VLS_185;
  let __VLS_186;
  const __VLS_187 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleAssign(row);
    },
  };
  __VLS_183.slots.default;
  var __VLS_183;
  const __VLS_188 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_189 = __VLS_asFunctionalComponent(
    __VLS_188,
    new __VLS_188({
      ...{ onClick: {} },
      link: true,
    }),
  );
  const __VLS_190 = __VLS_189(
    {
      ...{ onClick: {} },
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_189),
  );
  let __VLS_192;
  let __VLS_193;
  let __VLS_194;
  const __VLS_195 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleView(row);
    },
  };
  __VLS_191.slots.default;
  var __VLS_191;
}
var __VLS_155;
var __VLS_107;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_196 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(
  __VLS_196,
  new __VLS_196({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_198 = __VLS_197(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_197),
);
let __VLS_200;
let __VLS_201;
let __VLS_202;
const __VLS_203 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_204 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_199;
var __VLS_47;
const __VLS_205 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(
  __VLS_205,
  new __VLS_205({
    modelValue: __VLS_ctx.approveDialogVisible,
    title: '审批',
    width: '500px',
  }),
);
const __VLS_207 = __VLS_206(
  {
    modelValue: __VLS_ctx.approveDialogVisible,
    title: '审批',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_206),
);
__VLS_208.slots.default;
const __VLS_209 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(
  __VLS_209,
  new __VLS_209({
    model: __VLS_ctx.approveForm,
    labelWidth: '80px',
  }),
);
const __VLS_211 = __VLS_210(
  {
    model: __VLS_ctx.approveForm,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_210),
);
__VLS_212.slots.default;
const __VLS_213 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(
  __VLS_213,
  new __VLS_213({
    label: '审批意见',
  }),
);
const __VLS_215 = __VLS_214(
  {
    label: '审批意见',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_214),
);
__VLS_216.slots.default;
const __VLS_217 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(
  __VLS_217,
  new __VLS_217({
    modelValue: __VLS_ctx.approveForm.comment,
    type: 'textarea',
    rows: 4,
    placeholder: '请输入审批意见',
  }),
);
const __VLS_219 = __VLS_218(
  {
    modelValue: __VLS_ctx.approveForm.comment,
    type: 'textarea',
    rows: 4,
    placeholder: '请输入审批意见',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_218),
);
var __VLS_216;
var __VLS_212;
{
  const { footer: __VLS_thisSlot } = __VLS_208.slots;
  const __VLS_221 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_222 = __VLS_asFunctionalComponent(
    __VLS_221,
    new __VLS_221({
      ...{ onClick: {} },
    }),
  );
  const __VLS_223 = __VLS_222(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_222),
  );
  let __VLS_225;
  let __VLS_226;
  let __VLS_227;
  const __VLS_228 = {
    onClick: (...[$event]) => {
      __VLS_ctx.approveDialogVisible = false;
    },
  };
  __VLS_224.slots.default;
  var __VLS_224;
  const __VLS_229 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_230 = __VLS_asFunctionalComponent(
    __VLS_229,
    new __VLS_229({
      ...{ onClick: {} },
      type: 'danger',
    }),
  );
  const __VLS_231 = __VLS_230(
    {
      ...{ onClick: {} },
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_230),
  );
  let __VLS_233;
  let __VLS_234;
  let __VLS_235;
  const __VLS_236 = {
    onClick: __VLS_ctx.handleRejectSubmit,
  };
  __VLS_232.slots.default;
  var __VLS_232;
  const __VLS_237 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_238 = __VLS_asFunctionalComponent(
    __VLS_237,
    new __VLS_237({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_239 = __VLS_238(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_238),
  );
  let __VLS_241;
  let __VLS_242;
  let __VLS_243;
  const __VLS_244 = {
    onClick: __VLS_ctx.handleApproveSubmit,
  };
  __VLS_240.slots.default;
  var __VLS_240;
}
var __VLS_208;
const __VLS_245 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(
  __VLS_245,
  new __VLS_245({
    modelValue: __VLS_ctx.delegateDialogVisible,
    title: '转办',
    width: '500px',
  }),
);
const __VLS_247 = __VLS_246(
  {
    modelValue: __VLS_ctx.delegateDialogVisible,
    title: '转办',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_246),
);
__VLS_248.slots.default;
const __VLS_249 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent(
  __VLS_249,
  new __VLS_249({
    model: __VLS_ctx.delegateForm,
    labelWidth: '80px',
  }),
);
const __VLS_251 = __VLS_250(
  {
    model: __VLS_ctx.delegateForm,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_250),
);
__VLS_252.slots.default;
const __VLS_253 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent(
  __VLS_253,
  new __VLS_253({
    label: '转办给',
  }),
);
const __VLS_255 = __VLS_254(
  {
    label: '转办给',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_254),
);
__VLS_256.slots.default;
const __VLS_257 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent(
  __VLS_257,
  new __VLS_257({
    modelValue: __VLS_ctx.delegateForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  }),
);
const __VLS_259 = __VLS_258(
  {
    modelValue: __VLS_ctx.delegateForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_258),
);
__VLS_260.slots.default;
const __VLS_261 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(
  __VLS_261,
  new __VLS_261({
    label: '管理员',
    value: '1',
  }),
);
const __VLS_263 = __VLS_262(
  {
    label: '管理员',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_262),
);
const __VLS_265 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(
  __VLS_265,
  new __VLS_265({
    label: '张三',
    value: '2',
  }),
);
const __VLS_267 = __VLS_266(
  {
    label: '张三',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_266),
);
const __VLS_269 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_270 = __VLS_asFunctionalComponent(
  __VLS_269,
  new __VLS_269({
    label: '李四',
    value: '3',
  }),
);
const __VLS_271 = __VLS_270(
  {
    label: '李四',
    value: '3',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_270),
);
var __VLS_260;
var __VLS_256;
const __VLS_273 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent(
  __VLS_273,
  new __VLS_273({
    label: '备注',
  }),
);
const __VLS_275 = __VLS_274(
  {
    label: '备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_274),
);
__VLS_276.slots.default;
const __VLS_277 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_278 = __VLS_asFunctionalComponent(
  __VLS_277,
  new __VLS_277({
    modelValue: __VLS_ctx.delegateForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  }),
);
const __VLS_279 = __VLS_278(
  {
    modelValue: __VLS_ctx.delegateForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_278),
);
var __VLS_276;
var __VLS_252;
{
  const { footer: __VLS_thisSlot } = __VLS_248.slots;
  const __VLS_281 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_282 = __VLS_asFunctionalComponent(
    __VLS_281,
    new __VLS_281({
      ...{ onClick: {} },
    }),
  );
  const __VLS_283 = __VLS_282(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_282),
  );
  let __VLS_285;
  let __VLS_286;
  let __VLS_287;
  const __VLS_288 = {
    onClick: (...[$event]) => {
      __VLS_ctx.delegateDialogVisible = false;
    },
  };
  __VLS_284.slots.default;
  var __VLS_284;
  const __VLS_289 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_290 = __VLS_asFunctionalComponent(
    __VLS_289,
    new __VLS_289({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_291 = __VLS_290(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_290),
  );
  let __VLS_293;
  let __VLS_294;
  let __VLS_295;
  const __VLS_296 = {
    onClick: __VLS_ctx.handleDelegateSubmit,
  };
  __VLS_292.slots.default;
  var __VLS_292;
}
var __VLS_248;
const __VLS_297 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_298 = __VLS_asFunctionalComponent(
  __VLS_297,
  new __VLS_297({
    modelValue: __VLS_ctx.assignDialogVisible,
    title: '委托',
    width: '500px',
  }),
);
const __VLS_299 = __VLS_298(
  {
    modelValue: __VLS_ctx.assignDialogVisible,
    title: '委托',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_298),
);
__VLS_300.slots.default;
const __VLS_301 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent(
  __VLS_301,
  new __VLS_301({
    model: __VLS_ctx.assignForm,
    labelWidth: '80px',
  }),
);
const __VLS_303 = __VLS_302(
  {
    model: __VLS_ctx.assignForm,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_302),
);
__VLS_304.slots.default;
const __VLS_305 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent(
  __VLS_305,
  new __VLS_305({
    label: '委托给',
  }),
);
const __VLS_307 = __VLS_306(
  {
    label: '委托给',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_306),
);
__VLS_308.slots.default;
const __VLS_309 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent(
  __VLS_309,
  new __VLS_309({
    modelValue: __VLS_ctx.assignForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  }),
);
const __VLS_311 = __VLS_310(
  {
    modelValue: __VLS_ctx.assignForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_310),
);
__VLS_312.slots.default;
const __VLS_313 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent(
  __VLS_313,
  new __VLS_313({
    label: '管理员',
    value: '1',
  }),
);
const __VLS_315 = __VLS_314(
  {
    label: '管理员',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_314),
);
const __VLS_317 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent(
  __VLS_317,
  new __VLS_317({
    label: '张三',
    value: '2',
  }),
);
const __VLS_319 = __VLS_318(
  {
    label: '张三',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_318),
);
const __VLS_321 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent(
  __VLS_321,
  new __VLS_321({
    label: '李四',
    value: '3',
  }),
);
const __VLS_323 = __VLS_322(
  {
    label: '李四',
    value: '3',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_322),
);
var __VLS_312;
var __VLS_308;
const __VLS_325 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_326 = __VLS_asFunctionalComponent(
  __VLS_325,
  new __VLS_325({
    label: '备注',
  }),
);
const __VLS_327 = __VLS_326(
  {
    label: '备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_326),
);
__VLS_328.slots.default;
const __VLS_329 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_330 = __VLS_asFunctionalComponent(
  __VLS_329,
  new __VLS_329({
    modelValue: __VLS_ctx.assignForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  }),
);
const __VLS_331 = __VLS_330(
  {
    modelValue: __VLS_ctx.assignForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_330),
);
var __VLS_328;
var __VLS_304;
{
  const { footer: __VLS_thisSlot } = __VLS_300.slots;
  const __VLS_333 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_334 = __VLS_asFunctionalComponent(
    __VLS_333,
    new __VLS_333({
      ...{ onClick: {} },
    }),
  );
  const __VLS_335 = __VLS_334(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_334),
  );
  let __VLS_337;
  let __VLS_338;
  let __VLS_339;
  const __VLS_340 = {
    onClick: (...[$event]) => {
      __VLS_ctx.assignDialogVisible = false;
    },
  };
  __VLS_336.slots.default;
  var __VLS_336;
  const __VLS_341 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_342 = __VLS_asFunctionalComponent(
    __VLS_341,
    new __VLS_341({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_343 = __VLS_342(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_342),
  );
  let __VLS_345;
  let __VLS_346;
  let __VLS_347;
  const __VLS_348 = {
    onClick: __VLS_ctx.handleAssignSubmit,
  };
  __VLS_344.slots.default;
  var __VLS_344;
}
var __VLS_300;
const __VLS_349 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent(
  __VLS_349,
  new __VLS_349({
    modelValue: __VLS_ctx.addSignDialogVisible,
    title: '加签',
    width: '500px',
  }),
);
const __VLS_351 = __VLS_350(
  {
    modelValue: __VLS_ctx.addSignDialogVisible,
    title: '加签',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_350),
);
__VLS_352.slots.default;
const __VLS_353 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent(
  __VLS_353,
  new __VLS_353({
    model: __VLS_ctx.addSignForm,
    labelWidth: '80px',
  }),
);
const __VLS_355 = __VLS_354(
  {
    model: __VLS_ctx.addSignForm,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_354),
);
__VLS_356.slots.default;
const __VLS_357 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_358 = __VLS_asFunctionalComponent(
  __VLS_357,
  new __VLS_357({
    label: '加签类型',
  }),
);
const __VLS_359 = __VLS_358(
  {
    label: '加签类型',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_358),
);
__VLS_360.slots.default;
const __VLS_361 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ // @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent(
  __VLS_361,
  new __VLS_361({
    modelValue: __VLS_ctx.addSignForm.type,
  }),
);
const __VLS_363 = __VLS_362(
  {
    modelValue: __VLS_ctx.addSignForm.type,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_362),
);
__VLS_364.slots.default;
const __VLS_365 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent(
  __VLS_365,
  new __VLS_365({
    value: 'before',
  }),
);
const __VLS_367 = __VLS_366(
  {
    value: 'before',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_366),
);
__VLS_368.slots.default;
var __VLS_368;
const __VLS_369 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ // @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent(
  __VLS_369,
  new __VLS_369({
    value: 'after',
  }),
);
const __VLS_371 = __VLS_370(
  {
    value: 'after',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_370),
);
__VLS_372.slots.default;
var __VLS_372;
var __VLS_364;
var __VLS_360;
const __VLS_373 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_374 = __VLS_asFunctionalComponent(
  __VLS_373,
  new __VLS_373({
    label: '加签人',
  }),
);
const __VLS_375 = __VLS_374(
  {
    label: '加签人',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_374),
);
__VLS_376.slots.default;
const __VLS_377 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_378 = __VLS_asFunctionalComponent(
  __VLS_377,
  new __VLS_377({
    modelValue: __VLS_ctx.addSignForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  }),
);
const __VLS_379 = __VLS_378(
  {
    modelValue: __VLS_ctx.addSignForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_378),
);
__VLS_380.slots.default;
const __VLS_381 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_382 = __VLS_asFunctionalComponent(
  __VLS_381,
  new __VLS_381({
    label: '管理员',
    value: '1',
  }),
);
const __VLS_383 = __VLS_382(
  {
    label: '管理员',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_382),
);
const __VLS_385 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_386 = __VLS_asFunctionalComponent(
  __VLS_385,
  new __VLS_385({
    label: '张三',
    value: '2',
  }),
);
const __VLS_387 = __VLS_386(
  {
    label: '张三',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_386),
);
const __VLS_389 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_390 = __VLS_asFunctionalComponent(
  __VLS_389,
  new __VLS_389({
    label: '李四',
    value: '3',
  }),
);
const __VLS_391 = __VLS_390(
  {
    label: '李四',
    value: '3',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_390),
);
const __VLS_393 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_394 = __VLS_asFunctionalComponent(
  __VLS_393,
  new __VLS_393({
    label: '王五',
    value: '4',
  }),
);
const __VLS_395 = __VLS_394(
  {
    label: '王五',
    value: '4',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_394),
);
const __VLS_397 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_398 = __VLS_asFunctionalComponent(
  __VLS_397,
  new __VLS_397({
    label: '赵六',
    value: '5',
  }),
);
const __VLS_399 = __VLS_398(
  {
    label: '赵六',
    value: '5',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_398),
);
var __VLS_380;
var __VLS_376;
const __VLS_401 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_402 = __VLS_asFunctionalComponent(
  __VLS_401,
  new __VLS_401({
    label: '加签意见',
  }),
);
const __VLS_403 = __VLS_402(
  {
    label: '加签意见',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_402),
);
__VLS_404.slots.default;
const __VLS_405 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_406 = __VLS_asFunctionalComponent(
  __VLS_405,
  new __VLS_405({
    modelValue: __VLS_ctx.addSignForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入加签意见',
  }),
);
const __VLS_407 = __VLS_406(
  {
    modelValue: __VLS_ctx.addSignForm.comment,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入加签意见',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_406),
);
var __VLS_404;
var __VLS_356;
{
  const { footer: __VLS_thisSlot } = __VLS_352.slots;
  const __VLS_409 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_410 = __VLS_asFunctionalComponent(
    __VLS_409,
    new __VLS_409({
      ...{ onClick: {} },
    }),
  );
  const __VLS_411 = __VLS_410(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_410),
  );
  let __VLS_413;
  let __VLS_414;
  let __VLS_415;
  const __VLS_416 = {
    onClick: (...[$event]) => {
      __VLS_ctx.addSignDialogVisible = false;
    },
  };
  __VLS_412.slots.default;
  var __VLS_412;
  const __VLS_417 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_418 = __VLS_asFunctionalComponent(
    __VLS_417,
    new __VLS_417({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_419 = __VLS_418(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_418),
  );
  let __VLS_421;
  let __VLS_422;
  let __VLS_423;
  const __VLS_424 = {
    onClick: __VLS_ctx.handleAddSignSubmit,
  };
  __VLS_420.slots.default;
  var __VLS_420;
}
var __VLS_352;
const __VLS_425 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_426 = __VLS_asFunctionalComponent(
  __VLS_425,
  new __VLS_425({
    modelValue: __VLS_ctx.batchTransferDialogVisible,
    title: '批量转办',
    width: '500px',
  }),
);
const __VLS_427 = __VLS_426(
  {
    modelValue: __VLS_ctx.batchTransferDialogVisible,
    title: '批量转办',
    width: '500px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_426),
);
__VLS_428.slots.default;
const __VLS_429 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
const __VLS_430 = __VLS_asFunctionalComponent(
  __VLS_429,
  new __VLS_429({
    model: __VLS_ctx.batchTransferForm,
    labelWidth: '80px',
  }),
);
const __VLS_431 = __VLS_430(
  {
    model: __VLS_ctx.batchTransferForm,
    labelWidth: '80px',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_430),
);
__VLS_432.slots.default;
const __VLS_433 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_434 = __VLS_asFunctionalComponent(
  __VLS_433,
  new __VLS_433({
    label: '转办给',
  }),
);
const __VLS_435 = __VLS_434(
  {
    label: '转办给',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_434),
);
__VLS_436.slots.default;
const __VLS_437 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_438 = __VLS_asFunctionalComponent(
  __VLS_437,
  new __VLS_437({
    modelValue: __VLS_ctx.batchTransferForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  }),
);
const __VLS_439 = __VLS_438(
  {
    modelValue: __VLS_ctx.batchTransferForm.userId,
    placeholder: '请选择用户',
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_438),
);
__VLS_440.slots.default;
const __VLS_441 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_442 = __VLS_asFunctionalComponent(
  __VLS_441,
  new __VLS_441({
    label: '管理员',
    value: '1',
  }),
);
const __VLS_443 = __VLS_442(
  {
    label: '管理员',
    value: '1',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_442),
);
const __VLS_445 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_446 = __VLS_asFunctionalComponent(
  __VLS_445,
  new __VLS_445({
    label: '张三',
    value: '2',
  }),
);
const __VLS_447 = __VLS_446(
  {
    label: '张三',
    value: '2',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_446),
);
const __VLS_449 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_450 = __VLS_asFunctionalComponent(
  __VLS_449,
  new __VLS_449({
    label: '李四',
    value: '3',
  }),
);
const __VLS_451 = __VLS_450(
  {
    label: '李四',
    value: '3',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_450),
);
var __VLS_440;
var __VLS_436;
const __VLS_453 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_454 = __VLS_asFunctionalComponent(
  __VLS_453,
  new __VLS_453({
    label: '转办原因',
  }),
);
const __VLS_455 = __VLS_454(
  {
    label: '转办原因',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_454),
);
__VLS_456.slots.default;
const __VLS_457 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_458 = __VLS_asFunctionalComponent(
  __VLS_457,
  new __VLS_457({
    modelValue: __VLS_ctx.batchTransferForm.reason,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入转办原因',
  }),
);
const __VLS_459 = __VLS_458(
  {
    modelValue: __VLS_ctx.batchTransferForm.reason,
    type: 'textarea',
    rows: 3,
    placeholder: '请输入转办原因',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_458),
);
var __VLS_456;
var __VLS_432;
{
  const { footer: __VLS_thisSlot } = __VLS_428.slots;
  const __VLS_461 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_462 = __VLS_asFunctionalComponent(
    __VLS_461,
    new __VLS_461({
      ...{ onClick: {} },
    }),
  );
  const __VLS_463 = __VLS_462(
    {
      ...{ onClick: {} },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_462),
  );
  let __VLS_465;
  let __VLS_466;
  let __VLS_467;
  const __VLS_468 = {
    onClick: (...[$event]) => {
      __VLS_ctx.batchTransferDialogVisible = false;
    },
  };
  __VLS_464.slots.default;
  var __VLS_464;
  const __VLS_469 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_470 = __VLS_asFunctionalComponent(
    __VLS_469,
    new __VLS_469({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_471 = __VLS_470(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_470),
  );
  let __VLS_473;
  let __VLS_474;
  let __VLS_475;
  const __VLS_476 = {
    onClick: __VLS_ctx.handleBatchTransferSubmit,
  };
  __VLS_472.slots.default;
  var __VLS_472;
}
var __VLS_428;
const __VLS_477 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ // @ts-ignore
const __VLS_478 = __VLS_asFunctionalComponent(
  __VLS_477,
  new __VLS_477({
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '任务详情',
    size: '50%',
  }),
);
const __VLS_479 = __VLS_478(
  {
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '任务详情',
    size: '50%',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_478),
);
__VLS_480.slots.default;
if (__VLS_ctx.currentTask) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'task-detail' },
  });
  const __VLS_481 = {}.ElDescriptions;
  /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ // @ts-ignore
  const __VLS_482 = __VLS_asFunctionalComponent(
    __VLS_481,
    new __VLS_481({
      column: 2,
      border: true,
    }),
  );
  const __VLS_483 = __VLS_482(
    {
      column: 2,
      border: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_482),
  );
  __VLS_484.slots.default;
  const __VLS_485 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_486 = __VLS_asFunctionalComponent(
    __VLS_485,
    new __VLS_485({
      label: '任务名称',
    }),
  );
  const __VLS_487 = __VLS_486(
    {
      label: '任务名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_486),
  );
  __VLS_488.slots.default;
  __VLS_ctx.currentTask.name;
  var __VLS_488;
  const __VLS_489 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_490 = __VLS_asFunctionalComponent(
    __VLS_489,
    new __VLS_489({
      label: '流程名称',
    }),
  );
  const __VLS_491 = __VLS_490(
    {
      label: '流程名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_490),
  );
  __VLS_492.slots.default;
  __VLS_ctx.currentTask.processDefinitionName;
  var __VLS_492;
  const __VLS_493 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_494 = __VLS_asFunctionalComponent(
    __VLS_493,
    new __VLS_493({
      label: '业务编号',
    }),
  );
  const __VLS_495 = __VLS_494(
    {
      label: '业务编号',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_494),
  );
  __VLS_496.slots.default;
  __VLS_ctx.currentTask.businessKey;
  var __VLS_496;
  const __VLS_497 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_498 = __VLS_asFunctionalComponent(
    __VLS_497,
    new __VLS_497({
      label: '优先级',
    }),
  );
  const __VLS_499 = __VLS_498(
    {
      label: '优先级',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_498),
  );
  __VLS_500.slots.default;
  if (__VLS_ctx.currentTask.priority >= 80) {
    const __VLS_501 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_502 = __VLS_asFunctionalComponent(
      __VLS_501,
      new __VLS_501({
        type: 'danger',
      }),
    );
    const __VLS_503 = __VLS_502(
      {
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_502),
    );
    __VLS_504.slots.default;
    var __VLS_504;
  } else if (__VLS_ctx.currentTask.priority >= 50) {
    const __VLS_505 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_506 = __VLS_asFunctionalComponent(
      __VLS_505,
      new __VLS_505({
        type: 'warning',
      }),
    );
    const __VLS_507 = __VLS_506(
      {
        type: 'warning',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_506),
    );
    __VLS_508.slots.default;
    var __VLS_508;
  } else {
    const __VLS_509 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_510 = __VLS_asFunctionalComponent(
      __VLS_509,
      new __VLS_509({
        type: 'info',
      }),
    );
    const __VLS_511 = __VLS_510(
      {
        type: 'info',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_510),
    );
    __VLS_512.slots.default;
    var __VLS_512;
  }
  var __VLS_500;
  const __VLS_513 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_514 = __VLS_asFunctionalComponent(
    __VLS_513,
    new __VLS_513({
      label: '接收时间',
    }),
  );
  const __VLS_515 = __VLS_514(
    {
      label: '接收时间',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_514),
  );
  __VLS_516.slots.default;
  __VLS_ctx.currentTask.startTime;
  var __VLS_516;
  const __VLS_517 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_518 = __VLS_asFunctionalComponent(
    __VLS_517,
    new __VLS_517({
      label: '处理人',
    }),
  );
  const __VLS_519 = __VLS_518(
    {
      label: '处理人',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_518),
  );
  __VLS_520.slots.default;
  __VLS_ctx.currentTask.assignee || '-';
  var __VLS_520;
  const __VLS_521 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_522 = __VLS_asFunctionalComponent(
    __VLS_521,
    new __VLS_521({
      label: '任务描述',
      span: 2,
    }),
  );
  const __VLS_523 = __VLS_522(
    {
      label: '任务描述',
      span: 2,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_522),
  );
  __VLS_524.slots.default;
  __VLS_ctx.currentTask.description || '-';
  var __VLS_524;
  var __VLS_484;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'history-section' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
  const __VLS_525 = {}.ElTimeline;
  /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ // @ts-ignore
  const __VLS_526 = __VLS_asFunctionalComponent(__VLS_525, new __VLS_525({}));
  const __VLS_527 = __VLS_526({}, ...__VLS_functionalComponentArgsRest(__VLS_526));
  __VLS_528.slots.default;
  for (const [item, idx] of __VLS_getVForSourceType(__VLS_ctx.taskHistory)) {
    const __VLS_529 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ // @ts-ignore
    const __VLS_530 = __VLS_asFunctionalComponent(
      __VLS_529,
      new __VLS_529({
        key: idx,
        timestamp: item.time,
      }),
    );
    const __VLS_531 = __VLS_530(
      {
        key: idx,
        timestamp: item.time,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_530),
    );
    __VLS_532.slots.default;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'timeline-content' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'timeline-user' },
    });
    item.user;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'timeline-action' },
      ...{ class: item.action },
    });
    item.actionText;
    if (item.comment) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'timeline-comment' },
      });
      item.comment;
    }
    var __VLS_532;
  }
  var __VLS_528;
}
var __VLS_480;
/** @type {__VLS_StyleScopedClasses['todo-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['title']} */ /** @type {__VLS_StyleScopedClasses['count-tag']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['batch-actions']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ /** @type {__VLS_StyleScopedClasses['task-detail']} */ /** @type {__VLS_StyleScopedClasses['history-section']} */ /** @type {__VLS_StyleScopedClasses['timeline-content']} */ /** @type {__VLS_StyleScopedClasses['timeline-user']} */ /** @type {__VLS_StyleScopedClasses['timeline-action']} */ /** @type {__VLS_StyleScopedClasses['timeline-comment']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Download: Download,
      loading: loading,
      taskList: taskList,
      total: total,
      selectedTasks: selectedTasks,
      queryParams: queryParams,
      approveDialogVisible: approveDialogVisible,
      delegateDialogVisible: delegateDialogVisible,
      assignDialogVisible: assignDialogVisible,
      addSignDialogVisible: addSignDialogVisible,
      batchTransferDialogVisible: batchTransferDialogVisible,
      viewDrawerVisible: viewDrawerVisible,
      currentTask: currentTask,
      approveForm: approveForm,
      delegateForm: delegateForm,
      assignForm: assignForm,
      addSignForm: addSignForm,
      batchTransferForm: batchTransferForm,
      taskHistory: taskHistory,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleApprove: handleApprove,
      handleDelegate: handleDelegate,
      handleAssign: handleAssign,
      handleView: handleView,
      handleApproveSubmit: handleApproveSubmit,
      handleRejectSubmit: handleRejectSubmit,
      handleDelegateSubmit: handleDelegateSubmit,
      handleAssignSubmit: handleAssignSubmit,
      handleAddSign: handleAddSign,
      handleAddSignSubmit: handleAddSignSubmit,
      handleSelectionChange: handleSelectionChange,
      handleBatchApprove: handleBatchApprove,
      handleBatchReject: handleBatchReject,
      handleBatchTransfer: handleBatchTransfer,
      handleBatchTransferSubmit: handleBatchTransferSubmit,
      handleExport: handleExport,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TodoList.vue.js.map
