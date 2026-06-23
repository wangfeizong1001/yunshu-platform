# 工作流模块

完整的工作流引擎模块，包含流程定义、待办/已办任务、流程实例、流程设计器。

## 核心功能

- ✅ 流程定义（CRUD + 发布/挂起/激活）
- ✅ 待办任务（审批/驳回/转办/委托/加签）
- ✅ 已办任务（查询/导出/历史）
- ✅ 流程实例（监控/终止/详情）
- ✅ 流程设计器（拖拽设计/保存/部署）

## 目录结构

```
apps/admin/src/
├── api/
│   └── workflow.api.ts          # 工作流 API 定义（35 个接口）
├── views/
│   └── workflow/
│       ├── ProcessList.vue      # 流程定义列表
│       ├── ProcessDesign.vue    # 流程设计器
│       ├── ProcessInstance.vue  # 流程实例
│       ├── TodoList.vue         # 待办任务
│       └── DoneList.vue         # 已办任务
```

## API 端点

参考 [workflow.api.ts](file:///workspace/apps/admin/src/api/workflow.api.ts)：

### 流程定义

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getProcessDefinitionPage` | GET | `/workflow/definition/page` | 分页查询流程定义 |
| `getProcessDefinition` | GET | `/workflow/definition/:id` | 获取流程定义详情 |
| `addProcessDefinition` | POST | `/workflow/definition` | 新增流程定义 |
| `updateProcessDefinition` | PUT | `/workflow/definition` | 更新流程定义 |
| `deleteProcessDefinition` | DELETE | `/workflow/definition/:id` | 删除流程定义 |
| `deployProcessDefinition` | POST | `/workflow/definition/:id/deploy` | 发布流程 |
| `suspendProcessDefinition` | POST | `/workflow/definition/:id/suspend` | 挂起流程 |
| `activateProcessDefinition` | POST | `/workflow/definition/:id/activate` | 激活流程 |

### 待办任务

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getTodoTaskPage` | GET | `/workflow/todo/page` | 查询待办任务 |
| `approveTask` | POST | `/workflow/task/approve` | 审批通过 |
| `rejectTask` | POST | `/workflow/task/reject` | 驳回 |
| `delegateTask` | POST | `/workflow/task/delegate` | 转办 |
| `assignTask` | POST | `/workflow/task/assign` | 委托 |
| `addSignTask` | POST | `/workflow/task/addsign` | 加签 |

### 已办任务

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getDoneTaskPage` | GET | `/workflow/done/page` | 查询已办任务 |
| `getProcessHistory` | GET | `/workflow/history/:processId` | 获取流程历史 |

### 流程实例

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getProcessInstancePage` | GET | `/workflow/instance/page` | 查询流程实例 |
| `terminateProcessInstance` | POST | `/workflow/instance/:id/terminate` | 终止流程 |
| `getProcessInstanceDetail` | GET | `/workflow/instance/:id` | 实例详情 |

## 使用示例

### 流程定义列表

```vue
<script setup>
import { getProcessDefinitionPage, deployProcessDefinition } from '@/api/workflow.api'

// 加载列表
async function loadList() {
  const res = await getProcessDefinitionPage({
    pageNum: 1,
    pageSize: 10,
  })
  console.log(res.rows, res.total)
}

// 发布流程
async function handleDeploy(id) {
  await deployProcessDefinition(id)
  ElMessage.success('发布成功')
}
</script>
```

### 待办任务审批

```vue
<script setup>
import { getTodoTaskPage, approveTask, rejectTask } from '@/api/workflow.api'

// 加载待办
async function loadTodo() {
  const res = await getTodoTaskPage({ pageNum: 1, pageSize: 10 })
  tasks.value = res.rows
}

// 审批通过
async function handleApprove(taskId, comment) {
  await approveTask({ taskId, comment })
  ElMessage.success('审批成功')
}

// 驳回
async function handleReject(taskId, comment) {
  await rejectTask({ taskId, comment })
  ElMessage.success('已驳回')
}
</script>
```

### 流程设计器

[ProcessDesign.vue](file:///workspace/apps/admin/src/views/workflow/ProcessDesign.vue) 提供：

- 节点拖拽添加（开始/任务/网关/结束）
- 节点属性配置
- 流程连线编辑
- 保存（新增/更新）
- 发布（一键部署）

## 数据结构

### 流程定义

```typescript
interface ProcessDefinition {
  id: string
  name: string              // 流程名称
  key: string               // 流程标识
  category: string          // 分类
  version: number           // 版本号
  status: 'draft' | 'active' | 'suspended'
  deployTime?: string
  createTime: string
  updateTime: string
  description?: string
  xml?: string              // BPMN XML
}
```

### 任务

```typescript
interface Task {
  id: string
  processId: string         // 流程实例 ID
  name: string              // 任务名称
  assignee: string          // 处理人
  startTime: string
  endTime?: string
  status: 'pending' | 'completed' | 'rejected'
  comment?: string
  variables?: Record<string, unknown>
}
```

### 流程实例

```typescript
interface ProcessInstance {
  id: string
  definitionId: string
  definitionName: string
  businessKey?: string
  startUser: string
  startTime: string
  endTime?: string
  status: 'running' | 'completed' | 'terminated'
  duration?: string
}
```

## 权限控制

使用 `v-has-permi` 指令控制按钮权限：

```vue
<el-button v-has-permi="['workflow:process:add']" @click="handleAdd">
  新增流程
</el-button>

<el-button v-has-permi="['workflow:process:deploy']" @click="handleDeploy">
  发布
</el-button>
```

## 状态流转

```
草稿 (draft) → 发布 (active) → 挂起 (suspended) → 激活 (active)
                                       ↓
                                  终止 (terminated)
```

## 相关文档

- 📖 [API 客户端文档](/api-client/)
- 📖 [权限设计](/guide/permission)
- 📖 [错误处理](/guide/error-handling)
