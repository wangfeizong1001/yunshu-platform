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
          <div class="node-item approval" draggable="true" @dragstart="handleDragStart($event, 'approval')">
            <div class="icon">☑</div>
            <div class="label">审批</div>
          </div>
          <div class="node-item copy" draggable="true" @dragstart="handleDragStart($event, 'copy')">
            <div class="icon">☆</div>
            <div class="label">抄送</div>
          </div>
          <div class="node-item gateway" draggable="true" @dragstart="handleDragStart($event, 'gateway')">
            <div class="icon">◇</div>
            <div class="label">网关</div>
          </div>
          <div class="node-item condition" draggable="true" @dragstart="handleDragStart($event, 'condition')">
            <div class="icon">⟐</div>
            <div class="label">条件</div>
          </div>
          <div class="node-item subtask" draggable="true" @dragstart="handleDragStart($event, 'subtask')">
            <div class="icon">⊞</div>
            <div class="label">子任务</div>
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
          <el-form label-position="top" size="small">
            <!-- 基础属性 -->
            <el-divider content-position="left">基础属性</el-divider>
            <el-form-item label="节点名称">
              <el-input v-model="selectedNode.label" />
            </el-form-item>
            <el-form-item label="节点描述">
              <el-input v-model="selectedNode.description" type="textarea" :rows="2" />
            </el-form-item>

            <!-- 任务/审批节点属性 -->
            <template v-if="selectedNode.type === 'task' || selectedNode.type === 'approval'">
              <el-divider content-position="left">审批配置</el-divider>
              <el-form-item label="处理人类型">
                <el-radio-group v-model="selectedNode.approvalType">
                  <el-radio-button value="single">单人审批</el-radio-button>
                  <el-radio-button value="multi">会签(全部通过)</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="指定审批人">
                <el-select
                  v-model="selectedNode.approvers"
                  multiple
                  placeholder="请选择审批人"
                  style="width: 100%"
                >
                  <el-option label="管理员" value="1" />
                  <el-option label="张三" value="2" />
                  <el-option label="李四" value="3" />
                  <el-option label="王五" value="4" />
                  <el-option label="赵六" value="5" />
                </el-select>
              </el-form-item>
              <el-form-item label="或选择角色">
                <el-select v-model="selectedNode.assignee" placeholder="请选择角色" clearable>
                  <el-option label="部门经理" value="manager" />
                  <el-option label="总经理" value="director" />
                  <el-option label="HR" value="hr" />
                  <el-option label="财务" value="finance" />
                </el-select>
              </el-form-item>
              <el-form-item label="允许委托">
                <el-switch v-model="selectedNode.delegatable" />
              </el-form-item>

              <el-divider content-position="left">表单配置</el-divider>
              <el-form-item label="使用的表单">
                <el-select v-model="selectedNode.formKey" placeholder="请选择表单" clearable>
                  <el-option label="请假申请单" value="leave_form" />
                  <el-option label="报销申请单" value="expense_form" />
                  <el-option label="采购申请单" value="purchase_form" />
                  <el-option label="出差申请单" value="travel_form" />
                </el-select>
              </el-form-item>

              <el-divider content-position="left">期限配置</el-divider>
              <el-form-item label="任务期限">
                <el-input-number
                  v-model="selectedNode.dueDateHours"
                  :min="1"
                  :max="720"
                  controls-position="right"
                />
                <span style="margin-left: 8px">小时</span>
              </el-form-item>
              <el-form-item label="超期处理">
                <el-select v-model="selectedNode.overdueAction" placeholder="请选择">
                  <el-option label="自动通过" value="auto_pass" />
                  <el-option label="自动拒绝" value="auto_reject" />
                  <el-option label="发送催办通知" value="notify" />
                  <el-option label="保持挂起" value="suspend" />
                </el-select>
              </el-form-item>
            </template>

            <!-- 抄送节点属性 -->
            <template v-if="selectedNode.type === 'copy'">
              <el-divider content-position="left">抄送配置</el-divider>
              <el-form-item label="指定抄送人">
                <el-select
                  v-model="selectedNode.copyUsers"
                  multiple
                  placeholder="请选择抄送人"
                  style="width: 100%"
                >
                  <el-option label="管理员" value="1" />
                  <el-option label="张三" value="2" />
                  <el-option label="李四" value="3" />
                  <el-option label="王五" value="4" />
                  <el-option label="赵六" value="5" />
                </el-select>
              </el-form-item>
              <el-form-item label="或选择角色">
                <el-select v-model="selectedNode.assignee" placeholder="请选择角色" clearable>
                  <el-option label="HR" value="hr" />
                  <el-option label="财务" value="finance" />
                  <el-option label="总经理" value="director" />
                </el-select>
              </el-form-item>
              <el-form-item label="抄送时机">
                <el-checkbox-group v-model="selectedNode.copyTypes">
                  <el-checkbox label="start">流程启动时</el-checkbox>
                  <el-checkbox label="complete">审批完成时</el-checkbox>
                  <el-checkbox label="reject">审批驳回时</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </template>

            <!-- 条件分支属性 -->
            <template v-if="selectedNode.type === 'condition'">
              <el-divider content-position="left">条件配置</el-divider>
              <div class="conditions-section">
                <div
                  v-for="(cond, idx) in selectedNode.conditions"
                  :key="cond.id"
                  class="condition-item"
                >
                  <el-input v-model="cond.name" placeholder="条件名称" style="width: 100px" />
                  <el-input
                    v-model="cond.expression"
                    placeholder="表达式，如: amount > 1000"
                    style="flex: 1"
                  />
                  <el-button type="danger" link @click="removeCondition(idx)">删除</el-button>
                </div>
                <el-button type="primary" link @click="addCondition">+ 添加条件</el-button>
              </div>
            </template>

            <!-- 网关属性 -->
            <template v-if="selectedNode.type === 'gateway'">
              <el-divider content-position="left">网关配置</el-divider>
              <el-form-item label="网关类型">
                <el-select v-model="selectedNode.gatewayType" placeholder="请选择">
                  <el-option label="并行网关" value="parallel" />
                  <el-option label="排他网关" value="exclusive" />
                  <el-option label="包容网关" value="inclusive" />
                </el-select>
              </el-form-item>
            </template>

            <!-- 子任务属性 -->
            <template v-if="selectedNode.type === 'subtask'">
              <el-divider content-position="left">子任务配置</el-divider>
              <el-form-item label="子任务模板">
                <el-select v-model="selectedNode.subtaskTemplate" placeholder="请选择">
                  <el-option label="信息确认" value="confirm" />
                  <el-option label="材料收集" value="collect" />
                  <el-option label="部门会签" value="cosign" />
                </el-select>
              </el-form-item>
              <el-form-item label="子任务处理人">
                <el-select v-model="selectedNode.assignee" placeholder="请选择" clearable>
                  <el-option label="指定人员" value="specific" />
                  <el-option label="发起人" value="initiator" />
                  <el-option label="上级" value="supervisor" />
                </el-select>
              </el-form-item>
            </template>

            <!-- 高级配置 -->
            <el-divider content-position="left">高级配置</el-divider>
            <el-form-item label="节点标识">
              <el-input v-model="selectedNode.nodeKey" placeholder="用于API调用" />
            </el-form-item>
            <el-form-item label="优先级">
              <el-slider v-model="selectedNode.priority" :min="0" :max="100" show-input />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="selectedNode.remark" type="textarea" :rows="2" />
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Document,
  Upload,
  RefreshLeft,
  RefreshRight,
} from '@element-plus/icons-vue'

const router = useRouter()

const canvasRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()

const processName = ref('请假审批')
const viewMode = ref('design')

const canvasWidth = 800
const canvasHeight = 600

interface FlowNode {
  id: string
  type: 'start' | 'end' | 'task' | 'gateway' | 'approval' | 'copy' | 'condition' | 'subtask'
  x: number
  y: number
  label: string
  description?: string
  assignee?: string
  taskType?: string
  // 审批相关配置
  approvers?: string[]
  approvalType?: 'single' | 'multi'
  // 抄送相关配置
  copyUsers?: string[]
  copyTypes?: string[]
  // 条件分支配置
  conditions?: Condition[]
  // 网关配置
  gatewayType?: 'parallel' | 'exclusive' | 'inclusive'
  // 表单配置
  formKey?: string
  // 期限配置
  dueDateHours?: number
  overdueAction?: string
  // 委托配置
  delegatable?: boolean
  // 子任务配置
  subtaskTemplate?: string
  // 高级配置
  nodeKey?: string
  priority?: number
  remark?: string
}

interface Condition {
  id: string
  name: string
  expression: string
  targetNodeId?: string
}

interface Connection {
  from: { nodeId: string; port: string }
  to: { nodeId: string; port: string }
}

const nodes = ref<FlowNode[]>([
  { id: 'start', type: 'start', x: 370, y: 50, label: '开始' },
  { id: 'task1', type: 'approval', x: 340, y: 150, label: '发起申请', description: '员工发起请假申请', approvalType: 'single' },
  { id: 'gateway1', type: 'condition', x: 340, y: 260, label: '审批条件', conditions: [] },
  { id: 'task2', type: 'approval', x: 200, y: 380, label: '部门经理审批', description: '部门经理进行审批', approvalType: 'multi' },
  { id: 'task3', type: 'copy', x: 480, y: 380, label: 'HR抄送', copyUsers: [] },
  { id: 'end', type: 'end', x: 370, y: 500, label: '结束' },
])

const connections = ref<Connection[]>([
  { from: { nodeId: 'start', port: 'bottom' }, to: { nodeId: 'task1', port: 'top' } },
  { from: { nodeId: 'task1', port: 'bottom' }, to: { nodeId: 'gateway1', port: 'top' } },
  { from: { nodeId: 'gateway1', port: 'bottom' }, to: { nodeId: 'task2', port: 'top' } },
  { from: { nodeId: 'gateway1', port: 'bottom' }, to: { nodeId: 'task3', port: 'top' } },
  { from: { nodeId: 'task2', port: 'bottom' }, to: { nodeId: 'end', port: 'top' } },
  { from: { nodeId: 'task3', port: 'bottom' }, to: { nodeId: 'end', port: 'top' } },
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
    approval: '☑',
    copy: '☆',
    gateway: '◇',
    condition: '⟐',
    subtask: '⊞',
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
    approval: '审批节点',
    copy: '抄送节点',
    gateway: '网关',
    condition: '条件分支',
    subtask: '子任务',
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

function handlePortMouseDown(_e: MouseEvent, node: FlowNode, port: string) {
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

function addCondition() {
  if (!selectedNode.value || !selectedNode.value.conditions) {
    return
  }
  selectedNode.value.conditions.push({
    id: `cond-${Date.now()}`,
    name: `条件${selectedNode.value.conditions.length + 1}`,
    expression: '',
  })
}

function removeCondition(index: number) {
  if (!selectedNode.value || !selectedNode.value.conditions) {
    return
  }
  selectedNode.value.conditions.splice(index, 1)
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
        &.approval .icon {
          color: #409eff;
        }
        &.copy .icon {
          color: #909399;
        }
        &.gateway .icon {
          color: #e6a23c;
        }
        &.condition .icon {
          color: #f0a020;
        }
        &.subtask .icon {
          color: #8c8c8c;
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
      &.approval .node-body {
        background: linear-gradient(135deg, #79bbff, #1890ff);
        color: white;
      }
      &.copy .node-body {
        background: linear-gradient(135deg, #c8c8c8, #8c8c8c);
        color: white;
      }
      &.gateway .node-body {
        background: linear-gradient(135deg, #f3d19e, #e6a23c);
        color: white;
      }
      &.condition .node-body {
        background: linear-gradient(135deg, #fbd356, #f0a020);
        color: white;
      }
      &.subtask .node-body {
        background: linear-gradient(135deg, #d8d8d8, #a6a6a6);
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

    .conditions-section {
      .condition-item {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        align-items: center;
      }
    }
  }
}
</style>
