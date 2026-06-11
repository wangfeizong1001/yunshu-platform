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

// mock/routes/monitor/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);

// mock/utils/response.ts
function success(data, msg = "\u64CD\u4F5C\u6210\u529F") {
  return { code: 200, msg, data };
}

// mock/utils/delay.ts
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// mock/routes/monitor/server.ts
var server_default = [
  /**
   * 获取服务器信息
   */
  {
    url: "/api/monitor/server",
    method: "get",
    response: async () => {
      await delay(500);
      return success({
        serverName: "\u4E91\u67A2\u4E2D\u53F0\u670D\u52A1\u5668",
        os: "Linux",
        osArch: "amd64",
        cpuCount: 8,
        cpuUsage: Math.random() * 40 + 10,
        // 10-50%
        memoryUsed: Math.floor(Math.random() * 8 + 8),
        // 8-16GB
        memoryTotal: 16,
        memoryUsage: Math.random() * 30 + 20,
        // 20-50%
        diskUsed: Math.floor(Math.random() * 200 + 100),
        // 100-300GB
        diskTotal: 500,
        diskUsage: Math.random() * 30 + 20,
        // 20-50%
        bootTime: "2024-01-01 08:00:00",
        uptime: Math.floor(Date.now() / 1e3) - 1704067200,
        jvm: "OpenJDK 17.0.9",
        javaVersion: "17.0.9",
        database: "PostgreSQL",
        databaseVersion: "16.0",
        projectPath: "/opt/yunshu/server",
        hostName: "yunshu-server-01",
        collectTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19)
      });
    }
  },
  /**
   * 获取CPU信息
   */
  {
    url: "/api/monitor/server/cpu",
    method: "get",
    response: async () => {
      await delay();
      return success({
        coreCount: 8,
        usage: Math.random() * 40 + 10,
        model: "Intel(R) Xeon(R) Platinum 8260C CPU @ 2.40GHz"
      });
    }
  },
  /**
   * 获取内存信息
   */
  {
    url: "/api/monitor/server/memory",
    method: "get",
    response: async () => {
      await delay();
      return success({
        used: Math.floor(Math.random() * 8 + 8),
        total: 16,
        usage: Math.random() * 30 + 20,
        unit: "GB"
      });
    }
  },
  /**
   * 获取磁盘信息
   */
  {
    url: "/api/monitor/server/disk",
    method: "get",
    response: async () => {
      await delay();
      return success({
        used: Math.floor(Math.random() * 200 + 100),
        total: 500,
        usage: Math.random() * 30 + 20,
        unit: "GB"
      });
    }
  },
  /**
   * 获取JVM信息
   */
  {
    url: "/api/monitor/server/jvm",
    method: "get",
    response: async () => {
      await delay();
      return success({
        name: "OpenJDK 64-Bit Server VM",
        version: "17.0.9",
        runtime: "OpenJDK Runtime Environment",
        startTime: "2024-01-01 08:00:00",
        uptime: Math.floor((Date.now() - (/* @__PURE__ */ new Date("2024-01-01T08:00:00")).getTime()) / 1e3)
      });
    }
  }
];
