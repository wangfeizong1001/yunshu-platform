<template>
  <div class="sso-config">
    <!-- SSO 全局配置 -->
    <el-card shadow="never" class="config-card">
      <template #header>
        <div class="card-header">
          <span>SSO 全局配置</span>
          <el-button type="primary" :icon="Edit" @click="handleEditConfig">修改配置</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="SSO 类型">
          <el-tag>{{ getSsoTypeName(config.type) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="config.enabled ? 'success' : 'danger'">
            {{ config.enabled ? '已启用' : '已禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="登录页面标题" :span="2">
          {{ config.title || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="默认跳转URL" :span="2">
          {{ config.defaultRedirectUrl || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="会话超时时间">
          {{ config.sessionTimeout ? `${config.sessionTimeout / 60} 分钟` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="登出地址">
          {{ config.logoutUrl || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 应用管理 -->
    <el-card shadow="never" class="app-card">
      <template #header>
        <div class="card-header">
          <span>应用管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAddApp">新增应用</el-button>
        </div>
      </template>

      <el-table v-loading="appLoading" :data="appList" stripe border>
        <el-table-column prop="id" label="应用ID" width="80" />
        <el-table-column prop="appName" label="应用名称" width="150" />
        <el-table-column prop="appCode" label="应用编码" width="120" />
        <el-table-column prop="appType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getAppTypeName(row.appType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="clientId" label="Client ID" min-width="150" show-overflow-tooltip />
        <el-table-column prop="scopes" label="权限范围" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.scopes?.join(', ') || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'" size="small">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditApp(row)">编辑</el-button>
            <el-button link type="primary" @click="handleAuthorize(row)">授权</el-button>
            <el-button link type="success" @click="handleTestConnection(row)">测试</el-button>
            <el-button link type="danger" @click="handleDeleteApp(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="appQueryParams.pageNum"
          v-model:page-size="appQueryParams.pageSize"
          :total="appTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadAppList"
          @current-change="loadAppList"
        />
      </div>
    </el-card>

    <!-- 修改全局配置弹窗 -->
    <el-dialog v-model="configVisible" title="修改 SSO 配置" width="500px" append-to-body>
      <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="120px">
        <el-form-item label="SSO 类型" prop="type">
          <el-select v-model="configForm.type" placeholder="请选择 SSO 类型">
            <el-option label="OAuth2.0" value="oauth2" />
            <el-option label="CAS" value="cas" />
            <el-option label="LDAP" value="ldap" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用SSO" prop="enabled">
          <el-switch v-model="configForm.enabled" />
        </el-form-item>
        <el-form-item label="登录页面标题" prop="title">
          <el-input v-model="configForm.title" placeholder="请输入登录页面标题" />
        </el-form-item>
        <el-form-item label="默认跳转URL" prop="defaultRedirectUrl">
          <el-input v-model="configForm.defaultRedirectUrl" placeholder="请输入默认跳转URL" />
        </el-form-item>
        <el-form-item label="登出地址" prop="logoutUrl">
          <el-input v-model="configForm.logoutUrl" placeholder="请输入登出地址" />
        </el-form-item>
        <el-form-item label="会话超时(秒)" prop="sessionTimeout">
          <el-input-number v-model="configForm.sessionTimeout" :min="300" :max="86400" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" :loading="configLoading" @click="handleSaveConfig">保存</el-button>
      </template>
    </el-dialog>

    <!-- 应用表单弹窗 -->
    <el-dialog v-model="appVisible" :title="appForm.id ? '编辑应用' : '新增应用'" width="700px" append-to-body>
      <el-form ref="appFormRef" :model="appForm" :rules="appRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用名称" prop="appName">
              <el-input v-model="appForm.appName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用编码" prop="appCode">
              <el-input v-model="appForm.appCode" placeholder="请输入应用编码" :disabled="!!appForm.id" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用类型" prop="appType">
              <el-select v-model="appForm.appType" placeholder="请选择应用类型">
                <el-option label="OAuth2.0" value="oauth2" />
                <el-option label="CAS" value="cas" />
                <el-option label="LDAP" value="ldap" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="appForm.status">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Client ID" prop="clientId">
          <el-input v-model="appForm.clientId" placeholder="请输入 Client ID" />
        </el-form-item>
        <el-form-item label="Client Secret" prop="clientSecret">
          <el-input v-model="appForm.clientSecret" placeholder="请输入 Client Secret" show-password />
        </el-form-item>
        <el-form-item label="授权地址" prop="authorizationUrl">
          <el-input v-model="appForm.authorizationUrl" placeholder="请输入授权地址" />
        </el-form-item>
        <el-form-item label="Token地址" prop="tokenUrl">
          <el-input v-model="appForm.tokenUrl" placeholder="请输入 Token 地址" />
        </el-form-item>
        <el-form-item label="用户信息地址" prop="userInfoUrl">
          <el-input v-model="appForm.userInfoUrl" placeholder="请输入用户信息地址" />
        </el-form-item>
        <el-form-item label="权限范围" prop="scopes">
          <el-select v-model="appForm.scopes" multiple placeholder="请选择权限范围" style="width: 100%">
            <el-option label="user:email" value="user:email" />
            <el-option label="user:profile" value="user:profile" />
            <el-option label="snsapi_base" value="snsapi_base" />
            <el-option label="snsapi_privateinfo" value="snsapi_privateinfo" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="appForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appVisible = false">取消</el-button>
        <el-button type="primary" :loading="appLoading" @click="handleSaveApp">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus } from '@element-plus/icons-vue'
import {
  getSsoConfig,
  updateSsoConfig,
  getSsoAppList,
  createSsoApp,
  updateSsoApp,
  deleteSsoApp,
  getSsoAuthorizeUrl,
  testSsoConnection,
} from '@/api/system/sso.api'
import type { SsoConfig, SsoApplication, SsoAppQuery } from '@yunshu/shared'

// 全局配置相关
const config = reactive<SsoConfig>({
  type: 'oauth2',
  enabled: false,
  title: '',
  defaultRedirectUrl: '',
  logoutUrl: '',
  sessionTimeout: 7200,
})

const configVisible = ref(false)
const configLoading = ref(false)
const configFormRef = ref()
const configForm = reactive({ ...config })

const configRules = {
  type: [{ required: true, message: '请选择 SSO 类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入登录页面标题', trigger: 'blur' }],
}

// 应用相关
const appLoading = ref(false)
const appList = ref<SsoApplication[]>([])
const appTotal = ref(0)
const appQueryParams = reactive<SsoAppQuery>({
  pageNum: 1,
  pageSize: 10,
})

const appVisible = ref(false)
const appFormRef = ref()
const appForm = reactive({
  id: 0,
  appName: '',
  appCode: '',
  appType: 'oauth2' as 'oauth2' | 'cas' | 'ldap',
  clientId: '',
  clientSecret: '',
  authorizationUrl: '',
  tokenUrl: '',
  userInfoUrl: '',
  scopes: [] as string[],
  logo: '',
  status: '1',
  remark: '',
})

const appRules = {
  appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  appCode: [{ required: true, message: '请输入应用编码', trigger: 'blur' }],
  appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
}

// 获取 SSO 类型名称
function getSsoTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    oauth2: 'OAuth2.0',
    cas: 'CAS',
    ldap: 'LDAP',
  }
  return typeMap[type] || type
}

// 获取应用类型名称
function getAppTypeName(type: string): string {
  return getSsoTypeName(type)
}

// 加载全局配置
async function loadConfig() {
  try {
    const res = await getSsoConfig()
    Object.assign(config, res)
    Object.assign(configForm, res)
  } catch (error) {
    console.error('加载配置失败', error)
  }
}

// 加载应用列表
async function loadAppList() {
  appLoading.value = true
  try {
    const res = await getSsoAppList(appQueryParams)
    appList.value = res.rows
    appTotal.value = res.total
  } finally {
    appLoading.value = false
  }
}

// 修改全局配置
function handleEditConfig() {
  Object.assign(configForm, config)
  configVisible.value = true
}

// 保存全局配置
async function handleSaveConfig() {
  try {
    await configFormRef.value?.validate()
    configLoading.value = true
    await updateSsoConfig(configForm)
    ElMessage.success('保存成功')
    configVisible.value = false
    loadConfig()
  } catch (error) {
    console.error('保存配置失败', error)
  } finally {
    configLoading.value = false
  }
}

// 新增应用
function handleAddApp() {
  appForm.id = 0
  appForm.appName = ''
  appForm.appCode = ''
  appForm.appType = 'oauth2'
  appForm.clientId = ''
  appForm.clientSecret = ''
  appForm.authorizationUrl = ''
  appForm.tokenUrl = ''
  appForm.userInfoUrl = ''
  appForm.scopes = []
  appForm.logo = ''
  appForm.status = '1'
  appForm.remark = ''
  appVisible.value = true
}

// 编辑应用
function handleEditApp(row: SsoApplication) {
  Object.assign(appForm, row)
  appVisible.value = true
}

// 保存应用
async function handleSaveApp() {
  try {
    await appFormRef.value?.validate()
    appLoading.value = true
    if (appForm.id) {
      await updateSsoApp(appForm as Partial<SsoApplication>)
    } else {
      await createSsoApp(appForm)
    }
    ElMessage.success('保存成功')
    appVisible.value = false
    loadAppList()
  } catch (error) {
    console.error('保存应用失败', error)
  } finally {
    appLoading.value = false
  }
}

// 删除应用
async function handleDeleteApp(row: SsoApplication) {
  try {
    await ElMessageBox.confirm(`是否确认删除应用"${row.appName}"？`, '提示', { type: 'warning' })
    await deleteSsoApp(row.id)
    ElMessage.success('删除成功')
    loadAppList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除应用失败', error)
    }
  }
}

// 授权
async function handleAuthorize(row: SsoApplication) {
  try {
    const res = await getSsoAuthorizeUrl(row.appCode)
    if (res.success && res.url) {
      window.open(res.url, '_blank')
    } else {
      ElMessage.error(res.errorMsg || '获取授权链接失败')
    }
  } catch (error) {
    console.error('获取授权链接失败', error)
  }
}

// 测试连接
async function handleTestConnection(row: SsoApplication) {
  try {
    const result = await testSsoConnection(row)
    if (result) {
      ElMessage.success('连接测试成功')
    } else {
      ElMessage.error('连接测试失败')
    }
  } catch (error) {
    ElMessage.error('连接测试失败')
    console.error('测试连接失败', error)
  }
}

// 初始化
onMounted(() => {
  loadConfig()
  loadAppList()
})
</script>

<style scoped lang="scss">
.sso-config {
  .config-card {
    margin-bottom: 16px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
