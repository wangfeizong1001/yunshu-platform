<template>
  <div class="process-design">
    <el-card shadow="never" class="toolbar-card">
      <div class="toolbar">
        <div class="left">
          <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
          <el-divider direction="vertical" />
          <el-button type="primary" :icon="Document" @click="handleSave">保存</el-button>
          <el-button :icon="Upload" @click="handleDeploy">发布</el-button>
          <el-divider direction="vertical" />
          <el-button :icon="RefreshLeft" @click="handleUndo" :disabled="!canUndo">撤销</el-button>
          <el-button :icon="RefreshRight" @click="handleRedo" :disabled="!canRedo">重做</el-button>
        </div>
        <div class="right">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="design">设计</el-radio-button>
            <el-radio-button value="preview">预览</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>

    <div class="design-container">
      <el-card shadow="never" class="nodes-panel">
        <template #header>
          <div class="panel-title">节点库</div>
        </template>
        <div class="node-items">
          <div class="node-item start" draggable="true" @dragstart="handleDragStart($event, 'start')">
            <div class="icon">●</div>
            <div class="label">开始</div>
          </div>
          <div class="node-item end" draggable="true" @dragstart="handleDragStart($event, 'end')">
            <div class="icon">◉</div>
            <div class="label">结束</div>
          </div>
          <div class="node-item task" draggable="true" @dragstart="handleDragStart($event, 'task')">
            <div class="icon">▢</div>
            <div class="label">任务</div>
          </div>
          <div class="node-item gateway" draggable="true" @dragstart="handleDragStart($event, 'gateway')">
            <div class="icon">◇</div>
            <div class="label">网关</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="canvas-panel">
        <template #header>
          <div class="panel-title">
            {{ processName || '未命名流程' }}
            <el-tag size="small" type="info" class="version-tag">v1.0</el-tag>
          </div>
        </template>
        <div
          ref="canvasRef"
          class="canvas"
          @dragover.prevent
          @drop="handleDrop"
          @click="handleCanvasClick"
        >
          <svg
            ref="svgRef"
            :width="canvasWidth"
            :height="canvasHeight"
            class="flow-svg"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#606266" />
              </marker>
            </defs>
            <g v-for="(line, idx) in connections" :key="'line-' + idx">
              <path
                :d="getLinePath(line)"
                fill="none"
                stroke="#606266"
                stroke-width="2"
                marker-end="url(#arrowhead)"
              />
            </g>
          </svg>
          <div
            v-for="node in nodes"
            :key="node.id"
            class="flow-node"
            :class="[node.type, { selected: selectedNodeId === node.id }]"
            :style="{ left: node.x + 'px', top: node.y + 'px' }"
            @mousedown="handleNodeMouseDown($event, node)"
            @click.stop="handleNodeClick(node)"
          >
            <div class="node-body">
              <div class="node-icon">{{ getNodeIcon(node.type) }}</div>
              <div class="node-label">{{ node.label }}</div>
            </div>
            <div class="node-ports">
              <div
                v-if="node.type !== 'start'"
                class="port port-top"
                @mousedown.stop="handlePortMouseDown($event, node, 'top')"
              ></div>
              <div
                v-if="node.type !== 'end'"
                class="port port-bottom"
                @mousedown.stop="handlePortMouseDown($event, node, 'bottom')"
              ></div>
            </div>
            <div class="node-remove" @click.stop="handleRemoveNode(node)">×</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="properties-panel">
        <template #header>
          <div class="panel-title">属性设置</div>
        </template>
        <div v-if="selectedNode" class="properties-content">
          <el-form label-position="top">
            <el-form-item label="节点名称">
              <el-input v-model="selectedNode.label" />
            </el-form-item>
            <el-form-item v-if="selectedNode.type === 'task'" label="处理人">
              <el-select v-model="selectedNode.assignee" placeholder="请选择处理人" clearable>
                <el-option label="管理员" value="1" />
                <el-option label="张三" value="2" />
                <el-option label="李四" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="selectedNode.type === 'task'" label="任务类型">
              <el-select v-model="selectedNode.taskType" placeholder="请选择">
                <el-option label="审批任务" value="approval" />
                <el-option label="办理任务" value="handle" />
                <el-option label="抄送任务" value="copy" />
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="selectedNode.description" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="empty-properties">
          <el-empty description="请选择节点" :image-size="60" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Document,
  Upload,
  RefreshLeft,
  RefreshRight,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const processId = route.params.id as string
const canvasRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()

const processName = ref('请假审批')
const viewMode = ref('design')

const canvasWidth = 800
const canvasHeight = 600

interface FlowNode {
  id: string
  type: 'start' | 'end' | 'task' | 'gateway'
  x: number
  y: number
  label: string
  description?: string
  assignee?: string
  taskType?: string
}

interface Connection {
  from: { nodeId: string; port: string }
  to: { nodeId: string; port: string }
}

const nodes = ref<FlowNode[]>([
  { id: 'start', type: 'start', x: 370, y: 50, label: '开始' },
  { id: 'task1', type: 'task', x: 340, y: 150, label: '发起申请', description: '员工发起请假申请' },
  { id: 'task2', type: 'task', x: 340, y: 280, label: '部门经理审批', description: '部门经理进行审批' },
  { id: 'end', type: 'end', x: 370, y: 410, label: '结束' },
])

const connections = ref<Connection[]>([
  { from: { nodeId: 'start', port: 'bottom' }, to: { nodeId: 'task1', port: 'top' } },
  { from: { nodeId: 'task1', port: 'bottom' }, to: { nodeId: 'task2', port: 'top' } },
  { from: { nodeId: 'task2', port: 'bottom' }, to: { nodeId: 'end', port: 'top' } },
])

const selectedNodeId = ref<string>('')
const selectedNode = ref<FlowNode | null>(null)

const canUndo = ref(false)
const canRedo = ref(false)

let nodeIdCounter = 100
let isDragging = false
let draggingNode: FlowNode | null = null
let dragOffsetX = 0
let dragOffsetY = 0
let isConnecting = false
let connectingFrom: { nodeId: string; port: string } | null = null

function getNodeIcon(type: string) {
  const iconMap: Record<string, string> = {
    start: '●',
    end: '◉',
    task: '▢',
    gateway: '◇',
  }
  return iconMap[type] || '?'
}

function goBack() {
  router.push('/workflow/process')
}

function handleSave() {
  ElMessage.success('保存成功')
}

function handleDeploy() {
  ElMessage.success('发布成功')
}

function handleUndo() {
  ElMessage.info('撤销')
}

function handleRedo() {
  ElMessage.info('重做')
}

function handleDragStart(e: DragEvent, type: string) {
  e.dataTransfer?.setData('nodeType', type)
}

function handleDrop(e: DragEvent) {
  const nodeType = e.dataTransfer?.getData('nodeType')
  if (!nodeType || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left - 60
  const y = e.clientY - rect.top - 30

  const newNode: FlowNode = {
    id: `node-${++nodeIdCounter}`,
    type: nodeType as any,
    x,
    y,
    label: getDefaultLabel(nodeType),
  }
  nodes.value.push(newNode)
}

function getDefaultLabel(type: string) {
  const labelMap: Record<string, string> = {
    start: '开始',
    end: '结束',
    task: '新任务',
    gateway: '网关',
  }
  return labelMap[type] || '节点'
}

function handleNodeMouseDown(e: MouseEvent, node: FlowNode) {
  isDragging = true
  draggingNode = node
  dragOffsetX = e.clientX - node.x
  dragOffsetY = e.clientY - node.y

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging || !draggingNode || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  draggingNode.x = Math.max(0, Math.min(canvasWidth - 120, e.clientX - rect.left - dragOffsetX))
  draggingNode.y = Math.max(0, Math.min(canvasHeight - 60, e.clientY - rect.top - dragOffsetY))
}

function handleMouseUp() {
  isDragging = false
  draggingNode = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handlePortMouseDown(e: MouseEvent, node: FlowNode, port: string) {
  isConnecting = true
  connectingFrom = { nodeId: node.id, port }

  document.addEventListener('mouseup', handleConnectMouseUp)
}

function handleConnectMouseUp(e: MouseEvent) {
  if (!isConnecting || !connectingFrom) {
    document.removeEventListener('mouseup', handleConnectMouseUp)
    return
  }

  const target = e.target as HTMLElement
  const portEl = target.closest('.port')
  if (portEl) {
    const nodeEl = portEl.closest('.flow-node')
    if (nodeEl) {
      const nodeId = nodeEl.getAttribute('data-node-id') || ''
      const portPos = portEl.classList.contains('port-top') ? 'top' : 'bottom'
      
      const exists = connections.value.some(
        (c) =>
          (c.from.nodeId === connectingFrom!.nodeId && c.to.nodeId === nodeId) ||
          (c.from.nodeId === nodeId && c.to.nodeId === connectingFrom!.nodeId)
      )
      
      if (!exists && nodeId !== connectingFrom!.nodeId) {
        connections.value.push({
          from: connectingFrom!,
          to: { nodeId, port: portPos },
        })
      }
    }
  }

  isConnecting = false
  connectingFrom = null
  document.removeEventListener('mouseup', handleConnectMouseUp)
}

function getLinePath(conn: Connection) {
  const fromNode = nodes.value.find((n) => n.id === conn.from.nodeId)
  const toNode = nodes.value.find((n) => n.id === conn.to.nodeId)
  if (!fromNode || !toNode) return ''

  let x1 = fromNode.x + 60
  let y1 = fromNode.y + 60
  let x2 = toNode.x + 60
  let y2 = toNode.y

  if (conn.from.port === 'bottom') {
    y1 = fromNode.y + 60
  } else {
    y1 = fromNode.y
  }

  if (conn.to.port === 'top') {
    y2 = toNode.y
  } else {
    y2 = toNode.y + 60
  }

  const midY = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
}

function handleNodeClick(node: FlowNode) {
  selectedNodeId.value = node.id
  selectedNode.value = node
}

function handleCanvasClick() {
  selectedNodeId.value = ''
  selectedNode.value = null
}

function handleRemoveNode(node: FlowNode) {
  const index = nodes.value.findIndex((n) => n.id === node.id)
  if (index > -1) {
    nodes.value.splice(index, 1)
    connections.value = connections.value.filter(
      (c) => c.from.nodeId !== node.id && c.to.nodeId !== node.id
    )
    if (selectedNodeId.value === node.id) {
      selectedNodeId.value = ''
      selectedNode.value = null
    }
  }
}

onMounted(() => {
  nextTick(() => {
    const nodeEls = document.querySelectorAll('.flow-node')
    nodeEls.forEach((el, idx) => {
      el.setAttribute('data-node-id', nodes.value[idx].id)
    })
  })
})
</script>

<style scoped lang="scss">
.process-design {
  .toolbar-card {
    margin-bottom: 16px;
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .design-container {
    display: flex;
    gap: 16px;
    height: calc(100vh - 180px);
  }

  .nodes-panel {
    width: 160px;
    flex-shrink: 0;
    .panel-title {
      font-weight: 600;
    }
    .node-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .node-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: #f5f7fa;
        border-radius: 8px;
        cursor: grab;
        transition: all 0.2s;
        &:hover {
          background: #e6f4ff;
        }
        .icon {
          font-size: 20px;
          font-weight: bold;
        }
        &.start .icon {
          color: #67c23a;
        }
        &.end .icon {
          color: #f56c6c;
        }
        &.task .icon {
          color: #409eff;
        }
        &.gateway .icon {
          color: #e6a23c;
        }
      }
    }
  }

  .canvas-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      .version-tag {
        font-weight: normal;
      }
    }
    .canvas {
      flex: 1;
      overflow: auto;
      background: linear-gradient(to right, #f8f9fa 1px, transparent 1px),
        linear-gradient(to bottom, #f8f9fa 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
    }
    .flow-svg {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    .flow-node {
      position: absolute;
      width: 120px;
      height: 60px;
      cursor: move;
      user-select: none;
      &.start .node-body {
        background: linear-gradient(135deg, #85ce61, #67c23a);
        color: white;
      }
      &.end .node-body {
        background: linear-gradient(135deg, #f89898, #f56c6c);
        color: white;
      }
      &.task .node-body {
        background: linear-gradient(135deg, #93c5fd, #409eff);
        color: white;
      }
      &.gateway .node-body {
        background: linear-gradient(135deg, #f3d19e, #e6a23c);
        color: white;
      }
      &.selected .node-body {
        box-shadow: 0 0 0 3px #409eff;
      }
      .node-body {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        .node-icon {
          font-size: 18px;
        }
        .node-label {
          font-size: 12px;
        }
      }
      .node-ports {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        .port {
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid #409eff;
          border-radius: 50%;
          pointer-events: auto;
          cursor: crosshair;
          &:hover {
            background: #409eff;
          }
          &.port-top {
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
          }
          &.port-bottom {
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .node-remove {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        background: #f56c6c;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.2s;
      }
      &:hover .node-remove {
        opacity: 1;
      }
    }
  }

  .properties-panel {
    width: 280px;
    flex-shrink: 0;
    .panel-title {
      font-weight: 600;
    }
    .properties-content {
      padding: 8px 0;
    }
    .empty-properties {
      padding: 40px 0;
    }
  }
}
</style>
