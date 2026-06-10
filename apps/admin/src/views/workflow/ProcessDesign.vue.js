/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Document, Upload, RefreshLeft, RefreshRight, } from '@element-plus/icons-vue';
const router = useRouter();
const canvasRef = ref();
const svgRef = ref();
const processName = ref('请假审批');
const viewMode = ref('design');
const canvasWidth = 800;
const canvasHeight = 600;
const VALID_NODE_TYPES = ['start', 'end', 'task', 'approval', 'copy', 'gateway', 'condition', 'subtask'];
const approverOptions = ref([
    { label: '管理员', value: '1' },
    { label: '张三', value: '2' },
    { label: '李四', value: '3' },
    { label: '王五', value: '4' },
    { label: '赵六', value: '5' },
]);
const copyUserOptions = ref([
    { label: '管理员', value: '1' },
    { label: '张三', value: '2' },
    { label: '李四', value: '3' },
    { label: '王五', value: '4' },
    { label: '赵六', value: '5' },
]);
const initialNodes = [
    { id: 'start', type: 'start', x: 370, y: 50, label: '开始' },
    { id: 'task1', type: 'approval', x: 340, y: 150, label: '发起申请', description: '员工发起请假申请', approvalType: 'single' },
    { id: 'gateway1', type: 'condition', x: 340, y: 260, label: '审批条件', conditions: [] },
    { id: 'task2', type: 'approval', x: 200, y: 380, label: '部门经理审批', description: '部门经理进行审批', approvalType: 'multi' },
    { id: 'task3', type: 'copy', x: 480, y: 380, label: 'HR抄送', copyUsers: [] },
    { id: 'end', type: 'end', x: 370, y: 500, label: '结束' },
];
const initialConnections = [
    { from: { nodeId: 'start', port: 'bottom' }, to: { nodeId: 'task1', port: 'top' } },
    { from: { nodeId: 'task1', port: 'bottom' }, to: { nodeId: 'gateway1', port: 'top' } },
    { from: { nodeId: 'gateway1', port: 'bottom' }, to: { nodeId: 'task2', port: 'top' } },
    { from: { nodeId: 'gateway1', port: 'bottom' }, to: { nodeId: 'task3', port: 'top' } },
    { from: { nodeId: 'task2', port: 'bottom' }, to: { nodeId: 'end', port: 'top' } },
    { from: { nodeId: 'task3', port: 'bottom' }, to: { nodeId: 'end', port: 'top' } },
];
const nodes = ref(JSON.parse(JSON.stringify(initialNodes)));
const connections = ref(JSON.parse(JSON.stringify(initialConnections)));
const history = ref([]);
const historyIndex = ref(-1);
const canUndo = ref(false);
const canRedo = ref(false);
const pushHistory = () => {
    history.value = history.value.slice(0, historyIndex.value + 1);
    history.value.push({
        nodes: JSON.parse(JSON.stringify(nodes.value)),
        connections: JSON.parse(JSON.stringify(connections.value)),
    });
    historyIndex.value++;
    canUndo.value = historyIndex.value > 0;
    canRedo.value = historyIndex.value < history.value.length - 1;
};
const selectedNodeId = ref('');
const selectedNode = ref(null);
let nodeIdCounter = 100;
let isDragging = false;
let draggingNode = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isConnecting = false;
let connectingFrom = null;
pushHistory();
function getNodeIcon(type) {
    const iconMap = {
        start: '●',
        end: '◉',
        task: '▢',
        approval: '☑',
        copy: '☆',
        gateway: '◇',
        condition: '⟐',
        subtask: '⊞',
    };
    return iconMap[type] || '?';
}
function goBack() {
    router.push('/workflow/process');
}
function handleSave() {
    ElMessage.success('保存成功');
}
function handleDeploy() {
    ElMessage.success('发布成功');
}
function handleUndo() {
    if (historyIndex.value <= 0) {
        ElMessage.info('已到最早操作');
        return;
    }
    historyIndex.value--;
    const snapshot = history.value[historyIndex.value];
    nodes.value = JSON.parse(JSON.stringify(snapshot.nodes));
    connections.value = JSON.parse(JSON.stringify(snapshot.connections));
    canUndo.value = historyIndex.value > 0;
    canRedo.value = true;
    ElMessage.info('已撤销');
}
function handleRedo() {
    if (historyIndex.value >= history.value.length - 1) {
        ElMessage.info('已是最新操作');
        return;
    }
    historyIndex.value++;
    const snapshot = history.value[historyIndex.value];
    nodes.value = JSON.parse(JSON.stringify(snapshot.nodes));
    connections.value = JSON.parse(JSON.stringify(snapshot.connections));
    canRedo.value = historyIndex.value < history.value.length - 1;
    canUndo.value = true;
    ElMessage.info('已重做');
}
function handleDragStart(e, type) {
    e.dataTransfer?.setData('nodeType', type);
}
function handleDrop(e) {
    const nodeType = e.dataTransfer?.getData('nodeType');
    if (!nodeType || !canvasRef.value)
        return;
    const validType = VALID_NODE_TYPES.includes(nodeType)
        ? nodeType
        : 'task';
    const rect = canvasRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 30;
    const newNode = {
        id: `node-${++nodeIdCounter}`,
        type: validType,
        x,
        y,
        label: getDefaultLabel(validType),
    };
    nodes.value.push(newNode);
    pushHistory();
}
function getDefaultLabel(type) {
    const labelMap = {
        start: '开始',
        end: '结束',
        task: '新任务',
        approval: '审批节点',
        copy: '抄送节点',
        gateway: '网关',
        condition: '条件分支',
        subtask: '子任务',
    };
    return labelMap[type] || '节点';
}
function handleNodeMouseDown(e, node) {
    isDragging = true;
    draggingNode = node;
    dragOffsetX = e.clientX - node.x;
    dragOffsetY = e.clientY - node.y;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}
function handleMouseMove(e) {
    if (!isDragging || !draggingNode || !canvasRef.value)
        return;
    const rect = canvasRef.value.getBoundingClientRect();
    draggingNode.x = Math.max(0, Math.min(canvasWidth - 120, e.clientX - rect.left - dragOffsetX));
    draggingNode.y = Math.max(0, Math.min(canvasHeight - 60, e.clientY - rect.top - dragOffsetY));
}
function handleMouseUp() {
    isDragging = false;
    draggingNode = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}
function handlePortMouseDown(_e, node, port) {
    isConnecting = true;
    connectingFrom = { nodeId: node.id, port };
    document.addEventListener('mouseup', handleConnectMouseUp);
}
function handleConnectMouseUp(e) {
    if (!isConnecting || !connectingFrom) {
        document.removeEventListener('mouseup', handleConnectMouseUp);
        return;
    }
    const target = e.target;
    const portEl = target.closest('.port');
    if (portEl) {
        const nodeEl = portEl.closest('.flow-node');
        if (nodeEl) {
            const nodeId = nodeEl.getAttribute('data-node-id') || '';
            const portPos = portEl.classList.contains('port-top') ? 'top' : 'bottom';
            const exists = connections.value.some((c) => (c.from.nodeId === connectingFrom.nodeId && c.to.nodeId === nodeId) ||
                (c.from.nodeId === nodeId && c.to.nodeId === connectingFrom.nodeId));
            if (!exists && nodeId !== connectingFrom.nodeId) {
                connections.value.push({
                    from: connectingFrom,
                    to: { nodeId, port: portPos },
                });
            }
        }
    }
    isConnecting = false;
    connectingFrom = null;
    document.removeEventListener('mouseup', handleConnectMouseUp);
}
function getLinePath(conn) {
    const fromNode = nodes.value.find((n) => n.id === conn.from.nodeId);
    const toNode = nodes.value.find((n) => n.id === conn.to.nodeId);
    if (!fromNode || !toNode)
        return '';
    let x1, y1, x2, y2;
    switch (conn.from.port) {
        case 'bottom':
            x1 = fromNode.x + 60;
            y1 = fromNode.y + 60;
            break;
        case 'top':
            x1 = fromNode.x + 60;
            y1 = fromNode.y;
            break;
        case 'left':
            x1 = fromNode.x;
            y1 = fromNode.y + 30;
            break;
        case 'right':
            x1 = fromNode.x + 120;
            y1 = fromNode.y + 30;
            break;
        default:
            x1 = fromNode.x + 60;
            y1 = fromNode.y + 60;
    }
    switch (conn.to.port) {
        case 'top':
            x2 = toNode.x + 60;
            y2 = toNode.y;
            break;
        case 'bottom':
            x2 = toNode.x + 60;
            y2 = toNode.y + 60;
            break;
        case 'left':
            x2 = toNode.x;
            y2 = toNode.y + 30;
            break;
        case 'right':
            x2 = toNode.x + 120;
            y2 = toNode.y + 30;
            break;
        default:
            x2 = toNode.x + 60;
            y2 = toNode.y;
    }
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}
function handleNodeClick(node) {
    selectedNodeId.value = node.id;
    selectedNode.value = node;
}
function handleCanvasClick() {
    selectedNodeId.value = '';
    selectedNode.value = null;
}
function handleRemoveNode(node) {
    const index = nodes.value.findIndex((n) => n.id === node.id);
    if (index > -1) {
        nodes.value.splice(index, 1);
        connections.value = connections.value.filter((c) => c.from.nodeId !== node.id && c.to.nodeId !== node.id);
        if (selectedNodeId.value === node.id) {
            selectedNodeId.value = '';
            selectedNode.value = null;
        }
        pushHistory();
    }
}
function addCondition() {
    if (!selectedNode.value || !selectedNode.value.conditions) {
        return;
    }
    selectedNode.value.conditions.push({
        id: `cond-${Date.now()}`,
        name: `条件${selectedNode.value.conditions.length + 1}`,
        expression: '',
    });
}
function removeCondition(index) {
    if (!selectedNode.value || !selectedNode.value.conditions) {
        return;
    }
    selectedNode.value.conditions.splice(index, 1);
}
onMounted(() => {
    nextTick(() => {
        const nodeEls = document.querySelectorAll('.flow-node');
        nodeEls.forEach((el, idx) => {
            el.setAttribute('data-node-id', nodes.value[idx].id);
        });
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['start']} */ ;
/** @type {__VLS_StyleScopedClasses['end']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['task']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['approval']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['copy']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['gateway']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['condition']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['node-remove']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "process-design" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "toolbar-card" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "toolbar-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.ArrowLeft),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.goBack)
};
__VLS_7.slots.default;
var __VLS_7;
const __VLS_12 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    direction: "vertical",
}));
const __VLS_14 = __VLS_13({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Document),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Document),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.handleSave)
};
__VLS_19.slots.default;
var __VLS_19;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Upload),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Upload),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.handleDeploy)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    direction: "vertical",
}));
const __VLS_34 = __VLS_33({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshLeft),
    disabled: (!__VLS_ctx.canUndo),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshLeft),
    disabled: (!__VLS_ctx.canUndo),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.handleUndo)
};
__VLS_39.slots.default;
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshRight),
    disabled: (!__VLS_ctx.canRedo),
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshRight),
    disabled: (!__VLS_ctx.canRedo),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.handleRedo)
};
__VLS_47.slots.default;
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
const __VLS_52 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.viewMode),
    size: "small",
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.viewMode),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    value: "design",
}));
const __VLS_58 = __VLS_57({
    value: "design",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
const __VLS_60 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    value: "preview",
}));
const __VLS_62 = __VLS_61({
    value: "preview",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
var __VLS_55;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-container" },
});
const __VLS_64 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    shadow: "never",
    ...{ class: "nodes-panel" },
}));
const __VLS_66 = __VLS_65({
    shadow: "never",
    ...{ class: "nodes-panel" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_67.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "node-items" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'start');
        } },
    ...{ class: "node-item start" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'end');
        } },
    ...{ class: "node-item end" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'task');
        } },
    ...{ class: "node-item task" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'approval');
        } },
    ...{ class: "node-item approval" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'copy');
        } },
    ...{ class: "node-item copy" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'gateway');
        } },
    ...{ class: "node-item gateway" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'condition');
        } },
    ...{ class: "node-item condition" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragstart: (...[$event]) => {
            __VLS_ctx.handleDragStart($event, 'subtask');
        } },
    ...{ class: "node-item subtask" },
    draggable: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
var __VLS_67;
const __VLS_68 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    shadow: "never",
    ...{ class: "canvas-panel" },
}));
const __VLS_70 = __VLS_69({
    shadow: "never",
    ...{ class: "canvas-panel" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
    (__VLS_ctx.processName || '未命名流程');
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        size: "small",
        type: "info",
        ...{ class: "version-tag" },
    }));
    const __VLS_74 = __VLS_73({
        size: "small",
        type: "info",
        ...{ class: "version-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    var __VLS_75;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragover: () => { } },
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ onClick: (__VLS_ctx.handleCanvasClick) },
    ref: "canvasRef",
    ...{ class: "canvas" },
});
/** @type {typeof __VLS_ctx.canvasRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ref: "svgRef",
    width: (__VLS_ctx.canvasWidth),
    height: (__VLS_ctx.canvasHeight),
    ...{ class: "flow-svg" },
});
/** @type {typeof __VLS_ctx.svgRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.defs, __VLS_intrinsicElements.defs)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.marker, __VLS_intrinsicElements.marker)({
    id: "arrowhead",
    markerWidth: "10",
    markerHeight: "10",
    refX: "9",
    refY: "3",
    orient: "auto",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polygon)({
    points: "0 0, 10 3, 0 6",
    fill: "#606266",
});
for (const [line, idx] of __VLS_getVForSourceType((__VLS_ctx.connections))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.g, __VLS_intrinsicElements.g)({
        key: ('line-' + idx),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: (__VLS_ctx.getLinePath(line)),
        fill: "none",
        stroke: "#606266",
        'stroke-width': "2",
        'marker-end': "url(#arrowhead)",
    });
}
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.nodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onMousedown: (...[$event]) => {
                __VLS_ctx.handleNodeMouseDown($event, node);
            } },
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleNodeClick(node);
            } },
        key: (node.id),
        ...{ class: "flow-node" },
        ...{ class: ([node.type, { selected: __VLS_ctx.selectedNodeId === node.id }]) },
        ...{ style: ({ left: node.x + 'px', top: node.y + 'px' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-icon" },
    });
    (__VLS_ctx.getNodeIcon(node.type));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-label" },
    });
    (node.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-ports" },
    });
    if (node.type !== 'start') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(node.type !== 'start'))
                        return;
                    __VLS_ctx.handlePortMouseDown($event, node, 'top');
                } },
            ...{ class: "port port-top" },
        });
    }
    if (node.type !== 'end') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onMousedown: (...[$event]) => {
                    if (!(node.type !== 'end'))
                        return;
                    __VLS_ctx.handlePortMouseDown($event, node, 'bottom');
                } },
            ...{ class: "port port-bottom" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleRemoveNode(node);
            } },
        ...{ class: "node-remove" },
    });
}
var __VLS_71;
const __VLS_76 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    shadow: "never",
    ...{ class: "properties-panel" },
}));
const __VLS_78 = __VLS_77({
    shadow: "never",
    ...{ class: "properties-panel" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_79.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
}
if (__VLS_ctx.selectedNode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "properties-content" },
    });
    const __VLS_80 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        labelPosition: "top",
        size: "small",
    }));
    const __VLS_82 = __VLS_81({
        labelPosition: "top",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        contentPosition: "left",
    }));
    const __VLS_86 = __VLS_85({
        contentPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_88 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "节点名称",
    }));
    const __VLS_90 = __VLS_89({
        label: "节点名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    const __VLS_92 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        modelValue: (__VLS_ctx.selectedNode.label),
    }));
    const __VLS_94 = __VLS_93({
        modelValue: (__VLS_ctx.selectedNode.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_91;
    const __VLS_96 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        label: "节点描述",
    }));
    const __VLS_98 = __VLS_97({
        label: "节点描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.selectedNode.description),
        type: "textarea",
        rows: (2),
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (__VLS_ctx.selectedNode.description),
        type: "textarea",
        rows: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_99;
    if (__VLS_ctx.selectedNode.type === 'task' || __VLS_ctx.selectedNode.type === 'approval') {
        const __VLS_104 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            contentPosition: "left",
        }));
        const __VLS_106 = __VLS_105({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        var __VLS_107;
        const __VLS_108 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            label: "处理人类型",
        }));
        const __VLS_110 = __VLS_109({
            label: "处理人类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_111.slots.default;
        const __VLS_112 = {}.ElRadioGroup;
        /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            modelValue: (__VLS_ctx.selectedNode.approvalType),
        }));
        const __VLS_114 = __VLS_113({
            modelValue: (__VLS_ctx.selectedNode.approvalType),
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        const __VLS_116 = {}.ElRadioButton;
        /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            value: "single",
        }));
        const __VLS_118 = __VLS_117({
            value: "single",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        var __VLS_119;
        const __VLS_120 = {}.ElRadioButton;
        /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            value: "multi",
        }));
        const __VLS_122 = __VLS_121({
            value: "multi",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        var __VLS_123;
        var __VLS_115;
        var __VLS_111;
        const __VLS_124 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            label: "指定审批人",
        }));
        const __VLS_126 = __VLS_125({
            label: "指定审批人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        const __VLS_128 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            modelValue: (__VLS_ctx.selectedNode.approvers),
            multiple: true,
            placeholder: "请选择审批人",
            ...{ style: {} },
        }));
        const __VLS_130 = __VLS_129({
            modelValue: (__VLS_ctx.selectedNode.approvers),
            multiple: true,
            placeholder: "请选择审批人",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
        for (const [opt] of __VLS_getVForSourceType((__VLS_ctx.approverOptions))) {
            const __VLS_132 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }));
            const __VLS_134 = __VLS_133({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        }
        var __VLS_131;
        var __VLS_127;
        const __VLS_136 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            label: "或选择角色",
        }));
        const __VLS_138 = __VLS_137({
            label: "或选择角色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_139.slots.default;
        const __VLS_140 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择角色",
            clearable: true,
        }));
        const __VLS_142 = __VLS_141({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择角色",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        __VLS_143.slots.default;
        const __VLS_144 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            label: "部门经理",
            value: "manager",
        }));
        const __VLS_146 = __VLS_145({
            label: "部门经理",
            value: "manager",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        const __VLS_148 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            label: "总经理",
            value: "director",
        }));
        const __VLS_150 = __VLS_149({
            label: "总经理",
            value: "director",
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        const __VLS_152 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            label: "HR",
            value: "hr",
        }));
        const __VLS_154 = __VLS_153({
            label: "HR",
            value: "hr",
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        const __VLS_156 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            label: "财务",
            value: "finance",
        }));
        const __VLS_158 = __VLS_157({
            label: "财务",
            value: "finance",
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        var __VLS_143;
        var __VLS_139;
        const __VLS_160 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            label: "允许委托",
        }));
        const __VLS_162 = __VLS_161({
            label: "允许委托",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        __VLS_163.slots.default;
        const __VLS_164 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            modelValue: (__VLS_ctx.selectedNode.delegatable),
        }));
        const __VLS_166 = __VLS_165({
            modelValue: (__VLS_ctx.selectedNode.delegatable),
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        var __VLS_163;
        const __VLS_168 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            contentPosition: "left",
        }));
        const __VLS_170 = __VLS_169({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_171.slots.default;
        var __VLS_171;
        const __VLS_172 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            label: "使用的表单",
        }));
        const __VLS_174 = __VLS_173({
            label: "使用的表单",
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        __VLS_175.slots.default;
        const __VLS_176 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            modelValue: (__VLS_ctx.selectedNode.formKey),
            placeholder: "请选择表单",
            clearable: true,
        }));
        const __VLS_178 = __VLS_177({
            modelValue: (__VLS_ctx.selectedNode.formKey),
            placeholder: "请选择表单",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        const __VLS_180 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            label: "请假申请单",
            value: "leave_form",
        }));
        const __VLS_182 = __VLS_181({
            label: "请假申请单",
            value: "leave_form",
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        const __VLS_184 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            label: "报销申请单",
            value: "expense_form",
        }));
        const __VLS_186 = __VLS_185({
            label: "报销申请单",
            value: "expense_form",
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        const __VLS_188 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            label: "采购申请单",
            value: "purchase_form",
        }));
        const __VLS_190 = __VLS_189({
            label: "采购申请单",
            value: "purchase_form",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        const __VLS_192 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            label: "出差申请单",
            value: "travel_form",
        }));
        const __VLS_194 = __VLS_193({
            label: "出差申请单",
            value: "travel_form",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        var __VLS_179;
        var __VLS_175;
        const __VLS_196 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            contentPosition: "left",
        }));
        const __VLS_198 = __VLS_197({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        __VLS_199.slots.default;
        var __VLS_199;
        const __VLS_200 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            label: "任务期限",
        }));
        const __VLS_202 = __VLS_201({
            label: "任务期限",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        __VLS_203.slots.default;
        const __VLS_204 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            modelValue: (__VLS_ctx.selectedNode.dueDateHours),
            min: (1),
            max: (720),
            controlsPosition: "right",
        }));
        const __VLS_206 = __VLS_205({
            modelValue: (__VLS_ctx.selectedNode.dueDateHours),
            min: (1),
            max: (720),
            controlsPosition: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ style: {} },
        });
        var __VLS_203;
        const __VLS_208 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            label: "超期处理",
        }));
        const __VLS_210 = __VLS_209({
            label: "超期处理",
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_211.slots.default;
        const __VLS_212 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            modelValue: (__VLS_ctx.selectedNode.overdueAction),
            placeholder: "请选择",
        }));
        const __VLS_214 = __VLS_213({
            modelValue: (__VLS_ctx.selectedNode.overdueAction),
            placeholder: "请选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        __VLS_215.slots.default;
        const __VLS_216 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            label: "自动通过",
            value: "auto_pass",
        }));
        const __VLS_218 = __VLS_217({
            label: "自动通过",
            value: "auto_pass",
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        const __VLS_220 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            label: "自动拒绝",
            value: "auto_reject",
        }));
        const __VLS_222 = __VLS_221({
            label: "自动拒绝",
            value: "auto_reject",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        const __VLS_224 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
            label: "发送催办通知",
            value: "notify",
        }));
        const __VLS_226 = __VLS_225({
            label: "发送催办通知",
            value: "notify",
        }, ...__VLS_functionalComponentArgsRest(__VLS_225));
        const __VLS_228 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
            label: "保持挂起",
            value: "suspend",
        }));
        const __VLS_230 = __VLS_229({
            label: "保持挂起",
            value: "suspend",
        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
        var __VLS_215;
        var __VLS_211;
    }
    if (__VLS_ctx.selectedNode.type === 'copy') {
        const __VLS_232 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            contentPosition: "left",
        }));
        const __VLS_234 = __VLS_233({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        __VLS_235.slots.default;
        var __VLS_235;
        const __VLS_236 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            label: "指定抄送人",
        }));
        const __VLS_238 = __VLS_237({
            label: "指定抄送人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        __VLS_239.slots.default;
        const __VLS_240 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            modelValue: (__VLS_ctx.selectedNode.copyUsers),
            multiple: true,
            placeholder: "请选择抄送人",
            ...{ style: {} },
        }));
        const __VLS_242 = __VLS_241({
            modelValue: (__VLS_ctx.selectedNode.copyUsers),
            multiple: true,
            placeholder: "请选择抄送人",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_243.slots.default;
        for (const [opt] of __VLS_getVForSourceType((__VLS_ctx.copyUserOptions))) {
            const __VLS_244 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }));
            const __VLS_246 = __VLS_245({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        }
        var __VLS_243;
        var __VLS_239;
        const __VLS_248 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            label: "或选择角色",
        }));
        const __VLS_250 = __VLS_249({
            label: "或选择角色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
        __VLS_251.slots.default;
        const __VLS_252 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择角色",
            clearable: true,
        }));
        const __VLS_254 = __VLS_253({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择角色",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_253));
        __VLS_255.slots.default;
        const __VLS_256 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            label: "HR",
            value: "hr",
        }));
        const __VLS_258 = __VLS_257({
            label: "HR",
            value: "hr",
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        const __VLS_260 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            label: "财务",
            value: "finance",
        }));
        const __VLS_262 = __VLS_261({
            label: "财务",
            value: "finance",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        const __VLS_264 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            label: "总经理",
            value: "director",
        }));
        const __VLS_266 = __VLS_265({
            label: "总经理",
            value: "director",
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        var __VLS_255;
        var __VLS_251;
        const __VLS_268 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            label: "抄送时机",
        }));
        const __VLS_270 = __VLS_269({
            label: "抄送时机",
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        __VLS_271.slots.default;
        const __VLS_272 = {}.ElCheckboxGroup;
        /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
            modelValue: (__VLS_ctx.selectedNode.copyTypes),
        }));
        const __VLS_274 = __VLS_273({
            modelValue: (__VLS_ctx.selectedNode.copyTypes),
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        __VLS_275.slots.default;
        const __VLS_276 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            label: "start",
        }));
        const __VLS_278 = __VLS_277({
            label: "start",
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        __VLS_279.slots.default;
        var __VLS_279;
        const __VLS_280 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
            label: "complete",
        }));
        const __VLS_282 = __VLS_281({
            label: "complete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        __VLS_283.slots.default;
        var __VLS_283;
        const __VLS_284 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
            label: "reject",
        }));
        const __VLS_286 = __VLS_285({
            label: "reject",
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        __VLS_287.slots.default;
        var __VLS_287;
        var __VLS_275;
        var __VLS_271;
    }
    if (__VLS_ctx.selectedNode.type === 'condition') {
        const __VLS_288 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
            contentPosition: "left",
        }));
        const __VLS_290 = __VLS_289({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        __VLS_291.slots.default;
        var __VLS_291;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "conditions-section" },
        });
        for (const [cond, idx] of __VLS_getVForSourceType((__VLS_ctx.selectedNode.conditions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (cond.id),
                ...{ class: "condition-item" },
            });
            const __VLS_292 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
                modelValue: (cond.name),
                placeholder: "条件名称",
                ...{ style: {} },
            }));
            const __VLS_294 = __VLS_293({
                modelValue: (cond.name),
                placeholder: "条件名称",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_293));
            const __VLS_296 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
                modelValue: (cond.expression),
                placeholder: "表达式，如: amount > 1000",
                ...{ style: {} },
            }));
            const __VLS_298 = __VLS_297({
                modelValue: (cond.expression),
                placeholder: "表达式，如: amount > 1000",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_297));
            const __VLS_300 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
                ...{ 'onClick': {} },
                type: "danger",
                link: true,
            }));
            const __VLS_302 = __VLS_301({
                ...{ 'onClick': {} },
                type: "danger",
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_301));
            let __VLS_304;
            let __VLS_305;
            let __VLS_306;
            const __VLS_307 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selectedNode))
                        return;
                    if (!(__VLS_ctx.selectedNode.type === 'condition'))
                        return;
                    __VLS_ctx.removeCondition(idx);
                }
            };
            __VLS_303.slots.default;
            var __VLS_303;
        }
        const __VLS_308 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_310 = __VLS_309({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_309));
        let __VLS_312;
        let __VLS_313;
        let __VLS_314;
        const __VLS_315 = {
            onClick: (__VLS_ctx.addCondition)
        };
        __VLS_311.slots.default;
        var __VLS_311;
    }
    if (__VLS_ctx.selectedNode.type === 'gateway') {
        const __VLS_316 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
            contentPosition: "left",
        }));
        const __VLS_318 = __VLS_317({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        __VLS_319.slots.default;
        var __VLS_319;
        const __VLS_320 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
            label: "网关类型",
        }));
        const __VLS_322 = __VLS_321({
            label: "网关类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_321));
        __VLS_323.slots.default;
        const __VLS_324 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
            modelValue: (__VLS_ctx.selectedNode.gatewayType),
            placeholder: "请选择",
        }));
        const __VLS_326 = __VLS_325({
            modelValue: (__VLS_ctx.selectedNode.gatewayType),
            placeholder: "请选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
        __VLS_327.slots.default;
        const __VLS_328 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
            label: "并行网关",
            value: "parallel",
        }));
        const __VLS_330 = __VLS_329({
            label: "并行网关",
            value: "parallel",
        }, ...__VLS_functionalComponentArgsRest(__VLS_329));
        const __VLS_332 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
            label: "排他网关",
            value: "exclusive",
        }));
        const __VLS_334 = __VLS_333({
            label: "排他网关",
            value: "exclusive",
        }, ...__VLS_functionalComponentArgsRest(__VLS_333));
        const __VLS_336 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
            label: "包容网关",
            value: "inclusive",
        }));
        const __VLS_338 = __VLS_337({
            label: "包容网关",
            value: "inclusive",
        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
        var __VLS_327;
        var __VLS_323;
    }
    if (__VLS_ctx.selectedNode.type === 'subtask') {
        const __VLS_340 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
            contentPosition: "left",
        }));
        const __VLS_342 = __VLS_341({
            contentPosition: "left",
        }, ...__VLS_functionalComponentArgsRest(__VLS_341));
        __VLS_343.slots.default;
        var __VLS_343;
        const __VLS_344 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
            label: "子任务模板",
        }));
        const __VLS_346 = __VLS_345({
            label: "子任务模板",
        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
        __VLS_347.slots.default;
        const __VLS_348 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
            modelValue: (__VLS_ctx.selectedNode.subtaskTemplate),
            placeholder: "请选择",
        }));
        const __VLS_350 = __VLS_349({
            modelValue: (__VLS_ctx.selectedNode.subtaskTemplate),
            placeholder: "请选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_349));
        __VLS_351.slots.default;
        const __VLS_352 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
            label: "信息确认",
            value: "confirm",
        }));
        const __VLS_354 = __VLS_353({
            label: "信息确认",
            value: "confirm",
        }, ...__VLS_functionalComponentArgsRest(__VLS_353));
        const __VLS_356 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
            label: "材料收集",
            value: "collect",
        }));
        const __VLS_358 = __VLS_357({
            label: "材料收集",
            value: "collect",
        }, ...__VLS_functionalComponentArgsRest(__VLS_357));
        const __VLS_360 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
            label: "部门会签",
            value: "cosign",
        }));
        const __VLS_362 = __VLS_361({
            label: "部门会签",
            value: "cosign",
        }, ...__VLS_functionalComponentArgsRest(__VLS_361));
        var __VLS_351;
        var __VLS_347;
        const __VLS_364 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
            label: "子任务处理人",
        }));
        const __VLS_366 = __VLS_365({
            label: "子任务处理人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_365));
        __VLS_367.slots.default;
        const __VLS_368 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择",
            clearable: true,
        }));
        const __VLS_370 = __VLS_369({
            modelValue: (__VLS_ctx.selectedNode.assignee),
            placeholder: "请选择",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_369));
        __VLS_371.slots.default;
        const __VLS_372 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
            label: "指定人员",
            value: "specific",
        }));
        const __VLS_374 = __VLS_373({
            label: "指定人员",
            value: "specific",
        }, ...__VLS_functionalComponentArgsRest(__VLS_373));
        const __VLS_376 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
            label: "发起人",
            value: "initiator",
        }));
        const __VLS_378 = __VLS_377({
            label: "发起人",
            value: "initiator",
        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
        const __VLS_380 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
            label: "上级",
            value: "supervisor",
        }));
        const __VLS_382 = __VLS_381({
            label: "上级",
            value: "supervisor",
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        var __VLS_371;
        var __VLS_367;
    }
    const __VLS_384 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        contentPosition: "left",
    }));
    const __VLS_386 = __VLS_385({
        contentPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    __VLS_387.slots.default;
    var __VLS_387;
    const __VLS_388 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
        label: "节点标识",
    }));
    const __VLS_390 = __VLS_389({
        label: "节点标识",
    }, ...__VLS_functionalComponentArgsRest(__VLS_389));
    __VLS_391.slots.default;
    const __VLS_392 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        modelValue: (__VLS_ctx.selectedNode.nodeKey),
        placeholder: "用于API调用",
    }));
    const __VLS_394 = __VLS_393({
        modelValue: (__VLS_ctx.selectedNode.nodeKey),
        placeholder: "用于API调用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    var __VLS_391;
    const __VLS_396 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
        label: "优先级",
    }));
    const __VLS_398 = __VLS_397({
        label: "优先级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    __VLS_399.slots.default;
    const __VLS_400 = {}.ElSlider;
    /** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ ;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
        modelValue: (__VLS_ctx.selectedNode.priority),
        min: (0),
        max: (100),
        showInput: true,
    }));
    const __VLS_402 = __VLS_401({
        modelValue: (__VLS_ctx.selectedNode.priority),
        min: (0),
        max: (100),
        showInput: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
    var __VLS_399;
    const __VLS_404 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
        label: "备注",
    }));
    const __VLS_406 = __VLS_405({
        label: "备注",
    }, ...__VLS_functionalComponentArgsRest(__VLS_405));
    __VLS_407.slots.default;
    const __VLS_408 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
        modelValue: (__VLS_ctx.selectedNode.remark),
        type: "textarea",
        rows: (2),
    }));
    const __VLS_410 = __VLS_409({
        modelValue: (__VLS_ctx.selectedNode.remark),
        type: "textarea",
        rows: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    var __VLS_407;
    var __VLS_83;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-properties" },
    });
    const __VLS_412 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        description: "请选择节点",
        imageSize: (60),
    }));
    const __VLS_414 = __VLS_413({
        description: "请选择节点",
        imageSize: (60),
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
}
var __VLS_79;
/** @type {__VLS_StyleScopedClasses['process-design']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-card']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['design-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nodes-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['node-items']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['start']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['end']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['task']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['approval']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['copy']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['gateway']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['condition']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['subtask']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['version-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-body']} */ ;
/** @type {__VLS_StyleScopedClasses['node-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['node-label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-ports']} */ ;
/** @type {__VLS_StyleScopedClasses['port']} */ ;
/** @type {__VLS_StyleScopedClasses['port-top']} */ ;
/** @type {__VLS_StyleScopedClasses['port']} */ ;
/** @type {__VLS_StyleScopedClasses['port-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['node-remove']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['properties-content']} */ ;
/** @type {__VLS_StyleScopedClasses['conditions-section']} */ ;
/** @type {__VLS_StyleScopedClasses['condition-item']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-properties']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowLeft: ArrowLeft,
            Document: Document,
            Upload: Upload,
            RefreshLeft: RefreshLeft,
            RefreshRight: RefreshRight,
            canvasRef: canvasRef,
            svgRef: svgRef,
            processName: processName,
            viewMode: viewMode,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            approverOptions: approverOptions,
            copyUserOptions: copyUserOptions,
            nodes: nodes,
            connections: connections,
            canUndo: canUndo,
            canRedo: canRedo,
            selectedNodeId: selectedNodeId,
            selectedNode: selectedNode,
            getNodeIcon: getNodeIcon,
            goBack: goBack,
            handleSave: handleSave,
            handleDeploy: handleDeploy,
            handleUndo: handleUndo,
            handleRedo: handleRedo,
            handleDragStart: handleDragStart,
            handleDrop: handleDrop,
            handleNodeMouseDown: handleNodeMouseDown,
            handlePortMouseDown: handlePortMouseDown,
            getLinePath: getLinePath,
            handleNodeClick: handleNodeClick,
            handleCanvasClick: handleCanvasClick,
            handleRemoveNode: handleRemoveNode,
            addCondition: addCondition,
            removeCondition: removeCondition,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ProcessDesign.vue.js.map