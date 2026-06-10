/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
import { getGenTablePage } from '@/api/tool/gen.api';
import GenImport from './GenImport.vue';
import GenPreview from './GenPreview.vue';
const router = useRouter();
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const selectedIds = ref([]);
const importVisible = ref(false);
const previewVisible = ref(false);
const currentTableName = ref('');
const queryParams = reactive({
  page: 1,
  limit: 10,
  sort: 'createTime',
  order: 'desc',
});
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};
const handleQuery = async () => {
  loading.value = true;
  try {
    const res = await getGenTablePage(queryParams);
    if (res.success) {
      tableData.value = res.data;
      total.value = res.pagination?.total || 0;
    }
  } catch {
    ElMessage.error('获取表列表失败');
  } finally {
    loading.value = false;
  }
};
const handleReset = () => {
  queryParams.page = 1;
  queryParams.limit = 10;
  queryParams.tableName = undefined;
  queryParams.tableComment = undefined;
  handleQuery();
};
const handleRefresh = () => {
  handleQuery();
};
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.tableName);
};
const handleImport = () => {
  importVisible.value = true;
};
const handleConfig = (row) => {
  router.push({
    path: '/tool/gen/config',
    query: { tableName: row.tableName },
  });
};
const handlePreview = (row) => {
  currentTableName.value = row.tableName;
  previewVisible.value = true;
};
const handleGenerate = async (row) => {
  try {
    await ElMessageBox.confirm(`确认生成表"${row.tableName}"的代码吗？`, '提示', {
      type: 'warning',
    });
    router.push({
      path: '/tool/gen/config',
      query: { tableName: row.tableName, generate: 'true' },
    });
  } catch {
    // 用户取消
  }
};
const handleDelete = async (_row) => {
  try {
    await ElMessageBox.confirm('确认删除该表的生成配置吗？', '提示', { type: 'warning' });
    ElMessage.success('删除成功');
    handleQuery();
  } catch {
    // 用户取消
  }
};
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个表配置吗？`, '提示', {
      type: 'warning',
    });
    // TODO: 调用批量删除接口
    ElMessage.success('删除成功');
    handleQuery();
  } catch {
    // 用户取消
  }
};
onMounted(() => {
  handleQuery();
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
  ...{ class: 'page-container' },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ class: 'search-card' },
  }),
);
const __VLS_2 = __VLS_1(
  {
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
    label: '表名称',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '表名称',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    modelValue: __VLS_ctx.queryParams.tableName,
    placeholder: '请输入表名称',
    clearable: true,
    ...{ style: {} },
  }),
);
const __VLS_14 = __VLS_13(
  {
    modelValue: __VLS_ctx.queryParams.tableName,
    placeholder: '请输入表名称',
    clearable: true,
    ...{ style: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '表描述',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '表描述',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    modelValue: __VLS_ctx.queryParams.tableComment,
    placeholder: '请输入表描述',
    clearable: true,
    ...{ style: {} },
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.queryParams.tableComment,
    placeholder: '请输入表描述',
    clearable: true,
    ...{ style: {} },
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
  onClick: __VLS_ctx.handleReset,
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
    ...{ class: 'toolbar-card' },
  }),
);
const __VLS_46 = __VLS_45(
  {
    ...{ class: 'toolbar-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
__VLS_47.slots.default;
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
  ...{ class: 'toolbar-left' },
});
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Download,
  }),
);
const __VLS_50 = __VLS_49(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Download,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
  onClick: __VLS_ctx.handleImport,
};
__VLS_51.slots.default;
var __VLS_51;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    ...{ onClick: {} },
    type: 'danger',
    icon: __VLS_ctx.Delete,
    disabled: __VLS_ctx.selectedIds.length === 0,
  }),
);
const __VLS_58 = __VLS_57(
  {
    ...{ onClick: {} },
    type: 'danger',
    icon: __VLS_ctx.Delete,
    disabled: __VLS_ctx.selectedIds.length === 0,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
  onClick: __VLS_ctx.handleBatchDelete,
};
__VLS_59.slots.default;
var __VLS_59;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'toolbar-right' },
});
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
    circle: true,
  }),
);
const __VLS_66 = __VLS_65(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.Refresh,
    circle: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
  onClick: __VLS_ctx.handleRefresh,
};
var __VLS_67;
var __VLS_47;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    ...{ class: 'table-card' },
  }),
);
const __VLS_74 = __VLS_73(
  {
    ...{ class: 'table-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
__VLS_75.slots.default;
const __VLS_76 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ // @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(
  __VLS_76,
  new __VLS_76({
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.tableData,
  }),
);
const __VLS_78 = __VLS_77(
  {
    ...{ onSelectionChange: {} },
    data: __VLS_ctx.tableData,
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
    width: '50',
    align: 'center',
  }),
);
const __VLS_86 = __VLS_85(
  {
    type: 'selection',
    width: '50',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_85),
);
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(
  __VLS_88,
  new __VLS_88({
    label: '表名称',
    prop: 'tableName',
    width: '180',
    align: 'center',
  }),
);
const __VLS_90 = __VLS_89(
  {
    label: '表名称',
    prop: 'tableName',
    width: '180',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_89),
);
__VLS_91.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_91.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_92 = {}.ElLink;
  /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ // @ts-ignore
  const __VLS_93 = __VLS_asFunctionalComponent(
    __VLS_92,
    new __VLS_92({
      ...{ onClick: {} },
      type: 'primary',
    }),
  );
  const __VLS_94 = __VLS_93(
    {
      ...{ onClick: {} },
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_93),
  );
  let __VLS_96;
  let __VLS_97;
  let __VLS_98;
  const __VLS_99 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handlePreview(row);
    },
  };
  __VLS_95.slots.default;
  row.tableName;
  var __VLS_95;
}
var __VLS_91;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(
  __VLS_100,
  new __VLS_100({
    label: '表描述',
    prop: 'tableComment',
    minWidth: '150',
    showOverflowTooltip: true,
  }),
);
const __VLS_102 = __VLS_101(
  {
    label: '表描述',
    prop: 'tableComment',
    minWidth: '150',
    showOverflowTooltip: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_101),
);
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(
  __VLS_104,
  new __VLS_104({
    label: '表空间',
    prop: 'tableSchema',
    width: '120',
    align: 'center',
  }),
);
const __VLS_106 = __VLS_105(
  {
    label: '表空间',
    prop: 'tableSchema',
    width: '120',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_105),
);
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(
  __VLS_108,
  new __VLS_108({
    label: '引擎',
    prop: 'engine',
    width: '100',
    align: 'center',
  }),
);
const __VLS_110 = __VLS_109(
  {
    label: '引擎',
    prop: 'engine',
    width: '100',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_109),
);
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(
  __VLS_112,
  new __VLS_112({
    label: '创建时间',
    prop: 'createTime',
    width: '180',
    align: 'center',
  }),
);
const __VLS_114 = __VLS_113(
  {
    label: '创建时间',
    prop: 'createTime',
    width: '180',
    align: 'center',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_113),
);
__VLS_115.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_115.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  __VLS_ctx.formatDate(row.createTime);
}
var __VLS_115;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ // @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(
  __VLS_116,
  new __VLS_116({
    label: '操作',
    width: '280',
    align: 'center',
    fixed: 'right',
  }),
);
const __VLS_118 = __VLS_117(
  {
    label: '操作',
    width: '280',
    align: 'center',
    fixed: 'right',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_117),
);
__VLS_119.slots.default;
{
  const { default: __VLS_thisSlot } = __VLS_119.slots;
  const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
  const __VLS_120 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_121 = __VLS_asFunctionalComponent(
    __VLS_120,
    new __VLS_120({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_122 = __VLS_121(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_121),
  );
  let __VLS_124;
  let __VLS_125;
  let __VLS_126;
  const __VLS_127 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleConfig(row);
    },
  };
  __VLS_123.slots.default;
  var __VLS_123;
  const __VLS_128 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_129 = __VLS_asFunctionalComponent(
    __VLS_128,
    new __VLS_128({
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    }),
  );
  const __VLS_130 = __VLS_129(
    {
      ...{ onClick: {} },
      link: true,
      type: 'primary',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_129),
  );
  let __VLS_132;
  let __VLS_133;
  let __VLS_134;
  const __VLS_135 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handlePreview(row);
    },
  };
  __VLS_131.slots.default;
  var __VLS_131;
  const __VLS_136 = {}.ElButton;
  /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
  const __VLS_137 = __VLS_asFunctionalComponent(
    __VLS_136,
    new __VLS_136({
      ...{ onClick: {} },
      link: true,
      type: 'success',
    }),
  );
  const __VLS_138 = __VLS_137(
    {
      ...{ onClick: {} },
      link: true,
      type: 'success',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_137),
  );
  let __VLS_140;
  let __VLS_141;
  let __VLS_142;
  const __VLS_143 = {
    onClick: (...[$event]) => {
      __VLS_ctx.handleGenerate(row);
    },
  };
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
  __VLS_147.slots.default;
  var __VLS_147;
}
var __VLS_119;
var __VLS_79;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pagination-container' },
});
const __VLS_152 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ // @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(
  __VLS_152,
  new __VLS_152({
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.page,
    pageSize: __VLS_ctx.queryParams.limit,
    pageSizes: [10, 20, 50, 100],
    total: __VLS_ctx.total,
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
);
const __VLS_154 = __VLS_153(
  {
    ...{ onSizeChange: {} },
    ...{ onCurrentChange: {} },
    currentPage: __VLS_ctx.queryParams.page,
    pageSize: __VLS_ctx.queryParams.limit,
    pageSizes: [10, 20, 50, 100],
    total: __VLS_ctx.total,
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
var __VLS_75;
/** @type {[typeof GenImport, ]} */ // @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(
  GenImport,
  new GenImport({
    ...{ onSuccess: {} },
    modelValue: __VLS_ctx.importVisible,
  }),
);
const __VLS_162 = __VLS_161(
  {
    ...{ onSuccess: {} },
    modelValue: __VLS_ctx.importVisible,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_161),
);
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
  onSuccess: __VLS_ctx.handleQuery,
};
var __VLS_163;
/** @type {[typeof GenPreview, ]} */ // @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(
  GenPreview,
  new GenPreview({
    modelValue: __VLS_ctx.previewVisible,
    tableName: __VLS_ctx.currentTableName,
  }),
);
const __VLS_169 = __VLS_168(
  {
    modelValue: __VLS_ctx.previewVisible,
    tableName: __VLS_ctx.currentTableName,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_168),
);
/** @type {__VLS_StyleScopedClasses['page-container']} */ /** @type {__VLS_StyleScopedClasses['search-card']} */ /** @type {__VLS_StyleScopedClasses['toolbar-card']} */ /** @type {__VLS_StyleScopedClasses['toolbar']} */ /** @type {__VLS_StyleScopedClasses['toolbar-left']} */ /** @type {__VLS_StyleScopedClasses['toolbar-right']} */ /** @type {__VLS_StyleScopedClasses['table-card']} */ /** @type {__VLS_StyleScopedClasses['pagination-container']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Search: Search,
      Refresh: Refresh,
      Delete: Delete,
      Download: Download,
      GenImport: GenImport,
      GenPreview: GenPreview,
      loading: loading,
      tableData: tableData,
      total: total,
      selectedIds: selectedIds,
      importVisible: importVisible,
      previewVisible: previewVisible,
      currentTableName: currentTableName,
      queryParams: queryParams,
      formatDate: formatDate,
      handleQuery: handleQuery,
      handleReset: handleReset,
      handleRefresh: handleRefresh,
      handleSelectionChange: handleSelectionChange,
      handleImport: handleImport,
      handleConfig: handleConfig,
      handlePreview: handlePreview,
      handleGenerate: handleGenerate,
      handleDelete: handleDelete,
      handleBatchDelete: handleBatchDelete,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=GenList.vue.js.map
