/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Download } from '@element-plus/icons-vue';
import { getDictTypePage, deleteDictType, exportDictType } from '@/api/system/dict.api';
import DictTypeForm from './DictTypeForm.vue';
import DictDataList from './DictDataList.vue';
// 状态
const loading = ref(false);
const dictTypeList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const formVisible = ref(false);
const dataVisible = ref(false);
const currentDictType = ref(null);
// 查询参数
const queryParams = reactive({
  keyword: '',
  status: undefined,
  pageNum: 1,
  pageSize: 10,
});
// 加载字典类型列表
async function fetchDictTypeList() {
  loading.value = true;
  try {
    const res = await getDictTypePage(queryParams);
    dictTypeList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1;
  fetchDictTypeList();
}
// 重置查询
function resetQuery() {
  queryParams.keyword = '';
  queryParams.status = undefined;
  queryParams.pageNum = 1;
  handleQuery();
}
// 刷新表格
function refreshTable() {
  fetchDictTypeList();
}
// 新增
function handleAdd() {
  currentDictType.value = null;
  formVisible.value = true;
}
// 编辑
function handleEdit(row) {
  currentDictType.value = { ...row };
  formVisible.value = true;
}
// 查看字典数据
function handleViewData(row) {
  currentDictType.value = row;
  dataVisible.value = true;
}
// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`是否确认删除字典"${row.dictName}"？`, '提示', {
      type: 'warning',
    });
    await deleteDictType(row.dictId);
    ElMessage.success('删除成功');
    fetchDictTypeList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error);
    }
  }
}
// 导出
async function handleExport() {
  try {
    await exportDictType(queryParams);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
  }
}
// 批量选择
function handleSelectionChange(selection) {
  selectedRows.value = selection;
}
// 初始化
onMounted(() => {
  fetchDictTypeList();
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
  ...{ class: 'dict-type-list' },
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
    label: '关键词',
    prop: 'keyword',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '关键词',
    prop: 'keyword',
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
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入字典名称/类型',
    clearable: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    ...{ onKeyup: {} },
    modelValue: __VLS_ctx.queryParams.keyword,
    placeholder: '请输入字典名称/类型',
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
    label: '正常',
    value: '0',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '正常',
    value: '0',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    label: '停用',
    value: '1',
  }),
);
const __VLS_34 = __VLS_33(
  {
    label: '停用',
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
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:dict:add'] },
    null,
    null,
  );
  __VLS_63.slots.default;
  var __VLS_63;
  const __VLS_68 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      ...{ onClick: {} },
      type: 'success',
      icon: __VLS_ctx.Download,
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      ...{ onClick: {} },
      type: 'success',
      icon: __VLS_ctx.Download,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  let __VLS_72;
  let __VLS_73;
  let __VLS_74;
  const __VLS_75 = {
    onClick: __VLS_ctx.handleExport,
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:dict:export'] },
    null,
    null,
  );
  __VLS_71.slots.default;
  var __VLS_71;
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
    data: __VLS_ctx.dictTypeList,
    stripe: true,
    border: true,
  }),
);
const __VLS_86 = __VLS_85(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.dictTypeList,
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
    prop: 'dictId',
    label: '字典编号',
    width: '100',
  }),
);
const __VLS_98 = __VLS_97(
  {
    prop: 'dictId',
    label: '字典编号',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_97),
);
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    prop: 'dictName',
    label: '字典名称',
    width: '150',
  }),
);
const __VLS_102 = __VLS_101(
  {
    prop: 'dictName',
    label: '字典名称',
    width: '150',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    prop: 'dictType',
    label: '字典类型',
    width: '200',
  }),
);
const __VLS_106 = __VLS_105(
  {
    prop: 'dictType',
    label: '字典类型',
    width: '200',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
__VLS_107.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_107.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_108 = {}.ElLink;
  /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ // @ts-ignore
  const __VLS_109 = __VLS_asFunctionalComponent(
    __VLS_108,
    new __VLS_108({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_110 = __VLS_109(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_109),
  );
  let __VLS_112;
  let __VLS_113;
  let __VLS_114;
  const __VLS_115 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleViewData(row);
    },
  };
  __VLS_111.slots.default;
  row.dictType;
  var __VLS_111;
}
var __VLS_107;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    prop: 'status',
    label: '状态',
    width: '100',
  }),
);
const __VLS_118 = __VLS_117(
  {
    prop: 'status',
    label: '状态',
    width: '100',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
__VLS_119.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_119.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_120 = {}.ElTag;
  /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
  const __VLS_121 = __VLS_asFunctionalComponent(
    __VLS_120,
    new __VLS_120({
      type: row.status === '0' ? 'success' : 'danger',
    }),
  );
  const __VLS_122 = __VLS_121(
    {
      type: row.status === '0' ? 'success' : 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_121),
  );
  __VLS_123.slots.default;
  row.status === '0' ? '正常' : '停用';
  var __VLS_123;
}
var __VLS_119;
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    prop: 'remark',
    label: '备注',
    minWidth: '200',
    showOverflowTooltip: true,
  }),
);
const __VLS_126 = __VLS_125(
  {
    prop: 'remark',
    label: '备注',
    minWidth: '200',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(
  __VLS_128,
  new __VLS_128({
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  }),
);
const __VLS_130 = __VLS_129(
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_129),
);
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(
  __VLS_132,
  new __VLS_132({
    label: '操作',
    width: '200',
    fixed: 'right',
  }),
);
const __VLS_134 = __VLS_133(
  {
    label: '操作',
    width: '200',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_133),
);
__VLS_135.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_135.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_136 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_137 = __VLS_asFunctionalComponent(
    __VLS_136,
    new __VLS_136({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_138 = __VLS_137(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_137),
  );
  let __VLS_140;
  let __VLS_141;
  let __VLS_142;
  const __VLS_143 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleEdit(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:dict:edit'] },
    null,
    null,
  );
  __VLS_139.slots.default;
  var __VLS_139;
  const __VLS_144 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_145 = __VLS_asFunctionalComponent(
    __VLS_144,
    new __VLS_144({
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    }),
  );
  const __VLS_146 = __VLS_145(
    {
      ...{ onClick: {} },
      link: true,
      type: 'danger',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_145),
  );
  let __VLS_148;
  let __VLS_149;
  let __VLS_150;
  const __VLS_151 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleDelete(row);
    },
  };
  __VLS_asFunctionalDirective(__VLS_directives.vHasPermi)(
    null,
    { ...__VLS_directiveBindingRestFields, value: ['system:dict:remove'] },
    null,
    null,
  );
  __VLS_147.slots.default;
  var __VLS_147;
}
var __VLS_135;
var __VLS_87;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination' },
});
const __VLS_152 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_154 = __VLS_153(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.pageNum,
    pageSize: __VLS_ctx.queryParams.pageSize,
    total: __VLS_ctx.total,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_153),
);
let __VLS_156;
let __VLS_157;
let __VLS_158;
const __VLS_159 = {
  onSizeChange: __VLS_ctx.handleQuery,
};
const __VLS_160 = {
  onCurrentChange: __VLS_ctx.handleQuery,
};
var __VLS_155;
var __VLS_59;
/** @type {[typeof DictTypeForm, ]} */ // @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(
  DictTypeForm,
  new DictTypeForm({
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    dictTypeData: __VLS_ctx.currentDictType,
  }),
);
const __VLS_162 = __VLS_161(
  {
    ...{ onRefresh: {} },
    modelValue: __VLS_ctx.formVisible,
    dictTypeData: __VLS_ctx.currentDictType,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_161),
);
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
  onRefresh: __VLS_ctx.handleQuery,
};
var __VLS_163;
/** @type {[typeof DictDataList, ]} */ // @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(
  DictDataList,
  new DictDataList({
    modelValue: __VLS_ctx.dataVisible,
    dictType: __VLS_ctx.currentDictType?.dictType,
  }),
);
const __VLS_169 = __VLS_168(
  {
    modelValue: __VLS_ctx.dataVisible,
    dictType: __VLS_ctx.currentDictType?.dictType,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_168),
);
/** @type {__VLS_StyleScopedClasses['dict-type-list']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['table-header']} */ /** @type {__VLS_StyleScopedClasses['left']} */ /** @type {__VLS_StyleScopedClasses['right']} */ /** @type {__VLS_StyleScopedClasses['pagination']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Plus: Plus,
      Download: Download,
      DictTypeForm: DictTypeForm,
      DictDataList: DictDataList,
      loading: loading,
      dictTypeList: dictTypeList,
      total: total,
      formVisible: formVisible,
      dataVisible: dataVisible,
      currentDictType: currentDictType,
      queryParams: queryParams,
      handleQuery: handleQuery,
      resetQuery: resetQuery,
      refreshTable: refreshTable,
      handleAdd: handleAdd,
      handleEdit: handleEdit,
      handleViewData: handleViewData,
      handleDelete: handleDelete,
      handleExport: handleExport,
      handleSelectionChange: handleSelectionChange,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DictTypeList.vue.js.map
