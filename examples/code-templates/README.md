# 代码生成器模板示例

这是云枢中台代码生成器的模板示例，包含 Vue 组件、TypeScript 类型和 API 接口。

## 目录结构

```
examples/code-templates/
├── README.md
├── entity.java.vm         # Java 实体类模板
├── mapper.java.vm         # MyBatis Mapper 模板
├── mapper.xml.vm          # MyBatis XML 模板
├── service.java.vm        # Service 接口模板
├── serviceImpl.java.vm    # Service 实现模板
├── controller.java.vm     # Controller 模板
├── api.ts.vm              # 前端 API 模板
├── type.ts.vm             # TypeScript 类型模板
├── index.vue.vm           # Vue 列表页模板
└── form.vue.vm            # Vue 表单页模板
```

## 模板变量说明

### 通用变量
- `${tableName}` - 表名称
- `${tableComment}` - 表描述
- `${className}` - 实体类名（首字母大写）
- `${classNameLower}` - 实体类名（首字母小写）
- `${moduleName}` - 模块名称
- `${packageName}` - 包名称
- `${author}` - 作者
- `${createTime}` - 创建时间
- `${businessName}` - 业务名称（URL 路径）
- `${functionName}` - 功能名称

### 字段变量
- `${field.javaField}` - Java 字段名
- `${field.javaType}` - Java 类型
- `${field.columnName}` - 数据库列名
- `${field.columnComment}` - 字段描述
- `${field.isQuery}` - 是否为查询条件
- `${field.isDisplay}` - 是否在列表中显示
- `${field.isForm}` - 是否在表单中显示
- `${field.displayType}` - 显示类型（input/select/date 等）
- `${field.dictType}` - 字典类型

## 使用示例

### 1. 实体类模板

```java
package ${packageName}.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * ${tableComment}
 *
 * @author ${author}
 * @since ${createTime}
 */
public class ${className} implements Serializable {

    private static final long serialVersionUID = 1L;

#foreach ($field in $columns)
    /**
     * ${field.columnComment}
     */
    private ${field.javaType} ${field.javaField};

#end
#foreach ($field in $columns)
    public ${field.javaType} get${field.javaField.substring(0,1).toUpperCase()}${field.javaField.substring(1)}() {
        return ${field.javaField};
    }

    public void set${field.javaField.substring(0,1).toUpperCase()}${field.javaField.substring(1)}(${field.javaType} ${field.javaField}) {
        this.${field.javaField} = ${field.javaField};
    }

#end
}
```

### 2. Vue 列表页模板

```vue
<template>
  <div class="page-container">
    <el-card>
      <el-form :model="queryParams" inline>
#foreach ($field in $columns)
#if ($field.isQuery)
        <el-form-item label="${field.columnComment}">
          <el-input v-model="queryParams.${field.javaField}" placeholder="请输入${field.columnComment}" clearable />
        </el-form-item>
#end
#end
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
#foreach ($field in $columns)
#if ($field.isDisplay)
        <el-table-column prop="${field.javaField}" label="${field.columnComment}" />
#end
#end
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.limit"
        :total="total"
        @current-change="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ${className} } from './types'
import * as api from './api'

const loading = ref(false)
const tableData = ref<${className}[]>([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  limit: 10
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await api.get${className}List(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.page = 1
  handleQuery()
}

const handleDelete = async (row: ${className}) => {
  await ElMessageBox.confirm('确定要删除吗？')
  await api.delete${className}(row.id)
  ElMessage.success('删除成功')
  handleQuery()
}

onMounted(() => {
  handleQuery()
})
</script>
```

### 3. TypeScript 类型模板

```typescript
export interface ${className} {
#foreach ($field in $columns)
  /** ${field.columnComment} */
  ${field.javaField}?: ${field.tsType};
#end
}

export interface ${className}Query {
  page?: number;
  limit?: number;
#foreach ($field in $columns)
#if ($field.isQuery)
  ${field.javaField}?: ${field.tsType};
#end
#end
}
```

### 4. API 接口模板

```typescript
import request from '@/utils/request'
import type { ${className}, ${className}Query } from './types'

export const get${className}List = (params: ${className}Query) => {
  return request({
    url: '/${businessName}/list',
    method: 'get',
    params
  })
}

export const get${className} = (id: number) => {
  return request({
    url: \`/\${businessName}/\${id}\`,
    method: 'get'
  })
}

export const create${className} = (data: ${className}) => {
  return request({
    url: '/${businessName}',
    method: 'post',
    data
  })
}

export const update${className} = (data: ${className}) => {
  return request({
    url: '/${businessName}',
    method: 'put',
    data
  })
}

export const delete${className} = (id: number) => {
  return request({
    url: \`/\${businessName}/\${id}\`,
    method: 'delete'
  })
}
```

## 自定义模板

您可以根据项目需求自定义这些模板，支持以下模板引擎：
- Velocity
- FreeMarker
- Thymeleaf
- Handlebars
