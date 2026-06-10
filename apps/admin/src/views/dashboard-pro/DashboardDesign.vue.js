/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  RefreshLeft,
  Check,
  Delete,
  Box,
  TrendCharts,
  DataLine,
  PieChart,
  Grid,
  User,
  Monitor,
} from '@element-plus/icons-vue';
import DashboardScreen from './DashboardScreen.vue';
const dashboardName = ref('新增大屏');
const selectedTemplate = ref('custom');
const selectedWidgetIndex = ref(null);
const previewVisible = ref(false);
const widgetTypes = [
  { type: 'line', name: '折线图', icon: TrendCharts },
  { type: 'bar', name: '柱状图', icon: DataLine },
  { type: 'pie', name: '饼图', icon: PieChart },
  { type: 'table', name: '数据表格', icon: Grid },
  { type: 'number', name: '数字卡片', icon: User },
  { type: 'gauge', name: '仪表盘', icon: Monitor },
];
const canvasWidgets = ref([]);
const selectedWidget = computed(() => {
  if (selectedWidgetIndex.value !== null) {
    return canvasWidgets.value[selectedWidgetIndex.value];
  }
  return null;
});
const LineChartWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#00d4ff;">折线图</div>',
};
const BarChartWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ffd700;">柱状图</div>',
};
const PieChartWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#00ff88;">饼图</div>',
};
const TableWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#a855f7;">数据表格</div>',
};
const NumberWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ff6b6b;">数字卡片</div>',
};
const GaugeWidget = {
  template:
    '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6366f1;">仪表盘</div>',
};
const getWidgetComponent = (type) => {
  const components = {
    line: LineChartWidget,
    bar: BarChartWidget,
    pie: PieChartWidget,
    table: TableWidget,
    number: NumberWidget,
    gauge: GaugeWidget,
  };
  return components[type] || 'div';
};
const handleDragStart = (event, widget) => {
  event.dataTransfer?.setData('widgetType', widget.type);
  event.dataTransfer?.setData('widgetName', widget.name);
};
const handleDrop = (event) => {
  event.preventDefault();
  const widgetType = event.dataTransfer?.getData('widgetType');
  const widgetName = event.dataTransfer?.getData('widgetName');
  if (widgetType && widgetName) {
    const canvas = event.target.closest('.canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - 100;
      const y = event.clientY - rect.top - 50;
      const newWidget = {
        id: Date.now().toString(),
        type: widgetType,
        name: widgetName,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: 300,
        height: 200,
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        borderColor: '#00d4ff',
        data: {},
      };
      canvasWidgets.value.push(newWidget);
    }
  }
};
const selectWidget = (index) => {
  selectedWidgetIndex.value = index;
};
const removeWidget = (index) => {
  canvasWidgets.value.splice(index, 1);
  if (selectedWidgetIndex.value === index) {
    selectedWidgetIndex.value = null;
  } else if (selectedWidgetIndex.value !== null && selectedWidgetIndex.value > index) {
    selectedWidgetIndex.value--;
  }
};
const resetConfig = () => {
  canvasWidgets.value = [];
  selectedWidgetIndex.value = null;
  ElMessage.info('已重置');
};
const preview = () => {
  previewVisible.value = true;
};
const saveDashboard = () => {
  ElMessage.success('保存成功！');
  console.log('保存的配置:', {
    name: dashboardName.value,
    widgets: canvasWidgets.value,
  });
};
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
  ...{ class: 'dashboard-design' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'design-header' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-left' },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    modelValue: __VLS_ctx.dashboardName,
    placeholder: '大屏名称',
    ...{ class: 'name-input' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    modelValue: __VLS_ctx.dashboardName,
    placeholder: '大屏名称',
    ...{ class: 'name-input' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
const __VLS_4 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    modelValue: __VLS_ctx.selectedTemplate,
    placeholder: '选择模板',
    ...{ class: 'template-select' },
  }),
);
const __VLS_6 = __VLS_5(
  {
    modelValue: __VLS_ctx.selectedTemplate,
    placeholder: '选择模板',
    ...{ class: 'template-select' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_7.slots.default;
const __VLS_8 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    label: '企业运营监控',
    value: 'enterprise',
  }),
);
const __VLS_10 = __VLS_9(
  {
    label: '企业运营监控',
    value: 'enterprise',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
const __VLS_12 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    label: '销售数据分析',
    value: 'sales',
  }),
);
const __VLS_14 = __VLS_13(
  {
    label: '销售数据分析',
    value: 'sales',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
const __VLS_16 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '自定义',
    value: 'custom',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '自定义',
    value: 'custom',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
var __VLS_7;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'header-right' },
});
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    ...{ onClick: {} },
    icon: __VLS_ctx.RefreshLeft,
  }),
);
const __VLS_22 = __VLS_21(
  {
    ...{ onClick: {} },
    icon: __VLS_ctx.RefreshLeft,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
  onClick: __VLS_ctx.resetConfig,
};
__VLS_23.slots.default;
var __VLS_23;
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    ...{ onClick: {} },
  }),
);
const __VLS_30 = __VLS_29(
  {
    ...{ onClick: {} },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
  onClick: __VLS_ctx.preview,
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Check,
  }),
);
const __VLS_38 = __VLS_37(
  {
    ...{ onClick: {} },
    type: 'primary',
    icon: __VLS_ctx.Check,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
  onClick: __VLS_ctx.saveDashboard,
};
__VLS_39.slots.default;
var __VLS_39;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'design-body' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'widget-panel' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'panel-title' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'widget-list' },
});
for (const [widget] of __VLS_getVForSourceType(__VLS_ctx.widgetTypes)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onDragstart: (...[$event]) => {
        __VLS_ctx.handleDragStart($event, widget);
      },
    },
    key: widget.type,
    ...{ class: 'widget-item' },
    draggable: 'true',
  });
  const __VLS_44 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_45 = __VLS_asFunctionalComponent(
    __VLS_44,
    new __VLS_44({
      size: 24,
    }),
  );
  const __VLS_46 = __VLS_45(
    {
      size: 24,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_45),
  );
  __VLS_47.slots.default;
  const __VLS_48 = widget.icon;
  // @ts-ignore
  const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
  const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
  var __VLS_47;
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  widget.name;
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'canvas-container' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ onDragover: () => {} },
  ...{ onDrop: __VLS_ctx.handleDrop },
  ...{ class: 'canvas' },
});
for (const [widget, index] of __VLS_getVForSourceType(__VLS_ctx.canvasWidgets)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.selectWidget(index);
      },
    },
    key: widget.id,
    ...{ class: 'canvas-widget' },
    ...{
      style: {
        left: widget.x + 'px',
        top: widget.y + 'px',
        width: widget.width + 'px',
        height: widget.height + 'px',
      },
    },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'widget-header' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  widget.name;
  const __VLS_52 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_53 = __VLS_asFunctionalComponent(
    __VLS_52,
    new __VLS_52({
      ...{ onClick: {} },
      ...{ class: 'delete-icon' },
    }),
  );
  const __VLS_54 = __VLS_53(
    {
      ...{ onClick: {} },
      ...{ class: 'delete-icon' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_53),
  );
  let __VLS_56;
  let __VLS_57;
  let __VLS_58;
  const __VLS_59 = {
    onClick: (...[$event]) => {
      __VLS_ctx.removeWidget(index);
    },
  };
  __VLS_55.slots.default;
  const __VLS_60 = {}.Delete;
  /** @type {[typeof __VLS_components.Delete, ]} */ // @ts-ignore
  const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
  const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
  var __VLS_55;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'widget-content' },
  });
  const __VLS_64 = __VLS_ctx.getWidgetComponent(widget.type);
  // @ts-ignore
  const __VLS_65 = __VLS_asFunctionalComponent(
    __VLS_64,
    new __VLS_64({
      data: widget.data,
    }),
  );
  const __VLS_66 = __VLS_65(
    {
      data: widget.data,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_65),
  );
}
if (__VLS_ctx.canvasWidgets.length === 0) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'empty-tip' },
  });
  const __VLS_68 = {}.ElIcon;
  /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ // @ts-ignore
  const __VLS_69 = __VLS_asFunctionalComponent(
    __VLS_68,
    new __VLS_68({
      size: 48,
    }),
  );
  const __VLS_70 = __VLS_69(
    {
      size: 48,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_69),
  );
  __VLS_71.slots.default;
  const __VLS_72 = {}.Box;
  /** @type {[typeof __VLS_components.Box, ]} */ // @ts-ignore
  const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
  const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
  var __VLS_71;
  __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.selectedWidgetIndex !== null) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'property-panel' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'panel-title' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'property-form' },
  });
  const __VLS_76 = {}.ElForm;
  /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ // @ts-ignore
  const __VLS_77 = __VLS_asFunctionalComponent(
    __VLS_76,
    new __VLS_76({
      labelWidth: '80px',
      size: 'small',
    }),
  );
  const __VLS_78 = __VLS_77(
    {
      labelWidth: '80px',
      size: 'small',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_77),
  );
  __VLS_79.slots.default;
  const __VLS_80 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_81 = __VLS_asFunctionalComponent(
    __VLS_80,
    new __VLS_80({
      label: '组件名称',
    }),
  );
  const __VLS_82 = __VLS_81(
    {
      label: '组件名称',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_81),
  );
  __VLS_83.slots.default;
  const __VLS_84 = {}.ElInput;
  /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ // @ts-ignore
  const __VLS_85 = __VLS_asFunctionalComponent(
    __VLS_84,
    new __VLS_84({
      modelValue: __VLS_ctx.selectedWidget.name,
    }),
  );
  const __VLS_86 = __VLS_85(
    {
      modelValue: __VLS_ctx.selectedWidget.name,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_85),
  );
  var __VLS_83;
  const __VLS_88 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_89 = __VLS_asFunctionalComponent(
    __VLS_88,
    new __VLS_88({
      label: '宽度',
    }),
  );
  const __VLS_90 = __VLS_89(
    {
      label: '宽度',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_89),
  );
  __VLS_91.slots.default;
  const __VLS_92 = {}.ElInputNumber;
  /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ // @ts-ignore
  const __VLS_93 = __VLS_asFunctionalComponent(
    __VLS_92,
    new __VLS_92({
      modelValue: __VLS_ctx.selectedWidget.width,
      min: 100,
      max: 800,
    }),
  );
  const __VLS_94 = __VLS_93(
    {
      modelValue: __VLS_ctx.selectedWidget.width,
      min: 100,
      max: 800,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_93),
  );
  var __VLS_91;
  const __VLS_96 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_97 = __VLS_asFunctionalComponent(
    __VLS_96,
    new __VLS_96({
      label: '高度',
    }),
  );
  const __VLS_98 = __VLS_97(
    {
      label: '高度',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_97),
  );
  __VLS_99.slots.default;
  const __VLS_100 = {}.ElInputNumber;
  /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ // @ts-ignore
  const __VLS_101 = __VLS_asFunctionalComponent(
    __VLS_100,
    new __VLS_100({
      modelValue: __VLS_ctx.selectedWidget.height,
      min: 100,
      max: 600,
    }),
  );
  const __VLS_102 = __VLS_101(
    {
      modelValue: __VLS_ctx.selectedWidget.height,
      min: 100,
      max: 600,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_101),
  );
  var __VLS_99;
  const __VLS_104 = {}.ElDivider;
  /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ // @ts-ignore
  const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
  const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
  const __VLS_108 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_109 = __VLS_asFunctionalComponent(
    __VLS_108,
    new __VLS_108({
      label: '背景色',
    }),
  );
  const __VLS_110 = __VLS_109(
    {
      label: '背景色',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_109),
  );
  __VLS_111.slots.default;
  const __VLS_112 = {}.ElColorPicker;
  /** @type {[typeof __VLS_components.ElColorPicker, typeof __VLS_components.elColorPicker, ]} */ // @ts-ignore
  const __VLS_113 = __VLS_asFunctionalComponent(
    __VLS_112,
    new __VLS_112({
      modelValue: __VLS_ctx.selectedWidget.backgroundColor,
    }),
  );
  const __VLS_114 = __VLS_113(
    {
      modelValue: __VLS_ctx.selectedWidget.backgroundColor,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_113),
  );
  var __VLS_111;
  const __VLS_116 = {}.ElFormItem;
  /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ // @ts-ignore
  const __VLS_117 = __VLS_asFunctionalComponent(
    __VLS_116,
    new __VLS_116({
      label: '边框颜色',
    }),
  );
  const __VLS_118 = __VLS_117(
    {
      label: '边框颜色',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_117),
  );
  __VLS_119.slots.default;
  const __VLS_120 = {}.ElColorPicker;
  /** @type {[typeof __VLS_components.ElColorPicker, typeof __VLS_components.elColorPicker, ]} */ // @ts-ignore
  const __VLS_121 = __VLS_asFunctionalComponent(
    __VLS_120,
    new __VLS_120({
      modelValue: __VLS_ctx.selectedWidget.borderColor,
    }),
  );
  const __VLS_122 = __VLS_121(
    {
      modelValue: __VLS_ctx.selectedWidget.borderColor,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_121),
  );
  var __VLS_119;
  var __VLS_79;
}
const __VLS_124 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ // @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(
  __VLS_124,
  new __VLS_124({
    modelValue: __VLS_ctx.previewVisible,
    title: '预览',
    width: '90%',
    top: '5vh',
  }),
);
const __VLS_126 = __VLS_125(
  {
    modelValue: __VLS_ctx.previewVisible,
    title: '预览',
    width: '90%',
    top: '5vh',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_125),
);
__VLS_127.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'preview-container' },
});
/** @type {[typeof DashboardScreen, ]} */ // @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(DashboardScreen, new DashboardScreen({}));
const __VLS_129 = __VLS_128({}, ...__VLS_functionalComponentArgsRest(__VLS_128));
var __VLS_127;
/** @type {__VLS_StyleScopedClasses['dashboard-design']} */ /** @type {__VLS_StyleScopedClasses['design-header']} */ /** @type {__VLS_StyleScopedClasses['header-left']} */ /** @type {__VLS_StyleScopedClasses['name-input']} */ /** @type {__VLS_StyleScopedClasses['template-select']} */ /** @type {__VLS_StyleScopedClasses['header-right']} */ /** @type {__VLS_StyleScopedClasses['design-body']} */ /** @type {__VLS_StyleScopedClasses['widget-panel']} */ /** @type {__VLS_StyleScopedClasses['panel-title']} */ /** @type {__VLS_StyleScopedClasses['widget-list']} */ /** @type {__VLS_StyleScopedClasses['widget-item']} */ /** @type {__VLS_StyleScopedClasses['canvas-container']} */ /** @type {__VLS_StyleScopedClasses['canvas']} */ /** @type {__VLS_StyleScopedClasses['canvas-widget']} */ /** @type {__VLS_StyleScopedClasses['widget-header']} */ /** @type {__VLS_StyleScopedClasses['delete-icon']} */ /** @type {__VLS_StyleScopedClasses['widget-content']} */ /** @type {__VLS_StyleScopedClasses['empty-tip']} */ /** @type {__VLS_StyleScopedClasses['property-panel']} */ /** @type {__VLS_StyleScopedClasses['panel-title']} */ /** @type {__VLS_StyleScopedClasses['property-form']} */ /** @type {__VLS_StyleScopedClasses['preview-container']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      RefreshLeft: RefreshLeft,
      Check: Check,
      Delete: Delete,
      Box: Box,
      DashboardScreen: DashboardScreen,
      dashboardName: dashboardName,
      selectedTemplate: selectedTemplate,
      selectedWidgetIndex: selectedWidgetIndex,
      previewVisible: previewVisible,
      widgetTypes: widgetTypes,
      canvasWidgets: canvasWidgets,
      selectedWidget: selectedWidget,
      getWidgetComponent: getWidgetComponent,
      handleDragStart: handleDragStart,
      handleDrop: handleDrop,
      selectWidget: selectWidget,
      removeWidget: removeWidget,
      resetConfig: resetConfig,
      preview: preview,
      saveDashboard: saveDashboard,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardDesign.vue.js.map
