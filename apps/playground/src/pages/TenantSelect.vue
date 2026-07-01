<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>租户选择</h1>
      <p>多租户系统中的租户切换组件</p>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>下拉选择</h2>
        <p>使用下拉菜单选择租户</p>
      </div>
      <div class="demo-content">
        <div class="tenant-selector">
          <el-select v-model="currentTenant" placeholder="请选择租户" @change="handleTenantChange">
            <el-option
              v-for="tenant in tenants"
              :key="tenant.id"
              :label="tenant.name"
              :value="tenant.id"
            >
              <div class="tenant-option">
                <span class="tenant-name">{{ tenant.name }}</span>
                <el-tag size="small" :type="tenant.status === 1 ? 'success' : 'info'">
                  {{ tenant.status === 1 ? '正常' : '停用' }}
                </el-tag>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="current-tenant" v-if="currentTenantInfo">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="租户名称">{{ currentTenantInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="租户编码">{{ currentTenantInfo.code }}</el-descriptions-item>
            <el-descriptions-item label="套餐">{{ currentTenantInfo.package }}</el-descriptions-item>
            <el-descriptions-item label="到期时间">{{ currentTenantInfo.expireTime }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>卡片选择</h2>
        <p>以卡片形式展示租户列表</p>
      </div>
      <div class="demo-content">
        <div class="tenant-cards">
          <div
            v-for="tenant in tenants"
            :key="tenant.id"
            class="tenant-card"
            :class="{ active: currentTenant === tenant.id }"
            @click="selectTenant(tenant.id)"
          >
            <div class="tenant-card-header">
              <span class="tenant-icon">{{ tenant.name.charAt(0) }}</span>
              <span class="tenant-name">{{ tenant.name }}</span>
            </div>
            <div class="tenant-card-body">
              <div class="tenant-info">
                <span class="label">编码：</span>
                <span>{{ tenant.code }}</span>
              </div>
              <div class="tenant-info">
                <span class="label">套餐：</span>
                <span>{{ tenant.package }}</span>
              </div>
            </div>
            <div class="tenant-card-footer">
              <el-tag size="small" :type="tenant.status === 1 ? 'success' : 'info'">
                {{ tenant.status === 1 ? '正常' : '停用' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>带搜索</h2>
        <p>支持搜索过滤的租户选择</p>
      </div>
      <div class="demo-content">
        <div class="tenant-search">
          <el-select
            v-model="searchTenant"
            filterable
            placeholder="搜索租户..."
            remote
            :remote-method="handleSearch"
            :loading="loading"
            @change="handleTenantChange"
          >
            <el-option
              v-for="tenant in filteredTenants"
              :key="tenant.id"
              :label="tenant.name"
              :value="tenant.id"
            >
              <div class="tenant-option">
                <span class="tenant-name">{{ tenant.name }}</span>
                <span class="tenant-code">{{ tenant.code }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>自定义属性</h2>
        <p>实时调整组件属性</p>
      </div>
      <div class="demo-content">
        <div class="props-panel">
          <div class="prop-item">
            <span class="prop-label">禁用</span>
            <el-switch v-model="disabled" />
          </div>
          <div class="prop-item">
            <span class="prop-label">可清除</span>
            <el-switch v-model="clearable" />
          </div>
          <div class="prop-item">
            <span class="prop-label">可搜索</span>
            <el-switch v-model="filterable" />
          </div>
        </div>
        <div class="tenant-custom">
          <el-select
            v-model="currentTenant"
            :disabled="disabled"
            :clearable="clearable"
            :filterable="filterable"
            placeholder="请选择租户"
            @change="handleTenantChange"
          >
            <el-option
              v-for="tenant in tenants"
              :key="tenant.id"
              :label="tenant.name"
              :value="tenant.id"
            >
              {{ tenant.name }}
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Tenant {
  id: number;
  name: string;
  code: string;
  package: string;
  status: number;
  expireTime: string;
}

const tenants = ref<Tenant[]>([
  { id: 1, name: '总公司', code: 'HQ', package: '旗舰版', status: 1, expireTime: '2027-01-01' },
  { id: 2, name: '北京分公司', code: 'BJ', package: '专业版', status: 1, expireTime: '2026-06-30' },
  { id: 3, name: '上海分公司', code: 'SH', package: '基础版', status: 1, expireTime: '2026-12-31' },
  { id: 4, name: '广州分公司', code: 'GZ', package: '专业版', status: 2, expireTime: '2026-03-15' },
  { id: 5, name: '深圳分公司', code: 'SZ', package: '旗舰版', status: 1, expireTime: '2027-06-01' },
]);

const currentTenant = ref<number>(1);
const searchTenant = ref<number | undefined>();
const loading = ref(false);
const disabled = ref(false);
const clearable = ref(true);
const filterable = ref(true);
const searchQuery = ref('');

const currentTenantInfo = computed(() => {
  return tenants.value.find((t) => t.id === currentTenant.value);
});

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value;
  const query = searchQuery.value.toLowerCase();
  return tenants.value.filter(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      t.code.toLowerCase().includes(query)
  );
});

const handleTenantChange = (value: number) => {
  console.log('租户切换:', value);
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 300);
};

const selectTenant = (id: number) => {
  currentTenant.value = id;
};
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1000px;
}

.demo-header {
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 8px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 14px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }
}

.section-header {
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;

    .dark & {
      color: #fff;
    }
  }

  p {
    font-size: 13px;
    color: #909399;

    .dark & {
      color: #c0c4cc;
    }
  }
}

.demo-content {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;

  .dark & {
    background: #1a202c;
  }
}

.tenant-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.current-tenant {
  margin-top: 20px;
}

.tenant-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tenant-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tenant-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 2px solid #ebeef5;
  cursor: pointer;
  transition: all 0.2s;

  .dark & {
    background: #2d3748;
    border-color: #4a5568;
  }

  &:hover {
    border-color: #4a9eff;
  }

  &.active {
    border-color: #4a9eff;
    box-shadow: 0 2px 12px rgba(74, 158, 255, 0.2);
  }

  &-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  &-body {
    margin-bottom: 12px;
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
  }
}

.tenant-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4a9eff 0%, #2c7ad6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
}

.tenant-info {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;

  .dark & {
    color: #c0c4cc;
  }

  .label {
    color: #909399;
  }
}

.tenant-search {
  display: flex;
  justify-content: center;
  max-width: 300px;
}

.tenant-custom {
  margin-top: 20px;
  max-width: 300px;
}

.props-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-label {
  font-size: 14px;
  color: #606266;

  .dark & {
    color: #c0c4cc;
  }
}
</style>
