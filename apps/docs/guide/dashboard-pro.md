# 大屏设计器

可视化大屏设计器，支持拖拽、调整大小、数据源绑定和模板保存。

## 核心功能

- ✅ 9 种组件类型（折线/柱状/饼图/环形/面积/仪表盘/表格/文本/图片）
- ✅ 拖拽添加组件
- ✅ 拖拽调整位置和大小（8 方向）
- ✅ 数据源绑定（Mock / API）
- ✅ 模板保存与加载
- ✅ 大屏预览与展示

## 目录结构

```
apps/admin/src/
├── api/
│   └── admin-dashboard.api.ts     # 大屏 API
├── views/
│   └── dashboard-pro/
│       ├── DashboardDesign.vue    # 设计器
│       ├── DashboardPreview.vue   # 预览
│       └── DashboardScreen.vue    # 展示
├── components/
│   └── dashboard-widgets/         # 9 种组件
│       ├── LineChartWidget.vue
│       ├── BarChartWidget.vue
│       ├── PieChartWidget.vue
│       ├── RingChartWidget.vue
│       ├── AreaChartWidget.vue
│       ├── GaugeWidget.vue
│       ├── TableWidget.vue
│       ├── TextWidget.vue
│       ├── ImageWidget.vue
│       └── data-source-utils.ts
```

## API 端点

[admin-dashboard.api.ts](file:///workspace/apps/admin/src/api/admin-dashboard.api.ts)：

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getDashboardPage` | GET | `/admin/dashboard/page` | 分页查询大屏 |
| `getDashboard` | GET | `/admin/dashboard/:id` | 获取大屏详情 |
| `addDashboard` | POST | `/admin/dashboard` | 新增大屏 |
| `updateDashboard` | PUT | `/admin/dashboard` | 更新大屏 |
| `deleteDashboard` | DELETE | `/admin/dashboard/:id` | 删除大屏 |
| `getDashboardTemplates` | GET | `/admin/dashboard/templates` | 模板列表 |

## 组件类型

| 组件 | 适用场景 | 数据要求 |
|------|----------|----------|
| 折线图 | 趋势分析 | xData + yData |
| 柱状图 | 对比分析 | xData + yData |
| 饼图 | 占比分析 | 一维数据 |
| 环形图 | 占比（中心可显示总数） | 一维数据 |
| 面积图 | 累积趋势 | xData + yData |
| 仪表盘 | KPI 进度 | 当前值 + 最大值 |
| 表格 | 明细数据 | 二维数据 |
| 文本 | 标题/标签 | 文本内容 |
| 图片 | Logo/装饰 | URL |

## 数据源配置

### Mock 数据

```typescript
{
  type: 'mock',
  data: {
    xData: ['1月', '2月', '3月', '4月', '5月'],
    yData: [120, 200, 150, 80, 70]
  }
}
```

### 后端 API

```typescript
{
  type: 'api',
  url: '/api/sales/monthly',
  method: 'GET',
  fieldMap: {
    xField: 'month',
    yField: 'amount'
  }
}
```

## 组件配置示例

```vue
<script setup>
import { ref } from 'vue'
import { LineChartWidget } from '@/components/dashboard-widgets'

const chartData = ref({
  xData: ['1月', '2月', '3月', '4月', '5月'],
  yData: [120, 200, 150, 80, 70],
})
</script>

<template>
  <LineChartWidget
    :data="chartData"
    :width="400"
    :height="300"
  />
</template>
```

## 设计器使用

### 进入设计器

```
路由: /dashboard-pro/design
权限: dashboard:design
```

### 操作流程

1. **添加组件**：从左侧组件库拖拽到画布
2. **调整位置**：拖动组件改变 x/y 坐标
3. **调整大小**：拖动 8 个方向的手柄
4. **配置属性**：在右侧属性面板配置标题、样式
5. **绑定数据源**：配置数据源类型、URL、字段映射
6. **保存大屏**：点击保存，输入名称
7. **预览**：点击预览查看效果
8. **发布**：大屏用于展示

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Delete` | 删除选中组件 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` | 重做 |
| `Ctrl+S` | 保存 |
| `Ctrl+D` | 复制 |

## 大屏展示

设计好的大屏可以通过以下方式展示：

```vue
<!-- 路由参数 -->
<router-link to="/dashboard-pro/screen/123">查看大屏</router-link>
```

```typescript
// 路由配置
{
  path: '/dashboard-pro/screen/:id',
  component: () => import('@/views/dashboard-pro/DashboardScreen.vue'),
  meta: { title: '大屏展示' }
}
```

## 模板系统

### 预设模板

`getDashboardTemplates` 返回系统预设模板：

- 销售数据大屏
- 生产监控大屏
- 运维监控大屏
- 客流分析大屏

### 自定义模板

通过 `addDashboard` / `updateDashboard` 保存的也是模板，可在模板列表中选择加载。

## 性能优化

- ✅ 组件懒加载
- ✅ ECharts 按需引入
- ✅ 数据缓存
- ✅ 渲染节流
- ✅ 拖拽防抖

## 相关文档

- 📖 [工作流模块](/guide/workflow)
- 📖 [组件库](/components/button)
- 📖 [API 客户端](/api-client/)
