# 基础示例

本目录包含云枢中台的基础使用示例。

## 目录结构

```
basic/
├── src/
│   ├── components/   # 组件示例
│   ├── composables/  # 组合式函数示例
│   ├── api/          # API 调用示例
│   └── utils/        # 工具函数示例
└── README.md
```

## 运行示例

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 示例列表

### 1. 组件使用

```vue
<!-- Button 示例 -->
<template>
  <div>
    <YunButton type="primary">主要按钮</YunButton>
    <YunButton type="default">默认按钮</YunButton>
    <YunButton type="danger">危险按钮</YunButton>
    <YunButton type="success">成功按钮</YunButton>
  </div>
</template>

<script setup>
import { YunButton } from '@yunshu/ui';
</script>
```

### 2. 表格使用

```vue
<template>
  <YunTable :data="tableData" :columns="columns" :loading="loading">
    <template #status="{ row }">
      <YunTag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </YunTag>
    </template>
    <template #action="{ row }">
      <YunButton link @click="handleEdit(row)">编辑</YunButton>
    </template>
  </YunTable>
</template>

<script setup>
import { ref } from 'vue';
import { YunTable, YunButton, YunTag } from '@yunshu/ui';

const loading = ref(false);
const tableData = ref([
  { id: 1, name: '张三', status: 1 },
  { id: 2, name: '李四', status: 0 },
]);

const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { slot: 'status', label: '状态', width: 100 },
  { slot: 'action', label: '操作', width: 120 },
];
</script>
```

### 3. 表单使用

```vue
<template>
  <YunForm :model="form" :rules="rules" @submit="handleSubmit">
    <YunFormItem label="用户名" prop="username">
      <YunInput v-model="form.username" placeholder="请输入用户名" />
    </YunFormItem>
    <YunFormItem label="邮箱" prop="email">
      <YunInput v-model="form.email" placeholder="请输入邮箱" />
    </YunFormItem>
    <YunFormItem>
      <YunButton type="primary" native-type="submit">提交</YunButton>
    </YunFormItem>
  </YunForm>
</template>

<script setup>
import { reactive } from 'vue';
import { YunForm, YunFormItem, YunInput, YunButton } from '@yunshu/ui';

const form = reactive({
  username: '',
  email: '',
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
};

const handleSubmit = () => {
  console.log('Form submitted:', form);
};
</script>
```

### 4. 对话框使用

```vue
<template>
  <YunButton @click="dialogVisible = true">打开对话框</YunButton>
  
  <YunDialog v-model="dialogVisible" title="提示" width="500px">
    <p>这是一段内容</p>
    <template #footer>
      <YunButton @click="dialogVisible = false">取消</YunButton>
      <YunButton type="primary" @click="handleConfirm">确定</YunButton>
    </template>
  </YunDialog>
</template>

<script setup>
import { ref } from 'vue';
import { YunDialog, YunButton } from '@yunshu/ui';

const dialogVisible = ref(false);

const handleConfirm = () => {
  dialogVisible.value = false;
};
</script>
```

### 5. 消息提示

```typescript
import { ElMessage, ElMessageBox } from 'element-plus';

// 成功消息
ElMessage.success('操作成功');

// 错误消息
ElMessage.error('操作失败');

// 警告消息
ElMessage.warning('警告信息');

// 确认对话框
ElMessageBox.confirm('确定要删除吗？', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning',
}).then(() => {
  console.log('Confirmed');
});
```
