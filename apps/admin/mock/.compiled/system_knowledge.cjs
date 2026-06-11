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

// mock/routes/system/knowledge.ts
var knowledge_exports = {};
__export(knowledge_exports, {
  default: () => knowledge_default
});
module.exports = __toCommonJS(knowledge_exports);

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

// mock/routes/system/knowledge.ts
var mockCategories = [
  {
    categoryId: 1,
    categoryName: "\u6280\u672F\u6587\u6863",
    parentId: 0,
    sort: 1,
    status: "0",
    createBy: "admin",
    createTime: "2024-01-01 00:00:00",
    updateBy: "admin",
    updateTime: "2024-01-01 00:00:00",
    remark: "\u6280\u672F\u76F8\u5173\u6587\u6863"
  },
  {
    categoryId: 2,
    categoryName: "\u64CD\u4F5C\u624B\u518C",
    parentId: 0,
    sort: 2,
    status: "0",
    createBy: "admin",
    createTime: "2024-01-01 00:00:00",
    updateBy: "admin",
    updateTime: "2024-01-01 00:00:00",
    remark: "\u7CFB\u7EDF\u64CD\u4F5C\u624B\u518C"
  },
  {
    categoryId: 3,
    categoryName: "\u5E38\u89C1\u95EE\u9898",
    parentId: 0,
    sort: 3,
    status: "0",
    createBy: "admin",
    createTime: "2024-01-01 00:00:00",
    updateBy: "admin",
    updateTime: "2024-01-01 00:00:00",
    remark: "FAQ"
  },
  {
    categoryId: 4,
    categoryName: "\u524D\u7AEF\u5F00\u53D1",
    parentId: 1,
    sort: 1,
    status: "0",
    createBy: "admin",
    createTime: "2024-01-01 00:00:00",
    updateBy: "admin",
    updateTime: "2024-01-01 00:00:00",
    remark: ""
  },
  {
    categoryId: 5,
    categoryName: "\u540E\u7AEF\u5F00\u53D1",
    parentId: 1,
    sort: 2,
    status: "0",
    createBy: "admin",
    createTime: "2024-01-01 00:00:00",
    updateBy: "admin",
    updateTime: "2024-01-01 00:00:00",
    remark: ""
  }
];
var mockKnowledgeList = [
  {
    knowledgeId: 1,
    title: "Vue 3 \u5F00\u53D1\u6307\u5357",
    categoryId: 4,
    categoryName: "\u524D\u7AEF\u5F00\u53D1",
    content: "<h2>Vue 3 \u7B80\u4ECB</h2><p>Vue 3 \u662F Vue.js \u7684\u6700\u65B0\u7248\u672C\uFF0C\u5E26\u6765\u4E86\u8BB8\u591A\u65B0\u7279\u6027\u548C\u6539\u8FDB\u3002</p><h3>Composition API</h3><p>Composition API \u662F Vue 3 \u6700\u91CD\u8981\u7684\u65B0\u7279\u6027\u4E4B\u4E00\uFF0C\u5B83\u63D0\u4F9B\u4E86\u66F4\u7075\u6D3B\u7684\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F\u3002</p><h3>Teleport</h3><p>Teleport \u5141\u8BB8\u5C06\u7EC4\u4EF6\u5185\u5BB9\u6E32\u67D3\u5230 DOM \u6811\u4E2D\u7684\u4EFB\u610F\u4F4D\u7F6E\u3002</p>",
    summary: "Vue 3 \u5F00\u53D1\u5165\u95E8\u6307\u5357\uFF0C\u4ECB\u7ECD Composition API \u548C\u65B0\u7279\u6027",
    coverUrl: "",
    tags: "Vue3,\u524D\u7AEF,JavaScript",
    status: "0",
    visible: "0",
    sort: 1,
    viewCount: 1256,
    createBy: "admin",
    createTime: "2024-01-15 10:00:00",
    updateBy: "admin",
    updateTime: "2024-01-15 10:00:00",
    remark: ""
  },
  {
    knowledgeId: 2,
    title: "\u7CFB\u7EDF\u7528\u6237\u7BA1\u7406\u64CD\u4F5C\u624B\u518C",
    categoryId: 2,
    categoryName: "\u64CD\u4F5C\u624B\u518C",
    content: '<h2>\u7528\u6237\u7BA1\u7406\u529F\u80FD\u8BF4\u660E</h2><p>\u672C\u7CFB\u7EDF\u7528\u6237\u7BA1\u7406\u6A21\u5757\u652F\u6301\u7528\u6237\u589E\u5220\u6539\u67E5\u3001\u89D2\u8272\u5206\u914D\u7B49\u529F\u80FD\u3002</p><h3>\u65B0\u589E\u7528\u6237</h3><p>\u70B9\u51FB"\u65B0\u589E"\u6309\u94AE\uFF0C\u586B\u5199\u7528\u6237\u4FE1\u606F\u5E76\u63D0\u4EA4\u5373\u53EF\u3002</p><h3>\u7F16\u8F91\u7528\u6237</h3><p>\u70B9\u51FB\u7528\u6237\u5217\u8868\u4E2D\u7684"\u7F16\u8F91"\u6309\u94AE\u8FDB\u884C\u4FEE\u6539\u3002</p>',
    summary: "\u8BE6\u7EC6\u4ECB\u7ECD\u7CFB\u7EDF\u7528\u6237\u7BA1\u7406\u529F\u80FD\u7684\u4F7F\u7528\u65B9\u6CD5",
    coverUrl: "",
    tags: "\u7528\u6237\u7BA1\u7406,\u64CD\u4F5C\u624B\u518C",
    status: "0",
    visible: "0",
    sort: 1,
    viewCount: 892,
    createBy: "admin",
    createTime: "2024-01-12 14:30:00",
    updateBy: "admin",
    updateTime: "2024-01-12 14:30:00",
    remark: ""
  },
  {
    knowledgeId: 3,
    title: "\u5982\u4F55\u91CD\u7F6E\u5BC6\u7801",
    categoryId: 3,
    categoryName: "\u5E38\u89C1\u95EE\u9898",
    content: '<h2>\u5BC6\u7801\u91CD\u7F6E\u6B65\u9AA4</h2><p>\u5982\u679C\u5FD8\u8BB0\u5BC6\u7801\uFF0C\u8BF7\u6309\u4EE5\u4E0B\u6B65\u9AA4\u64CD\u4F5C\uFF1A</p><ol><li>\u70B9\u51FB\u767B\u5F55\u9875\u9762\u7684"\u5FD8\u8BB0\u5BC6\u7801"</li><li>\u8F93\u5165\u6CE8\u518C\u90AE\u7BB1</li><li>\u67E5\u6536\u91CD\u7F6E\u90AE\u4EF6</li><li>\u70B9\u51FB\u90AE\u4EF6\u4E2D\u7684\u94FE\u63A5\u91CD\u7F6E\u5BC6\u7801</li></ol>',
    summary: "\u5FD8\u8BB0\u5BC6\u7801\u65F6\u7684\u5904\u7406\u65B9\u6CD5",
    coverUrl: "",
    tags: "\u5BC6\u7801,\u5E38\u89C1\u95EE\u9898,FAQ",
    status: "0",
    visible: "0",
    sort: 1,
    viewCount: 2341,
    createBy: "admin",
    createTime: "2024-01-10 09:00:00",
    updateBy: "admin",
    updateTime: "2024-01-10 09:00:00",
    remark: ""
  },
  {
    knowledgeId: 4,
    title: "Spring Boot \u6700\u4F73\u5B9E\u8DF5",
    categoryId: 5,
    categoryName: "\u540E\u7AEF\u5F00\u53D1",
    content: "<h2>Spring Boot \u7B80\u4ECB</h2><p>Spring Boot \u7B80\u5316\u4E86 Spring \u5E94\u7528\u7684\u914D\u7F6E\u548C\u90E8\u7F72\u3002</p><h3>\u81EA\u52A8\u914D\u7F6E</h3><p>Spring Boot \u7684\u81EA\u52A8\u914D\u7F6E\u7279\u6027\u53EF\u4EE5\u6839\u636E\u4F9D\u8D56\u81EA\u52A8\u914D\u7F6E\u5E94\u7528\u3002</p><h3>\u8D77\u6B65\u4F9D\u8D56</h3><p>\u901A\u8FC7\u8D77\u6B65\u4F9D\u8D56\u53EF\u4EE5\u5FEB\u901F\u5F15\u5165\u6240\u9700\u7684\u4F9D\u8D56\u5E93\u3002</p>",
    summary: "Spring Boot \u5F00\u53D1\u6700\u4F73\u5B9E\u8DF5\u6307\u5357",
    coverUrl: "",
    tags: "Spring Boot,Java,\u540E\u7AEF",
    status: "0",
    visible: "0",
    sort: 2,
    viewCount: 756,
    createBy: "admin",
    createTime: "2024-01-08 16:00:00",
    updateBy: "admin",
    updateTime: "2024-01-08 16:00:00",
    remark: ""
  },
  {
    knowledgeId: 5,
    title: "\u7CFB\u7EDF\u67B6\u6784\u8BBE\u8BA1\u6587\u6863",
    categoryId: 1,
    categoryName: "\u6280\u672F\u6587\u6863",
    content: "<h2>\u7CFB\u7EDF\u67B6\u6784\u6982\u89C8</h2><p>\u672C\u7CFB\u7EDF\u91C7\u7528\u524D\u540E\u7AEF\u5206\u79BB\u67B6\u6784\u8BBE\u8BA1\u3002</p><h3>\u6280\u672F\u6808</h3><p>\u524D\u7AEF\uFF1AVue 3 + Element Plus</p><p>\u540E\u7AEF\uFF1ANode.js + Express + @yunshu/server-core</p><p>\u6570\u636E\u5E93\uFF1APostgreSQL 16</p><p>\u7F13\u5B58\uFF1ARedis 7</p>",
    summary: "\u7CFB\u7EDF\u6574\u4F53\u67B6\u6784\u8BBE\u8BA1\u8BF4\u660E",
    coverUrl: "",
    tags: "\u67B6\u6784,\u6280\u672F\u6587\u6863,\u7CFB\u7EDF\u8BBE\u8BA1",
    status: "1",
    visible: "0",
    sort: 1,
    viewCount: 432,
    createBy: "admin",
    createTime: "2024-01-05 11:00:00",
    updateBy: "admin",
    updateTime: "2024-01-05 11:00:00",
    remark: "\u8349\u7A3F"
  }
];
function getCategoryName(categoryId) {
  const category = mockCategories.find((c) => c.categoryId === categoryId);
  return category?.categoryName || "";
}
function buildCategoryTree(categories, parentId = 0) {
  return categories.filter((c) => c.parentId === parentId).map((c) => ({
    ...c,
    children: buildCategoryTree(categories, c.categoryId)
  }));
}
var knowledge_default = [
  /**
   * 获取知识库文档分页列表
   */
  {
    url: "/api/system/knowledge/page",
    method: "get",
    response: async ({
      query
    }) => {
      await randomDelay();
      const pageNum = parseInt(query.pageNum || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const { keyword, categoryId, status, visible } = query;
      let list = [...mockKnowledgeList];
      if (keyword) {
        list = list.filter(
          (item) => item.title.includes(keyword) || item.content.includes(keyword) || item.summary.includes(keyword) || item.tags.includes(keyword)
        );
      }
      if (categoryId) {
        list = list.filter((item) => item.categoryId === parseInt(categoryId));
      }
      if (status) {
        list = list.filter((item) => item.status === status);
      }
      if (visible) {
        list = list.filter((item) => item.visible === visible);
      }
      list.sort((a, b) => b.knowledgeId - a.knowledgeId);
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedList = list.slice(start, end);
      return pageResult(paginatedList, list.length, pageNum, pageSize);
    }
  },
  /**
   * 获取知识库文档列表
   */
  {
    url: "/api/system/knowledge/list",
    method: "get",
    response: async ({
      query
    }) => {
      await delay();
      const { keyword, categoryId, status, visible } = query;
      let list = [...mockKnowledgeList];
      if (keyword) {
        list = list.filter(
          (item) => item.title.includes(keyword) || item.content.includes(keyword)
        );
      }
      if (categoryId) {
        list = list.filter((item) => item.categoryId === parseInt(categoryId));
      }
      if (status) {
        list = list.filter((item) => item.status === status);
      }
      if (visible) {
        list = list.filter((item) => item.visible === visible);
      }
      return success(list);
    }
  },
  /**
   * 获取知识库文档详情
   */
  {
    url: "/api/system/knowledge/:knowledgeId",
    method: "get",
    response: async ({ params }) => {
      await delay();
      const knowledge = mockKnowledgeList.find(
        (k) => k.knowledgeId === parseInt(params.knowledgeId)
      );
      if (!knowledge) {
        return fail("\u6587\u6863\u4E0D\u5B58\u5728", 404);
      }
      knowledge.viewCount++;
      return success(knowledge);
    }
  },
  /**
   * 新增知识库文档
   */
  {
    url: "/api/system/knowledge",
    method: "post",
    response: async ({ body }) => {
      await delay();
      const maxId = Math.max(...mockKnowledgeList.map((k) => k.knowledgeId), 0);
      const newKnowledge = {
        knowledgeId: maxId + 1,
        title: body.title,
        categoryId: body.categoryId,
        categoryName: getCategoryName(body.categoryId),
        content: body.content || "",
        summary: body.summary || "",
        coverUrl: body.coverUrl || "",
        tags: body.tags || "",
        status: body.status || "0",
        visible: body.visible || "0",
        sort: body.sort || 0,
        viewCount: 0,
        createBy: "admin",
        createTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        updateBy: "admin",
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        remark: body.remark || ""
      };
      mockKnowledgeList.push(newKnowledge);
      return success(null, "\u65B0\u589E\u6210\u529F");
    }
  },
  /**
   * 修改知识库文档
   */
  {
    url: "/api/system/knowledge",
    method: "put",
    response: async ({ body }) => {
      await delay();
      const index = mockKnowledgeList.findIndex((k) => k.knowledgeId === body.knowledgeId);
      if (index === -1) {
        return fail("\u6587\u6863\u4E0D\u5B58\u5728", 404);
      }
      mockKnowledgeList[index] = {
        ...mockKnowledgeList[index],
        ...body,
        categoryName: getCategoryName(body.categoryId || mockKnowledgeList[index].categoryId),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ")
      };
      return success(null, "\u4FEE\u6539\u6210\u529F");
    }
  },
  /**
   * 删除知识库文档
   */
  {
    url: "/api/system/knowledge/:knowledgeId",
    method: "delete",
    response: async ({ params }) => {
      await delay();
      const index = mockKnowledgeList.findIndex(
        (k) => k.knowledgeId === parseInt(params.knowledgeId)
      );
      if (index === -1) {
        return fail("\u6587\u6863\u4E0D\u5B58\u5728", 404);
      }
      mockKnowledgeList.splice(index, 1);
      return success(null, "\u5220\u9664\u6210\u529F");
    }
  },
  /**
   * 批量删除知识库文档
   */
  {
    url: "/api/system/knowledge/batch",
    method: "delete",
    response: async ({ body }) => {
      await delay();
      const { knowledgeIds } = body;
      if (!knowledgeIds || knowledgeIds.length === 0) {
        return fail("\u8BF7\u9009\u62E9\u8981\u5220\u9664\u7684\u6587\u6863");
      }
      const initialLength = mockKnowledgeList.length;
      mockKnowledgeList = mockKnowledgeList.filter((k) => !knowledgeIds.includes(k.knowledgeId));
      const deletedCount = initialLength - mockKnowledgeList.length;
      return success(null, `\u5220\u9664\u6210\u529F${deletedCount}\u6761`);
    }
  },
  /**
   * 发布知识库文档
   */
  {
    url: "/api/system/knowledge/publish/:knowledgeId",
    method: "put",
    response: async ({ params }) => {
      await delay();
      const knowledge = mockKnowledgeList.find(
        (k) => k.knowledgeId === parseInt(params.knowledgeId)
      );
      if (!knowledge) {
        return fail("\u6587\u6863\u4E0D\u5B58\u5728", 404);
      }
      knowledge.status = "0";
      knowledge.updateTime = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
      return success(null, "\u53D1\u5E03\u6210\u529F");
    }
  },
  /**
   * 撤回知识库文档
   */
  {
    url: "/api/system/knowledge/withdraw/:knowledgeId",
    method: "put",
    response: async ({ params }) => {
      await delay();
      const knowledge = mockKnowledgeList.find(
        (k) => k.knowledgeId === parseInt(params.knowledgeId)
      );
      if (!knowledge) {
        return fail("\u6587\u6863\u4E0D\u5B58\u5728", 404);
      }
      knowledge.status = "1";
      knowledge.updateTime = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
      return success(null, "\u64A4\u56DE\u6210\u529F");
    }
  },
  /**
   * 获取知识库分类列表
   */
  {
    url: "/api/system/knowledge/category/list",
    method: "get",
    response: async () => {
      await delay();
      return success(mockCategories);
    }
  },
  /**
   * 获取知识库分类树
   */
  {
    url: "/api/system/knowledge/category/tree",
    method: "get",
    response: async () => {
      await delay();
      const tree = buildCategoryTree(mockCategories);
      return success(tree);
    }
  },
  /**
   * 新增知识库分类
   */
  {
    url: "/api/system/knowledge/category",
    method: "post",
    response: async ({ body }) => {
      await delay();
      const maxId = Math.max(...mockCategories.map((c) => c.categoryId), 0);
      const newCategory = {
        categoryId: maxId + 1,
        categoryName: body.categoryName,
        parentId: body.parentId || 0,
        sort: body.sort || 0,
        status: body.status || "0",
        createBy: "admin",
        createTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        updateBy: "admin",
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
        remark: body.remark || ""
      };
      mockCategories.push(newCategory);
      return success(null, "\u65B0\u589E\u6210\u529F");
    }
  },
  /**
   * 修改知识库分类
   */
  {
    url: "/api/system/knowledge/category",
    method: "put",
    response: async ({ body }) => {
      await delay();
      const index = mockCategories.findIndex((c) => c.categoryId === body.categoryId);
      if (index === -1) {
        return fail("\u5206\u7C7B\u4E0D\u5B58\u5728", 404);
      }
      mockCategories[index] = {
        ...mockCategories[index],
        ...body,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ")
      };
      return success(null, "\u4FEE\u6539\u6210\u529F");
    }
  },
  /**
   * 删除知识库分类
   */
  {
    url: "/api/system/knowledge/category/:categoryId",
    method: "delete",
    response: async ({ params }) => {
      await delay();
      const categoryId = parseInt(params.categoryId);
      if (mockCategories.some((c) => c.parentId === categoryId)) {
        return fail("\u8BE5\u5206\u7C7B\u4E0B\u6709\u5B50\u5206\u7C7B\uFF0C\u65E0\u6CD5\u5220\u9664");
      }
      if (mockKnowledgeList.some((k) => k.categoryId === categoryId)) {
        return fail("\u8BE5\u5206\u7C7B\u4E0B\u6709\u6587\u6863\uFF0C\u65E0\u6CD5\u5220\u9664");
      }
      const index = mockCategories.findIndex((c) => c.categoryId === categoryId);
      if (index === -1) {
        return fail("\u5206\u7C7B\u4E0D\u5B58\u5728", 404);
      }
      mockCategories.splice(index, 1);
      return success(null, "\u5220\u9664\u6210\u529F");
    }
  }
];
