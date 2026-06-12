<template>
  <div class="page-container">
    <el-page-header title="返回列表" @back="handleBack">
      <template #content>
        <span class="detail-title">操作日志详情</span>
      </template>
    </el-page-header>

    <el-card class="detail-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志编号">{{ detailData.operId }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ detailData.operName }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ formatDate(detailData.operTime) }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperTypeTagType(detailData.operType)">{{ detailData.operType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ detailData.operModule }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag :type="getOperlogStatusTagType(detailData.status)">
            {{ getOperlogStatusLabel(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ detailData.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="操作地址">{{ detailData.operUrl }}</el-descriptions-item>
        <el-descriptions-item label="操作IP">{{ detailData.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ detailData.operSystem }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ detailData.browser }}</el-descriptions-item>
        <el-descriptions-item label="操作地点">{{ detailData.operLocation }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ detailData.costTime }}ms</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(detailData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="操作参数" :span="2">
          <pre class="json-content">{{ formatJson(detailData.operParam) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="返回结果" :span="2">
          <pre class="json-content">{{ formatJson(detailData.jsonResult) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { IOperlog } from '@yunshu/shared'
import { getOperlog } from '@/api/monitor/operlog.api'

// 状态常量
const OPERLOG_STATUS_SUCCESS = '0'
const OPERLOG_STATUS_FAIL = '1'

const getOperlogStatusTagType = (val: string) =>
  val === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger'

const getOperlogStatusLabel = (val: string) =>
  val === OPERLOG_STATUS_SUCCESS ? '成功' : '失败'

const router = useRouter()
const route = useRoute()
const detailData = ref<IOperlog>({} as IOperlog)

const getOperTypeTagType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    查询: 'info',
    新增: 'success',
    修改: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'success',
  }
  return map[type]
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const formatJson = (str: string | undefined) => {
  if (!str) return '-'
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

const handleBack = () => {
  router.back()
}

const loadDetail = async () => {
  const id = route.params.id as string
  try {
    const res = await getOperlog(Number(id)) as { success: boolean; data: IOperlog }
    if (res.success) {
      detailData.value = res.data
    }
  } catch (err) {
    console.error('[OperlogDetail] loadDetail failed:', err)
    ElMessage.error('获取日志详情失败')
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style lang="scss" scoped>
.page-container {
  .detail-title {
    font-size: 16px;
    font-weight: 600;
  }

  .detail-card {
    margin-top: 20px;
  }

  .json-content {
    margin: 0;
    padding: 8px;
    background: #f5f7fa;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 12px;
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
