# 批次 5：工作流真实化设计文档

## 1. 设计目标

将工作流模块从 Mock 数据切换为真实 API，使用 Express + 内存状态机实现，保持接口层稳定，为后续替换为 Camunda/Flowable 工作流引擎预留空间。

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (Vue 3)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ ProcessList  │  │   TodoList   │  │ DoneList     │          │
│  │ ProcessInst  │  │ ProcessDesign│  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────┬────────┴────────┬────────┘                   │
│                  ▼                 ▼                            │
│        ┌────────────────────────────────┐                       │
│        │         workflow.api.ts        │  ← API 层（已定义）    │
│        └────────────────────────────────┘                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        后端 (Express)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Router /workflow                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              WorkflowController                          │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  ProcessDefinitionController                       │  │   │
│  │  │  ProcessInstanceController                         │  │   │
│  │  │  TaskController                                    │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              WorkflowService (内存状态机)                │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │   │
│  │  │  Memory  │  │ State    │  │ Process  │  │ History  │ │   │
│  │  │  Store   │  │ Machine  │  │ Engine   │  │ Manager  │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
packages/server-express/src/
├── modules/
│   └── workflow/
│       ├── controllers/
│       │   ├── ProcessDefinitionController.ts
│       │   ├── ProcessInstanceController.ts
│       │   └── TaskController.ts
│       ├── services/
│       │   ├── WorkflowService.ts
│       │   └── MemoryStore.ts
│       ├── models/
│       │   ├── ProcessDefinition.ts
│       │   ├── ProcessInstance.ts
│       │   ├── Task.ts
│       │   └── TaskHistory.ts
│       ├── router.ts
│       └── index.ts
```

## 3. 核心数据模型

### 3.1 ProcessDefinition（流程定义）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 主键 |
| name | string | 是 | 流程名称 |
| key | string | 是 | 流程标识（唯一） |
| version | number | 是 | 版本号 |
| category | string | 否 | 分类（OA/财务/采购/法务/HR） |
| description | string | 否 | 描述 |
| status | string | 是 | 状态（draft/active/suspended） |
| createTime | string | 是 | 创建时间 |
| updateTime | string | 是 | 更新时间 |

### 3.2 ProcessInstance（流程实例）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 主键 |
| processDefinitionId | string | 是 | 关联流程定义 ID |
| processDefinitionKey | string | 是 | 流程标识 |
| processDefinitionName | string | 是 | 流程名称 |
| businessKey | string | 否 | 业务主键 |
| startUserId | string | 是 | 发起人 ID |
| startTime | string | 是 | 启动时间 |
| endTime | string | 否 | 结束时间 |
| status | string | 是 | 状态（running/completed/terminated） |
| currentTaskNames | string[] | 否 | 当前任务名称列表 |

### 3.3 Task（任务）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 主键 |
| name | string | 是 | 任务名称 |
| description | string | 否 | 描述 |
| processDefinitionId | string | 是 | 关联流程定义 ID |
| processInstanceId | string | 是 | 关联流程实例 ID |
| processDefinitionName | string | 是 | 流程名称 |
| executionId | string | 否 | 执行 ID |
| assignee | string | 否 | 处理人 |
| startTime | string | 是 | 创建时间 |
| endTime | string | 否 | 结束时间 |
| priority | number | 是 | 优先级（0-100） |
| status | string | 是 | 状态（pending/completed/rejected/delegated） |

### 3.4 TaskHistory（审批历史）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 主键 |
| taskId | string | 是 | 关联任务 ID |
| action | string | 是 | 操作类型（approve/reject/delegate/assign/start） |
| operator | string | 是 | 操作人 |
| comment | string | 否 | 操作意见 |
| createTime | string | 是 | 创建时间 |

## 4. 状态机设计

### 4.1 流程实例状态

```
DRAFT → ACTIVE → RUNNING → COMPLETED
                        ↘ TERMINATED
```

### 4.2 任务状态

```
PENDING → COMPLETED
        ↘ REJECTED
        ↘ DELEGATED
```

### 4.3 审批流转逻辑

以"请假审批流程"为例：

```
发起申请 → 部门经理审批 → 人事审批 → 完成
              ↓ 驳回          ↓ 驳回
           重新申请         重新申请
```

## 5. API 路由设计

### 5.1 ProcessDefinitionController

| 路径 | 方法 | 说明 |
|------|------|------|
| `/workflow/process-definition/page` | GET | 流程定义分页查询 |
| `/workflow/process-definition/list` | GET | 流程定义列表查询 |
| `/workflow/process-definition/:id` | GET | 获取流程定义详情 |
| `/workflow/process-definition` | POST | 新增流程定义 |
| `/workflow/process-definition` | PUT | 更新流程定义 |
| `/workflow/process-definition/:id` | DELETE | 删除流程定义 |
| `/workflow/process-definition/batch` | DELETE | 批量删除流程定义 |
| `/workflow/process-definition/deploy/:id` | POST | 发布流程定义 |
| `/workflow/process-definition/suspend/:id` | POST | 挂起流程定义 |
| `/workflow/process-definition/activate/:id` | POST | 激活流程定义 |

### 5.2 ProcessInstanceController

| 路径 | 方法 | 说明 |
|------|------|------|
| `/workflow/process-instance/page` | GET | 流程实例分页查询 |
| `/workflow/process-instance/list` | GET | 流程实例列表查询 |
| `/workflow/process-instance/:id` | GET | 获取流程实例详情 |
| `/workflow/process-instance/start` | POST | 启动流程实例 |
| `/workflow/process-instance/terminate/:id` | POST | 终止流程实例 |
| `/workflow/process-instance/:id/history` | GET | 获取流程历史 |

### 5.3 TaskController

| 路径 | 方法 | 说明 |
|------|------|------|
| `/workflow/task/todo/page` | GET | 待办任务分页 |
| `/workflow/task/todo/list` | GET | 待办任务列表 |
| `/workflow/task/done/page` | GET | 已办任务分页 |
| `/workflow/task/done/list` | GET | 已办任务列表 |
| `/workflow/task/:id` | GET | 获取任务详情 |
| `/workflow/task/approve` | POST | 审批通过 |
| `/workflow/task/reject` | POST | 审批驳回 |
| `/workflow/task/delegate` | POST | 转办任务 |
| `/workflow/task/assign` | POST | 委托任务 |

## 6. 前端改造方案

### 6.1 替换 Mock 数据调用

将所有 `getMockXxxPage` 替换为真实 API 调用：

```typescript
// 改造前
const res = getMockTodoTaskPage(queryParams)

// 改造后
const res = await getTodoTaskPage(queryParams)
```

### 6.2 替换操作逻辑

将所有操作从 `ElMessage.success` 替换为真实 API 调用：

```typescript
// 改造前
function handleApproveSubmit() {
  ElMessage.success('审批通过')
  approveDialogVisible.value = false
  refreshTable()
}

// 改造后
async function handleApproveSubmit() {
  await approveTask({ taskId: currentTask.value!.id, comment: approveForm.comment })
  ElMessage.success('审批通过')
  approveDialogVisible.value = false
  refreshTable()
}
```

### 6.3 涉及页面

| 页面 | 改造内容 |
|------|---------|
| ProcessList.vue | 替换流程定义 CRUD、发布、挂起、激活操作 |
| ProcessInstance.vue | 替换流程实例查询、启动、终止操作 |
| TodoList.vue | 替换待办查询、审批、驳回、转办、委托操作 |
| DoneList.vue | 替换已办查询、查看详情操作 |

## 7. 测试验证

### 7.1 API 测试用例

| 测试场景 | 预期结果 |
|---------|---------|
| 创建流程定义 | 返回 200，数据库新增记录 |
| 查询流程定义列表 | 返回分页数据 |
| 发布流程定义 | 状态从 draft 变为 active |
| 启动流程实例 | 创建实例和首个任务 |
| 查询待办任务 | 返回当前用户待办列表 |
| 审批通过 | 任务状态变为 completed，创建下一任务或结束流程 |
| 审批驳回 | 任务状态变为 rejected，流程终止 |
| 转办任务 | 任务 assignee 变更 |

### 7.2 前端测试用例

| 测试场景 | 预期结果 |
|---------|---------|
| 流程列表页面加载 | 显示真实数据 |
| 新建流程 | 调用 API 成功创建 |
| 待办列表加载 | 显示真实待办任务 |
| 审批操作 | 调用 API，表格刷新 |
| 转办操作 | 调用 API，任务转移 |

## 8. 实现步骤

1. 创建后端工作流模块目录结构
2. 实现 MemoryStore（内存存储）
3. 实现 WorkflowService（业务逻辑）
4. 实现三个控制器
5. 注册路由
6. 改造前端页面替换 Mock 调用
7. 测试验证

## 9. 向后兼容

- API 接口层保持与前端 `workflow.api.ts` 定义完全一致
- 后续可无缝替换为 Camunda/Flowable，无需修改前端代码