<template>
  <div class="page-container">
    <el-page-header @back="handleBack" content="代码生成配置">
      <template #extra>
        <el-button type="primary" :icon="Check" @click="handleSave">保存配置</el-button>
      </template>
    </el-page-header>

    <el-card class="config-card" style="margin-top: 16px;">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form ref="baseFormRef" :model="formData" :rules="baseRules" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="表名称">
                  <el-input v-model="formData.tableName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表描述" prop="tableComment">
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
                <el-form-item label="业务名称" prop="businessName">
                  <el-input v-model="formData.businessName" placeholder="请输入业务名称（用于URL路径）" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="功能名称" prop="functionName">
                  <el-input v-model="formData.functionName" placeholder="请输入功能名称" />
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
              <el-col :span="24" v-if="formData.generateType === 'tree'">
                <el-alert title="树表配置" type="info" show-icon style="margin-bottom: 16px;" />
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="树编码字段" prop="treeCodeField">
                      <el-select v-model="formData.treeCodeField" placeholder="请选择" style="width: 100%">
                        <el-option v-for="col in columns" :key="col.columnName" :label="col.columnName" :value="col.columnName" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="树父编码字段" prop="treeParentCodeField">
                      <el-select v-model="formData.treeParentCodeField" placeholder="请选择" style="width: 100%">
                        <el-option v-for="col in columns" :key="col.columnName" :label="col.columnName" :value="col.columnName" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="树名称字段" prop="treeNameField">
                      <el-select v-model="formData.treeNameField" placeholder="请选择" style="width: 100%">
                        <el-option v-for="col in columns" :key="col.columnName" :label="col.columnName" :value="col.columnName" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="生成选项" name="options">
          <el-form label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="生成菜单">
                  <el-switch v-model="formData.generateMenu" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成控制器">
                  <el-switch v-model="options.generateController" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成 Service">
                  <el-switch v-model="options.generateService" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成 Mapper">
                  <el-switch v-model="options.generateMapper" />
                </form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成实体类">
                  <el-switch v-model="options.generateEntity" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成前端 API">
                  <el-switch v-model="formData.generateApi" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成前端页面">
                  <el-switch v-model="formData.generateView" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成 TypeScript">
                  <el-switch v-model="formData.generateTypeScript" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生成 SQL">
                  <el-switch v-model="options.generateSql" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-divider content-position="left">其他选项</el-divider>
          <el-form label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="前端框架">
                  <el-select v-model="options.frontendFramework" style="width: 100%">
                    <el-option label="Vue 3" value="vue3" />
                    <el-option label="Vue 2" value="vue2" />
                    <el-option label="React" value="react" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="UI 组件库">
                  <el-select v-model="options.uiFramework" style="width: 100%">
                    <el-option label="Element Plus" value="element-plus" />
                    <el-option label="Element UI" value="element-ui" />
                    <el-option label="Ant Design Vue" value="antd" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端框架">
                  <el-select v-model="options.backendFramework" style="width: 100%">
                    <el-option label="Spring Boot" value="spring-boot" />
                    <el-option label="Node.js" value="nodejs" />
                    <el-option label="Go" value="go" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="字段信息" name="columns">
          <div style="margin-bottom: 12px;">
            <el-button type="primary" size="small" :icon="Refresh" @click="handleSyncTable">同步字段</el-button>
            <el-button size="small" @click="toggleAllQuery">全选/反选查询</el-button>
            <el-button size="small" @click="toggleAllDisplay">全选/反选显示</el-button>
          </div>
          <el-table :data="columns" border stripe max-height="500">
            <el-table-column label="字段名称" prop="columnName" width="150" align="center" fixed />
            <el-table-column label="字段描述" min-width="140" align="center">
              <template #default="{ row }">
                <el-input v-model="row.columnComment" size="small" placeholder="字段描述" />
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="dataType" width="100" align="center" />
            <el-table-column label="Java 类型" width="130" align="center">
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
                  <el-option label="LocalDate" value="LocalDate" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Java 字段名" width="140" align="center">
              <template #default="{ row }">
                <el-input v-model="row.javaField" size="small" placeholder="Java 字段名" />
              </template>
            </el-table-column>
            <el-table-column label="主键" prop="isPK" width="70" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.isPK" type="danger" size="small">PK</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="必填" width="70" align="center">
              <template #default="{ row }">
                <el-tag :type="row.isNullable === 'NO' ? 'warning' : 'success'" size="small">
                  {{ row.isNullable === 'NO' ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="查询" width="70" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.isQuery" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="查询方式" width="110" align="center">
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
            <el-table-column label="列表显示" width="90" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.isDisplay" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="表单显示" width="90" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.isForm" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="显示类型" width="120" align="center">
              <template #default="{ row }">
                <el-select v-model="row.displayType" size="small" style="width: 100%" :disabled="!row.isDisplay && !row.isForm">
                  <el-option label="文本框" value="input" />
                  <el-option label="下拉框" value="select" />
                  <el-option label="单选框" value="radio" />
                  <el-option label="复选框" value="checkbox" />
                  <el-option label="日期" value="date" />
                  <el-option label="日期时间" value="datetime" />
                  <el-option label="时间" value="time" />
                  <el-option label="文本域" value="textarea" />
                  <el-option label="富文本" value="editor" />
                  <el-option label="图片上传" value="image" />
                  <el-option label="文件上传" value="file" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="字典类型" width="130" align="center">
              <template #default="{ row }">
                <el-input v-model="row.dictType" size="small" placeholder="字典类型" />
              </template>
            </el-table-column>
            <el-table-column v-if="columns.some(c => c.isPK)" label="主键策略" width="100" align="center">
              <template #default="{ row }">
                <el-select v-model="row.idType" size="small" style="width: 100%">
                  <el-option label="自增" value="AUTO" />
                  <el-option label="UUID" value="UUID" />
                  <el-option label="输入" value="INPUT" />
                  <el-option label="无" value="NONE" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" :icon="View" @click="handlePreview">预览代码</el-button>
      <el-button type="success" :icon="Download" @click="handleGenerate">生成代码</el-button>
      <el-button @click="handleBack">返回</el-button>
    </div>

    <GenPreview v-model="previewVisible" :table-name="formData.tableName" :config="formData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, View, Download, Check } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IGenConfig, IGenColumn } from '@yunshu/shared'
import { getGenConfig, saveGenConfig, syncTable, downloadCode } from '@/api/tool/gen.api'
import GenPreview from './GenPreview.vue'

const route = useRoute()
const router = useRouter()

const baseFormRef = ref<FormInstance>()
const previewVisible = ref(false)
const activeTab = ref('basic')

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
  businessName: '',
  functionName: ''
})

const options = reactive({
  generateController: true,
  generateService: true,
  generateMapper: true,
  generateEntity: true,
  generateSql: true,
  frontendFramework: 'vue3',
  uiFramework: 'element-plus',
  backendFramework: 'spring-boot'
})

const columns = ref<(IGenColumn & { isQuery?: boolean; isDisplay?: boolean; isForm?: boolean })[]>([])

const baseRules: FormRules = {
  className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
  packageName: [{ required: true, message: '请输入包名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  businessName: [{ required: true, message: '请输入业务名称', trigger: 'blur' }],
  functionName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }]
}

const formatClassName = (tableName: string): string => {
  return tableName
    .replace(/^sys_|^biz_|^t_/, '')
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

const formatBusinessName = (tableName: string): string => {
  return tableName
    .replace(/^sys_|^biz_|^t_/, '')
    .split('_')
    .join('-')
    .toLowerCase()
}

const loadConfig = async () => {
  const tableName = route.query.tableName as string
  if (!tableName) {
    ElMessage.error('缺少表名称参数')
    return
  }

  try {
    const res = await getGenConfig(tableName) as { success: boolean; data: { config: IGenConfig; columns: IGenColumn[] } | null }
    if (res.success && res.data) {
      const { config, columns: colsData } = res.data
      Object.assign(formData, config)
      columns.value = colsData.map((col: IGenColumn) => ({
        ...col,
        isQuery: !!col.queryType,
        isDisplay: !col.isPK,
        isForm: !col.isPK
      }))

      if (!formData.className) {
        formData.className = formatClassName(tableName)
      }
      if (!formData.businessName) {
        formData.businessName = formatBusinessName(tableName)
      }
      if (!formData.functionName) {
        formData.functionName = formData.tableComment || formData.className + '管理'
      }
    }
  } catch {
    ElMessage.error('获取配置失败')
  }
}

const handleSave = async () => {
  try {
    await baseFormRef.value?.validate()
    await saveGenConfig({
      ...formData,
      columns: columns.value.map(col => ({
        ...col,
        queryType: col.isQuery ? col.queryType : undefined
      }))
    })
    ElMessage.success('保存成功')
  } catch {
  }
}

const handleSyncTable = async () => {
  try {
    await ElMessageBox.confirm('同步字段将覆盖当前字段配置，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await syncTable(formData.tableName)
    if (res.success && res.data) {
      columns.value = res.data.map((col: IGenColumn) => ({
        ...col,
        isQuery: !!col.queryType,
        isDisplay: !col.isPK,
        isForm: !col.isPK
      }))
      ElMessage.success('同步成功')
    }
  } catch {
  }
}

const toggleAllQuery = () => {
  const allSelected = columns.value.every(col => col.isQuery)
  columns.value.forEach(col => {
    if (!col.isPK) {
      col.isQuery = !allSelected
    }
  })
}

const toggleAllDisplay = () => {
  const allSelected = columns.value.every((col: IGenColumn & { isQuery?: boolean; isDisplay?: boolean; isForm?: boolean }) => col.isDisplay)
  columns.value.forEach((col: IGenColumn & { isQuery?: boolean; isDisplay?: boolean; isForm?: boolean }) => {
    if (!col.isPK) {
      col.isDisplay = !allSelected
      col.isForm = !allSelected
    }
  })
}

const handlePreview = () => {
  previewVisible.value = true
}

const handleGenerate = async () => {
  try {
    await handleSave()
    await downloadCode(formData.tableName, formData)
    ElMessage.success('代码已生成，正在下载...')
  } catch {
    ElMessage.error('生成失败')
  }
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
  padding: 16px;

  .config-card {
    :deep(.el-tabs__content) {
      padding-top: 20px;
    }
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 24px 16px;
    background: #fff;
    border-radius: 4px;
    margin-top: 16px;
  }
}
</style>

