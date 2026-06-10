<template>
  <el-dialog
    v-model="visible"
    title="OSS 配置"
    width="900px"
    append-to-body
    @close="handleClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="阿里云 OSS" name="aliyun">
        <el-form
          ref="aliyunFormRef"
          :model="aliyunForm"
          :rules="aliyunRules"
          label-width="140px"
        >
          <el-form-item label="存储类型">
            <el-input v-model="aliyunForm.typeName" disabled />
          </el-form-item>
          <el-form-item label="AccessKey" prop="accessKey">
            <el-input
              v-model="aliyunForm.accessKey"
              placeholder="请输入 AccessKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="SecretKey" prop="secretKey">
            <el-input
              v-model="aliyunForm.secretKey"
              placeholder="请输入 SecretKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="Bucket" prop="bucket">
            <el-input v-model="aliyunForm.bucket" placeholder="请输入 Bucket 名称" />
          </el-form-item>
          <el-form-item label="Endpoint" prop="endpoint">
            <el-input v-model="aliyunForm.endpoint" placeholder="请输入 Endpoint" />
          </el-form-item>
          <el-form-item label="自定义域名" prop="domain">
            <el-input v-model="aliyunForm.domain" placeholder="请输入自定义域名" />
          </el-form-item>
          <el-form-item label="文件前缀" prop="prefix">
            <el-input v-model="aliyunForm.prefix" placeholder="请输入文件前缀" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="aliyunForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="aliyunForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" :loading="aliyunLoading" @click="handleTestConnection('aliyun')">
            测试连接
          </el-button>
          <el-button type="primary" :loading="aliyunLoading" @click="handleSaveConfig('aliyun')">
            保存配置
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="腾讯云 COS" name="qcloud">
        <el-form
          ref="qcloudFormRef"
          :model="qcloudForm"
          :rules="qcloudRules"
          label-width="140px"
        >
          <el-form-item label="存储类型">
            <el-input v-model="qcloudForm.typeName" disabled />
          </el-form-item>
          <el-form-item label="SecretId" prop="accessKey">
            <el-input
              v-model="qcloudForm.accessKey"
              placeholder="请输入 SecretId"
              show-password
            />
          </el-form-item>
          <el-form-item label="SecretKey" prop="secretKey">
            <el-input
              v-model="qcloudForm.secretKey"
              placeholder="请输入 SecretKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="Bucket" prop="bucket">
            <el-input v-model="qcloudForm.bucket" placeholder="请输入 Bucket 名称" />
          </el-form-item>
          <el-form-item label="Endpoint" prop="endpoint">
            <el-input v-model="qcloudForm.endpoint" placeholder="请输入 Endpoint" />
          </el-form-item>
          <el-form-item label="自定义域名" prop="domain">
            <el-input v-model="qcloudForm.domain" placeholder="请输入自定义域名" />
          </el-form-item>
          <el-form-item label="文件前缀" prop="prefix">
            <el-input v-model="qcloudForm.prefix" placeholder="请输入文件前缀" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="qcloudForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="qcloudForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" :loading="qcloudLoading" @click="handleTestConnection('qcloud')">
            测试连接
          </el-button>
          <el-button type="primary" :loading="qcloudLoading" @click="handleSaveConfig('qcloud')">
            保存配置
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="七牛云存储" name="qiniu">
        <el-form
          ref="qiniuFormRef"
          :model="qiniuForm"
          :rules="qiniuRules"
          label-width="140px"
        >
          <el-form-item label="存储类型">
            <el-input v-model="qiniuForm.typeName" disabled />
          </el-form-item>
          <el-form-item label="AccessKey" prop="accessKey">
            <el-input
              v-model="qiniuForm.accessKey"
              placeholder="请输入 AccessKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="SecretKey" prop="secretKey">
            <el-input
              v-model="qiniuForm.secretKey"
              placeholder="请输入 SecretKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="Bucket" prop="bucket">
            <el-input v-model="qiniuForm.bucket" placeholder="请输入 Bucket 名称" />
          </el-form-item>
          <el-form-item label="上传地址" prop="endpoint">
            <el-input v-model="qiniuForm.endpoint" placeholder="请输入上传地址" />
          </el-form-item>
          <el-form-item label="自定义域名" prop="domain">
            <el-input v-model="qiniuForm.domain" placeholder="请输入自定义域名" />
          </el-form-item>
          <el-form-item label="文件前缀" prop="prefix">
            <el-input v-model="qiniuForm.prefix" placeholder="请输入文件前缀" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="qiniuForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="qiniuForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" :loading="qiniuLoading" @click="handleTestConnection('qiniu')">
            测试连接
          </el-button>
          <el-button type="primary" :loading="qiniuLoading" @click="handleSaveConfig('qiniu')">
            保存配置
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="本地存储" name="local">
        <el-form
          ref="localFormRef"
          :model="localForm"
          label-width="140px"
        >
          <el-form-item label="存储类型">
            <el-input v-model="localForm.typeName" disabled />
          </el-form-item>
          <el-form-item label="文件前缀" prop="prefix">
            <el-input v-model="localForm.prefix" placeholder="请输入文件前缀" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="localForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="localForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" :loading="localLoading" @click="handleSaveConfig('local')">
            保存配置
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getOssConfig } from '@/api/system/oss.api'
import type { OssStorageType } from '@yunshu/shared'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'refresh': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const activeTab = ref<string>('aliyun')
const aliyunLoading = ref(false)
const qcloudLoading = ref(false)
const qiniuLoading = ref(false)
const localLoading = ref(false)

const aliyunFormRef = ref()
const qcloudFormRef = ref()
const qiniuFormRef = ref()
const localFormRef = ref()

// 表单数据
const aliyunForm = reactive({
  id: 0,
  type: 'aliyun' as OssStorageType,
  typeName: '阿里云 OSS',
  accessKey: '',
  secretKey: '',
  bucket: '',
  endpoint: '',
  domain: '',
  prefix: 'uploads/',
  status: '1',
  remark: '',
})

const qcloudForm = reactive({
  id: 0,
  type: 'qcloud' as OssStorageType,
  typeName: '腾讯云 COS',
  accessKey: '',
  secretKey: '',
  bucket: '',
  endpoint: '',
  domain: '',
  prefix: 'uploads/',
  status: '0',
  remark: '',
})

const qiniuForm = reactive({
  id: 0,
  type: 'qiniu' as OssStorageType,
  typeName: '七牛云存储',
  accessKey: '',
  secretKey: '',
  bucket: '',
  endpoint: '',
  domain: '',
  prefix: 'uploads/',
  status: '0',
  remark: '',
})

const localForm = reactive({
  id: 0,
  type: 'local' as OssStorageType,
  typeName: '本地存储',
  accessKey: '',
  secretKey: '',
  bucket: '',
  endpoint: '',
  domain: '',
  prefix: 'uploads/',
  status: '1',
  remark: '',
})

// 验证规则
const aliyunRules = {
  accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
  secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
  bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
  endpoint: [{ required: true, message: '请输入 Endpoint', trigger: 'blur' }],
}

const qcloudRules = {
  accessKey: [{ required: true, message: '请输入 SecretId', trigger: 'blur' }],
  secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
  bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
  endpoint: [{ required: true, message: '请输入 Endpoint', trigger: 'blur' }],
}

const qiniuRules = {
  accessKey: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
  secretKey: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
  bucket: [{ required: true, message: '请输入 Bucket', trigger: 'blur' }],
  endpoint: [{ required: true, message: '请输入上传地址', trigger: 'blur' }],
}

// 加载配置数据
async function loadConfig() {
  try {
    const res = await getOssConfig() as Record<string, unknown>
    const configs = res?.configs || []

    // 更新各平台表单数据
    configs.forEach((config: Record<string, unknown>) => {
      const formData: Record<string, unknown> = {
        id: config.id,
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        bucket: config.bucket,
        endpoint: config.endpoint,
        domain: config.domain,
        prefix: config.prefix,
        status: config.status,
        remark: config.remark,
      }

      switch (config.type) {
        case 'aliyun':
          Object.assign(aliyunForm, formData)
          break
        case 'qcloud':
          Object.assign(qcloudForm, formData)
          break
        case 'qiniu':
          Object.assign(qiniuForm, formData)
          break
        case 'local':
          Object.assign(localForm, formData)
          break
      }
    })

    // 设置当前使用的标签页
    if (res?.current) {
      activeTab.value = res.current.type
    }
  } catch (error) {
    console.error('加载配置失败', error)
  }
}

// 测试连接
async function handleTestConnection(type: string) {
  let formRef: unknown

  switch (type) {
    case 'aliyun':
      formRef = aliyunFormRef
      aliyunLoading.value = true
      break
    case 'qcloud':
      formRef = qcloudFormRef
      qcloudLoading.value = true
      break
    case 'qiniu':
      formRef = qiniuFormRef
      qiniuLoading.value = true
      break
    default:
      return
  }

  try {
    await formRef.value?.validate()
    ElMessage.info('测试连接功能开发中')
  } catch (error) {
    console.error('测试连接失败', error)
  } finally {
    aliyunLoading.value = false
    qcloudLoading.value = false
    qiniuLoading.value = false
  }
}

// 保存配置
async function handleSaveConfig(type: string) {
  let formRef: unknown
  let loadingRef: string

  switch (type) {
    case 'aliyun':
      formRef = aliyunFormRef
      loadingRef = 'aliyunLoading'
      break
    case 'qcloud':
      formRef = qcloudFormRef
      loadingRef = 'qcloudLoading'
      break
    case 'qiniu':
      formRef = qiniuFormRef
      loadingRef = 'qiniuLoading'
      break
    case 'local':
      formRef = localFormRef
      loadingRef = 'localLoading'
      break
    default:
      return
  }

  try {
    await formRef.value?.validate()
    ;(window as unknown as Record<string, boolean>)[loadingRef] = true
    ElMessage.info('保存配置功能开发中')
    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('保存配置失败', error)
  } finally {
    ;(window as unknown as Record<string, boolean>)[loadingRef] = false
  }
}

// 关闭弹窗
function handleClose() {
  visible.value = false
}

// 监听弹窗打开
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      loadConfig()
    }
  }
)
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
