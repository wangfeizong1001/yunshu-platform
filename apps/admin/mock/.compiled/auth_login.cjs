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

// mock/routes/auth/login.ts
var login_exports = {};
__export(login_exports, {
  default: () => login_default
});
module.exports = __toCommonJS(login_exports);

// mock/utils/response.ts
function success(data, msg = "\u64CD\u4F5C\u6210\u529F") {
  return { code: 200, msg, data };
}
function fail(msg = "\u64CD\u4F5C\u5931\u8D25", code = 500) {
  return { code, msg };
}

// mock/utils/delay.ts
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function randomDelay(minMs = 200, maxMs = 700) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(ms);
}

// mock/utils/database.ts
function randomIP() {
  const segments = [
    Math.floor(Math.random() * 223) + 1,
    // 1-223 (排除0和224-255)
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ];
  if (segments[0] === 127 && segments[1] === 0 && segments[2] === 0) {
    segments[0] = 192;
  }
  return segments.join(".");
}
var CITIES = [
  "\u5317\u4EAC\u5E02",
  "\u4E0A\u6D77\u5E02",
  "\u5E7F\u5DDE\u5E02",
  "\u6DF1\u5733\u5E02",
  "\u676D\u5DDE\u5E02",
  "\u5357\u4EAC\u5E02",
  "\u6B66\u6C49\u5E02",
  "\u6210\u90FD\u5E02",
  "\u897F\u5B89\u5E02",
  "\u91CD\u5E86\u5E02",
  "\u5929\u6D25\u5E02",
  "\u82CF\u5DDE\u5E02",
  "\u957F\u6C99\u5E02",
  "\u90D1\u5DDE\u5E02",
  "\u9752\u5C9B\u5E02",
  "\u6D4E\u5357\u5E02",
  "\u5408\u80A5\u5E02",
  "\u798F\u5DDE\u5E02",
  "\u53A6\u95E8\u5E02",
  "\u5357\u660C\u5E02",
  "\u6606\u660E\u5E02",
  "\u8D35\u9633\u5E02",
  "\u5357\u5B81\u5E02",
  "\u6D77\u53E3\u5E02",
  "\u77F3\u5BB6\u5E84\u5E02",
  "\u54C8\u5C14\u6EE8\u5E02",
  "\u957F\u6625\u5E02",
  "\u6C88\u9633\u5E02",
  "\u5927\u8FDE\u5E02",
  "\u592A\u539F\u5E02",
  "\u5170\u5DDE\u5E02"
];
function randomCity() {
  return CITIES[Math.floor(Math.random() * CITIES.length)];
}
function randomDateTime(daysAgo = 30) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysAgo * 24 * 60 * 60 * 1e3);
  return new Date(now - offset).toISOString().replace("T", " ").slice(0, 19);
}
var BROWSERS = [
  "Chrome",
  "Firefox",
  "Safari",
  "Edge",
  "360\u5B89\u5168\u6D4F\u89C8\u5668",
  "QQ\u6D4F\u89C8\u5668",
  "\u5FAE\u4FE1\u5185\u7F6E\u6D4F\u89C8\u5668"
];
function randomBrowser() {
  return BROWSERS[Math.floor(Math.random() * BROWSERS.length)];
}
var OS_LIST = [
  "Windows 10",
  "Windows 11",
  "macOS",
  "Linux",
  "Ubuntu",
  "iOS",
  "Android",
  "HarmonyOS"
];
function randomOS() {
  return OS_LIST[Math.floor(Math.random() * OS_LIST.length)];
}
var db = {
  users: [
    // 超级管理员
    {
      userId: 1,
      username: "admin",
      password: "admin123",
      nickname: "\u7BA1\u7406\u5458",
      email: "admin@yunshu.com",
      phone: "15888888888",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 100,
      postId: [1],
      roleId: [1],
      loginIp: "127.0.0.1",
      loginDate: "2024-01-01 10:00:00",
      createTime: "2024-01-01 10:00:00",
      remark: "\u7CFB\u7EDF\u7BA1\u7406\u5458"
    },
    // 研发部 - 前端组
    {
      userId: 2,
      username: "zhangsan",
      password: "user123",
      nickname: "\u5F20\u4E09",
      email: "zhangsan@yunshu.com",
      phone: "13800138001",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 104,
      postId: [2],
      roleId: [2],
      loginIp: "192.168.1.100",
      loginDate: "2024-01-15 08:30:00",
      createTime: "2024-01-10 10:00:00",
      remark: "\u524D\u7AEF\u7EC4\u7EC4\u957F"
    },
    {
      userId: 3,
      username: "lisi",
      password: "user123",
      nickname: "\u674E\u56DB",
      email: "lisi@yunshu.com",
      phone: "13800138002",
      sex: "1",
      avatar: "",
      status: "0",
      deptId: 104,
      postId: [3],
      roleId: [3],
      loginIp: "192.168.1.101",
      loginDate: "2024-01-16 09:00:00",
      createTime: "2024-01-12 10:00:00",
      remark: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08"
    },
    {
      userId: 4,
      username: "wangwu",
      password: "user123",
      nickname: "\u738B\u4E94",
      email: "wangwu@yunshu.com",
      phone: "13800138003",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 104,
      postId: [3],
      roleId: [3],
      loginIp: "192.168.1.102",
      loginDate: "2024-01-17 10:00:00",
      createTime: "2024-01-13 10:00:00",
      remark: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08"
    },
    // 研发部 - 后端组
    {
      userId: 5,
      username: "zhaoliu",
      password: "user123",
      nickname: "\u8D75\u516D",
      email: "zhaoliu@yunshu.com",
      phone: "13800138004",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 105,
      postId: [2],
      roleId: [2],
      loginIp: "192.168.1.103",
      loginDate: "2024-01-18 08:00:00",
      createTime: "2024-01-15 10:00:00",
      remark: "\u540E\u7AEF\u7EC4\u7EC4\u957F"
    },
    {
      userId: 6,
      username: "sunqi",
      password: "user123",
      nickname: "\u5B59\u4E03",
      email: "sunqi@yunshu.com",
      phone: "13800138005",
      sex: "1",
      avatar: "",
      status: "0",
      deptId: 105,
      postId: [3],
      roleId: [3],
      loginIp: "192.168.1.104",
      loginDate: "2024-01-19 09:00:00",
      createTime: "2024-01-16 10:00:00",
      remark: "\u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08"
    },
    {
      userId: 7,
      username: "zhouba",
      password: "user123",
      nickname: "\u5468\u516B",
      email: "zhouba@yunshu.com",
      phone: "13800138006",
      sex: "0",
      avatar: "",
      status: "1",
      deptId: 105,
      postId: [3],
      roleId: [3],
      loginIp: "",
      loginDate: "",
      createTime: "2024-01-20 10:00:00",
      remark: "\u5DF2\u79BB\u804C"
    },
    // 产品部
    {
      userId: 8,
      username: "wujiu",
      password: "user123",
      nickname: "\u5434\u4E5D",
      email: "wujiu@yunshu.com",
      phone: "13800138007",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 102,
      postId: [6],
      roleId: [4],
      loginIp: "192.168.1.105",
      loginDate: "2024-01-21 10:00:00",
      createTime: "2024-01-18 10:00:00",
      remark: "\u4EA7\u54C1\u7ECF\u7406"
    },
    {
      userId: 9,
      username: "zhengshi",
      password: "user123",
      nickname: "\u90D1\u5341",
      email: "zhengshi@yunshu.com",
      phone: "13800138008",
      sex: "1",
      avatar: "",
      status: "0",
      deptId: 102,
      postId: [6],
      roleId: [4],
      loginIp: "192.168.1.106",
      loginDate: "2024-01-22 10:00:00",
      createTime: "2024-01-20 10:00:00",
      remark: "\u4EA7\u54C1\u52A9\u7406"
    },
    // 市场部
    {
      userId: 10,
      username: "caoshier",
      password: "user123",
      nickname: "\u66F9\u5341\u4E8C",
      email: "caoshier@yunshu.com",
      phone: "13800138009",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 103,
      postId: [7],
      roleId: [5],
      loginIp: "192.168.1.107",
      loginDate: "2024-01-23 10:00:00",
      createTime: "2024-01-21 10:00:00",
      remark: "\u5E02\u573A\u603B\u76D1"
    },
    // 财务部
    {
      userId: 11,
      username: "dengshisan",
      password: "user123",
      nickname: "\u9093\u5341\u4E09",
      email: "dengshisan@yunshu.com",
      phone: "13800138010",
      sex: "1",
      avatar: "",
      status: "0",
      deptId: 106,
      postId: [8],
      roleId: [5],
      loginIp: "192.168.1.108",
      loginDate: "2024-01-24 10:00:00",
      createTime: "2024-01-22 10:00:00",
      remark: "\u8D22\u52A1\u7ECF\u7406"
    },
    // 人力资源部
    {
      userId: 12,
      username: "caotianxia",
      password: "user123",
      nickname: "\u66F9\u5929\u4E0B",
      email: "caotianxia@yunshu.com",
      phone: "13800138011",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 107,
      postId: [9],
      roleId: [5],
      loginIp: "192.168.1.109",
      loginDate: "2024-01-25 10:00:00",
      createTime: "2024-01-23 10:00:00",
      remark: "HR\u7ECF\u7406"
    },
    // 测试部
    {
      userId: 13,
      username: "pengan",
      password: "user123",
      nickname: "\u5F6D\u5B89",
      email: "pengan@yunshu.com",
      phone: "13800138012",
      sex: "1",
      avatar: "",
      status: "0",
      deptId: 108,
      postId: [4],
      roleId: [3],
      loginIp: "192.168.1.110",
      loginDate: "2024-01-26 10:00:00",
      createTime: "2024-01-24 10:00:00",
      remark: "\u6D4B\u8BD5\u5DE5\u7A0B\u5E08"
    },
    // 运维部
    {
      userId: 14,
      username: "caoli",
      password: "user123",
      nickname: "\u64CD\u793C",
      email: "caoli@yunshu.com",
      phone: "13800138013",
      sex: "0",
      avatar: "",
      status: "0",
      deptId: 109,
      postId: [5],
      roleId: [6],
      loginIp: "192.168.1.111",
      loginDate: "2024-01-27 10:00:00",
      createTime: "2024-01-25 10:00:00",
      remark: "\u8FD0\u7EF4\u5DE5\u7A0B\u5E08"
    },
    // 停用状态用户
    {
      userId: 99,
      username: "disabled_user",
      password: "user123",
      nickname: "\u5DF2\u505C\u7528\u7528\u6237",
      email: "disabled@yunshu.com",
      phone: "13999999999",
      sex: "0",
      avatar: "",
      status: "1",
      deptId: 103,
      postId: [7],
      roleId: [5],
      loginIp: "",
      loginDate: "",
      createTime: "2024-01-01 10:00:00",
      remark: "\u5DF2\u505C\u7528"
    }
  ],
  roles: [
    // 超级管理员 - 全部数据权限
    {
      roleId: 1,
      roleName: "\u8D85\u7EA7\u7BA1\u7406\u5458",
      roleKey: "admin",
      roleSort: 1,
      dataScope: "1",
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: "0",
      permissions: ["*:*:*"],
      remark: "\u7CFB\u7EDF\u6700\u9AD8\u6743\u9650",
      createTime: "2024-01-01 10:00:00"
    },
    // 运维人员 - 自定义数据权限
    {
      roleId: 2,
      roleName: "\u8FD0\u7EF4\u4EBA\u5458",
      roleKey: "operator",
      roleSort: 2,
      dataScope: "2",
      menuCheckStrictly: true,
      deptCheckStrictly: false,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:user:add",
        "system:user:edit",
        "system:user:remove",
        "system:role:list",
        "system:role:query",
        "system:role:add",
        "system:role:edit",
        "system:role:remove",
        "system:menu:list",
        "system:menu:query",
        "system:dept:list",
        "system:dept:query",
        "system:post:list",
        "system:post:query",
        "monitor:server:view",
        "monitor:server:list",
        "monitor:job:list",
        "monitor:job:query",
        "monitor:job:add",
        "monitor:job:edit",
        "monitor:job:remove",
        "monitor:job:execute"
      ],
      remark: "\u7CFB\u7EDF\u8FD0\u7EF4\u89D2\u8272\uFF0C\u8D1F\u8D23\u7CFB\u7EDF\u65E5\u5E38\u7EF4\u62A4",
      createTime: "2024-01-05 10:00:00"
    },
    // 开发人员 - 本部门及以下数据权限
    {
      roleId: 3,
      roleName: "\u5F00\u53D1\u4EBA\u5458",
      roleKey: "developer",
      roleSort: 3,
      dataScope: "4",
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:role:list",
        "system:role:query",
        "system:menu:list",
        "system:menu:query",
        "system:dept:list",
        "system:dept:query",
        "tool:gen:list",
        "tool:gen:query",
        "tool:gen:add",
        "tool:gen:edit",
        "tool:gen:remove"
      ],
      remark: "\u7814\u53D1\u4EBA\u5458\uFF0C\u53EF\u8FDB\u884C\u4EE3\u7801\u751F\u6210",
      createTime: "2024-01-08 10:00:00"
    },
    // 普通用户 - 本部门数据权限
    {
      roleId: 4,
      roleName: "\u666E\u901A\u7528\u6237",
      roleKey: "user",
      roleSort: 4,
      dataScope: "5",
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:role:list",
        "system:role:query",
        "system:menu:list",
        "system:menu:query"
      ],
      remark: "\u666E\u901A\u7528\u6237\u89D2\u8272\uFF0C\u4EC5\u53EF\u67E5\u770B\u57FA\u7840\u4FE1\u606F",
      createTime: "2024-01-08 10:00:00"
    },
    // 部门主管 - 本部门及以下数据权限
    {
      roleId: 5,
      roleName: "\u90E8\u95E8\u4E3B\u7BA1",
      roleKey: "dept_manager",
      roleSort: 5,
      dataScope: "4",
      menuCheckStrictly: true,
      deptCheckStrictly: false,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:user:add",
        "system:user:edit",
        "system:role:list",
        "system:role:query",
        "system:menu:list",
        "system:menu:query",
        "system:dept:list",
        "system:dept:query",
        "workflow:instance:list",
        "workflow:instance:query",
        "workflow:instance:start",
        "workflow:task:list",
        "workflow:task:query",
        "workflow:task:approve"
      ],
      remark: "\u90E8\u95E8\u8D1F\u8D23\u4EBA\uFF0C\u62E5\u6709\u5DE5\u4F5C\u6D41\u5BA1\u6279\u6743\u9650",
      createTime: "2024-01-10 10:00:00"
    },
    // 安全审计员 - 全部数据权限（仅查询）
    {
      roleId: 6,
      roleName: "\u5B89\u5168\u5BA1\u8BA1\u5458",
      roleKey: "auditor",
      roleSort: 6,
      dataScope: "1",
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:role:list",
        "system:role:query",
        "system:menu:list",
        "system:menu:query",
        "system:dept:list",
        "system:dept:query",
        "monitor:operlog:list",
        "monitor:operlog:query",
        "monitor:operlog:export",
        "monitor:logininfor:list",
        "monitor:logininfor:query",
        "monitor:logininfor:export",
        "monitor:online:list",
        "monitor:online:query",
        "monitor:server:view"
      ],
      remark: "\u5B89\u5168\u5BA1\u8BA1\u89D2\u8272\uFF0C\u53EF\u67E5\u770B\u6240\u6709\u64CD\u4F5C\u65E5\u5FD7\u548C\u767B\u5F55\u65E5\u5FD7",
      createTime: "2024-01-12 10:00:00"
    },
    // 数据管理员 - 自定义数据权限
    {
      roleId: 7,
      roleName: "\u6570\u636E\u7BA1\u7406\u5458",
      roleKey: "data_admin",
      roleSort: 7,
      dataScope: "2",
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      status: "0",
      permissions: [
        "system:user:list",
        "system:user:query",
        "system:role:list",
        "system:role:query",
        "system:menu:list",
        "system:menu:query",
        "system:dept:list",
        "system:dept:query",
        "system:post:list",
        "system:post:query",
        "system:dict:list",
        "system:dict:query",
        "system:dict:add",
        "system:dict:edit",
        "system:dict:remove",
        "system:config:list",
        "system:config:query",
        "system:config:add",
        "system:config:edit",
        "system:config:remove"
      ],
      remark: "\u6570\u636E\u7BA1\u7406\u89D2\u8272\uFF0C\u8D1F\u8D23\u5B57\u5178\u548C\u914D\u7F6E\u7BA1\u7406",
      createTime: "2024-01-15 10:00:00"
    },
    // 游客 - 仅首页权限
    {
      roleId: 99,
      roleName: "\u6E38\u5BA2",
      roleKey: "guest",
      roleSort: 99,
      dataScope: "5",
      menuCheckStrictly: false,
      deptCheckStrictly: false,
      status: "1",
      permissions: [],
      remark: "\u6E38\u5BA2\u89D2\u8272\uFF0C\u5DF2\u505C\u7528",
      createTime: "2024-01-10 10:00:00"
    }
  ],
  depts: [
    {
      deptId: 100,
      parentId: 0,
      ancestors: "0",
      deptName: "\u4E91\u67A2\u79D1\u6280",
      leader: "admin",
      phone: "010-12345678",
      email: "admin@yunshu.com",
      status: "0",
      createTime: "2024-01-01 10:00:00",
      children: [
        // 研发部
        {
          deptId: 101,
          parentId: 100,
          ancestors: "0,100",
          deptName: "\u7814\u53D1\u90E8",
          leader: "\u5F20\u4E09",
          phone: "010-12345679",
          email: "dev@yunshu.com",
          status: "0",
          createTime: "2024-01-02 10:00:00",
          children: [
            {
              deptId: 104,
              parentId: 101,
              ancestors: "0,100,101",
              deptName: "\u524D\u7AEF\u7EC4",
              leader: "\u674E\u56DB",
              phone: "010-12345680",
              email: "frontend@yunshu.com",
              status: "0",
              createTime: "2024-01-03 10:00:00"
            },
            {
              deptId: 105,
              parentId: 101,
              ancestors: "0,100,101",
              deptName: "\u540E\u7AEF\u7EC4",
              leader: "\u8D75\u516D",
              phone: "010-12345681",
              email: "backend@yunshu.com",
              status: "0",
              createTime: "2024-01-03 10:00:00"
            },
            {
              deptId: 108,
              parentId: 101,
              ancestors: "0,100,101",
              deptName: "\u6D4B\u8BD5\u7EC4",
              leader: "\u5F6D\u5B89",
              phone: "010-12345688",
              email: "qa@yunshu.com",
              status: "0",
              createTime: "2024-01-10 10:00:00"
            },
            {
              deptId: 109,
              parentId: 101,
              ancestors: "0,100,101",
              deptName: "\u8FD0\u7EF4\u7EC4",
              leader: "\u64CD\u793C",
              phone: "010-12345689",
              email: "ops@yunshu.com",
              status: "0",
              createTime: "2024-01-10 10:00:00"
            }
          ]
        },
        // 产品部
        {
          deptId: 102,
          parentId: 100,
          ancestors: "0,100",
          deptName: "\u4EA7\u54C1\u90E8",
          leader: "\u5434\u4E5D",
          phone: "010-12345682",
          email: "product@yunshu.com",
          status: "0",
          createTime: "2024-01-02 10:00:00"
        },
        // 市场部
        {
          deptId: 103,
          parentId: 100,
          ancestors: "0,100",
          deptName: "\u5E02\u573A\u90E8",
          leader: "\u66F9\u5341\u4E8C",
          phone: "010-12345683",
          email: "market@yunshu.com",
          status: "1",
          createTime: "2024-01-02 10:00:00"
        },
        // 财务部
        {
          deptId: 106,
          parentId: 100,
          ancestors: "0,100",
          deptName: "\u8D22\u52A1\u90E8",
          leader: "\u9093\u5341\u4E09",
          phone: "010-12345686",
          email: "finance@yunshu.com",
          status: "0",
          createTime: "2024-01-05 10:00:00"
        },
        // 人力资源部
        {
          deptId: 107,
          parentId: 100,
          ancestors: "0,100",
          deptName: "\u4EBA\u529B\u8D44\u6E90\u90E8",
          leader: "\u66F9\u5929\u4E0B",
          phone: "010-12345687",
          email: "hr@yunshu.com",
          status: "0",
          createTime: "2024-01-05 10:00:00"
        }
      ]
    }
  ],
  menus: [
    {
      menuId: 1,
      parentId: 0,
      menuName: "\u5DE5\u4F5C\u53F0",
      path: "/dashboard",
      component: "LAYOUT",
      isFrame: false,
      isCache: false,
      menuType: "M",
      visible: "0",
      status: "0",
      icon: "dashboard",
      orderNum: 1,
      createTime: "2024-01-01 10:00:00"
    },
    {
      menuId: 2,
      parentId: 0,
      menuName: "\u7CFB\u7EDF\u7BA1\u7406",
      path: "/system",
      component: "LAYOUT",
      isFrame: false,
      isCache: false,
      menuType: "M",
      visible: "0",
      status: "0",
      icon: "setting",
      orderNum: 2,
      createTime: "2024-01-01 10:00:00",
      children: [
        {
          menuId: 21,
          parentId: 2,
          menuName: "\u7528\u6237\u7BA1\u7406",
          path: "user",
          component: "/system/user/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "system:user:list",
          icon: "user",
          orderNum: 1,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 22,
          parentId: 2,
          menuName: "\u89D2\u8272\u7BA1\u7406",
          path: "role",
          component: "/system/role/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "system:role:list",
          icon: "role",
          orderNum: 2,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 23,
          parentId: 2,
          menuName: "\u83DC\u5355\u7BA1\u7406",
          path: "menu",
          component: "/system/menu/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "system:menu:list",
          icon: "menu",
          orderNum: 3,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 24,
          parentId: 2,
          menuName: "\u90E8\u95E8\u7BA1\u7406",
          path: "dept",
          component: "/system/dept/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "system:dept:list",
          icon: "dept",
          orderNum: 4,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 25,
          parentId: 2,
          menuName: "\u5C97\u4F4D\u7BA1\u7406",
          path: "post",
          component: "/system/post/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "system:post:list",
          icon: "post",
          orderNum: 5,
          createTime: "2024-01-01 10:00:00"
        }
      ]
    },
    {
      menuId: 3,
      parentId: 0,
      menuName: "\u7CFB\u7EDF\u76D1\u63A7",
      path: "/monitor",
      component: "LAYOUT",
      isFrame: false,
      isCache: false,
      menuType: "M",
      visible: "0",
      status: "0",
      icon: "monitor",
      orderNum: 3,
      createTime: "2024-01-01 10:00:00",
      children: [
        {
          menuId: 31,
          parentId: 3,
          menuName: "\u64CD\u4F5C\u65E5\u5FD7",
          path: "operlog",
          component: "/monitor/operlog/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "monitor:operlog:list",
          icon: "log",
          orderNum: 1,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 32,
          parentId: 3,
          menuName: "\u767B\u5F55\u65E5\u5FD7",
          path: "logininfor",
          component: "/monitor/logininfor/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "monitor:logininfor:list",
          icon: "login",
          orderNum: 2,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 33,
          parentId: 3,
          menuName: "\u5728\u7EBF\u7528\u6237",
          path: "online",
          component: "/monitor/online/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "monitor:online:list",
          icon: "online",
          orderNum: 3,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 34,
          parentId: 3,
          menuName: "\u670D\u52A1\u76D1\u63A7",
          path: "server",
          component: "/monitor/server/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "monitor:server:list",
          icon: "server",
          orderNum: 4,
          createTime: "2024-01-01 10:00:00"
        },
        {
          menuId: 35,
          parentId: 3,
          menuName: "\u5B9A\u65F6\u4EFB\u52A1",
          path: "job",
          component: "/monitor/job/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "monitor:job:list",
          icon: "job",
          orderNum: 5,
          createTime: "2024-01-01 10:00:00"
        }
      ]
    },
    {
      menuId: 4,
      parentId: 0,
      menuName: "\u7CFB\u7EDF\u5DE5\u5177",
      path: "/tool",
      component: "LAYOUT",
      isFrame: false,
      isCache: false,
      menuType: "M",
      visible: "0",
      status: "0",
      icon: "tool",
      orderNum: 4,
      createTime: "2024-01-01 10:00:00",
      children: [
        {
          menuId: 41,
          parentId: 4,
          menuName: "\u4EE3\u7801\u751F\u6210",
          path: "gen",
          component: "/tool/gen/index",
          isFrame: false,
          isCache: false,
          menuType: "C",
          visible: "0",
          status: "0",
          perms: "tool:gen:list",
          icon: "code",
          orderNum: 1,
          createTime: "2024-01-01 10:00:00"
        }
      ]
    }
  ],
  posts: [
    {
      postId: 1,
      postCode: "CEO",
      postName: "\u9996\u5E2D\u6267\u884C\u5B98",
      postSort: 1,
      status: "0",
      remark: "\u516C\u53F8\u6700\u9AD8\u7BA1\u7406\u8005",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 2,
      postCode: "DEV_LEADER",
      postName: "\u7814\u53D1\u7EC4\u957F",
      postSort: 2,
      status: "0",
      remark: "\u7814\u53D1\u56E2\u961F\u8D1F\u8D23\u4EBA",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 3,
      postCode: "DEV",
      postName: "\u5F00\u53D1\u5DE5\u7A0B\u5E08",
      postSort: 3,
      status: "0",
      remark: "\u5F00\u53D1\u4EBA\u5458",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 4,
      postCode: "TEST",
      postName: "\u6D4B\u8BD5\u5DE5\u7A0B\u5E08",
      postSort: 4,
      status: "0",
      remark: "\u6D4B\u8BD5\u4EBA\u5458",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 5,
      postCode: "OP",
      postName: "\u8FD0\u7EF4\u5DE5\u7A0B\u5E08",
      postSort: 5,
      status: "0",
      remark: "\u8FD0\u7EF4\u4EBA\u5458",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 6,
      postCode: "PM",
      postName: "\u4EA7\u54C1\u7ECF\u7406",
      postSort: 6,
      status: "0",
      remark: "\u4EA7\u54C1\u89C4\u5212\u4E0E\u8BBE\u8BA1",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 7,
      postCode: "MARKET",
      postName: "\u5E02\u573A\u7ECF\u7406",
      postSort: 7,
      status: "1",
      remark: "\u5E02\u573A\u8425\u9500",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 8,
      postCode: "FINANCE",
      postName: "\u8D22\u52A1\u7ECF\u7406",
      postSort: 8,
      status: "0",
      remark: "\u8D22\u52A1\u7BA1\u7406",
      createTime: "2024-01-01 10:00:00"
    },
    {
      postId: 9,
      postCode: "HR",
      postName: "\u4EBA\u4E8B\u7ECF\u7406",
      postSort: 9,
      status: "0",
      remark: "\u4EBA\u529B\u8D44\u6E90\u7BA1\u7406",
      createTime: "2024-01-01 10:00:00"
    }
  ],
  operlogs: [],
  logininfors: [],
  onlineUsers: [],
  jobs: [
    {
      jobId: "1",
      jobName: "\u6570\u636E\u5907\u4EFD",
      jobGroup: "system",
      invokeTarget: "backupTask",
      cronExpression: "0 0 2 * * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "0",
      createTime: "2024-01-01 10:00:00",
      nextValidTime: "2024-02-01 02:00:00",
      runCount: 365,
      remark: "\u6BCF\u65E5\u51CC\u66682\u70B9\u6267\u884C\u6570\u636E\u5907\u4EFD"
    },
    {
      jobId: "2",
      jobName: "\u65E5\u5FD7\u6E05\u7406",
      jobGroup: "system",
      invokeTarget: "cleanLogTask",
      cronExpression: "0 0 3 * * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "0",
      createTime: "2024-01-01 10:00:00",
      nextValidTime: "2024-02-01 03:00:00",
      runCount: 180,
      remark: "\u6BCF\u65E5\u51CC\u66683\u70B9\u6E05\u740630\u5929\u524D\u7684\u65E5\u5FD7"
    },
    {
      jobId: "3",
      jobName: "\u7F13\u5B58\u5237\u65B0",
      jobGroup: "default",
      invokeTarget: "refreshCacheTask",
      cronExpression: "0 */10 * * * ?",
      misfirePolicy: "1",
      concurrent: "1",
      status: "0",
      createTime: "2024-01-05 10:00:00",
      nextValidTime: "2024-01-20 10:00:00",
      runCount: 5e3,
      remark: "\u6BCF10\u5206\u949F\u5237\u65B0\u4E00\u6B21\u7F13\u5B58"
    },
    {
      jobId: "4",
      jobName: "\u62A5\u8868\u751F\u6210",
      jobGroup: "custom",
      invokeTarget: "generateReportTask",
      cronExpression: "0 0 8 * * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "1",
      createTime: "2024-01-10 10:00:00",
      nextValidTime: "-",
      remark: "\u6BCF\u5929\u65E9\u4E0A8\u70B9\u751F\u6210\u62A5\u8868\uFF08\u5DF2\u6682\u505C\uFF09"
    },
    {
      jobId: "5",
      jobName: "\u5E93\u5B58\u9884\u8B66\u68C0\u67E5",
      jobGroup: "custom",
      invokeTarget: "inventoryAlertTask",
      cronExpression: "0 0 9 * * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "0",
      createTime: "2024-01-15 10:00:00",
      nextValidTime: "2024-02-01 09:00:00",
      runCount: 45,
      remark: "\u6BCF\u65E5\u65E9\u4E0A9\u70B9\u68C0\u67E5\u5E93\u5B58\u9884\u8B66"
    },
    {
      jobId: "6",
      jobName: "\u8BA2\u5355\u8D85\u65F6\u5904\u7406",
      jobGroup: "default",
      invokeTarget: "orderTimeoutTask",
      cronExpression: "0 */30 * * * ?",
      misfirePolicy: "1",
      concurrent: "1",
      status: "0",
      createTime: "2024-01-18 10:00:00",
      nextValidTime: "2024-01-20 10:00:00",
      runCount: 2880,
      remark: "\u6BCF30\u5206\u949F\u5904\u7406\u8D85\u65F6\u8BA2\u5355"
    },
    {
      jobId: "7",
      jobName: "\u4F1A\u5458\u79EF\u5206\u7ED3\u7B97",
      jobGroup: "custom",
      invokeTarget: "memberPointSettleTask",
      cronExpression: "0 0 0 1 * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "0",
      createTime: "2024-01-20 10:00:00",
      nextValidTime: "2024-02-01 00:00:00",
      runCount: 5,
      remark: "\u6BCF\u67081\u65E5\u51CC\u6668\u7ED3\u7B97\u4F1A\u5458\u79EF\u5206"
    },
    {
      jobId: "8",
      jobName: "\u6570\u636E\u540C\u6B65",
      jobGroup: "system",
      invokeTarget: "dataSyncTask",
      cronExpression: "0 0 */2 * * ?",
      misfirePolicy: "0",
      concurrent: "0",
      status: "2",
      createTime: "2024-01-22 10:00:00",
      nextValidTime: "-",
      remark: "\u6BCF2\u5C0F\u65F6\u540C\u6B65\u6570\u636E\uFF08\u5DF2\u7981\u7528\uFF09"
    }
  ],
  jobLogs: [],
  genTables: [
    {
      tableName: "sys_user",
      tableComment: "\u7528\u6237\u8868",
      tableSchema: "yunshu",
      engine: "PostgreSQL",
      createTime: "2024-01-01 10:00:00"
    },
    {
      tableName: "sys_role",
      tableComment: "\u89D2\u8272\u8868",
      tableSchema: "yunshu",
      engine: "PostgreSQL",
      createTime: "2024-01-01 10:00:00"
    },
    {
      tableName: "sys_menu",
      tableComment: "\u83DC\u5355\u8868",
      tableSchema: "yunshu",
      engine: "PostgreSQL",
      createTime: "2024-01-01 10:00:00"
    },
    {
      tableName: "sys_dept",
      tableComment: "\u90E8\u95E8\u8868",
      tableSchema: "yunshu",
      engine: "PostgreSQL",
      createTime: "2024-01-01 10:00:00"
    },
    {
      tableName: "sys_post",
      tableComment: "\u5C97\u4F4D\u8868",
      tableSchema: "yunshu",
      engine: "PostgreSQL",
      createTime: "2024-01-01 10:00:00"
    }
  ],
  messages: [],
  notifications: [],
  forms: [
    {
      formId: 1,
      formName: "\u5458\u5DE5\u5165\u804C\u7533\u8BF7\u8868",
      formCode: "EMPLOYEE_ENTRY",
      description: "\u7528\u4E8E\u5458\u5DE5\u5165\u804C\u65F6\u586B\u5199\u57FA\u672C\u4FE1\u606F",
      status: "1",
      createTime: "2024-01-15 10:30:00",
      updateTime: "2024-01-15 10:30:00",
      remark: "",
      components: [
        {
          id: "1",
          type: "input",
          label: "\u59D3\u540D",
          field: "name",
          placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D",
          required: true,
          disabled: false,
          rules: []
        },
        {
          id: "2",
          type: "select",
          label: "\u90E8\u95E8",
          field: "dept",
          placeholder: "\u8BF7\u9009\u62E9\u90E8\u95E8",
          required: true,
          disabled: false,
          options: [
            { label: "\u6280\u672F\u90E8", value: "tech" },
            { label: "\u4EA7\u54C1\u90E8", value: "product" },
            { label: "\u8BBE\u8BA1\u90E8", value: "design" },
            { label: "\u5E02\u573A\u90E8", value: "market" }
          ]
        },
        {
          id: "3",
          type: "date",
          label: "\u5165\u804C\u65E5\u671F",
          field: "entryDate",
          placeholder: "\u8BF7\u9009\u62E9\u5165\u804C\u65E5\u671F",
          required: true,
          disabled: false
        },
        {
          id: "4",
          type: "input",
          label: "\u8054\u7CFB\u7535\u8BDD",
          field: "phone",
          placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u7535\u8BDD",
          required: true,
          disabled: false,
          rules: ["phone"]
        },
        {
          id: "5",
          type: "textarea",
          label: "\u5907\u6CE8",
          field: "remark",
          placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8\u4FE1\u606F",
          required: false,
          disabled: false
        }
      ]
    },
    {
      formId: 2,
      formName: "\u8BF7\u5047\u7533\u8BF7\u8868",
      formCode: "LEAVE_APPLICATION",
      description: "\u7528\u4E8E\u5458\u5DE5\u8BF7\u5047\u7533\u8BF7",
      status: "1",
      createTime: "2024-01-20 14:00:00",
      updateTime: "2024-01-20 14:00:00",
      remark: "",
      components: [
        {
          id: "1",
          type: "select",
          label: "\u8BF7\u5047\u7C7B\u578B",
          field: "leaveType",
          placeholder: "\u8BF7\u9009\u62E9\u8BF7\u5047\u7C7B\u578B",
          required: true,
          disabled: false,
          options: [
            { label: "\u4E8B\u5047", value: "personal" },
            { label: "\u75C5\u5047", value: "sick" },
            { label: "\u5E74\u5047", value: "annual" },
            { label: "\u5A5A\u5047", value: "marriage" }
          ]
        },
        {
          id: "2",
          type: "datetime",
          label: "\u5F00\u59CB\u65F6\u95F4",
          field: "startTime",
          placeholder: "\u8BF7\u9009\u62E9\u5F00\u59CB\u65F6\u95F4",
          required: true,
          disabled: false
        },
        {
          id: "3",
          type: "datetime",
          label: "\u7ED3\u675F\u65F6\u95F4",
          field: "endTime",
          placeholder: "\u8BF7\u9009\u62E9\u7ED3\u675F\u65F6\u95F4",
          required: true,
          disabled: false
        },
        {
          id: "4",
          type: "textarea",
          label: "\u8BF7\u5047\u7406\u7531",
          field: "reason",
          placeholder: "\u8BF7\u8F93\u5165\u8BF7\u5047\u7406\u7531",
          required: true,
          disabled: false
        }
      ]
    },
    {
      formId: 3,
      formName: "\u62A5\u9500\u7533\u8BF7\u8868",
      formCode: "EXPENSE_APPLICATION",
      description: "\u7528\u4E8E\u5458\u5DE5\u8D39\u7528\u62A5\u9500\u7533\u8BF7",
      status: "0",
      createTime: "2024-01-25 09:00:00",
      updateTime: "2024-01-25 09:00:00",
      remark: "\u8349\u7A3F\u72B6\u6001",
      components: [
        {
          id: "1",
          type: "input",
          label: "\u62A5\u9500\u4E8B\u7531",
          field: "reason",
          placeholder: "\u8BF7\u8F93\u5165\u62A5\u9500\u4E8B\u7531",
          required: true,
          disabled: false
        },
        {
          id: "2",
          type: "number",
          label: "\u62A5\u9500\u91D1\u989D",
          field: "amount",
          placeholder: "\u8BF7\u8F93\u5165\u62A5\u9500\u91D1\u989D",
          required: true,
          disabled: false,
          min: 0.01,
          step: 0.01
        },
        {
          id: "3",
          type: "date",
          label: "\u6D88\u8D39\u65E5\u671F",
          field: "expenseDate",
          placeholder: "\u8BF7\u9009\u62E9\u6D88\u8D39\u65E5\u671F",
          required: true,
          disabled: false
        },
        {
          id: "4",
          type: "upload",
          label: "\u4E0A\u4F20\u51ED\u8BC1",
          field: "voucher",
          placeholder: "",
          required: true,
          disabled: false,
          accept: "image/*",
          maxCount: 5
        },
        {
          id: "5",
          type: "textarea",
          label: "\u5907\u6CE8",
          field: "remark",
          placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8\u4FE1\u606F",
          required: false,
          disabled: false
        }
      ]
    }
  ],
  // 工作流定义
  workflowDefinitions: [
    {
      definitionId: "WF001",
      definitionKey: "leave_approval",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      version: 1,
      category: "\u884C\u653F\u5BA1\u6279",
      description: "\u5458\u5DE5\u8BF7\u5047\u7533\u8BF7\u53CA\u5BA1\u6279\u6D41\u7A0B",
      formId: 2,
      formName: "\u8BF7\u5047\u7533\u8BF7\u8868",
      status: "1",
      initiator: "admin",
      createTime: "2024-01-10 10:00:00",
      updateTime: "2024-01-10 10:00:00"
    },
    {
      definitionId: "WF002",
      definitionKey: "expense_approval",
      definitionName: "\u8D39\u7528\u62A5\u9500\u6D41\u7A0B",
      version: 1,
      category: "\u8D22\u52A1\u5BA1\u6279",
      description: "\u5458\u5DE5\u8D39\u7528\u62A5\u9500\u7533\u8BF7\u53CA\u5BA1\u6279\u6D41\u7A0B",
      formId: 3,
      formName: "\u62A5\u9500\u7533\u8BF7\u8868",
      status: "1",
      initiator: "admin",
      createTime: "2024-01-12 10:00:00",
      updateTime: "2024-01-12 10:00:00"
    },
    {
      definitionId: "WF003",
      definitionKey: "employee_entry",
      definitionName: "\u5458\u5DE5\u5165\u804C\u6D41\u7A0B",
      version: 2,
      category: "\u4EBA\u529B\u8D44\u6E90",
      description: "\u65B0\u5458\u5DE5\u5165\u804C\u529E\u7406\u6D41\u7A0B",
      formId: 1,
      formName: "\u5458\u5DE5\u5165\u804C\u7533\u8BF7\u8868",
      status: "1",
      initiator: "admin",
      createTime: "2024-01-05 10:00:00",
      updateTime: "2024-01-18 10:00:00"
    },
    {
      definitionId: "WF004",
      definitionKey: "purchase_approval",
      definitionName: "\u91C7\u8D2D\u7533\u8BF7\u6D41\u7A0B",
      version: 1,
      category: "\u884C\u653F\u529E\u516C",
      description: "\u529E\u516C\u7528\u54C1\u53CA\u8BBE\u5907\u91C7\u8D2D\u5BA1\u6279\u6D41\u7A0B",
      status: "1",
      initiator: "admin",
      createTime: "2024-01-15 10:00:00",
      updateTime: "2024-01-15 10:00:00"
    },
    {
      definitionId: "WF005",
      definitionKey: "overtime_approval",
      definitionName: "\u52A0\u73ED\u7533\u8BF7\u6D41\u7A0B",
      version: 1,
      category: "\u884C\u653F\u7BA1\u7406",
      description: "\u5458\u5DE5\u52A0\u73ED\u7533\u8BF7\u53CA\u5BA1\u6279\u6D41\u7A0B",
      status: "0",
      initiator: "admin",
      createTime: "2024-01-20 10:00:00",
      updateTime: "2024-01-20 10:00:00"
    }
  ],
  // 工作流实例
  workflowInstances: [
    {
      instanceId: "INS001",
      definitionId: "WF001",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      businessKey: "LEAVE20240115001",
      currentNode: "node_approve",
      currentNodeName: "\u90E8\u95E8\u7ECF\u7406\u5BA1\u6279",
      status: "running",
      initiator: "zhangsan",
      initiatorName: "\u5F20\u4E09",
      createTime: "2024-01-15 09:00:00",
      updateTime: "2024-01-15 14:30:00"
    },
    {
      instanceId: "INS002",
      definitionId: "WF001",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      businessKey: "LEAVE20240116001",
      currentNode: "node_end",
      currentNodeName: "\u6D41\u7A0B\u7ED3\u675F",
      status: "completed",
      initiator: "lisi",
      initiatorName: "\u674E\u56DB",
      createTime: "2024-01-16 08:00:00",
      updateTime: "2024-01-16 10:30:00",
      endTime: "2024-01-16 10:30:00"
    },
    {
      instanceId: "INS003",
      definitionId: "WF002",
      definitionName: "\u8D39\u7528\u62A5\u9500\u6D41\u7A0B",
      businessKey: "EXPENSE20240117001",
      currentNode: "node_finance",
      currentNodeName: "\u8D22\u52A1\u5BA1\u6279",
      status: "running",
      initiator: "wangwu",
      initiatorName: "\u738B\u4E94",
      createTime: "2024-01-17 11:00:00",
      updateTime: "2024-01-18 09:00:00"
    },
    {
      instanceId: "INS004",
      definitionId: "WF003",
      definitionName: "\u5458\u5DE5\u5165\u804C\u6D41\u7A0B",
      businessKey: "ENTRY20240118001",
      currentNode: "node_hr",
      currentNodeName: "HR\u529E\u7406",
      status: "running",
      initiator: "admin",
      initiatorName: "\u7BA1\u7406\u5458",
      createTime: "2024-01-18 14:00:00",
      updateTime: "2024-01-19 10:00:00"
    },
    {
      instanceId: "INS005",
      definitionId: "WF001",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      businessKey: "LEAVE20240119001",
      currentNode: "node_start",
      currentNodeName: "\u7533\u8BF7",
      status: "rejected",
      initiator: "sunqi",
      initiatorName: "\u5B59\u4E03",
      createTime: "2024-01-19 08:30:00",
      updateTime: "2024-01-19 15:00:00"
    }
  ],
  // 工作流任务
  workflowTasks: [
    {
      taskId: "TASK001",
      instanceId: "INS001",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      taskName: "\u90E8\u95E8\u7ECF\u7406\u5BA1\u6279",
      taskKey: "node_approve",
      assignee: "wujiu",
      assigneeName: "\u5434\u4E5D",
      priority: 50,
      status: "in_progress",
      createTime: "2024-01-15 09:00:00",
      variables: { days: 3, leaveType: "\u5E74\u5047" }
    },
    {
      taskId: "TASK002",
      instanceId: "INS003",
      definitionName: "\u8D39\u7528\u62A5\u9500\u6D41\u7A0B",
      taskName: "\u8D22\u52A1\u5BA1\u6279",
      taskKey: "node_finance",
      assignee: "dengshisan",
      assigneeName: "\u9093\u5341\u4E09",
      priority: 30,
      status: "pending",
      createTime: "2024-01-17 11:00:00",
      variables: { amount: 1500, category: "\u529E\u516C\u7528\u54C1" }
    },
    {
      taskId: "TASK003",
      instanceId: "INS004",
      definitionName: "\u5458\u5DE5\u5165\u804C\u6D41\u7A0B",
      taskName: "HR\u529E\u7406",
      taskKey: "node_hr",
      assignee: "caotianxia",
      assigneeName: "\u66F9\u5929\u4E0B",
      priority: 80,
      dueDate: "2024-01-20 18:00:00",
      status: "pending",
      createTime: "2024-01-18 14:00:00",
      variables: { employeeName: "\u65B0\u5458\u5DE5", deptId: 104 }
    },
    {
      taskId: "TASK004",
      instanceId: "INS001",
      definitionName: "\u8BF7\u5047\u5BA1\u6279\u6D41\u7A0B",
      taskName: "HR\u5907\u6848",
      taskKey: "node_hr_record",
      candidateGroups: ["HR"],
      priority: 20,
      status: "pending",
      createTime: "2024-01-15 09:00:00"
    }
  ],
  // 工作流历史
  workflowHistories: [
    {
      historyId: "HIST001",
      instanceId: "INS001",
      taskId: "TASK001",
      taskName: "\u63D0\u4EA4\u7533\u8BF7",
      nodeName: "\u53D1\u8D77\u4EBA",
      action: "submit",
      operator: "zhangsan",
      operatorName: "\u5F20\u4E09",
      comment: "\u56E0\u79C1\u4E8B\u9700\u8981\u8BF7\u50473\u5929",
      createTime: "2024-01-15 09:00:00"
    },
    {
      historyId: "HIST002",
      instanceId: "INS001",
      taskId: "TASK001",
      taskName: "\u90E8\u95E8\u7ECF\u7406\u5BA1\u6279",
      nodeName: "\u90E8\u95E8\u7ECF\u7406",
      action: "approve",
      operator: "wujiu",
      operatorName: "\u5434\u4E5D",
      comment: "\u540C\u610F",
      createTime: "2024-01-15 14:30:00",
      duration: 198e5
    },
    {
      historyId: "HIST003",
      instanceId: "INS002",
      taskId: void 0,
      taskName: "\u63D0\u4EA4\u7533\u8BF7",
      nodeName: "\u53D1\u8D77\u4EBA",
      action: "submit",
      operator: "lisi",
      operatorName: "\u674E\u56DB",
      comment: "\u8BF7\u5E74\u50472\u5929",
      createTime: "2024-01-16 08:00:00"
    },
    {
      historyId: "HIST004",
      instanceId: "INS002",
      taskId: void 0,
      taskName: "\u90E8\u95E8\u7ECF\u7406\u5BA1\u6279",
      nodeName: "\u90E8\u95E8\u7ECF\u7406",
      action: "approve",
      operator: "wujiu",
      operatorName: "\u5434\u4E5D",
      comment: "\u6279\u51C6",
      createTime: "2024-01-16 09:00:00",
      duration: 36e5
    },
    {
      historyId: "HIST005",
      instanceId: "INS002",
      taskId: void 0,
      taskName: "HR\u5907\u6848",
      nodeName: "HR",
      action: "approve",
      operator: "caotianxia",
      operatorName: "\u66F9\u5929\u4E0B",
      comment: "\u5DF2\u767B\u8BB0",
      createTime: "2024-01-16 10:00:00",
      duration: 36e5
    },
    {
      historyId: "HIST006",
      instanceId: "INS005",
      taskId: void 0,
      taskName: "\u63D0\u4EA4\u7533\u8BF7",
      nodeName: "\u53D1\u8D77\u4EBA",
      action: "submit",
      operator: "sunqi",
      operatorName: "\u5B59\u4E03",
      comment: "\u7533\u8BF7\u52A0\u73ED\u8C03\u4F11",
      createTime: "2024-01-19 08:30:00"
    },
    {
      historyId: "HIST007",
      instanceId: "INS005",
      taskId: void 0,
      taskName: "\u90E8\u95E8\u7ECF\u7406\u5BA1\u6279",
      nodeName: "\u90E8\u95E8\u7ECF\u7406",
      action: "reject",
      operator: "zhaoliu",
      operatorName: "\u8D75\u516D",
      comment: "\u9879\u76EE\u7D27\u5F20\uFF0C\u6682\u4E0D\u6279\u51C6",
      createTime: "2024-01-19 15:00:00",
      duration: 234e5
    }
  ]
};
function initMessages() {
  const messageTypes = ["system", "normal", "reminder"];
  const priorities = ["high", "medium", "low"];
  const titles = [
    "\u3010\u91CD\u8981\u3011\u7CFB\u7EDF\u5347\u7EA7\u901A\u77E5",
    "\u3010\u7D27\u6025\u3011\u8D26\u53F7\u5B89\u5168\u63D0\u9192",
    "\u4EFB\u52A1\u63D0\u9192\uFF1A\u60A8\u6709\u65B0\u7684\u5F85\u529E\u4E8B\u9879",
    "\u4F1A\u8BAE\u901A\u77E5\uFF1A\u9879\u76EE\u8FDB\u5EA6\u4F1A\u8BAE",
    "\u7CFB\u7EDF\u516C\u544A\uFF1A\u672C\u5468\u503C\u73ED\u5B89\u6392",
    "\u5BA1\u6279\u63D0\u9192\uFF1A\u60A8\u6709\u4E00\u7B14\u62A5\u9500\u5F85\u5BA1\u6279",
    "\u751F\u65E5\u795D\u798F\uFF1A\u795D\u60A8\u751F\u65E5\u5FEB\u4E50",
    "\u5047\u671F\u63D0\u9192\uFF1A\u660E\u65E5\u5F00\u59CB\u4F11\u5047",
    "\u5B89\u5168\u901A\u77E5\uFF1A\u5BC6\u7801\u5F3A\u5EA6\u5347\u7EA7\u8981\u6C42",
    "\u7248\u672C\u66F4\u65B0\uFF1A\u65B0\u529F\u80FD\u4E0A\u7EBF\u516C\u544A"
  ];
  const contents = [
    "\u7CFB\u7EDF\u5C06\u4E8E\u672C\u5468\u672B\u8FDB\u884C\u5347\u7EA7\u7EF4\u62A4\uFF0C\u8BF7\u63D0\u524D\u4FDD\u5B58\u597D\u60A8\u7684\u5DE5\u4F5C\u6570\u636E\u3002\u5347\u7EA7\u671F\u95F4\u7CFB\u7EDF\u5C06\u65E0\u6CD5\u4F7F\u7528\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u656C\u8BF7\u8C05\u89E3\u3002",
    "\u68C0\u6D4B\u5230\u60A8\u7684\u8D26\u53F7\u5B58\u5728\u5B89\u5168\u98CE\u9669\uFF0C\u8BF7\u7ACB\u5373\u4FEE\u6539\u5BC6\u7801\u5E76\u542F\u7528\u53CC\u56E0\u7D20\u8BA4\u8BC1\u3002",
    "\u60A8\u6709\u65B0\u7684\u5F85\u529E\u4E8B\u9879\u9700\u8981\u5904\u7406\uFF0C\u8BF7\u5C3D\u5FEB\u5B8C\u6210\u76F8\u5173\u5DE5\u4F5C\u3002\u4EFB\u52A1\u622A\u6B62\u65F6\u95F4\u4E3A\u672C\u5468\u4E94\u4E0B\u53486\u70B9\u3002",
    "\u672C\u5468\u4E09\u4E0B\u53483\u70B9\u5C06\u5728\u4F1A\u8BAE\u5BA4A\u53EC\u5F00\u9879\u76EE\u8FDB\u5EA6\u4F1A\u8BAE\uFF0C\u8BF7\u76F8\u5173\u4EBA\u5458\u51C6\u65F6\u53C2\u52A0\u3002",
    "\u672C\u5468\u503C\u73ED\u8868\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u5404\u4F4D\u540C\u4E8B\u67E5\u770B\u5E76\u6309\u65F6\u4EA4\u63A5\u3002\u503C\u73ED\u671F\u95F4\u5982\u6709\u95EE\u9898\u8BF7\u8054\u7CFB\u503C\u73ED\u7ECF\u7406\u3002",
    "\u60A8\u6709\u4E00\u7B141500\u5143\u7684\u529E\u516C\u7528\u54C1\u62A5\u9500\u5355\u5F85\u5BA1\u6279\uFF0C\u8BF7\u5C3D\u5FEB\u5904\u7406\u3002",
    "\u4ECA\u5929\u662F\u60A8\u7684\u751F\u65E5\uFF0C\u516C\u53F8\u5168\u4F53\u540C\u4E8B\u795D\u60A8\u751F\u65E5\u5FEB\u4E50\uFF0C\u5DE5\u4F5C\u987A\u5229\uFF01",
    "\u60A8\u7684\u8C03\u4F11\u7533\u8BF7\u5DF2\u6279\u51C6\uFF0C\u660E\u65E5\u8D77\u5F00\u59CB\u4F11\u5047\uFF0C\u795D\u60A8\u5047\u671F\u6109\u5FEB\uFF01",
    "\u4E3A\u63D0\u5347\u8D26\u53F7\u5B89\u5168\uFF0C\u7CFB\u7EDF\u8981\u6C42\u6240\u6709\u7528\u6237\u5C06\u5BC6\u7801\u5F3A\u5EA6\u5347\u7EA7\u81F3\u4E2D\u7B49\u4EE5\u4E0A\u3002",
    "\u672C\u6B21\u66F4\u65B0\u65B0\u589E\u4E86\u5DE5\u4F5C\u6D41\u7BA1\u7406\u3001\u6570\u636E\u53EF\u89C6\u5316\u7B49\u529F\u80FD\uFF0C\u6B22\u8FCE\u4F53\u9A8C\u3002"
  ];
  for (let i = 1; i <= 50; i++) {
    const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = Math.random() > 0.3 ? "0" : "1";
    const titleIndex = (i - 1) % titles.length;
    const senderIndex = Math.floor(Math.random() * 5);
    const receivers = [
      "\u5F20\u4E09",
      "\u674E\u56DB",
      "\u738B\u4E94",
      "\u8D75\u516D",
      "\u5B59\u4E03",
      "\u5434\u4E5D",
      "\u90D1\u5341",
      "\u66F9\u5341\u4E8C",
      "\u9093\u5341\u4E09",
      "\u66F9\u5929\u4E0B",
      "\u5F6D\u5B89",
      "\u64CD\u793C",
      "\u7BA1\u7406\u5458"
    ];
    const senders = ["\u7BA1\u7406\u5458", "\u7CFB\u7EDF", "HR\u7CFB\u7EDF", "\u8D22\u52A1\u7CFB\u7EDF", "\u5B89\u4FDD\u7CFB\u7EDF"];
    const sendTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3);
    db.messages.push({
      messageId: i,
      title: titles[titleIndex],
      content: contents[titleIndex],
      type,
      priority,
      status,
      senderId: senderIndex + 1,
      senderName: senders[senderIndex],
      receiverId: i % 14 + 1,
      receiverName: receivers[i % 13],
      sendTime: sendTime.toISOString().replace("T", " ").slice(0, 19),
      readTime: status === "1" ? new Date(sendTime.getTime() + Math.random() * 2 * 60 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19) : void 0
    });
  }
}
function initNotifications() {
  const types = ["\u516C\u544A", "\u901A\u77E5", "\u63D0\u9192", "\u8B66\u544A"];
  const levels = ["info", "warning", "danger", "success"];
  const targetTypes = ["all", "role", "dept", "user"];
  const titles = [
    "\u7CFB\u7EDF\u5347\u7EA7\u516C\u544A",
    "\u65B0\u529F\u80FD\u4E0A\u7EBF\u901A\u77E5",
    "\u5B89\u5168\u63D0\u9192",
    "\u7248\u672C\u66F4\u65B0\u901A\u77E5",
    "\u6570\u636E\u8FC1\u79FB\u516C\u544A",
    "\u5BC6\u7801\u7B56\u7565\u66F4\u65B0",
    "\u7F51\u7EDC\u7EF4\u62A4\u901A\u77E5",
    "\u8D26\u53F7\u5B89\u5168\u63D0\u9192",
    "\u4F1A\u8BAE\u901A\u77E5",
    "\u5047\u671F\u5B89\u6392\u901A\u77E5",
    "\u7EE9\u6548\u8BC4\u5B9A\u901A\u77E5",
    "\u57F9\u8BAD\u901A\u77E5"
  ];
  const contents = [
    "\u4E3A\u63D0\u5347\u7528\u6237\u4F53\u9A8C\uFF0C\u7CFB\u7EDF\u5C06\u4E8E\u8FD1\u671F\u8FDB\u884C\u5347\u7EA7\uFF0C\u65B0\u589E\u591A\u9879\u529F\u80FD\uFF0C\u6B22\u8FCE\u4F53\u9A8C\u3002",
    "\u6D88\u606F\u901A\u77E5\u4E2D\u5FC3\u5DF2\u4E0A\u7EBF\uFF0C\u652F\u6301\u7AD9\u5185\u6D88\u606F\u3001\u90AE\u4EF6\u3001\u77ED\u4FE1\u7B49\u591A\u79CD\u901A\u77E5\u65B9\u5F0F\u3002",
    "\u8BF7\u59A5\u5584\u4FDD\u7BA1\u60A8\u7684\u8D26\u53F7\u5BC6\u7801\uFF0C\u5B9A\u671F\u66F4\u6362\uFF0C\u907F\u514D\u8D26\u53F7\u6CC4\u9732\u3002",
    "\u65B0\u7248\u672C\u5DF2\u53D1\u5E03\uFF0C\u5305\u542B\u6027\u80FD\u4F18\u5316\u548Cbug\u4FEE\u590D\uFF0C\u8BF7\u53CA\u65F6\u66F4\u65B0\u3002",
    "\u4E3A\u4F18\u5316\u7CFB\u7EDF\u6027\u80FD\uFF0C\u6570\u636E\u8FC1\u79FB\u5C06\u4E8E\u672C\u5468\u65E5\u51CC\u66682\u70B9\u8FDB\u884C\uFF0C\u9884\u8BA1\u6301\u7EED4\u5C0F\u65F6\u3002",
    "\u7CFB\u7EDF\u5BC6\u7801\u7B56\u7565\u5DF2\u66F4\u65B0\uFF1A\u5BC6\u7801\u957F\u5EA6\u81F3\u5C118\u4F4D\uFF0C\u5FC5\u987B\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u548C\u6570\u5B57\u3002",
    "\u6838\u5FC3\u7F51\u7EDC\u8BBE\u5907\u5C06\u4E8E\u672C\u5468\u516D\u8FDB\u884C\u7EF4\u62A4\uFF0C\u9884\u8BA1\u4E2D\u65AD\u670D\u52A12\u5C0F\u65F6\u3002",
    "\u68C0\u6D4B\u5230\u5F02\u5E38\u767B\u5F55\u884C\u4E3A\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u4E3A\u672C\u4EBA\u64CD\u4F5C\uFF0C\u5982\u975E\u672C\u4EBA\u8BF7\u53CA\u65F6\u4FEE\u6539\u5BC6\u7801\u3002",
    "\u4E0B\u5468\u4E00\u4E0A\u53489\u70B9\u5C06\u53EC\u5F00\u5B63\u5EA6\u603B\u7ED3\u4F1A\u8BAE\uFF0C\u8BF7\u76F8\u5173\u90E8\u95E8\u51C6\u5907\u6C47\u62A5\u6750\u6599\u3002",
    "\u6625\u8282\u671F\u95F4\u653E\u5047\u5B89\u6392\u5DF2\u516C\u5E03\uFF0C\u8BF7\u5404\u4F4D\u540C\u4E8B\u63D0\u524D\u505A\u597D\u5DE5\u4F5C\u5B89\u6392\u3002",
    "\u672C\u5E74\u5EA6\u7EE9\u6548\u8BC4\u5B9A\u5DE5\u4F5C\u5DF2\u542F\u52A8\uFF0C\u8BF7\u5404\u90E8\u95E8\u4E8E\u672C\u6708\u5E95\u524D\u5B8C\u6210\u81EA\u8BC4\u3002",
    "\u65B0\u5458\u5DE5\u5165\u804C\u57F9\u8BAD\u5C06\u4E8E\u4E0B\u5468\u4E09\u4E3E\u884C\uFF0C\u8BF7\u62A5\u540D\u540C\u4E8B\u51C6\u65F6\u53C2\u52A0\u3002"
  ];
  for (let i = 1; i <= 30; i++) {
    const titleIndex = (i - 1) % titles.length;
    const level = levels[Math.floor(Math.random() * levels.length)];
    const status = Math.random() > 0.3 ? "0" : "1";
    const createTime = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1e3);
    db.notifications.push({
      notificationId: i,
      title: titles[titleIndex],
      content: contents[titleIndex],
      type: types[Math.floor(Math.random() * types.length)],
      level,
      status,
      targetType: targetTypes[Math.floor(Math.random() * targetTypes.length)],
      isPushed: Math.random() > 0.2,
      pushTime: Math.random() > 0.2 ? new Date(createTime.getTime() + Math.random() * 60 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19) : void 0,
      expireTime: new Date(createTime.getTime() + 30 * 24 * 60 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19),
      createBy: "admin",
      createTime: createTime.toISOString().replace("T", " ").slice(0, 19),
      updateTime: status === "1" ? new Date(createTime.getTime() + Math.random() * 24 * 60 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19) : void 0
    });
  }
}
function initOperlogs() {
  const modules = [
    "\u7528\u6237\u7BA1\u7406",
    "\u89D2\u8272\u7BA1\u7406",
    "\u83DC\u5355\u7BA1\u7406",
    "\u90E8\u95E8\u7BA1\u7406",
    "\u5C97\u4F4D\u7BA1\u7406",
    "\u7CFB\u7EDF\u76D1\u63A7",
    "\u4EE3\u7801\u751F\u6210",
    "\u5B57\u5178\u7BA1\u7406",
    "\u53C2\u6570\u8BBE\u7F6E",
    "\u901A\u77E5\u7BA1\u7406"
  ];
  const operTypes = ["\u67E5\u8BE2", "\u65B0\u589E", "\u4FEE\u6539", "\u5220\u9664", "\u5BFC\u51FA", "\u5BFC\u5165", "\u6388\u6743", "\u5176\u4ED6"];
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const systems = ["Windows 10", "Windows 11", "macOS", "Linux", "Ubuntu", "iOS", "Android"];
  const users = [
    "admin",
    "zhangsan",
    "lisi",
    "wangwu",
    "zhaoliu",
    "sunqi",
    "wujiu",
    "caotianxia",
    "pengan"
  ];
  for (let i = 1; i <= 100; i++) {
    const operType = operTypes[Math.floor(Math.random() * operTypes.length)];
    const module2 = modules[Math.floor(Math.random() * modules.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const status = Math.random() > 0.05 ? "0" : "1";
    const costTime = Math.floor(Math.random() * 5e3) + 50;
    db.operlogs.push({
      operId: String(i),
      operName: user,
      operTime: randomDateTime(60),
      operType,
      operModule: module2,
      status,
      requestMethod: methods[Math.floor(Math.random() * methods.length)],
      operUrl: `/api/${module2 === "\u7528\u6237\u7BA1\u7406" ? "system/user" : module2 === "\u89D2\u8272\u7BA1\u7406" ? "system/role" : module2 === "\u83DC\u5355\u7BA1\u7406" ? "system/menu" : module2 === "\u90E8\u95E8\u7BA1\u7406" ? "system/dept" : module2 === "\u5C97\u4F4D\u7BA1\u7406" ? "system/post" : module2 === "\u7CFB\u7EDF\u76D1\u63A7" ? "monitor/server" : module2 === "\u4EE3\u7801\u751F\u6210" ? "tool/gen" : module2 === "\u5B57\u5178\u7BA1\u7406" ? "system/dict" : module2 === "\u53C2\u6570\u8BBE\u7F6E" ? "system/config" : "system/notification"}/${operType === "\u67E5\u8BE2" ? "list" : operType === "\u65B0\u589E" ? "add" : operType === "\u5220\u9664" ? "remove" : operType === "\u5BFC\u51FA" ? "export" : operType === "\u5BFC\u5165" ? "import" : operType === "\u6388\u6743" ? "auth" : "edit"}`,
      operIp: randomIP(),
      operSystem: systems[Math.floor(Math.random() * systems.length)],
      browser: randomBrowser(),
      costTime,
      operLocation: randomCity(),
      operParam: JSON.stringify({ id: Math.floor(Math.random() * 100), keyword: `keyword${i}` }),
      jsonResult: JSON.stringify(
        status === "0" ? { code: 200, msg: "\u64CD\u4F5C\u6210\u529F" } : { code: 500, msg: "\u64CD\u4F5C\u5931\u8D25" }
      ),
      createTime: randomDateTime(60)
    });
  }
}
function initLogininfors() {
  const users = [
    "admin",
    "zhangsan",
    "lisi",
    "wangwu",
    "zhaoliu",
    "sunqi",
    "wujiu",
    "caotianxia",
    "pengan",
    "disabled_user"
  ];
  const operations = ["\u767B\u5F55", "\u767B\u51FA", "\u6CE8\u518C", "\u4FEE\u6539\u5BC6\u7801", "\u627E\u56DE\u5BC6\u7801"];
  const errorMsgs = [
    "\u5BC6\u7801\u9519\u8BEF",
    "\u8D26\u53F7\u5DF2\u505C\u7528",
    "\u8D26\u53F7\u4E0D\u5B58\u5728",
    "IP\u9650\u5236\u8BBF\u95EE",
    "\u9A8C\u8BC1\u7801\u9519\u8BEF",
    "\u5BC6\u7801\u5DF2\u8FC7\u671F"
  ];
  for (let i = 1; i <= 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const operation = i % 5 === 0 ? "\u767B\u51FA" : i % 20 === 0 ? "\u4FEE\u6539\u5BC6\u7801" : i % 30 === 0 ? "\u6CE8\u518C" : i % 40 === 0 ? "\u627E\u56DE\u5BC6\u7801" : "\u767B\u5F55";
    const status = operation === "\u767B\u51FA" || operation === "\u6CE8\u518C" ? "0" : Math.random() > 0.1 ? "0" : "1";
    const msg = status === "0" ? `${operation}\u6210\u529F` : operation === "\u767B\u5F55" ? `${operation}\u5931\u8D25\uFF1A${errorMsgs[Math.floor(Math.random() * errorMsgs.length)]}` : `${operation}\u5931\u8D25`;
    db.logininfors.push({
      infoId: String(i),
      userName: user,
      loginAccount: user,
      status,
      loginLocation: randomCity(),
      operationType: operation,
      os: randomOS(),
      browser: randomBrowser(),
      loginTime: randomDateTime(90),
      msg,
      ip: randomIP(),
      createTime: randomDateTime(90)
    });
  }
}
function initOnlineUsers() {
  const users = [
    { userName: "admin", loginAccount: "admin", deptName: "\u4E91\u67A2\u79D1\u6280" },
    { userName: "zhangsan", loginAccount: "zhangsan", deptName: "\u524D\u7AEF\u7EC4" },
    { userName: "lisi", loginAccount: "lisi", deptName: "\u524D\u7AEF\u7EC4" },
    { userName: "wangwu", loginAccount: "wangwu", deptName: "\u524D\u7AEF\u7EC4" },
    { userName: "zhaoliu", loginAccount: "zhaoliu", deptName: "\u540E\u7AEF\u7EC4" },
    { userName: "sunqi", loginAccount: "sunqi", deptName: "\u540E\u7AEF\u7EC4" },
    { userName: "wujiu", loginAccount: "wujiu", deptName: "\u4EA7\u54C1\u90E8" },
    { userName: "caotianxia", loginAccount: "caotianxia", deptName: "\u4EBA\u529B\u8D44\u6E90\u90E8" }
  ];
  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length];
    const loginTime = new Date(Date.now() - Math.random() * 120 * 60 * 1e3);
    db.onlineUsers.push({
      sessionId: `session_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      userName: user.userName,
      loginAccount: user.loginAccount,
      deptName: user.deptName,
      browser: randomBrowser(),
      os: randomOS(),
      ip: randomIP(),
      loginTime: loginTime.toISOString().replace("T", " ").slice(0, 19),
      lastAccessTime: new Date(Date.now() - Math.random() * 30 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19),
      expireTime: new Date(loginTime.getTime() + 30 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19),
      userId: String(i % 8 + 1)
    });
  }
}
function initJobLogs() {
  const jobs = db.jobs.filter((j) => j.status === "0");
  for (let i = 1; i <= 50; i++) {
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const status = Math.random() > 0.1 ? "0" : "1";
    const executeTime = randomDateTime(30);
    const costTime = Math.floor(Math.random() * 1e4) + 500;
    db.jobLogs.push({
      logId: String(i),
      jobId: job.jobId,
      jobName: job.jobName,
      jobGroup: job.jobGroup,
      invokeTarget: job.invokeTarget,
      status,
      executeTime,
      costTime,
      message: status === "0" ? "\u6267\u884C\u6210\u529F" : "\u6267\u884C\u5931\u8D25",
      error: status === "1" ? ["NullPointerException", "Connection timeout", "SQLException", "BusinessException"][Math.floor(Math.random() * 4)] + ": null" : void 0,
      createTime: executeTime
    });
  }
}
initMessages();
initNotifications();
initOperlogs();
initLogininfors();
initOnlineUsers();
initJobLogs();

// mock/routes/auth/login.ts
var login_default = [
  /**
   * 用户登录
   */
  {
    url: "/api/auth/login",
    method: "post",
    response: async ({
      body
    }) => {
      await randomDelay(200, 500);
      const { username, password } = body;
      if (!username || !password) {
        return fail("\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A", 400);
      }
      const user = db.users.find((u) => u.username === username);
      if (!user) {
        return fail("\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF", 401);
      }
      if (user.password !== password) {
        return fail("\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF", 401);
      }
      if (user.status === "1") {
        return fail("\u8D26\u53F7\u5DF2\u88AB\u505C\u7528", 401);
      }
      user.loginIp = "127.0.0.1";
      user.loginDate = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19);
      const roles = db.roles.filter((r) => user.roleId.includes(r.roleId)).map((r) => r.roleKey);
      const permissions = roles.includes("admin") ? ["*:*:*"] : db.roles.filter((r) => user.roleId.includes(r.roleId)).flatMap((r) => r.permissions);
      return success(
        {
          token: `mock-token-${Date.now()}-${user.userId}`,
          expires: 720,
          userId: user.userId,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          roles,
          permissions
        },
        "\u767B\u5F55\u6210\u529F"
      );
    }
  },
  /**
   * 用户登出
   */
  {
    url: "/api/auth/logout",
    method: "post",
    response: async () => {
      await delay(100);
      return success(null, "\u9000\u51FA\u6210\u529F");
    }
  },
  /**
   * 获取用户信息
   */
  {
    url: "/api/auth/userinfo",
    method: "get",
    response: async (options) => {
      await delay();
      const token = options.headers?.authorization;
      if (!token) {
        return fail("\u672A\u6388\u6743", 401);
      }
      const tokenMatch = token.match(/mock-token-.*-(\d+)/);
      const userId = tokenMatch ? parseInt(tokenMatch[1]) : 1;
      const user = db.users.find((u) => u.userId === userId);
      if (!user) {
        return fail("\u7528\u6237\u4E0D\u5B58\u5728", 404);
      }
      const roles = db.roles.filter((r) => user.roleId.includes(r.roleId)).map((r) => ({ roleId: r.roleId, roleName: r.roleName, roleKey: r.roleKey }));
      const permissions = roles.some((r) => r.roleKey === "admin") ? ["*:*:*"] : db.roles.filter((r) => user.roleId.includes(r.roleId)).flatMap((r) => r.permissions);
      const dept = db.depts.find((d) => d.deptId === user.deptId);
      return success({
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        sex: user.sex,
        deptId: user.deptId,
        deptName: dept?.deptName || "",
        postId: user.postId,
        posts: db.posts.filter((p) => user.postId.includes(p.postId)).map((p) => p.postName),
        roles,
        roleId: user.roleId,
        permissions,
        status: user.status,
        loginIp: user.loginIp,
        loginDate: user.loginDate
      });
    }
  },
  /**
   * 获取验证码
   */
  {
    url: "/api/auth/captcha",
    method: "get",
    response: async () => {
      await delay();
      return success({
        uuid: `captcha-${Date.now()}`,
        img: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNNUzEyPC90ZXh0Pjwvc3ZnPg==",
        code: "CM12"
      });
    }
  },
  /**
   * 刷新令牌
   */
  {
    url: "/api/auth/refresh",
    method: "post",
    response: async (options) => {
      await delay();
      const token = options.headers?.authorization;
      if (!token) {
        return fail("\u672A\u6388\u6743", 401);
      }
      return success({
        token: `mock-token-refresh-${Date.now()}`,
        expires: 720
      });
    }
  }
];
