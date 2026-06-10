/**
 * 工作流 Mock API
 * @module mock/routes/workflow
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../utils/response';
import { delay, randomDelay } from '../utils/delay';
import {
  db,
  type WorkflowDefinition,
  type WorkflowInstance,
  type WorkflowTask,
  type WorkflowHistory,
} from '../utils/database';

export default [
  // ==================== 工作流定义 ====================
  /**
   * 获取工作流定义分页列表
   */
  {
    url: '/api/workflow/definition/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: {
        pageNum?: string;
        pageSize?: string;
        definitionName?: string;
        category?: string;
        status?: string;
      };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { definitionName, category, status } = query;

      let list = [...db.workflowDefinitions];

      if (definitionName) {
        list = list.filter((d) => d.definitionName.includes(definitionName));
      }
      if (category) {
        list = list.filter((d) => d.category === category);
      }
      if (status) {
        list = list.filter((d) => d.status === status);
      }

      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取工作流定义列表
   */
  {
    url: '/api/workflow/definition/list',
    method: 'get',
    response: async ({ query }: { query: { category?: string; status?: string } }) => {
      await delay();

      const { category, status } = query;

      let list = [...db.workflowDefinitions];

      if (category) {
        list = list.filter((d) => d.category === category);
      }
      if (status) {
        list = list.filter((d) => d.status === status);
      }

      return success(list);
    },
  },

  /**
   * 获取工作流定义详情
   */
  {
    url: '/api/workflow/definition/:definitionId',
    method: 'get',
    response: async ({ params }: { params: { definitionId: string } }) => {
      await delay();

      const definition = db.workflowDefinitions.find((d) => d.definitionId === params.definitionId);
      if (!definition) {
        return fail('工作流定义不存在', 404);
      }

      return success(definition);
    },
  },

  /**
   * 新增工作流定义
   */
  {
    url: '/api/workflow/definition',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      const maxId = Math.max(
        ...db.workflowDefinitions.map((d) => parseInt(d.definitionId.replace('WF', ''))),
        0,
      );
      const newDefinition: WorkflowDefinition = {
        definitionId: `WF${String(maxId + 1).padStart(3, '0')}`,
        definitionKey: body.definitionKey,
        definitionName: body.definitionName,
        version: 1,
        category: body.category,
        description: body.description || '',
        formId: body.formId,
        formName: body.formName,
        status: body.status || '0',
        initiator: 'admin',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      db.workflowDefinitions.push(newDefinition);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改工作流定义
   */
  {
    url: '/api/workflow/definition/:definitionId',
    method: 'put',
    response: async ({ params, body }: { params: { definitionId: string }; body: any }) => {
      await delay();

      const index = db.workflowDefinitions.findIndex((d) => d.definitionId === params.definitionId);
      if (index === -1) {
        return fail('工作流定义不存在', 404);
      }

      db.workflowDefinitions[index] = {
        ...db.workflowDefinitions[index],
        ...body,
        definitionId: params.definitionId,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除工作流定义
   */
  {
    url: '/api/workflow/definition/:definitionId',
    method: 'delete',
    response: async ({ params }: { params: { definitionId: string } }) => {
      await delay();

      const index = db.workflowDefinitions.findIndex((d) => d.definitionId === params.definitionId);
      if (index === -1) {
        return fail('工作流定义不存在', 404);
      }

      db.workflowDefinitions.splice(index, 1);
      return success(null, '删除成功');
    },
  },

  /**
   * 发布工作流定义
   */
  {
    url: '/api/workflow/definition/:definitionId/publish',
    method: 'post',
    response: async ({ params }: { params: { definitionId: string } }) => {
      await delay();

      const definition = db.workflowDefinitions.find((d) => d.definitionId === params.definitionId);
      if (!definition) {
        return fail('工作流定义不存在', 404);
      }

      definition.status = '1';
      definition.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return success(null, '发布成功');
    },
  },

  /**
   * 禁用工作流定义
   */
  {
    url: '/api/workflow/definition/:definitionId/disable',
    method: 'post',
    response: async ({ params }: { params: { definitionId: string } }) => {
      await delay();

      const definition = db.workflowDefinitions.find((d) => d.definitionId === params.definitionId);
      if (!definition) {
        return fail('工作流定义不存在', 404);
      }

      definition.status = '2';
      definition.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return success(null, '禁用成功');
    },
  },

  // ==================== 工作流实例 ====================
  /**
   * 获取工作流实例分页列表
   */
  {
    url: '/api/workflow/instance/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: {
        pageNum?: string;
        pageSize?: string;
        definitionName?: string;
        status?: string;
        initiator?: string;
        beginTime?: string;
        endTime?: string;
      };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { definitionName, status, initiator, beginTime, endTime } = query;

      let list = [...db.workflowInstances];

      if (definitionName) {
        list = list.filter((i) => i.definitionName.includes(definitionName));
      }
      if (status) {
        list = list.filter((i) => i.status === status);
      }
      if (initiator) {
        list = list.filter((i) => i.initiator.includes(initiator));
      }
      if (beginTime) {
        list = list.filter((i) => i.createTime >= beginTime);
      }
      if (endTime) {
        list = list.filter((i) => i.createTime <= endTime);
      }

      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取工作流实例列表
   */
  {
    url: '/api/workflow/instance/list',
    method: 'get',
    response: async ({ query }: { query: { status?: string; initiator?: string } }) => {
      await delay();

      const { status, initiator } = query;

      let list = [...db.workflowInstances];

      if (status) {
        list = list.filter((i) => i.status === status);
      }
      if (initiator) {
        list = list.filter((i) => i.initiator.includes(initiator));
      }

      return success(list);
    },
  },

  /**
   * 获取工作流实例详情
   */
  {
    url: '/api/workflow/instance/:instanceId',
    method: 'get',
    response: async ({ params }: { params: { instanceId: string } }) => {
      await delay();

      const instance = db.workflowInstances.find((i) => i.instanceId === params.instanceId);
      if (!instance) {
        return fail('工作流实例不存在', 404);
      }

      return success(instance);
    },
  },

  /**
   * 启动工作流实例
   */
  {
    url: '/api/workflow/instance/start',
    method: 'post',
    response: async ({
      body,
    }: {
      body: { definitionId: string; businessKey: string; variables?: Record<string, any> };
    }) => {
      await delay();

      const { definitionId, businessKey, variables } = body;

      const definition = db.workflowDefinitions.find((d) => d.definitionId === definitionId);
      if (!definition) {
        return fail('工作流定义不存在', 404);
      }

      const maxId = Math.max(
        ...db.workflowInstances.map((i) => parseInt(i.instanceId.replace('INS', ''))),
        0,
      );
      const newInstance: WorkflowInstance = {
        instanceId: `INS${String(maxId + 1).padStart(3, '0')}`,
        definitionId,
        definitionName: definition.definitionName,
        businessKey,
        currentNode: 'node_start',
        currentNodeName: '发起人',
        status: 'running',
        initiator: 'admin',
        initiatorName: '管理员',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      db.workflowInstances.push(newInstance);

      // 创建第一个任务
      const newTask: WorkflowTask = {
        taskId: `TASK${Date.now()}`,
        instanceId: newInstance.instanceId,
        definitionName: definition.definitionName,
        taskName: '部门经理审批',
        taskKey: 'node_approve',
        assignee: 'wujiu',
        assigneeName: '吴九',
        priority: 50,
        status: 'pending',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        variables,
      };
      db.workflowTasks.push(newTask);

      return success({ instanceId: newInstance.instanceId }, '启动成功');
    },
  },

  /**
   * 取消工作流实例
   */
  {
    url: '/api/workflow/instance/:instanceId/cancel',
    method: 'post',
    response: async ({
      params,
    }: {
      params: { instanceId: string };
      body: { comment?: string };
    }) => {
      await delay();

      const instance = db.workflowInstances.find((i) => i.instanceId === params.instanceId);
      if (!instance) {
        return fail('工作流实例不存在', 404);
      }

      instance.status = 'cancelled';
      instance.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      return success(null, '取消成功');
    },
  },

  /**
   * 获取我的工作流实例
   */
  {
    url: '/api/workflow/instance/my',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; status?: string };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { status } = query;

      let list = db.workflowInstances.filter((i) => i.initiator === 'admin');

      if (status) {
        list = list.filter((i) => i.status === status);
      }

      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  // ==================== 工作流任务 ====================
  /**
   * 获取待办任务分页列表
   */
  {
    url: '/api/workflow/task/todo/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; taskName?: string; priority?: string };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { taskName, priority } = query;

      let list = db.workflowTasks.filter(
        (t) => t.assignee === 'admin' && t.status !== 'completed' && t.status !== 'cancelled',
      );

      if (taskName) {
        list = list.filter((t) => t.taskName.includes(taskName));
      }
      if (priority) {
        list = list.filter((t) => String(t.priority) === priority);
      }

      list.sort((a, b) => b.priority - a.priority);

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取待签收任务列表
   */
  {
    url: '/api/workflow/task/claim/page',
    method: 'get',
    response: async ({ query }: { query: { pageNum?: string; pageSize?: string } }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');

      const list = db.workflowTasks.filter(
        (t) =>
          !t.assignee &&
          t.candidateGroups &&
          t.candidateGroups.includes('HR') &&
          t.status === 'pending',
      );

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取已办任务分页列表
   */
  {
    url: '/api/workflow/task/done/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; taskName?: string };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { taskName } = query;

      let list = db.workflowTasks.filter((t) => t.assignee === 'admin' && t.status === 'completed');

      if (taskName) {
        list = list.filter((t) => t.taskName.includes(taskName));
      }

      list.sort(
        (a, b) =>
          new Date(b.completeTime || b.createTime).getTime() -
          new Date(a.completeTime || a.createTime).getTime(),
      );

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取任务详情
   */
  {
    url: '/api/workflow/task/:taskId',
    method: 'get',
    response: async ({ params }: { params: { taskId: string } }) => {
      await delay();

      const task = db.workflowTasks.find((t) => t.taskId === params.taskId);
      if (!task) {
        return fail('任务不存在', 404);
      }

      return success(task);
    },
  },

  /**
   * 签收任务
   */
  {
    url: '/api/workflow/task/:taskId/claim',
    method: 'post',
    response: async ({ params }: { params: { taskId: string } }) => {
      await delay();

      const task = db.workflowTasks.find((t) => t.taskId === params.taskId);
      if (!task) {
        return fail('任务不存在', 404);
      }

      if (task.assignee) {
        return fail('任务已被其他人签收');
      }

      task.assignee = 'admin';
      task.assigneeName = '管理员';
      task.status = 'in_progress';

      return success(null, '签收成功');
    },
  },

  /**
   * 办理任务（审批）
   */
  {
    url: '/api/workflow/task/:taskId/complete',
    method: 'post',
    response: async ({
      params,
      body,
    }: {
      params: { taskId: string };
      body: { action: 'approve' | 'reject'; comment?: string; variables?: Record<string, any> };
    }) => {
      await delay();

      const task = db.workflowTasks.find((t) => t.taskId === params.taskId);
      if (!task) {
        return fail('任务不存在', 404);
      }

      const { action, comment, variables } = body;

      // 更新任务状态
      task.status = 'completed';
      task.completeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // 添加历史记录
      const history: WorkflowHistory = {
        historyId: `HIST${Date.now()}`,
        instanceId: task.instanceId,
        taskId: task.taskId,
        taskName: task.taskName,
        nodeName: task.taskName,
        action,
        operator: 'admin',
        operatorName: '管理员',
        comment,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        duration: 0,
      };
      db.workflowHistories.push(history);

      // 更新实例状态
      const instance = db.workflowInstances.find((i) => i.instanceId === task.instanceId);
      if (instance) {
        if (action === 'approve') {
          instance.currentNode = 'node_end';
          instance.currentNodeName = '流程结束';
          instance.status = 'completed';
          instance.endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        } else {
          instance.currentNode = 'node_start';
          instance.currentNodeName = '申请';
          instance.status = 'rejected';
        }
        instance.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }

      return success(null, action === 'approve' ? '审批通过' : '审批驳回');
    },
  },

  /**
   * 转派任务
   */
  {
    url: '/api/workflow/task/:taskId/delegate',
    method: 'post',
    response: async ({
      params,
      body,
    }: {
      params: { taskId: string };
      body: { assignee: string; comment?: string };
    }) => {
      await delay();

      const task = db.workflowTasks.find((t) => t.taskId === params.taskId);
      if (!task) {
        return fail('任务不存在', 404);
      }

      const { assignee, comment } = body;

      // 添加历史记录
      const history: WorkflowHistory = {
        historyId: `HIST${Date.now()}`,
        instanceId: task.instanceId,
        taskId: task.taskId,
        taskName: task.taskName,
        nodeName: task.taskName,
        action: 'delegate',
        operator: 'admin',
        operatorName: '管理员',
        comment: `转派给${assignee}${comment ? ': ' + comment : ''}`,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        duration: 0,
      };
      db.workflowHistories.push(history);

      task.assignee = assignee;
      task.assigneeName = assignee;
      task.status = 'pending';

      return success(null, '转派成功');
    },
  },

  // ==================== 工作流历史 ====================
  /**
   * 获取流程历史
   */
  {
    url: '/api/workflow/history/:instanceId',
    method: 'get',
    response: async ({ params }: { params: { instanceId: string } }) => {
      await delay();

      const histories = db.workflowHistories.filter((h) => h.instanceId === params.instanceId);
      histories.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());

      return success(histories);
    },
  },

  /**
   * 获取流程图数据
   */
  {
    url: '/api/workflow/diagram/:instanceId',
    method: 'get',
    response: async ({ params }: { params: { instanceId: string } }) => {
      await delay();

      const instance = db.workflowInstances.find((i) => i.instanceId === params.instanceId);
      if (!instance) {
        return fail('流程实例不存在', 404);
      }

      // 返回简化的流程图节点信息
      const nodes = [
        {
          id: 'node_start',
          name: '发起人',
          status:
            instance.status === 'running' ||
            instance.status === 'completed' ||
            instance.status === 'rejected'
              ? 'completed'
              : 'pending',
        },
        {
          id: 'node_approve',
          name: '部门经理审批',
          status:
            instance.currentNode === 'node_approve'
              ? 'current'
              : instance.status === 'running'
                ? 'completed'
                : 'pending',
        },
        {
          id: 'node_finance',
          name: '财务审批',
          status:
            instance.currentNode === 'node_finance'
              ? 'current'
              : instance.status === 'running'
                ? 'pending'
                : 'pending',
        },
        {
          id: 'node_end',
          name: '流程结束',
          status: instance.status === 'completed' ? 'completed' : 'pending',
        },
      ];

      const edges = [
        { source: 'node_start', target: 'node_approve' },
        {
          source: 'node_approve',
          target: 'node_finance',
          condition: instance.status !== 'rejected',
        },
        { source: 'node_approve', target: 'node_end', condition: instance.status === 'rejected' },
        { source: 'node_finance', target: 'node_end' },
      ];

      return success({ nodes, edges, currentNode: instance.currentNode });
    },
  },

  // ==================== 统计接口 ====================
  /**
   * 获取工作流统计
   */
  {
    url: '/api/workflow/stats',
    response: async () => {
      await delay();

      const total = db.workflowInstances.length;
      const running = db.workflowInstances.filter((i) => i.status === 'running').length;
      const completed = db.workflowInstances.filter((i) => i.status === 'completed').length;
      const rejected = db.workflowInstances.filter((i) => i.status === 'rejected').length;
      const todoCount = db.workflowTasks.filter(
        (t) => t.assignee === 'admin' && t.status !== 'completed' && t.status !== 'cancelled',
      ).length;

      return success({
        total,
        running,
        completed,
        rejected,
        todoCount,
      });
    },
  },
] as MockMethod[];
