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

// mock/routes/dashboard/dashboard.ts
var dashboard_exports = {};
__export(dashboard_exports, {
  default: () => dashboard_default
});
module.exports = __toCommonJS(dashboard_exports);

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

// mock/routes/dashboard/dashboard.ts
var dashboards = [
  {
    dashboardId: 1,
    dashboardName: "\u4F01\u4E1A\u8FD0\u8425\u76D1\u63A7\u5927\u5C4F",
    dashboardCode: "ENTERPRISE_MONITOR",
    description: "\u4F01\u4E1A\u6574\u4F53\u8FD0\u8425\u6570\u636E\u76D1\u63A7\u5927\u5C4F",
    config: JSON.stringify({
      title: "\u4F01\u4E1A\u8FD0\u8425\u76D1\u63A7\u5927\u5C4F",
      widgets: []
    }),
    status: "0",
    createTime: "2024-01-15 10:30:00",
    updateTime: "2024-01-20 14:20:00",
    createBy: "admin",
    remark: "\u9ED8\u8BA4\u8FD0\u8425\u76D1\u63A7"
  },
  {
    dashboardId: 2,
    dashboardName: "\u9500\u552E\u6570\u636E\u5206\u6790\u5927\u5C4F",
    dashboardCode: "SALES_ANALYSIS",
    description: "\u9500\u552E\u6570\u636E\u5B9E\u65F6\u76D1\u63A7\u4E0E\u5206\u6790",
    config: JSON.stringify({
      title: "\u9500\u552E\u6570\u636E\u5206\u6790\u5927\u5C4F",
      widgets: []
    }),
    status: "0",
    createTime: "2024-01-10 09:15:00",
    updateTime: "2024-01-18 16:45:00",
    createBy: "admin",
    remark: "\u9500\u552E\u90E8\u95E8\u4F7F\u7528"
  }
];
function getStats() {
  return {
    totalUsers: 12580,
    activeUsers: 8920,
    totalOrders: 45680,
    totalRevenue: 1258600,
    userGrowthRate: 12.5,
    orderGrowthRate: 8.3,
    revenueGrowthRate: 15.2,
    onlineUsers: 1256
  };
}
function getSalesTrend() {
  const data = [];
  const dates = [
    "1\u6708",
    "2\u6708",
    "3\u6708",
    "4\u6708",
    "5\u6708",
    "6\u6708",
    "7\u6708",
    "8\u6708",
    "9\u6708",
    "10\u6708",
    "11\u6708",
    "12\u6708"
  ];
  dates.forEach((date) => {
    data.push({
      date,
      sales: Math.floor(Math.random() * 2e5) + 5e4,
      orders: Math.floor(Math.random() * 5e3) + 1e3,
      visitors: Math.floor(Math.random() * 1e4) + 3e3
    });
  });
  return data;
}
function getRegionSales() {
  return [
    { name: "\u5317\u4EAC", value: 125800, longitude: 116.46, latitude: 39.92 },
    { name: "\u4E0A\u6D77", value: 98500, longitude: 121.48, latitude: 31.22 },
    { name: "\u5E7F\u5DDE", value: 86200, longitude: 113.23, latitude: 23.16 },
    { name: "\u6DF1\u5733", value: 78300, longitude: 114.07, latitude: 22.62 },
    { name: "\u676D\u5DDE", value: 65400, longitude: 120.19, latitude: 30.26 },
    { name: "\u6210\u90FD", value: 54200, longitude: 104.06, latitude: 30.67 },
    { name: "\u6B66\u6C49", value: 48300, longitude: 114.31, latitude: 30.52 },
    { name: "\u897F\u5B89", value: 39800, longitude: 108.95, latitude: 34.27 }
  ];
}
function getCategoryData() {
  return [
    { name: "\u7535\u5B50\u4EA7\u54C1", value: 35 },
    { name: "\u670D\u88C5", value: 25 },
    { name: "\u98DF\u54C1", value: 18 },
    { name: "\u5BB6\u5C45", value: 12 },
    { name: "\u5176\u4ED6", value: 10 }
  ];
}
function getRealTimeData() {
  return {
    timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
    data: {
      currentOrders: Math.floor(Math.random() * 100) + 50,
      currentUsers: Math.floor(Math.random() * 50) + 20,
      currentRevenue: Math.floor(Math.random() * 1e4) + 5e3
    }
  };
}
var dashboard_default = [
  /**
   * 获取大屏看板分页列表
   */
  {
    url: "/api/dashboard/list",
    method: "get",
    response: async ({
      query
    }) => {
      await randomDelay();
      const pageNum = parseInt(query.pageNum || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const { dashboardName, status } = query;
      let list = [...dashboards];
      if (dashboardName) {
        list = list.filter((d) => d.dashboardName.includes(dashboardName));
      }
      if (status) {
        list = list.filter((d) => d.status === status);
      }
      list.sort((a, b) => b.dashboardId - a.dashboardId);
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);
      return pageResult(paginatedList, list.length, pageNum, pageSize);
    }
  },
  /**
   * 获取大屏看板详情
   */
  {
    url: "/api/dashboard/:dashboardId",
    method: "get",
    response: async ({ params }) => {
      await delay();
      const dashboard = dashboards.find((d) => d.dashboardId === parseInt(params.dashboardId));
      if (!dashboard) {
        return fail("\u5927\u5C4F\u770B\u677F\u4E0D\u5B58\u5728", 404);
      }
      return success(dashboard);
    }
  },
  /**
   * 获取大屏统计数据
   */
  {
    url: "/api/dashboard/stats",
    method: "get",
    response: async () => {
      await delay();
      return success(getStats());
    }
  },
  /**
   * 获取实时数据
   */
  {
    url: "/api/dashboard/realtime",
    method: "get",
    response: async () => {
      await delay(100);
      return success(getRealTimeData());
    }
  },
  /**
   * 获取销售趋势数据
   */
  {
    url: "/api/dashboard/sales-trend",
    method: "get",
    response: async () => {
      await delay();
      return success(getSalesTrend());
    }
  },
  /**
   * 获取区域销售数据
   */
  {
    url: "/api/dashboard/region-sales",
    method: "get",
    response: async () => {
      await delay();
      return success(getRegionSales());
    }
  },
  /**
   * 获取分类占比数据
   */
  {
    url: "/api/dashboard/category",
    method: "get",
    response: async () => {
      await delay();
      return success(getCategoryData());
    }
  },
  /**
   * 新增大屏看板
   */
  {
    url: "/api/dashboard",
    method: "post",
    response: async ({ body }) => {
      await delay();
      if (dashboards.some((d) => d.dashboardCode === body.dashboardCode)) {
        return fail("\u5927\u5C4F\u7F16\u7801\u5DF2\u5B58\u5728");
      }
      const maxId = Math.max(...dashboards.map((d) => d.dashboardId));
      const newDashboard = {
        dashboardId: maxId + 1,
        dashboardName: body.dashboardName,
        dashboardCode: body.dashboardCode,
        description: body.description || "",
        config: body.config || "",
        status: body.status || "0",
        createTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        createBy: "admin",
        remark: body.remark || ""
      };
      dashboards.push(newDashboard);
      return success(null, "\u65B0\u589E\u6210\u529F");
    }
  },
  /**
   * 修改大屏看板
   */
  {
    url: "/api/dashboard",
    method: "put",
    response: async ({ body }) => {
      await delay();
      const index = dashboards.findIndex((d) => d.dashboardId === body.dashboardId);
      if (index === -1) {
        return fail("\u5927\u5C4F\u770B\u677F\u4E0D\u5B58\u5728", 404);
      }
      if (body.dashboardCode && dashboards.some(
        (d) => d.dashboardCode === body.dashboardCode && d.dashboardId !== body.dashboardId
      )) {
        return fail("\u5927\u5C4F\u7F16\u7801\u5DF2\u5B58\u5728");
      }
      dashboards[index] = {
        ...dashboards[index],
        ...body,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ")
      };
      return success(null, "\u4FEE\u6539\u6210\u529F");
    }
  },
  /**
   * 删除大屏看板
   */
  {
    url: "/api/dashboard/:dashboardId",
    method: "delete",
    response: async ({ params }) => {
      await delay();
      const index = dashboards.findIndex((d) => d.dashboardId === parseInt(params.dashboardId));
      if (index === -1) {
        return fail("\u5927\u5C4F\u770B\u677F\u4E0D\u5B58\u5728", 404);
      }
      dashboards.splice(index, 1);
      return success(null, "\u5220\u9664\u6210\u529F");
    }
  }
];
