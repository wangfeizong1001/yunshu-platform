"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// mock/routes/report/report.ts
var report_exports = {};
__export(report_exports, {
  default: () => report_default
});
module.exports = __toCommonJS(report_exports);

// mock/utils/response.ts
function success(data, msg = "\u64CD\u4F5C\u6210\u529F") {
  return { code: 200, msg, data };
}
function fail(msg = "\u64CD\u4F5C\u5931\u8D25", code = 500) {
  return { code, msg };
}
function pageResult(list, total, pageNum, pageSize) {
  return {
    code: 200,
    msg: "\u67E5\u8BE2\u6210\u529F",
    data: {
      rows: list,
      total
    },
    total,
    pageNum,
    pageSize
  };
}

// mock/utils/delay.ts
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function randomDelay(minMs = 200, maxMs = 700) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(ms);
}

// mock/routes/report/report.ts
var reports = [
  {
    reportId: 1,
    reportName: "\u9500\u552E\u6570\u636E\u7EDF\u8BA1",
    reportCode: "SALES_STATISTICS",
    reportType: "chart",
    description: "\u5404\u90E8\u95E8\u6708\u5EA6\u9500\u552E\u6570\u636E\u7EDF\u8BA1\u5206\u6790",
    config: JSON.stringify({
      title: "\u9500\u552E\u6570\u636E\u7EDF\u8BA1",
      chartType: "line",
      xAxis: "\u6708\u4EFD",
      yAxis: "\u9500\u552E\u989D(\u4E07\u5143)",
      data: [
        { month: "1\u6708", sales: 120, target: 100 },
        { month: "2\u6708", sales: 132, target: 110 },
        { month: "3\u6708", sales: 101, target: 105 },
        { month: "4\u6708", sales: 134, target: 120 },
        { month: "5\u6708", sales: 90, target: 100 },
        { month: "6\u6708", sales: 230, target: 180 }
      ]
    }),
    status: "0",
    createTime: "2024-01-15 10:30:00",
    updateTime: "2024-01-20 14:20:00",
    createBy: "admin",
    remark: "\u7528\u4E8E\u9500\u552E\u90E8\u95E8\u6708\u5EA6\u5206\u6790"
  },
  {
    reportId: 2,
    reportName: "\u7528\u6237\u589E\u957F\u5206\u6790",
    reportCode: "USER_GROWTH",
    reportType: "chart",
    description: "\u7528\u6237\u6CE8\u518C\u548C\u589E\u957F\u8D8B\u52BF\u5206\u6790",
    config: JSON.stringify({
      title: "\u7528\u6237\u589E\u957F\u5206\u6790",
      chartType: "bar",
      xAxis: "\u65E5\u671F",
      yAxis: "\u7528\u6237\u6570",
      data: [
        { date: "\u5468\u4E00", newUsers: 120, activeUsers: 800 },
        { date: "\u5468\u4E8C", newUsers: 132, activeUsers: 850 },
        { date: "\u5468\u4E09", newUsers: 101, activeUsers: 780 },
        { date: "\u5468\u56DB", newUsers: 134, activeUsers: 900 },
        { date: "\u5468\u4E94", newUsers: 90, activeUsers: 920 },
        { date: "\u5468\u516D", newUsers: 230, activeUsers: 1200 },
        { date: "\u5468\u65E5", newUsers: 210, activeUsers: 1150 }
      ]
    }),
    status: "0",
    createTime: "2024-01-10 09:15:00",
    updateTime: "2024-01-18 16:45:00",
    createBy: "admin",
    remark: "\u4EA7\u54C1\u90E8\u95E8\u5173\u6CE8\u6307\u6807"
  },
  {
    reportId: 3,
    reportName: "\u90E8\u95E8\u4EBA\u5458\u7EDF\u8BA1",
    reportCode: "DEPT_STATISTICS",
    reportType: "table",
    description: "\u5404\u90E8\u95E8\u4EBA\u5458\u6570\u91CF\u7EDF\u8BA1\u62A5\u8868",
    config: JSON.stringify({
      title: "\u90E8\u95E8\u4EBA\u5458\u7EDF\u8BA1",
      columns: [
        { field: "deptName", title: "\u90E8\u95E8\u540D\u79F0", width: 200 },
        { field: "totalCount", title: "\u603B\u4EBA\u6570", width: 100 },
        { field: "maleCount", title: "\u7537\u6027", width: 100 },
        { field: "femaleCount", title: "\u5973\u6027", width: 100 },
        { field: "avgAge", title: "\u5E73\u5747\u5E74\u9F84", width: 120 }
      ],
      data: [
        { deptName: "\u6280\u672F\u90E8", totalCount: 45, maleCount: 35, femaleCount: 10, avgAge: 28 },
        { deptName: "\u4EA7\u54C1\u90E8", totalCount: 12, maleCount: 6, femaleCount: 6, avgAge: 26 },
        { deptName: "\u8BBE\u8BA1\u90E8", totalCount: 8, maleCount: 2, femaleCount: 6, avgAge: 25 },
        { deptName: "\u5E02\u573A\u90E8", totalCount: 20, maleCount: 10, femaleCount: 10, avgAge: 27 },
        { deptName: "\u8D22\u52A1\u90E8", totalCount: 6, maleCount: 2, femaleCount: 4, avgAge: 30 }
      ]
    }),
    status: "0",
    createTime: "2024-01-05 11:20:00",
    updateTime: "2024-01-15 09:30:00",
    createBy: "admin",
    remark: "\u4EBA\u529B\u8D44\u6E90\u7EDF\u8BA1"
  },
  {
    reportId: 4,
    reportName: "\u8BA2\u5355\u6536\u5165\u5206\u6790",
    reportCode: "ORDER_INCOME",
    reportType: "chart",
    description: "\u8BA2\u5355\u6536\u5165\u8D8B\u52BF\u548C\u5360\u6BD4\u5206\u6790",
    config: JSON.stringify({
      title: "\u8BA2\u5355\u6536\u5165\u5206\u6790",
      chartType: "pie",
      data: [
        { category: "\u7535\u5B50\u4EA7\u54C1", value: 1048 },
        { category: "\u670D\u88C5", value: 735 },
        { category: "\u98DF\u54C1", value: 580 },
        { category: "\u5BB6\u5C45", value: 484 },
        { category: "\u5176\u4ED6", value: 300 }
      ]
    }),
    status: "1",
    createTime: "2024-01-08 15:40:00",
    updateTime: "2024-01-12 10:15:00",
    createBy: "admin",
    remark: "\u5F85\u5BA1\u6838"
  }
];
var report_default = [
  /**
   * 获取报表分页列表
   */
  {
    url: "/api/report/page",
    method: "get",
    response: async ({
      query
    }) => {
      await randomDelay();
      const pageNum = parseInt(query.pageNum || "1");
      const pageSize = parseInt(query.pageSize || "10");
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
      list.sort((a, b) => b.reportId - a.reportId);
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);
      return pageResult(paginatedList, list.length, pageNum, pageSize);
    }
  },
  /**
   * 获取报表列表
   */
  {
    url: "/api/report/list",
    method: "get",
    response: async ({
      query
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
    }
  },
  /**
   * 获取报表详情
   */
  {
    url: "/api/report/:reportId",
    method: "get",
    response: async ({ params }) => {
      await delay();
      const report = reports.find((r) => r.reportId === parseInt(params.reportId));
      if (!report) {
        return fail("\u62A5\u8868\u4E0D\u5B58\u5728", 404);
      }
      return success(report);
    }
  },
  /**
   * 新增报表
   */
  {
    url: "/api/report",
    method: "post",
    response: async ({ body }) => {
      await delay();
      if (reports.some((r) => r.reportCode === body.reportCode)) {
        return fail("\u62A5\u8868\u7F16\u7801\u5DF2\u5B58\u5728");
      }
      const maxId = Math.max(...reports.map((r) => r.reportId));
      const newReport = {
        reportId: maxId + 1,
        reportName: body.reportName,
        reportCode: body.reportCode,
        reportType: body.reportType || "chart",
        description: body.description || "",
        config: body.config || "",
        status: body.status || "0",
        createTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        createBy: "admin",
        remark: body.remark || ""
      };
      reports.push(newReport);
      return success(null, "\u65B0\u589E\u6210\u529F");
    }
  },
  /**
   * 修改报表
   */
  {
    url: "/api/report",
    method: "put",
    response: async ({ body }) => {
      await delay();
      const index = reports.findIndex((r) => r.reportId === body.reportId);
      if (index === -1) {
        return fail("\u62A5\u8868\u4E0D\u5B58\u5728", 404);
      }
      if (body.reportCode && reports.some((r) => r.reportCode === body.reportCode && r.reportId !== body.reportId)) {
        return fail("\u62A5\u8868\u7F16\u7801\u5DF2\u5B58\u5728");
      }
      reports[index] = {
        ...reports[index],
        ...body,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ")
      };
      return success(null, "\u4FEE\u6539\u6210\u529F");
    }
  },
  /**
   * 删除报表
   */
  {
    url: "/api/report/:reportId",
    method: "delete",
    response: async ({ params }) => {
      await delay();
      const index = reports.findIndex((r) => r.reportId === parseInt(params.reportId));
      if (index === -1) {
        return fail("\u62A5\u8868\u4E0D\u5B58\u5728", 404);
      }
      reports.splice(index, 1);
      return success(null, "\u5220\u9664\u6210\u529F");
    }
  },
  /**
   * 批量删除报表
   */
  {
    url: "/api/report/batch",
    method: "delete",
    response: async ({ body }) => {
      await delay();
      const { reportIds } = body;
      if (!reportIds || reportIds.length === 0) {
        return fail("\u8BF7\u9009\u62E9\u8981\u5220\u9664\u7684\u62A5\u8868");
      }
      const idsToDelete = reportIds;
      const originalLength = reports.length;
      const filteredReports = reports.filter((r) => !idsToDelete.includes(r.reportId));
      const deletedCount = originalLength - filteredReports.length;
      reports.length = 0;
      reports.push(...filteredReports);
      return success(null, `\u5220\u9664\u6210\u529F${deletedCount}\u6761`);
    }
  },
  /**
   * 获取报表数据
   */
  {
    url: "/api/report/data",
    method: "get",
    response: async ({ query }) => {
      await delay();
      const report = reports.find((r) => r.reportId === parseInt(query.reportId));
      if (!report) {
        return fail("\u62A5\u8868\u4E0D\u5B58\u5728", 404);
      }
      try {
        const data = JSON.parse(report.config);
        return success(data);
      } catch {
        return fail("\u62A5\u8868\u914D\u7F6E\u89E3\u6790\u5931\u8D25");
      }
    }
  },
  /**
   * 导出报表
   */
  {
    url: "/api/report/export",
    method: "get",
    response: async () => {
      await delay();
      return success({
        downloadUrl: "/downloads/report_export.xlsx"
      });
    }
  }
];
