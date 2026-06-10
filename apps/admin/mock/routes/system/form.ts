/**
 * 表单管理 Mock API
 * @module mock/routes/system/form
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../../utils/response';
import { delay, randomDelay } from '../../utils/delay';
import { db, type Form } from '../../utils/database';

export default [
  /**
   * 获取表单分页列表
   */
  {
    url: '/api/system/form/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { pageNum?: string; pageSize?: string; formName?: string; status?: string };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { formName, status } = query;

      let list = [...db.forms];

      // 筛选
      if (formName) {
        list = list.filter((f) => f.formName.includes(formName));
      }
      if (status) {
        list = list.filter((f) => f.status === status);
      }

      // 排序
      list.sort((a, b) => b.formId - a.formId);

      // 分页
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取表单列表
   */
  {
    url: '/api/system/form/list',
    method: 'get',
    response: async ({ query }: { query: { formName?: string; status?: string } }) => {
      await delay();

      const { formName, status } = query;

      let list = [...db.forms];

      if (formName) {
        list = list.filter((f) => f.formName.includes(formName));
      }
      if (status) {
        list = list.filter((f) => f.status === status);
      }

      return success(list);
    },
  },

  /**
   * 获取表单详情
   */
  {
    url: '/api/system/form/:formId',
    method: 'get',
    response: async ({ params }: { params: { formId: string } }) => {
      await delay();

      const form = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!form) {
        return fail('表单不存在', 404);
      }

      return success(form);
    },
  },

  /**
   * 新增表单
   */
  {
    url: '/api/system/form',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      // 检查表单编码是否已存在
      if (db.forms.some((f) => f.formCode === body.formCode)) {
        return fail('表单编码已存在');
      }

      const maxId = Math.max(...db.forms.map((f) => f.formId));
      const newForm: Form = {
        formId: maxId + 1,
        formName: body.formName,
        formCode: body.formCode,
        description: body.description || '',
        components: body.components || [],
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remark: body.remark || '',
      };

      db.forms.push(newForm);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改表单
   */
  {
    url: '/api/system/form',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay();

      const index = db.forms.findIndex((f) => f.formId === body.formId);
      if (index === -1) {
        return fail('表单不存在', 404);
      }

      // 检查表单编码是否与其他表单冲突
      if (
        body.formCode &&
        db.forms.some((f) => f.formCode === body.formCode && f.formId !== body.formId)
      ) {
        return fail('表单编码已存在');
      }

      db.forms[index] = {
        ...db.forms[index],
        ...body,
        formId: body.formId, // 确保 formId 不被修改
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除表单
   */
  {
    url: '/api/system/form/:formId',
    method: 'delete',
    response: async ({ params }: { params: { formId: string } }) => {
      await delay();

      const index = db.forms.findIndex((f) => f.formId === parseInt(params.formId));
      if (index === -1) {
        return fail('表单不存在', 404);
      }

      db.forms.splice(index, 1);
      return success(null, '删除成功');
    },
  },

  /**
   * 批量删除表单
   */
  {
    url: '/api/system/form/batch',
    method: 'delete',
    response: async ({ body }: { body: { formIds: number[] } }) => {
      await delay();

      const { formIds } = body;
      if (!formIds || formIds.length === 0) {
        return fail('请选择要删除的表单');
      }

      db.forms = db.forms.filter((f) => !formIds.includes(f.formId));

      return success(null, `删除成功${formIds.length}条`);
    },
  },

  /**
   * 复制表单
   */
  {
    url: '/api/system/form/copy/:formId',
    method: 'post',
    response: async ({ params }: { params: { formId: string } }) => {
      await delay();

      const sourceForm = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!sourceForm) {
        return fail('源表单不存在', 404);
      }

      const maxId = Math.max(...db.forms.map((f) => f.formId));
      const newForm: Form = {
        ...sourceForm,
        formId: maxId + 1,
        formName: sourceForm.formName + '_副本',
        formCode: sourceForm.formCode + '_COPY',
        status: '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      db.forms.push(newForm);
      return success(newForm, '复制成功');
    },
  },

  /**
   * 发布表单
   */
  {
    url: '/api/system/form/publish/:formId',
    method: 'put',
    response: async ({ params }: { params: { formId: string } }) => {
      await delay();

      const form = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!form) {
        return fail('表单不存在', 404);
      }

      form.status = '1';
      form.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return success(null, '发布成功');
    },
  },

  /**
   * 停用表单
   */
  {
    url: '/api/system/form/stop/:formId',
    method: 'put',
    response: async ({ params }: { params: { formId: string } }) => {
      await delay();

      const form = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!form) {
        return fail('表单不存在', 404);
      }

      form.status = '0';
      form.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return success(null, '停用成功');
    },
  },

  /**
   * 提交表单数据
   */
  {
    url: '/api/system/form/data/:formId',
    method: 'post',
    response: async ({ params, body }: { params: { formId: string }; body: any }) => {
      await delay();

      const form = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!form) {
        return fail('表单不存在', 404);
      }

      if (form.status !== '1') {
        return fail('表单未发布，无法提交');
      }

      // 简单验证必填项
      for (const component of form.components) {
        if (component.required && !body[component.field]) {
          return fail(`${component.label}为必填项`);
        }
      }

      return success(null, '提交成功');
    },
  },

  /**
   * 获取表单数据列表
   */
  {
    url: '/api/system/form/data/:formId/list',
    method: 'get',
    response: async ({ params, query }: { params: { formId: string }; query: any }) => {
      await delay();

      const form = db.forms.find((f) => f.formId === parseInt(params.formId));
      if (!form) {
        return fail('表单不存在', 404);
      }

      // 这里返回空列表，实际项目中应该从数据库获取表单数据
      return success({
        total: 0,
        rows: [],
      });
    },
  },
] as MockMethod[];
