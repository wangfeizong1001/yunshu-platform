<template>
  <el-dialog
    v-model="visible"
    :title="`字典数据 - ${dictType}`"
    width="900px"
    append-to-body
    @close="handleClose"
  >
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入字典标签/键值"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <div class="left">
        <el-button
          v-has-permi="['system:dict:add']"
          type="primary"
          :icon="Plus"
          @click="handleAdd"
        >
          新增
        </el-button>
        <el-button
          v-has-permi="['system:dict:export']"
          type="success"
          :icon="Download"
          @click="handleExport"
        >
          导出
        </el-button>
      </div>
      <div class="right">
        <el-button :icon="Refresh" circle @click="refreshTable" />
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="dictDataList"
      stripe
      border
      class="dict-data-table"
    >
      <el-table-column prop="dictCode" label="字典编码" width="100" />
      <el-table-column prop="dictSort" label="字典排序" width="100" />
      <el-table-column prop="dictLabel" label="字典标签" width="150" />
      <el-table-column prop="dictValue" label="字典键值" width="150" />
      <el-table-column prop="listClass" label="显示样式" width="120">
        <template #default="{ row }">
          <el-tag :type="getListClassType(row.listClass)">{{ row.listClass || '默认' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDefault" label="是否默认" width="100">
          <template #default="{ row }">
            <el-tag :type="getIsDefaultTagType(row.isDefault)">
              {{ getIsDefaultLabel(row.isDefault) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getDictStatusTagType(row.status)">
              {{ getDictStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-has-permi="['system:dict:edit']"
            link
            type="primary"
            @click="handleEdit(row as SysDictData)"
          >
            编辑
          </el-button>
          <el-button
            v-has-permi="['system:dict:remove']"
            link
            type="danger"
            @click="handleDelete(row as SysDictData)"
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

    <!-- 字典数据表单弹窗 -->
    <DictDataForm
      v-model="formVisible"
      :dict-data="currentDictData"
      :dict-type="dictType || ''"
      @refresh="handleQuery"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download } from '@element-plus/icons-vue'
import { getDictDataPage, deleteDictData, exportDictData } from '@/api/system/dict.api'
import type { SysDictData, SysDictDataQuery } from '@yunshu/shared'
import DictDataForm from './DictDataForm.vue'

interface Props {
  modelValue: boolean
  dictType?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ========== 状态常量（与后端约定字段值） ==========
const IS_DEFAULT_YES = '1'
const DICT_STATUS_NORMAL = '0'

/** 是否默认 tag 类型 */
const getIsDefaultTagType = (val: string) => (val === IS_DEFAULT_YES ? 'success' : 'info')

/** 是否默认文本 */
const getIsDefaultLabel = (val: string) => (val === IS_DEFAULT_YES ? '是' : '否')

/** 字典数据状态 tag 类型 */
const getDictStatusTagType = (val: string) =>
  val === DICT_STATUS_NORMAL ? 'success' : 'danger'

/** 字典数据状态文本 */
const getDictStatusLabel = (val: string) =>
  val === DICT_STATUS_NORMAL ? '正常' : '停用'

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 字典类型
const dictType = computed(() => props.dictType || '')

// 状态
const loading = ref(false)
const dictDataList = ref<SysDictData[]>([])
const total = ref(0)
const formVisible = ref(false)
const currentDictData = ref<SysDictData | null>(null)

// 查询参数
const queryParams = reactive<SysDictDataQuery>({
  keyword: '',
  dictType: props.dictType || undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 获取显示样式类型
function getListClassType(listClass: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    default: 'info',
  }
  return typeMap[listClass] || 'info'
}

// 加载字典数据列表
async function fetchDictDataList() {
  if (!props.dictType) return

  loading.value = true
  try {
    queryParams.dictType = props.dictType
    const res = await getDictDataPage(queryParams) as { rows: SysDictData[]; total: number }
    dictDataList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  fetchDictDataList()
}

// 重置查询
function resetQuery() {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.pageNum = 1
  handleQuery()
}

// 刷新表格
function refreshTable() {
  fetchDictDataList()
}

// 新增
function handleAdd() {
  currentDictData.value = null
  formVisible.value = true
}

// 编辑
function handleEdit(row: SysDictData) {
  currentDictData.value = { ...row }
  formVisible.value = true
}

// 删除
async function handleDelete(row: SysDictData) {
  try {
    await ElMessageBox.confirm(`是否确认删除字典数据"${row.dictLabel}"？`, '提示', {
      type: 'warning',
    })
    await deleteDictData(row.dictCode)
    ElMessage.success('删除成功')
    fetchDictDataList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

// 导出
async function handleExport() {
  try {
    await exportDictData(props.dictType || '')
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
  }
}

// 关闭弹窗
function handleClose() {
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fetchDictDataList()
  }
})
</script>

<style scoped lang="scss">
.search-card {
  margin-bottom: 16px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dict-data-table {
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
