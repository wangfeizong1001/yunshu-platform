import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh, View, Download, Check } from '@element-plus/icons-vue';
import { getGenConfig, saveGenConfig, syncTable, downloadCode } from '@/api/tool/gen.api';
import GenPreview from './GenPreview.vue';
const route = useRoute();
const router = useRouter();
const baseFormRef = ref();
const previewVisible = ref(false);
const activeTab = ref('basic');
const formData = reactive({
    tableName: '',
    tableComment: '',
    className: '',
    moduleName: '',
    packageName: 'com.yunshu.generator',
    author: '云枢',
    email: '',
    generateType: 'single',
    generateMenu: true,
    generateApi: true,
    generateView: true,
    generateTypeScript: true,
    businessName: '',
    functionName: ''
});
const options = reactive({
    generateController: true,
    generateService: true,
    generateMapper: true,
    generateEntity: true,
    generateSql: true,
    frontendFramework: 'vue3',
    uiFramework: 'element-plus',
    backendFramework: 'spring-boot'
});
const columns = ref([]);
const baseRules = {
    className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
    moduleName: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
    packageName: [{ required: true, message: '请输入包名称', trigger: 'blur' }],
    author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
    businessName: [{ required: true, message: '请输入业务名称', trigger: 'blur' }],
    functionName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }]
};
const formatClassName = (tableName) => {
    return tableName
        .replace(/^sys_|^biz_|^t_/, '')
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
};
const formatBusinessName = (tableName) => {
    return tableName
        .replace(/^sys_|^biz_|^t_/, '')
        .split('_')
        .join('-')
        .toLowerCase();
};
const loadConfig = async () => {
    const tableName = route.query.tableName;
    if (!tableName) {
        ElMessage.error('缺少表名称参数');
        return;
    }
    try {
        const res = await getGenConfig(tableName);
        if (res.success && res.data) {
            const { config, columns: colsData } = res.data;
            Object.assign(formData, config);
            columns.value = colsData.map((col) => ({
                ...col,
                isQuery: !!col.queryType,
                isDisplay: !col.isPK,
                isForm: !col.isPK
            }));
            if (!formData.className) {
                formData.className = formatClassName(tableName);
            }
            if (!formData.businessName) {
                formData.businessName = formatBusinessName(tableName);
            }
            if (!formData.functionName) {
                formData.functionName = formData.tableComment || formData.className + '管理';
            }
        }
    }
    catch {
        ElMessage.error('获取配置失败');
    }
};
const handleSave = async () => {
    try {
        await baseFormRef.value?.validate();
        await saveGenConfig({
            ...formData,
            columns: columns.value.map(col => ({
                ...col,
                queryType: col.isQuery ? col.queryType : undefined
            }))
        });
        ElMessage.success('保存成功');
    }
    catch (err) {
        if (!String(err?.message)?.includes('cancel')) {
            console.error('[GenConfig] handleSave failed:', err);
            ElMessage.error('保存失败，请重试');
        }
    }
};
const handleSyncTable = async () => {
    try {
        await ElMessageBox.confirm('同步字段将覆盖当前字段配置，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        const res = await syncTable(formData.tableName);
        if (res.success && res.data) {
            columns.value = res.data.map((col) => ({
                ...col,
                isQuery: !!col.queryType,
                isDisplay: !col.isPK,
                isForm: !col.isPK
            }));
            ElMessage.success('同步成功');
        }
    }
    catch (err) {
        if (!String(err?.message)?.includes('cancel')) {
            console.error('[GenConfig] handleSyncTable failed:', err);
            ElMessage.error('同步字段失败，请重试');
        }
    }
};
const toggleAllQuery = () => {
    const allSelected = columns.value.every(col => col.isQuery);
    columns.value.forEach(col => {
        if (!col.isPK) {
            col.isQuery = !allSelected;
        }
    });
};
const toggleAllDisplay = () => {
    const allSelected = columns.value.every((col) => col.isDisplay);
    columns.value.forEach((col) => {
        if (!col.isPK) {
            col.isDisplay = !allSelected;
            col.isForm = !allSelected;
        }
    });
};
const handlePreview = () => {
    previewVisible.value = true;
};
const handleGenerate = async () => {
    try {
        await handleSave();
        await downloadCode(formData.tableName, formData);
        ElMessage.success('代码已生成，正在下载...');
    }
    catch {
        ElMessage.error('生成失败');
    }
};
const handleBack = () => {
    router.back();
};
onMounted(() => {
    loadConfig();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-container" },
});
const __VLS_0 = {}.ElPageHeader;
/** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onBack': {} },
    content: "代码生成配置",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onBack': {} },
    content: "代码生成配置",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onBack: (__VLS_ctx.handleBack)
};
__VLS_3.slots.default;
{
    const { extra: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_8 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Check),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Check),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_11.slots.default;
    var __VLS_11;
}
var __VLS_3;
const __VLS_16 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "config-card" },
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "config-card" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "基本信息",
    name: "basic",
}));
const __VLS_26 = __VLS_25({
    label: "基本信息",
    name: "basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ref: "baseFormRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.baseRules),
    labelWidth: "120px",
}));
const __VLS_30 = __VLS_29({
    ref: "baseFormRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.baseRules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
/** @type {typeof __VLS_ctx.baseFormRef} */ ;
var __VLS_32 = {};
__VLS_31.slots.default;
const __VLS_34 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    gutter: (20),
}));
const __VLS_36 = __VLS_35({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
const __VLS_38 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    span: (12),
}));
const __VLS_40 = __VLS_39({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
const __VLS_42 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    label: "表名称",
}));
const __VLS_44 = __VLS_43({
    label: "表名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
const __VLS_46 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.formData.tableName),
    disabled: true,
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.formData.tableName),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
var __VLS_45;
var __VLS_41;
const __VLS_50 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    span: (12),
}));
const __VLS_52 = __VLS_51({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    label: "表描述",
    prop: "tableComment",
}));
const __VLS_56 = __VLS_55({
    label: "表描述",
    prop: "tableComment",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.formData.tableComment),
    placeholder: "请输入表描述",
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.formData.tableComment),
    placeholder: "请输入表描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
var __VLS_57;
var __VLS_53;
const __VLS_62 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    span: (12),
}));
const __VLS_64 = __VLS_63({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "实体类名称",
    prop: "className",
}));
const __VLS_68 = __VLS_67({
    label: "实体类名称",
    prop: "className",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.formData.className),
    placeholder: "请输入实体类名称",
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.formData.className),
    placeholder: "请输入实体类名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
var __VLS_69;
var __VLS_65;
const __VLS_74 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    span: (12),
}));
const __VLS_76 = __VLS_75({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    label: "模块名称",
    prop: "moduleName",
}));
const __VLS_80 = __VLS_79({
    label: "模块名称",
    prop: "moduleName",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.formData.moduleName),
    placeholder: "请输入模块名称",
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.formData.moduleName),
    placeholder: "请输入模块名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
var __VLS_81;
var __VLS_77;
const __VLS_86 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    span: (12),
}));
const __VLS_88 = __VLS_87({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "业务名称",
    prop: "businessName",
}));
const __VLS_92 = __VLS_91({
    label: "业务名称",
    prop: "businessName",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
const __VLS_94 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    modelValue: (__VLS_ctx.formData.businessName),
    placeholder: "请输入业务名称（用于URL路径）",
}));
const __VLS_96 = __VLS_95({
    modelValue: (__VLS_ctx.formData.businessName),
    placeholder: "请输入业务名称（用于URL路径）",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
var __VLS_93;
var __VLS_89;
const __VLS_98 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    span: (12),
}));
const __VLS_100 = __VLS_99({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
const __VLS_102 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "功能名称",
    prop: "functionName",
}));
const __VLS_104 = __VLS_103({
    label: "功能名称",
    prop: "functionName",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
const __VLS_106 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.formData.functionName),
    placeholder: "请输入功能名称",
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.formData.functionName),
    placeholder: "请输入功能名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_105;
var __VLS_101;
const __VLS_110 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    span: (12),
}));
const __VLS_112 = __VLS_111({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    label: "包名称",
    prop: "packageName",
}));
const __VLS_116 = __VLS_115({
    label: "包名称",
    prop: "packageName",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
__VLS_117.slots.default;
const __VLS_118 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.formData.packageName),
    placeholder: "请输入包名称",
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.formData.packageName),
    placeholder: "请输入包名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
var __VLS_117;
var __VLS_113;
const __VLS_122 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    span: (12),
}));
const __VLS_124 = __VLS_123({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "作者",
    prop: "author",
}));
const __VLS_128 = __VLS_127({
    label: "作者",
    prop: "author",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_129.slots.default;
const __VLS_130 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    modelValue: (__VLS_ctx.formData.author),
    placeholder: "请输入作者",
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.formData.author),
    placeholder: "请输入作者",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
var __VLS_129;
var __VLS_125;
const __VLS_134 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    span: (12),
}));
const __VLS_136 = __VLS_135({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "邮箱",
}));
const __VLS_140 = __VLS_139({
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
const __VLS_142 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
var __VLS_141;
var __VLS_137;
const __VLS_146 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    span: (12),
}));
const __VLS_148 = __VLS_147({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
const __VLS_150 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    label: "生成类型",
}));
const __VLS_152 = __VLS_151({
    label: "生成类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    modelValue: (__VLS_ctx.formData.generateType),
    ...{ style: {} },
}));
const __VLS_156 = __VLS_155({
    modelValue: (__VLS_ctx.formData.generateType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
__VLS_157.slots.default;
const __VLS_158 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    label: "单表生成",
    value: "single",
}));
const __VLS_160 = __VLS_159({
    label: "单表生成",
    value: "single",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const __VLS_162 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
    label: "树表生成",
    value: "tree",
}));
const __VLS_164 = __VLS_163({
    label: "树表生成",
    value: "tree",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
const __VLS_166 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    label: "主子表生成",
    value: "master-detail",
}));
const __VLS_168 = __VLS_167({
    label: "主子表生成",
    value: "master-detail",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
var __VLS_157;
var __VLS_153;
var __VLS_149;
if (__VLS_ctx.formData.generateType === 'tree') {
    const __VLS_170 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        span: (24),
    }));
    const __VLS_172 = __VLS_171({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    __VLS_173.slots.default;
    const __VLS_174 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        title: "树表配置",
        type: "info",
        showIcon: true,
        ...{ style: {} },
    }));
    const __VLS_176 = __VLS_175({
        title: "树表配置",
        type: "info",
        showIcon: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    const __VLS_178 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
        gutter: (20),
    }));
    const __VLS_180 = __VLS_179({
        gutter: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    __VLS_181.slots.default;
    const __VLS_182 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
        span: (8),
    }));
    const __VLS_184 = __VLS_183({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    __VLS_185.slots.default;
    const __VLS_186 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
        label: "树编码字段",
        prop: "treeCodeField",
    }));
    const __VLS_188 = __VLS_187({
        label: "树编码字段",
        prop: "treeCodeField",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    __VLS_189.slots.default;
    const __VLS_190 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
        modelValue: (__VLS_ctx.formData.treeCodeField),
        placeholder: "请选择",
        ...{ style: {} },
    }));
    const __VLS_192 = __VLS_191({
        modelValue: (__VLS_ctx.formData.treeCodeField),
        placeholder: "请选择",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    __VLS_193.slots.default;
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
        const __VLS_194 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }));
        const __VLS_196 = __VLS_195({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    }
    var __VLS_193;
    var __VLS_189;
    var __VLS_185;
    const __VLS_198 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
        span: (8),
    }));
    const __VLS_200 = __VLS_199({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_199));
    __VLS_201.slots.default;
    const __VLS_202 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
        label: "树父编码字段",
        prop: "treeParentCodeField",
    }));
    const __VLS_204 = __VLS_203({
        label: "树父编码字段",
        prop: "treeParentCodeField",
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    __VLS_205.slots.default;
    const __VLS_206 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
        modelValue: (__VLS_ctx.formData.treeParentCodeField),
        placeholder: "请选择",
        ...{ style: {} },
    }));
    const __VLS_208 = __VLS_207({
        modelValue: (__VLS_ctx.formData.treeParentCodeField),
        placeholder: "请选择",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    __VLS_209.slots.default;
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
        const __VLS_210 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }));
        const __VLS_212 = __VLS_211({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    }
    var __VLS_209;
    var __VLS_205;
    var __VLS_201;
    const __VLS_214 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
        span: (8),
    }));
    const __VLS_216 = __VLS_215({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    __VLS_217.slots.default;
    const __VLS_218 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
        label: "树名称字段",
        prop: "treeNameField",
    }));
    const __VLS_220 = __VLS_219({
        label: "树名称字段",
        prop: "treeNameField",
    }, ...__VLS_functionalComponentArgsRest(__VLS_219));
    __VLS_221.slots.default;
    const __VLS_222 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
        modelValue: (__VLS_ctx.formData.treeNameField),
        placeholder: "请选择",
        ...{ style: {} },
    }));
    const __VLS_224 = __VLS_223({
        modelValue: (__VLS_ctx.formData.treeNameField),
        placeholder: "请选择",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_223));
    __VLS_225.slots.default;
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
        const __VLS_226 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }));
        const __VLS_228 = __VLS_227({
            key: (col.columnName),
            label: (col.columnName),
            value: (col.columnName),
        }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    }
    var __VLS_225;
    var __VLS_221;
    var __VLS_217;
    var __VLS_181;
    var __VLS_173;
}
var __VLS_37;
var __VLS_31;
var __VLS_27;
const __VLS_230 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
    label: "生成选项",
    name: "options",
}));
const __VLS_232 = __VLS_231({
    label: "生成选项",
    name: "options",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
__VLS_233.slots.default;
const __VLS_234 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
    labelWidth: "120px",
}));
const __VLS_236 = __VLS_235({
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
__VLS_237.slots.default;
const __VLS_238 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
    gutter: (20),
}));
const __VLS_240 = __VLS_239({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
__VLS_241.slots.default;
const __VLS_242 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    span: (8),
}));
const __VLS_244 = __VLS_243({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
__VLS_245.slots.default;
const __VLS_246 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
    label: "生成菜单",
}));
const __VLS_248 = __VLS_247({
    label: "生成菜单",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
__VLS_249.slots.default;
const __VLS_250 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
    modelValue: (__VLS_ctx.formData.generateMenu),
}));
const __VLS_252 = __VLS_251({
    modelValue: (__VLS_ctx.formData.generateMenu),
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
var __VLS_249;
var __VLS_245;
const __VLS_254 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    span: (8),
}));
const __VLS_256 = __VLS_255({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
const __VLS_258 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    label: "生成控制器",
}));
const __VLS_260 = __VLS_259({
    label: "生成控制器",
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
__VLS_261.slots.default;
const __VLS_262 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
    modelValue: (__VLS_ctx.options.generateController),
}));
const __VLS_264 = __VLS_263({
    modelValue: (__VLS_ctx.options.generateController),
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
var __VLS_261;
var __VLS_257;
const __VLS_266 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
    span: (8),
}));
const __VLS_268 = __VLS_267({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
__VLS_269.slots.default;
const __VLS_270 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
    label: "生成 Service",
}));
const __VLS_272 = __VLS_271({
    label: "生成 Service",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_273.slots.default;
const __VLS_274 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
    modelValue: (__VLS_ctx.options.generateService),
}));
const __VLS_276 = __VLS_275({
    modelValue: (__VLS_ctx.options.generateService),
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
var __VLS_273;
var __VLS_269;
const __VLS_278 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
    span: (8),
}));
const __VLS_280 = __VLS_279({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
__VLS_281.slots.default;
const __VLS_282 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
    label: "生成 Mapper",
}));
const __VLS_284 = __VLS_283({
    label: "生成 Mapper",
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
__VLS_285.slots.default;
const __VLS_286 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
    modelValue: (__VLS_ctx.options.generateMapper),
}));
const __VLS_288 = __VLS_287({
    modelValue: (__VLS_ctx.options.generateMapper),
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
var __VLS_285;
var __VLS_281;
const __VLS_290 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    span: (8),
}));
const __VLS_292 = __VLS_291({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
__VLS_293.slots.default;
const __VLS_294 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    label: "生成实体类",
}));
const __VLS_296 = __VLS_295({
    label: "生成实体类",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
__VLS_297.slots.default;
const __VLS_298 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
    modelValue: (__VLS_ctx.options.generateEntity),
}));
const __VLS_300 = __VLS_299({
    modelValue: (__VLS_ctx.options.generateEntity),
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
var __VLS_297;
var __VLS_293;
const __VLS_302 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
    span: (8),
}));
const __VLS_304 = __VLS_303({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
__VLS_305.slots.default;
const __VLS_306 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
    label: "生成前端 API",
}));
const __VLS_308 = __VLS_307({
    label: "生成前端 API",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_309.slots.default;
const __VLS_310 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    modelValue: (__VLS_ctx.formData.generateApi),
}));
const __VLS_312 = __VLS_311({
    modelValue: (__VLS_ctx.formData.generateApi),
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
var __VLS_309;
var __VLS_305;
const __VLS_314 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    span: (8),
}));
const __VLS_316 = __VLS_315({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
__VLS_317.slots.default;
const __VLS_318 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    label: "生成前端页面",
}));
const __VLS_320 = __VLS_319({
    label: "生成前端页面",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
const __VLS_322 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    modelValue: (__VLS_ctx.formData.generateView),
}));
const __VLS_324 = __VLS_323({
    modelValue: (__VLS_ctx.formData.generateView),
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
var __VLS_321;
var __VLS_317;
const __VLS_326 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    span: (8),
}));
const __VLS_328 = __VLS_327({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_329.slots.default;
const __VLS_330 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
    label: "生成 TypeScript",
}));
const __VLS_332 = __VLS_331({
    label: "生成 TypeScript",
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
__VLS_333.slots.default;
const __VLS_334 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
    modelValue: (__VLS_ctx.formData.generateTypeScript),
}));
const __VLS_336 = __VLS_335({
    modelValue: (__VLS_ctx.formData.generateTypeScript),
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
var __VLS_333;
var __VLS_329;
const __VLS_338 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
    span: (8),
}));
const __VLS_340 = __VLS_339({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
__VLS_341.slots.default;
const __VLS_342 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
    label: "生成 SQL",
}));
const __VLS_344 = __VLS_343({
    label: "生成 SQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
__VLS_345.slots.default;
const __VLS_346 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent(__VLS_346, new __VLS_346({
    modelValue: (__VLS_ctx.options.generateSql),
}));
const __VLS_348 = __VLS_347({
    modelValue: (__VLS_ctx.options.generateSql),
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
var __VLS_345;
var __VLS_341;
var __VLS_241;
var __VLS_237;
const __VLS_350 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
    contentPosition: "left",
}));
const __VLS_352 = __VLS_351({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
__VLS_353.slots.default;
var __VLS_353;
const __VLS_354 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
    labelWidth: "120px",
}));
const __VLS_356 = __VLS_355({
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
__VLS_357.slots.default;
const __VLS_358 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
    gutter: (20),
}));
const __VLS_360 = __VLS_359({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_359));
__VLS_361.slots.default;
const __VLS_362 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
    span: (8),
}));
const __VLS_364 = __VLS_363({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_363));
__VLS_365.slots.default;
const __VLS_366 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
    label: "前端框架",
}));
const __VLS_368 = __VLS_367({
    label: "前端框架",
}, ...__VLS_functionalComponentArgsRest(__VLS_367));
__VLS_369.slots.default;
const __VLS_370 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({
    modelValue: (__VLS_ctx.options.frontendFramework),
    ...{ style: {} },
}));
const __VLS_372 = __VLS_371({
    modelValue: (__VLS_ctx.options.frontendFramework),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_371));
__VLS_373.slots.default;
const __VLS_374 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
    label: "Vue 3",
    value: "vue3",
}));
const __VLS_376 = __VLS_375({
    label: "Vue 3",
    value: "vue3",
}, ...__VLS_functionalComponentArgsRest(__VLS_375));
const __VLS_378 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({
    label: "Vue 2",
    value: "vue2",
}));
const __VLS_380 = __VLS_379({
    label: "Vue 2",
    value: "vue2",
}, ...__VLS_functionalComponentArgsRest(__VLS_379));
const __VLS_382 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
    label: "React",
    value: "react",
}));
const __VLS_384 = __VLS_383({
    label: "React",
    value: "react",
}, ...__VLS_functionalComponentArgsRest(__VLS_383));
var __VLS_373;
var __VLS_369;
var __VLS_365;
const __VLS_386 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({
    span: (8),
}));
const __VLS_388 = __VLS_387({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_387));
__VLS_389.slots.default;
const __VLS_390 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
    label: "UI 组件库",
}));
const __VLS_392 = __VLS_391({
    label: "UI 组件库",
}, ...__VLS_functionalComponentArgsRest(__VLS_391));
__VLS_393.slots.default;
const __VLS_394 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
    modelValue: (__VLS_ctx.options.uiFramework),
    ...{ style: {} },
}));
const __VLS_396 = __VLS_395({
    modelValue: (__VLS_ctx.options.uiFramework),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_395));
__VLS_397.slots.default;
const __VLS_398 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
    label: "Element Plus",
    value: "element-plus",
}));
const __VLS_400 = __VLS_399({
    label: "Element Plus",
    value: "element-plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_399));
const __VLS_402 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
    label: "Element UI",
    value: "element-ui",
}));
const __VLS_404 = __VLS_403({
    label: "Element UI",
    value: "element-ui",
}, ...__VLS_functionalComponentArgsRest(__VLS_403));
const __VLS_406 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
    label: "Ant Design Vue",
    value: "antd",
}));
const __VLS_408 = __VLS_407({
    label: "Ant Design Vue",
    value: "antd",
}, ...__VLS_functionalComponentArgsRest(__VLS_407));
var __VLS_397;
var __VLS_393;
var __VLS_389;
const __VLS_410 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
    span: (8),
}));
const __VLS_412 = __VLS_411({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_411));
__VLS_413.slots.default;
const __VLS_414 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
    label: "后端框架",
}));
const __VLS_416 = __VLS_415({
    label: "后端框架",
}, ...__VLS_functionalComponentArgsRest(__VLS_415));
__VLS_417.slots.default;
const __VLS_418 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
    modelValue: (__VLS_ctx.options.backendFramework),
    ...{ style: {} },
}));
const __VLS_420 = __VLS_419({
    modelValue: (__VLS_ctx.options.backendFramework),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_419));
__VLS_421.slots.default;
const __VLS_422 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
    label: "Spring Boot",
    value: "spring-boot",
}));
const __VLS_424 = __VLS_423({
    label: "Spring Boot",
    value: "spring-boot",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
const __VLS_426 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
    label: "Node.js",
    value: "nodejs",
}));
const __VLS_428 = __VLS_427({
    label: "Node.js",
    value: "nodejs",
}, ...__VLS_functionalComponentArgsRest(__VLS_427));
const __VLS_430 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
    label: "Go",
    value: "go",
}));
const __VLS_432 = __VLS_431({
    label: "Go",
    value: "go",
}, ...__VLS_functionalComponentArgsRest(__VLS_431));
var __VLS_421;
var __VLS_417;
var __VLS_413;
var __VLS_361;
var __VLS_357;
var __VLS_233;
const __VLS_434 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({
    label: "字段信息",
    name: "columns",
}));
const __VLS_436 = __VLS_435({
    label: "字段信息",
    name: "columns",
}, ...__VLS_functionalComponentArgsRest(__VLS_435));
__VLS_437.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_438 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_440 = __VLS_439({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_439));
let __VLS_442;
let __VLS_443;
let __VLS_444;
const __VLS_445 = {
    onClick: (__VLS_ctx.handleSyncTable)
};
__VLS_441.slots.default;
var __VLS_441;
const __VLS_446 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_447 = __VLS_asFunctionalComponent(__VLS_446, new __VLS_446({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_448 = __VLS_447({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_447));
let __VLS_450;
let __VLS_451;
let __VLS_452;
const __VLS_453 = {
    onClick: (__VLS_ctx.toggleAllQuery)
};
__VLS_449.slots.default;
var __VLS_449;
const __VLS_454 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_456 = __VLS_455({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_455));
let __VLS_458;
let __VLS_459;
let __VLS_460;
const __VLS_461 = {
    onClick: (__VLS_ctx.toggleAllDisplay)
};
__VLS_457.slots.default;
var __VLS_457;
const __VLS_462 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
    data: (__VLS_ctx.columns),
    border: true,
    stripe: true,
    maxHeight: "500",
}));
const __VLS_464 = __VLS_463({
    data: (__VLS_ctx.columns),
    border: true,
    stripe: true,
    maxHeight: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_463));
__VLS_465.slots.default;
const __VLS_466 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
    label: "字段名称",
    prop: "columnName",
    width: "150",
    align: "center",
    fixed: true,
}));
const __VLS_468 = __VLS_467({
    label: "字段名称",
    prop: "columnName",
    width: "150",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_467));
const __VLS_470 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
    label: "字段描述",
    minWidth: "140",
    align: "center",
}));
const __VLS_472 = __VLS_471({
    label: "字段描述",
    minWidth: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_471));
__VLS_473.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_473.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_474 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
        modelValue: (row.columnComment),
        size: "small",
        placeholder: "字段描述",
    }));
    const __VLS_476 = __VLS_475({
        modelValue: (row.columnComment),
        size: "small",
        placeholder: "字段描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_475));
}
var __VLS_473;
const __VLS_478 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({
    label: "数据类型",
    prop: "dataType",
    width: "100",
    align: "center",
}));
const __VLS_480 = __VLS_479({
    label: "数据类型",
    prop: "dataType",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_479));
const __VLS_482 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({
    label: "Java 类型",
    width: "130",
    align: "center",
}));
const __VLS_484 = __VLS_483({
    label: "Java 类型",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_483));
__VLS_485.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_485.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_486 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
        modelValue: (row.javaType),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_488 = __VLS_487({
        modelValue: (row.javaType),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_487));
    __VLS_489.slots.default;
    const __VLS_490 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
        label: "String",
        value: "String",
    }));
    const __VLS_492 = __VLS_491({
        label: "String",
        value: "String",
    }, ...__VLS_functionalComponentArgsRest(__VLS_491));
    const __VLS_494 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
        label: "Integer",
        value: "Integer",
    }));
    const __VLS_496 = __VLS_495({
        label: "Integer",
        value: "Integer",
    }, ...__VLS_functionalComponentArgsRest(__VLS_495));
    const __VLS_498 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
        label: "Long",
        value: "Long",
    }));
    const __VLS_500 = __VLS_499({
        label: "Long",
        value: "Long",
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    const __VLS_502 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        label: "Double",
        value: "Double",
    }));
    const __VLS_504 = __VLS_503({
        label: "Double",
        value: "Double",
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    const __VLS_506 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
        label: "BigDecimal",
        value: "BigDecimal",
    }));
    const __VLS_508 = __VLS_507({
        label: "BigDecimal",
        value: "BigDecimal",
    }, ...__VLS_functionalComponentArgsRest(__VLS_507));
    const __VLS_510 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({
        label: "Boolean",
        value: "Boolean",
    }));
    const __VLS_512 = __VLS_511({
        label: "Boolean",
        value: "Boolean",
    }, ...__VLS_functionalComponentArgsRest(__VLS_511));
    const __VLS_514 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
        label: "Date",
        value: "Date",
    }));
    const __VLS_516 = __VLS_515({
        label: "Date",
        value: "Date",
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    const __VLS_518 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
        label: "LocalDateTime",
        value: "LocalDateTime",
    }));
    const __VLS_520 = __VLS_519({
        label: "LocalDateTime",
        value: "LocalDateTime",
    }, ...__VLS_functionalComponentArgsRest(__VLS_519));
    const __VLS_522 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        label: "LocalDate",
        value: "LocalDate",
    }));
    const __VLS_524 = __VLS_523({
        label: "LocalDate",
        value: "LocalDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    var __VLS_489;
}
var __VLS_485;
const __VLS_526 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
    label: "Java 字段名",
    width: "140",
    align: "center",
}));
const __VLS_528 = __VLS_527({
    label: "Java 字段名",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_527));
__VLS_529.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_529.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_530 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({
        modelValue: (row.javaField),
        size: "small",
        placeholder: "Java 字段名",
    }));
    const __VLS_532 = __VLS_531({
        modelValue: (row.javaField),
        size: "small",
        placeholder: "Java 字段名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_531));
}
var __VLS_529;
const __VLS_534 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
    label: "主键",
    prop: "isPK",
    width: "70",
    align: "center",
}));
const __VLS_536 = __VLS_535({
    label: "主键",
    prop: "isPK",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_535));
__VLS_537.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_537.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.isPK) {
        const __VLS_538 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
            type: "danger",
            size: "small",
        }));
        const __VLS_540 = __VLS_539({
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_539));
        __VLS_541.slots.default;
        var __VLS_541;
    }
}
var __VLS_537;
const __VLS_542 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
    label: "必填",
    width: "70",
    align: "center",
}));
const __VLS_544 = __VLS_543({
    label: "必填",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_543));
__VLS_545.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_545.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_546 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
        type: (row.isNullable === 'NO' ? 'warning' : 'success'),
        size: "small",
    }));
    const __VLS_548 = __VLS_547({
        type: (row.isNullable === 'NO' ? 'warning' : 'success'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    __VLS_549.slots.default;
    (row.isNullable === 'NO' ? '是' : '否');
    var __VLS_549;
}
var __VLS_545;
const __VLS_550 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
    label: "查询",
    width: "70",
    align: "center",
}));
const __VLS_552 = __VLS_551({
    label: "查询",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_551));
__VLS_553.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_553.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_554 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
        modelValue: (row.isQuery),
        size: "small",
    }));
    const __VLS_556 = __VLS_555({
        modelValue: (row.isQuery),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
}
var __VLS_553;
const __VLS_558 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
    label: "查询方式",
    width: "110",
    align: "center",
}));
const __VLS_560 = __VLS_559({
    label: "查询方式",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_559));
__VLS_561.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_561.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_562 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
        modelValue: (row.queryType),
        size: "small",
        ...{ style: {} },
        disabled: (!row.isQuery),
    }));
    const __VLS_564 = __VLS_563({
        modelValue: (row.queryType),
        size: "small",
        ...{ style: {} },
        disabled: (!row.isQuery),
    }, ...__VLS_functionalComponentArgsRest(__VLS_563));
    __VLS_565.slots.default;
    const __VLS_566 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
        label: "=",
        value: "eq",
    }));
    const __VLS_568 = __VLS_567({
        label: "=",
        value: "eq",
    }, ...__VLS_functionalComponentArgsRest(__VLS_567));
    const __VLS_570 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
        label: "!=",
        value: "ne",
    }));
    const __VLS_572 = __VLS_571({
        label: "!=",
        value: "ne",
    }, ...__VLS_functionalComponentArgsRest(__VLS_571));
    const __VLS_574 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
        label: "LIKE",
        value: "like",
    }));
    const __VLS_576 = __VLS_575({
        label: "LIKE",
        value: "like",
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    const __VLS_578 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
        label: ">",
        value: "gt",
    }));
    const __VLS_580 = __VLS_579({
        label: ">",
        value: "gt",
    }, ...__VLS_functionalComponentArgsRest(__VLS_579));
    const __VLS_582 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_583 = __VLS_asFunctionalComponent(__VLS_582, new __VLS_582({
        label: "<",
        value: "lt",
    }));
    const __VLS_584 = __VLS_583({
        label: "<",
        value: "lt",
    }, ...__VLS_functionalComponentArgsRest(__VLS_583));
    const __VLS_586 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_587 = __VLS_asFunctionalComponent(__VLS_586, new __VLS_586({
        label: "BETWEEN",
        value: "between",
    }));
    const __VLS_588 = __VLS_587({
        label: "BETWEEN",
        value: "between",
    }, ...__VLS_functionalComponentArgsRest(__VLS_587));
    var __VLS_565;
}
var __VLS_561;
const __VLS_590 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
    label: "列表显示",
    width: "90",
    align: "center",
}));
const __VLS_592 = __VLS_591({
    label: "列表显示",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_591));
__VLS_593.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_593.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_594 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_595 = __VLS_asFunctionalComponent(__VLS_594, new __VLS_594({
        modelValue: (row.isDisplay),
        size: "small",
    }));
    const __VLS_596 = __VLS_595({
        modelValue: (row.isDisplay),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_595));
}
var __VLS_593;
const __VLS_598 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_599 = __VLS_asFunctionalComponent(__VLS_598, new __VLS_598({
    label: "表单显示",
    width: "90",
    align: "center",
}));
const __VLS_600 = __VLS_599({
    label: "表单显示",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_599));
__VLS_601.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_601.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_602 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({
        modelValue: (row.isForm),
        size: "small",
    }));
    const __VLS_604 = __VLS_603({
        modelValue: (row.isForm),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_603));
}
var __VLS_601;
const __VLS_606 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_607 = __VLS_asFunctionalComponent(__VLS_606, new __VLS_606({
    label: "显示类型",
    width: "120",
    align: "center",
}));
const __VLS_608 = __VLS_607({
    label: "显示类型",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_607));
__VLS_609.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_609.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_610 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_611 = __VLS_asFunctionalComponent(__VLS_610, new __VLS_610({
        modelValue: (row.displayType),
        size: "small",
        ...{ style: {} },
        disabled: (!row.isDisplay && !row.isForm),
    }));
    const __VLS_612 = __VLS_611({
        modelValue: (row.displayType),
        size: "small",
        ...{ style: {} },
        disabled: (!row.isDisplay && !row.isForm),
    }, ...__VLS_functionalComponentArgsRest(__VLS_611));
    __VLS_613.slots.default;
    const __VLS_614 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
        label: "文本框",
        value: "input",
    }));
    const __VLS_616 = __VLS_615({
        label: "文本框",
        value: "input",
    }, ...__VLS_functionalComponentArgsRest(__VLS_615));
    const __VLS_618 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({
        label: "下拉框",
        value: "select",
    }));
    const __VLS_620 = __VLS_619({
        label: "下拉框",
        value: "select",
    }, ...__VLS_functionalComponentArgsRest(__VLS_619));
    const __VLS_622 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_623 = __VLS_asFunctionalComponent(__VLS_622, new __VLS_622({
        label: "单选框",
        value: "radio",
    }));
    const __VLS_624 = __VLS_623({
        label: "单选框",
        value: "radio",
    }, ...__VLS_functionalComponentArgsRest(__VLS_623));
    const __VLS_626 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
        label: "复选框",
        value: "checkbox",
    }));
    const __VLS_628 = __VLS_627({
        label: "复选框",
        value: "checkbox",
    }, ...__VLS_functionalComponentArgsRest(__VLS_627));
    const __VLS_630 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_631 = __VLS_asFunctionalComponent(__VLS_630, new __VLS_630({
        label: "日期",
        value: "date",
    }));
    const __VLS_632 = __VLS_631({
        label: "日期",
        value: "date",
    }, ...__VLS_functionalComponentArgsRest(__VLS_631));
    const __VLS_634 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_635 = __VLS_asFunctionalComponent(__VLS_634, new __VLS_634({
        label: "日期时间",
        value: "datetime",
    }));
    const __VLS_636 = __VLS_635({
        label: "日期时间",
        value: "datetime",
    }, ...__VLS_functionalComponentArgsRest(__VLS_635));
    const __VLS_638 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
        label: "时间",
        value: "time",
    }));
    const __VLS_640 = __VLS_639({
        label: "时间",
        value: "time",
    }, ...__VLS_functionalComponentArgsRest(__VLS_639));
    const __VLS_642 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_643 = __VLS_asFunctionalComponent(__VLS_642, new __VLS_642({
        label: "文本域",
        value: "textarea",
    }));
    const __VLS_644 = __VLS_643({
        label: "文本域",
        value: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_643));
    const __VLS_646 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_647 = __VLS_asFunctionalComponent(__VLS_646, new __VLS_646({
        label: "富文本",
        value: "editor",
    }));
    const __VLS_648 = __VLS_647({
        label: "富文本",
        value: "editor",
    }, ...__VLS_functionalComponentArgsRest(__VLS_647));
    const __VLS_650 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_651 = __VLS_asFunctionalComponent(__VLS_650, new __VLS_650({
        label: "图片上传",
        value: "image",
    }));
    const __VLS_652 = __VLS_651({
        label: "图片上传",
        value: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_651));
    const __VLS_654 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_655 = __VLS_asFunctionalComponent(__VLS_654, new __VLS_654({
        label: "文件上传",
        value: "file",
    }));
    const __VLS_656 = __VLS_655({
        label: "文件上传",
        value: "file",
    }, ...__VLS_functionalComponentArgsRest(__VLS_655));
    var __VLS_613;
}
var __VLS_609;
const __VLS_658 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_659 = __VLS_asFunctionalComponent(__VLS_658, new __VLS_658({
    label: "字典类型",
    width: "130",
    align: "center",
}));
const __VLS_660 = __VLS_659({
    label: "字典类型",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_659));
__VLS_661.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_661.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_662 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_663 = __VLS_asFunctionalComponent(__VLS_662, new __VLS_662({
        modelValue: (row.dictType),
        size: "small",
        placeholder: "字典类型",
    }));
    const __VLS_664 = __VLS_663({
        modelValue: (row.dictType),
        size: "small",
        placeholder: "字典类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_663));
}
var __VLS_661;
if (__VLS_ctx.columns.some(c => c.isPK)) {
    const __VLS_666 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_667 = __VLS_asFunctionalComponent(__VLS_666, new __VLS_666({
        label: "主键策略",
        width: "100",
        align: "center",
    }));
    const __VLS_668 = __VLS_667({
        label: "主键策略",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_667));
    __VLS_669.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_669.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_670 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_671 = __VLS_asFunctionalComponent(__VLS_670, new __VLS_670({
            modelValue: (row.idType),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_672 = __VLS_671({
            modelValue: (row.idType),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_671));
        __VLS_673.slots.default;
        const __VLS_674 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_675 = __VLS_asFunctionalComponent(__VLS_674, new __VLS_674({
            label: "自增",
            value: "AUTO",
        }));
        const __VLS_676 = __VLS_675({
            label: "自增",
            value: "AUTO",
        }, ...__VLS_functionalComponentArgsRest(__VLS_675));
        const __VLS_678 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_679 = __VLS_asFunctionalComponent(__VLS_678, new __VLS_678({
            label: "UUID",
            value: "UUID",
        }));
        const __VLS_680 = __VLS_679({
            label: "UUID",
            value: "UUID",
        }, ...__VLS_functionalComponentArgsRest(__VLS_679));
        const __VLS_682 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({
            label: "输入",
            value: "INPUT",
        }));
        const __VLS_684 = __VLS_683({
            label: "输入",
            value: "INPUT",
        }, ...__VLS_functionalComponentArgsRest(__VLS_683));
        const __VLS_686 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_687 = __VLS_asFunctionalComponent(__VLS_686, new __VLS_686({
            label: "无",
            value: "NONE",
        }));
        const __VLS_688 = __VLS_687({
            label: "无",
            value: "NONE",
        }, ...__VLS_functionalComponentArgsRest(__VLS_687));
        var __VLS_673;
    }
    var __VLS_669;
}
var __VLS_465;
var __VLS_437;
var __VLS_23;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-bar" },
});
const __VLS_690 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_691 = __VLS_asFunctionalComponent(__VLS_690, new __VLS_690({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.View),
}));
const __VLS_692 = __VLS_691({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.View),
}, ...__VLS_functionalComponentArgsRest(__VLS_691));
let __VLS_694;
let __VLS_695;
let __VLS_696;
const __VLS_697 = {
    onClick: (__VLS_ctx.handlePreview)
};
__VLS_693.slots.default;
var __VLS_693;
const __VLS_698 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_699 = __VLS_asFunctionalComponent(__VLS_698, new __VLS_698({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}));
const __VLS_700 = __VLS_699({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.Download),
}, ...__VLS_functionalComponentArgsRest(__VLS_699));
let __VLS_702;
let __VLS_703;
let __VLS_704;
const __VLS_705 = {
    onClick: (__VLS_ctx.handleGenerate)
};
__VLS_701.slots.default;
var __VLS_701;
const __VLS_706 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_707 = __VLS_asFunctionalComponent(__VLS_706, new __VLS_706({
    ...{ 'onClick': {} },
}));
const __VLS_708 = __VLS_707({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_707));
let __VLS_710;
let __VLS_711;
let __VLS_712;
const __VLS_713 = {
    onClick: (__VLS_ctx.handleBack)
};
__VLS_709.slots.default;
var __VLS_709;
/** @type {[typeof GenPreview, ]} */ ;
// @ts-ignore
const __VLS_714 = __VLS_asFunctionalComponent(GenPreview, new GenPreview({
    modelValue: (__VLS_ctx.previewVisible),
    tableName: (__VLS_ctx.formData.tableName),
    config: (__VLS_ctx.formData),
}));
const __VLS_715 = __VLS_714({
    modelValue: (__VLS_ctx.previewVisible),
    tableName: (__VLS_ctx.formData.tableName),
    config: (__VLS_ctx.formData),
}, ...__VLS_functionalComponentArgsRest(__VLS_714));
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
/** @type {__VLS_StyleScopedClasses['config-card']} */ ;
/** @type {__VLS_StyleScopedClasses['action-bar']} */ ;
// @ts-ignore
var __VLS_33 = __VLS_32;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Refresh: Refresh,
            View: View,
            Download: Download,
            Check: Check,
            GenPreview: GenPreview,
            baseFormRef: baseFormRef,
            previewVisible: previewVisible,
            activeTab: activeTab,
            formData: formData,
            options: options,
            columns: columns,
            baseRules: baseRules,
            handleSave: handleSave,
            handleSyncTable: handleSyncTable,
            toggleAllQuery: toggleAllQuery,
            toggleAllDisplay: toggleAllDisplay,
            handlePreview: handlePreview,
            handleGenerate: handleGenerate,
            handleBack: handleBack,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=GenConfig.vue.js.map