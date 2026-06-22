# 代码错误修复计划

## 概述

当前代码库存在两类主要错误：
1. **ESLint 配置问题** - ESLint 配置文件使用了 CommonJS 语法，但项目配置为 ES module
2. **TypeScript 类型错误** - 大量类型不兼容问题，主要分布在 @yunshu/admin 包中

---

## 问题一：ESLint 配置错误

### 问题描述
`eslint.config.js` 使用了 `module.exports`（CommonJS 语法），但项目 `package.json` 设置了 `"type": "module"`，导致 ESLint 无法运行。

### 影响范围
- `@yunshu/admin` lint 失败
- `@yunshu/playground` lint 失败

### 解决方案

#### 方案 1：重命名配置文件（推荐）
将 `eslint.config.js` 重命名为 `eslint.config.cjs`（显式 CommonJS）

```bash
mv /workspace/eslint.config.js /workspace/eslint.config.cjs
```

#### 方案 2：升级为 ESM 配置
将 `eslint.config.js` 改写为 ESM 格式

```javascript
export default {
  root: true,
  extends: ['./tools/eslint-config/index.js'],
};
```

---

## 问题二：TypeScript 类型错误详细清单

### 2.1 API 响应类型处理问题

| 文件 | 错误数量 | 问题描述 |
|------|---------|---------|
| `src/api/auth.ts` | 1 | `Promise<ApiResponse<CaptchaResponse>>` 与 `{ code: number; data: CaptchaResponse }` 不兼容 |
| `src/views/system/notice/NoticeList.vue` | 1 | ApiResponse 转换问题 |
| `src/views/system/notice/NoticeDetail.vue` | 1 | ApiResponse 转换问题 |
| `src/views/system/message/MessageList.vue` | 2 | ApiResponse 转换问题 |
| `src/views/system/sms/SmsLog.vue` | 1 | ApiResponse 转换问题 |
| `src/views/monitor/operlog/OperlogDetail.vue` | 1 | ApiResponse 转换问题 |

**修复建议**：统一使用 `res?.data` 或 `(res as any).data` 访问 API 响应数据

#### 2.1.1 auth.ts
```typescript
// 当前
const res: Record<string, unknown> = await getCaptchaApi()

// 建议修改为
const res = await getCaptchaApi()
if (res.code === 200 && res.data) {
  captchaData.uuid = res.data.uuid
}
```

### 2.2 类型断言缺失或错误

| 文件 | 错误数量 | 问题描述 |
|------|---------|---------|
| `src/__tests__/store/permission.test.ts` | 6 | `dynamicRouteAdded` 属性不存在 |
| `src/composables/useCache.ts` | 1 | Ref 类型不匹配 |
| `src/composables/useSearch.ts` | 1 | SearchResult 类型不兼容 |
| `src/views/monitor/job/JobList.vue` | 8 | DefaultRow 与 IJob 类型不兼容 |
| `src/views/monitor/job/JobLogDrawer.vue` | 1 | unknown[] 与 IJobLog[] 不兼容 |
| `src/views/system/role/RoleList.vue` | 3 | DefaultRow 与 SysRole 类型不兼容 |
| `src/views/system/role/index.vue` | 3 | DefaultRow 与 SysRole 类型不兼容 |
| `src/views/system/user/UserList.vue` | 4 | DefaultRow 与 UserInfo 类型不兼容 |

#### 2.2.1 permission.ts store 问题
```typescript
// src/store/modules/permission.ts
// 缺少 dynamicRouteAdded 状态定义
state: (): PermissionState => ({
  // ... 其他状态
  dynamicRouteAdded: false,  // 需要添加
}),
```

#### 2.2.2 DefaultRow 类型问题
**问题**：`el-table` 的 `DefaultRow` 类型与具体业务类型不兼容

**解决方案**：
1. 方案 A：为 table 添加行类型断言
```vue
<el-table :data="tableData" row-key="id">
  <el-table-column prop="userId" />
</el-table>
```
2. 方案 B：定义正确的泛型类型
```typescript
const tableData = ref<UserInfo[]>([])
```

### 2.3 未知类型访问问题

| 文件 | 错误数量 | 问题描述 |
|------|---------|---------|
| `src/views/system/knowledge/KnowledgeForm.vue` | 3 | `category` 是 `unknown` 类型 |
| `src/views/system/knowledge/KnowledgeList.vue` | 3 | `category` 是 `unknown` 类型 |
| `src/views/system/oss/OssConfig.vue` | 3 | `formRef` 是 `unknown` 类型 |
| `src/views/system/oss/OssList.vue` | 6 | 多个 unknown 类型访问 |
| `src/views/system/post/PostList.vue` | 6 | 多个 unknown 类型访问 |
| `src/views/system/user/index.vue` | 4 | 多个 unknown 类型访问 |

#### 修复示例 - OssList.vue
```typescript
// 当前
const res = await getOssFilePage(queryParams)
fileList.value = res.rows  // res.rows 是 unknown

// 修改为
const res = await getOssFilePage(queryParams)
const pageData = res?.data as { rows: OssFile[]; total: number } | undefined
fileList.value = (pageData?.rows as unknown as OssFile[]) ?? []
total.value = pageData?.total ?? 0
```

### 2.4 Menu 类型兼容性问题

| 文件 | 问题描述 |
|------|---------|
| `src/views/system/menu/MenuForm.vue` | `MenuInfo[]` 与 `SysMenu[]` 不兼容，`MenuInfo` 缺少 `orderNum` |
| `src/views/system/role/RoleForm.vue` | 同上 |

**解决方案**：
```typescript
// MenuInfo 需要包含 SysMenu 的所有必需字段，或使用类型断言
menuTree.value = (res.data as MenuInfo[]) as unknown as SysMenu[]
```

### 2.5 其他类型问题

| 文件 | 错误描述 | 解决方案 |
|------|---------|---------|
| `src/layouts/components/Search.vue` | 键盘事件类型不匹配 | `(evt: Event \| KeyboardEvent) => void` |
| `src/layouts/components/Sidebar.vue` | RouteRecordName 类型不兼容 | 移除 symbol 类型检查 |
| `src/layouts/components/TagsView.vue` | LocationQuery 类型不兼容 | 使用类型断言 |
| `src/views/monitor/online/OnlineList.vue` | DefaultRow 与 OnlineInfo 不兼容 | 同 2.2.2 |
| `src/views/monitor/logininfor/LogininforList.vue` | DefaultRow 与 LogininforInfo 不兼容 | 同 2.2.2 |
| `src/views/system/third/ThirdConfig.vue` | ThirdConfig 类型未定义 | 添加类型导入 |
| `src/views/system/user/UserForm.vue` | TreeOptionProps 多余属性 | 移除 `value` 属性 |

### 2.6 Mock 文件错误

| 文件 | 错误描述 |
|------|---------|
| `src/mock/index.ts` | 多个 mock 文件路径不存在 |
| `src/mock/dashboard.mock.ts` | 多个类型未定义 (DashboardInfo, DashboardStats 等) |
| `src/mock/search.mock.ts` | 多个类型未定义 |
| `src/mock/system/sso.mock.ts` | 模块路径错误 |

**解决方案**：
1. 确认 mock 文件是否存在
2. 添加缺失的类型定义或导入

---

## 修复优先级

### 高优先级（阻塞构建）
1. ESLint 配置错误 - 立即修复
2. permission.ts 缺少 `dynamicRouteAdded` 状态
3. Mock 文件导入错误

### 中优先级（影响类型安全）
1. API 响应类型处理（统一 res.data 访问模式）
2. DefaultRow 与业务类型不兼容
3. unknown 类型访问问题

### 低优先级（不影响运行）
1. 组件属性类型严格性调整
2. 函数参数类型增强

---

## 修复步骤建议

### 步骤 1：修复 ESLint 配置
```bash
mv /workspace/eslint.config.js /workspace/eslint.config.cjs
```

### 步骤 2：修复 permission store
在 `src/store/modules/permission.ts` 的 state 中添加 `dynamicRouteAdded: false`

### 步骤 3：修复 Mock 导入
检查并修复 `src/mock/index.ts` 中的文件路径

### 步骤 4：批量修复 API 响应处理
对所有 API 调用统一使用 `res?.data` 模式

### 步骤 5：修复类型断言
使用 `as unknown as Type` 或 `as Type` 修复剩余类型错误

---

## 附录：错误统计

| 错误类别 | 数量 |
|---------|------|
| ESLint 配置错误 | 2 (包) |
| API 响应类型错误 | ~15 |
| unknown 类型访问 | ~25 |
| DefaultRow 类型不兼容 | ~15 |
| MenuInfo/SysMenu 不兼容 | 2 |
| Mock 文件错误 | ~20 |
| 其他类型错误 | ~15 |
| **总计** | **~90+** |
