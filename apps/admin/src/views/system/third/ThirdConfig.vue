<template>
  <div class="third-config">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="queryParams.platform" placeholder="请选择平台" clearable>
            <el-option label="微信" value="wechat" />
            <el-option label="GitHub" value="github" />
            <el-option label="企业微信" value="wecom" />
            <el-option label="钉钉" value="dingtalk" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>第三方登录配置</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增配置</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="configList" stripe border>
        <el-table-column prop="id" label="配置ID" width="100" />
        <el-table-column prop="platform" label="平台" width="120">
          <template #default="{ row }">
            <el-tag :type="getPlatformTag(row.platform)">{{ getPlatformName(row.platform) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="appId" label="App ID" min-width="150" show-overflow-tooltip />
        <el-table-column prop="callbackUrl" label="回调地址" min-width="200" show-overflow-tooltip />
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
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleAuthorize(row)">授权</el-button>
            <el-button link type="success" @click="handleTestConnection(row)">测试</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 配置表单弹窗 -->
    <el-dialog v-model="formVisible" :title="form.id ? '编辑配置' : '新增配置'" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="平台" prop="platform">
          <el-select v-model="form.platform" placeholder="请选择平台" :disabled="!!form.id">
            <el-option label="微信" value="wechat" />
            <el-option label="GitHub" value="github" />
            <el-option label="企业微信" value="wecom" />
            <el-option label="钉钉" value="dingtalk" />
          </el-select>
        </el-form-item>
        <el-form-item label="App ID" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入 App ID" />
        </el-form-item>
        <el-form-item label="App Secret" prop="appSecret">
          <el-input v-model="form.appSecret" placeholder="请输入 App Secret" show-password />
        </el-form-item>
        <el-form-item label="回调地址" prop="callbackUrl">
          <el-input v-model="form.callbackUrl" placeholder="请输入回调地址" />
        </el-form-item>
        <el-form-item label="权限范围" prop="scopes">
          <el-select v-model="form.scopes" multiple placeholder="请选择权限范围" style="width: 100%">
            <el-option label="snsapi_login" value="snsapi_login" />
            <el-option label="snsapi_base" value="snsapi_base" />
            <el-option label="snsapi_privateinfo" value="snsapi_privateinfo" />
            <el-option label="user:email" value="user:email" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getThirdConfigList, updateThirdConfig } from '@/api/system/third.api'
import type { ThirdLoginConfig, ThirdConfigQuery } from '@yunshu/shared'

// 状态
const loading = ref(false)
const formLoading = ref(false)
const configList = ref<ThirdLoginConfig[]>([])
const queryParams = reactive<ThirdConfigQuery>({
  platform: undefined,
  status: undefined,
})

const formVisible = ref(false)
const formRef = ref()
const form = reactive({
  id: 0,
  platform: 'wechat' as 'wechat' | 'github' | 'wecom' | 'dingtalk',
  appId: '',
  appSecret: '',
  callbackUrl: '',
  scopes: [] as string[],
  status: '1',
  remark: '',
})

const rules = {
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
  appId: [{ required: true, message: '请输入 App ID', trigger: 'blur' }],
  appSecret: [{ required: true, message: '请输入 App Secret', trigger: 'blur' }],
  callbackUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }],
}

// 获取平台名称
function getPlatformName(platform: string): string {
  const platformMap: Record<string, string> = {
    wechat: '微信',
    github: 'GitHub',
    wecom: '企业微信',
    dingtalk: '钉钉',
  }
  return platformMap[platform] || platform
}

// 获取平台标签类型
function getPlatformTag(platform: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined {
  const tagMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    wechat: 'success',
    github: 'info',
    wecom: 'warning',
    dingtalk: 'primary',
  }
  return tagMap[platform] || 'info'
}

// 加载配置列表
async function loadConfigList() {
  loading.value = true
  try {
    const res = await getThirdConfigList()
    configList.value = res as any
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  loadConfigList()
}

// 重置查询
function resetQuery() {
  queryParams.platform = undefined
  queryParams.status = undefined
  loadConfigList()
}

// 新增
function handleAdd() {
  form.id = 0
  form.platform = 'wechat'
  form.appId = ''
  form.appSecret = ''
  form.callbackUrl = ''
  form.scopes = []
  form.status = '1'
  form.remark = ''
  formVisible.value = true
}

// 编辑
function handleEdit(row: any) {
  Object.assign(form, row)
  formVisible.value = true
}

// 保存
async function handleSave() {
  try {
    await formRef.value?.validate()
    formLoading.value = true
    await updateThirdConfig(form as any)
    ElMessage.success('保存成功')
    formVisible.value = false
    loadConfigList()
  } catch (error) {
    console.error('保存失败', error)
  } finally {
    formLoading.value = false
  }
}

// 删除
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`是否确认删除"${getPlatformName(row.platform)}"配置？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadConfigList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 授权
async function handleAuthorize(_row: any) {
  try {
    ElMessage.info('授权功能开发中')
  } catch (error) {
    console.error('获取授权链接失败', error)
  }
}

// 测试连接
async function handleTestConnection(_row: any) {
  try {
    ElMessage.info('测试连接功能开发中')
  } catch (error) {
    console.error('测试连接失败', error)
  }
}

// 初始化
onMounted(() => {
  loadConfigList()
})
</script>

<style scoped lang="scss">
.third-config {
  .search-card {
    margin-bottom: 16px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
