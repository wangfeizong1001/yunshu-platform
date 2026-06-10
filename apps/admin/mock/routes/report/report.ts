/**
 * 报表管理 Mock API
 * @module mock/routes/report/report
 */

import { MockMethod } from 'vite-plugin-mock';
import { success, fail, pageResult } from '../../utils/response';
import { delay, randomDelay } from '../../utils/delay';

// 模拟报表数据
interface Report {
  reportId: number;
  reportName: string;
  reportCode: string;
  reportType: string;
  description: string;
  config: string;
  status: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  remark: string;
}

const reports: Report[] = [
  {
    reportId: 1,
    reportName: '销售数据统计',
    reportCode: 'SALES_STATISTICS',
    reportType: 'chart',
    description: '各部门月度销售数据统计分析',
    config: JSON.stringify({
      title: '销售数据统计',
      chartType: 'line',
      xAxis: '月份',
      yAxis: '销售额(万元)',
      data: [
        { month: '1月', sales: 120, target: 100 },
        { month: '2月', sales: 132, target: 110 },
        { month: '3月', sales: 101, target: 105 },
        { month: '4月', sales: 134, target: 120 },
        { month: '5月', sales: 90, target: 100 },
        { month: '6月', sales: 230, target: 180 },
      ],
    }),
    status: '0',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
    createBy: 'admin',
    remark: '用于销售部门月度分析',
  },
  {
    reportId: 2,
    reportName: '用户增长分析',
    reportCode: 'USER_GROWTH',
    reportType: 'chart',
    description: '用户注册和增长趋势分析',
    config: JSON.stringify({
      title: '用户增长分析',
      chartType: 'bar',
      xAxis: '日期',
      yAxis: '用户数',
      data: [
        { date: '周一', newUsers: 120, activeUsers: 800 },
        { date: '周二', newUsers: 132, activeUsers: 850 },
        { date: '周三', newUsers: 101, activeUsers: 780 },
        { date: '周四', newUsers: 134, activeUsers: 900 },
        { date: '周五', newUsers: 90, activeUsers: 920 },
        { date: '周六', newUsers: 230, activeUsers: 1200 },
        { date: '周日', newUsers: 210, activeUsers: 1150 },
      ],
    }),
    status: '0',
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 16:45:00',
    createBy: 'admin',
    remark: '产品部门关注指标',
  },
  {
    reportId: 3,
    reportName: '部门人员统计',
    reportCode: 'DEPT_STATISTICS',
    reportType: 'table',
    description: '各部门人员数量统计报表',
    config: JSON.stringify({
      title: '部门人员统计',
      columns: [
        { field: 'deptName', title: '部门名称', width: 200 },
        { field: 'totalCount', title: '总人数', width: 100 },
        { field: 'maleCount', title: '男性', width: 100 },
        { field: 'femaleCount', title: '女性', width: 100 },
        { field: 'avgAge', title: '平均年龄', width: 120 },
      ],
      data: [
        { deptName: '技术部', totalCount: 45, maleCount: 35, femaleCount: 10, avgAge: 28 },
        { deptName: '产品部', totalCount: 12, maleCount: 6, femaleCount: 6, avgAge: 26 },
        { deptName: '设计部', totalCount: 8, maleCount: 2, femaleCount: 6, avgAge: 25 },
        { deptName: '市场部', totalCount: 20, maleCount: 10, femaleCount: 10, avgAge: 27 },
        { deptName: '财务部', totalCount: 6, maleCount: 2, femaleCount: 4, avgAge: 30 },
      ],
    }),
    status: '0',
    createTime: '2024-01-05 11:20:00',
    updateTime: '2024-01-15 09:30:00',
    createBy: 'admin',
    remark: '人力资源统计',
  },
  {
    reportId: 4,
    reportName: '订单收入分析',
    reportCode: 'ORDER_INCOME',
    reportType: 'chart',
    description: '订单收入趋势和占比分析',
    config: JSON.stringify({
      title: '订单收入分析',
      chartType: 'pie',
      data: [
        { category: '电子产品', value: 1048 },
        { category: '服装', value: 735 },
        { category: '食品', value: 580 },
        { category: '家居', value: 484 },
        { category: '其他', value: 300 },
      ],
    }),
    status: '1',
    createTime: '2024-01-08 15:40:00',
    updateTime: '2024-01-12 10:15:00',
    createBy: 'admin',
    remark: '待审核',
  },
];

export default [
  /**
   * 获取报表分页列表
   */
  {
    url: '/api/report/page',
    method: 'get',
    response: async ({
      query,
    }: {
      query: {
        pageNum?: string;
        pageSize?: string;
        reportName?: string;
        reportType?: string;
        status?: string;
      };
    }) => {
      await randomDelay();

      const pageNum = parseInt(query.pageNum || '1');
      const pageSize = parseInt(query.pageSize || '10');
      const { reportName, reportType, status } = query;

      let list = [...reports];

      // 筛选
      if (reportName) {
        list = list.filter((r) => r.reportName.includes(reportName));
      }
      if (reportType) {
        list = list.filter((r) => r.reportType === reportType);
      }
      if (status) {
        list = list.filter((r) => r.status === status);
      }

      // 排序
      list.sort((a, b) => b.reportId - a.reportId);

      // 分页
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);

      return pageResult(paginatedList, list.length, pageNum, pageSize);
    },
  },

  /**
   * 获取报表列表
   */
  {
    url: '/api/report/list',
    method: 'get',
    response: async ({
      query,
    }: {
      query: { reportName?: string; reportType?: string; status?: string };
    }) => {
      await delay();

      const { reportName, reportType, status } = query;

      let list = [...reports];

      if (reportName) {
        list = list.filter((r) => r.reportName.includes(reportName));
      }
      if (reportType) {
        list = list.filter((r) => r.reportType === reportType);
      }
      if (status) {
        list = list.filter((r) => r.status === status);
      }

      return success(list);
    },
  },

  /**
   * 获取报表详情
   */
  {
    url: '/api/report/:reportId',
    method: 'get',
    response: async ({ params }: { params: { reportId: string } }) => {
      await delay();

      const report = reports.find((r) => r.reportId === parseInt(params.reportId));
      if (!report) {
        return fail('报表不存在', 404);
      }

      return success(report);
    },
  },

  /**
   * 新增报表
   */
  {
    url: '/api/report',
    method: 'post',
    response: async ({ body }: { body: any }) => {
      await delay();

      // 检查报表编码是否已存在
      if (reports.some((r) => r.reportCode === body.reportCode)) {
        return fail('报表编码已存在');
      }

      const maxId = Math.max(...reports.map((r) => r.reportId));
      const newReport: Report = {
        reportId: maxId + 1,
        reportName: body.reportName,
        reportCode: body.reportCode,
        reportType: body.reportType || 'chart',
        description: body.description || '',
        config: body.config || '',
        status: body.status || '0',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        createBy: 'admin',
        remark: body.remark || '',
      };

      reports.push(newReport);
      return success(null, '新增成功');
    },
  },

  /**
   * 修改报表
   */
  {
    url: '/api/report',
    method: 'put',
    response: async ({ body }: { body: any }) => {
      await delay();

      const index = reports.findIndex((r) => r.reportId === body.reportId);
      if (index === -1) {
        return fail('报表不存在', 404);
      }

      // 检查报表编码是否与其他报表冲突
      if (
        body.reportCode &&
        reports.some((r) => r.reportCode === body.reportCode && r.reportId !== body.reportId)
      ) {
        return fail('报表编码已存在');
      }

      reports[index] = {
        ...reports[index],
        ...body,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      return success(null, '修改成功');
    },
  },

  /**
   * 删除报表
   */
  {
    url: '/api/report/:reportId',
    method: 'delete',
    response: async ({ params }: { params: { reportId: string } }) => {
      await delay();

      const index = reports.findIndex((r) => r.reportId === parseInt(params.reportId));
      if (index === -1) {
        return fail('报表不存在', 404);
      }

      reports.splice(index, 1);
      return success(null, '删除成功');
    },
  },

  /**
   * 批量删除报表
   */
  {
    url: '/api/report/batch',
    method: 'delete',
    response: async ({ body }: { body: { reportIds: number[] } }) => {
      await delay();

      const { reportIds } = body;
      if (!reportIds || reportIds.length === 0) {
        return fail('请选择要删除的报表');
      }

      const idsToDelete = reportIds;
      const originalLength = reports.length;
      const filteredReports = reports.filter((r) => !idsToDelete.includes(r.reportId));
      const deletedCount = originalLength - filteredReports.length;

      // 清空数组并重新填充
      reports.length = 0;
      reports.push(...filteredReports);

      return success(null, `删除成功${deletedCount}条`);
    },
  },

  /**
   * 获取报表数据
   */
  {
    url: '/api/report/data',
    method: 'get',
    response: async ({ query }: { query: { reportId: string } }) => {
      await delay();

      const report = reports.find((r) => r.reportId === parseInt(query.reportId));
      if (!report) {
        return fail('报表不存在', 404);
      }

      try {
        const data = JSON.parse(report.config);
        return success(data);
      } catch {
        return fail('报表配置解析失败');
      }
    },
  },

  /**
   * 导出报表
   */
  {
    url: '/api/report/export',
    method: 'get',
    response: async () => {
      await delay();

      return success({
        downloadUrl: '/downloads/report_export.xlsx',
      });
    },
  },
] as MockMethod[];
