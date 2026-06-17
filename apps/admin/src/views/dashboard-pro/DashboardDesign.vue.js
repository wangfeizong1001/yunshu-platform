/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 大屏设计器主组件
 * 实现组件拖拽、调整大小、数据源配置、保存持久化等功能
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshLeft, Check, Delete, Box, TrendCharts, DataLine, PieChart, Grid, Monitor, Document, Picture, } from '@element-plus/icons-vue';
import DashboardPreview from './DashboardPreview.vue';
import { LineChartWidget, BarChartWidget, PieChartWidget, RingChartWidget, AreaChartWidget, GaugeWidget, TableWidget, TextWidget, ImageWidget, } from '@/components/dashboard-widgets';
import { getDashboardTemplates, saveDashboard, updateDashboard, } from '@/api/admin-dashboard.api';
// 状态变量
const dashboardName = ref('新增大屏');
const selectedTemplateId = ref('');
const selectedWidgetIndex = ref(null);
const previewVisible = ref(false);
const saveDialogVisible = ref(false);
const saveDashboardName = ref('');
const saveDashboardDesc = ref('');
const currentDashboardId = ref(null);
const canvasRef = ref(null);
// 模板列表
const templates = ref([]);
// 组件类型列表
const widgetTypes = [
    { type: 'line', name: '折线图', icon: TrendCharts },
    { type: 'bar', name: '柱状图', icon: DataLine },
    { type: 'pie', name: '饼图', icon: PieChart },
    { type: 'ring', name: '环形图', icon: PieChart },
    { type: 'area', name: '面积图', icon: TrendCharts },
    { type: 'gauge', name: '仪表盘', icon: Monitor },
    { type: 'table', name: '数据表格', icon: Grid },
    { type: 'text', name: '文本', icon: Document },
    { type: 'image', name: '图片', icon: Picture },
];
// 画布上的组件列表
const canvasWidgets = ref([]);
// 当前选中的组件
const selectedWidget = computed(() => {
    if (selectedWidgetIndex.value !== null) {
        return canvasWidgets.value[selectedWidgetIndex.value];
    }
    return null;
});
// 拖拽状态
const dragState = ref({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidgetX: 0,
    startWidgetY: 0,
    startWidth: 0,
    startHeight: 0,
    resizeDirection: '',
    widgetIndex: -1,
});
// 获取组件样式
const getWidgetStyle = (widget) => {
    return {
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: `${widget.width}px`,
        height: `${widget.height}px`,
        backgroundColor: widget.backgroundColor || 'rgba(0, 102, 255, 0.1)',
        borderColor: widget.borderColor || '#00d4ff',
    };
};
// 获取组件渲染器
const getWidgetComponent = (type) => {
    const componentMap = {
        line: LineChartWidget,
        bar: BarChartWidget,
        pie: PieChartWidget,
        ring: RingChartWidget,
        area: AreaChartWidget,
        gauge: GaugeWidget,
        table: TableWidget,
        text: TextWidget,
        image: ImageWidget,
    };
    return componentMap[type] || 'div';
};
// 创建新组件的默认配置
const createDefaultWidgetConfig = (type) => {
    const baseConfig = {
        title: widgetTypes.find(w => w.type === type)?.name || type,
        dataSource: {
            type: 'mock',
            url: '',
            method: 'GET',
        },
    };
    switch (type) {
        case 'text':
            return {
                ...baseConfig,
                content: '文本内容',
                fontSize: 16,
                fontColor: '#00d4ff',
                textAlign: 'center',
            };
        case 'image':
            return {
                ...baseConfig,
                imageUrl: '',
                fit: 'contain',
            };
        case 'gauge':
            return {
                ...baseConfig,
                min: 0,
                max: 100,
            };
        default:
            return baseConfig;
    }
};
// 拖拽开始（从组件库）
const handleDragStart = (event, widget) => {
    event.dataTransfer?.setData('widgetType', widget.type);
    event.dataTransfer?.setData('widgetName', widget.name);
};
// 拖拽放置到画布
const handleDrop = (event) => {
    event.preventDefault();
    const widgetType = event.dataTransfer?.getData('widgetType');
    const widgetName = event.dataTransfer?.getData('widgetName');
    if (widgetType && widgetName && canvasRef.value) {
        const rect = canvasRef.value.getBoundingClientRect();
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
            config: createDefaultWidgetConfig(widgetType),
        };
        canvasWidgets.value.push(newWidget);
        selectedWidgetIndex.value = canvasWidgets.value.length - 1;
    }
};
// 点击画布空白区域取消选中
const handleCanvasClick = () => {
    selectedWidgetIndex.value = null;
};
// 组件鼠标按下（开始拖拽）
const handleWidgetMouseDown = (event, index) => {
    event.preventDefault();
    selectedWidgetIndex.value = index;
    const widget = canvasWidgets.value[index];
    dragState.value = {
        isDragging: true,
        isResizing: false,
        startX: event.clientX,
        startY: event.clientY,
        startWidgetX: widget.x,
        startWidgetY: widget.y,
        startWidth: widget.width,
        startHeight: widget.height,
        resizeDirection: '',
        widgetIndex: index,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};
// 调整大小开始
const handleResizeStart = (event, index, direction) => {
    event.preventDefault();
    selectedWidgetIndex.value = index;
    const widget = canvasWidgets.value[index];
    dragState.value = {
        isDragging: false,
        isResizing: true,
        startX: event.clientX,
        startY: event.clientY,
        startWidgetX: widget.x,
        startWidgetY: widget.y,
        startWidth: widget.width,
        startHeight: widget.height,
        resizeDirection: direction,
        widgetIndex: index,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};
// 鼠标移动处理
const handleMouseMove = (event) => {
    if (!dragState.value.isDragging && !dragState.value.isResizing)
        return;
    const deltaX = event.clientX - dragState.value.startX;
    const deltaY = event.clientY - dragState.value.startY;
    const widget = canvasWidgets.value[dragState.value.widgetIndex];
    if (dragState.value.isDragging) {
        // 拖拽移动
        widget.x = Math.max(0, dragState.value.startWidgetX + deltaX);
        widget.y = Math.max(0, dragState.value.startWidgetY + deltaY);
    }
    else if (dragState.value.isResizing) {
        // 调整大小
        const direction = dragState.value.resizeDirection;
        let newWidth = dragState.value.startWidth;
        let newHeight = dragState.value.startHeight;
        let newX = dragState.value.startWidgetX;
        let newY = dragState.value.startWidgetY;
        // 根据方向计算新尺寸和位置
        if (direction.includes('e')) {
            newWidth = Math.max(100, dragState.value.startWidth + deltaX);
        }
        if (direction.includes('w')) {
            const widthChange = Math.min(deltaX, dragState.value.startWidth - 100);
            newWidth = dragState.value.startWidth - widthChange;
            newX = dragState.value.startWidgetX + widthChange;
        }
        if (direction.includes('s')) {
            newHeight = Math.max(100, dragState.value.startHeight + deltaY);
        }
        if (direction.includes('n')) {
            const heightChange = Math.min(deltaY, dragState.value.startHeight - 100);
            newHeight = dragState.value.startHeight - heightChange;
            newY = dragState.value.startWidgetY + heightChange;
        }
        widget.width = newWidth;
        widget.height = newHeight;
        widget.x = Math.max(0, newX);
        widget.y = Math.max(0, newY);
    }
};
// 鼠标释放处理
const handleMouseUp = () => {
    dragState.value.isDragging = false;
    dragState.value.isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
};
// 选中组件
const selectWidget = (index) => {
    selectedWidgetIndex.value = index;
};
// 删除组件
const removeWidget = (index) => {
    canvasWidgets.value.splice(index, 1);
    if (selectedWidgetIndex.value === index) {
        selectedWidgetIndex.value = null;
    }
    else if (selectedWidgetIndex.value !== null && selectedWidgetIndex.value > index) {
        selectedWidgetIndex.value--;
    }
};
// 重置配置
const resetConfig = () => {
    canvasWidgets.value = [];
    selectedWidgetIndex.value = null;
    dashboardName.value = '新增大屏';
    currentDashboardId.value = null;
    selectedTemplateId.value = '';
    ElMessage.info('已重置');
};
// 预览
const preview = () => {
    previewVisible.value = true;
};
// 打开保存对话框
const openSaveDialog = () => {
    saveDashboardName.value = dashboardName.value;
    saveDashboardDesc.value = '';
    saveDialogVisible.value = true;
};
// 处理保存
const handleSave = async () => {
    if (!saveDashboardName.value) {
        ElMessage.warning('请输入大屏名称');
        return;
    }
    const dashboardData = {
        dashboardName: saveDashboardName.value,
        description: saveDashboardDesc.value,
        config: JSON.stringify(canvasWidgets.value),
        status: 'active',
    };
    try {
        if (currentDashboardId.value) {
            // 更新现有大屏
            await updateDashboard(currentDashboardId.value, dashboardData);
            ElMessage.success('更新成功！');
        }
        else {
            // 创建新大屏
            const result = await saveDashboard(dashboardData);
            if (result && result.dashboardId) {
                currentDashboardId.value = result.dashboardId;
            }
            ElMessage.success('保存成功！');
        }
        dashboardName.value = saveDashboardName.value;
        saveDialogVisible.value = false;
    }
    catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败，请重试');
    }
};
// 加载模板
const loadTemplate = async (templateId) => {
    if (!templateId) {
        resetConfig();
        return;
    }
    try {
        const template = templates.value.find(t => t.id === templateId);
        if (template && template.config) {
            const config = JSON.parse(template.config);
            canvasWidgets.value = config.widgets || [];
            dashboardName.value = template.name;
            ElMessage.success('模板加载成功');
        }
    }
    catch (error) {
        console.error('加载模板失败:', error);
        ElMessage.error('加载模板失败');
    }
};
// 加载模板列表
const loadTemplates = async () => {
    try {
        const result = await getDashboardTemplates();
        if (result && Array.isArray(result)) {
            templates.value = result.map((t) => ({
                id: String(t.id || ''),
                name: String(t.name || ''),
                config: String(t.config || ''),
            }));
        }
    }
    catch (error) {
        console.error('加载模板列表失败:', error);
        // 使用默认模板
        templates.value = [
            { id: 'enterprise', name: '企业运营监控', config: '' },
            { id: 'sales', name: '销售数据分析', config: '' },
        ];
    }
};
// 组件挂载
onMounted(() => {
    loadTemplates();
});
// 组件卸载时清理事件监听
onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-design" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-left" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dashboardName),
    placeholder: "大屏名称",
    ...{ class: "name-input" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dashboardName),
    placeholder: "大屏名称",
    ...{ class: "name-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTemplateId),
    placeholder: "选择模板",
    ...{ class: "template-select" },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTemplateId),
    placeholder: "选择模板",
    ...{ class: "template-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onChange: (__VLS_ctx.loadTemplate)
};
__VLS_7.slots.default;
const __VLS_12 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "自定义",
    value: "",
}));
const __VLS_14 = __VLS_13({
    label: "自定义",
    value: "",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    const __VLS_16 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        key: (template.id),
        label: (template.name),
        value: (template.id),
    }));
    const __VLS_18 = __VLS_17({
        key: (template.id),
        label: (template.name),
        value: (template.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-right" },
});
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshLeft),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshLeft),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (__VLS_ctx.resetConfig)
};
__VLS_23.slots.default;
var __VLS_23;
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (__VLS_ctx.preview)
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Check),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.openSaveDialog)
};
__VLS_39.slots.default;
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "widget-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "widget-list" },
});
for (const [widget] of __VLS_getVForSourceType((__VLS_ctx.widgetTypes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDragstart: (...[$event]) => {
                __VLS_ctx.handleDragStart($event, widget);
            } },
        key: (widget.type),
        ...{ class: "widget-item" },
        draggable: "true",
    });
    const __VLS_44 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: (24),
    }));
    const __VLS_46 = __VLS_45({
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = ((widget.icon));
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
    const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
    var __VLS_47;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (widget.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragover: () => { } },
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ onMousedown: (__VLS_ctx.handleCanvasClick) },
    ref: "canvasRef",
    ...{ class: "canvas" },
});
/** @type {typeof __VLS_ctx.canvasRef} */ ;
for (const [widget, index] of __VLS_getVForSourceType((__VLS_ctx.canvasWidgets))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onMousedown: (...[$event]) => {
                __VLS_ctx.handleWidgetMouseDown($event, index);
            } },
        key: (widget.id),
        ...{ class: "canvas-widget" },
        ...{ class: ({ selected: __VLS_ctx.selectedWidgetIndex === index }) },
        ...{ style: (__VLS_ctx.getWidgetStyle(widget)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "widget-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (widget.name);
    const __VLS_52 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        ...{ class: "delete-icon" },
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        ...{ class: "delete-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeWidget(index);
        }
    };
    __VLS_55.slots.default;
    const __VLS_60 = {}.Delete;
    /** @type {[typeof __VLS_components.Delete, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    var __VLS_55;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "widget-content" },
    });
    const __VLS_64 = ((__VLS_ctx.getWidgetComponent(widget.type)));
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        config: (widget.config),
    }));
    const __VLS_66 = __VLS_65({
        config: (widget.config),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    if (__VLS_ctx.selectedWidgetIndex === index) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'nw');
                } },
            ...{ class: "resize-handle nw" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'n');
                } },
            ...{ class: "resize-handle n" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'ne');
                } },
            ...{ class: "resize-handle ne" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'e');
                } },
            ...{ class: "resize-handle e" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'se');
                } },
            ...{ class: "resize-handle se" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 's');
                } },
            ...{ class: "resize-handle s" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'sw');
                } },
            ...{ class: "resize-handle sw" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(__VLS_ctx.selectedWidgetIndex === index))
                        return;
                    __VLS_ctx.handleResizeStart($event, index, 'w');
                } },
            ...{ class: "resize-handle w" },
        });
    }
}
if (__VLS_ctx.canvasWidgets.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-tip" },
    });
    const __VLS_68 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        size: (48),
    }));
    const __VLS_70 = __VLS_69({
        size: (48),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.Box;
    /** @type {[typeof __VLS_components.Box, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    var __VLS_71;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.selectedWidgetIndex !== null) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-panel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-form" },
    });
    const __VLS_76 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        labelWidth: "80px",
        size: "small",
    }));
    const __VLS_78 = __VLS_77({
        labelWidth: "80px",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "组件名称",
    }));
    const __VLS_82 = __VLS_81({
        label: "组件名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        modelValue: (__VLS_ctx.selectedWidget.name),
    }));
    const __VLS_86 = __VLS_85({
        modelValue: (__VLS_ctx.selectedWidget.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    var __VLS_83;
    const __VLS_88 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "宽度",
    }));
    const __VLS_90 = __VLS_89({
        label: "宽度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    const __VLS_92 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        modelValue: (__VLS_ctx.selectedWidget.width),
        min: (100),
        max: (800),
    }));
    const __VLS_94 = __VLS_93({
        modelValue: (__VLS_ctx.selectedWidget.width),
        min: (100),
        max: (800),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_91;
    const __VLS_96 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        label: "高度",
    }));
    const __VLS_98 = __VLS_97({
        label: "高度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.selectedWidget.height),
        min: (100),
        max: (600),
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (__VLS_ctx.selectedWidget.height),
        min: (100),
        max: (600),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_99;
    const __VLS_104 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "X坐标",
    }));
    const __VLS_106 = __VLS_105({
        label: "X坐标",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.selectedWidget.x),
        min: (0),
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.selectedWidget.x),
        min: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    var __VLS_107;
    const __VLS_112 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "Y坐标",
    }));
    const __VLS_114 = __VLS_113({
        label: "Y坐标",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        modelValue: (__VLS_ctx.selectedWidget.y),
        min: (0),
    }));
    const __VLS_118 = __VLS_117({
        modelValue: (__VLS_ctx.selectedWidget.y),
        min: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    var __VLS_115;
    const __VLS_120 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_124 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "背景色",
    }));
    const __VLS_126 = __VLS_125({
        label: "背景色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.ElColorPicker;
    /** @type {[typeof __VLS_components.ElColorPicker, typeof __VLS_components.elColorPicker, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.selectedWidget.backgroundColor),
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.selectedWidget.backgroundColor),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    var __VLS_127;
    const __VLS_132 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "边框颜色",
    }));
    const __VLS_134 = __VLS_133({
        label: "边框颜色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.ElColorPicker;
    /** @type {[typeof __VLS_components.ElColorPicker, typeof __VLS_components.elColorPicker, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        modelValue: (__VLS_ctx.selectedWidget.borderColor),
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (__VLS_ctx.selectedWidget.borderColor),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    var __VLS_135;
    const __VLS_140 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
    const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-source-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    const __VLS_144 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "数据类型",
    }));
    const __VLS_146 = __VLS_145({
        label: "数据类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        modelValue: (__VLS_ctx.selectedWidget.config.dataSource.type),
    }));
    const __VLS_150 = __VLS_149({
        modelValue: (__VLS_ctx.selectedWidget.config.dataSource.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "Mock数据",
        value: "mock",
    }));
    const __VLS_154 = __VLS_153({
        label: "Mock数据",
        value: "mock",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const __VLS_156 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "后端接口",
        value: "api",
    }));
    const __VLS_158 = __VLS_157({
        label: "后端接口",
        value: "api",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    var __VLS_151;
    var __VLS_147;
    if (__VLS_ctx.selectedWidget.config.dataSource.type === 'api') {
        const __VLS_160 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            label: "接口URL",
        }));
        const __VLS_162 = __VLS_161({
            label: "接口URL",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        __VLS_163.slots.default;
        const __VLS_164 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            modelValue: (__VLS_ctx.selectedWidget.config.dataSource.url),
            placeholder: "/api/data",
        }));
        const __VLS_166 = __VLS_165({
            modelValue: (__VLS_ctx.selectedWidget.config.dataSource.url),
            placeholder: "/api/data",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        var __VLS_163;
        const __VLS_168 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            label: "请求方法",
        }));
        const __VLS_170 = __VLS_169({
            label: "请求方法",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_171.slots.default;
        const __VLS_172 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            modelValue: (__VLS_ctx.selectedWidget.config.dataSource.method),
        }));
        const __VLS_174 = __VLS_173({
            modelValue: (__VLS_ctx.selectedWidget.config.dataSource.method),
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        __VLS_175.slots.default;
        const __VLS_176 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            label: "GET",
            value: "GET",
        }));
        const __VLS_178 = __VLS_177({
            label: "GET",
            value: "GET",
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        const __VLS_180 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            label: "POST",
            value: "POST",
        }));
        const __VLS_182 = __VLS_181({
            label: "POST",
            value: "POST",
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        var __VLS_175;
        var __VLS_171;
        if (['line', 'bar', 'area'].includes(__VLS_ctx.selectedWidget.type)) {
            const __VLS_184 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
                label: "X轴字段",
            }));
            const __VLS_186 = __VLS_185({
                label: "X轴字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
            __VLS_187.slots.default;
            const __VLS_188 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.xField),
                placeholder: "date",
            }));
            const __VLS_190 = __VLS_189({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.xField),
                placeholder: "date",
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            var __VLS_187;
            const __VLS_192 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
                label: "Y轴字段",
            }));
            const __VLS_194 = __VLS_193({
                label: "Y轴字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_193));
            __VLS_195.slots.default;
            const __VLS_196 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.yField),
                placeholder: "value",
            }));
            const __VLS_198 = __VLS_197({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.yField),
                placeholder: "value",
            }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            var __VLS_195;
            const __VLS_200 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                label: "系列字段",
            }));
            const __VLS_202 = __VLS_201({
                label: "系列字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_201));
            __VLS_203.slots.default;
            const __VLS_204 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.seriesField),
                placeholder: "category",
            }));
            const __VLS_206 = __VLS_205({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.seriesField),
                placeholder: "category",
            }, ...__VLS_functionalComponentArgsRest(__VLS_205));
            var __VLS_203;
        }
        if (['pie', 'ring'].includes(__VLS_ctx.selectedWidget.type)) {
            const __VLS_208 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                label: "名称字段",
            }));
            const __VLS_210 = __VLS_209({
                label: "名称字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_209));
            __VLS_211.slots.default;
            const __VLS_212 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.nameField),
                placeholder: "name",
            }));
            const __VLS_214 = __VLS_213({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.nameField),
                placeholder: "name",
            }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            var __VLS_211;
            const __VLS_216 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
                label: "值字段",
            }));
            const __VLS_218 = __VLS_217({
                label: "值字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_217));
            __VLS_219.slots.default;
            const __VLS_220 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.valueField),
                placeholder: "value",
            }));
            const __VLS_222 = __VLS_221({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.valueField),
                placeholder: "value",
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            var __VLS_219;
        }
        if (__VLS_ctx.selectedWidget.type === 'gauge') {
            const __VLS_224 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
                label: "值字段",
            }));
            const __VLS_226 = __VLS_225({
                label: "值字段",
            }, ...__VLS_functionalComponentArgsRest(__VLS_225));
            __VLS_227.slots.default;
            const __VLS_228 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.valueField),
                placeholder: "value",
            }));
            const __VLS_230 = __VLS_229({
                modelValue: (__VLS_ctx.selectedWidget.config.dataSource.valueField),
                placeholder: "value",
            }, ...__VLS_functionalComponentArgsRest(__VLS_229));
            var __VLS_227;
            const __VLS_232 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                label: "最小值",
            }));
            const __VLS_234 = __VLS_233({
                label: "最小值",
            }, ...__VLS_functionalComponentArgsRest(__VLS_233));
            __VLS_235.slots.default;
            const __VLS_236 = {}.ElInputNumber;
            /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
            // @ts-ignore
            const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
                modelValue: (__VLS_ctx.selectedWidget.config.min),
                min: (0),
            }));
            const __VLS_238 = __VLS_237({
                modelValue: (__VLS_ctx.selectedWidget.config.min),
                min: (0),
            }, ...__VLS_functionalComponentArgsRest(__VLS_237));
            var __VLS_235;
            const __VLS_240 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
                label: "最大值",
            }));
            const __VLS_242 = __VLS_241({
                label: "最大值",
            }, ...__VLS_functionalComponentArgsRest(__VLS_241));
            __VLS_243.slots.default;
            const __VLS_244 = {}.ElInputNumber;
            /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
            // @ts-ignore
            const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
                modelValue: (__VLS_ctx.selectedWidget.config.max),
                min: (1),
            }));
            const __VLS_246 = __VLS_245({
                modelValue: (__VLS_ctx.selectedWidget.config.max),
                min: (1),
            }, ...__VLS_functionalComponentArgsRest(__VLS_245));
            var __VLS_243;
        }
    }
    const __VLS_248 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({}));
    const __VLS_250 = __VLS_249({}, ...__VLS_functionalComponentArgsRest(__VLS_249));
    const __VLS_252 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        label: "图表标题",
    }));
    const __VLS_254 = __VLS_253({
        label: "图表标题",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    const __VLS_256 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        modelValue: (__VLS_ctx.selectedWidget.config.title),
    }));
    const __VLS_258 = __VLS_257({
        modelValue: (__VLS_ctx.selectedWidget.config.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    var __VLS_255;
    if (__VLS_ctx.selectedWidget.type === 'text') {
        const __VLS_260 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            label: "文本内容",
        }));
        const __VLS_262 = __VLS_261({
            label: "文本内容",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        __VLS_263.slots.default;
        const __VLS_264 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            type: "textarea",
            modelValue: (__VLS_ctx.selectedWidget.config.content),
            rows: (3),
        }));
        const __VLS_266 = __VLS_265({
            type: "textarea",
            modelValue: (__VLS_ctx.selectedWidget.config.content),
            rows: (3),
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        var __VLS_263;
        const __VLS_268 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            label: "字体大小",
        }));
        const __VLS_270 = __VLS_269({
            label: "字体大小",
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        __VLS_271.slots.default;
        const __VLS_272 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
            modelValue: (__VLS_ctx.selectedWidget.config.fontSize),
            min: (12),
            max: (48),
        }));
        const __VLS_274 = __VLS_273({
            modelValue: (__VLS_ctx.selectedWidget.config.fontSize),
            min: (12),
            max: (48),
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        var __VLS_271;
        const __VLS_276 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            label: "字体颜色",
        }));
        const __VLS_278 = __VLS_277({
            label: "字体颜色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        __VLS_279.slots.default;
        const __VLS_280 = {}.ElColorPicker;
        /** @type {[typeof __VLS_components.ElColorPicker, typeof __VLS_components.elColorPicker, ]} */ ;
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
            modelValue: (__VLS_ctx.selectedWidget.config.fontColor),
        }));
        const __VLS_282 = __VLS_281({
            modelValue: (__VLS_ctx.selectedWidget.config.fontColor),
        }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        var __VLS_279;
        const __VLS_284 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
            label: "对齐方式",
        }));
        const __VLS_286 = __VLS_285({
            label: "对齐方式",
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        __VLS_287.slots.default;
        const __VLS_288 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
            modelValue: (__VLS_ctx.selectedWidget.config.textAlign),
        }));
        const __VLS_290 = __VLS_289({
            modelValue: (__VLS_ctx.selectedWidget.config.textAlign),
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        __VLS_291.slots.default;
        const __VLS_292 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
            label: "左对齐",
            value: "left",
        }));
        const __VLS_294 = __VLS_293({
            label: "左对齐",
            value: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_293));
        const __VLS_296 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
            label: "居中",
            value: "center",
        }));
        const __VLS_298 = __VLS_297({
            label: "居中",
            value: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        const __VLS_300 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
            label: "右对齐",
            value: "right",
        }));
        const __VLS_302 = __VLS_301({
            label: "右对齐",
            value: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_301));
        var __VLS_291;
        var __VLS_287;
    }
    if (__VLS_ctx.selectedWidget.type === 'image') {
        const __VLS_304 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
            label: "图片URL",
        }));
        const __VLS_306 = __VLS_305({
            label: "图片URL",
        }, ...__VLS_functionalComponentArgsRest(__VLS_305));
        __VLS_307.slots.default;
        const __VLS_308 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
            modelValue: (__VLS_ctx.selectedWidget.config.imageUrl),
            placeholder: "https://...",
        }));
        const __VLS_310 = __VLS_309({
            modelValue: (__VLS_ctx.selectedWidget.config.imageUrl),
            placeholder: "https://...",
        }, ...__VLS_functionalComponentArgsRest(__VLS_309));
        var __VLS_307;
        const __VLS_312 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
            label: "填充方式",
        }));
        const __VLS_314 = __VLS_313({
            label: "填充方式",
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        __VLS_315.slots.default;
        const __VLS_316 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
            modelValue: (__VLS_ctx.selectedWidget.config.fit),
        }));
        const __VLS_318 = __VLS_317({
            modelValue: (__VLS_ctx.selectedWidget.config.fit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        __VLS_319.slots.default;
        const __VLS_320 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
            label: "填充",
            value: "fill",
        }));
        const __VLS_322 = __VLS_321({
            label: "填充",
            value: "fill",
        }, ...__VLS_functionalComponentArgsRest(__VLS_321));
        const __VLS_324 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
            label: "包含",
            value: "contain",
        }));
        const __VLS_326 = __VLS_325({
            label: "包含",
            value: "contain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
        const __VLS_328 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
            label: "覆盖",
            value: "cover",
        }));
        const __VLS_330 = __VLS_329({
            label: "覆盖",
            value: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_329));
        const __VLS_332 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
            label: "原始",
            value: "none",
        }));
        const __VLS_334 = __VLS_333({
            label: "原始",
            value: "none",
        }, ...__VLS_functionalComponentArgsRest(__VLS_333));
        var __VLS_319;
        var __VLS_315;
    }
    var __VLS_79;
}
const __VLS_336 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    modelValue: (__VLS_ctx.previewVisible),
    title: "预览",
    width: "90%",
    top: "5vh",
}));
const __VLS_338 = __VLS_337({
    modelValue: (__VLS_ctx.previewVisible),
    title: "预览",
    width: "90%",
    top: "5vh",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
__VLS_339.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-container" },
});
/** @type {[typeof DashboardPreview, ]} */ ;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent(DashboardPreview, new DashboardPreview({
    widgets: (__VLS_ctx.canvasWidgets),
    name: (__VLS_ctx.dashboardName),
}));
const __VLS_341 = __VLS_340({
    widgets: (__VLS_ctx.canvasWidgets),
    name: (__VLS_ctx.dashboardName),
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
var __VLS_339;
const __VLS_343 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent(__VLS_343, new __VLS_343({
    modelValue: (__VLS_ctx.saveDialogVisible),
    title: "保存大屏",
    width: "400px",
}));
const __VLS_345 = __VLS_344({
    modelValue: (__VLS_ctx.saveDialogVisible),
    title: "保存大屏",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_344));
__VLS_346.slots.default;
const __VLS_347 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
    labelWidth: "80px",
}));
const __VLS_349 = __VLS_348({
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_348));
__VLS_350.slots.default;
const __VLS_351 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_352 = __VLS_asFunctionalComponent(__VLS_351, new __VLS_351({
    label: "大屏名称",
}));
const __VLS_353 = __VLS_352({
    label: "大屏名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_352));
__VLS_354.slots.default;
const __VLS_355 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
    modelValue: (__VLS_ctx.saveDashboardName),
    placeholder: "请输入大屏名称",
}));
const __VLS_357 = __VLS_356({
    modelValue: (__VLS_ctx.saveDashboardName),
    placeholder: "请输入大屏名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_356));
var __VLS_354;
const __VLS_359 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
    label: "大屏描述",
}));
const __VLS_361 = __VLS_360({
    label: "大屏描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
__VLS_362.slots.default;
const __VLS_363 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_364 = __VLS_asFunctionalComponent(__VLS_363, new __VLS_363({
    type: "textarea",
    modelValue: (__VLS_ctx.saveDashboardDesc),
    rows: (3),
    placeholder: "请输入大屏描述",
}));
const __VLS_365 = __VLS_364({
    type: "textarea",
    modelValue: (__VLS_ctx.saveDashboardDesc),
    rows: (3),
    placeholder: "请输入大屏描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_364));
var __VLS_362;
var __VLS_350;
{
    const { footer: __VLS_thisSlot } = __VLS_346.slots;
    const __VLS_367 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_368 = __VLS_asFunctionalComponent(__VLS_367, new __VLS_367({
        ...{ 'onClick': {} },
    }));
    const __VLS_369 = __VLS_368({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_368));
    let __VLS_371;
    let __VLS_372;
    let __VLS_373;
    const __VLS_374 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveDialogVisible = false;
        }
    };
    __VLS_370.slots.default;
    var __VLS_370;
    const __VLS_375 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_376 = __VLS_asFunctionalComponent(__VLS_375, new __VLS_375({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_377 = __VLS_376({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_376));
    let __VLS_379;
    let __VLS_380;
    let __VLS_381;
    const __VLS_382 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_378.slots.default;
    var __VLS_378;
}
var __VLS_346;
/** @type {__VLS_StyleScopedClasses['dashboard-design']} */ ;
/** @type {__VLS_StyleScopedClasses['design-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['name-input']} */ ;
/** @type {__VLS_StyleScopedClasses['template-select']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['design-body']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-list']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-item']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-header']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['widget-content']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['nw']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['n']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['ne']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['e']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['se']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['s']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['sw']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['w']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['property-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['property-form']} */ ;
/** @type {__VLS_StyleScopedClasses['data-source-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RefreshLeft: RefreshLeft,
            Check: Check,
            Delete: Delete,
            Box: Box,
            DashboardPreview: DashboardPreview,
            dashboardName: dashboardName,
            selectedTemplateId: selectedTemplateId,
            selectedWidgetIndex: selectedWidgetIndex,
            previewVisible: previewVisible,
            saveDialogVisible: saveDialogVisible,
            saveDashboardName: saveDashboardName,
            saveDashboardDesc: saveDashboardDesc,
            canvasRef: canvasRef,
            templates: templates,
            widgetTypes: widgetTypes,
            canvasWidgets: canvasWidgets,
            selectedWidget: selectedWidget,
            getWidgetStyle: getWidgetStyle,
            getWidgetComponent: getWidgetComponent,
            handleDragStart: handleDragStart,
            handleDrop: handleDrop,
            handleCanvasClick: handleCanvasClick,
            handleWidgetMouseDown: handleWidgetMouseDown,
            handleResizeStart: handleResizeStart,
            removeWidget: removeWidget,
            resetConfig: resetConfig,
            preview: preview,
            openSaveDialog: openSaveDialog,
            handleSave: handleSave,
            loadTemplate: loadTemplate,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardDesign.vue.js.map