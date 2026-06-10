/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOperlog } from '@/api/monitor/operlog.api';
const router = useRouter();
const route = useRoute();
const detailData = ref({});
const getOperTypeTagType = (type) => {
  const map = {
    查询: 'info',
    新增: 'success',
    修改: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'success',
  };
  return map[type];
};
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};
const formatJson = (str) => {
  if (!str) return '-';
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
};
const handleBack = () => {
  router.back();
};
const loadDetail = async () => {
  const id = route.params.id;
  try {
    const res = await getOperlog(Number(id));
    if (res.success) {
      detailData.value = res.data;
    }
  } catch {
    ElMessage.error('获取日志详情失败');
  }
};
onMounted(() => {
  loadDetail();
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
const __VLS_0 = {}.ElPageHeader;
/** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    ...{ onBack: {} },
    title: '返回列表',
  }),
);
const __VLS_2 = __VLS_1(
  {
    ...{ onBack: {} },
    title: '返回列表',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
  onBack: __VLS_ctx.handleBack,
};
__VLS_3.slots.default;
{
  const { content: __VLS_thisSlot } = __VLS_3.slots;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'detail-title' },
  });
}
var __VLS_3;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    ...{ class: 'detail-card' },
  }),
);
const __VLS_10 = __VLS_9(
  {
    ...{ class: 'detail-card' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_11.slots.default;
const __VLS_12 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    column: 2,
    border: true,
  }),
);
const __VLS_14 = __VLS_13(
  {
    column: 2,
    border: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
__VLS_15.slots.default;
const __VLS_16 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    label: '日志编号',
  }),
);
const __VLS_18 = __VLS_17(
  {
    label: '日志编号',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_19.slots.default;
__VLS_ctx.detailData.operId;
var __VLS_19;
const __VLS_20 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    label: '操作人',
  }),
);
const __VLS_22 = __VLS_21(
  {
    label: '操作人',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_23.slots.default;
__VLS_ctx.detailData.operName;
var __VLS_23;
const __VLS_24 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    label: '操作时间',
  }),
);
const __VLS_26 = __VLS_25(
  {
    label: '操作时间',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_27.slots.default;
__VLS_ctx.formatDate(__VLS_ctx.detailData.operTime);
var __VLS_27;
const __VLS_28 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    label: '操作类型',
  }),
);
const __VLS_30 = __VLS_29(
  {
    label: '操作类型',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
__VLS_31.slots.default;
const __VLS_32 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    type: __VLS_ctx.getOperTypeTagType(__VLS_ctx.detailData.operType),
  }),
);
const __VLS_34 = __VLS_33(
  {
    type: __VLS_ctx.getOperTypeTagType(__VLS_ctx.detailData.operType),
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
__VLS_35.slots.default;
__VLS_ctx.detailData.operType;
var __VLS_35;
var __VLS_31;
const __VLS_36 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(
  __VLS_36,
  new __VLS_36({
    label: '操作模块',
  }),
);
const __VLS_38 = __VLS_37(
  {
    label: '操作模块',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_37),
);
__VLS_39.slots.default;
__VLS_ctx.detailData.operModule;
var __VLS_39;
const __VLS_40 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(
  __VLS_40,
  new __VLS_40({
    label: '操作状态',
  }),
);
const __VLS_42 = __VLS_41(
  {
    label: '操作状态',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_41),
);
__VLS_43.slots.default;
const __VLS_44 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ // @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(
  __VLS_44,
  new __VLS_44({
    type: __VLS_ctx.detailData.status === '0' ? 'success' : 'danger',
  }),
);
const __VLS_46 = __VLS_45(
  {
    type: __VLS_ctx.detailData.status === '0' ? 'success' : 'danger',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_45),
);
__VLS_47.slots.default;
__VLS_ctx.detailData.status === '0' ? '成功' : '失败';
var __VLS_47;
var __VLS_43;
const __VLS_48 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(
  __VLS_48,
  new __VLS_48({
    label: '请求方法',
  }),
);
const __VLS_50 = __VLS_49(
  {
    label: '请求方法',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_49),
);
__VLS_51.slots.default;
__VLS_ctx.detailData.requestMethod;
var __VLS_51;
const __VLS_52 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(
  __VLS_52,
  new __VLS_52({
    label: '操作地址',
  }),
);
const __VLS_54 = __VLS_53(
  {
    label: '操作地址',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_53),
);
__VLS_55.slots.default;
__VLS_ctx.detailData.operUrl;
var __VLS_55;
const __VLS_56 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(
  __VLS_56,
  new __VLS_56({
    label: '操作IP',
  }),
);
const __VLS_58 = __VLS_57(
  {
    label: '操作IP',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_57),
);
__VLS_59.slots.default;
__VLS_ctx.detailData.operIp;
var __VLS_59;
const __VLS_60 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(
  __VLS_60,
  new __VLS_60({
    label: '操作系统',
  }),
);
const __VLS_62 = __VLS_61(
  {
    label: '操作系统',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_61),
);
__VLS_63.slots.default;
__VLS_ctx.detailData.operSystem;
var __VLS_63;
const __VLS_64 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(
  __VLS_64,
  new __VLS_64({
    label: '浏览器',
  }),
);
const __VLS_66 = __VLS_65(
  {
    label: '浏览器',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_65),
);
__VLS_67.slots.default;
__VLS_ctx.detailData.browser;
var __VLS_67;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(
  __VLS_68,
  new __VLS_68({
    label: '操作地点',
  }),
);
const __VLS_70 = __VLS_69(
  {
    label: '操作地点',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_69),
);
__VLS_71.slots.default;
__VLS_ctx.detailData.operLocation;
var __VLS_71;
const __VLS_72 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(
  __VLS_72,
  new __VLS_72({
    label: '耗时',
  }),
);
const __VLS_74 = __VLS_73(
  {
    label: '耗时',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_73),
);
__VLS_75.slots.default;
__VLS_ctx.detailData.costTime;
var __VLS_75;
const __VLS_76 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(
  __VLS_76,
  new __VLS_76({
    label: '创建时间',
  }),
);
const __VLS_78 = __VLS_77(
  {
    label: '创建时间',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_77),
);
__VLS_79.slots.default;
__VLS_ctx.formatDate(__VLS_ctx.detailData.createTime);
var __VLS_79;
const __VLS_80 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(
  __VLS_80,
  new __VLS_80({
    label: '操作参数',
    span: 2,
  }),
);
const __VLS_82 = __VLS_81(
  {
    label: '操作参数',
    span: 2,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_81),
);
__VLS_83.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.pre,
  __VLS_intrinsicElements.pre,
)({
  ...{ class: 'json-content' },
});
__VLS_ctx.formatJson(__VLS_ctx.detailData.operParam);
var __VLS_83;
const __VLS_84 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ // @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(
  __VLS_84,
  new __VLS_84({
    label: '返回结果',
    span: 2,
  }),
);
const __VLS_86 = __VLS_85(
  {
    label: '返回结果',
    span: 2,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_85),
);
__VLS_87.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.pre,
  __VLS_intrinsicElements.pre,
)({
  ...{ class: 'json-content' },
});
__VLS_ctx.formatJson(__VLS_ctx.detailData.jsonResult);
var __VLS_87;
var __VLS_15;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['page-container']} */ /** @type {__VLS_StyleScopedClasses['detail-title']} */ /** @type {__VLS_StyleScopedClasses['detail-card']} */ /** @type {__VLS_StyleScopedClasses['json-content']} */ /** @type {__VLS_StyleScopedClasses['json-content']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      detailData: detailData,
      getOperTypeTagType: getOperTypeTagType,
      formatDate: formatDate,
      formatJson: formatJson,
      handleBack: handleBack,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=OperlogDetail.vue.js.map
