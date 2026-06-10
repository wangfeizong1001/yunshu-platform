/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { Search, Refresh, Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getMockDoneTaskPage } from '@/mock/workflow.mock';
const loading = ref(false);
const taskList = ref([]);
const total = ref(0);
const queryParams = reactive({
  name: '',
  processName: '',
  action: '',
  dateRange: [],
  pageNum: 1,
  pageSize: 10,
});
const viewDrawerVisible = ref(false);
const currentTask = ref(null);
const taskHistory = ref([
  {
    user: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    time: '2024-06-01 09:00:00',
  },
  {
    user: '管理员',
    action: 'approve',
    actionText: '审批通过',
    comment: '同意',
    time: '2024-06-01 10:30:00',
  },
]);
async function fetchTaskList() {
  loading.value = true;
  try {
    const res = getMockDoneTaskPage(queryParams);
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
  queryParams.action = '';
  queryParams.dateRange = [];
  queryParams.pageNum = 1;
  handleQuery();
}
function refreshTable() {
  fetchTaskList();
}
function handleView(row) {
  currentTask.value = row;
  viewDrawerVisible.value = true;
}
function handleRecall(row) {
  ElMessage.info(`撤回任务: ${row.name}`);
}
function handleExport() {
  ElMessage.info('正在导出已办任务数据...');
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
  ...{ class: 'done-list' },
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
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    label: '操作结果',
    prop: 'action',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '操作结果',
    prop: 'action',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_27.slots.default;
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    modelValue: __VLS_ctx.queryParams.action,
    placeholder: '请选择',
    clearable: true,
  }),
);
const __VLS_30 = __VLS_29(
  {
    modelValue: __VLS_ctx.queryParams.action,
    placeholder: '请选择',
    clearable: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
__VLS_31.slots.default;
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '全部',
    value: '',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '全部',
    value: '',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    label: '已通过',
    value: 'approve',
  }),
);
const __VLS_38 = __VLS_37(
  {
    label: '已通过',
    value: 'approve',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    label: '已驳回',
    value: 'reject',
  }),
);
const __VLS_42 = __VLS_41(
  {
    label: '已驳回',
    value: 'reject',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    label: '已转办',
    value: 'delegate',
  }),
);
const __VLS_46 = __VLS_45(
  {
    label: '已转办',
    value: 'delegate',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    label: '已委托',
    value: 'assign',
  }),
);
const __VLS_50 = __VLS_49(
  {
    label: '已委托',
    value: 'assign',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
var __VLS_31;
var __VLS_27;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(
  __VLS_52,
  new __VLS_52({
    label: '完成时间',
  }),
);
const __VLS_54 = __VLS_53(
  {
    label: '完成时间',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_53),
);
__VLS_55.slots.default;
const __VLS_56 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    modelValue: __VLS_ctx.queryParams.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
  }),
);
const __VLS_58 = __VLS_57(
  {
    modelValue: __VLS_ctx.queryParams.dateRange,
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
var __VLS_55;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_66 = __VLS_65(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_74 = __VLS_73(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_75.slots.default;
var __VLS_75;
var __VLS_63;
var __VLS_7;
var __VLS_3;
const __VLS_80 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(
  __VLS_80,
  new __VLS_80({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_82 = __VLS_81(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_81),
);
__VLS_83.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_83.slots;
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
  const __VLS_84 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_85 = __VLS_asFunctionalComponent(
    __VLS_84,
    new __VLS_84({
      type: 'info',
      ...{ class: 'count-tag' },
    }),
  );
  const __VLS_86 = __VLS_85(
    {
      type: 'info',
      ...{ class: 'count-tag' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_85),
  );
  __VLS_87.slots.default;
  __VLS_ctx.total;
  var __VLS_87;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_88 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_89 = __VLS_asFunctionalComponent(
    __VLS_88,
    new __VLS_88({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_90 = __VLS_89(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_89),
  );
  let __VLS_92;
  let __VLS_93;
  let __VLS_94;
  const __VLS_95 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_91;
  const __VLS_96 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_97 = __VLS_asFunctionalComponent(
    __VLS_96,
    new __VLS_96({
      ...{ onClick: {} },
      icon: __VLS_ctx.Download,
    }),
  );
  const __VLS_98 = __VLS_97(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Download,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_97),
  );
  let __VLS_100;
  let __VLS_101;
  let __VLS_102;
  const __VLS_103 = {
    onClick: __VLS_ctx.handleExport,
  };
  __VLS_99.slots.default;
  var __VLS_99;
}
const __VLS_104 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    data: __VLS_ctx.taskList,
    stripe: true,
    border: true,
  }),
);
const __VLS_106 = __VLS_105(
  {
    data: __VLS_ctx.taskList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_107.slots.default;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    prop: 'name',
    label: '任务名称',
    minWidth: '150',
  }),
);
const __VLS_110 = __VLS_109(
  {
    prop: 'name',
    label: '任务名称',
    minWidth: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  }),
);
const __VLS_114 = __VLS_113(
  {
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  }),
);
const __VLS_118 = __VLS_117(
  {
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'startTime',
    label: '接收时间',
    width: '180',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'startTime',
    label: '接收时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'endTime',
    label: '完成时间',
    width: '180',
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'endTime',
    label: '完成时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'action',
    label: '操作结果',
    width: '100',
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'action',
    label: '操作结果',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
__VLS_131.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_131.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.action === 'approve') {
    const __VLS_132 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(
      __VLS_132,
      new __VLS_132({
        type: 'success',
        size: 'small',
      }),
    );
    const __VLS_134 = __VLS_133(
      {
        type: 'success',
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_133),
    );
    __VLS_135.slots.default;
    var __VLS_135;
  } else if (row.action === 'reject') {
    const __VLS_136 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(
      __VLS_136,
      new __VLS_136({
        type: 'danger',
        size: 'small',
      }),
    );
    const __VLS_138 = __VLS_137(
      {
        type: 'danger',
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_137),
    );
    __VLS_139.slots.default;
    var __VLS_139;
  } else if (row.action === 'delegate') {
    const __VLS_140 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(
      __VLS_140,
      new __VLS_140({
        type: 'warning',
        size: 'small',
      }),
    );
    const __VLS_142 = __VLS_141(
      {
        type: 'warning',
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_141),
    );
    __VLS_143.slots.default;
    var __VLS_143;
  } else if (row.action === 'assign') {
    const __VLS_144 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(
      __VLS_144,
      new __VLS_144({
        type: 'info',
        size: 'small',
      }),
    );
    const __VLS_146 = __VLS_145(
      {
        type: 'info',
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_145),
    );
    __VLS_147.slots.default;
    var __VLS_147;
  } else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  }
}
var __VLS_131;
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(
  __VLS_148,
  new __VLS_148({
    prop: 'duration',
    label: '处理时长',
    width: '100',
  }),
);
const __VLS_150 = __VLS_149(
  {
    prop: 'duration',
    label: '处理时长',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_149),
);
__VLS_151.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_151.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  row.duration || '-';
}
var __VLS_151;
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    label: '操作',
    width: '120',
    fixed: 'right',
  }),
);
const __VLS_154 = __VLS_153(
  {
    label: '操作',
    width: '120',
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
      link: true,
    }),
  );
  const __VLS_158 = __VLS_157(
    {
      ...{ onClick: {} },
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_157),
  );
  let __VLS_160;
  let __VLS_161;
  let __VLS_162;
  const __VLS_163 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleView(row);
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
      link: true,
    }),
  );
  const __VLS_166 = __VLS_165(
    {
      ...{ onClick: {} },
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_165),
  );
  let __VLS_168;
  let __VLS_169;
  let __VLS_170;
  const __VLS_171 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleRecall(row);
    },
  };
  __VLS_167.slots.default;
  var __VLS_167;
}
var __VLS_155;
var __VLS_107;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_172 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(
  __VLS_172,
  new __VLS_172({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_174 = __VLS_173(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_173),
);
let __VLS_176;
let __VLS_177;
let __VLS_178;
const __VLS_179 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_180 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_175;
var __VLS_83;
const __VLS_181 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ // @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(
  __VLS_181,
  new __VLS_181({
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '任务详情',
    size: '50%',
  }),
);
const __VLS_183 = __VLS_182(
  {
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '任务详情',
    size: '50%',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_182),
);
__VLS_184.slots.default;
if (__VLS_ctx.currentTask) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'task-detail' },
  });
  const __VLS_185 = {}.ElDescriptions;
  /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ // @ts-ignore
  const __VLS_186 = __VLS_asFunctionalComponent(
    __VLS_185,
    new __VLS_185({
      column: 2,
      border: true,
    }),
  );
  const __VLS_187 = __VLS_186(
    {
      column: 2,
      border: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_186),
  );
  __VLS_188.slots.default;
  const __VLS_189 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_190 = __VLS_asFunctionalComponent(
    __VLS_189,
    new __VLS_189({
      label: '任务名称',
    }),
  );
  const __VLS_191 = __VLS_190(
    {
      label: '任务名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_190),
  );
  __VLS_192.slots.default;
  __VLS_ctx.currentTask.name;
  var __VLS_192;
  const __VLS_193 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_194 = __VLS_asFunctionalComponent(
    __VLS_193,
    new __VLS_193({
      label: '流程名称',
    }),
  );
  const __VLS_195 = __VLS_194(
    {
      label: '流程名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_194),
  );
  __VLS_196.slots.default;
  __VLS_ctx.currentTask.processDefinitionName;
  var __VLS_196;
  const __VLS_197 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_198 = __VLS_asFunctionalComponent(
    __VLS_197,
    new __VLS_197({
      label: '业务编号',
    }),
  );
  const __VLS_199 = __VLS_198(
    {
      label: '业务编号',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_198),
  );
  __VLS_200.slots.default;
  __VLS_ctx.currentTask.businessKey;
  var __VLS_200;
  const __VLS_201 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_202 = __VLS_asFunctionalComponent(
    __VLS_201,
    new __VLS_201({
      label: '接收时间',
    }),
  );
  const __VLS_203 = __VLS_202(
    {
      label: '接收时间',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_202),
  );
  __VLS_204.slots.default;
  __VLS_ctx.currentTask.startTime;
  var __VLS_204;
  const __VLS_205 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_206 = __VLS_asFunctionalComponent(
    __VLS_205,
    new __VLS_205({
      label: '完成时间',
    }),
  );
  const __VLS_207 = __VLS_206(
    {
      label: '完成时间',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_206),
  );
  __VLS_208.slots.default;
  __VLS_ctx.currentTask.endTime;
  var __VLS_208;
  const __VLS_209 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_210 = __VLS_asFunctionalComponent(
    __VLS_209,
    new __VLS_209({
      label: '处理人',
    }),
  );
  const __VLS_211 = __VLS_210(
    {
      label: '处理人',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_210),
  );
  __VLS_212.slots.default;
  __VLS_ctx.currentTask.assignee || '-';
  var __VLS_212;
  const __VLS_213 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_214 = __VLS_asFunctionalComponent(
    __VLS_213,
    new __VLS_213({
      label: '任务描述',
      span: 2,
    }),
  );
  const __VLS_215 = __VLS_214(
    {
      label: '任务描述',
      span: 2,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_214),
  );
  __VLS_216.slots.default;
  __VLS_ctx.currentTask.description || '-';
  var __VLS_216;
  var __VLS_188;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'history-section' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
  const __VLS_217 = {}.ElTimeline;
  /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ // @ts-ignore
  const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({}));
  const __VLS_219 = __VLS_218({}, ...__VLS_functionalComponentArgsRest(__VLS_218));
  __VLS_220.slots.default;
  for (const [item, idx] of __VLS_getVForSourceType(__VLS_ctx.taskHistory)) {
    const __VLS_221 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(
      __VLS_221,
      new __VLS_221({
        key: idx,
        timestamp: item.time,
      }),
    );
    const __VLS_223 = __VLS_222(
      {
        key: idx,
        timestamp: item.time,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_222),
    );
    __VLS_224.slots.default;
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
    var __VLS_224;
  }
  var __VLS_220;
}
var __VLS_184;
/** @type {__VLS_StyleScopedClasses['done-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['title']} */ /** @type {__VLS_StyleScopedClasses['count-tag']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ /** @type {__VLS_StyleScopedClasses['task-detail']} */ /** @type {__VLS_StyleScopedClasses['history-section']} */ /** @type {__VLS_StyleScopedClasses['timeline-content']} */ /** @type {__VLS_StyleScopedClasses['timeline-user']} */ /** @type {__VLS_StyleScopedClasses['timeline-action']} */ /** @type {__VLS_StyleScopedClasses['timeline-comment']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Download: Download,
      loading: loading,
      taskList: taskList,
      total: total,
      queryParams: queryParams,
      viewDrawerVisible: viewDrawerVisible,
      currentTask: currentTask,
      taskHistory: taskHistory,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleView: handleView,
      handleRecall: handleRecall,
      handleExport: handleExport,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DoneList.vue.js.map
