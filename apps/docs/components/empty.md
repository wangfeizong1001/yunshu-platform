# Empty 空状态

空数据占位组件，用于列表、表格等无数据时的展示。

## 基础用法

```vue
<template>
  <YunEmpty description="暂无数据" />
</template>
```

## 自定义图片

```vue
<template>
  <YunEmpty
    image-size="200"
    description="没有找到相关结果"
  >
    <el-button type="primary" @click="handleAdd">添加数据</el-button>
  </YunEmpty>
</template>
```

## 不同场景

```vue
<template>
  <!-- 网络错误 -->
  <YunEmpty
    image="error"
    description="网络异常，请检查后重试"
  >
    <el-button @click="retry">重新加载</el-button>
  </YunEmpty>

  <!-- 无搜索结果 -->
  <YunEmpty
    image="search"
    description="没有找到匹配的数据"
  />

  <!-- 无权限 -->
  <YunEmpty
    image="noAccess"
    description="您没有访问该资源的权限"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| image | `string` | `'default'` | 图片类型：`default` / `error` / `search` / `noAccess` / 自定义 URL |
| image-size | `number` | - | 图片大小（px） |
| description | `string` | `'暂无数据'` | 描述文字 |
| description-size | `string` | `'14px'` | 描述文字大小 |

## Slots

| 名称 | 说明 |
|------|------|
| default | 自定义底部操作（如按钮） |
| image | 自定义图片 |
| description | 自定义描述内容 |

## 完整示例

```vue
<template>
  <YunEmpty v-if="list.length === 0" description="还没有任何记录">
    <el-button type="primary" @click="handleAdd">
      <el-icon><Plus /></el-icon>
      新建记录
    </el-button>
  </YunEmpty>

  <el-table v-else :data="list" />
</template>
```
