/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import { getMockProcessInstancePage } from '@/mock/workflow.mock';
const loading = ref(false);
const instanceList = ref([]);
const total = ref(0);
const queryParams = reactive({
  processName: '',
  businessKey: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
});
const viewDrawerVisible = ref(false);
const currentInstance = ref(null);
const instanceFlowNodes = ref([]);
const instanceVariables = ref([]);
const instanceHistory = ref([
  {
    taskName: '发起申请',
    assignee: '张三',
    action: 'start',
    actionText: '发起申请',
    comment: '申请年假3天，从6月1日到6月3日',
    duration: '0分钟',
    endTime: '2024-06-01 09:00:00',
  },
  {
    taskName: '部门经理审批',
    assignee: '李四',
    action: 'approve',
    actionText: '审批通过',
    comment: '同意申请',
    duration: '2小时30分钟',
    endTime: '2024-06-01 11:30:00',
  },
]);
async function fetchInstanceList() {
  loading.value = true;
  try {
    const res = getMockProcessInstancePage(queryParams);
    instanceList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
function handleQuery() {
  queryParams.pageNum = 1;
  fetchInstanceList();
}
function resetQuery() {
  queryParams.processName = '';
  queryParams.businessKey = '';
  queryParams.status = '';
  queryParams.pageNum = 1;
  handleQuery();
}
function refreshTable() {
  fetchInstanceList();
}
function handleView(row) {
  currentInstance.value = row;
  loadInstanceDetail(row);
  viewDrawerVisible.value = true;
}
function loadInstanceDetail(row) {
  // 模拟加载流程进度节点
  if (row.status === 'running') {
    instanceFlowNodes.value = [
      { id: '1', name: '开始', type: 'start', icon: '●', status: 'done' },
      { id: '2', name: '发起申请', type: 'task', icon: '▢', assignee: '张三', status: 'done' },
      {
        id: '3',
        name: '部门经理审批',
        type: 'task',
        icon: '▢',
        assignee: '李四',
        status: 'current',
      },
      { id: '4', name: '结束', type: 'end', icon: '◉', status: 'pending' },
    ];
  } else {
    instanceFlowNodes.value = [
      { id: '1', name: '开始', type: 'start', icon: '●', status: 'done' },
      { id: '2', name: '发起申请', type: 'task', icon: '▢', assignee: '张三', status: 'done' },
      { id: '3', name: '部门经理审批', type: 'task', icon: '▢', assignee: '李四', status: 'done' },
      { id: '4', name: '结束', type: 'end', icon: '◉', status: 'done' },
    ];
  }
  // 模拟加载流程变量
  instanceVariables.value = [
    { name: 'days', type: 'Integer', value: '3', updateTime: '2024-06-01 09:00:00' },
    { name: 'startDate', type: 'Date', value: '2024-06-01', updateTime: '2024-06-01 09:00:00' },
    { name: 'endDate', type: 'Date', value: '2024-06-03', updateTime: '2024-06-01 09:00:00' },
    { name: 'reason', type: 'String', value: '年假', updateTime: '2024-06-01 09:00:00' },
    { name: 'amount', type: 'Double', value: '0.0', updateTime: '2024-06-01 09:00:00' },
  ];
  // 模拟加载审批历史
  instanceHistory.value = [
    {
      taskName: '发起申请',
      assignee: '张三',
      action: 'start',
      actionText: '发起申请',
      comment: '申请年假3天，从6月1日到6月3日',
      duration: '0分钟',
      endTime: '2024-06-01 09:00:00',
    },
    {
      taskName: '部门经理审批',
      assignee: '李四',
      action: 'approve',
      actionText: '审批通过',
      comment: '同意申请',
      duration: '2小时30分钟',
      endTime: '2024-06-01 11:30:00',
    },
  ];
}
function getActionType(action) {
  const typeMap = {
    start: 'success',
    approve: 'primary',
    reject: 'danger',
    delegate: 'warning',
    addSign: 'info',
  };
  return typeMap[action] || 'info';
}
async function handleTerminate(_row) {
  try {
    await ElMessageBox.confirm('确定要终止该流程实例吗？', '提示', {
      type: 'warning',
    });
    ElMessage.success('终止成功');
    refreshTable();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('终止失败', error);
    }
  }
}
onMounted(() => {
  fetchInstanceList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['done']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['pending']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['start']} */ // CSS variable injection
// CSS variable injection end
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'process-instance' },
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
    prop: 'processName',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '流程名称',
    prop: 'processName',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    modelValue: __VLS_ctx.queryParams.processName,
    placeholder: '请输入流程名称',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.processName,
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
    label: '业务编号',
    prop: 'businessKey',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '业务编号',
    prop: 'businessKey',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    modelValue: __VLS_ctx.queryParams.businessKey,
    placeholder: '请输入业务编号',
    clearable: true,
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.queryParams.businessKey,
    placeholder: '请输入业务编号',
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
    label: '状态',
    prop: 'status',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '状态',
    prop: 'status',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_27.slots.default;
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
    clearable: true,
  }),
);
const __VLS_30 = __VLS_29(
  {
    modelValue: __VLS_ctx.queryParams.status,
    placeholder: '请选择状态',
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
    label: '运行中',
    value: 'running',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '运行中',
    value: 'running',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    label: '已完成',
    value: 'completed',
  }),
);
const __VLS_38 = __VLS_37(
  {
    label: '已完成',
    value: 'completed',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    label: '已终止',
    value: 'terminated',
  }),
);
const __VLS_42 = __VLS_41(
  {
    label: '已终止',
    value: 'terminated',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
var __VLS_31;
var __VLS_27;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  }),
);
const __VLS_50 = __VLS_49(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Search,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
  onClick: __VLS_ctx.handleQuery,
};
__VLS_51.slots.default;
var __VLS_51;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  }),
);
const __VLS_58 = __VLS_57(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
  onClick: __VLS_ctx.resetQuery,
};
__VLS_59.slots.default;
var __VLS_59;
var __VLS_47;
var __VLS_7;
var __VLS_3;
const __VLS_64 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    shadow: 'never',
    ...{ class: 'table-card' },
  }),
);
const __VLS_66 = __VLS_65(
  {
    shadow: 'never',
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
__VLS_67.slots.default;
{
  const { header: __VLS_thisSlot } = __VLS_67.slots;
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
  const __VLS_68 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      type: 'info',
      ...{ class: 'count-tag' },
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      type: 'info',
      ...{ class: 'count-tag' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  __VLS_71.slots.default;
  __VLS_ctx.total;
  var __VLS_71;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'right' },
  });
  const __VLS_72 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_73 = __VLS_asFunctionalComponent(
    __VLS_72,
    new __VLS_72({
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    }),
  );
  const __VLS_74 = __VLS_73(
    {
      ...{ onClick: {} },
      icon: __VLS_ctx.Refresh,
      circle: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_73),
  );
  let __VLS_76;
  let __VLS_77;
  let __VLS_78;
  const __VLS_79 = {
    onClick: __VLS_ctx.refreshTable,
  };
  var __VLS_75;
}
const __VLS_80 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(
  __VLS_80,
  new __VLS_80({
    data: __VLS_ctx.instanceList,
    stripe: true,
    border: true,
  }),
);
const __VLS_82 = __VLS_81(
  {
    data: __VLS_ctx.instanceList,
    stripe: true,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_81),
);
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.loading },
  null,
  null,
);
__VLS_83.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(
  __VLS_84,
  new __VLS_84({
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  }),
);
const __VLS_86 = __VLS_85(
  {
    prop: 'processDefinitionName',
    label: '流程名称',
    width: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_85),
);
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(
  __VLS_88,
  new __VLS_88({
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  }),
);
const __VLS_90 = __VLS_89(
  {
    prop: 'businessKey',
    label: '业务编号',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_89),
);
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(
  __VLS_92,
  new __VLS_92({
    prop: 'startUserId',
    label: '发起人',
    width: '120',
  }),
);
const __VLS_94 = __VLS_93(
  {
    prop: 'startUserId',
    label: '发起人',
    width: '120',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_93),
);
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(
  __VLS_96,
  new __VLS_96({
    prop: 'startTime',
    label: '开始时间',
    width: '180',
  }),
);
const __VLS_98 = __VLS_97(
  {
    prop: 'startTime',
    label: '开始时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    prop: 'endTime',
    label: '结束时间',
    width: '180',
  }),
);
const __VLS_102 = __VLS_101(
  {
    prop: 'endTime',
    label: '结束时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
__VLS_103.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_103.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  row.endTime || '-';
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'status',
    label: '状态',
    width: '100',
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'status',
    label: '状态',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
__VLS_107.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_107.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.status === 'running') {
    const __VLS_108 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(
      __VLS_108,
      new __VLS_108({
        type: 'primary',
      }),
    );
    const __VLS_110 = __VLS_109(
      {
        type: 'primary',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_109),
    );
    __VLS_111.slots.default;
    var __VLS_111;
  } else if (row.status === 'completed') {
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(
      __VLS_112,
      new __VLS_112({
        type: 'success',
      }),
    );
    const __VLS_114 = __VLS_113(
      {
        type: 'success',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_113),
    );
    __VLS_115.slots.default;
    var __VLS_115;
  } else if (row.status === 'terminated') {
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(
      __VLS_116,
      new __VLS_116({
        type: 'danger',
      }),
    );
    const __VLS_118 = __VLS_117(
      {
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_117),
    );
    __VLS_119.slots.default;
    var __VLS_119;
  }
}
var __VLS_107;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(
  __VLS_120,
  new __VLS_120({
    prop: 'currentTaskNames',
    label: '当前节点',
    minWidth: '150',
  }),
);
const __VLS_122 = __VLS_121(
  {
    prop: 'currentTaskNames',
    label: '当前节点',
    minWidth: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_121),
);
__VLS_123.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_123.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  if (row.currentTaskNames && row.currentTaskNames.length > 0) {
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(
      __VLS_124,
      new __VLS_124({
        type: 'info',
        size: 'small',
      }),
    );
    const __VLS_126 = __VLS_125(
      {
        type: 'info',
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_125),
    );
    __VLS_127.slots.default;
    row.currentTaskNames[0];
    var __VLS_127;
  } else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  }
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    label: '操作',
    width: '200',
    fixed: 'right',
  }),
);
const __VLS_130 = __VLS_129(
  {
    label: '操作',
    width: '200',
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
    }),
  );
  const __VLS_134 = __VLS_133(
    {
      ...{ onClick: {} },
      link: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_133),
  );
  let __VLS_136;
  let __VLS_137;
  let __VLS_138;
  const __VLS_139 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleView(row);
    },
  };
  __VLS_135.slots.default;
  var __VLS_135;
  if (row.status === 'running') {
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(
      __VLS_140,
      new __VLS_140({
        ...{ onClick: {} },
        link: true,
        type: 'danger',
      }),
    );
    const __VLS_142 = __VLS_141(
      {
        ...{ onClick: {} },
        link: true,
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_141),
    );
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
      onClick: (...[$event]) => {
        if (!(row.status === 'running')) return;
        __VLS_ctx.handleTerminate(row);
      },
    };
    __VLS_143.slots.default;
    var __VLS_143;
  }
}
var __VLS_131;
var __VLS_83;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_148 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(
  __VLS_148,
  new __VLS_148({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_150 = __VLS_149(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_149),
);
let __VLS_152;
let __VLS_153;
let __VLS_154;
const __VLS_155 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_156 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_151;
var __VLS_67;
const __VLS_157 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ // @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(
  __VLS_157,
  new __VLS_157({
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '流程实例详情',
    size: '60%',
  }),
);
const __VLS_159 = __VLS_158(
  {
    modelValue: __VLS_ctx.viewDrawerVisible,
    title: '流程实例详情',
    size: '60%',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_158),
);
__VLS_160.slots.default;
if (__VLS_ctx.currentInstance) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'instance-detail' },
  });
  const __VLS_161 = {}.ElDescriptions;
  /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ // @ts-ignore
  const __VLS_162 = __VLS_asFunctionalComponent(
    __VLS_161,
    new __VLS_161({
      column: 2,
      border: true,
    }),
  );
  const __VLS_163 = __VLS_162(
    {
      column: 2,
      border: true,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_162),
  );
  __VLS_164.slots.default;
  const __VLS_165 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_166 = __VLS_asFunctionalComponent(
    __VLS_165,
    new __VLS_165({
      label: '流程名称',
    }),
  );
  const __VLS_167 = __VLS_166(
    {
      label: '流程名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_166),
  );
  __VLS_168.slots.default;
  __VLS_ctx.currentInstance.processDefinitionName;
  var __VLS_168;
  const __VLS_169 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_170 = __VLS_asFunctionalComponent(
    __VLS_169,
    new __VLS_169({
      label: '业务编号',
    }),
  );
  const __VLS_171 = __VLS_170(
    {
      label: '业务编号',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_170),
  );
  __VLS_172.slots.default;
  __VLS_ctx.currentInstance.businessKey;
  var __VLS_172;
  const __VLS_173 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_174 = __VLS_asFunctionalComponent(
    __VLS_173,
    new __VLS_173({
      label: '发起人',
    }),
  );
  const __VLS_175 = __VLS_174(
    {
      label: '发起人',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_174),
  );
  __VLS_176.slots.default;
  __VLS_ctx.currentInstance.startUserId;
  var __VLS_176;
  const __VLS_177 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_178 = __VLS_asFunctionalComponent(
    __VLS_177,
    new __VLS_177({
      label: '开始时间',
    }),
  );
  const __VLS_179 = __VLS_178(
    {
      label: '开始时间',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_178),
  );
  __VLS_180.slots.default;
  __VLS_ctx.currentInstance.startTime;
  var __VLS_180;
  const __VLS_181 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_182 = __VLS_asFunctionalComponent(
    __VLS_181,
    new __VLS_181({
      label: '结束时间',
    }),
  );
  const __VLS_183 = __VLS_182(
    {
      label: '结束时间',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_182),
  );
  __VLS_184.slots.default;
  __VLS_ctx.currentInstance.endTime || '-';
  var __VLS_184;
  const __VLS_185 = {}.ElDescriptionsItem;
  /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
  const __VLS_186 = __VLS_asFunctionalComponent(
    __VLS_185,
    new __VLS_185({
      label: '状态',
    }),
  );
  const __VLS_187 = __VLS_186(
    {
      label: '状态',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_186),
  );
  __VLS_188.slots.default;
  if (__VLS_ctx.currentInstance.status === 'running') {
    const __VLS_189 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(
      __VLS_189,
      new __VLS_189({
        type: 'primary',
      }),
    );
    const __VLS_191 = __VLS_190(
      {
        type: 'primary',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_190),
    );
    __VLS_192.slots.default;
    var __VLS_192;
  } else if (__VLS_ctx.currentInstance.status === 'completed') {
    const __VLS_193 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(
      __VLS_193,
      new __VLS_193({
        type: 'success',
      }),
    );
    const __VLS_195 = __VLS_194(
      {
        type: 'success',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_194),
    );
    __VLS_196.slots.default;
    var __VLS_196;
  } else if (__VLS_ctx.currentInstance.status === 'terminated') {
    const __VLS_197 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(
      __VLS_197,
      new __VLS_197({
        type: 'danger',
      }),
    );
    const __VLS_199 = __VLS_198(
      {
        type: 'danger',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_198),
    );
    __VLS_200.slots.default;
    var __VLS_200;
  }
  var __VLS_188;
  var __VLS_164;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flow-chart-section' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
  if (__VLS_ctx.instanceFlowNodes.length > 0) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-chart' },
    });
    for (const [node, idx] of __VLS_getVForSourceType(__VLS_ctx.instanceFlowNodes)) {
      node.id;
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'flow-node' },
        ...{
          class: {
            start: node.type === 'start',
            done: node.status === 'done',
            current: node.status === 'current',
            pending: node.status === 'pending',
          },
        },
      });
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'node-icon' },
      });
      node.icon;
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'node-label' },
      });
      node.name;
      if (node.assignee) {
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.div,
          __VLS_intrinsicElements.div,
        )({
          ...{ class: 'node-assignee' },
        });
        node.assignee;
      }
      if (idx < __VLS_ctx.instanceFlowNodes.length - 1) {
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.div,
          __VLS_intrinsicElements.div,
        )({
          ...{ class: 'flow-arrow' },
        });
      }
    }
  } else {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-chart-simple' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-node start' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-icon' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-label' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-arrow' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-node done' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-icon' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-label' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-arrow' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-node current' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-icon' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-label' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-arrow' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flow-node pending' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-icon' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'node-label' },
    });
  }
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'variables-section' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
  const __VLS_201 = {}.ElTable;
  /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
  const __VLS_202 = __VLS_asFunctionalComponent(
    __VLS_201,
    new __VLS_201({
      data: __VLS_ctx.instanceVariables,
      border: true,
      size: 'small',
    }),
  );
  const __VLS_203 = __VLS_202(
    {
      data: __VLS_ctx.instanceVariables,
      border: true,
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_202),
  );
  __VLS_204.slots.default;
  const __VLS_205 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_206 = __VLS_asFunctionalComponent(
    __VLS_205,
    new __VLS_205({
      prop: 'name',
      label: '变量名',
      width: '150',
    }),
  );
  const __VLS_207 = __VLS_206(
    {
      prop: 'name',
      label: '变量名',
      width: '150',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_206),
  );
  const __VLS_209 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_210 = __VLS_asFunctionalComponent(
    __VLS_209,
    new __VLS_209({
      prop: 'type',
      label: '类型',
      width: '100',
    }),
  );
  const __VLS_211 = __VLS_210(
    {
      prop: 'type',
      label: '类型',
      width: '100',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_210),
  );
  const __VLS_213 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_214 = __VLS_asFunctionalComponent(
    __VLS_213,
    new __VLS_213({
      prop: 'value',
      label: '值',
      minWidth: '200',
    }),
  );
  const __VLS_215 = __VLS_214(
    {
      prop: 'value',
      label: '值',
      minWidth: '200',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_214),
  );
  const __VLS_217 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_218 = __VLS_asFunctionalComponent(
    __VLS_217,
    new __VLS_217({
      prop: 'updateTime',
      label: '更新时间',
      width: '180',
    }),
  );
  const __VLS_219 = __VLS_218(
    {
      prop: 'updateTime',
      label: '更新时间',
      width: '180',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_218),
  );
  var __VLS_204;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'history-section' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
  const __VLS_221 = {}.ElTable;
  /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
  const __VLS_222 = __VLS_asFunctionalComponent(
    __VLS_221,
    new __VLS_221({
      data: __VLS_ctx.instanceHistory,
      border: true,
      stripe: true,
      size: 'small',
    }),
  );
  const __VLS_223 = __VLS_222(
    {
      data: __VLS_ctx.instanceHistory,
      border: true,
      stripe: true,
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_222),
  );
  __VLS_224.slots.default;
  const __VLS_225 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_226 = __VLS_asFunctionalComponent(
    __VLS_225,
    new __VLS_225({
      prop: 'taskName',
      label: '任务名称',
      width: '150',
    }),
  );
  const __VLS_227 = __VLS_226(
    {
      prop: 'taskName',
      label: '任务名称',
      width: '150',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_226),
  );
  const __VLS_229 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_230 = __VLS_asFunctionalComponent(
    __VLS_229,
    new __VLS_229({
      prop: 'assignee',
      label: '处理人',
      width: '100',
    }),
  );
  const __VLS_231 = __VLS_230(
    {
      prop: 'assignee',
      label: '处理人',
      width: '100',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_230),
  );
  const __VLS_233 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_234 = __VLS_asFunctionalComponent(
    __VLS_233,
    new __VLS_233({
      prop: 'action',
      label: '操作',
      width: '100',
    }),
  );
  const __VLS_235 = __VLS_234(
    {
      prop: 'action',
      label: '操作',
      width: '100',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_234),
  );
  __VLS_236.slots.default;
  {
    const { default: __VLS_thisSlot } = __VLS_236.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_237 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(
      __VLS_237,
      new __VLS_237({
        type: __VLS_ctx.getActionType(row.action),
        size: 'small',
      }),
    );
    const __VLS_239 = __VLS_238(
      {
        type: __VLS_ctx.getActionType(row.action),
        size: 'small',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_238),
    );
    __VLS_240.slots.default;
    row.actionText;
    var __VLS_240;
  }
  var __VLS_236;
  const __VLS_241 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_242 = __VLS_asFunctionalComponent(
    __VLS_241,
    new __VLS_241({
      prop: 'comment',
      label: '审批意见',
      minWidth: '200',
    }),
  );
  const __VLS_243 = __VLS_242(
    {
      prop: 'comment',
      label: '审批意见',
      minWidth: '200',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_242),
  );
  const __VLS_245 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_246 = __VLS_asFunctionalComponent(
    __VLS_245,
    new __VLS_245({
      prop: 'duration',
      label: '处理时长',
      width: '100',
    }),
  );
  const __VLS_247 = __VLS_246(
    {
      prop: 'duration',
      label: '处理时长',
      width: '100',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_246),
  );
  __VLS_248.slots.default;
  {
    const { default: __VLS_thisSlot } = __VLS_248.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    row.duration || '-';
  }
  var __VLS_248;
  const __VLS_249 = {}.ElTableColumn;
  /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
  const __VLS_250 = __VLS_asFunctionalComponent(
    __VLS_249,
    new __VLS_249({
      prop: 'endTime',
      label: '完成时间',
      width: '180',
    }),
  );
  const __VLS_251 = __VLS_250(
    {
      prop: 'endTime',
      label: '完成时间',
      width: '180',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_250),
  );
  var __VLS_224;
}
var __VLS_160;
/** @type {__VLS_StyleScopedClasses['process-instance']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['title']} */ /** @type {__VLS_StyleScopedClasses['count-tag']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ /** @type {__VLS_StyleScopedClasses['instance-detail']} */ /** @type {__VLS_StyleScopedClasses['flow-chart-section']} */ /** @type {__VLS_StyleScopedClasses['flow-chart']} */ /** @type {__VLS_StyleScopedClasses['flow-node']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['node-assignee']} */ /** @type {__VLS_StyleScopedClasses['flow-arrow']} */ /** @type {__VLS_StyleScopedClasses['flow-chart-simple']} */ /** @type {__VLS_StyleScopedClasses['flow-node']} */ /** @type {__VLS_StyleScopedClasses['start']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['flow-arrow']} */ /** @type {__VLS_StyleScopedClasses['flow-node']} */ /** @type {__VLS_StyleScopedClasses['done']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['flow-arrow']} */ /** @type {__VLS_StyleScopedClasses['flow-node']} */ /** @type {__VLS_StyleScopedClasses['current']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['flow-arrow']} */ /** @type {__VLS_StyleScopedClasses['flow-node']} */ /** @type {__VLS_StyleScopedClasses['pending']} */ /** @type {__VLS_StyleScopedClasses['node-icon']} */ /** @type {__VLS_StyleScopedClasses['node-label']} */ /** @type {__VLS_StyleScopedClasses['variables-section']} */ /** @type {__VLS_StyleScopedClasses['history-section']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      loading: loading,
      instanceList: instanceList,
      total: total,
      queryParams: queryParams,
      viewDrawerVisible: viewDrawerVisible,
      currentInstance: currentInstance,
      instanceFlowNodes: instanceFlowNodes,
      instanceVariables: instanceVariables,
      instanceHistory: instanceHistory,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleView: handleView,
      getActionType: getActionType,
      handleTerminate: handleTerminate,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ProcessInstance.vue.js.map
