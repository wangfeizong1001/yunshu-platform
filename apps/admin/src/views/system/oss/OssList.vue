<template>
  <div class="oss-list">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入文件名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="存储类型" prop="storageType">
          <el-select v-model="queryParams.storageType" placeholder="请选择存储类型" clearable>
            <el-option label="本地存储" value="local" />
            <el-option label="阿里云OSS" value="aliyun" />
            <el-option label="腾讯云COS" value="qcloud" />
            <el-option label="七牛云" value="qiniu" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="queryParams.fileType" placeholder="请选择文件类型" clearable>
            <el-option label="图片" value="jpg,png,gif,jpeg" />
            <el-option label="文档" value="pdf,doc,docx,xls,xlsx" />
            <el-option label="视频" value="mp4,avi,rmvb" />
            <el-option label="压缩包" value="zip,rar,7z" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:oss:upload']"
              type="primary"
              :icon="Upload"
              @click="handleUpload"
            >
              上传
            </el-button>
            <el-button
              v-has-permi="['system:oss:remove']"
              type="danger"
              :icon="Delete"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              删除
            </el-button>
            <el-button
              v-has-permi="['system:oss:config']"
              type="warning"
              :icon="Setting"
              @click="handleConfig"
            >
              配置
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Refresh" circle @click="refreshTable" />
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="fileList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="id" label="文件编号" width="100" />
        <el-table-column prop="fileName" label="文件名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="fileType" label="文件类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.fileType.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="storageType" label="存储类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getStorageTypeTag(row.storageType)">
              {{ getStorageTypeName(row.storageType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="上传者" width="120" />
        <el-table-column prop="createTime" label="上传时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-permi="['system:oss:preview']"
              link
              type="primary"
              @click="handlePreview(row)"
            >
              预览
            </el-button>
            <el-button
              v-has-permi="['system:oss:download']"
              link
              type="success"
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button
              v-has-permi="['system:oss:remove']"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 文件上传弹窗 -->
    <OssUploadDialog v-model="uploadVisible" @refresh="handleQuery" />

    <!-- OSS 配置弹窗 -->
    <OssConfigDialog v-model="configVisible" @refresh="refreshTable" />

    <!-- 文件预览弹窗 -->
    <el-dialog
      v-model="previewVisible"
      title="文件预览"
      width="800px"
      append-to-body
    >
      <div class="preview-container">
        <img
          v-if="isImageFile(previewFile?.fileType)"
          :src="previewUrl"
          class="preview-image"
        />
        <el-empty v-else description="该文件类型不支持预览，请下载后查看" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Upload, Delete, Setting } from '@element-plus/icons-vue'
import { getOssPage, deleteOss, batchDeleteOss, downloadOss } from '@/api/system/oss.api'
import type { OssFile, OssFileQuery } from '@yunshu/shared'
import OssUploadDialog from './OssUpload.vue'
import OssConfigDialog from './OssConfig.vue'

// 状态
const loading = ref(false)
const fileList = ref<OssFile[]>([])
const total = ref(0)
const selectedRows = ref<OssFile[]>([])
const uploadVisible = ref(false)
const configVisible = ref(false)
const previewVisible = ref(false)
const previewFile = ref<OssFile | null>(null)
const previewUrl = ref('')

// 查询参数
const queryParams = reactive<OssFileQuery>({
  keyword: '',
  storageType: undefined,
  fileType: '',
  pageNum: 1,
  pageSize: 10,
})

// 格式化文件大小
function formatFileSize(size: number): string {
  if (size === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return `${(size / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// 获取存储类型名称
function getStorageTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    local: '本地',
    aliyun: '阿里云OSS',
    qcloud: '腾讯云COS',
    qiniu: '七牛云',
  }
  return typeMap[type] || type
}

// 获取存储类型标签类型
function getStorageTypeTag(type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    local: 'info',
    aliyun: 'success',
    qcloud: 'warning',
    qiniu: 'danger',
  }
  return typeMap[type] || 'info'
}

// 判断是否为图片文件
function isImageFile(fileType: string | undefined): boolean {
  if (!fileType) return false
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType.toLowerCase())
}

// 加载文件列表
async function fetchFileList() {
  loading.value = true
  try {
    const res = await getOssPage(queryParams)
    const pageData = res?.data
    fileList.value = pageData?.rows ?? []
    total.value = pageData?.total ?? 0
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchFileList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.storageType = undefined
  queryParams.fileType = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchFileList()
}

// 上传
function handleUpload() {
  uploadVisible.value = true
}

// 配置
function handleConfig() {
  configVisible.value = true
}

// 预览
async function handlePreview(row: OssFile) {
  previewFile.value = row
  if (isImageFile(row.fileType)) {
    previewUrl.value = row.url
    previewVisible.value = true
  } else {
    previewVisible.value = true
  }
}

// 下载
async function handleDownload(row: OssFile) {
  try {
    await downloadOss(row.id)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

// 删除
async function handleDelete(row: OssFile) {
  try {
    await ElMessageBox.confirm(`是否确认删除文件"${row.fileName}"？`, '提示', {
      type: 'warning',
    })
    await deleteOss(row.id)
    ElMessage.success('删除成功')
    fetchFileList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`是否确认删除选中的${selectedRows.value.length}个文件？`, '提示', {
      type: 'warning',
    })
    const ids = selectedRows.value.map((row) => row.id)
    await batchDeleteOss(ids)
    ElMessage.success('删除成功')
    fetchFileList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 批量选择
function handleSelectionChange(selection: OssFile[]) {
  selectedRows.value = selection
}

// 初始化
onMounted(() => {
  fetchFileList()
})
</script>

<style scoped lang="scss">
.oss-list {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;

    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }
  }
}
</style>
