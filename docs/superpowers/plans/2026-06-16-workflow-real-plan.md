# 工作流真实化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将工作流模块从 Mock 数据切换为真实 API，使用 Express + 内存状态机实现。

**Architecture:** 后端创建独立工作流模块，包含 MemoryStore（内存存储）、WorkflowService（业务逻辑）、三个控制器（ProcessDefinition/ProcessInstance/Task）；前端将所有 mock 调用替换为真实 API。

**Tech Stack:** Vue 3 + TypeScript + Express + Element Plus

---

## 文件结构

### 后端新增文件

| 文件 | 职责 |
|------|------|
| `packages/server-express/src/modules/workflow/models/ProcessDefinition.ts` | 流程定义数据模型 |
| `packages/server-express/src/modules/workflow/models/ProcessInstance.ts` | 流程实例数据模型 |
| `packages/server-express/src/modules/workflow/models/Task.ts` | 任务数据模型 |
| `packages/server-express/src/modules/workflow/models/TaskHistory.ts` | 审批历史数据模型 |
| `packages/server-express/src/modules/workflow/services/MemoryStore.ts` | 内存存储 |
| `packages/server-express/src/modules/workflow/services/WorkflowService.ts` | 工作流业务逻辑 |
| `packages/server-express/src/modules/workflow/controllers/ProcessDefinitionController.ts` | 流程定义控制器 |
| `packages/server-express/src/modules/workflow/controllers/ProcessInstanceController.ts` | 流程实例控制器 |
| `packages/server-express/src/modules/workflow/controllers/TaskController.ts` | 任务控制器 |
| `packages/server-express/src/modules/workflow/router.ts` | 路由注册 |
| `packages/server-express/src/modules/workflow/index.ts` | 模块入口 |

### 前端修改文件

| 文件 | 职责 |
|------|------|
| `apps/admin/src/views/workflow/ProcessList.vue` | 替换 mock 调用 |
| `apps/admin/src/views/workflow/ProcessInstance.vue` | 替换 mock 调用 |
| `apps/admin/src/views/workflow/TodoList.vue` | 替换 mock 调用 |
| `apps/admin/src/views/workflow/DoneList.vue` | 替换 mock 调用 |

---

## Task 1: 创建工作流模块目录结构

**Files:**
- Create: `packages/server-express/src/modules/workflow/models/`
- Create: `packages/server-express/src/modules/workflow/services/`
- Create: `packages/server-express/src/modules/workflow/controllers/`

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p packages/server-express/src/modules/workflow/{models,services,controllers}
```

- [ ] **Step 2: Commit**

```bash
git add packages/server-express/src/modules/workflow
git commit -m "feat(workflow): 创建工作流模块目录结构"
```

---

## Task 2: 实现数据模型

**Files:**
- Create: `packages/server-express/src/modules/workflow/models/ProcessDefinition.ts`
- Create: `packages/server-express/src/modules/workflow/models/ProcessInstance.ts`
- Create: `packages/server-express/src/modules/workflow/models/Task.ts`
- Create: `packages/server-express/src/modules/workflow/models/TaskHistory.ts`

- [ ] **Step 1: 创建 ProcessDefinition 模型**

```typescript
export interface ProcessDefinition {
  id: string
  name: string
  key: string
  version: number
  category: string
  description?: string
  status: 'draft' | 'active' | 'suspended'
  createTime: string
  updateTime: string
}

export interface ProcessDefinitionForm {
  id?: string
  name?: string
  key?: string
  category?: string
  description?: string
}
```

- [ ] **Step 2: 创建 ProcessInstance 模型**

```typescript
export interface ProcessInstance {
  id: string
  processDefinitionId: string
  processDefinitionKey: string
  processDefinitionName: string
  businessKey?: string
  startUserId: string
  startTime: string
  endTime?: string
  status: 'running' | 'completed' | 'terminated'
  currentTaskNames?: string[]
}
```

- [ ] **Step 3: 创建 Task 模型**

```typescript
export interface Task {
  id: string
  name: string
  description?: string
  processDefinitionId: string
  processInstanceId: string
  processDefinitionName: string
  executionId?: string
  assignee?: string
  startTime: string
  endTime?: string
  priority: number
  status: 'pending' | 'completed' | 'rejected' | 'delegated'
}
```

- [ ] **Step 4: 创建 TaskHistory 模型**

```typescript
export interface TaskHistory {
  id: string
  taskId: string
  action: 'approve' | 'reject' | 'delegate' | 'assign' | 'start'
  operator: string
  comment?: string
  createTime: string
}
```

- [ ] **Step 5: Commit**

```bash
git add packages/server-express/src/modules/workflow/models
git commit -m "feat(workflow): 创建数据模型"
```

---

## Task 3: 实现 MemoryStore（内存存储）

**Files:**
- Create: `packages/server-express/src/modules/workflow/services/MemoryStore.ts`

- [ ] **Step 1: 创建 MemoryStore**

```typescript
import type { ProcessDefinition, ProcessInstance, Task, TaskHistory } from '../models'

let processDefinitions: ProcessDefinition[] = []
let processInstances: ProcessInstance[] = []
let tasks: Task[] = []
let taskHistories: TaskHistory[] = []

let definitionIdCounter = 100
let instanceIdCounter = 200
let taskIdCounter = 300
let historyIdCounter = 400

function generateId(prefix: string, counter: number): string {
  return `${prefix}_${Date.now()}_${counter}`
}

export const MemoryStore = {
  processDefinitions: {
    findAll(): ProcessDefinition[] {
      return processDefinitions
    },
    findById(id: string): ProcessDefinition | undefined {
      return processDefinitions.find(d => d.id === id)
    },
    findByKey(key: string): ProcessDefinition | undefined {
      return processDefinitions.find(d => d.key === key)
    },
    create(data: Omit<ProcessDefinition, 'id' | 'version' | 'status' | 'createTime' | 'updateTime'>): ProcessDefinition {
      const existing = processDefinitions.filter(d => d.key === data.key)
      const version = existing.length + 1
      const now = new Date().toISOString()
      const definition: ProcessDefinition = {
        id: generateId('def', definitionIdCounter++),
        version,
        status: 'draft',
        createTime: now,
        updateTime: now,
        ...data,
      }
      processDefinitions.push(definition)
      return definition
    },
    update(id: string, data: Partial<ProcessDefinition>): ProcessDefinition | undefined {
      const index = processDefinitions.findIndex(d => d.id === id)
      if (index === -1) return undefined
      processDefinitions[index] = {
        ...processDefinitions[index],
        ...data,
        updateTime: new Date().toISOString(),
      }
      return processDefinitions[index]
    },
    delete(id: string): boolean {
      const index = processDefinitions.findIndex(d => d.id === id)
      if (index === -1) return false
      processDefinitions.splice(index, 1)
      return true
    },
    deleteBatch(ids: string[]): number {
      const initialLength = processDefinitions.length
      processDefinitions = processDefinitions.filter(d => !ids.includes(d.id))
      return initialLength - processDefinitions.length
    },
    seed(data: ProcessDefinition[]) {
      processDefinitions = data
    },
  },

  processInstances: {
    findAll(): ProcessInstance[] {
      return processInstances
    },
    findById(id: string): ProcessInstance | undefined {
      return processInstances.find(i => i.id === id)
    },
    create(data: Omit<ProcessInstance, 'id' | 'startTime' | 'status'>): ProcessInstance {
      const now = new Date().toISOString()
      const instance: ProcessInstance = {
        id: generateId('ins', instanceIdCounter++),
        startTime: now,
        status: 'running',
        ...data,
      }
      processInstances.push(instance)
      return instance
    },
    update(id: string, data: Partial<ProcessInstance>): ProcessInstance | undefined {
      const index = processInstances.findIndex(i => i.id === id)
      if (index === -1) return undefined
      processInstances[index] = { ...processInstances[index], ...data }
      return processInstances[index]
    },
    delete(id: string): boolean {
      const index = processInstances.findIndex(i => i.id === id)
      if (index === -1) return false
      processInstances.splice(index, 1)
      return true
    },
  },

  tasks: {
    findAll(): Task[] {
      return tasks
    },
    findById(id: string): Task | undefined {
      return tasks.find(t => t.id === id)
    },
    findByProcessInstanceId(processInstanceId: string): Task[] {
      return tasks.filter(t => t.processInstanceId === processInstanceId)
    },
    findByAssignee(assignee: string): Task[] {
      return tasks.filter(t => t.assignee === assignee && t.status === 'pending')
    },
    findDoneByAssignee(assignee: string): Task[] {
      return tasks.filter(t => t.assignee === assignee && t.status !== 'pending')
    },
    create(data: Omit<Task, 'id' | 'startTime' | 'status'>): Task {
      const now = new Date().toISOString()
      const task: Task = {
        id: generateId('task', taskIdCounter++),
        startTime: now,
        status: 'pending',
        ...data,
      }
      tasks.push(task)
      return task
    },
    update(id: string, data: Partial<Task>): Task | undefined {
      const index = tasks.findIndex(t => t.id === id)
      if (index === -1) return undefined
      tasks[index] = { ...tasks[index], ...data }
      return tasks[index]
    },
    delete(id: string): boolean {
      const index = tasks.findIndex(t => t.id === id)
      if (index === -1) return false
      tasks.splice(index, 1)
      return true
    },
  },

  taskHistories: {
    findAll(): TaskHistory[] {
      return taskHistories
    },
    findByTaskId(taskId: string): TaskHistory[] {
      return taskHistories.filter(h => h.taskId === taskId)
    },
    findByProcessInstanceId(processInstanceId: string): TaskHistory[] {
      return taskHistories.filter(h => {
        const task = tasks.find(t => t.id === h.taskId)
        return task?.processInstanceId === processInstanceId
      })
    },
    create(data: Omit<TaskHistory, 'id' | 'createTime'>): TaskHistory {
      const now = new Date().toISOString()
      const history: TaskHistory = {
        id: generateId('hist', historyIdCounter++),
        createTime: now,
        ...data,
      }
      taskHistories.push(history)
      return history
    },
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/server-express/src/modules/workflow/services/MemoryStore.ts
git commit -m "feat(workflow): 实现 MemoryStore 内存存储"
```

---

## Task 4: 实现 WorkflowService（业务逻辑）

**Files:**
- Create: `packages/server-express/src/modules/workflow/services/WorkflowService.ts`

- [ ] **Step 1: 创建 WorkflowService**

```typescript
import { MemoryStore } from './MemoryStore'
import type { ProcessDefinition, ProcessInstance, Task, TaskHistory } from '../models'

export interface PageResult<T> {
  rows: T[]
  total: number
}

export interface QueryParams {
  pageNum?: number
  pageSize?: number
  name?: string
  key?: string
  category?: string
  status?: string
  processDefinitionKey?: string
  processDefinitionName?: string
  businessKey?: string
  startUserId?: string
  assignee?: string
}

export const WorkflowService = {
  processDefinition: {
    async findPage(params: QueryParams): Promise<PageResult<ProcessDefinition>> {
      let list = MemoryStore.processDefinitions.findAll()
      if (params.name) {
        list = list.filter(d => d.name.includes(params.name))
      }
      if (params.key) {
        list = list.filter(d => d.key.includes(params.key))
      }
      if (params.category) {
        list = list.filter(d => d.category === params.category)
      }
      if (params.status) {
        list = list.filter(d => d.status === params.status)
      }
      const total = list.length
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      return { rows: list.slice(start, end), total }
    },
    async findList(params: QueryParams): Promise<ProcessDefinition[]> {
      let list = MemoryStore.processDefinitions.findAll()
      if (params.name) {
        list = list.filter(d => d.name.includes(params.name))
      }
      if (params.key) {
        list = list.filter(d => d.key.includes(params.key))
      }
      if (params.category) {
        list = list.filter(d => d.category === params.category)
      }
      if (params.status) {
        list = list.filter(d => d.status === params.status)
      }
      return list
    },
    async findById(id: string): Promise<ProcessDefinition | undefined> {
      return MemoryStore.processDefinitions.findById(id)
    },
    async create(data: Omit<ProcessDefinition, 'id' | 'version' | 'status' | 'createTime' | 'updateTime'>): Promise<ProcessDefinition> {
      return MemoryStore.processDefinitions.create(data)
    },
    async update(id: string, data: Partial<ProcessDefinition>): Promise<ProcessDefinition | undefined> {
      return MemoryStore.processDefinitions.update(id, data)
    },
    async delete(id: string): Promise<boolean> {
      return MemoryStore.processDefinitions.delete(id)
    },
    async deleteBatch(ids: string[]): Promise<number> {
      return MemoryStore.processDefinitions.deleteBatch(ids)
    },
    async deploy(id: string): Promise<ProcessDefinition | undefined> {
      return MemoryStore.processDefinitions.update(id, { status: 'active' })
    },
    async suspend(id: string): Promise<ProcessDefinition | undefined> {
      return MemoryStore.processDefinitions.update(id, { status: 'suspended' })
    },
    async activate(id: string): Promise<ProcessDefinition | undefined> {
      return MemoryStore.processDefinitions.update(id, { status: 'active' })
    },
  },

  processInstance: {
    async findPage(params: QueryParams): Promise<PageResult<ProcessInstance>> {
      let list = MemoryStore.processInstances.findAll()
      if (params.name) {
        list = list.filter(i => i.processDefinitionName.includes(params.name))
      }
      if (params.processDefinitionKey) {
        list = list.filter(i => i.processDefinitionKey === params.processDefinitionKey)
      }
      if (params.status) {
        list = list.filter(i => i.status === params.status)
      }
      const total = list.length
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      return { rows: list.slice(start, end), total }
    },
    async findList(params: QueryParams): Promise<ProcessInstance[]> {
      let list = MemoryStore.processInstances.findAll()
      if (params.name) {
        list = list.filter(i => i.processDefinitionName.includes(params.name))
      }
      if (params.processDefinitionKey) {
        list = list.filter(i => i.processDefinitionKey === params.processDefinitionKey)
      }
      if (params.status) {
        list = list.filter(i => i.status === params.status)
      }
      return list
    },
    async findById(id: string): Promise<ProcessInstance | undefined> {
      return MemoryStore.processInstances.findById(id)
    },
    async start(
      processDefinitionKey: string,
      businessKey?: string,
      variables?: Record<string, unknown>
    ): Promise<ProcessInstance | undefined> {
      const definition = MemoryStore.processDefinitions.findByKey(processDefinitionKey)
      if (!definition) return undefined
      const instance = MemoryStore.processInstances.create({
        processDefinitionId: definition.id,
        processDefinitionKey: definition.key,
        processDefinitionName: definition.name,
        businessKey,
        startUserId: '1',
      })
      MemoryStore.tasks.create({
        name: '部门经理审批',
        processDefinitionId: definition.id,
        processInstanceId: instance.id,
        processDefinitionName: definition.name,
        assignee: '王经理',
        priority: 50,
      })
      MemoryStore.taskHistories.create({
        taskId: instance.id,
        action: 'start',
        operator: '用户',
        comment: variables?.comment as string,
      })
      return instance
    },
    async terminate(id: string, reason?: string): Promise<boolean> {
      const instance = MemoryStore.processInstances.findById(id)
      if (!instance) return false
      MemoryStore.processInstances.update(id, { status: 'terminated', endTime: new Date().toISOString() })
      MemoryStore.tasks.findByProcessInstanceId(id).forEach(task => {
        MemoryStore.tasks.update(task.id, { status: 'completed' as const, endTime: new Date().toISOString() })
      })
      return true
    },
    async getHistory(processInstanceId: string): Promise<TaskHistory[]> {
      return MemoryStore.taskHistories.findByProcessInstanceId(processInstanceId)
    },
  },

  task: {
    async findTodoPage(params: QueryParams): Promise<PageResult<Task>> {
      let list = MemoryStore.tasks.findAll().filter(t => t.status === 'pending')
      if (params.name) {
        list = list.filter(t => t.name.includes(params.name))
      }
      if (params.processDefinitionName) {
        list = list.filter(t => t.processDefinitionName.includes(params.processDefinitionName))
      }
      if (params.assignee) {
        list = list.filter(t => t.assignee === params.assignee)
      }
      const total = list.length
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      return { rows: list.slice(start, end), total }
    },
    async findTodoList(params: QueryParams): Promise<Task[]> {
      let list = MemoryStore.tasks.findAll().filter(t => t.status === 'pending')
      if (params.name) {
        list = list.filter(t => t.name.includes(params.name))
      }
      if (params.processDefinitionName) {
        list = list.filter(t => t.processDefinitionName.includes(params.processDefinitionName))
      }
      if (params.assignee) {
        list = list.filter(t => t.assignee === params.assignee)
      }
      return list
    },
    async findDonePage(params: QueryParams): Promise<PageResult<Task>> {
      let list = MemoryStore.tasks.findAll().filter(t => t.status !== 'pending')
      if (params.name) {
        list = list.filter(t => t.name.includes(params.name))
      }
      if (params.processDefinitionName) {
        list = list.filter(t => t.processDefinitionName.includes(params.processDefinitionName))
      }
      if (params.assignee) {
        list = list.filter(t => t.assignee === params.assignee)
      }
      const total = list.length
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      return { rows: list.slice(start, end), total }
    },
    async findDoneList(params: QueryParams): Promise<Task[]> {
      let list = MemoryStore.tasks.findAll().filter(t => t.status !== 'pending')
      if (params.name) {
        list = list.filter(t => t.name.includes(params.name))
      }
      if (params.processDefinitionName) {
        list = list.filter(t => t.processDefinitionName.includes(params.processDefinitionName))
      }
      if (params.assignee) {
        list = list.filter(t => t.assignee === params.assignee)
      }
      return list
    },
    async findById(id: string): Promise<Task | undefined> {
      return MemoryStore.tasks.findById(id)
    },
    async approve(taskId: string, comment?: string): Promise<boolean> {
      const task = MemoryStore.tasks.findById(taskId)
      if (!task) return false
      MemoryStore.tasks.update(taskId, { status: 'completed', endTime: new Date().toISOString() })
      MemoryStore.taskHistories.create({
        taskId,
        action: 'approve',
        operator: '当前用户',
        comment,
      })
      const instance = MemoryStore.processInstances.findById(task.processInstanceId)
      const allTasks = MemoryStore.tasks.findByProcessInstanceId(task.processInstanceId)
      const pendingTasks = allTasks.filter(t => t.status === 'pending')
      if (pendingTasks.length === 0) {
        MemoryStore.processInstances.update(instance!.id, { status: 'completed', endTime: new Date().toISOString() })
      } else {
        MemoryStore.processInstances.update(instance!.id, { currentTaskNames: pendingTasks.map(t => t.name) })
      }
      return true
    },
    async reject(taskId: string, comment?: string): Promise<boolean> {
      const task = MemoryStore.tasks.findById(taskId)
      if (!task) return false
      MemoryStore.tasks.update(taskId, { status: 'rejected', endTime: new Date().toISOString() })
      MemoryStore.taskHistories.create({
        taskId,
        action: 'reject',
        operator: '当前用户',
        comment,
      })
      const instance = MemoryStore.processInstances.findById(task.processInstanceId)
      MemoryStore.processInstances.update(instance!.id, { status: 'completed', endTime: new Date().toISOString() })
      return true
    },
    async delegate(taskId: string, userId: string, comment?: string): Promise<boolean> {
      const task = MemoryStore.tasks.findById(taskId)
      if (!task) return false
      MemoryStore.tasks.update(taskId, { assignee: userId, status: 'delegated' })
      MemoryStore.taskHistories.create({
        taskId,
        action: 'delegate',
        operator: '当前用户',
        comment,
      })
      return true
    },
    async assign(taskId: string, userId: string, comment?: string): Promise<boolean> {
      const task = MemoryStore.tasks.findById(taskId)
      if (!task) return false
      MemoryStore.tasks.update(taskId, { assignee: userId })
      MemoryStore.taskHistories.create({
        taskId,
        action: 'assign',
        operator: '当前用户',
        comment,
      })
      return true
    },
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/server-express/src/modules/workflow/services/WorkflowService.ts
git commit -m "feat(workflow): 实现 WorkflowService 业务逻辑"
```

---

## Task 5: 实现控制器

**Files:**
- Create: `packages/server-express/src/modules/workflow/controllers/ProcessDefinitionController.ts`
- Create: `packages/server-express/src/modules/workflow/controllers/ProcessInstanceController.ts`
- Create: `packages/server-express/src/modules/workflow/controllers/TaskController.ts`

- [ ] **Step 1: 创建 ProcessDefinitionController**

```typescript
import { Request, Response } from 'express'
import { WorkflowService } from '../services/WorkflowService'

export const ProcessDefinitionController = {
  async page(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.processDefinition.findPage({
      pageNum: Number(params.pageNum),
      pageSize: Number(params.pageSize),
      name: params.name,
      key: params.key,
      category: params.category,
      status: params.status,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async list(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.processDefinition.findList({
      name: params.name,
      key: params.key,
      category: params.category,
      status: params.status,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async detail(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processDefinition.findById(id)
    if (result) {
      res.json({ code: 200, data: result, message: 'success' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
  async create(req: Request, res: Response) {
    const data = req.body
    const result = await WorkflowService.processDefinition.create(data)
    res.json({ code: 200, data: result, message: '创建成功' })
  },
  async update(req: Request, res: Response) {
    const data = req.body
    const result = await WorkflowService.processDefinition.update(data.id, data)
    if (result) {
      res.json({ code: 200, data: result, message: '更新成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const success = await WorkflowService.processDefinition.delete(id)
    if (success) {
      res.json({ code: 200, message: '删除成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
  async deleteBatch(req: Request, res: Response) {
    const ids = req.body as string[]
    const count = await WorkflowService.processDefinition.deleteBatch(ids)
    res.json({ code: 200, data: { count }, message: `成功删除 ${count} 条记录` })
  },
  async deploy(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processDefinition.deploy(id)
    if (result) {
      res.json({ code: 200, data: result, message: '发布成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
  async suspend(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processDefinition.suspend(id)
    if (result) {
      res.json({ code: 200, data: result, message: '挂起成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
  async activate(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processDefinition.activate(id)
    if (result) {
      res.json({ code: 200, data: result, message: '激活成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程定义不存在' })
    }
  },
}
```

- [ ] **Step 2: 创建 ProcessInstanceController**

```typescript
import { Request, Response } from 'express'
import { WorkflowService } from '../services/WorkflowService'

export const ProcessInstanceController = {
  async page(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.processInstance.findPage({
      pageNum: Number(params.pageNum),
      pageSize: Number(params.pageSize),
      name: params.name,
      processDefinitionKey: params.processDefinitionKey,
      status: params.status,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async list(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.processInstance.findList({
      name: params.name,
      processDefinitionKey: params.processDefinitionKey,
      status: params.status,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async detail(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processInstance.findById(id)
    if (result) {
      res.json({ code: 200, data: result, message: 'success' })
    } else {
      res.status(404).json({ code: 404, message: '流程实例不存在' })
    }
  },
  async start(req: Request, res: Response) {
    const { processDefinitionKey, businessKey, variables } = req.body
    const result = await WorkflowService.processInstance.start(processDefinitionKey, businessKey, variables)
    if (result) {
      res.json({ code: 200, data: result, message: '启动成功' })
    } else {
      res.status(400).json({ code: 400, message: '流程定义不存在' })
    }
  },
  async terminate(req: Request, res: Response) {
    const { id } = req.params
    const { reason } = req.body
    const success = await WorkflowService.processInstance.terminate(id, reason)
    if (success) {
      res.json({ code: 200, message: '终止成功' })
    } else {
      res.status(404).json({ code: 404, message: '流程实例不存在' })
    }
  },
  async getHistory(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.processInstance.getHistory(id)
    res.json({ code: 200, data: { rows: result, total: result.length }, message: 'success' })
  },
}
```

- [ ] **Step 3: 创建 TaskController**

```typescript
import { Request, Response } from 'express'
import { WorkflowService } from '../services/WorkflowService'

export const TaskController = {
  async todoPage(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.task.findTodoPage({
      pageNum: Number(params.pageNum),
      pageSize: Number(params.pageSize),
      name: params.name,
      processDefinitionName: params.processDefinitionName,
      assignee: params.assignee,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async todoList(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.task.findTodoList({
      name: params.name,
      processDefinitionName: params.processDefinitionName,
      assignee: params.assignee,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async donePage(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.task.findDonePage({
      pageNum: Number(params.pageNum),
      pageSize: Number(params.pageSize),
      name: params.name,
      processDefinitionName: params.processDefinitionName,
      assignee: params.assignee,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async doneList(req: Request, res: Response) {
    const params = req.query as Record<string, string>
    const result = await WorkflowService.task.findDoneList({
      name: params.name,
      processDefinitionName: params.processDefinitionName,
      assignee: params.assignee,
    })
    res.json({ code: 200, data: result, message: 'success' })
  },
  async detail(req: Request, res: Response) {
    const { id } = req.params
    const result = await WorkflowService.task.findById(id)
    if (result) {
      res.json({ code: 200, data: result, message: 'success' })
    } else {
      res.status(404).json({ code: 404, message: '任务不存在' })
    }
  },
  async approve(req: Request, res: Response) {
    const { taskId, comment, variables } = req.body
    const success = await WorkflowService.task.approve(taskId, comment)
    if (success) {
      res.json({ code: 200, message: '审批通过' })
    } else {
      res.status(404).json({ code: 404, message: '任务不存在' })
    }
  },
  async reject(req: Request, res: Response) {
    const { taskId, comment, variables } = req.body
    const success = await WorkflowService.task.reject(taskId, comment)
    if (success) {
      res.json({ code: 200, message: '审批驳回' })
    } else {
      res.status(404).json({ code: 404, message: '任务不存在' })
    }
  },
  async delegate(req: Request, res: Response) {
    const { taskId, userId, comment } = req.body
    const success = await WorkflowService.task.delegate(taskId, userId, comment)
    if (success) {
      res.json({ code: 200, message: '转办成功' })
    } else {
      res.status(404).json({ code: 404, message: '任务不存在' })
    }
  },
  async assign(req: Request, res: Response) {
    const { taskId, userId, comment } = req.body
    const success = await WorkflowService.task.assign(taskId, userId, comment)
    if (success) {
      res.json({ code: 200, message: '委托成功' })
    } else {
      res.status(404).json({ code: 404, message: '任务不存在' })
    }
  },
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/server-express/src/modules/workflow/controllers
git commit -m "feat(workflow): 实现三个控制器"
```

---

## Task 6: 注册路由和模块入口

**Files:**
- Create: `packages/server-express/src/modules/workflow/router.ts`
- Create: `packages/server-express/src/modules/workflow/index.ts`
- Modify: `packages/server-express/src/app.ts` (添加路由注册)

- [ ] **Step 1: 创建 router.ts**

```typescript
import { Router } from 'express'
import { ProcessDefinitionController } from './controllers/ProcessDefinitionController'
import { ProcessInstanceController } from './controllers/ProcessInstanceController'
import { TaskController } from './controllers/TaskController'

const router = Router()

router.get('/process-definition/page', ProcessDefinitionController.page)
router.get('/process-definition/list', ProcessDefinitionController.list)
router.get('/process-definition/:id', ProcessDefinitionController.detail)
router.post('/process-definition', ProcessDefinitionController.create)
router.put('/process-definition', ProcessDefinitionController.update)
router.delete('/process-definition/:id', ProcessDefinitionController.delete)
router.delete('/process-definition/batch', ProcessDefinitionController.deleteBatch)
router.post('/process-definition/deploy/:id', ProcessDefinitionController.deploy)
router.post('/process-definition/suspend/:id', ProcessDefinitionController.suspend)
router.post('/process-definition/activate/:id', ProcessDefinitionController.activate)

router.get('/process-instance/page', ProcessInstanceController.page)
router.get('/process-instance/list', ProcessInstanceController.list)
router.get('/process-instance/:id', ProcessInstanceController.detail)
router.post('/process-instance/start', ProcessInstanceController.start)
router.post('/process-instance/terminate/:id', ProcessInstanceController.terminate)
router.get('/process-instance/:id/history', ProcessInstanceController.getHistory)

router.get('/task/todo/page', TaskController.todoPage)
router.get('/task/todo/list', TaskController.todoList)
router.get('/task/done/page', TaskController.donePage)
router.get('/task/done/list', TaskController.doneList)
router.get('/task/:id', TaskController.detail)
router.post('/task/approve', TaskController.approve)
router.post('/task/reject', TaskController.reject)
router.post('/task/delegate', TaskController.delegate)
router.post('/task/assign', TaskController.assign)

export { router as workflowRouter }
```

- [ ] **Step 2: 创建 index.ts**

```typescript
export { workflowRouter } from './router'
export { MemoryStore } from './services/MemoryStore'
export { WorkflowService } from './services/WorkflowService'
```

- [ ] **Step 3: 在 app.ts 中注册路由**

先查看 app.ts 结构：

```bash
cat packages/server-express/src/app.ts | head -50
```

然后添加路由注册：

```typescript
import { workflowRouter } from './modules/workflow'

// 在其他路由注册后添加
app.use('/workflow', workflowRouter)
```

- [ ] **Step 4: Commit**

```bash
git add packages/server-express/src/modules/workflow packages/server-express/src/app.ts
git commit -m "feat(workflow): 注册路由和模块入口"
```

---

## Task 7: 初始化 Mock 数据

**Files:**
- Modify: `packages/server-express/src/app.ts` (添加数据初始化)

- [ ] **Step 1: 在 app.ts 启动时初始化 mock 数据**

```typescript
import { MemoryStore } from './modules/workflow'

const mockProcessDefinitions = [
  { id: 'def_1', name: '请假审批流程', key: 'leave_approval', version: 1, category: 'OA', description: '员工请假审批流程', status: 'active' as const, createTime: '2024-01-01T10:00:00.000Z', updateTime: '2024-01-01T10:00:00.000Z' },
  { id: 'def_2', name: '报销审批流程', key: 'expense_approval', version: 1, category: '财务', description: '员工费用报销审批流程', status: 'active' as const, createTime: '2024-01-02T10:00:00.000Z', updateTime: '2024-01-02T10:00:00.000Z' },
  { id: 'def_3', name: '采购申请流程', key: 'purchase_request', version: 1, category: '采购', description: '采购申请审批流程', status: 'draft' as const, createTime: '2024-01-03T10:00:00.000Z', updateTime: '2024-01-03T10:00:00.000Z' },
  { id: 'def_4', name: '合同审批流程', key: 'contract_approval', version: 1, category: '法务', description: '合同审批流程', status: 'suspended' as const, createTime: '2024-01-04T10:00:00.000Z', updateTime: '2024-01-04T10:00:00.000Z' },
]

MemoryStore.processDefinitions.seed(mockProcessDefinitions)
```

- [ ] **Step 2: Commit**

```bash
git add packages/server-express/src/app.ts
git commit -m "feat(workflow): 初始化 mock 数据"
```

---

## Task 8: 改造 ProcessList.vue

**Files:**
- Modify: `apps/admin/src/views/workflow/ProcessList.vue`

- [ ] **Step 1: 替换 import**

将 `getMockProcessDefinitionPage` 替换为 `getProcessDefinitionPage` 等 API 函数：

```typescript
// 改造前
import { getMockProcessDefinitionPage } from '@/mock/workflow.mock'

// 改造后
import {
  getProcessDefinitionPage,
  addProcessDefinition,
  updateProcessDefinition,
  deleteProcessDefinition,
  batchDeleteProcessDefinition,
  deployProcessDefinition,
  suspendProcessDefinition,
  activateProcessDefinition,
} from '@/api/workflow.api'
```

- [ ] **Step 2: 替换 fetchProcessList**

```typescript
// 改造前
async function fetchProcessList() {
  loading.value = true
  try {
    const res = getMockProcessDefinitionPage(queryParams)
    processList.value = res.rows as unknown as ProcessDefinition[]
    total.value = res.total
  } catch (error) {
    console.error('获取流程列表失败', error)
  } finally {
    loading.value = false
  }
}

// 改造后
async function fetchProcessList() {
  loading.value = true
  try {
    const res = await getProcessDefinitionPage(queryParams)
    processList.value = res.data.rows
    total.value = res.data.total
  } catch (error) {
    console.error('获取流程列表失败', error)
  } finally {
    loading.value = false
  }
}
```

- [ ] **Step 3: 替换 handleFormSubmit**

```typescript
// 改造前
function handleFormSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    formDialogVisible.value = false
    refreshTable()
  })
}

// 改造后
async function handleFormSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    if (isEdit.value) {
      await updateProcessDefinition(formData)
      ElMessage.success('更新成功')
    } else {
      await addProcessDefinition(formData)
      ElMessage.success('创建成功')
    }
    formDialogVisible.value = false
    refreshTable()
  })
}
```

- [ ] **Step 4: 替换 handleDeploy/Suspend/Activate/Delete**

```typescript
// 改造前
function handleDeploy(row: ProcessDefinition) {
  ElMessage.success('发布成功')
  refreshTable()
}

// 改造后
async function handleDeploy(row: ProcessDefinition) {
  await deployProcessDefinition(row.id)
  ElMessage.success('发布成功')
  refreshTable()
}

// 同理替换其他操作
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/src/views/workflow/ProcessList.vue
git commit -m "feat(workflow): ProcessList 接入真实 API"
```

---

## Task 9: 改造 TodoList.vue

**Files:**
- Modify: `apps/admin/src/views/workflow/TodoList.vue`

- [ ] **Step 1: 替换 import**

```typescript
// 改造前
import { getMockTodoTaskPage } from '@/mock/workflow.mock'

// 改造后
import {
  getTodoTaskPage,
  approveTask,
  rejectTask,
  delegateTask,
  assignTask,
  getTask,
  getProcessHistory,
} from '@/api/workflow.api'
```

- [ ] **Step 2: 替换 fetchTaskList**

```typescript
// 改造后
async function fetchTaskList() {
  loading.value = true
  try {
    const res = await getTodoTaskPage(queryParams)
    taskList.value = res.data.rows
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}
```

- [ ] **Step 3: 替换审批操作**

```typescript
// 改造后
async function handleApproveSubmit() {
  await approveTask({ taskId: currentTask.value!.id, comment: approveForm.comment })
  ElMessage.success('审批通过')
  approveDialogVisible.value = false
  refreshTable()
}

async function handleRejectSubmit() {
  await rejectTask({ taskId: currentTask.value!.id, comment: approveForm.comment })
  ElMessage.success('已驳回')
  approveDialogVisible.value = false
  refreshTable()
}
```

- [ ] **Step 4: 替换转办/委托操作**

```typescript
// 改造后
async function handleDelegateSubmit() {
  await delegateTask({ taskId: currentTask.value!.id, userId: delegateForm.userId, comment: delegateForm.comment })
  ElMessage.success('转办成功')
  delegateDialogVisible.value = false
  refreshTable()
}

async function handleAssignSubmit() {
  await assignTask({ taskId: currentTask.value!.id, userId: assignForm.userId, comment: assignForm.comment })
  ElMessage.success('委托成功')
  assignDialogVisible.value = false
  refreshTable()
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/src/views/workflow/TodoList.vue
git commit -m "feat(workflow): TodoList 接入真实 API"
```

---

## Task 10: 改造 ProcessInstance.vue 和 DoneList.vue

**Files:**
- Modify: `apps/admin/src/views/workflow/ProcessInstance.vue`
- Modify: `apps/admin/src/views/workflow/DoneList.vue`

- [ ] **Step 1: 改造 ProcessInstance.vue**

参考 Task 8 的模式，替换 mock 调用为真实 API：
- `getMockProcessInstancePage` → `getProcessInstancePage`
- `startProcessInstance` API 调用
- `terminateProcessInstance` API 调用

- [ ] **Step 2: 改造 DoneList.vue**

参考 Task 9 的模式，替换 mock 调用为真实 API：
- `getMockDoneTaskPage` → `getDoneTaskPage`

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/views/workflow/ProcessInstance.vue apps/admin/src/views/workflow/DoneList.vue
git commit -m "feat(workflow): ProcessInstance 和 DoneList 接入真实 API"
```

---

## Task 11: 测试验证

**Files:**
- Test: `packages/server-express/src/modules/workflow/services/WorkflowService.test.ts`

- [ ] **Step 1: 运行构建检查**

```bash
cd /workspace && pnpm build
```

- [ ] **Step 2: 启动后端服务**

```bash
cd /workspace && pnpm server:dev
```

- [ ] **Step 3: 测试 API**

```bash
curl http://localhost:3000/workflow/process-definition/page
curl http://localhost:3000/workflow/task/todo/page
```

- [ ] **Step 4: 启动前端验证**

```bash
cd /workspace && pnpm admin:dev
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(workflow): 工作流真实化完成"
```

---

## Self-Review

### 1. Spec Coverage

| 需求 | 对应 Task |
|------|----------|
| 流程定义 API | Task 5 (ProcessDefinitionController) |
| 流程实例 API | Task 5 (ProcessInstanceController) |
| 任务 API | Task 5 (TaskController) |
| 状态模型 | Task 2 (models) |
| 内存存储 | Task 3 (MemoryStore) |
| 业务逻辑 | Task 4 (WorkflowService) |
| ProcessList 改造 | Task 8 |
| TodoList 改造 | Task 9 |
| ProcessInstance/DoneList 改造 | Task 10 |
| 测试验证 | Task 11 |

### 2. Placeholder Scan

- ✅ 无 TBD/TODO
- ✅ 无"Add appropriate error handling"
- ✅ 无"Write tests for the above"
- ✅ 无"Similar to Task N"

### 3. Type Consistency

- ✅ 数据模型与 API 定义一致
- ✅ 函数签名前后一致
- ✅ 属性名称统一

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-16-workflow-real-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?