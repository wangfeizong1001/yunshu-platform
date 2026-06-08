# 国际化示例

本目录包含云枢中台国际化 (i18n) 的使用示例。

## 目录结构

```
i18n/
├── src/
│   ├── locales/      # 语言文件
│   ├── composables/  # i18n Hooks
│   └── README.md
└── README.md
```

## 语言文件结构

```
src/
└── locales/
    ├── zh-CN/           # 中文
    │   ├── common.json   # 公共翻译
    │   ├── system.json   # 系统模块
    │   └── index.json    # 模块入口
    ├── en/              # 英文
    │   ├── common.json
    │   ├── system.json
    │   └── index.json
    └── index.ts         # 配置入口
```

## 语言文件示例

### 中文 (zh-CN)

```json
{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "create": "创建",
    "search": "搜索",
    "reset": "重置",
    "confirm": "确认",
    "success": "操作成功",
    "error": "操作失败",
    "loading": "加载中...",
    "noData": "暂无数据"
  },
  "system": {
    "user": {
      "title": "用户管理",
      "create": "创建用户",
      "edit": "编辑用户",
      "delete": "删除用户",
      "username": "用户名",
      "email": "邮箱",
      "status": "状态",
      "enabled": "启用",
      "disabled": "禁用",
      "roles": "角色",
      "createTime": "创建时间"
    },
    "role": {
      "title": "角色管理",
      "name": "角色名称",
      "code": "角色编码",
      "description": "描述",
      "permissions": "权限"
    }
  },
  "validation": {
    "required": "此字段为必填项",
    "email": "请输入有效的邮箱地址",
    "minLength": "至少需要 {min} 个字符",
    "maxLength": "最多只能输入 {max} 个字符",
    "pattern": "格式不正确"
  }
}
```

### 英文 (en)

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "reset": "Reset",
    "confirm": "Confirm",
    "success": "Operation successful",
    "error": "Operation failed",
    "loading": "Loading...",
    "noData": "No data"
  },
  "system": {
    "user": {
      "title": "User Management",
      "create": "Create User",
      "edit": "Edit User",
      "delete": "Delete User",
      "username": "Username",
      "email": "Email",
      "status": "Status",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "roles": "Roles",
      "createTime": "Create Time"
    },
    "role": {
      "title": "Role Management",
      "name": "Role Name",
      "code": "Role Code",
      "description": "Description",
      "permissions": "Permissions"
    }
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email address",
    "minLength": "Minimum {min} characters required",
    "maxLength": "Maximum {max} characters allowed",
    "pattern": "Invalid format"
  }
}
```

## i18n 配置

```typescript
// src/plugins/i18n.ts
import { createI18n } from 'vue-i18n';
import { getBrowserLanguage } from '@/utils/language';

const messages = {
  'zh-CN': {
    ...require('@/locales/zh-CN'),
  },
  'en': {
    ...require('@/locales/en'),
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: getBrowserLanguage() || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
  missingWarn: false,
  fallbackWarn: false,
});
```

## 使用方式

### 在模板中使用

```vue
<template>
  <div class="user-page">
    <h1>{{ t('system.user.title') }}</h1>
    
    <YunButton type="primary" @click="handleCreate">
      {{ t('system.user.create') }}
    </YunButton>

    <YunTable :data="tableData">
      <YunTableColumn prop="username" :label="t('system.user.username')" />
      <YunTableColumn prop="email" :label="t('system.user.email')" />
      <YunTableColumn prop="status">
        <template #default="{ row }">
          {{ row.status ? t('system.user.enabled') : t('system.user.disabled') }}
        </template>
      </YunTableColumn>
    </YunTable>
  </div>
</template>

<script setup>
import { useI18n } from '@yunshu/ui';

const { t } = useI18n();
</script>
```

### 在脚本中使用

```typescript
import { useI18n } from '@yunshu/ui';

const { t } = useI18n();

// 带参数的消息
const message = t('validation.minLength', { min: 6 });

// 动态键
const key = isEdit.value ? 'system.user.edit' : 'system.user.create';
const title = t(key);
```

### 使用 $t

```vue
<template>
  <!-- 使用全局 $t -->
  <span>{{ $t('common.success') }}</span>
</template>
```

## 组合式函数

### useLocale

```typescript
// src/composables/useLocale.ts
import { ref, computed } from 'vue';
import { useI18n } from '@yunshu/ui';

export function useLocale() {
  const { locale } = useI18n();
  
  const currentLocale = computed(() => locale.value);
  
  const isZhCN = computed(() => locale.value === 'zh-CN');
  const isEn = computed(() => locale.value === 'en');

  const setLocale = (newLocale: string) => {
    locale.value = newLocale;
    document.documentElement.setAttribute('lang', newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const toggleLocale = () => {
    const newLocale = isZhCN.value ? 'en' : 'zh-CN';
    setLocale(newLocale);
  };

  return {
    currentLocale,
    isZhCN,
    isEn,
    setLocale,
    toggleLocale,
  };
}
```

### useI18n 带命名空间

```typescript
// src/composables/useNamespaceI18n.ts
export function useNamespaceI18n(namespace: string) {
  const { t } = useI18n();

  const nt = (key: string, params?: Record<string, any>) => {
    return t(`${namespace}.${key}`, params);
  };

  return {
    t: nt,
  };
}

// 使用
// const { t } = useNamespaceI18n('system.user');
// t('title') => system.user.title
```

## 语言切换组件

```vue
<template>
  <YunSelect v-model="currentLocale" @change="handleLocaleChange">
    <YunOption label="中文" value="zh-CN" />
    <YunOption label="English" value="en" />
  </YunSelect>
</template>

<script setup>
import { computed } from 'vue';
import { useLocale } from '@/composables/useLocale';

const { currentLocale, setLocale } = useLocale();

const handleLocaleChange = (value: string) => {
  setLocale(value);
};
</script>
```

## 日期格式化

```typescript
import { useI18n } from '@yunshu/ui';

const { t, locale } = useI18n();

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// 格式化时间
const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};
```

## 数字格式化

```typescript
// 格式化货币
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'CNY', // 或 'USD'
  }).format(amount);
};

// 格式化百分比
const formatPercent = (value: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(value);
};

// 格式化数字
const formatNumber = (value: number) => {
  return new Intl.NumberFormat(locale.value).format(value);
};
```

## 复数处理

```json
{
  "item": {
    "one": "{count} item",
    "other": "{count} items"
  }
}
```

```typescript
const { t, n } = useI18n();

// 复数处理
const message = n(10, { key: 'item', locale: locale.value });
// locale = 'en', count = 10 => "10 items"
```
