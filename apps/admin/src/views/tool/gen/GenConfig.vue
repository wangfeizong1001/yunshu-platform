<template>
  <div class="page-container">
    <!-- 基本信息 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" size="small" @click="handleSave">保存配置</el-button>
        </div>
      </template>

      <el-form ref="baseFormRef" :model="formData" :rules="baseRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表名称">
              <el-input v-model="formData.tableName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表描述">
              <el-input v-model="formData.tableComment" placeholder="请输入表描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实体类名称" prop="className">
              <el-input v-model="formData.className" placeholder="请输入实体类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="formData.moduleName" placeholder="请输入模块名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包名称" prop="packageName">
              <el-input v-model="formData.packageName" placeholder="请输入包名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生成类型">
              <el-select v-model="formData.generateType" style="width: 100%">
                <el-option label="单表生成" value="single" />
                <el-option label="树表生成" value="tree" />
                <el-option label="主子表生成" value="master-detail" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 生成选项 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>生成选项</span>
        </div>
      </template>

      <el-form label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="生成菜单">
              <el-switch v-model="formData.generateMenu" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生成前端API">
              <el-switch v-model="formData.generateApi" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生成前端页面">
              <el-switch v-model="formData.generateView" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生成TypeScript">
              <el-switch v-model="formData.generateTypeScript" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 字段信息 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>字段信息</span>
          <el-button type="primary" size="small" :icon="Refresh" @click="handleSyncTable">同步字段</el-button>
        </div>
      </template>

      <el-table :data="columns" border stripe>
        <el-table-column label="字段名" prop="columnName" width="150" align="center" />
        <el-table-column label="注释" prop="columnComment" min-width="150" align="center">
          <template #default="{ row }">
            <el-input v-model="row.columnComment" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="dataType" width="100" align="center" />
        <el-table-column label="Java类型" width="120" align="center">
          <template #default="{ row }">
            <el-select v-model="row.javaType" size="small" style="width: 100%">
              <el-option label="String" value="String" />
              <el-option label="Integer" value="Integer" />
              <el-option label="Long" value="Long" />
              <el-option label="Double" value="Double" />
              <el-option label="BigDecimal" value="BigDecimal" />
              <el-option label="Boolean" value="Boolean" />
              <el-option label="Date" value="Date" />
              <el-option label="LocalDateTime" value="LocalDateTime" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Java属性" prop="javaField" width="120" align="center">
          <template #default="{ row }">
            <el-input v-model="row.javaField" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="主键" prop="isPK" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isPK" type="danger">PK</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="必填" prop="isNullable" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isNullable === 'NO'" type="warning">NO</el-tag>
            <el-tag v-else type="success">YES</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="查询" width="70" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isQuery" />
          </template>
        </el-table-column>
        <el-table-column label="查询方式" width="120" align="center">
          <template #default="{ row }">
            <el-select v-model="row.queryType" size="small" style="width: 100%" :disabled="!row.isQuery">
              <el-option label="=" value="eq" />
              <el-option label="!=" value="ne" />
              <el-option label="LIKE" value="like" />
              <el-option label=">" value="gt" />
              <el-option label="<" value="lt" />
              <el-option label="BETWEEN" value="between" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="显示" width="70" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isDisplay" />
          </template>
        </el-table-column>
        <el-table-column label="显示类型" width="140" align="center">
          <template #default="{ row }">
            <el-select v-model="row.displayType" size="small" style="width: 100%" :disabled="!row.isDisplay">
              <el-option label="文本框" value="input" />
              <el-option label="下拉框" value="select" />
              <el-option label="单选框" value="radio" />
              <el-option label="复选框" value="checkbox" />
              <el-option label="日期" value="date" />
              <el-option label="日期时间" value="datetime" />
              <el-option label="文本域" value="textarea" />
              <el-option label="图片上传" value="image" />
              <el-option label="文件上传" value="file" />
              <el-option label="富文本" value="editor" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" :icon="View" @click="handlePreview">预览代码</el-button>
      <el-button type="success" :icon="Download" @click="handleGenerate">生成代码</el-button>
      <el-button @click="handleBack">返回</el-button>
    </div>

    <!-- 代码预览弹窗 -->
    <GenPreview v-model="previewVisible" :table-name="formData.tableName" :config="formData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, View, Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IGenConfig, IGenColumn } from '@yunshu/shared/types/gen'
import { getGenConfig, saveGenConfig, syncTable, previewCode, downloadCode } from '@/api/tool/gen.api'
import GenPreview from './GenPreview.vue'

const route = useRoute()
const router = useRouter()

const baseFormRef = ref<FormInstance>()
const previewVisible = ref(false)

const formData = reactive<IGenConfig>({
  tableName: '',
  tableComment: '',
  className: '',
  moduleName: '',
  packageName: 'com.yunshu.generator',
  author: '云枢',
  email: '',
  generateType: 'single',
  generateMenu: true,
  generateApi: true,
  generateView: true,
  generateTypeScript: true,
})

const columns = ref<IGenColumn[]>([])

const baseRules: FormRules = {
  className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
  packageName: [{ required: true, message: '请输入包名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
}

// 格式化Java字段名
const formatJavaField = (columnName: string) => {
  return columnName.replace(/_(\w)/g, (_, letter) => letter.toUpperCase())
}

// 格式化类名
const formatClassName = (tableName: string) => {
  return tableName
    .replace(/^sys_|^biz_/, '')
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

const loadConfig = async () => {
  const tableName = route.query.tableName as string
  if (!tableName) return

  try {
    const res = await getGenConfig(tableName)
    if (res.success) {
      const { config, columns: cols } = res.data
      Object.assign(formData, config)
      columns.value = cols.map(col => ({
        ...col,
        isQuery: !!col.queryType,
        isDisplay: true,
      }))

      // 如果没有类名，自动生成
      if (!formData.className) {
        formData.className = formatClassName(tableName)
      }
    }
  } catch {
    ElMessage.error('获取配置失败')
  }
}

const handleSave = async () => {
  try {
    await baseFormRef.value?.validate()
    formData.columns = columns.value
    await saveGenConfig(formData)
    ElMessage.success('保存成功')
  } catch {
    // 验证失败
  }
}

const handleSyncTable = async () => {
  try {
    const res = await syncTable(formData.tableName)
    if (res.success) {
      columns.value = res.data.map(col => ({
        ...col,
        isQuery: !!col.queryType,
        isDisplay: true,
      }))
      ElMessage.success('同步成功')
    }
  } catch {
    ElMessage.error('同步失败')
  }
}

const handlePreview = () => {
  previewVisible.value = true
}

const handleGenerate = () => {
  downloadCode(formData.tableName, formData)
  ElMessage.success('代码生成已触发，请等待下载')
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadConfig()
})
</script>

<style lang="scss" scoped>
.page-container {
  .config-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;
  }
}
</style>
