<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑文档' : '新增文档'"
    width="900px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="文档标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文档标题" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文档分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%;">
              <el-option
                v-for="category in categoryList"
                :key="category.categoryId"
                :label="category.categoryName"
                :value="category.categoryId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio value="0">发布</el-radio>
              <el-radio value="1">草稿</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="标签" prop="tags">
        <el-input v-model="formData.tags" placeholder="请输入标签，多个标签用逗号分隔" />
      </el-form-item>

      <el-form-item label="摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          type="textarea"
          placeholder="请输入文档摘要"
          :rows="2"
        />
      </el-form-item>

      <el-form-item label="文档内容" prop="content">
        <div class="editor-wrapper">
          <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
            style="border-bottom: 1px solid #ccc; z-index: 100;"
          />
          <Editor
            v-model="formData.content"
            :defaultConfig="editorConfig"
            mode="default"
            style="height: 400px; overflow-y: hidden;"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="可见性" prop="visible">
            <el-radio-group v-model="formData.visible">
              <el-radio value="0">公开</el-radio>
              <el-radio value="1">私有</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="0" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import {
  addKnowledge,
  updateKnowledge,
  getCategoryList,
  type KnowledgeInfo,
  type KnowledgeForm as KnowledgeFormType
} from '@/api/system/knowledge.api'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

interface Props {
  modelValue: boolean
  knowledgeData?: KnowledgeInfo | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.knowledgeData?.knowledgeId)

// 状态
const formRef = ref<FormInstance>()
const submitting = ref(false)
const editorRef = ref<IDomEditor | null>(null)
const categoryList = ref<any[]>([])

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: []
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入文档内容...',
  MENU_CONF: {}
}

// 表单数据
const formData = ref<KnowledgeFormType>({
  title: '',
  categoryId: undefined,
  categoryName: '',
  content: '',
  summary: '',
  coverUrl: '',
  tags: '',
  status: '0',
  visible: '0',
  sort: 0,
  remark: ''
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文档标题', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文档分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文档内容', trigger: 'blur' }
  ]
}

// 获取分类列表
async function fetchCategoryList() {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data || []
  } catch (error) {
    console.error('获取分类列表失败', error)
  }
}

// 填充表单数据
function fillFormData() {
  if (props.knowledgeData) {
    formData.value = {
      knowledgeId: props.knowledgeData.knowledgeId,
      title: props.knowledgeData.title,
      categoryId: props.knowledgeData.categoryId,
      categoryName: props.knowledgeData.categoryName,
      content: props.knowledgeData.content,
      summary: props.knowledgeData.summary,
      coverUrl: props.knowledgeData.coverUrl,
      tags: props.knowledgeData.tags,
      status: props.knowledgeData.status,
      visible: props.knowledgeData.visible,
      sort: props.knowledgeData.sort,
      remark: props.knowledgeData.remark
    }
  } else {
    formData.value = {
      title: '',
      categoryId: undefined,
      categoryName: '',
      content: '',
      summary: '',
      coverUrl: '',
      tags: '',
      status: '0',
      visible: '0',
      sort: 0,
      remark: ''
    }
  }
}

// 编辑器创建
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true

    if (isEdit.value) {
      await updateKnowledge(formData.value)
      ElMessage.success('修改成功')
    } else {
      await addKnowledge(formData.value)
      ElMessage.success('新增成功')
    }

    emit('refresh')
    handleClose()
  } catch (error) {
    console.error('提交失败', error)
  } finally {
    submitting.value = false
  }
}

// 关闭弹窗
function handleClose() {
  formRef.value?.resetFields()
  // 销毁编辑器，防止内存泄漏
  if (editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = null
  }
  visible.value = false
}

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    fillFormData()
  }
})

// 初始化
onMounted(() => {
  fetchCategoryList()
})
</script>

<style scoped lang="scss">
.editor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
